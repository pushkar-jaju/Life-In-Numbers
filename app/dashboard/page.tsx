'use client';

import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { StatItem } from '@/components/ui/StatItem';
import { Button } from '@/components/ui/Button';
import { useDailyStats } from '@/lib/store';
import { useState } from 'react';

export default function DashboardPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const dailyStats = useDailyStats();
  const [sharing, setSharing] = useState(false);
  const [shareUrl, setShareUrl] = useState<string | null>(null);

  if (!isLoaded) {
    return <div className="text-center py-12">Loading...</div>;
  }

  const handleShare = async () => {
    setSharing(true);
    try {
      const response = await fetch('/api/share/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: new Date().toISOString().split('T')[0],
          keyboardPresses: dailyStats.keyboardPresses || 0,
          tabsOpened: dailyStats.tabsOpened || 0,
          browsingTimeMinutes: dailyStats.browsingTimeMinutes || 0,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setShareUrl(data.shareUrl);
        // Copy to clipboard
        navigator.clipboard.writeText(data.shareUrl);
      }
    } catch (error) {
      console.error('Share failed:', error);
    } finally {
      setSharing(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">
            Welcome back, {user?.firstName || 'User'}!
          </h1>
          <p className="text-gray-400">
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatItem
            icon="⌨️"
            label="Keyboard Presses"
            value={dailyStats.keyboardPresses || 0}
            color="purple"
          />
          <StatItem
            icon="📑"
            label="Tabs Opened"
            value={dailyStats.tabsOpened || 0}
            color="cyan"
          />
          <StatItem
            icon="🌐"
            label="Browsing Time"
            value={`${dailyStats.browsingTimeMinutes || 0}m`}
            color="green"
          />
          <StatItem
            icon="⏱️"
            label="Session Duration"
            value={`${dailyStats.sessionDurationMinutes || 0}m`}
            color="orange"
          />
        </div>

        {/* Share Card */}
        <div className="bg-[#111827] border border-[#1A1A1F] rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-3">📤 Share Today's Stats</h2>
          <p className="text-gray-400 mb-4">
            Create a shareable card to show off your digital day.
          </p>
          {shareUrl ? (
            <div className="bg-[#09090B] border border-[#7C3AED] p-4 rounded mb-3">
              <p className="text-sm text-gray-300">
                ✓ Link copied to clipboard!
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Expires in 30 days
              </p>
            </div>
          ) : null}
          <Button
            onClick={handleShare}
            disabled={sharing}
            className="bg-[#7C3AED] hover:bg-[#6D28D9]"
          >
            {sharing ? 'Creating...' : '✨ Generate Share Link'}
          </Button>
        </div>

        {/* Next Steps */}
        <div className="bg-[#111827] border border-[#1A1A1F] rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">Getting Started</h2>
          <p className="text-gray-400 mb-4">
            Install the browser extension to start collecting your activity data
            automatically.
          </p>
          <a
            href="#"
            className="inline-block bg-gradient-to-r from-[#7C3AED] to-[#06B6D4] text-white px-6 py-2 rounded-lg hover:opacity-90 transition"
          >
            Install Extension
          </a>
        </div>
      </div>
    </DashboardLayout>
  );
}

