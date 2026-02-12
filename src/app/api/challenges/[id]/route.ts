import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: challengeId } = await params;

    // Fetch challenge from database
    const challenge = await prisma.challenge.findUnique({
      where: { id: challengeId },
    });

    if (!challenge) {
      return NextResponse.json(
        { success: false, error: 'Challenge not found' },
        { status: 404 }
      );
    }

    const gameplay = typeof challenge.gameplay === 'object' && challenge.gameplay !== null ? challenge.gameplay : {};
    const task = typeof challenge.task === 'string' ? JSON.parse(challenge.task) : {};

    // Parse challenge data to match v2.0 structure
    const challengeData = {
      ...challenge,
      // Convert old database structure to new v2.0 frontend structure
      role: 'AI Assistant',
      description: challenge.description,
      training: {
        rounds: (gameplay as any).maxTurns || 5,
        maxWordsPerPrompt: 200,
        timePerRound: (gameplay as any).timeLimitSeconds || 300,
        constraints: {
          required: (task as any).constraints?.required || [],
          forbidden: (task as any).constraints?.forbidden || [],
          optional: (task as any).constraints?.optional || []
        }
      },
      stressTest: {
        numCases: 5,
        testTypes: ['adversarial', 'edge_case', 'contradictory']
      },
      scoring: challenge.scoring || {
        totalScore: 100,
        passingScore: 70,
        breakdown: {
          consistency: 30,
          output_quality: 25,
          robustness: 25,
          creativity: 10,
          brevity: 10
        }
      },
      rewards: challenge.rewards || {
        base_xp: 50,
        base_coins: 10
      },
      estimatedTime: 25,
      prerequisites: [],
      learningObjectives: []
    };

    return NextResponse.json({
      success: true,
      challenge: challengeData
    });

  } catch (error) {
    console.error('Error fetching challenge:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
