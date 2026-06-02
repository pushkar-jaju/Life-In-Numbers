import { NextRequest, NextResponse } from 'next/server';
import { Webhook } from 'svix';
import { supabaseAdmin } from '@/lib/supabase';

/**
 * Clerk Webhook Handler
 * Auto-syncs users to Supabase when they sign up or update profile
 */

const webhookSecret = process.env.CLERK_WEBHOOK_SECRET || '';

export async function POST(request: NextRequest) {
  try {
    // Verify webhook signature
    const headerPayload = {
      'svix-id': request.headers.get('svix-id') || '',
      'svix-timestamp': request.headers.get('svix-timestamp') || '',
      'svix-signature': request.headers.get('svix-signature') || '',
    };

    const body = await request.text();

    const wh = new Webhook(webhookSecret);
    let payload;

    try {
      payload = wh.verify(body, headerPayload) as any;
    } catch (err) {
      console.error('[Webhook] Invalid signature:', err);
      return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 401 });
    }

    const data = payload.data;

    const clerkUser = data;

    // Only process user creation and update events
    const eventType = payload.type;
    if (!['user.created', 'user.updated'].includes(eventType)) {
      console.log('[Webhook] Ignoring event type:', eventType);
      return NextResponse.json({ success: true, ignored: true });
    }
    const userId = clerkUser.id;
    const email = clerkUser.email_addresses?.[0]?.email_address || '';
    const firstName = clerkUser.first_name || '';
    const lastName = clerkUser.last_name || '';
    const avatarUrl = clerkUser.image_url || '';

    // Upsert user to Supabase
    const { data: userData, error: userError } = await supabaseAdmin
      .from('users')
      .upsert(
        {
          clerk_id: userId,
          email,
          first_name: firstName,
          last_name: lastName,
          avatar_url: avatarUrl,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: 'clerk_id',
        }
      )
      .select()
      .single();

    if (userError) {
      console.error('[Webhook] User sync error:', userError);
      return NextResponse.json(
        { error: 'Failed to sync user', details: userError.message },
        { status: 500 }
      );
    }

    // Create user_settings if new user
    const databaseUserId = userData?.id;

    const { data: existingSettings } = await supabaseAdmin
      .from('user_settings')
      .select('id')
      .eq('user_id', databaseUserId)
      .single();

    if (!existingSettings) {
      const { error: settingsError } = await supabaseAdmin.from('user_settings').insert({
        user_id: databaseUserId,
        tracking_enabled: true,
        dark_mode: true,
        notifications_enabled: true,
        keyboard_tracking: true,
        tab_tracking: true,
        browsing_time_tracking: true,
        privacy_mode: false,
        data_retention_days: 365,
      });

      if (settingsError) {
        console.error('[Webhook] Settings creation error:', settingsError);
      }
    }

    console.log('[Webhook] User synced:', userId);

    return NextResponse.json({
      success: true,
      message: 'User synced to Supabase',
    });
  } catch (error) {
    console.error('[Webhook Error]', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
