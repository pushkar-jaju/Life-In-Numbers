import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

/**
 * GET /api/stats/daily
 * Retrieve daily statistics for current user
 */
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date'); // Format: YYYY-MM-DD

    // TODO: Query Supabase for user's daily stats
    // For MVP, return mock data
    return NextResponse.json({
      date: date || new Date().toISOString().split('T')[0],
      keyboardPresses: 0,
      tabsOpened: 0,
      browsingTimeMinutes: 0,
      sessionDurationMinutes: 0,
    });
  } catch (error) {
    console.error('Stats error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/stats/daily
 * Log daily statistics from extension
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

    const body = await request.json();
    const { date, keyboardPresses, tabsOpened, browsingTimeMinutes, sessionDurationMinutes } = body;

    // Validate input
    if (!date || typeof keyboardPresses !== 'number') {
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      );
    }

    // TODO: Insert/update in Supabase
    return NextResponse.json({
      success: true,
      message: 'Daily stats recorded',
    });
  } catch (error) {
    console.error('Stats post error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
