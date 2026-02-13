import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: challengeId } = await params;

    // Fetch challenge
    const challenge = await prisma.challenge.findUnique({
      where: { id: challengeId }
    });

    if (!challenge) {
      return NextResponse.json(
        { error: 'Challenge not found' },
        { status: 404 }
      );
    }

    // Transform the data to match the expected format
    const transformedChallenge = {
      id: challenge.id,
      title: challenge.title,
      description: challenge.description,
      version: challenge.version,
      isActive: challenge.isActive,
      isFeatured: challenge.isFeatured,
      rewardZoneType: challenge.rewardZoneType,
      rewardZoneValue: challenge.rewardZoneValue,
      totalPrizePool: challenge.totalPrizePool
    };

    return NextResponse.json({
      success: true,
      challenge: transformedChallenge
    });

  } catch (error) {
    console.error('Error fetching challenge:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
