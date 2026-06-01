'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useSetTrackingEnabled, useTrackingEnabled } from '@/lib/store';

export default function SettingsPage() {
  const trackingEnabled = useTrackingEnabled();
  const setTrackingEnabled = useSetTrackingEnabled();
  const [darkMode, setDarkMode] = useState(true);
  const [notifications, setNotifications] = useState(true);

  const handleTrackingChange = (enabled: boolean) => {
    setTrackingEnabled(enabled);
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">Settings</h1>
          <p className="text-gray-400">Manage your preferences and tracking options</p>
        </div>

        {/* Tracking Settings */}
        <Card>
          <h2 className="text-xl font-semibold mb-4">Activity Tracking</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Enable Tracking</p>
                <p className="text-sm text-gray-400">
                  Track keyboard activity and tabs opened
                </p>
              </div>
              <input
                type="checkbox"
                checked={trackingEnabled}
                onChange={(e) => handleTrackingChange(e.target.checked)}
                className="w-5 h-5"
              />
            </div>

            <div className="border-t border-[#1A1A1F] pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Keyboard Tracking</p>
                  <p className="text-sm text-gray-400">Track keyboard presses</p>
                </div>
                <input
                  type="checkbox"
                  disabled={!trackingEnabled}
                  defaultChecked
                  className="w-5 h-5"
                />
              </div>
            </div>

            <div className="border-t border-[#1A1A1F] pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Tab Tracking</p>
                  <p className="text-sm text-gray-400">Track tabs opened and duration</p>
                </div>
                <input
                  type="checkbox"
                  disabled={!trackingEnabled}
                  defaultChecked
                  className="w-5 h-5"
                />
              </div>
            </div>

            <div className="border-t border-[#1A1A1F] pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Browsing Time Tracking</p>
                  <p className="text-sm text-gray-400">Track active browsing time</p>
                </div>
                <input
                  type="checkbox"
                  disabled={!trackingEnabled}
                  defaultChecked
                  className="w-5 h-5"
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Display Settings */}
        <Card>
          <h2 className="text-xl font-semibold mb-4">Display</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Dark Mode</p>
                <p className="text-sm text-gray-400">Always use dark theme</p>
              </div>
              <input
                type="checkbox"
                checked={darkMode}
                onChange={(e) => setDarkMode(e.target.checked)}
                className="w-5 h-5"
              />
            </div>
          </div>
        </Card>

        {/* Notifications */}
        <Card>
          <h2 className="text-xl font-semibold mb-4">Notifications</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Desktop Notifications</p>
                <p className="text-sm text-gray-400">Daily summaries and insights</p>
              </div>
              <input
                type="checkbox"
                checked={notifications}
                onChange={(e) => setNotifications(e.target.checked)}
                className="w-5 h-5"
              />
            </div>
          </div>
        </Card>

        {/* Data Management */}
        <Card>
          <h2 className="text-xl font-semibold mb-4">Data Management</h2>
          <div className="space-y-2">
            <Button variant="secondary" className="w-full justify-start">
              📥 Export Data
            </Button>
            <Button variant="secondary" className="w-full justify-start">
              🔄 Reset Statistics
            </Button>
            <Button
              variant="secondary"
              className="w-full justify-start text-red-400 hover:text-red-300"
            >
              🗑️ Delete All Data
            </Button>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
