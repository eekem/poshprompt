import { NextRequest, NextResponse } from 'next/server';
import { Groq } from 'groq-sdk';
import { prisma } from '@/app/lib/prisma';

// Initialize Groq client
const groq = new Groq({
  apiKey: process.env.HUGGINGFACE_API_KEY
});

interface BuildingToolOption {
  id: string;
  title: string;
  description: string;
  icon: string;
  difficulty: 'easy' | 'medium' | 'hard';
  impactScore: number; // How much this affects the model's training
}

interface BuildingToolsResponse {
  options: BuildingToolOption[];
  sessionId: string;
  lastUpdated: string;
}

// Generate building tool options using AI based on challenge context
async function generateBuildingTools(
  challengeId: string,
  userId: string,
  previousOptions?: string[]
): Promise<BuildingToolOption[]> {
  // Fetch challenge details
  const challenge = await prisma.challenge.findUnique({
    where: { id: challengeId }
  });

  if (!challenge) {
    throw new Error('Challenge not found');
  }

  // Parse challenge data
  const challengeData = challenge as any;
  const task = typeof challenge.task === 'string' ? JSON.parse(challenge.task) : {};
  const constraints = task.constraints || {};

  // Build context for AI
  const context = `
Challenge: ${challenge.title}
Description: ${challenge.description}
Role: ${challengeData.role || 'AI Assistant'}
Required Constraints: ${constraints.required?.join(', ') || 'None'}
Forbidden Constraints: ${constraints.forbidden?.join(', ') || 'None'}
Previous Options Used: ${previousOptions?.join(', ') || 'None'}

Generate 6 building tool options that will help train the AI to follow the constraints and role better.
Each option should be a specific training action that improves the AI's capabilities.
`;

  try {
    const response = await groq.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages: [
        {
          role: 'system',
          content: 'You are an AI training assistant. Generate exactly 6 building tool options for training AI models. Return ONLY a JSON array with no additional text. Each option must have: id (unique), title (short), description (clear), icon (material-symbols icon name), difficulty (easy/medium/hard), impactScore (1-10).'
        },
        {
          role: 'user',
          content: context
        }
      ],
      max_tokens: 800,
      temperature: 0.7,
      response_format: { type: 'json_object' }
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No response from AI');
    }

    const parsed = JSON.parse(content);
    
    // Ensure we have exactly 6 options
    let options = Array.isArray(parsed) ? parsed : (parsed.options || []);
    
    // If AI returned fewer/more than 6, adjust
    if (options.length !== 6) {
      // Fallback options
      const fallbackOptions: BuildingToolOption[] = [
        {
          id: 'constraint-focus',
          title: 'Constraint Reinforcement',
          description: 'Strengthen adherence to required constraints',
          icon: 'rule',
          difficulty: 'medium',
          impactScore: 7
        },
        {
          id: 'role-enhancement',
          title: 'Role Deepening',
          description: 'Enhance the AI persona and character consistency',
          icon: 'psychology',
          difficulty: 'medium',
          impactScore: 6
        },
        {
          id: 'forbidden-avoidance',
          title: 'Forbidden Pattern Avoidance',
          description: 'Train to avoid forbidden behaviors and patterns',
          icon: 'block',
          difficulty: 'hard',
          impactScore: 8
        },
        {
          id: 'creativity-boost',
          title: 'Creative Enhancement',
          description: 'Improve creative and diverse response generation',
          icon: 'lightbulb',
          difficulty: 'easy',
          impactScore: 5
        },
        {
          id: 'consistency-training',
          title: 'Consistency Building',
          description: 'Build consistent behavior across multiple interactions',
          icon: 'sync',
          difficulty: 'medium',
          impactScore: 6
        },
        {
          id: 'robustness-testing',
          title: 'Robustness Improvement',
          description: 'Increase resilience to edge cases and challenges',
          icon: 'shield',
          difficulty: 'hard',
          impactScore: 9
        }
      ];
      
      options = fallbackOptions.slice(0, 6);
    }

    return options.map((option: any, index: number) => ({
      id: option.id || `tool-${index + 1}`,
      title: option.title || `Training Tool ${index + 1}`,
      description: option.description || `Training option ${index + 1}`,
      icon: option.icon || 'build',
      difficulty: option.difficulty || 'medium',
      impactScore: Math.min(10, Math.max(1, option.impactScore || 5))
    }));

  } catch (error) {
    console.error('Error generating building tools:', error);
    
    // Return fallback options
    return [
      {
        id: 'constraint-focus',
        title: 'Constraint Reinforcement',
        description: 'Strengthen adherence to required constraints',
        icon: 'rule',
        difficulty: 'medium',
        impactScore: 7
      },
      {
        id: 'role-enhancement',
        title: 'Role Deepening',
        description: 'Enhance the AI persona and character consistency',
        icon: 'psychology',
        difficulty: 'medium',
        impactScore: 6
      },
      {
        id: 'forbidden-avoidance',
        title: 'Forbidden Pattern Avoidance',
        description: 'Train to avoid forbidden behaviors and patterns',
        icon: 'block',
        difficulty: 'hard',
        impactScore: 8
      },
      {
        id: 'creativity-boost',
        title: 'Creative Enhancement',
        description: 'Improve creative and diverse response generation',
        icon: 'lightbulb',
        difficulty: 'easy',
        impactScore: 5
      },
      {
        id: 'consistency-training',
        title: 'Consistency Building',
        description: 'Build consistent behavior across multiple interactions',
        icon: 'sync',
        difficulty: 'medium',
        impactScore: 6
      },
      {
        id: 'robustness-testing',
        title: 'Robustness Improvement',
        description: 'Increase resilience to edge cases and challenges',
        icon: 'shield',
        difficulty: 'hard',
        impactScore: 9
      }
    ];
  }
}

