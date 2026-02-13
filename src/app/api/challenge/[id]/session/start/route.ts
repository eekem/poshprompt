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
    // New operation system
    operation: {
      type: 'add' | 'subtract' | 'multiply' | 'divide' | 'power' | 'modulus';
      value: number; // Hidden value for calculation
      strength: number; // Visible strength meter (1-10)
    };
    // Legacy features for compatibility
    features?: {
      robustness?: number;
      accuracy?: number;
      stability?: number;
      creativity?: number;
      efficiency?: number;
      hallucination_risk?: number;
    };
  }>;
  sessionTips: Array<{
    icon: string;
    text: string;
    color: string;
  }>;
  pointMap: {
    focus_display: {
      robustness: number;
      accuracy: number;
      stability: number;
      creativity: number;
      efficiency: number;
    };
    expectations: {
      robustness: number;
      accuracy: number;
      stability: number;
      creativity: number;
      efficiency: number;
    };
    penalties: {
      hallucination_risk: number;
      over_creativity: number;
      latency_overflow: number;
    };
    feature_caps: {
      creativity: number;
      efficiency: number;
    };
    difficulty_curve: {
      k: number;
      t: number;
    };
    tools: Array<{
      slug: string;
      category: string;
      prompt_cost: number;
      operation: {
        type: 'add' | 'subtract' | 'multiply' | 'divide' | 'power' | 'modulus';
        value: number;
        strength: number;
      };
      features?: {
        robustness?: number;
        accuracy?: number;
        stability?: number;
        creativity?: number;
        efficiency?: number;
        hallucination_risk?: number;
      };
    }>;
    archetypes: Array<{
      type: 'Guardian' | 'SpeedRunner' | 'Creator';
      meta_shift: string;
      expectations: {
        robustness?: number;
        accuracy?: number;
        stability?: number;
        creativity?: number;
        efficiency?: number;
        adaptability?: number;
      };
    }>;
    platformMetadata: {
      title: string;
      description: string;
      goal: string;
      difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
    };
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
    const toolCount = getToolCount(challenge.difficulty || undefined);
    const grokPrompt = `Generate building tools and scoring for this challenge: "${challenge.title}" - ${challenge.description}. Goal: ${challenge.goal || 'Build the best AI model'}. Difficulty: ${challenge.difficulty || 'Intermediate'}. Return JSON in this exact format:

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
      "promptCost": 4,
      "operation": {
        "type": "add",
        "value": 15,
        "strength": 7
      },
      "features": {
        "robustness": 8,
        "accuracy": 12,
        "stability": 6,
        "creativity": 2,
        "efficiency": 4
      }
    },
    {
      "slug": "emotion-tone-analyzer",
      "title": "Emotion Tone Analyzer",
      "description": "Analyze and optimize emotional appeal.",
      "icon": "mood",
      "categorySlug": "processing",
      "promptCost": 6,
      "operation": {
        "type": "multiply",
        "value": 3,
        "strength": 8
      },
      "features": {
        "robustness": 6,
        "accuracy": 10,
        "stability": 8,
        "creativity": 8,
        "efficiency": -2,
        "hallucination_risk": 4
      }
    }
  ],
  "sessionTips": [
    {
      "icon": "trending_up",
      "text": "Tools with higher strength meters have greater impact on your formula",
      "color": "text-green-400"
    },
    {
      "icon": "calculate", 
      "text": "Combine different operation types (add, multiply, divide) for complex formulas",
      "color": "text-blue-400"
    },
    {
      "icon": "auto_awesome",
      "text": "Hidden values are calculated using BODMAS - order matters!",
      "color": "text-primary"
    }
  ],
  "pointMap": {
    "focus_display": {
      "robustness": 4,
      "accuracy": 5,
      "stability": 3,
      "creativity": 1,
      "efficiency": 2
    },
    "expectations": {
      "robustness": 0.30,
      "accuracy": 0.35,
      "stability": 0.15,
      "creativity": 0.05,
      "efficiency": 0.15
    },
    "penalties": {
      "hallucination_risk": 0.40,
      "over_creativity": 0.25,
      "latency_overflow": 0.15
    },
    "feature_caps": {
      "creativity": 60,
      "efficiency": 90
    },
    "difficulty_curve": {
      "k": 0.08,
      "t": 55
    },
    "tools": [
      {
        "slug": "strict_instruction_layer",
        "category": "Prompt Framing",
        "prompt_cost": 2,
        "operation": {
          "type": "subtract",
          "value": 8,
          "strength": 5
        },
        "features": {
          "robustness": 12,
          "accuracy": 8,
          "creativity": -4,
          "efficiency": -2
        }
      },
      {
        "slug": "multi_step_reasoning",
        "category": "Reasoning",
        "prompt_cost": 3,
        "operation": {
          "type": "divide",
          "value": 2,
          "strength": 6
        },
        "features": {
          "robustness": 6,
          "accuracy": 10,
          "efficiency": -6
        }
      }
    ],
    "archetypes": [
      {
        "type": "Guardian",
        "meta_shift": "Conservative",
        "expectations": {
          "robustness": 0.30,
          "accuracy": 0.40,
          "stability": 0.15,
          "creativity": 0.05,
          "efficiency": 0.10
        }
      },
      {
        "type": "SpeedRunner", 
        "meta_shift": "Performance",
        "expectations": {
          "efficiency": 0.40,
          "stability": 0.25,
          "robustness": 0.15,
          "accuracy": 0.10,
          "creativity": 0.10
        }
      },
      {
        "type": "Creator",
        "meta_shift": "Expressive", 
        "expectations": {
          "creativity": 0.35,
          "adaptability": 0.25,
          "accuracy": 0.15,
          "robustness": 0.10,
          "efficiency": 0.15
        }
      }
    ],
    "platformMetadata": {
      "title": "${challenge.title}",
      "description": "${challenge.description}",
      "goal": "Maximize formula complexity while balancing features.",
      "difficulty": "${challenge.difficulty || 'Intermediate'}"
    }
  }
}

Requirements:
- Generate exactly ${toolCount} tools total
- Create 3-5 categories
- Each tool should have promptCost between 1-10
- Each tool MUST have an operation with type (add/subtract/multiply/divide/power/modulus), value (hidden calculation value), and strength (visible 1-10 meter)
- Operation values should range from -20 to +30
- Strength meters should range from 1-10 and reflect the tool's relevance to the challenge goal
- Generate 3-5 session tips about operations and formula building
- Make it creative and challenging
- Tools should be realistic AI/ML components
- Icons should be material-symbols-outlined names
- Higher strength tools should be more relevant to the challenge goal
- Include a mix of operation types for strategic variety
- Power and modulus operations should be rarer and have higher strength
- ALL tools must have operation defined
- Operation type should influence the tool's primary features (add=robustness, multiply=efficiency, divide=accuracy, power=creativity, etc.)`;

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
        
        // Check if response is truncated (missing required fields)
        if (!grokResponse.pointMap.focus_display) {
          console.warn('Response appears truncated, generating default pointMap data');
          // Generate a default pointMap if missing
          grokResponse.pointMap = {
            focus_display: {
              robustness: 4,
              accuracy: 5,
              stability: 3,
              creativity: 1,
              efficiency: 2
            },
            expectations: {
              robustness: 0.30,
              accuracy: 0.35,
              stability: 0.15,
              creativity: 0.05,
              efficiency: 0.15
            },
            penalties: {
              hallucination_risk: 0.40,
              over_creativity: 0.25,
              latency_overflow: 0.15
            },
            feature_caps: {
              creativity: 60,
              efficiency: 90
            },
            difficulty_curve: {
              k: 0.08,
              t: 55
            },
            tools: grokResponse.tools.map(tool => ({
              slug: tool.slug,
              category: tool.categorySlug,
              prompt_cost: tool.promptCost,
              operation: tool.operation,
              features: tool.features || {
                robustness: 5,
                accuracy: 5,
                stability: 5,
                creativity: 5,
                efficiency: 5
              }
            })),
            archetypes: [
              {
                type: 'Guardian',
                meta_shift: 'Conservative',
                expectations: {
                  robustness: 0.30,
                  accuracy: 0.40,
                  stability: 0.15,
                  creativity: 0.05,
                  efficiency: 0.10
                }
              }
            ],
            platformMetadata: {
              title: challenge.title,
              description: challenge.description,
              goal: "Maximize factual accuracy and robustness while minimizing hallucination risk.",
              difficulty: (challenge.difficulty || 'Intermediate') as 'Beginner' | 'Intermediate' | 'Advanced'
            }
          };
        }
        
        // Validate response structure
        if (!grokResponse.categories || !grokResponse.tools || !grokResponse.pointMap) {
          console.error('Missing fields:', {
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

    console.log('Created categories:', createdCategories.map(c => ({ id: c.id, slug: c.slug, title: c.title })));
    console.log('Tools to create:', grokResponse!.tools.map(t => ({ slug: t.slug, categorySlug: t.categorySlug })));

    // Create tools with v2 features
    await Promise.all(
      grokResponse!.tools.map(async tool => {
        let category = createdCategories.find(c => c.slug === tool.categorySlug);
        
        // If category not found, try to find a matching one or create it
        if (!category) {
          console.warn(`Category not found for tool: ${tool.slug} with categorySlug: ${tool.categorySlug}`);
          
          // Try to find a category with similar name
          const similarCategory = createdCategories.find(c => 
            c.slug.toLowerCase().includes(tool.categorySlug?.toLowerCase() || '') ||
            tool.categorySlug?.toLowerCase().includes(c.slug.toLowerCase())
          );
          
          if (similarCategory) {
            category = similarCategory;
            console.log(`Using similar category: ${similarCategory.slug} for tool: ${tool.slug}`);
          } else {
            // Create the missing category on the fly
            console.log(`Creating missing category: ${tool.categorySlug} for tool: ${tool.slug}`);
            const newCategory = await prisma.sessionCategory.create({
              data: {
                slug: tool.categorySlug,
                title: tool.categorySlug.charAt(0).toUpperCase() + tool.categorySlug.slice(1).replace('-', ' '),
                sessionId: session.id
              }
            });
            category = newCategory;
            createdCategories.push(newCategory); // Add to the list for future tools
            console.log(`Created new category: ${newCategory.slug} for tool: ${tool.slug}`);
          }
        }
        
        return prisma.sessionTool.create({
          data: {
            slug: tool.slug,
            title: tool.title,
            description: tool.description,
            icon: tool.icon,
            promptCost: tool.promptCost,
            features: tool.features, // Store v2 features
            categoryId: category.id,
            sessionId: session.id
          }
        });
      })
    );

    // Create pointMap with V2 data only
    if (grokResponse!.pointMap) {
      await prisma.sessionPointMap.create({
        data: {
          v2Data: grokResponse!.pointMap, // Store the entire pointMap as v2Data for now
          archetypes: grokResponse!.pointMap.archetypes,
          platformMetadata: grokResponse!.pointMap.platformMetadata,
          sessionId: session.id
        }
      });
    }

    return NextResponse.json({
      success: true,
      sessionId: session.id,
      categories: grokResponse!.categories,
      tools: grokResponse!.tools,
      sessionTips: grokResponse!.sessionTips,
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
