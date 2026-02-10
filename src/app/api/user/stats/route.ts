import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Get user's current stats
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { 
        prompts: true,
        earnedXps: true,
        earnedBalance: true
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Get total XP from all completed chats
    const totalXpResult = await prisma.chat.aggregate({
      where: {
        userId: userId,
      },
      _sum: {
        earnedXp: true,
      },
    });

    // Calculate earnedBalance (10% of total XP)
    const totalXP = totalXpResult._sum.earnedXp || 0;
    const calculatedEarnedBalance = Math.floor(totalXP * 0.1);

    // Update user's earnedXps and earnedBalance if different
    await prisma.user.update({
      where: { id: userId },
      data: {
        earnedXps: totalXP,
        earnedBalance: calculatedEarnedBalance,
      },
    });

    // Get total challenges count (unique challenge IDs)
    const totalChallengesResult = await prisma.chat.findMany({
      where: {
        userId: userId,
      },
      select: {
        challengeId: true,
      },
      distinct: ['challengeId'],
    });

    // Get ongoing challenges (chats without completion or with low turn count)
    const ongoingChallengesResult = await prisma.chat.count({
      where: {
        userId: userId,
        currentTurn: {
          lte: 3, // Consider challenges with <= 3 turns as ongoing
        },
      },
    });

    // Get total prompts used (all user messages)
    const totalPromptsResult = await prisma.message.count({
      where: {
        chat: {
          userId: userId,
        },
        type: 'user',
      },
    });

    const stats = {
      user: {
        prompts: user.prompts,
        earnedXps: user.earnedXps,
        earnedBalance: calculatedEarnedBalance,
      },
      totalXP: totalXP,
      totalChallenges: totalChallengesResult.length,
      ongoingChallenges: ongoingChallengesResult,
      totalPrompts: user.prompts,
      earnedBalance: calculatedEarnedBalance,
      earnedXps: user.earnedXps,
    };

    return NextResponse.json(stats);

  } catch (error) {
    console.error('Error fetching user stats:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch user stats',
        user: { prompts: 0, earnedXps: 0, earnedBalance: 0.0 },
        totalXP: 0,
        totalChallenges: 0,
        ongoingChallenges: 0,
        totalPrompts: 0,
        earnedBalance: 0.0,
        earnedXps: 0,
      },
      { status: 500 }
    );
  }
}
