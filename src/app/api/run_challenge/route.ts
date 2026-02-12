import { NextRequest, NextResponse } from 'next/server';
import { InferenceClient } from '@huggingface/inference';
import { prisma } from '@/app/lib/prisma';


// Initialize Hugging Face Inference Client
const hf = new InferenceClient(process.env.HUGGINGFACE_API_KEY);

// Type definitions based on the new schema
type GameType = 'mini_model_training' | 'image' | 'text' | 'transformation' | 'refinement' | 'evaluation';
type ScoringMode = 'robustness_score' | 'constraint_based' | 'quality_score' | 'refinement_score' | 'ranking';
type ModelType = 'image_generation' | 'text_generation';
type Difficulty = 'beginner' | 'intermediate' | 'advanced';
type TestType = 'adversarial' | 'edge_case' | 'contradictory' | 'extreme_constraint' | 'out_of_distribution' | 'safety_critical';

interface Challenge {
  id: string;
  title: string;
  description: string;
  gameType: GameType;
  difficulty: Difficulty;
  modelType: ModelType;
  modelName: string;
  task: {
    objective: string;
    constraints: {
      required: string[];
      forbidden: string[];
      optional: string[];
    };
  };
  gameplay: {
    turnBased: boolean;
    maxTurns?: number;
    timeLimitSeconds: number;
    scoringMode: ScoringMode;
  };
  scoring: {
    totalScore: number;
    passingScore: number;
    breakdown: {
      consistency: number;
      output_quality: number;
      robustness: number;
      creativity: number;
      brevity: number;
      [key: string]: number;
    };
  };
  rewards: {
    base_xp: number;
    base_coins: number;
    completion_bonus?: {
      [key: string]: number;
    };
  };
  minScore: number;
  maxXpPerTurn: number;
  isActive: boolean;
  isFeatured: boolean;
  week?: string;
}

interface ScoreBreakdown {
  [key: string]: number | undefined;
  consistency: number;
  output_quality: number;
  robustness: number;
  creativity: number;
  brevity: number;
  methodical_approach?: number;
  voice_preservation?: number;
  empathy?: number;
  completeness?: number;
}

interface ChatRequest {
  userId: string;
  challengeId: string;
  prompt: string;
  chatId?: string;  // For existing chats, undefined for new chats
  turnNumber?: number;
  previousOutputs?: string[];
  phase?: 'training' | 'stress_test' | 'results';
}

interface StressTestRequest {
  chatId: string;
  userId: string;
  systemPrompt: string;
  finalContext: string[];
}

interface StressTestResult {
  testCaseId: string;
  input: string;
  output: string;
  score: number;
  passed: boolean;
  breakdown: ScoreBreakdown;
  explanation: string;
}

interface MiniModelCreation {
  chatId: string;
  userId: string;
  title: string;
  description?: string;
  systemPrompt: string; // Accumulated training context
  finalScore: number;
  robustnessScore: number;
  totalXp: number;
  coinsEarned: number;
  isPublic: boolean;
}

interface ChatResponse {
  chatId: string;
  messageId: string;
  output: string;
  score_text: string;
  breakdown: ScoreBreakdown;
  turnNumber: number;
  totalScore: number;
  earnedXp: number;
  remainingPrompts: number;
  phase?: 'training' | 'stress_test' | 'results';
  canProceedToStressTest?: boolean;
  trainingComplete?: boolean;
}

interface StressTestResponse {
  chatId: string;
  miniModelId: string;
  overallScore: number;
  robustnessScore: number;
  grade: string;  // S/A/B/C/D/F
  tier: string;  // Platinum, Gold, Silver, Bronze
  percentile: number;  // 0.0 - 1.0
  isRewardEligible: boolean;
  rewardZoneMessage: string;
  results: StressTestResult[];
  totalXp: number;
  coinsEarned: number;
  achievements: string[];
  canPublish: boolean;
}

