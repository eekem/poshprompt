import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/app/lib/auth';
import { prisma } from '@/app/lib/prisma';
import crypto from 'crypto';

interface FingerprintData {
  userAgent?: string;
  ip?: string;
  device?: string;
  browser?: string;
  os?: string;
  screen?: string;
  timezone?: string;
  language?: string;
}

function generateFingerprint(data: FingerprintData): string {
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
    const session = await auth.api.getSession({
      headers: request.headers,
    });
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { fingerprintData } = await request.json();
    const userEmail = session.user.email;

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { email: userEmail }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Credit user with signup prompts (only if not already credited)
    if (user.prompts === 0) {
      const signupPrompts = Number(process.env.SIGNUP_PROMPT) || 10;
      await prisma.user.update({
        where: { id: user.id },
        data: {
          prompts: signupPrompts,
        },
      });
      console.log(`Credited ${signupPrompts} prompts to new user ${user.email}`);
    }

    // Handle fingerprint if provided
    if (fingerprintData) {
      // Get client IP
      const forwarded = request.headers.get('x-forwarded-for');
      const realIp = request.headers.get('x-real-ip');
      const ip = forwarded ? forwarded.split(',')[0] : (realIp || 'unknown');

      // Generate fingerprint
      const fingerprint = generateFingerprint({
        ...fingerprintData,
        ip
      });

      // Check for suspicious activity - same fingerprint used by multiple accounts
      const existingFingerprintUsers = await prisma.userFingerprint.findMany({
        where: {
          fingerprint,
          user: {
            banned: false
          }
        },
        include: {
          user: true
        }
      });

      // Count how many different users have this fingerprint
      const uniqueUsersWithFingerprint = new Set(
        existingFingerprintUsers.map(fp => fp.userId)
      );

      // If more than one user has this fingerprint, it's suspicious
      if (uniqueUsersWithFingerprint.size > 1) {
        console.warn(`FRAUD DETECTED: Fingerprint ${fingerprint} used by multiple accounts:`, 
          existingFingerprintUsers.map(fp => fp.user.email));
        
        // Delete the current user's account for fraud
        await prisma.user.delete({
          where: { id: user.id }
        });
        
        console.log(`Deleted account ${user.email} due to fingerprint fraud detection`);
        
        return NextResponse.json({
          success: false,
          banned: true,
          error: 'Account flagged for suspicious activity'
        });
      }

      // Check if this fingerprint exists for this user
      const userFingerprint = await prisma.userFingerprint.findFirst({
        where: {
          userId: user.id,
          fingerprint,
        },
      });

      if (userFingerprint) {
        // Update last seen timestamp
        await prisma.userFingerprint.update({
          where: { id: userFingerprint.id },
          data: {
            lastSeen: new Date(),
            ip,
            userAgent: fingerprintData?.userAgent,
          },
        });
      } else {
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
            isTrusted: true, // New fingerprint for this user
          },
        });
      }
    }

    return NextResponse.json({
      success: true,
      prompts: user.prompts || Number(process.env.SIGNUP_PROMPT) || 10,
    });

  } catch (error) {
    console.error('Secure check error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
