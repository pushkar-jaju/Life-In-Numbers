'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

interface ShareCardData {
  id: string;
  user_id: string;
  card_slug: string;
  stats_json: {
    date: string;
    keyboardPresses: number;
    tabsOpened: number;
    browsingTimeMinutes: number;
  };
  created_at: string;
  expires_at: string;
  view_count: number;
}

export default function SharePage({ params }: { params: { id: string } }) {
  const [cardData, setCardData] = useState<ShareCardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCard = async () => {
      try {
        const { data, error } = await supabase
          .from('share_cards')
          .select('*')
          .eq('card_slug', params.id)
          .single();

        if (error || !data) {
          setError('Share card not found or expired');
          return;
        }

        // Check if expired
        if (new Date(data.expires_at) < new Date()) {
          setError('This share card has expired');
          return;
        }

        setCardData(data);

        // Increment view count
        await supabase
          .from('share_cards')
          .update({ view_count: (data.view_count || 0) + 1 })
          .eq('id', data.id);
      } catch (err) {
        setError('Failed to load share card');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCard();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#09090B] via-[#111827] to-[#09090B] flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-bold mb-2">Loading...</div>
          <p className="text-gray-400">Fetching your stats card</p>
        </div>
      </div>
    );
  }

  if (error || !cardData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#09090B] via-[#111827] to-[#09090B] flex items-center justify-center p-4">
        <div className="w-full max-w-md text-center">
          <div className="text-3xl font-bold mb-2">😔</div>
          <p className="text-xl text-gray-300 mb-4">{error || 'Card not found'}</p>
          <Link
            href="/"
            className="inline-block px-6 py-2 bg-[#7C3AED] text-white rounded-lg hover:bg-[#6D28D9] transition"
          >
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  const stats = cardData.stats_json;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#09090B] via-[#111827] to-[#09090B] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">📊 Activity Stats</h1>
          <p className="text-gray-400">
            Shared with Life in Numbers
          </p>
        </div>

        {/* Main Card */}
        <Card className="mb-6 border-2 border-[#7C3AED] p-8">
          <div className="mb-6">
            <p className="text-gray-400 text-sm mb-1">Shared Stats</p>
            <h2 className="text-2xl font-bold">
              {new Date(stats.date).toLocaleDateString('en-US', {
                weekday: 'short',
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </h2>
            <p className="text-gray-500 text-sm mt-2">
              Expires: {new Date(cardData.expires_at).toLocaleDateString()}
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#111827] rounded-lg p-4 border border-[#7C3AED]/20">
              <p className="text-[#7C3AED] text-xs uppercase font-bold mb-2">
                Keyboard Presses
              </p>
              <p className="text-3xl font-bold">
                {(stats.keyboardPresses || 0).toLocaleString()}
              </p>
            </div>

            <div className="bg-[#111827] rounded-lg p-4 border border-[#06B6D4]/20">
              <p className="text-[#06B6D4] text-xs uppercase font-bold mb-2">
                Tabs Opened
              </p>
              <p className="text-3xl font-bold">{stats.tabsOpened || 0}</p>
            </div>

            <div className="bg-[#111827] rounded-lg p-4 border border-[#22C55E]/20">
              <p className="text-[#22C55E] text-xs uppercase font-bold mb-2">
                Browsing Time
              </p>
              <p className="text-3xl font-bold">
                {Math.round((stats.browsingTimeMinutes || 0) / 60)}h{' '}
                <span className="text-lg">
                  {(stats.browsingTimeMinutes || 0) % 60}m
                </span>
              </p>
            </div>

            <div className="bg-[#111827] rounded-lg p-4 border border-[#F97316]/20">
              <p className="text-[#F97316] text-xs uppercase font-bold mb-2">
                Productivity Score
              </p>
              <p className="text-3xl font-bold">
                {Math.min(100, Math.round(((stats.keyboardPresses || 0) / 10000) * 100))}
                <span className="text-lg">%</span>
              </p>
            </div>
          </div>

          {/* Views */}
          <div className="mt-6 pt-6 border-t border-[#7C3AED]/20 text-center">
            <p className="text-xs text-gray-500">
              Views: {(cardData.view_count || 0) + 1}
            </p>
          </div>
        </Card>

        {/* CTA */}
        <div className="text-center">
          <p className="text-gray-400 mb-4">
            Want to track your own digital stats?
          </p>
          <Link
            href="/"
            className="inline-block bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold py-3 px-6 rounded-lg transition"
          >
            Try Life in Numbers
          </Link>
        </div>

        {/* Footer */}
        <p className="text-center text-gray-600 text-xs mt-8">
          Privacy-first activity tracking • Data expires {new Date(cardData.expires_at).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}