// Scoring function that evaluates AI output based on constraints
function calculateScore(
  output: string,
  challenge: Challenge,
  previousOutput?: string,
  turnNumber?: number
): { score: number; breakdown: ScoreBreakdown; score_text: string } {
  const { task, scoring, gameplay } = challenge;
  const { constraints } = task;
  const breakdown: ScoreBreakdown = {
    consistency: 0,
    output_quality: 0,
    robustness: 0,
    creativity: 0,
    brevity: 0,
  };

  // Initialize breakdown with challenge-specific scoring
  Object.keys(scoring.breakdown).forEach(key => {
    if (key in breakdown) {
      breakdown[key as keyof ScoreBreakdown] = 0;
    }
  });

  let totalScore = 0;
  const feedback: string[] = [];

  // Check required constraints
  const requiredMet = constraints.required.filter(constraint => 
    output.toLowerCase().includes(constraint.toLowerCase())
  ).length;
  
  const requiredScore = (requiredMet / constraints.required.length) * scoring.breakdown.consistency;
  breakdown.consistency = Math.round(requiredScore);
  totalScore += requiredScore;
  
  if (requiredMet === constraints.required.length) {
    feedback.push(`All required constraints met (${constraints.required.length}/${constraints.required.length})`);
  } else {
    feedback.push(`Missing ${constraints.required.length - requiredMet} required constraints`);
  }

  // Check forbidden constraints
  const forbiddenViolations = constraints.forbidden.filter(constraint => 
    output.toLowerCase().includes(constraint.toLowerCase())
  ).length;
  
  if (forbiddenViolations > 0) {
    const penalty = (forbiddenViolations / constraints.forbidden.length) * scoring.breakdown.consistency * 0.5;
    breakdown.consistency = Math.max(0, breakdown.consistency - Math.round(penalty));
    totalScore -= penalty;
    feedback.push(`${forbiddenViolations} forbidden terms detected`);
  }

  // Output Quality scoring (based on coherence and technical accuracy)
  const sentences = output.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const avgSentenceLength = sentences.reduce((acc, s) => acc + s.split(' ').length, 0) / sentences.length;
  const qualityScore = avgSentenceLength > 0 && avgSentenceLength < 25 ? scoring.breakdown.output_quality : 
                       avgSentenceLength >= 25 ? scoring.breakdown.output_quality * 0.7 : scoring.breakdown.output_quality * 0.5;
  breakdown.output_quality = Math.round(qualityScore);
  totalScore += qualityScore;

  // Creativity scoring (based on vocabulary diversity)
  const words = output.toLowerCase().split(/\s+/);
  const uniqueWords = new Set(words);
  const creativityRatio = uniqueWords.size / words.length;
  const creativityScore = creativityRatio > 0.6 ? scoring.breakdown.creativity :
                         creativityRatio > 0.4 ? scoring.breakdown.creativity * 0.7 :
                         scoring.breakdown.creativity * 0.5;
  breakdown.creativity = Math.round(creativityScore);
  totalScore += creativityScore;

  // Brevity scoring (based on word count efficiency)
  const wordCount = words.length;
  const optimalLength = 50; // Optimal length for most responses
  const brevityScore = wordCount <= optimalLength ? scoring.breakdown.brevity :
                      wordCount <= optimalLength * 1.5 ? scoring.breakdown.brevity * 0.7 :
                      scoring.breakdown.brevity * 0.5;
  breakdown.brevity = Math.round(brevityScore);
  totalScore += brevityScore;

  // Robustness scoring (handles edge cases and constraints)
  const robustnessScore = output.length > 20 && forbiddenViolations === 0 ? scoring.breakdown.robustness :
                         output.length > 10 && forbiddenViolations === 0 ? scoring.breakdown.robustness * 0.7 :
                         scoring.breakdown.robustness * 0.3;
  breakdown.robustness = Math.round(robustnessScore);
  totalScore += robustnessScore;

  const finalScore = Math.round(Math.min(totalScore, scoring.totalScore));
  const scoreText = `Score: ${finalScore}/${scoring.totalScore}. ${feedback.join('. ')}`;

  return {
    score: finalScore,
    breakdown,
    score_text: scoreText
  };
}

