import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

/**
 * POST /api/auth/sync-user
 * Syncs Clerk user to database when user signs up
 */
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Note: In production, use Supabase client to sync user to database
    // For now, just return success - webhook will handle sync
    return NextResponse.json({
      success: true,
      message: 'User sync will be handled by webhook',
      userId,
    });
  } catch (error) {
    console.error('Auth sync error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
