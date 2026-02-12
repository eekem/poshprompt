import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';

interface BuildRequest {
  sessionId: string;
  selectedToolSlugs: string[];
}

interface BuildResponse {
  strength: number;
  newTotalStrength: number;
  remainingPrompts: number;
  breakdown: {
    baseScore: number;
    diversityBonus: number;
    synergyBonus: number;
    totalPromptCost: number;
  };
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: challengeId } = await params;
    const body: BuildRequest = await request.json();
    const { sessionId, selectedToolSlugs } = body;

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

    if (!session.pointMap) {
      return NextResponse.json(
        { error: 'Session point map not configured' },
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

    // Calculate total prompt cost
    const totalPromptCost = selectedTools.reduce((sum, tool) => sum + tool.promptCost, 0);

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

    // Calculate strength using the formula
    const pointMap = session.pointMap;
    
    // Base score calculation
    const baseScore = totalPromptCost * pointMap.baseMultiplier;

    // Diversity bonus calculation
    const selectedCategories = new Set(selectedTools.map(tool => tool.categoryId));
    const diversityBonus = selectedCategories.size > 1 ? pointMap.categoryDiversityBonus : 0;

    // Synergy bonus calculation
    let synergyBonus = 0;
    const selectedToolSlugsSet = new Set(selectedToolSlugs);
    
    for (const rule of pointMap.synergyRules as any[]) {
      const ruleTools = rule.tools as string[];
      const isRuleSatisfied = ruleTools.every(toolSlug => selectedToolSlugsSet.has(toolSlug));
      
      if (isRuleSatisfied) {
        synergyBonus += rule.bonus;
      }
    }

    // Calculate final strength
    const rawStrength = baseScore + diversityBonus + synergyBonus;
    const finalStrength = Math.min(rawStrength, pointMap.maxStrength);

    // Deduct prompt credits
    await prisma.user.update({
      where: { id: userId },
      data: {
        prompts: { decrement: totalPromptCost }
      }
    });

    // Save build record
    await prisma.build.create({
      data: {
        userId,
        challengeId,
        sessionId,
        selectedTools: selectedToolSlugs,
        strength: finalStrength
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
      breakdown: {
        baseScore: Math.round(baseScore),
        diversityBonus,
        synergyBonus,
        totalPromptCost
      }
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
