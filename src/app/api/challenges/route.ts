import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    console.log('Fetching challenges from database...');
    
    // Fetch all challenges from the database
    const challenges = await prisma.challenge.findMany({
      select: {
        id: true,
        title: true,
        description: true,
        difficulty: true,
        task: true,
        rewards: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    console.log(`Found ${challenges.length} challenges in database`);

    // Transform data to match frontend interface
    const transformedChallenges = challenges.map(challenge => {
      const taskData = typeof challenge.task === 'string' 
        ? JSON.parse(challenge.task)
        : challenge.task;

      return {
        id: challenge.id,
        title: taskData.title || challenge.title,
        description: taskData.description || challenge.description,
        difficulty: challenge.difficulty,
        gameType: taskData.gameType || 'text', // Extract from task data or default to 'text'
        estimatedTime: taskData.gameplay?.timeLimitSeconds || 300,
        task: {
          objective: taskData.objective || "",
          constraints: {
            required: taskData.constraints?.required || [],
            forbidden: taskData.constraints?.forbidden || [],
            optional: taskData.constraints?.optional || [],
          },
        },
        gameplay: {
          turnBased: taskData.gameplay?.turnBased || false,
          maxTurns: taskData.gameplay?.maxTurns,
          timeLimitSeconds: taskData.gameplay?.timeLimitSeconds || 300,
          scoringMode: taskData.gameplay?.scoringMode || "quality_score",
        },
        scoring: {
          totalScore: taskData.scoring?.totalScore || 100,
          passingScore: taskData.scoring?.passingScore || 70,
          breakdown: taskData.scoring?.breakdown || {
            consistency: 30,
            output_quality: 25,
            robustness: 25,
            creativity: 10,
            brevity: 10,
          },
        },
        rewards: {
          certification: taskData.rewards?.base_xp || 50,
          tokens: taskData.rewards?.base_coins || 25,
        },
      };
    });

    console.log(`Successfully transformed ${transformedChallenges.length} challenges`);

    return NextResponse.json({
      success: true,
      challenges: transformedChallenges,
    });

  } catch (error) {
    console.error('Error fetching challenges:', error);
    console.error('Error details:', error instanceof Error ? error.message : 'Unknown error');
    console.error('Stack trace:', error instanceof Error ? error.stack : 'No stack trace');
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
