import { NextRequest, NextResponse } from 'next/server';
import { Groq } from 'groq-sdk';
import { prisma } from '@/app/lib/prisma';

// Initialize Groq client
const groq = new Groq({
  apiKey: process.env.HUGGINGFACE_API_KEY
});

// Helper function to calculate tool count based on difficulty
function getToolCount(difficulty?: string): number {
  switch (difficulty?.toLowerCase()) {
    case 'easy':
      return Math.floor(Math.random() * 11) + 10; // 10-20 tools
    case 'medium':
      return Math.floor(Math.random() * 16) + 20; // 20-35 tools
    case 'hard':
      return Math.floor(Math.random() * 16) + 35; // 35-50 tools
    case 'expert':
      return Math.floor(Math.random() * 21) + 50; // 50-70 tools
    default:
      return Math.floor(Math.random() * 21) + 10; // 10-30 tools for undefined difficulty
  }
}

interface GrokChallengeResponse {
  title: string;
  description: string;
  categories: Array<{
    slug: string;
    title: string;
  }>;
  tools: Array<{
    slug: string;
    title: string;
    description: string;
    icon: string;
    categorySlug: string;
    promptCost: number;
  }>;
  pointMap: {
    baseMultiplier: number;
    synergyRules: Array<{
      tools: string[];
      bonus: number;
    }>;
    categoryDiversityBonus: number;
    maxStrength: number;
  };
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: challengeId } = await params;

    // Fetch existing challenge
    const challenge = await prisma.challenge.findUnique({
      where: { id: challengeId }
    });

    if (!challenge) {
      return NextResponse.json(
        { error: 'Challenge not found' },
        { status: 404 }
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

    // Generate new challenge content using Grok (for reference/example)
    const toolCount = getToolCount(challenge.difficulty || undefined);
    const grokPrompt = `Generate a challenging AI building scenario with tools and synergy mapping. Return JSON in this exact format:

{
  "title": "AI Email Copy Generator",
  "description": "Build a mini-model capable of generating high-converting marketing emails.",
  "categories": [
    {
      "slug": "data-sources",
      "title": "Data Sources"
    },
    {
      "slug": "processing",
      "title": "Processing"
    },
    {
      "slug": "output",
      "title": "Output"
    }
  ],
  "tools": [
    {
      "slug": "customer-persona-parser",
      "title": "Customer Persona Parser",
      "description": "Extract audience intent and buying triggers.",
      "icon": "user-search",
      "categorySlug": "data-sources",
      "promptCost": 4
    },
    {
      "slug": "emotion-tone-analyzer",
      "title": "Emotion Tone Analyzer",
      "description": "Analyze and optimize emotional appeal.",
      "icon": "mood",
      "categorySlug": "processing",
      "promptCost": 6
    }
  ],
  "pointMap": {
    "baseMultiplier": 1.2,
    "synergyRules": [
      {
        "tools": ["customer-persona-parser", "emotion-tone-analyzer"],
        "bonus": 15
      }
    ],
    "categoryDiversityBonus": 10,
    "maxStrength": 100
  }
}

Requirements:
- Generate exactly ${toolCount} tools total
- Create 3-5 categories
- Each tool should have promptCost between 1-10
- Include 3-8 synergy rules
- Make it creative and challenging
- Tools should be realistic AI/ML components
- Icons should be material-symbols-outlined names`;

    let grokResponse: GrokChallengeResponse;
    let retryCount = 0;
    const maxRetries = 2;

    while (retryCount < maxRetries) {
      try {
        const response = await groq.chat.completions.create({
          model: 'llama-3.1-8b-instant',
          messages: [
            {
              role: 'system',
              content: 'You are an AI challenge designer. Generate valid JSON responses only.'
            },
            {
              role: 'user',
              content: grokPrompt
            }
          ],
          max_tokens: 4000, // Increased for higher tool counts
          temperature: 0.8,
          response_format: { type: 'json_object' }
        });

        const content = response.choices[0]?.message?.content;
        if (!content) {
          throw new Error('No response from Grok');
        }

        grokResponse = JSON.parse(content);
        
        console.log('Grok response received:', JSON.stringify(grokResponse, null, 2));
        
        // Validate response structure
        if (!grokResponse.title || !grokResponse.categories || !grokResponse.tools || !grokResponse.pointMap) {
          console.error('Missing fields:', {
            title: !!grokResponse.title,
            categories: !!grokResponse.categories,
            tools: !!grokResponse.tools,
            pointMap: !!grokResponse.pointMap
          });
          throw new Error('Invalid response structure');
        }

        break; // Success, exit retry loop
      } catch (error) {
        console.error(`Grok API attempt ${retryCount + 1} failed:`, error);
        retryCount++;
        
        if (retryCount >= maxRetries) {
          return NextResponse.json(
            { error: 'Failed to generate challenge content after retries' },
            { status: 500 }
          );
        }
      }
    }

    // Update challenge with new version
    const updatedChallenge = await prisma.challenge.update({
      where: { id: challengeId },
      data: {
        title: grokResponse!.title,
        description: grokResponse!.description,
        updatedAt: new Date()
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Challenge updated. Use session start endpoint to create building sessions with new content.',
      challenge: {
        id: updatedChallenge.id,
        title: updatedChallenge.title,
        description: updatedChallenge.description,
        exampleContent: {
          categories: grokResponse!.categories,
          tools: grokResponse!.tools,
          pointMap: grokResponse!.pointMap
        }
      }
    });

  } catch (error) {
    console.error('Error regenerating challenge:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
