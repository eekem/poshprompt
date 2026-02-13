import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import { ScoringService } from '@/lib/scoringService';

// V3 Scoring Engine (using mathematical operations)
const calculateV3Score = (
  selectedTools: string[],
  pointMap: any,
  selectedArchetype?: any
) => {
  // Import the scoring service method
  const { ScoringService } = require('@/lib/scoringService');
  return ScoringService.calculateV3Score(selectedTools, pointMap, selectedArchetype);
};

interface BuildRequest {
  sessionId: string;
  selectedToolSlugs: string[];
  selectedArchetype?: any; // V2: Selected archetype
}

interface BuildResponse {
  strength: number;
  newTotalStrength: number;
  remainingPrompts: number;
  // V3 response structure
  v3ScoringResult?: {
    finalStrength: number;
    featureBreakdown: any;
    penaltyBreakdown: any;
    operationResult: {
      formula: string;
      calculatedValue: number;
      toolOperations: Array<{
        toolSlug: string;
        operation: string;
        value: number;
        strength: number;
      }>;
    };
  };
}

// Auto-select strategy based on challenge goals
const selectOptimalStrategy = (challenge: any, archetypes: any[]) => {
  if (!challenge.goal || !archetypes || archetypes.length === 0) {
    return null;
  }
  
  // Analyze challenge goal to determine optimal strategy
  const goal = challenge.goal.toLowerCase();
  const difficulty = challenge.difficulty?.toLowerCase();
  
  // Strategy selection logic based on goal and difficulty
  if (goal.includes('stability') || goal.includes('reliable') || goal.includes('consistent')) {
    return archetypes.find(a => a.type === 'Guardian');
  }
  
  if (goal.includes('speed') || goal.includes('fast') || goal.includes('quick') || goal.includes('efficient')) {
    return archetypes.find(a => a.type === 'SpeedRunner');
  }
  
  if (goal.includes('creative') || goal.includes('innovative') || goal.includes('original')) {
    return archetypes.find(a => a.type === 'Creator');
  }
  
  // Fallback based on difficulty
  if (difficulty === 'beginner') {
    return archetypes.find(a => a.type === 'Guardian'); // Safe choice
  } else if (difficulty === 'advanced') {
    return archetypes.find(a => a.type === 'Creator'); // High potential
  }
  
  // Default to first available strategy
  return archetypes[0] || null;
};