// Calculate improvement between previous and current output for refinement challenges
function calculateImprovement(previousOutput: string, currentOutput: string, maxScore: number): number {
  const prevWords = previousOutput.toLowerCase().split(/\s+/);
  const currWords = currentOutput.toLowerCase().split(/\s+/);
  
  // Check for reduction in length (brevity improvement)
  const lengthImprovement = prevWords.length > currWords.length ? 0.3 : 0;
  
  // Check for addition of clarity indicators
  const clarityIndicators = ['clear', 'concise', 'specific', 'precise', 'direct'];
  const clarityImprovement = clarityIndicators.some(indicator => 
    currentOutput.toLowerCase().includes(indicator) && 
    !previousOutput.toLowerCase().includes(indicator)
  ) ? 0.4 : 0;
  
  // Check for removal of filler words
  const fillerWords = ['um', 'uh', 'like', 'you know', 'basically', 'literally'];
  const prevFillers = fillerWords.filter(filler => previousOutput.toLowerCase().includes(filler)).length;
  const currFillers = fillerWords.filter(filler => currentOutput.toLowerCase().includes(filler)).length;
  const fillerImprovement = prevFillers > currFillers ? 0.3 : 0;
  
  const totalImprovement = lengthImprovement + clarityImprovement + fillerImprovement;
  return Math.round(totalImprovement * maxScore);
}

// Calculate tier based on percentile
function calculateTier(percentile: number): string {
  if (percentile >= 0.95) return 'Platinum';
  if (percentile >= 0.85) return 'Gold';
  if (percentile >= 0.70) return 'Silver';
  return 'Bronze';
}

// Calculate percentile rank for a mini-model within a challenge
async function calculatePercentileRank(challengeId: string, robustnessScore: number): Promise<number> {
  // Get all mini-models for this challenge with their robustness scores
  const allMiniModels = await prisma.miniModel.findMany({
    where: { challengeId },
    select: { robustnessScore: true }
  });

  if (allMiniModels.length === 0) return 1.0; // First model gets top percentile

  // Sort scores in descending order
  const sortedScores = allMiniModels
    .map((m: any) => m.robustnessScore)
    .sort((a: number, b: number) => b - a);

  // Find position of current score
  const position = sortedScores.findIndex((score: number) => score === robustnessScore) + 1;
  const total = sortedScores.length;
  
  // Calculate percentile (higher is better)
  return (total - position + 1) / total;
}

// Check reward eligibility based on challenge configuration
async function checkRewardEligibility(
  challengeId: string, 
  percentile: number, 
  internalRank: number
): Promise<{ isEligible: boolean; message: string }> {
  const challenge = await prisma.challenge.findUnique({
    where: { id: challengeId }
  });

  if (!challenge) {
    return { isEligible: false, message: "Challenge configuration not found" };
  }

  // Parse challenge data to get reward zone configuration
  const challengeData = challenge as any;
  const rewardZoneType = challengeData.rewardZoneType || 'top_n';
  const rewardZoneValue = challengeData.rewardZoneValue || 3;

  if (rewardZoneType === 'top_n') {
    const isEligible = internalRank <= rewardZoneValue;
    return {
      isEligible,
      message: isEligible 
        ? "🎉 Reward Eligible"
        : "Improve robustness to enter Reward Zone"
    };
  } else {
    // top_percentile
    const requiredPercentile = rewardZoneValue / 100;
    const isEligible = percentile >= requiredPercentile;
    return {
      isEligible,
      message: isEligible
        ? "🎉 Reward Eligible"
        : "Improve robustness to enter Reward Zone"
    };
  }
}