// GET endpoint to fetch building tool options
export async function GET(request: NextRequest): Promise<NextResponse<BuildingToolsResponse | { error: string }>> {
  try {
    const { searchParams } = new URL(request.url);
    const challengeId = searchParams.get('challengeId');
    const userId = searchParams.get('userId');
    const chatId = searchParams.get('chatId');

    if (!challengeId || !userId) {
      return NextResponse.json(
        { error: 'Missing required parameters: challengeId, userId' },
        { status: 400 }
      );
    }

    // Check if we have stored options for this session
    let storedOptions = null;
    let previousOptions: string[] = [];

    if (chatId) {
      // Try to fetch existing building tools from chat session
      const chat = await prisma.chat.findUnique({
        where: { id: chatId, userId },
        select: { 
          id: true,
          messages: {
            where: { type: 'building_tools' },
            orderBy: { createdAt: 'desc' },
            take: 1
          }
        }
      });

      if (chat?.messages && chat.messages.length > 0) {
        const lastToolsMessage = chat.messages[0];
        storedOptions = lastToolsMessage.content;
        
        // Extract previous option IDs from user messages
        const userMessages = await prisma.message.findMany({
          where: { 
            chatId,
            type: 'user',
            content: { startsWith: 'TOOL_SELECTED:' }
          },
          select: { content: true }
        });
        
        previousOptions = userMessages.map(msg => 
          msg.content.replace('TOOL_SELECTED:', '').trim()
        );
      }
    }

    let options: BuildingToolOption[];

    if (storedOptions) {
      // Use stored options
      try {
        options = JSON.parse(storedOptions);
      } catch (error) {
        console.error('Error parsing stored options:', error);
        options = await generateBuildingTools(challengeId, userId, previousOptions);
      }
    } else {
      // Generate new options
      options = await generateBuildingTools(challengeId, userId, previousOptions);
    }

    const response: BuildingToolsResponse = {
      options,
      sessionId: chatId || 'new-session',
      lastUpdated: new Date().toISOString()
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Error fetching building tools:', error);
    return NextResponse.json(
      { error: `Internal server error: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
}

// POST endpoint to save selected building tool and process it
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const { userId, challengeId, chatId, selectedToolId, toolData } = body;

    if (!userId || !challengeId || !selectedToolId) {
      return NextResponse.json(
        { error: 'Missing required fields: userId, challengeId, selectedToolId' },
        { status: 400 }
      );
    }

    // Store the selection as a message
    if (chatId) {
      await prisma.message.create({
        data: {
          chatId,
          type: 'user',
          content: `TOOL_SELECTED:${selectedToolId}`,
          turnNumber: 0, // Will be updated by the main chat logic
        }
      });
    }

    // Process the tool selection through the main run_challenge logic
    const toolPrompt = `Apply building tool: ${toolData.title}. ${toolData.description}. Focus on: ${toolData.impactScore}/10 impact.`;

    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/run_challenge`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        challengeId,
        prompt: toolPrompt,
        chatId,
        isBuildingTool: true,
        toolData
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Failed to process building tool');
    }

    return NextResponse.json(result);

  } catch (error) {
    console.error('Error processing building tool selection:', error);
    return NextResponse.json(
      { error: `Internal server error: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
}
