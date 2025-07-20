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
      'inline-flex items-center justify-center rounded-md text-sm font-medium px-4 py-2 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

    const variantClasses = {
      primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
      secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-300',
      outline: 'border border-gray-300 text-gray-900 hover:bg-gray-100 focus:ring-gray-300',
      danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
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