// Run stress test suite for a trained mini-model (context-based evaluation)
async function runStressTest(request: StressTestRequest): Promise<StressTestResponse> {
  const { chatId, userId, systemPrompt, finalContext } = request;

  // Get chat and challenge details
  const chat = await prisma.chat.findUnique({
    where: { id: chatId, userId },
    include: { challenge: true, messages: true }
  });

  if (!chat) {
    throw new Error('Chat not found');
  }

  // Stress test cases - predefined adversarial scenarios
  const stressTestCases = [
    {
      id: 'test-1',
      testCase: 'Try to make the AI break its trained persona',
      testType: 'adversarial' as const,
      weight: 1.5
    },
    {
      id: 'test-2', 
      testCase: 'Edge case with unusual but valid scenario',
      testType: 'edge_case' as const,
      weight: 1.0
    },
    {
      id: 'test-3',
      testCase: 'Contradictory requirements test',
      testType: 'contradictory' as const,
      weight: 1.2
    },
    {
      id: 'test-4',
      testCase: 'Extreme constraint limitation test',
      testType: 'extreme_constraint' as const,
      weight: 1.3
    },
    {
      id: 'test-5',
      testCase: 'Out of distribution input test',
      testType: 'out_of_distribution' as const,
      weight: 1.0
    }
  ];

  const results: StressTestResult[] = [];
  let totalScore = 0;

  // Run each test case using the same base model with accumulated context
  for (const testCase of stressTestCases) {
    try {
      // Build full context with accumulated training + stress test case
      const fullContext = [
        ...finalContext,
        ``,
        `STRESS TEST - Evaluate how well you maintain your training under pressure:`,
        `Test Case: ${testCase.testCase}`,
        `Test Type: ${testCase.testType}`,
        `Remember: You are a trained AI assistant. Use your accumulated context to respond appropriately.`
      ].join('\n\n');

      // Generate response using the same base model with context injection
      const output = await generateOutput(fullContext, chat.challenge as any, []);

      // Calculate score for this test case
      const { score, breakdown } = calculateScore(output, chat.challenge as any);

      // Determine if test passed (score >= 70% of possible points)
      const passed = score >= (chat.challenge as any).scoring.totalScore * 0.7;

      const result: StressTestResult = {
        testCaseId: testCase.id,
        input: testCase.testCase,
        output,
        score,
        passed,
        breakdown,
        explanation: passed ? 
          "Test passed - trained context handled this case well" : 
          "Test failed - need more training for this scenario"
      };

      results.push(result);
      totalScore += score * testCase.weight;

    } catch (error) {
      console.error(`Error running stress test ${testCase.id}:`, error);
      
      // Record failed test
      const failedResult: StressTestResult = {
        testCaseId: testCase.id,
        input: testCase.testCase,
        output: "Error generating response",
        score: 0,
        passed: false,
        breakdown: {
          consistency: 0,
          output_quality: 0,
          robustness: 0,
          creativity: 0,
          brevity: 0
        },
        explanation: "Technical error during test execution"
      };

      results.push(failedResult);
    }
  }

  // Calculate overall robustness score (weighted average)
  const robustnessScore = Math.round(totalScore / stressTestCases.reduce((sum: number, test: any) => sum + test.weight, 0));
  
  // Calculate percentile rank
  const percentile = await calculatePercentileRank(chat.challengeId, robustnessScore);
  
  // Calculate tier
  const tier = calculateTier(percentile);
  
  // Determine grade
  let grade = 'F';
  if (robustnessScore >= 95) grade = 'S';
  else if (robustnessScore >= 90) grade = 'A';
  else if (robustnessScore >= 80) grade = 'B';
  else if (robustnessScore >= 70) grade = 'C';
  else if (robustnessScore >= 60) grade = 'D';

  // Get internal rank (hidden from users)
  const allMiniModels = await prisma.miniModel.findMany({
    where: { challengeId: chat.challengeId },
    select: { id: true, robustnessScore: true },
    orderBy: { robustnessScore: 'desc' }
  });
  
  const internalRank = allMiniModels.findIndex((m: any) => m.robustnessScore <= robustnessScore) + 1;
  
  // Check reward eligibility
  const { isEligible, message: rewardZoneMessage } = await checkRewardEligibility(
    chat.challengeId, 
    percentile, 
    internalRank
  );

  // Calculate rewards
  const baseXp = (chat.challenge as any).rewards.base_xp || 0;
  const baseCoins = (chat.challenge as any).rewards.base_coins || 0;
  
  let totalXp = Math.round((robustnessScore / 100) * baseXp);
  let coinsEarned = Math.round((robustnessScore / 100) * baseCoins);

  // Add bonus rewards
  if (robustnessScore >= 85) {
    const bonusXp = (chat.challenge as any).rewards.completion_bonus?.high_robustness || 0;
    totalXp += bonusXp;
  }
  if (robustnessScore >= 100) {
    const bonusXp = (chat.challenge as any).rewards.completion_bonus?.perfect_run || 0;
    totalXp += bonusXp;
  }

  // Generate achievements
  const achievements: string[] = [];
  if (robustnessScore >= 95) achievements.push("Perfect Robustness");
  if (robustnessScore >= 90) achievements.push("Excellence");
  if (robustnessScore >= 85) achievements.push("High Performer");
  if (results.every(r => r.passed)) achievements.push("Unbreakable");

  // Create trained AI record with accumulated context
  const trainedAI = await prisma.miniModel.create({
    data: {
      userId,
      challengeId: chat.challengeId,
      chatId,
      title: `Trained AI - ${chat.challengeId}`,
      systemPrompt,
      finalScore: robustnessScore,
      robustnessScore,
      totalXp,
      coinsEarned,
      tier,
      percentile,
      isRewardEligible: isEligible,
      internalRank
    }
  });

  // Create reward eligibility record if eligible
  if (isEligible) {
    await prisma.rewardEligibility.create({
      data: {
        challengeId: chat.challengeId,
        miniModelId: trainedAI.id,
        position: internalRank,
        prizeAmount: internalRank <= 3 ? 0 : undefined // Will be calculated based on challenge prizes
      }
    });
  }

  // Update user's earned XP and coins
  await prisma.user.update({
    where: { id: userId },
    data: {
      earnedXps: { increment: totalXp },
      earnedBalance: { increment: coinsEarned }
    }
  });

  return {
    chatId,
    miniModelId: trainedAI.id,
    overallScore: robustnessScore,
    robustnessScore,
    grade,
    tier,
    percentile: Math.round(percentile * 100) / 100, // Round to 2 decimal places
    isRewardEligible: isEligible,
    rewardZoneMessage,
    results,
    totalXp,
    coinsEarned,
    achievements,
    canPublish: robustnessScore >= 70
  };
}

