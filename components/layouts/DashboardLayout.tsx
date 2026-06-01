'use client';

import { ReactNode } from 'react';
import { Sidebar, NavItem } from '@/components/ui/Sidebar';
import { Navbar } from '@/components/ui/Navbar';

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex h-screen bg-[#09090B]">
      {/* Sidebar */}
      <Sidebar>
        <div className="mb-8">
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-4">
            Menu
          </h2>
          <nav className="space-y-2">
            <NavItem
              href="/dashboard"
              icon="📊"
              label="Dashboard"
              active={true}
            />
            <NavItem href="/insights" icon="💡" label="Insights" />
            <NavItem href="/history" icon="📈" label="History" />
            <NavItem href="/profile" icon="👤" label="Profile" />
            <NavItem href="/settings" icon="⚙️" label="Settings" />
          </nav>
        </div>

        <div className="border-t border-[#1A1A1F] pt-6">
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-4">
            Extension
          </h2>
          <div className="bg-[#111827] border border-[#1A1A1F] rounded-lg p-4">
            <p className="text-sm text-gray-400 mb-3">
              Install the browser extension to start tracking.
            </p>
            <a
              href="#"
              className="block w-full text-center bg-[#7C3AED] text-white py-2 rounded text-sm hover:opacity-90 transition"
            >
              Install Extension
            </a>
          </div>
        </div>
      </Sidebar>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
