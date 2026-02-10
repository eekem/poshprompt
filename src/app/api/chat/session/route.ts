import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';

// GET method to fetch the latest chat session for a user and challenge
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const challengeId = searchParams.get('challengeId');

    if (!userId || !challengeId) {
      return NextResponse.json(
        { error: 'Missing required query parameters: userId and challengeId' },
        { status: 400 }
      );
    }

    // Find the most recent chat session for this user and challenge
    const chat = await prisma.chat.findFirst({
      where: {
        userId,
        challengeId,
        isActive: true,
      },
      orderBy: {
        updatedAt: 'desc',
      },
      include: {
        messages: {
          orderBy: {
            turnNumber: 'asc',
          },
        },
      },
    });

    if (!chat) {
      return NextResponse.json(
        { error: 'No active chat session found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      chatId: chat.id,
      totalScore: chat.totalScore,
      earnedXp: chat.earnedXp,
      currentTurn: chat.currentTurn,
      messages: chat.messages.map(msg => ({
        id: msg.id,
        type: msg.type,
        content: msg.content,
        score: msg.score,
        breakdown: msg.breakdown,
        turnNumber: msg.turnNumber,
        createdAt: msg.createdAt,
      })),
    });

  } catch (error) {
    console.error('Error fetching chat session:', error);
    return NextResponse.json(
      { error: `Internal server error: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
}
