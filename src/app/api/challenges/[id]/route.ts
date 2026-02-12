import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: challengeId } = await params;

    // Fetch challenge from database
    const challenge = await prisma.challenge.findUnique({
      where: { id: challengeId },
    });

    if (!challenge) {
      return NextResponse.json(
        { success: false, error: 'Challenge not found' },
        { status: 404 }
      );
    }

    // Parse the task JSON if it's stored as a string
    const taskData = typeof challenge.task === 'string' 
      ? JSON.parse(challenge.task)
      : challenge.task;

    const challengeData = {
      ...challenge,
      task: taskData
    };

    return NextResponse.json({
      success: true,
      challenge: challengeData
    });

  } catch (error) {
    console.error('Error fetching challenge:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
