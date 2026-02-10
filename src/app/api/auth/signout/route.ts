import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/app/lib/auth';

export async function POST(request: NextRequest) {
  try {
    await auth.api.signOut({
      headers: request.headers,
    });

    const response = NextResponse.json({ success: true });
    
    // Clear auth cookies
    response.cookies.set('better-auth.session_token', '', {
      expires: new Date(0),
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Error signing out:', error);
    return NextResponse.json(
      { error: 'Failed to sign out' },
      { status: 500 }
    );
  }
}
