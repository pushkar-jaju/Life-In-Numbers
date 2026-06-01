'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { KeyboardActivityChart, WeeklyComparisonChart } from '@/components/charts/ActivityCharts';

const MOCK_WEEKLY_DATA = [
  { day: 'Mon', keyboard: 8234, tabs: 32, browsing: 180 },
  { day: 'Tue', keyboard: 7821, tabs: 28, browsing: 165 },
  { day: 'Wed', keyboard: 9123, tabs: 41, browsing: 210 },
  { day: 'Thu', keyboard: 7654, tabs: 25, browsing: 155 },
  { day: 'Fri', keyboard: 6543, tabs: 22, browsing: 140 },
  { day: 'Sat', keyboard: 4321, tabs: 15, browsing: 95 },
  { day: 'Sun', keyboard: 5432, tabs: 18, browsing: 120 },
];

const MOCK_DAILY_HISTORY = [
  {
    date: '2026-05-26',
    keyboard: 8234,
    tabs: 32,
    browsing: 180,
    session: 450,
  },
  {
    date: '2026-05-25',
    keyboard: 7821,
    tabs: 28,
    browsing: 165,
    session: 420,
  },
  {
    date: '2026-05-24',
    keyboard: 9123,
    tabs: 41,
    browsing: 210,
    session: 520,
  },
  {
    date: '2026-05-23',
    keyboard: 7654,
    tabs: 25,
    browsing: 155,
    session: 400,
  },
  {
    date: '2026-05-22',
    keyboard: 6543,
    tabs: 22,
    browsing: 140,
    session: 360,
  },
];

export default function HistoryPage() {
  const [timeRange, setTimeRange] = useState<'week' | 'month'>('week');

  const handleExportCSV = () => {
    const headers = ['Date', 'Keyboard Presses', 'Tabs Opened', 'Browsing Time (min)', 'Session Duration (min)'];
    const rows = MOCK_DAILY_HISTORY.map((item) => [
      item.date,
      item.keyboard,
      item.tabs,
      item.browsing,
      item.session,
    ]);

    const csv = [headers, ...rows].map((row) => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `life-in-numbers-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">History & Statistics</h1>
          <p className="text-gray-400">View your activity trends over time</p>
        </div>

        {/* Time Range Toggle */}
        <div className="flex gap-4">
          <Button
            variant={timeRange === 'week' ? 'primary' : 'secondary'}
            onClick={() => setTimeRange('week')}
          >
            Last 7 Days
          </Button>
          <Button
            variant={timeRange === 'month' ? 'primary' : 'secondary'}
            onClick={() => setTimeRange('month')}
          >
            Last 30 Days
          </Button>
          <div className="flex-1" />
          <Button variant="secondary" onClick={handleExportCSV}>
            📥 Export CSV
          </Button>
        </div>

        {/* Weekly Chart */}
        <Card>
          <h2 className="text-xl font-semibold mb-4">Weekly Activity</h2>
          <WeeklyComparisonChart data={MOCK_WEEKLY_DATA} />
        </Card>

        {/* Daily Table */}
        <Card>
          <h2 className="text-xl font-semibold mb-4">Daily Breakdown</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#1A1A1F]">
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Date</th>
                  <th className="text-right py-3 px-4 text-gray-400 font-medium">
                    Keyboard
                  </th>
                  <th className="text-right py-3 px-4 text-gray-400 font-medium">Tabs</th>
                  <th className="text-right py-3 px-4 text-gray-400 font-medium">
                    Browsing (min)
                  </th>
                  <th className="text-right py-3 px-4 text-gray-400 font-medium">
                    Session (min)
                  </th>
                </tr>
              </thead>
              <tbody>
                {MOCK_DAILY_HISTORY.map((item, idx) => (
                  <tr
                    key={idx}
                    className="border-b border-[#1A1A1F] hover:bg-[#111827] transition"
                  >
                    <td className="py-3 px-4">{item.date}</td>
                    <td className="text-right py-3 px-4 font-mono text-[#7C3AED]">
                      {item.keyboard.toLocaleString()}
                    </td>
                    <td className="text-right py-3 px-4 font-mono text-[#06B6D4]">
                      {item.tabs}
                    </td>
                    <td className="text-right py-3 px-4 font-mono text-[#22C55E]">
                      {item.browsing}
                    </td>
                    <td className="text-right py-3 px-4 font-mono text-[#F97316]">
                      {item.session}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
