import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

/**
 * Clerk Webhook Handler
 * Auto-syncs users to Supabase when they sign up or update profile
 */

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();

    if (!payload.data) {
      return NextResponse.json(
        { error: 'Invalid payload' },
        { status: 400 }
      );
    }

    const clerkUser = payload.data;

    // Extract user info
    const userId = clerkUser.id;
    const email = clerkUser.email_addresses?.[0]?.email_address || '';
    const firstName = clerkUser.first_name || '';
    const lastName = clerkUser.last_name || '';
    const avatarUrl = clerkUser.image_url || '';

    // Upsert user to Supabase
    const { error: userError } = await supabaseAdmin
      .from('users')
      .upsert(
        {
          id: userId,
          clerk_id: userId,
          email,
          first_name: firstName,
          last_name: lastName,
          avatar_url: avatarUrl,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'id' }
      );

    if (userError) {
      console.error('[Webhook] User sync error:', userError);
      return NextResponse.json(
        { error: 'Failed to sync user', details: userError.message },
        { status: 500 }
      );
    }

    // Create user_settings if new user
    const { data: existingSettings } = await supabaseAdmin
      .from('user_settings')
      .select('id')
      .eq('user_id', userId)
      .single();

    if (!existingSettings) {
      const { error: settingsError } = await supabaseAdmin
        .from('user_settings')
        .insert({
          user_id: userId,
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
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
