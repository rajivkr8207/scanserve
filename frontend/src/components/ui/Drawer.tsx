'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEffect } from 'react';

export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  side?: 'left' | 'right' | 'bottom';
  className?: string;
}

export const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  title,
  children,
  side = 'right',
  className,
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const slideVariants = {
    right: {
      initial: { x: '100%' },
      animate: { x: 0 },
      exit: { x: '100%' },
    },
    left: {
      initial: { x: '-100%' },
      animate: { x: 0 },
      exit: { x: '-100%' },
    },
    bottom: {
      initial: { y: '100%' },
      animate: { y: 0 },
      exit: { y: '100%' },
    },
  };

  const positioning = {
    right: 'top-0 right-0 h-full w-full max-w-md',
    left: 'top-0 left-0 h-full w-full max-w-md',
    bottom: 'bottom-0 left-0 w-full max-h-[90vh] rounded-t-3xl',
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />
          
          {/* Drawer Panel */}
          <motion.div
            variants={slideVariants[side]}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ type: 'spring', damping: 25, stiffness: 250 }}
            className={cn(
              'absolute z-50 bg-[var(--surface)] border-[var(--border)] flex flex-col shadow-[var(--shadow-2xl)]',
              side === 'right' && 'border-l-[1px]',
              side === 'left' && 'border-r-[1px]',
              side === 'bottom' && 'border-t-[1px]',
              positioning[side],
              className
            )}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b-[1px] border-[var(--border)] bg-[var(--surface-2)]/30 backdrop-blur-md sticky top-0 z-10">
              {title ? (
                <h2 className="text-xl font-bold text-[var(--text-primary)]">{title}</h2>
              ) : <div />}
              
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-[var(--surface-2)] text-[var(--text-secondary)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--brand)]"
              >
                <X size={20} />
              </button>
            </div>
            
            {/* Content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default Drawer;
