import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    // Fetch all challenges from the database
    const challenges = await prisma.challenge.findMany({
      select: {
        id: true,
        title: true,
        description: true,
        difficulty: true,
        gameType: true,
        task: true,
        rewards: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    // Transform the data to match the frontend interface
    const transformedChallenges = challenges.map(challenge => {
      const taskData = typeof challenge.task === 'string' 
        ? JSON.parse(challenge.task)
        : challenge.task;

      return {
        id: challenge.id,
        title: taskData.title || challenge.title,
        description: taskData.description || challenge.description,
        difficulty: challenge.difficulty,
        gameType: challenge.gameType,
        estimatedTime: taskData.gameplay?.timeLimitSeconds || 300,
        rewards: challenge.rewards || { xp: 50, coins: 25 },
      };
    });

    return NextResponse.json({
      success: true,
      challenges: transformedChallenges,
    });

  } catch (error) {
    console.error('Error fetching challenges:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch challenges',
        challenges: [],
      },
      { status: 500 }
    );
  }
}
