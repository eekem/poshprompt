import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Find the most recent verification token for this email
    const verification = await prisma.verification.findFirst({
      where: {
        identifier: `email-verification-otp-${email}`,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (!verification) {
      return NextResponse.json({ 
        expired: true,
        message: 'No verification token found' 
      });
    }

    const now = new Date();
    const expiresAt = new Date(verification.expiresAt);
    const isExpired = now > expiresAt;
    
    // Calculate remaining time in seconds
    const remainingTime = isExpired ? 0 : Math.floor((expiresAt.getTime() - now.getTime()) / 1000);

    return NextResponse.json({
      expired: isExpired,
      remainingTime,
      expiresAt: verification.expiresAt,
      createdAt: verification.createdAt,
    });

  } catch (error) {
    console.error('Error checking verification expiry:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
