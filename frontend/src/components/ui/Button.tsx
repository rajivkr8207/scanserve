'use client';

import * as React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'glass';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles = 'inline-flex items-center justify-center rounded-xl font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)] disabled:pointer-events-none disabled:opacity-60 overflow-hidden relative';

    const variants = {
      primary: 'bg-gradient-to-br from-[var(--brand)] to-[var(--brand-dark)] text-white shadow-[var(--shadow-brand)] hover:shadow-lg',
      secondary: 'bg-[var(--brand-light)] text-[var(--brand)] border-[1.5px] border-[var(--border-brand)] hover:bg-[rgba(108,71,255,0.15)]',
      ghost: 'bg-transparent text-[var(--text-secondary)] hover:text-[var(--brand)] hover:bg-[var(--brand-light)]',
      danger: 'bg-gradient-to-br from-red-500 to-red-600 text-white shadow-md hover:shadow-lg',
      glass: 'glass-brand text-[var(--brand)] hover:bg-[rgba(108,71,255,0.12)]',
    };

    const sizes = {
      sm: 'h-9 px-4 text-sm',
      md: 'h-11 px-6 text-base',
      lg: 'h-14 px-8 text-lg',
      icon: 'h-11 w-11 p-2',
    };

    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: disabled || isLoading ? 1 : 1.02 }}
        whileTap={{ scale: disabled || isLoading ? 1 : 0.98 }}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        disabled={disabled || isLoading}
        {...props}
      >
        {/* Glow effect on hover for primary/danger */}
        {(variant === 'primary' || variant === 'danger') && (
          <span className="absolute inset-0 bg-white/20 opacity-0 hover:opacity-100 transition-opacity" />
        )}
        
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {!isLoading && leftIcon && <span className="mr-2">{leftIcon}</span>}
        {children}
        {!isLoading && rightIcon && <span className="ml-2">{rightIcon}</span>}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';
