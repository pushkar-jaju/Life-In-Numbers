'use client';

import { useUser } from '@clerk/nextjs';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { Card } from '@/components/ui/Card';

const MOCK_USER_STATS = {
  totalKeyboardPresses: 892341,
  totalTabsOpened: 4521,
  totalBrowsingTime: 28900,
  daysTracked: 127,
  joinedDate: '2025-01-15',
};

export default function ProfilePage() {
  const { user, isLoaded } = useUser();

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">Profile</h1>
          <p className="text-gray-400">Your account information and statistics</p>
        </div>

        {/* User Info */}
        <Card>
          <div className="flex items-center gap-6 mb-6">
            {user?.imageUrl && (
              <img
                src={user.imageUrl}
                alt={user.firstName || 'User'}
                className="w-20 h-20 rounded-lg"
              />
            )}
            <div>
              <h2 className="text-2xl font-bold">
                {user?.firstName} {user?.lastName}
              </h2>
              <p className="text-gray-400">{user?.primaryEmailAddress?.emailAddress}</p>
              <p className="text-sm text-gray-500 mt-1">
                Member since{' '}
                {new Date(MOCK_USER_STATS.joinedDate).toLocaleDateString()}
              </p>
            </div>
          </div>
        </Card>

        {/* Statistics */}
        <Card>
          <h2 className="text-xl font-semibold mb-4">Lifetime Statistics</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-gray-400 text-sm mb-2">Total Keyboard Presses</p>
              <p className="text-2xl font-bold text-[#7C3AED]">
                {(MOCK_USER_STATS.totalKeyboardPresses / 1000000).toFixed(1)}M
              </p>
            </div>
            <div>
              <p className="text-gray-400 text-sm mb-2">Tabs Opened</p>
              <p className="text-2xl font-bold text-[#06B6D4]">
                {(MOCK_USER_STATS.totalTabsOpened / 1000).toFixed(1)}K
              </p>
            </div>
            <div>
              <p className="text-gray-400 text-sm mb-2">Browsing Hours</p>
              <p className="text-2xl font-bold text-[#22C55E]">
                {(MOCK_USER_STATS.totalBrowsingTime / 60).toFixed(0)}h
              </p>
            </div>
            <div>
              <p className="text-gray-400 text-sm mb-2">Days Tracked</p>
              <p className="text-2xl font-bold text-[#F97316]">
                {MOCK_USER_STATS.daysTracked}
              </p>
            </div>
          </div>
        </Card>

        {/* Account Actions */}
        <Card>
          <h2 className="text-xl font-semibold mb-4">Account</h2>
          <div className="space-y-2">
            <button className="w-full text-left py-3 px-4 rounded-lg hover:bg-[#111827] transition text-gray-300 hover:text-white">
              Change Email
            </button>
            <button className="w-full text-left py-3 px-4 rounded-lg hover:bg-[#111827] transition text-gray-300 hover:text-white">
              Change Password
            </button>
            <button className="w-full text-left py-3 px-4 rounded-lg hover:bg-[#111827] transition text-red-400 hover:text-red-300">
              Delete Account
            </button>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
