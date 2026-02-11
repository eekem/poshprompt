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

export async function GET(request: NextRequest, { params }: { params: Promise<{ provider: string }> }) {
  try {
    const { provider } = await params;
    
    // Get client IP
    const forwarded = request.headers.get('x-forwarded-for');
    const realIp = request.headers.get('x-real-ip');
    const ip = forwarded ? forwarded.split(',')[0] : (realIp || 'unknown');

    // Get fingerprint data from query params (sent from client)
    const { searchParams } = new URL(request.url);
    const fingerprintDataParam = searchParams.get('fingerprintData');
    
    let fingerprintData: FingerprintData = {};
    if (fingerprintDataParam) {
      try {
        fingerprintData = JSON.parse(decodeURIComponent(fingerprintDataParam));
      } catch (error) {
        console.error('Failed to parse fingerprint data:', error);
      }
    }

    // Generate fingerprint
    const fingerprint = generateFingerprint({
      ...fingerprintData,
      ip
    });

    // Store fingerprint data temporarily for the callback
    // We'll use a session or temporary storage to pass this to the callback
    const tempData = {
      fingerprint,
      fingerprintData: {
        ...fingerprintData,
        ip
      }
    };

    // For now, we'll redirect to better-auth's social auth
    // In a real implementation, you might want to handle the full flow here
    const authUrl = `${process.env.BETTER_AUTH_URL}/social-auth/${provider}`;
    
    // Store fingerprint data in a cookie or session for the callback
    const response = NextResponse.redirect(authUrl);
    
    // Store fingerprint data in a secure, http-only cookie
    response.cookies.set('fp_data', JSON.stringify(tempData), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 5, // 5 minutes
    });

    return response;

  } catch (error) {
    console.error('Social auth error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
