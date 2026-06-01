import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { supabaseAdmin } from '@/lib/supabase';
import { randomBytes } from 'crypto';

/**
 * Generate a shareable card for stats
 * POST /api/share/generate
 */

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = await request.json();

    // Validate payload
    if (
      payload.keyboardPresses === undefined ||
      payload.tabsOpened === undefined
    ) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Generate unique share slug
    const cardSlug = randomBytes(8).toString('hex');

    // Store share card in database
    const { data, error } = await supabaseAdmin
      .from('share_cards')
      .insert({
        user_id: userId,
        card_slug: cardSlug,
        title: `Stats for ${payload.date}`,
        stats_json: {
          date: payload.date,
          keyboardPresses: payload.keyboardPresses,
          tabsOpened: payload.tabsOpened,
          browsingTimeMinutes: payload.browsingTimeMinutes,
        },
        is_public: true,
        expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      })
      .select();

    if (error) {
      console.error('[Share Card Error]', error);
      return NextResponse.json(
        { error: 'Failed to generate share card: ' + error.message },
        { status: 500 }
      );
    }

    const shareUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001'}/share/${cardSlug}`;

    return NextResponse.json({
      success: true,
      cardId: cardSlug,
      shareUrl,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    });
  } catch (error) {
    console.error('[Share Generate Error]', error);
    return NextResponse.json(
      { error: 'Failed to generate share card' },
      { status: 500 }
    );
  }
}

