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
    const { email, password, name, fingerprintData } = await request.json();
    
    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Email, password, and name are required' },
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

    // Check for suspicious activity - same fingerprint used by multiple users
    const existingFingerprint = await prisma.userFingerprint.findFirst({
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

    if (existingFingerprint) {
      // Log suspicious activity but don't block yet
      console.warn(`Suspicious signup: Fingerprint ${fingerprint} already used by user ${existingFingerprint.user.email}`);
    }

    // Create user using better-auth
    const authResponse = await fetch(`${process.env.BETTER_AUTH_URL}/sign-up`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
        name,
      }),
    });

    if (!authResponse.ok) {
      const errorData = await authResponse.json();
      return NextResponse.json(
        { error: errorData.message || 'Signup failed' },
        { status: authResponse.status }
      );
    }

    const { user } = await authResponse.json();

    // Credit user with signup prompts
    const signupPrompts = parseInt(process.env.SIGNUP_PROMPT || "10");
    await prisma.user.update({
      where: { id: user.id },
      data: {
        prompts: signupPrompts,
      },
    });

    // Store fingerprint
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
        isTrusted: !existingFingerprint, // Trust if this is a new fingerprint
      },
    });

    console.log(`Credited ${signupPrompts} prompts to new user ${user.email}`);

    return NextResponse.json({
      success: true,
      user,
      prompts: signupPrompts,
    });

  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
