import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';

interface CreateModelRequest {
  title: string;
  image: string;
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: challengeId } = await params;
    const body: CreateModelRequest = await request.json();
    const { title, image } = body;

    // Get user ID from request
    const userId = request.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json(
        { error: 'User not authenticated' },
        { status: 401 }
      );
    }

    // Validate input
    if (!title || !image) {
      return NextResponse.json(
        { error: 'Model name and image are required' },
        { status: 400 }
      );
    }

    if (title.trim().length < 3) {
      return NextResponse.json(
        { error: 'Model name must be at least 3 characters long' },
        { status: 400 }
      );
    }

    // Check if user already has a model for this challenge
    const existingModel = await prisma.miniModel.findFirst({
      where: {
        userId,
        challengeId
      }
    });

    if (existingModel) {
      return NextResponse.json(
        { error: 'You already have a model for this challenge' },
        { status: 400 }
      );
    }

    // Verify challenge exists
    const challenge = await prisma.challenge.findUnique({
      where: { id: challengeId }
    });

    if (!challenge) {
      return NextResponse.json(
        { error: 'Challenge not found' },
        { status: 404 }
      );
    }

    // Create a new building session for model
    const session = await prisma.buildingSession.create({
      data: {
        userId,
        challengeId,
      }
    });

    // Create the mini model
    const miniModel = await prisma.miniModel.create({
      data: {
        userId,
        challengeId,
        sessionId: session.id,
        title: title.trim(),
        description: `AI model for ${challenge.title}`,
        image: image,
        systemPrompt: `You are an AI assistant designed to help with: ${challenge.description}`,
        finalScore: 0,
        robustnessScore: 0,
        totalXp: 0,
        coinsEarned: 0,
        isPublic: false,
        isPublished: false
      }
    });

    return NextResponse.json({
      success: true,
      model: {
        id: miniModel.id,
        title: miniModel.title,
        description: miniModel.description,
        image: image,
        finalScore: miniModel.finalScore,
        createdAt: miniModel.createdAt
      }
    });

  } catch (error) {
    console.error('Error creating model:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: challengeId } = await params;
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Check if user has a model for this challenge
    const model = await prisma.miniModel.findFirst({
      where: {
        userId,
        challengeId
      },
      select: {
        id: true,
        title: true,
        description: true,
        image: true,
        finalScore: true,
        totalXp: true,
        coinsEarned: true,
        createdAt: true
      }
    });

    return NextResponse.json({
      success: true,
      hasModel: !!model,
      model: model
    });

  } catch (error) {
    console.error('Error checking model:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
