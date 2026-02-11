import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/app/lib/auth';
import { prisma } from '@/app/lib/prisma';
import crypto from 'crypto';

interface FingerprintData {
  userAgent?: string;
  device?: string;
  browser?: string;
  os?: string;
  screen?: string;
  timezone?: string;
  language?: string;
}

function generateFingerprint(data: FingerprintData & { ip?: string }): string {
  const fingerprintString = [
    data.userAgent || '',
    data.ip || '',
    data.device || '',
    data.browser || '',
    data.os || '',
    data.screen || '',
    data.timezone || '',
    data.language || ''
  ].join('|');
  
  return crypto.createHash('sha256').update(fingerprintString).digest('hex');
}

export async function POST(request: NextRequest) {
  try {
    const { email, password, fingerprintData } = await request.json();
    
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Get client IP
    const forwarded = request.headers.get('x-forwarded-for');
    const realIp = request.headers.get('x-real-ip');
    const ip = forwarded ? forwarded.split(',')[0] : (realIp || 'unknown');

    // Generate fingerprint
    const fingerprint = generateFingerprint({
      ...fingerprintData,
      ip
    });

    // Authenticate user using better-auth
    const authResponse = await fetch(`${process.env.BETTER_AUTH_URL}/sign-in`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    if (!authResponse.ok) {
      const errorData = await authResponse.json();
      return NextResponse.json(
        { error: errorData.message || 'Login failed' },
        { status: authResponse.status }
      );
    }

    const { user, session } = await authResponse.json();

    // Check if this fingerprint exists for this user
    const existingFingerprint = await prisma.userFingerprint.findFirst({
      where: {
        userId: user.id,
        fingerprint,
      },
    });

    if (existingFingerprint) {
      // Update last seen timestamp
      await prisma.userFingerprint.update({
        where: { id: existingFingerprint.id },
        data: {
          lastSeen: new Date(),
          ip,
          userAgent: fingerprintData?.userAgent,
        },
      });
    } else {
      // Check if this fingerprint is used by another user (potential fraud)
      const fingerprintUsedByOthers = await prisma.userFingerprint.findFirst({
        where: {
          fingerprint,
          userId: { not: user.id },
        },
        include: {
          user: true,
        },
      });

      if (fingerprintUsedByOthers) {
        console.warn(`Suspicious login: Fingerprint ${fingerprint} used by multiple users: ${user.email} and ${fingerprintUsedByOthers.user.email}`);
        
        // You might want to implement additional security measures here:
        // - Send email notification
        // - Require additional verification
        // - Temporarily lock account
      }

      // Store new fingerprint
      await prisma.userFingerprint.create({
        data: {
          userId: user.id,
          fingerprint,
          userAgent: fingerprintData?.userAgent,
          ip,
          device: fingerprintData?.device,
          browser: fingerprintData?.browser,
          os: fingerprintData?.os,
          screen: fingerprintData?.screen,
          timezone: fingerprintData?.timezone,
          language: fingerprintData?.language,
          isTrusted: !fingerprintUsedByOthers, // Trust if this is a new fingerprint
        },
      });
    }

    return NextResponse.json({
      success: true,
      user,
      session,
    });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
