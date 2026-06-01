import Link from 'next/link';
import { ReactNode } from 'react';
import clsx from 'clsx';

interface NavItemProps {
  href: string;
  icon: string;
  label: string;
  active?: boolean;
}

export function NavItem({ href, icon, label, active }: NavItemProps) {
  return (
    <Link
      href={href}
      className={clsx(
        'flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200',
        'hover:bg-[#1A1A1F]',
        active && 'bg-[#7C3AED] bg-opacity-20 border-l-2 border-[#7C3AED]'
      )}
    >
      <span className="text-xl">{icon}</span>
      <span className="text-sm font-medium">{label}</span>
    </Link>
  );
}

interface SidebarProps {
  children?: ReactNode;
}

export function Sidebar({ children }: SidebarProps) {
  return (
    <aside className="w-64 bg-[#09090B] border-r border-[#1A1A1F] p-6 h-screen overflow-y-auto">
      {children}
    </aside>
  );
}
