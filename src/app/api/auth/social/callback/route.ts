import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/app/lib/auth';
import { prisma } from '@/app/lib/prisma';

interface FingerprintData {
  fingerprint: string;
  fingerprintData: {
    userAgent?: string;
    ip?: string;
    device?: string;
    browser?: string;
    os?: string;
    screen?: string;
    timezone?: string;
    language?: string;
  };
}

export async function GET(request: NextRequest) {
  try {
    // Get fingerprint data from cookie
    const cookieHeader = request.headers.get('cookie');
    let fingerprintData: FingerprintData | null = null;
    
    if (cookieHeader) {
      const cookies = cookieHeader.split(';').reduce((acc, cookie) => {
        const [key, value] = cookie.trim().split('=');
        acc[key] = value;
        return acc;
      }, {} as Record<string, string>);
      
      if (cookies.fp_data) {
        try {
          fingerprintData = JSON.parse(decodeURIComponent(cookies.fp_data));
        } catch (error) {
          console.error('Failed to parse fingerprint cookie:', error);
        }
      }
    }

    // Get the user from better-auth session
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // If we have fingerprint data, store it
    if (fingerprintData) {
      // Check if this fingerprint exists for this user
      const existingFingerprint = await prisma.userFingerprint.findFirst({
        where: {
          userId: session.user.id,
          fingerprint: fingerprintData.fingerprint,
        },
      });

      if (existingFingerprint) {
        // Update last seen timestamp
        await prisma.userFingerprint.update({
          where: { id: existingFingerprint.id },
          data: {
            lastSeen: new Date(),
            ip: fingerprintData.fingerprintData.ip,
            userAgent: fingerprintData.fingerprintData.userAgent,
          },
        });
      } else {
        // Check if this fingerprint is used by another user (potential fraud)
        const fingerprintUsedByOthers = await prisma.userFingerprint.findFirst({
          where: {
            fingerprint: fingerprintData.fingerprint,
            userId: { not: session.user.id },
          },
          include: {
            user: true,
          },
        });

        if (fingerprintUsedByOthers) {
          console.warn(`Suspicious social login: Fingerprint ${fingerprintData.fingerprint} used by multiple users: ${session.user.email} and ${fingerprintUsedByOthers.user.email}`);
        }

        // Store new fingerprint
        await prisma.userFingerprint.create({
          data: {
            userId: session.user.id,
            fingerprint: fingerprintData.fingerprint,
            userAgent: fingerprintData.fingerprintData.userAgent,
            ip: fingerprintData.fingerprintData.ip,
            device: fingerprintData.fingerprintData.device,
            browser: fingerprintData.fingerprintData.browser,
            os: fingerprintData.fingerprintData.os,
            screen: fingerprintData.fingerprintData.screen,
            timezone: fingerprintData.fingerprintData.timezone,
            language: fingerprintData.fingerprintData.language,
            isTrusted: !fingerprintUsedByOthers, // Trust if this is a new fingerprint
          },
        });
      }
    }

    // Clear the fingerprint cookie
    const response = NextResponse.redirect(new URL('/challenge', request.url));
    response.cookies.delete('fp_data');
    
    return response;

  } catch (error) {
    console.error('Social auth callback error:', error);
    return NextResponse.redirect(new URL('/login?error=social_auth_failed', request.url));
  }
}