// Update cumulative features
const updateCumulativeFeatures = async (
  userId: string, 
  challengeId: string, 
  currentBuildFeatures: any
) => {
  // Get existing model
  const existingModel = await prisma.miniModel.findFirst({
    where: { userId, challengeId }
  });
  
  let cumulativeFeatures = {
    robustness: 0,
    accuracy: 0,
    stability: 0,
    creativity: 0,
    efficiency: 0
  };
  
  // Load existing cumulative features
  if (existingModel && existingModel.cumulativeFeatures) {
    cumulativeFeatures = existingModel.cumulativeFeatures as any;
  }
  
  // Update with new build (weighted average approach)
  const buildWeight = 0.3; // Weight for new build
  const existingWeight = 0.7; // Weight for existing cumulative
  
  const updatedFeatures = {
    robustness: Math.round(
      existingWeight * cumulativeFeatures.robustness + 
      buildWeight * currentBuildFeatures.robustness
    ),
    accuracy: Math.round(
      existingWeight * cumulativeFeatures.accuracy + 
      buildWeight * currentBuildFeatures.accuracy
    ),
    stability: Math.round(
      existingWeight * cumulativeFeatures.stability + 
      buildWeight * currentBuildFeatures.stability
    ),
    creativity: Math.round(
      existingWeight * cumulativeFeatures.creativity + 
      buildWeight * currentBuildFeatures.creativity
    ),
    efficiency: Math.round(
      existingWeight * cumulativeFeatures.efficiency + 
      buildWeight * currentBuildFeatures.efficiency
    )
  };
  
  // Update or create model with cumulative features
  const existingRecord = await prisma.miniModel.findFirst({
    where: { userId, challengeId }
  });
  
  if (existingRecord) {
    await prisma.miniModel.update({
      where: { id: existingRecord.id },
      data: {
        cumulativeFeatures: updatedFeatures
      }
    });
  } else {
    await prisma.miniModel.create({
      data: {
        userId,
        challengeId,
        sessionId: '',
        title: 'AI Model',
        systemPrompt: '',
        finalScore: 0,
        robustnessScore: 0,
        totalXp: 0,
        coinsEarned: 0,
        cumulativeFeatures: updatedFeatures as any
      } as any
    });
  }
  
  return updatedFeatures;
};

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: challengeId } = await params;
    const body: BuildRequest = await request.json();
    const { sessionId, selectedToolSlugs, selectedArchetype: userSelectedArchetype } = body;

    // Validate input
    if (!sessionId || !selectedToolSlugs || !Array.isArray(selectedToolSlugs) || selectedToolSlugs.length === 0) {
      return NextResponse.json(
        { error: 'Must provide sessionId and select at least 1 tool' },
        { status: 400 }
      );
    }

    if (selectedToolSlugs.length > 25) {
      return NextResponse.json(
        { error: 'Cannot select more than 25 tools' },
        { status: 400 }
      );
    }

    // Check for duplicates
    const uniqueTools = new Set(selectedToolSlugs);
    if (uniqueTools.size !== selectedToolSlugs.length) {
      return NextResponse.json(
        { error: 'Cannot select duplicate tools' },
        { status: 400 }
      );
    }

    // Get user ID from request
    const userId = request.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json(
        { error: 'User not authenticated' },
        { status: 401 }
      );
    }

    // Fetch building session with related data
    const session = await prisma.buildingSession.findUnique({
      where: { id: sessionId },
      include: {
        categories: {
          include: {
            tools: true
          }
        },
        pointMap: true,
        challenge: true
      }
    });

    if (!session) {
      return NextResponse.json(
        { error: 'Building session not found' },
        { status: 404 }
      );
    }

    if (!session.isActive) {
      return NextResponse.json(
        { error: 'Building session is not active' },
        { status: 400 }
      );
    }

    if (session.challengeId !== challengeId) {
      return NextResponse.json(
        { error: 'Session does not belong to this challenge' },
        { status: 400 }
      );
    }

    if (session.userId !== userId) {
      return NextResponse.json(
        { error: 'Session does not belong to this user' },
        { status: 403 }
      );
    }

    if (!session.pointMap || !session.pointMap.v2Data) {
      return NextResponse.json(
        { error: 'Session pointMap data not configured' },
        { status: 400 }
      );
    }

    // Get selected tools with their categories
    const allTools = session.categories.flatMap(cat => cat.tools);
    const selectedTools = allTools.filter(tool => selectedToolSlugs.includes(tool.slug));

    if (selectedTools.length !== selectedToolSlugs.length) {
      return NextResponse.json(
        { error: 'Some selected tools not found' },
        { status: 400 }
      );
    }

    // Calculate total prompt cost using pointMap data
    const pointMap = session.pointMap.v2Data as any;
    const totalPromptCost = selectedToolSlugs.reduce((sum, toolSlug) => {
      const tool = pointMap.tools.find((t: any) => t.slug === toolSlug);
      return sum + (tool?.prompt_cost || 0);
    }, 0);

    // Check user's prompt credits
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { prompts: true }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    if (user.prompts < totalPromptCost) {
      return NextResponse.json(
        { error: 'Insufficient prompt credits' },
        { status: 402 }
      );
    }

    // Auto-select strategy based on challenge goals
    const optimalStrategy = selectOptimalStrategy(session.challenge, pointMap.archetypes || []);
    const selectedArchetype = userSelectedArchetype || optimalStrategy;

    // Calculate strength using V3 scoring service
    const scoringResult = ScoringService.calculateV3Score(selectedToolSlugs, pointMap, selectedArchetype);
    const finalStrength = scoringResult.finalStrength;

    // Deduct prompt credits
    await prisma.user.update({
      where: { id: userId },
      data: {
        prompts: { decrement: totalPromptCost }
      }
    });

    // Update cumulative features
    await updateCumulativeFeatures(userId, challengeId, scoringResult.featureBreakdown);
    
    // Save build record with v2 data
    await prisma.build.create({
      data: {
        userId,
        challengeId,
        sessionId,
        selectedTools: selectedToolSlugs,
        strength: finalStrength,
        v2ScoringResult: scoringResult as any,
        selectedArchetype: selectedArchetype || null
      }
    });

    // Close the session after build
    await prisma.buildingSession.update({
      where: { id: sessionId },
      data: {
        isActive: false,
        updatedAt: new Date()
      }
    });

    // Calculate user's total strength (sum of all their builds for this challenge)
    const userBuilds = await prisma.build.findMany({
      where: {
        userId,
        challengeId
      },
      select: { strength: true }
    });

    const newTotalStrength = userBuilds.reduce((sum, build) => sum + build.strength, 0);

    // Get remaining credits after deduction
    const updatedUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { prompts: true }
    });

    const response: BuildResponse = {
      strength: Math.round(finalStrength),
      newTotalStrength: Math.round(newTotalStrength),
      remainingPrompts: updatedUser?.prompts || 0,
      v3ScoringResult: scoringResult
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Error building challenge:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
