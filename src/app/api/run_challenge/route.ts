import { NextRequest, NextResponse } from 'next/server';
import { InferenceClient } from '@huggingface/inference';
import { prisma } from '@/app/lib/prisma';


// Initialize Hugging Face Inference Client
const hf = new InferenceClient(process.env.HUGGINGFACE_API_KEY);

// Type definitions based on the schema
type GameType = 'image' | 'text' | 'transformation' | 'refinement' | 'evaluation';
type ScoringMode = 'constraint_based' | 'quality_score' | 'refinement_score' | 'ranking';
type ModelType = 'image_generation' | 'text_generation';

interface Challenge {
  id: string;
  title: string;
  description: string;
  gameType: GameType;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
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
    breakdown: {
      constraint_accuracy: number;
      clarity: number;
      creativity: number;
      brevity: number;
      improvement_per_turn?: number;
      correctness?: number;
      explanation_quality?: number;
    };
  };
  rewards: {
    xp: number;
    coins: number;
  };
  minScore: number;
  maxXpPerTurn: number;
}

interface ScoreBreakdown {
  [key: string]: number | undefined;
  constraint_accuracy: number;
  clarity: number;
  creativity: number;
  brevity: number;
  improvement_per_turn?: number;
  correctness?: number;
  explanation_quality?: number;
}

interface ChatRequest {
  userId: string;
  challengeId: string;
  prompt: string;
  chatId?: string;  // For existing chats, undefined for new chats
  turnNumber?: number;
  previousOutputs?: string[];
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
    constraint_accuracy: 0,
    clarity: 0,
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
  
  const requiredScore = (requiredMet / constraints.required.length) * scoring.breakdown.constraint_accuracy;
  breakdown.constraint_accuracy = Math.round(requiredScore);
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
    const penalty = (forbiddenViolations / constraints.forbidden.length) * scoring.breakdown.constraint_accuracy * 0.5;
    breakdown.constraint_accuracy = Math.max(0, breakdown.constraint_accuracy - Math.round(penalty));
    totalScore -= penalty;
    feedback.push(`${forbiddenViolations} forbidden terms detected`);
  }

  // Clarity scoring (based on sentence structure and readability)
  const sentences = output.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const avgSentenceLength = sentences.reduce((acc, s) => acc + s.split(' ').length, 0) / sentences.length;
  const clarityScore = avgSentenceLength > 0 && avgSentenceLength < 25 ? scoring.breakdown.clarity : 
                       avgSentenceLength >= 25 ? scoring.breakdown.clarity * 0.7 : scoring.breakdown.clarity * 0.5;
  breakdown.clarity = Math.round(clarityScore);
  totalScore += clarityScore;

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

  // Special scoring for refinement challenges
  if (gameplay.scoringMode === 'refinement_score' && previousOutput && turnNumber && turnNumber > 1) {
    const improvementScore = calculateImprovement(previousOutput, output, scoring.breakdown.improvement_per_turn || 70);
    breakdown.improvement_per_turn = improvementScore;
    totalScore += improvementScore;
    feedback.push(`Refinement improvement: ${improvementScore}/70`);
  }

  // Special scoring for evaluation challenges
  if (gameplay.scoringMode === 'ranking') {
    const correctnessScore = output.includes('rank') && output.includes('best') ? 
                             (scoring.breakdown.correctness || 50) : (scoring.breakdown.correctness || 50) * 0.5;
    breakdown.correctness = Math.round(correctnessScore);
    totalScore += correctnessScore;

    const explanationScore = output.length > 100 ? (scoring.breakdown.explanation_quality || 30) :
                            output.length > 50 ? (scoring.breakdown.explanation_quality || 30) * 0.7 :
                            (scoring.breakdown.explanation_quality || 30) * 0.5;
    breakdown.explanation_quality = Math.round(explanationScore);
    totalScore += explanationScore;
  }

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

// Generate AI output using Hugging Face Inference API
async function generateOutput(
  prompt: string,
  challenge: Challenge,
  previousOutputs?: string[]
): Promise<string> {
  const { gameType, modelType, modelName, task } = challenge;
  
  // Build context-aware prompt
  let fullPrompt = `Task: ${task.objective}\n`;
  fullPrompt += `Constraints:\n`;
  fullPrompt += `- Required: ${task.constraints.required.join(', ')}\n`;
  if (task.constraints.forbidden.length > 0) {
    fullPrompt += `- Forbidden: ${task.constraints.forbidden.join(', ')}\n`;
  }
  if (task.constraints.optional.length > 0) {
    fullPrompt += `- Optional: ${task.constraints.optional.join(', ')}\n`;
  }
  
  // Add previous outputs for refinement challenges
  if (gameType === 'refinement' && previousOutputs && previousOutputs.length > 0) {
    fullPrompt += `\nPrevious output to refine:\n${previousOutputs[previousOutputs.length - 1]}\n`;
  }
  
  // Add evaluation context for evaluation challenges
  if (gameType === 'evaluation') {
    fullPrompt += `\nYou are evaluating multiple AI outputs. Please rank them from best to worst and explain your reasoning.\n`;
  }
  
  fullPrompt += `\nUser prompt: ${prompt}\n\nGenerate response:`;

  try {
    if (modelType === 'image_generation') {
      // For image generation, use textToImage with HF Inference provider
      const response = await hf.textToImage({
        model: modelName || 'stabilityai/stable-diffusion-3-5-large',
        inputs: fullPrompt,
        provider: 'hf-inference',
      });
      
      // Convert image to base64 for storage
      const base64 = Buffer.from(response).toString('base64');
      return `data:image/png;base64,${base64}`;
    } else {
      // For text generation, use chatCompletion for better results
      const response = await hf.chatCompletion({
        model: modelName || 'meta-llama/Llama-3.1-8B-Instruct',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful AI assistant that follows instructions precisely and creatively.'
          },
          {
            role: 'user',
            content: fullPrompt
          }
        ],
        max_tokens: 500,
        temperature: 0.7,
      });
      // console.log(response)
      return response.choices[0]?.message?.content || 'No response generated';
    }
  } catch (error) {
    console.error('Error generating output:', error);
    throw new Error(`Failed to generate output: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Main API route handler
export async function POST(request: NextRequest): Promise<NextResponse<ChatResponse | { error: string }>> {
  try {
    const body: ChatRequest = await request.json();
    const { userId, challengeId, prompt, chatId, turnNumber = 1, previousOutputs = [] } = body;

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
    if (challengeData.gameplay.turnBased && turnNumber > (challengeData.gameplay.maxTurns || 3)) {
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
    const baseXp = challengeData.rewards.xp || 0;
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
