'use client';

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

// Keyboard activity over time
export function KeyboardActivityChart({
  data,
}: {
  data: Array<{ date: string; count: number }>;
}) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1f" />
        <XAxis
          dataKey="date"
          tick={{ fill: '#a1a1aa', fontSize: 12 }}
          stroke="#1a1a1f"
        />
        <YAxis tick={{ fill: '#a1a1aa', fontSize: 12 }} stroke="#1a1a1f" />
        <Tooltip
          contentStyle={{
            backgroundColor: '#111827',
            border: '1px solid #1a1a1f',
            borderRadius: '8px',
          }}
          labelStyle={{ color: '#fff' }}
        />
        <Legend />
        <Line
          type="monotone"
          dataKey="count"
          stroke="#7c3aed"
          strokeWidth={2}
          dot={{ fill: '#7c3aed' }}
          name="Keyboard Presses"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

// Tabs opened over time
export function TabsOpenedChart({
  data,
}: {
  data: Array<{ date: string; tabs: number }>;
}) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1f" />
        <XAxis
          dataKey="date"
          tick={{ fill: '#a1a1aa', fontSize: 12 }}
          stroke="#1a1a1f"
        />
        <YAxis tick={{ fill: '#a1a1aa', fontSize: 12 }} stroke="#1a1a1f" />
        <Tooltip
          contentStyle={{
            backgroundColor: '#111827',
            border: '1px solid #1a1a1f',
            borderRadius: '8px',
          }}
          labelStyle={{ color: '#fff' }}
        />
        <Legend />
        <Bar dataKey="tabs" fill="#06b6d4" name="Tabs Opened" radius={[8, 8, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

// Activity distribution pie chart
export function ActivityDistributionChart({
  data,
}: {
  data: Array<{ name: string; value: number }>;
}) {
  const COLORS = ['#7c3aed', '#06b6d4', '#22c55e', '#f97316'];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, value }) => `${name}: ${value}%`}
          outerRadius={100}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: '#111827',
            border: '1px solid #1a1a1f',
            borderRadius: '8px',
          }}
          labelStyle={{ color: '#fff' }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}

// Weekly comparison chart
export function WeeklyComparisonChart({
  data,
}: {
  data: Array<{
    day: string;
    keyboard: number;
    tabs: number;
    browsing: number;
  }>;
}) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1f" />
        <XAxis
          dataKey="day"
          tick={{ fill: '#a1a1aa', fontSize: 12 }}
          stroke="#1a1a1f"
        />
        <YAxis tick={{ fill: '#a1a1aa', fontSize: 12 }} stroke="#1a1a1f" />
        <Tooltip
          contentStyle={{
            backgroundColor: '#111827',
            border: '1px solid #1a1a1f',
            borderRadius: '8px',
          }}
          labelStyle={{ color: '#fff' }}
        />
        <Legend />
        <Bar dataKey="keyboard" fill="#7c3aed" name="Keyboard Presses" />
        <Bar dataKey="tabs" fill="#06b6d4" name="Tabs Opened" />
        <Bar dataKey="browsing" fill="#22c55e" name="Browsing Time (min)" />
      </BarChart>
    </ResponsiveContainer>
  );
}
