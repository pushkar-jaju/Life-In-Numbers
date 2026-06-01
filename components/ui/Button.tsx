import { ReactNode } from 'react';
import clsx from 'clsx';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  className,
  ...props
}: ButtonProps) {
  const baseClasses =
    'font-medium rounded transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';

  const variants = {
    primary:
      'bg-gradient-to-r from-[#7C3AED] to-[#06B6D4] text-white hover:opacity-90 focus:ring-[#7C3AED]',
    secondary:
      'bg-[#1A1A1F] text-white border border-[#7C3AED] hover:bg-[#7C3AED] hover:bg-opacity-10 focus:ring-[#7C3AED]',
    ghost:
      'text-gray-300 hover:text-white focus:ring-[#7C3AED]',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
      className={clsx(baseClasses, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  );
}
