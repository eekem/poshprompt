import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: challengeId } = await params;
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Get all models for this challenge with their total strength
    const allModels = await prisma.build.groupBy({
      by: ['userId'],
      where: {
        challengeId: challengeId
      },
      _sum: {
        strength: true
      },
      orderBy: {
        _sum: {
          strength: 'desc'
        }
      }
    });

    // Find user's rank
    const userModelIndex = allModels.findIndex(model => model.userId === userId);
    const userRank = userModelIndex !== -1 ? userModelIndex + 1 : null;
    const userTotalStrength = userModelIndex !== -1 ? allModels[userModelIndex]._sum.strength || 0 : 0;
    const totalParticipants = allModels.length;

    // Calculate percentile
    const percentile = userRank ? ((totalParticipants - userRank) / totalParticipants) * 100 : 0;

    // Get challenge prizes for this challenge
    const prizes = await prisma.challengePrizes.findMany({
      where: {
        challengeId: challengeId
      },
      orderBy: {
        position: 'asc'
      }
    });

    // Determine user's prize based on rank
    let userPrize = 0;
    if (userRank) {
      const prize = prizes.find(p => p.position === userRank);
      userPrize = prize?.amount || 0;
    }

    // Determine tier based on percentile
    const tier = getTierFromPercentile(percentile);

    return NextResponse.json({
      success: true,
      rank: userRank,
      totalStrength: userTotalStrength,
      totalParticipants,
      percentile,
      prize: userPrize,
      tier,
      isRewardEligible: userPrize > 0,
      prizes: prizes.map(p => ({
        position: p.position,
        amount: p.amount
      }))
    });

  } catch (error) {
    console.error('Error fetching model rank:', error);
    return NextResponse.json(
      { error: 'Failed to fetch model rank' },
      { status: 500 }
    );
  }
}

function getTierFromPercentile(percentile: number): string {
  if (percentile >= 90) return 'Elite';
  if (percentile >= 70) return 'Advanced';
  if (percentile >= 40) return 'Skilled';
  return 'Rookie';
}
