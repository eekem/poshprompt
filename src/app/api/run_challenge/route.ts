import { NextRequest, NextResponse } from 'next/server';
import { Groq } from 'groq-sdk';
import { prisma } from '@/app/lib/prisma';

// Initialize Groq client
const groq = new Groq({
  apiKey: process.env.HUGGINGFACE_API_KEY // Using same env var for Groq API key
});

// Type definitions based on the new schema
type GameType = 'mini_model_training' | 'text' | 'transformation' | 'refinement' | 'evaluation';
type ScoringMode = 'robustness_score' | 'constraint_based' | 'quality_score' | 'refinement_score' | 'ranking';
type ModelType = 'text_generation';
type Difficulty = 'beginner' | 'intermediate' | 'advanced';
type TestType = 'adversarial' | 'edge_case' | 'contradictory' | 'extreme_constraint' | 'out_of_distribution' | 'safety_critical';

interface Challenge {
  id: string;
  title: string;
  role: string;
  difficulty: Difficulty;
  description: string;
  estimatedTime: number;
  prerequisites?: string[];
  learningObjectives?: string[];
  training: {
    rounds: number;
    maxWordsPerPrompt: number;
    timePerRound: number;
    constraints: {
      required: string[];
      forbidden: string[];
      optional: string[];
    };
  };
  stressTest: {
    numCases: number;
    testTypes: string[];
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
  isBuildingTool?: boolean;
  toolData?: any;
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
  trainingProgress?: {
    constraintAdherence: number;
    roleConsistency: number;
    forbiddenAvoidance: number;
    overallStrength: number;
    improvementAreas: string[];
    strengths: string[];
  };
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
  const { training, scoring } = challenge;
  const { constraints } = training;
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
  const requiredMet = constraints.required.filter((constraint: string) => 
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
  const forbiddenViolations = constraints.forbidden.filter((constraint: string) => 
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
  console.log('runStressTest called with:', request);
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
      const output = await generateOutput(chatId, fullContext, chat.challenge as any);

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

// Generate AI output using Groq with database context
async function generateOutput(
  chatId: string,
  prompt: string,
  challenge: Challenge,
  isBuildingTool: boolean = false,
  toolData?: any
): Promise<string> {
  const { training, scoring } = challenge;
  
  // Fetch previous AI outputs from database for context accumulation
  const previousMessages = await prisma.message.findMany({
    where: {
      chatId: chatId,
      type: 'ai'
    },
    orderBy: {
      turnNumber: 'asc'
    },
    select: {
      content: true,
      turnNumber: true
    }
  });
  
  const previousOutputs = previousMessages.map(msg => msg.content);
  
  // Use official Groq production models
  const baseModel = 'llama-3.1-8b-instant'; // Fast, reliable production model
  const fallbackModels = [
    'llama-3.3-70b-versatile', // More powerful
    'gpt-oss-120b', // Large model for complex tasks
    'gpt-oss-20b' // Medium model
  ];
  
  // Build context-aware prompt with accumulated training context
  let fullPrompt = `You are a trained AI assistant. Use the following context to guide your response:\n\n`;
  fullPrompt += `Role: ${challenge.role}\n`;
  fullPrompt += `Objective: ${challenge.description}\n`;
  fullPrompt += `Constraints:\n`;
  fullPrompt += `- Required: ${training.constraints.required.join(', ')}\n`;
  if (training.constraints.forbidden.length > 0) {
    fullPrompt += `- Forbidden: ${training.constraints.forbidden.join(', ')}\n`;
  }
  if (training.constraints.optional.length > 0) {
    fullPrompt += `- Optional: ${training.constraints.optional.join(', ')}\n`;
  }
  
  // Add previous outputs for context accumulation
  if (previousOutputs && previousOutputs.length > 0) {
    fullPrompt += `\nPrevious training rounds:\n`;
    previousOutputs.forEach((output, index) => {
      fullPrompt += `Round ${index + 1}: ${output}\n`;
    });
    fullPrompt += `\nBuild upon previous training to improve your response.\n`;
  }

  // Add building tool specific context
  if (isBuildingTool && toolData) {
    fullPrompt += `\nBUILDING TOOL ACTIVATED: ${toolData.title}\n`;
    fullPrompt += `Tool Description: ${toolData.description}\n`;
    fullPrompt += `Impact Level: ${toolData.impactScore}/10\n`;
    fullPrompt += `Difficulty: ${toolData.difficulty}\n`;
    fullPrompt += `Focus on this specific training aspect while maintaining overall consistency.\n`;
  }
  
  fullPrompt += `\nCurrent user input: ${prompt}\n\n`;

  // For building tools, request JSON response with scoring
  if (isBuildingTool) {
    fullPrompt += `Generate a JSON response with the following structure:
{
  "response": "Your AI response following the trained context",
  "trainingProgress": {
    "constraintAdherence": number (0-100),
    "roleConsistency": number (0-100),
    "forbiddenAvoidance": number (0-100),
    "overallStrength": number (0-100),
    "improvementAreas": ["area1", "area2"],
    "strengths": ["strength1", "strength2"]
  },
  "scoreBreakdown": {
    "consistency": number (0-30),
    "output_quality": number (0-25),
    "robustness": number (0-25),
    "creativity": number (0-10),
    "brevity": number (0-10)
  }
}

Focus on the building tool's specific impact area while maintaining overall training quality.`;
  } else {
    fullPrompt += `Generate response following your trained context:`;
  }

  try {
    // Use Groq directly for best performance
    console.log('Attempting to generate output with Groq model:', baseModel);
    console.log('Groq API Key present:', !!process.env.HUGGINGFACE_API_KEY);
    
    const response = await groq.chat.completions.create({
      model: baseModel,
      messages: [
        {
          role: 'system',
          content: 'You are a helpful AI assistant that has been trained through prompt engineering and context accumulation. Follow provided context precisely.'
        },
        {
          role: 'user',
          content: fullPrompt
        }
      ],
      max_tokens: isBuildingTool ? 800 : 500,
      temperature: 0.7,
      response_format: isBuildingTool ? { type: 'json_object' } : undefined
    });
    
    const result = response.choices[0]?.message?.content || 'No response generated';
    
    // For building tools, validate and extract the JSON response
    if (isBuildingTool) {
      try {
        const parsed = JSON.parse(result);
        return result; // Return the full JSON for processing
      } catch (parseError) {
        console.error('Failed to parse JSON response from building tool:', parseError);
        // Fallback to regular response format
        return generateFallbackResponse(prompt, challenge, previousOutputs);
      }
    }
    
    return result;
  } catch (error) {
    console.error('Error generating output with primary model:', error);
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : undefined
    });
    
    // Check if it's an API key issue
    if (!process.env.HUGGINGFACE_API_KEY) {
      console.log('API key not configured, providing fallback response');
      return generateFallbackResponse(prompt, challenge, previousOutputs);
    }
    
    // Check if it's a provider availability issue
    if (error instanceof Error && error.message.includes('No Inference Provider available')) {
      console.log('No inference providers available, providing fallback response');
      return generateFallbackResponse(prompt, challenge, previousOutputs);
    }
    
    // Try fallback models
    for (const fallbackModel of fallbackModels) {
      try {
        console.log(`Trying fallback model: ${fallbackModel}`);
        const fallbackResponse = await groq.chat.completions.create({
          model: fallbackModel,
          messages: [
            {
              role: 'system',
              content: 'You are a helpful AI assistant. Follow the provided context precisely.'
            },
            {
              role: 'user',
              content: fullPrompt
            }
          ],
          max_tokens: isBuildingTool ? 800 : 500,
          temperature: 0.7,
          response_format: isBuildingTool ? { type: 'json_object' } : undefined
        });
        
        const result = fallbackResponse.choices[0]?.message?.content || 'No response generated';
        console.log(`Successfully generated response with fallback model: ${fallbackModel}`);
        
        // For building tools, validate JSON
        if (isBuildingTool) {
          try {
            JSON.parse(result);
            return result;
          } catch (parseError) {
            console.error('Failed to parse JSON from fallback model:', parseError);
            continue; // Try next fallback model
          }
        }
        
        return result;
      } catch (fallbackError) {
        console.error(`Fallback model ${fallbackModel} also failed:`, fallbackError);
        continue;
      }
    }
    
    // If all models fail, provide a fallback response
    console.log('All models failed, providing fallback response');
    return generateFallbackResponse(prompt, challenge, previousOutputs);
  }
}

// Fallback response generator when AI is unavailable
function generateFallbackResponse(
  prompt: string,
  challenge: Challenge,
  previousOutputs?: string[]
): string {
  const responses = [
    `I understand you want me to respond as ${challenge.role}. Based on your input "${prompt}", I would provide a response that follows the constraints: ${challenge.training.constraints.required.join(', ')}.`,
    `As a ${challenge.role}, I acknowledge your request: "${prompt}". I need to ensure my response meets the required constraints while avoiding forbidden elements.`,
    `I'm processing your input "${prompt}" in the context of ${challenge.description}. My response will follow the established training pattern and constraints.`
  ];
  
  // Add some variation based on previous outputs
  if (previousOutputs && previousOutputs.length > 0) {
    responses.push(
      `Building on our previous training, I'll respond to "${prompt}" with improved consistency and adherence to the ${challenge.role} persona.`
    );
  }
  
  return responses[Math.floor(Math.random() * responses.length)];
}

// Main API route handler
export async function POST(request: NextRequest): Promise<NextResponse<ChatResponse | StressTestResponse | { error: string }>> {
  try {
    const body = await request.json();
    
    // Check if this is a stress test request
    console.log('Request body received:', body);
    console.log('Stress test condition check:', {
      phase: body.phase,
      isStressTest: body.phase === 'stress_test',
      hasSystemPrompt: !!body.systemPrompt,
      hasFinalContext: !!body.finalContext,
      systemPromptLength: body.systemPrompt?.length,
      finalContextLength: body.finalContext?.length
    });
    
    if (body.phase === 'stress_test' && body.systemPrompt && body.finalContext) {
      console.log('Processing as stress test request');
      const stressTestRequest: StressTestRequest = {
        chatId: body.chatId,
        userId: body.userId,
        systemPrompt: body.systemPrompt,
        finalContext: body.finalContext
      };
      
      const result = await runStressTest(stressTestRequest);
      return NextResponse.json(result);
    }

    console.log('Processing as regular training request');
    // Regular training phase request
    const chatRequest: ChatRequest = {
      userId: body.userId,
      challengeId: body.challengeId,
      prompt: body.prompt,
      chatId: body.chatId,
      turnNumber: body.turnNumber || 1,
      previousOutputs: body.previousOutputs || [],
      phase: body.phase || 'training',
      isBuildingTool: body.isBuildingTool || false,
      toolData: body.toolData
    };

    const { userId, challengeId, prompt, chatId, turnNumber = 1, previousOutputs = [], isBuildingTool = false, toolData } = chatRequest;

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

    // Parse challenge data to match v2.0 structure (same as challenges API)
const gameplay = typeof challenge.gameplay === 'object' && challenge.gameplay !== null ? challenge.gameplay : {};
const task = typeof challenge.task === 'string' ? JSON.parse(challenge.task) : {};

const challengeData: any = {
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
  scoring: (challenge.scoring as any) || {
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
    base_coins: 10
  },
  estimatedTime: 25,
  prerequisites: [],
  learningObjectives: []
};

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
          content: `Welcome to ${challengeData.title} challenge. Your goal: ${challengeData.description}.\n\nConstraints:\n${challengeData.training.constraints.required.map((c: string) => `• ${c}`).join('\n')}\n${challengeData.training.constraints.forbidden.length > 0 ? `\nForbidden:\n${challengeData.training.constraints.forbidden.map((c: string) => `• ${c}`).join('\n')}` : ''}`,
          turnNumber: 0,
        }
      });
    }

    // Validate turn number for training rounds
    if (turnNumber > (challengeData.training.rounds || 5)) {
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
    const output = await generateOutput(chat.id, prompt, challengeData, isBuildingTool, toolData);

    // Parse JSON response for building tools
    let parsedOutput = null;
    let trainingProgress = undefined;
    
    if (isBuildingTool) {
      try {
        parsedOutput = JSON.parse(output);
        trainingProgress = parsedOutput.trainingProgress;
      } catch (error) {
        console.error('Failed to parse building tool JSON response:', error);
        // Use fallback parsing
        parsedOutput = {
          response: output,
          trainingProgress: {
            constraintAdherence: 50,
            roleConsistency: 50,
            forbiddenAvoidance: 50,
            overallStrength: 50,
            improvementAreas: ['Response parsing failed'],
            strengths: []
          },
          scoreBreakdown: {
            consistency: 15,
            output_quality: 12,
            robustness: 12,
            creativity: 5,
            brevity: 5
          }
        };
        trainingProgress = parsedOutput.trainingProgress;
      }
    }

    // Use the actual response text for scoring
    const responseText = isBuildingTool && parsedOutput ? parsedOutput.response : output;

    // Calculate score
    const previousOutput = previousOutputs.length > 0 ? previousOutputs[previousOutputs.length - 1] : undefined;
    const { score, breakdown, score_text } = calculateScore(responseText, challengeData, previousOutput, turnNumber);
    
    // Ensure score is a valid number
    const validScore = isNaN(score) || score === null ? 0 : Math.round(score);
    
    // Debug logging
    console.log('Score calculated:', { score: validScore, earnedXp: 'calculating...', chatTotalScore: chat.totalScore });

    // Calculate XP based on score and challenge difficulty with validation
    const baseXp = challengeData.rewards.base_xp || 0;
    let earnedXp: number;
    
    // Check if score meets minimum requirement
    if (validScore < (challengeData.minScore || 0)) {
      // Score too low, no XP awarded
      earnedXp = 0;
    } else {
      // Calculate XP and cap at maximum per turn
      let calculatedXp = Math.round((validScore / 100) * baseXp);
      earnedXp = Math.min(calculatedXp, challengeData.maxXpPerTurn || baseXp);
    }

    // Add AI message
    const aiMessage = await prisma.message.create({
      data: {
        chatId: chat.id,
        type: 'ai',
        content: responseText,
        output: responseText,
        score: validScore,
        breakdown: isBuildingTool && parsedOutput?.scoreBreakdown ? parsedOutput.scoreBreakdown : breakdown,
        turnNumber,
      }
    });

    // Update chat session with new totals
    console.log('About to update chat:', {
      chatId: chat.id,
      currentScore: validScore,
      currentTotalScore: chat.totalScore,
      currentEarnedXp: chat.earnedXp,
      newEarnedXp: earnedXp
    });
    
    try {
      const updatedChat = await prisma.chat.update({
        where: { id: chat.id },
        data: {
          currentTurn: turnNumber + 1,
          totalScore: (chat.totalScore || 0) + validScore,
          earnedXp: (chat.earnedXp || 0) + (earnedXp || 0),
          updatedAt: new Date(),
        }
      });
      
      console.log('Chat updated successfully:', updatedChat.id);
    } catch (dbError) {
      console.error('Database update failed:', dbError);
      throw new Error(`Failed to update chat: ${dbError instanceof Error ? dbError.message : 'Unknown error'}`);
    }

    // Determine if training is complete and if user can proceed to stress test
    const trainingComplete = turnNumber >= (challengeData.training.rounds || 5);
    const canProceedToStressTest = trainingComplete && ((chat.totalScore || 0) + validScore) >= (challengeData.scoring.passingScore || 70);

    // Deduct one prompt from user and update earnedXps
    await prisma.user.update({
      where: { id: userId },
      data: {
        prompts: {
          decrement: 1,
        },
        earnedXps: {
          increment: earnedXp, // Add earned XP to user's total
        }
      }
    });

    const response = {
      chatId: chat.id,
      messageId: aiMessage.id,
      output: responseText,
      score_text,
      breakdown: isBuildingTool && parsedOutput?.scoreBreakdown ? parsedOutput.scoreBreakdown : breakdown,
      turnNumber,
      totalScore: (chat.totalScore || 0) + validScore,
      earnedXp,
      remainingPrompts: user.prompts - 1, // Include remaining prompts count
      phase: trainingComplete ? 'stress_test' : 'training',
      canProceedToStressTest,
      trainingComplete,
      trainingProgress
    } as ChatResponse;

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
