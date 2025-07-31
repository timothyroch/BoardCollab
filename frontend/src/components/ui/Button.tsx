'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '../../../lib/utils';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, children, variant = 'primary', loading = false, disabled, ...props }, ref) => {
    const baseClasses =
      'inline-flex items-center justify-center rounded-xl text-sm font-semibold px-5 py-2.5 transition-all duration-300 ease-in-out focus:outline-none focus:ring-offset-2 focus:ring-offset-gray-950 disabled:opacity-50 disabled:cursor-not-allowedhover:scale-105';

    const variantClasses = {
      primary: 'bg-white text-gray-900 hover:bg-gray-100 focus:ring-gray-600',
      secondary: 'bg-gray-800 text-white hover:bg-gray-700 focus:ring-gray-600',
      outline: 'border border-white/30 text-white hover:bg-white/50 focus:ring-white',
      danger: 'bg-red-600 text-white hover:bg-red-400 focus:ring-red-400',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(baseClasses, variantClasses[variant], className)}
        {...props}
      >
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
