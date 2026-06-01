import { UserButton } from '@clerk/nextjs';
import Link from 'next/link';

export function Navbar() {
  return (
    <nav className="bg-[#09090B] border-b border-[#1A1A1F] px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 text-xl font-bold bg-gradient-to-r from-[#7C3AED] to-[#06B6D4] bg-clip-text text-transparent"
        >
          📊 Life in Numbers
        </Link>

        <div className="flex items-center gap-4">
          <UserButton />
        </div>
      </div>
    </nav>
  );
}
