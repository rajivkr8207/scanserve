'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  animated?: boolean;
}

export function Skeleton({ className, animated = true, ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        'rounded-md bg-[var(--surface-2)] overflow-hidden relative',
        className
      )}
      {...props}
    >
      {animated && (
        <motion.div
          className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-[rgba(255,255,255,0.2)] dark:via-[rgba(255,255,255,0.05)] to-transparent z-10"
          animate={{
            translateX: ['-100%', '100%'],
          }}
          transition={{
            repeat: Infinity,
            duration: 1.5,
            ease: 'easeInOut',
          }}
        />
      )}
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="flex flex-col space-y-3">
      <Skeleton className="h-[125px] w-full rounded-xl" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>
  );
}
