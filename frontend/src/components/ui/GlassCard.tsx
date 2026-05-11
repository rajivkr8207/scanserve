'use client';

import * as React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface GlassCardProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  hoverEffect?: boolean;
  intensity?: 'light' | 'medium' | 'heavy';
  children?: React.ReactNode;
}

export const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, hoverEffect = false, intensity = 'medium', children, ...props }, ref) => {
    
    const intensityStyles = {
      light: 'bg-[var(--surface-glass)] backdrop-blur-sm border-[var(--border)]',
      medium: 'bg-[var(--surface-glass)] backdrop-blur-md border-[var(--border)]',
      heavy: 'bg-[var(--surface-glass)] backdrop-blur-xl border-[rgba(255,255,255,0.15)] dark:border-[rgba(255,255,255,0.05)] shadow-xl',
    };

    return (
      <motion.div
        ref={ref}
        className={cn(
          'relative overflow-hidden rounded-2xl border-[1px] transition-all duration-300',
          intensityStyles[intensity],
          hoverEffect && 'hover:shadow-[var(--shadow-lg)] hover:border-[var(--border-brand)] hover:-translate-y-1',
          className
        )}
        {...props}
      >
        {/* Subtle highlight top border effect */}
        <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[rgba(255,255,255,0.4)] dark:via-[rgba(255,255,255,0.1)] to-transparent" />
        
        {/* Optional animated glow on hover could be added here if needed */}
        {hoverEffect && (
          <div className="absolute -inset-[100%] z-[-1] block opacity-0 hover:opacity-100 bg-[radial-gradient(ellipse_at_center,rgba(108,71,255,0.08)_0%,transparent_50%)] transition-opacity duration-500 pointer-events-none" />
        )}
        
        <div className="relative z-10 p-6 h-full w-full">
          {children}
        </div>
      </motion.div>
    );
  }
);

GlassCard.displayName = 'GlassCard';
