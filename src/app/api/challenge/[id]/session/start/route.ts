import { NextRequest, NextResponse } from 'next/server';
import { Groq } from 'groq-sdk';
import { prisma } from '@/app/lib/prisma';

// Initialize Groq client
const groq = new Groq({
  apiKey: process.env.HUGGINGFACE_API_KEY
});

interface GrokSessionResponse {
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

    // Get user ID from request
    const userId = request.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json(
        { error: 'User not authenticated' },
        { status: 401 }
      );
    }

    // Fetch challenge
    const challenge = await prisma.challenge.findUnique({
      where: { id: challengeId }
    });

    if (!challenge) {
      return NextResponse.json(
        { error: 'Challenge not found' },
        { status: 404 }
      );
    }

    // Close any existing active sessions for this user and challenge
    await prisma.buildingSession.updateMany({
      where: {
        userId,
        challengeId,
        isActive: true
      },
      data: {
        isActive: false,
        updatedAt: new Date()
      }
    });

    // Generate session content using Grok
    const grokPrompt = `Generate building tools and scoring for this challenge: "${challenge.title}" - ${challenge.description}. Return JSON in this exact format:

{
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
- Generate 15-25 tools total
- Create 3-5 categories
- Each tool should have promptCost between 1-10
- Include 3-8 synergy rules
- Make it creative and challenging
- Tools should be realistic AI/ML components
- Icons should be material-symbols-outlined names`;

    let grokResponse: GrokSessionResponse;
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
          max_tokens: 2000,
          temperature: 0.8,
          response_format: { type: 'json_object' }
        });

        const content = response.choices[0]?.message?.content;
        if (!content) {
          throw new Error('No response from Grok');
        }

        grokResponse = JSON.parse(content);
        
        // Validate response structure
        if (!grokResponse.categories || !grokResponse.tools || !grokResponse.pointMap) {
          throw new Error('Invalid response structure');
        }

        break; // Success, exit retry loop
      } catch (error) {
        console.error(`Grok API attempt ${retryCount + 1} failed:`, error);
        retryCount++;
        
        if (retryCount >= maxRetries) {
          return NextResponse.json(
            { error: 'Failed to generate session content after retries' },
            { status: 500 }
          );
        }
      }
    }

    // Create new building session
    const session = await prisma.buildingSession.create({
      data: {
        challengeId,
        userId,
        isActive: true
      }
    });

    // Create categories
    const createdCategories = await Promise.all(
      grokResponse!.categories.map(category =>
        prisma.sessionCategory.create({
          data: {
            slug: category.slug,
            title: category.title,
            sessionId: session.id
          }
        })
      )
    );

    // Create tools
    await Promise.all(
      grokResponse!.tools.map(tool => {
        const category = createdCategories.find(c => c.slug === tool.categorySlug);
        if (!category) {
          throw new Error(`Category not found for tool: ${tool.slug}`);
        }
        
        return prisma.sessionTool.create({
          data: {
            slug: tool.slug,
            title: tool.title,
            description: tool.description,
            icon: tool.icon,
            promptCost: tool.promptCost,
            categoryId: category.id,
            sessionId: session.id
          }
        });
      })
    );

    // Create pointMap
    if (grokResponse!.pointMap) {
      await prisma.sessionPointMap.create({
        data: {
          baseMultiplier: grokResponse!.pointMap.baseMultiplier,
          categoryDiversityBonus: grokResponse!.pointMap.categoryDiversityBonus,
          maxStrength: grokResponse!.pointMap.maxStrength,
          synergyRules: grokResponse!.pointMap.synergyRules,
          sessionId: session.id
        }
      });
    }

    return NextResponse.json({
      success: true,
      sessionId: session.id,
      categories: grokResponse!.categories,
      tools: grokResponse!.tools,
      pointMap: grokResponse!.pointMap
    });

  } catch (error) {
    console.error('Error starting building session:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
