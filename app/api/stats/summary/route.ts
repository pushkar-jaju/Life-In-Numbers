import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

/**
 * GET /api/stats/summary
 * Get aggregated statistics (weekly/monthly)
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
    const period = searchParams.get('period') || 'week'; // 'week' or 'month'

    // TODO: Query Supabase for aggregated stats
    return NextResponse.json({
      period,
      data: {
        totalKeyboardPresses: 0,
        totalTabsOpened: 0,
        totalBrowsingTimeMinutes: 0,
        daysTracked: 0,
      },
    });
  } catch (error) {
    console.error('Summary error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
