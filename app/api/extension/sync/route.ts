import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { supabaseAdmin } from '@/lib/supabase';

/**
 * Sync daily activity stats from browser extension to backend
 * POST /api/extension/sync
 */

interface SyncPayload {
  date: string;
  keyboardPresses: number;
  tabsOpened: number;
  browsingTimeMinutes: number;
  sessionDurationMinutes?: number;
}

export async function POST(request: NextRequest) {
  try {
    // Authenticate request
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse payload
    const payload: SyncPayload = await request.json();

    // Validate required fields
    if (!payload.date || payload.keyboardPresses === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields: date, keyboardPresses' },
        { status: 400 }
      );
    }

    // Insert/update stats in database
    const { data, error } = await supabaseAdmin
      .from('daily_stats')
      .upsert(
        {
          user_id: userId,
          date: payload.date,
          keyboard_presses: payload.keyboardPresses,
          tabs_opened: payload.tabsOpened,
          browsing_time_minutes: payload.browsingTimeMinutes,
          session_duration_minutes: payload.sessionDurationMinutes || 0,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_id,date' }
      )
      .select();

    if (error) {
      console.error('[Supabase Error]', error);
      return NextResponse.json(
        { error: 'Failed to sync stats: ' + error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      date: payload.date,
      userId,
      data,
      message: 'Stats synced successfully',
    });
  } catch (error) {
    console.error('[Extension Sync Error]', error);
    return NextResponse.json(
      { error: 'Failed to sync stats' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json({
    status: 'ok',
    message: 'Extension sync API ready',
  });
}