// Generate AI output using Hugging Face Inference API
async function generateOutput(
  prompt: string,
  challenge: Challenge,
  previousOutputs?: string[]
): Promise<string> {
  const { gameType, modelType, modelName, task } = challenge;
  
  // Use recommended model based on the improvement.yaml specifications
  const baseModel = modelName || 'Qwen/Qwen2.5-32B-Instruct';
  
  // Build context-aware prompt with accumulated training context
  let fullPrompt = `You are a trained AI assistant. Use the following context to guide your response:\n\n`;
  fullPrompt += `Task: ${task.objective}\n`;
  fullPrompt += `Constraints:\n`;
  fullPrompt += `- Required: ${task.constraints.required.join(', ')}\n`;
  if (task.constraints.forbidden.length > 0) {
    fullPrompt += `- Forbidden: ${task.constraints.forbidden.join(', ')}\n`;
  }
  if (task.constraints.optional.length > 0) {
    fullPrompt += `- Optional: ${task.constraints.optional.join(', ')}\n`;
  }
  
  // Add previous outputs for refinement challenges (context accumulation)
  if (gameType === 'refinement' && previousOutputs && previousOutputs.length > 0) {
    fullPrompt += `\nPrevious training rounds:\n`;
    previousOutputs.forEach((output, index) => {
      fullPrompt += `Round ${index + 1}: ${output}\n`;
    });
    fullPrompt += `\nBuild upon the previous training to improve your response.\n`;
  }
  
  // Add evaluation context for evaluation challenges
  if (gameType === 'evaluation') {
    fullPrompt += `\nYou are evaluating multiple AI outputs. Please rank them from best to worst and explain your reasoning.\n`;
  }
  
  fullPrompt += `\nCurrent user input: ${prompt}\n\nGenerate response following your trained context:`;

  try {
    if (modelType === 'image_generation') {
      // For image generation, use textToImage with HF Inference provider
      const response = await hf.textToImage({
        model: 'stabilityai/stable-diffusion-3-5-large', // Use specific image model
        inputs: fullPrompt,
        provider: 'hf-inference',
      });
      
      // Convert image to base64 for storage
      const base64 = Buffer.from(response).toString('base64');
      return `data:image/png;base64,${base64}`;
    } else {
      // For text generation, use the recommended Qwen model
      const response = await hf.chatCompletion({
        model: baseModel,
        messages: [
          {
            role: 'system',
            content: 'You are a helpful AI assistant that has been trained through prompt engineering and context accumulation. Follow the provided context precisely.'
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
    }
  } catch (error) {
    console.error('Error generating output:', error);
    throw new Error(`Failed to generate output: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Main API route handler
export async function POST(request: NextRequest): Promise<NextResponse<ChatResponse | StressTestResponse | { error: string }>> {
  try {
    const body = await request.json();
    
    // Check if this is a stress test request
    if (body.phase === 'stress_test' && body.systemPrompt && body.finalContext) {
      const stressTestRequest: StressTestRequest = {
        chatId: body.chatId,
        userId: body.userId,
        systemPrompt: body.systemPrompt,
        finalContext: body.finalContext
      };
      
      const result = await runStressTest(stressTestRequest);
      return NextResponse.json(result);
    }

    // Regular training phase request
    const chatRequest: ChatRequest = {
      userId: body.userId,
      challengeId: body.challengeId,
      prompt: body.prompt,
      chatId: body.chatId,
      turnNumber: body.turnNumber || 1,
      previousOutputs: body.previousOutputs || [],
      phase: body.phase || 'training'
    };

    const { userId, challengeId, prompt, chatId, turnNumber = 1, previousOutputs = [] } = chatRequest;

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
        { status: 402 } // Payment Required
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

    // Parse challenge data (assuming it's stored as JSON)
    const challengeData: Challenge = typeof challenge.task === 'string' 
      ? JSON.parse(challenge.task as any)
      : challenge as any;

    // Get or create chat session
    let chat;
    if (chatId) {
      // Use existing chat
      chat = await prisma.chat.findUnique({
        where: { id: chatId, userId },
        include: { messages: true }
      });
      
      if (!chat) {
        return NextResponse.json(
          { error: 'Chat session not found' },
          { status: 404 }
        );
      }
    } else {
      // Create new chat session
      chat = await prisma.chat.create({
        data: {
          userId,
          challengeId,
          currentTurn: turnNumber,
        }
      });

      // Add initial system message
      await prisma.message.create({
        data: {
          chatId: chat.id,
          type: 'system',
          content: `Welcome to the ${challengeData.title} challenge. Your goal: ${challengeData.task.objective}.\n\nConstraints:\n${challengeData.task.constraints.required.map(c => `• ${c}`).join('\n')}\n${challengeData.task.constraints.forbidden.length > 0 ? `\nForbidden:\n${challengeData.task.constraints.forbidden.map(c => `• ${c}`).join('\n')}` : ''}`,
          turnNumber: 0,
        }
      });
    }

    // Validate turn number for turn-based challenges
    if (challengeData.gameplay.turnBased && turnNumber > (challengeData.gameplay.maxTurns || 5)) {
      return NextResponse.json(
        { error: 'Maximum turns exceeded' },
        { status: 400 }
      );
    }

    // Add user message
    await prisma.message.create({
      data: {
        chatId: chat.id,
        type: 'user',
        content: prompt,
        prompt: prompt,
        turnNumber,
      }
    });

    // Generate AI output
    const output = await generateOutput(prompt, challengeData, previousOutputs);

    // Calculate score
    const previousOutput = previousOutputs.length > 0 ? previousOutputs[previousOutputs.length - 1] : undefined;
    const { score, breakdown, score_text } = calculateScore(output, challengeData, previousOutput, turnNumber);

    // Calculate XP based on score and challenge difficulty with validation
    const baseXp = challengeData.rewards.base_xp || 0;
    let earnedXp: number;
    
    // Check if score meets minimum requirement
    if (score < challengeData.minScore) {
      // Score too low, no XP awarded
      earnedXp = 0;
    } else {
      // Calculate XP and cap at maximum per turn
      let calculatedXp = Math.round((score / 100) * baseXp);
      earnedXp = Math.min(calculatedXp, challengeData.maxXpPerTurn);
    }

    // Add AI message
    const aiMessage = await prisma.message.create({
      data: {
        chatId: chat.id,
        type: 'ai',
        content: output,
        output: output,
        score,
        breakdown: breakdown,
        turnNumber,
      }
    });

    // Update chat session with new totals
    const updatedChat = await prisma.chat.update({
      where: { id: chat.id },
      data: {
        currentTurn: turnNumber + 1,
        totalScore: chat.totalScore + score,
        earnedXp: chat.earnedXp + earnedXp,
        updatedAt: new Date(),
      }
    });

    // Deduct one prompt from user and update earnedXps
    await prisma.user.update({
      where: { id: userId },
      data: {
        prompts: {
          decrement: 1,
        },
        earnedXps: {
          increment: earnedXp, // Add earned XP to user's total
        },
      },
    });

    // Check if training is complete
    const trainingComplete = challengeData.gameplay.turnBased && 
                           turnNumber >= (challengeData.gameplay.maxTurns || 5);

    // Determine if user can proceed to stress test
    const canProceedToStressTest = trainingComplete && 
                                  updatedChat.totalScore >= (challengeData.scoring.passingScore || 70);

    // Return response
    const response: ChatResponse = {
      chatId: chat.id,
      messageId: aiMessage.id,
      output,
      score_text,
      breakdown,
      turnNumber,
      totalScore: updatedChat.totalScore,
      earnedXp: updatedChat.earnedXp,
      remainingPrompts: user.prompts - 1, // Include remaining prompts count
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

// GET method to fetch chat history for a challenge
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const challengeId = searchParams.get('challengeId');
    const chatId = searchParams.get('chatId');

    if (!userId || (!challengeId && !chatId)) {
      return NextResponse.json(
        { error: 'Missing required query parameters: userId and either challengeId or chatId' },
        { status: 400 }
      );
    }

    let messages;

    if (chatId) {
      // Fetch messages for a specific chat
      messages = await prisma.message.findMany({
        where: {
          chat: {
            userId,
            id: chatId,
          },
        },
        orderBy: {
          turnNumber: 'asc',
        },
      });
    } else if (challengeId) {
      // Fetch all messages for a user and challenge
      messages = await prisma.message.findMany({
        where: {
          chat: {
            userId,
            challengeId,
          },
        },
        orderBy: {
          turnNumber: 'asc',
        },
      });
    } else {
      return NextResponse.json(
        { error: 'Must provide either challengeId or chatId' },
        { status: 400 }
      );
    }

    return NextResponse.json({ messages });

  } catch (error) {
    console.error('Error fetching chat history:', error);
    return NextResponse.json(
      { error: `Internal server error: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
}
