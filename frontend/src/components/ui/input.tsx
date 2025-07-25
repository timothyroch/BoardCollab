'use client';

import React from 'react';
import { cn } from '../../../lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  description?: string;
  error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, description, error, className, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-semibold text-white mb-2">
            {label}
          </label>
        )}
        {description && (
          <p className="text-xs text-white/60 mb-2">{description}</p>
        )}
        <input
          ref={ref}
          className={cn(
            'w-full px-4 py-3 text-white border rounded-xl bg-neutral-950',
            error ? 'border-red-400' : 'border-white/30', 'focus:border-white focus:ring-2 focus:ring-white/30 focus:outline-none',
            'transition-all duration-300 placeholder:text-white/50',
            className
          )}
          {...props}
        />
        {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
