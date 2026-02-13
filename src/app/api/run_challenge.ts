import { NextRequest, NextResponse } from 'next/server';
import { Groq } from 'groq-sdk';
import { prisma } from '@/app/lib/prisma';

// Initialize Groq client
const groq = new Groq({
  apiKey: process.env.HUGGINGFACE_API_KEY
});

interface ChallengeRequest {
  userId: string;
  challengeId: string;
  prompt: string;
  sessionId?: string;
  turnNumber?: number;
  previousOutputs?: string[];
  phase?: 'training' | 'stress_test' | 'results';
  isBuildingTool?: boolean;
  toolData?: any;
}

interface StressTestRequest {
  sessionId: string;
  userId: string;
  systemPrompt: string;
  finalContext: string[];
}

interface ChallengeResponse {
  sessionId: string;
  output: string;
  score_text: string;
  breakdown: any;
  turnNumber: number;
  totalScore: number;
  earnedXp: number;
  remainingPrompts: number;
  phase?: 'training' | 'stress_test' | 'results';
  canProceedToStressTest?: boolean;
  trainingComplete?: boolean;
}

interface StressTestResponse {
  sessionId: string;
  miniModelId: string;
  overallScore: number;
  robustnessScore: number;
  grade: string;
  tier: string;
  percentile: number;
  isRewardEligible: boolean;
  rewardZoneMessage: string;
  results: any[];
  totalXp: number;
  coinsEarned: number;
  achievements: string[];
  canPublish: boolean;
}

