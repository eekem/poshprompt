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

    // Fetch user's mini models
    const userModels = await prisma.miniModel.findMany({
      where: {
        userId: userId,
      },
      include: {
        challenge: {
          select: {
            id: true,
            title: true,
            difficulty: true,
            task: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Transform data
    const transformedModels = userModels.map(model => {
      const taskData = typeof model.challenge.task === 'string' 
        ? JSON.parse(model.challenge.task)
        : model.challenge.task;

      return {
        id: model.id,
        title: model.title,
        description: model.description,
        image: model.image,
        systemPrompt: model.systemPrompt,
        finalScore: model.finalScore,
        robustnessScore: model.robustnessScore,
        totalXp: model.totalXp,
        coinsEarned: model.coinsEarned,
        isPublic: model.isPublic,
        isPublished: model.isPublished,
        publishedAt: model.publishedAt,
        tier: model.tier,
        percentile: model.percentile,
        isRewardEligible: model.isRewardEligible,
        createdAt: model.createdAt,
        updatedAt: model.updatedAt,
        challenge: {
          id: model.challenge.id,
          title: model.challenge.title,
          difficulty: model.challenge.difficulty,
          gameType: taskData?.gameType || 'text', // Extract from task data or default to 'text'
        },
      };
    });

    return NextResponse.json({
      success: true,
      models: transformedModels,
    });

  } catch (error) {
    console.error('Error fetching user models:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch user models',
        models: [],
      },
      { status: 500 }
    );
  }
}
