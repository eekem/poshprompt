import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const challengeId = searchParams.get('challengeId');
    const userId = searchParams.get('userId');

    if (!challengeId) {
      return NextResponse.json(
        { error: 'Challenge ID is required' },
        { status: 400 }
      );
    }

    // Get leaderboard for this challenge
    let leaderboard = [];
    try {
      leaderboard = await prisma.chat.findMany({
        where: {
          challengeId: challengeId,
          isActive: true, // Only include completed challenges
        },
        select: {
          id: true,
          totalScore: true,
          earnedXp: true,
          currentTurn: true,
          createdAt: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
        },
        orderBy: {
          totalScore: 'desc',
        },
        take: 100, // Top 100 players
      });
    } catch (error) {
      console.error('Error fetching leaderboard data:', error);
      // Return empty leaderboard on error
      return NextResponse.json({
        leaderboard: [],
        userRank: null,
        userPrize: 0,
        totalParticipants: 0,
      });
    }

    // Get challenge prizes (with error handling)
    let prizes: Array<{ position: number; amount: number }> = [];
    try {
      prizes = await prisma.challengePrizes.findMany({
        orderBy: {
          position: 'asc',
        },
      });
    } catch (error) {
      console.warn('ChallengePrizes table not found or error fetching prizes:', error);
      // Continue without prizes
    }

    // Create a map of position to prize amount
    const prizeMap = new Map<number, number>();
    prizes.forEach(prize => {
      prizeMap.set(prize.position, prize.amount);
    });

    // Calculate user's rank if userId is provided
    let userRank = null;
    let userPrize = 0;
    if (userId) {
      const userEntry = leaderboard.findIndex(entry => entry.user.id === userId);
      if (userEntry !== -1) {
        userRank = userEntry + 1; // +1 because array is 0-indexed
        userPrize = prizeMap.get(userRank) || 0;
      }
    }

    // Format leaderboard with prizes
    const formattedLeaderboard = leaderboard.map((entry, index) => {
      const rank = index + 1;
      const prize = prizeMap.get(rank) || 0;
      
      return {
        rank,
        userId: entry.user.id,
        userName: entry.user.name || entry.user.email,
        userImage: entry.user.image,
        totalScore: entry.totalScore,
        earnedXp: entry.earnedXp,
        turns: entry.currentTurn,
        prize,
        completedAt: entry.createdAt,
      };
    });

    return NextResponse.json({
      leaderboard: formattedLeaderboard,
      userRank,
      userPrize,
      totalParticipants: leaderboard.length,
    });

  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return NextResponse.json(
      { error: 'Failed to fetch leaderboard' },
      { status: 500 }
    );
  }
}