// Main API route handler
export async function POST(request: NextRequest): Promise<NextResponse<ChallengeResponse | StressTestResponse | { error: string }>> {
  try {
    const body = await request.json();
    
    // Check if this is a stress test request
    if (body.phase === 'stress_test' && body.systemPrompt && body.finalContext) {
      const stressTestRequest: StressTestRequest = {
        sessionId: body.sessionId,
        userId: body.userId,
        systemPrompt: body.systemPrompt,
        finalContext: body.finalContext
      };
      
      const result = await runStressTest(stressTestRequest);
      return NextResponse.json(result);
    }

    // Regular training phase request
    const challengeRequest: ChallengeRequest = {
      userId: body.userId,
      challengeId: body.challengeId,
      prompt: body.prompt,
      sessionId: body.sessionId,
      turnNumber: body.turnNumber || 1,
      previousOutputs: body.previousOutputs || [],
      phase: body.phase || 'training',
      isBuildingTool: body.isBuildingTool || false,
      toolData: body.toolData
    };

    const { userId, challengeId, prompt, sessionId, turnNumber = 1, previousOutputs = [], isBuildingTool = false, toolData } = challengeRequest;

    // Validate input
    if (!userId || !challengeId || !prompt) {
      return NextResponse.json(
        { error: 'Missing required fields: userId, challengeId, prompt' },
        { status: 400 }
      );
    }

    // Check user's prompt count
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

    if (user.prompts <= 0) {
      return NextResponse.json(
        { error: 'Insufficient prompts. Please purchase more prompts to continue.' },
        { status: 402 }
      );
    }

    // Fetch challenge from database
    const challenge = await prisma.challenge.findUnique({
      where: { id: challengeId }
    });

    if (!challenge) {
      return NextResponse.json(
        { error: 'Challenge not found' },
        { status: 404 }
      );
    }

    // Parse challenge data
    const task = typeof challenge.task === 'string' ? JSON.parse(challenge.task) : {};
    const gameplay = typeof challenge.gameplay === 'object' && challenge.gameplay !== null ? challenge.gameplay : {};
    const scoring = typeof challenge.scoring === 'object' && challenge.scoring !== null ? challenge.scoring : {};

    const challengeData = {
      ...challenge,
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
      scoring: scoring || {
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
      rewards: (challenge.rewards as any) || {
        base_xp: 50,
        base_coins: 25
      }
    };

    // Get or create building session
    let session;
    if (sessionId) {
      session = await prisma.buildingSession.findUnique({
        where: { id: sessionId, userId }
      });
      
      if (!session) {
        return NextResponse.json(
          { error: 'Session not found' },
          { status: 404 }
        );
      }
    } else {
      // Create new session
      session = await prisma.buildingSession.create({
        data: {
          userId,
          challengeId,
        }
      });
    }

    // Validate turn number
    if (turnNumber > (challengeData.training.rounds || 5)) {
      return NextResponse.json(
        { error: 'Maximum turns exceeded' },
        { status: 400 }
      );
    }

    // Generate AI output
    const output = await generateOutput(session.id, prompt, challengeData, isBuildingTool, toolData);

    // Calculate score
    const { score, breakdown, score_text } = calculateScore(output, challengeData);

    // Ensure score is valid
    const validScore = isNaN(score) || score === null ? 0 : Math.round(score);

    // Calculate XP
    const baseXp = challengeData.rewards.base_xp || 0;
    let earnedXp: number;
    
    if (validScore < 70) {
      earnedXp = 0;
    } else {
      let calculatedXp = Math.round((validScore / 100) * baseXp);
      earnedXp = Math.min(calculatedXp, baseXp);
    }

    // Store session data (simplified - no message history)
    // In a full implementation, you'd want to store turn history in the session or a separate table

    // Determine if training is complete
    const trainingComplete = turnNumber >= (challengeData.training.rounds || 5);
    const canProceedToStressTest = trainingComplete && validScore >= ((scoring as any).passingScore || 70);

    // Deduct one prompt from user and update earnedXps
    await prisma.user.update({
      where: { id: userId },
      data: {
        prompts: { decrement: 1 },
        earnedXps: { increment: earnedXp }
      }
    });

    const response: ChallengeResponse = {
      sessionId: session.id,
      output,
      score_text,
      breakdown,
      turnNumber,
      totalScore: validScore, // Simplified - no accumulation across turns
      earnedXp,
      remainingPrompts: user.prompts - 1,
      phase: trainingComplete ? 'stress_test' : 'training',
      canProceedToStressTest,
      trainingComplete
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Error in run_challenge API:', error);
    return NextResponse.json(
      { error: `Internal server error: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
}

// Simplified scoring function
function calculateScore(
  output: string,
  challenge: any
): { score: number; breakdown: any; score_text: string } {
  const { training, scoring } = challenge;
  const { constraints } = training;
  const breakdown = {
    consistency: 0,
    output_quality: 0,
    robustness: 0,
    creativity: 0,
    brevity: 0,
  };

  let totalScore = 0;
  const feedback: string[] = [];

  // Check required constraints
  const requiredMet = constraints.required.filter((constraint: string) => 
    output.toLowerCase().includes(constraint.toLowerCase())
  ).length;
  
  const requiredScore = (requiredMet / constraints.required.length) * scoring.breakdown.consistency;
  breakdown.consistency = Math.round(requiredScore);
  totalScore += requiredScore;

  // Check forbidden constraints
  const forbiddenViolations = constraints.forbidden.filter((constraint: string) => 
    output.toLowerCase().includes(constraint.toLowerCase())
  ).length;
  
  if (forbiddenViolations > 0) {
    const penalty = (forbiddenViolations / constraints.forbidden.length) * scoring.breakdown.consistency * 0.5;
    breakdown.consistency = Math.max(0, breakdown.consistency - Math.round(penalty));
    totalScore -= penalty;
  }

  // Other scoring metrics (simplified)
  breakdown.output_quality = Math.round(scoring.breakdown.output_quality * 0.8);
  breakdown.creativity = Math.round(scoring.breakdown.creativity * 0.7);
  breakdown.robustness = Math.round(scoring.breakdown.robustness * 0.9);
  breakdown.brevity = Math.round(scoring.breakdown.brevity * 0.6);

  totalScore += Object.values(breakdown).reduce((sum, val) => sum + val, 0);

  const finalScore = Math.round(Math.min(totalScore, scoring.totalScore));
  const scoreText = `Score: ${finalScore}/${scoring.totalScore}. ${feedback.join('. ')}`;

  return {
    score: finalScore,
    breakdown,
    score_text: scoreText
  };
}

// Simplified output generation
async function generateOutput(
  sessionId: string,
  prompt: string,
  challenge: any,
  isBuildingTool: boolean = false,
  toolData?: any
): Promise<string> {
  const { training } = challenge;
  
  // Build context-aware prompt
  let fullPrompt = `You are a trained AI assistant. Use following context to guide your response:\n\n`;
  fullPrompt += `Role: ${challenge.role}\n`;
  fullPrompt += `Objective: ${challenge.description}\n`;
  fullPrompt += `Constraints:\n`;
  fullPrompt += `- Required: ${training.constraints.required.join(', ')}\n`;
  if (training.constraints.forbidden.length > 0) {
    fullPrompt += `- Forbidden: ${training.constraints.forbidden.join(', ')}\n`;
  }
  
  if (isBuildingTool && toolData) {
    fullPrompt += `\nBUILDING TOOL ACTIVATED: ${toolData.title}\n`;
    fullPrompt += `Tool Description: ${toolData.description}\n`;
    fullPrompt += `Focus on this specific training aspect while maintaining overall consistency.\n`;
  }
  
  fullPrompt += `\nCurrent user input: ${prompt}\n\n`;
  fullPrompt += `Generate response following your trained context:`;

  try {
    const response = await groq.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful AI assistant that has been trained through prompt engineering. Follow provided context precisely.'
        },
        {
          role: 'user',
          content: fullPrompt
        }
      ],
      max_tokens: 500,
      temperature: 0.7,
    });
    
    return response.choices[0]?.message?.content || 'No response generated';
  } catch (error) {
    console.error('Error generating output:', error);
    return `I understand your request: "${prompt}". As a trained AI, I'll respond following the established constraints and role.`;
  }
}

// Simplified stress test function
async function runStressTest(request: StressTestRequest): Promise<StressTestResponse> {
  const { sessionId, userId, systemPrompt, finalContext } = request;

  // Get session details
  const session = await prisma.buildingSession.findUnique({
    where: { id: sessionId, userId }
  });

  if (!session) {
    throw new Error('Session not found');
  }

  // Simplified stress test - in a real implementation, you'd run actual tests
  const robustnessScore = 85; // Mock score
  const percentile = 0.8; // Mock percentile
  
  // Calculate tier
  let tier = 'Bronze';
  if (percentile >= 0.95) tier = 'Platinum';
  else if (percentile >= 0.85) tier = 'Gold';
  else if (percentile >= 0.70) tier = 'Silver';

  // Create mini-model record
  const miniModel = await prisma.miniModel.create({
    data: {
      userId,
      challengeId: session.challengeId,
      sessionId: session.id,
      title: `Trained AI - ${session.challengeId}`,
      systemPrompt,
      finalScore: robustnessScore,
      robustnessScore,
      totalXp: Math.round(robustnessScore * 0.5),
      coinsEarned: Math.round(robustnessScore * 0.3),
      tier,
      percentile,
      isRewardEligible: robustnessScore >= 85,
      internalRank: Math.floor(percentile * 100) + 1
    }
  });

  return {
    sessionId,
    miniModelId: miniModel.id,
    overallScore: robustnessScore,
    robustnessScore,
    grade: robustnessScore >= 90 ? 'A' : robustnessScore >= 80 ? 'B' : 'C',
    tier,
    percentile,
    isRewardEligible: robustnessScore >= 85,
    rewardZoneMessage: robustnessScore >= 85 ? "🎉 Reward Eligible" : "Improve robustness to enter Reward Zone",
    results: [], // Would contain actual test results
    totalXp: miniModel.totalXp,
    coinsEarned: miniModel.coinsEarned,
    achievements: robustnessScore >= 85 ? ["High Performer"] : [],
    canPublish: robustnessScore >= 70
  };
}
