import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Fetch user's mini models with their associated challenges
    const userModels = await prisma.miniModel.findMany({
      where: {
        userId: userId,
      },
      include: {
        challenge: {
          select: {
            id: true,
            title: true,
            description: true,
            difficulty: true,
            task: true,
            rewards: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Transform data to match frontend interface
    const transformedUserChallenges = userModels.map(model => {
      const challenge = model.challenge;
      const taskData = typeof challenge?.task === 'string' 
        ? JSON.parse(challenge.task)
        : challenge?.task;

      return {
        id: challenge.id,
        title: taskData?.title || challenge?.title,
        description: taskData?.description || challenge?.description,
        difficulty: challenge?.difficulty,
        gameType: taskData?.gameType || 'text', // Extract from task data or default to 'text'
        estimatedTime: taskData?.gameplay?.timeLimitSeconds || 300,
        rewards: {
          certification: taskData?.rewards?.base_xp || 50,
          tokens: taskData?.rewards?.base_coins || 25,
        },
        userModel: {
          id: model.id,
          title: model.title,
          description: model.description,
          finalScore: model.finalScore,
          robustnessScore: model.robustnessScore,
          totalXp: model.totalXp,
          coinsEarned: model.coinsEarned,
          tier: model.tier,
          percentile: model.percentile,
          createdAt: model.createdAt,
        },
      };
    });

    return NextResponse.json({
      success: true,
      userChallenges: transformedUserChallenges,
    });

  } catch (error) {
    console.error('Error fetching user challenges:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch user challenges',
        userChallenges: [],
      },
      { status: 500 }
    );
  }
}
