'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { AlertCircle } from 'lucide-react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, leftIcon, rightIcon, ...props }, ref) => {
    const [isFocused, setIsFocused] = React.useState(false);
    
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label className="text-sm font-medium text-[var(--text-primary)] ml-1">
            {label}
          </label>
        )}
        <div className="relative flex items-center w-full">
          {leftIcon && (
            <div className="absolute left-3.5 text-[var(--text-muted)] z-10 flex items-center justify-center">
              {leftIcon}
            </div>
          )}
          
          <input
            ref={ref}
            onFocus={(e: any) => {
              setIsFocused(true);
              props.onFocus?.(e);
            }}
            onBlur={(e: any) => {
              setIsFocused(false);
              props.onBlur?.(e);
            }}
            className={cn(
              "w-full bg-[var(--surface-2)] text-[var(--text-primary)] border-[1.5px] border-[var(--border)] rounded-xl px-4 py-3 text-base outline-none transition-all duration-200",
              "placeholder:text-[var(--text-muted)]",
              "focus:bg-[var(--surface)] focus:border-[var(--brand)] focus:shadow-[0_0_0_4px_rgba(108,71,255,0.12)]",
              leftIcon && "pl-11",
              rightIcon && "pr-11",
              error && "border-red-500 focus:border-red-500 focus:shadow-[0_0_0_4px_rgba(239,68,68,0.12)]",
              className
            )}
            {...props}
          />

          {rightIcon && !error && (
            <div className="absolute right-3.5 text-[var(--text-muted)] z-10 flex items-center justify-center">
              {rightIcon}
            </div>
          )}
          
          {error && (
            <div className="absolute right-3.5 text-red-500 z-10 flex items-center justify-center pointer-events-none">
              <AlertCircle size={18} />
            </div>
          )}
        </div>
        
        <AnimatePresence>
          {error && (
            <motion.span
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-xs font-medium text-red-500 ml-1"
            >
              {error}
            </motion.span>
          )}
        </AnimatePresence>
      </div>
    );
  }
);

Input.displayName = 'Input';
