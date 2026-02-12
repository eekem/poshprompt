import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';

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

    // Fetch user's builds for this challenge
    const builds = await prisma.build.findMany({
      where: {
        userId,
        challengeId
      },
      select: {
        strength: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Calculate total strength
    const totalStrength = builds.reduce((sum, build) => sum + build.strength, 0);

    return NextResponse.json({
      success: true,
      totalStrength: Math.round(totalStrength),
      buildCount: builds.length,
      builds: builds.map(build => ({
        strength: Math.round(build.strength)
      }))
    });

  } catch (error) {
    console.error('Error fetching builds:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
