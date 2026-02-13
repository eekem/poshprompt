import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Get user's current stats
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { 
        prompts: true,
        earnedXps: true,
        earnedBalance: true
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Get total challenges count (unique challenge IDs from mini models)
    const totalChallengesResult = await prisma.miniModel.findMany({
      where: {
        userId: userId,
      },
      select: {
        challengeId: true,
      },
      distinct: ['challengeId'],
    });

    // Get ongoing challenges (mini models with low scores - assuming ongoing)
    const ongoingChallengesResult = await prisma.miniModel.count({
      where: {
        userId: userId,
        finalScore: {
          lt: 70, // Consider scores below 70 as ongoing/incomplete
        },
      },
    });

    const stats = {
      totalCertification: user.earnedBalance,
      totalChallenges: totalChallengesResult.length,
      ongoingChallenges: ongoingChallengesResult,
      totalPrompts: user.prompts,
      tokenBalance: user.earnedBalance,
    };

    return NextResponse.json(stats);

  } catch (error) {
    console.error('Error fetching user stats:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch user stats',
        totalCertification: 0,
        totalChallenges: 0,
        ongoingChallenges: 0,
        totalPrompts: 0,
        tokenBalance: 0.0,
      },
      { status: 500 }
    );
  }
}
