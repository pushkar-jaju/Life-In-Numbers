'use client';

import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { useEffect } from 'react';

export default function HomePage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && user) {
      router.push('/dashboard');
    }
  }, [isLoaded, user, router]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#09090B] via-[#111827] to-[#09090B]">
      {/* Navigation */}
      <nav className="border-b border-[#1A1A1F] bg-[#09090B]/80 backdrop-blur">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="text-2xl font-bold bg-gradient-to-r from-[#7C3AED] to-[#06B6D4] bg-clip-text text-transparent">
            📊 Life in Numbers
          </div>
          <div className="flex gap-4">
            <Link
              href="/sign-in"
              className="px-4 py-2 text-gray-300 hover:text-white transition"
            >
              Sign In
            </Link>
            <Link
              href="/sign-up"
              className="px-4 py-2 bg-[#7C3AED] text-white rounded-lg hover:bg-[#6D28D9] transition"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <h1 className="text-5xl sm:text-6xl font-bold mb-6">
          Your Digital Life, <span className="bg-gradient-to-r from-[#7C3AED] to-[#06B6D4] bg-clip-text text-transparent">Visualized</span>
        </h1>
        <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
          Automatically track your keyboard activity, tab usage, and browsing patterns. Understand your digital habits with beautiful, rule-based insights. No AI, no privacy concerns, just pure data.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/sign-up"
            className="px-8 py-4 bg-gradient-to-r from-[#7C3AED] to-[#06B6D4] text-white rounded-lg font-semibold hover:opacity-90 transition"
          >
            Start Tracking →
          </Link>
          <a
            href="#features"
            className="px-8 py-4 border border-[#1A1A1F] text-gray-300 rounded-lg font-semibold hover:border-[#7C3AED] hover:text-[#7C3AED] transition"
          >
            Learn More
          </a>
        </div>
      </div>

      {/* Features */}
      <div id="features" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <h2 className="text-4xl font-bold mb-16 text-center">Why Life in Numbers?</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: '⌨️',
              title: 'Keyboard Tracking',
              desc: 'Measure your typing productivity with real-time keyboard press counts.',
            },
            {
              icon: '📑',
              title: 'Tab Intelligence',
              desc: 'See how many tabs you open and track your browsing patterns.',
            },
            {
              icon: '🔒',
              title: 'Privacy First',
              desc: 'All data stays on your device. No cloud uploads, no AI training.',
            },
            {
              icon: '💡',
              title: 'Smart Insights',
              desc: 'Get meaningful observations about your work patterns and habits.',
            },
            {
              icon: '📤',
              title: 'Shareable Stats',
              desc: 'Create beautiful cards to share your accomplishments with friends.',
            },
            {
              icon: '📊',
              title: 'Visual Analytics',
              desc: 'Interactive charts showing your activity over time.',
            },
          ].map((feature, idx) => (
            <div
              key={idx}
              className="bg-[#111827] border border-[#1A1A1F] rounded-lg p-6 hover:border-[#7C3AED]/50 transition"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-400">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* How It Works */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <h2 className="text-4xl font-bold mb-16 text-center">How It Works</h2>
        <div className="space-y-8 max-w-3xl mx-auto">
          {[
            {
              step: '1',
              title: 'Sign Up',
              desc: 'Create your free account with just an email or Google login.',
            },
            {
              step: '2',
              title: 'Install Extension',
              desc: 'Add the browser extension to automatically track your activity.',
            },
            {
              step: '3',
              title: 'Just Browse',
              desc: 'Use the internet normally. The extension silently collects data.',
            },
            {
              step: '4',
              title: 'Get Insights',
              desc: 'View beautiful dashboards and insights about your digital habits.',
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="flex gap-6 items-start bg-[#111827] border border-[#1A1A1F] rounded-lg p-6"
            >
              <div className="flex-shrink-0 w-12 h-12 bg-[#7C3AED] rounded-lg flex items-center justify-center font-bold text-xl">
                {item.step}
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-400">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="bg-gradient-to-r from-[#7C3AED]/10 to-[#06B6D4]/10 border border-[#7C3AED]/20 rounded-lg p-12 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Track Your Digital Life?</h2>
          <p className="text-xl text-gray-400 mb-8">
            Join thousands of users understanding their productivity patterns.
          </p>
          <Link
            href="/sign-up"
            className="inline-block px-8 py-4 bg-[#7C3AED] text-white rounded-lg font-semibold hover:bg-[#6D28D9] transition"
          >
            Start for Free →
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-[#1A1A1F] bg-[#09090B] py-8 px-4">
        <div className="max-w-6xl mx-auto text-center text-gray-500 text-sm">
          <p>
            © 2025 Life in Numbers. Built with ❤️ for digital productivity.
          </p>
          <div className="mt-4 space-x-4">
            <a href="#" className="hover:text-gray-300 transition">
              Privacy
            </a>
            <span>•</span>
            <a href="#" className="hover:text-gray-300 transition">
              Terms
            </a>
            <span>•</span>
            <a href="#" className="hover:text-gray-300 transition">
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
