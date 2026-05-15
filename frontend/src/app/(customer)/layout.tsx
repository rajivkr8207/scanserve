'use client';

import * as React from 'react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { toggleCart } from '@/store/slices/cartSlice';
import { ShoppingBag, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { CartDrawer } from '@/features/cart/components/CartDrawer';

import { useMenuTheme } from '@/features/restaurant/hooks/useMenuTheme';
import { useParams } from 'next/navigation';

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const params = useParams();
  const slug = params?.slug as string;
  const { theme } = useMenuTheme(undefined, slug);
  
  const cartItems = useAppSelector((state) => state.cart.items);
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const brandColor = theme?.colors?.primary || '#6c47ff';
  const brandColorDark = brandColor + 'dd';

  return (
    <div 
      className="relative min-h-screen bg-[var(--bg)] pb-24"
      style={{ 
        '--brand': brandColor,
        '--brand-dark': brandColorDark,
        '--brand-glow': `${brandColor}44`,
        '--font-heading': theme?.typography?.headingFont || 'inherit',
        '--shadow-brand': `0 10px 30px -10px ${brandColor}66`
      } as any}
    >
      {/* Customer Content */}
      <main className="mx-auto max-w-md bg-[var(--surface)] min-h-screen shadow-2xl relative overflow-hidden">
        {children}
      </main>

      {/* Floating Cart Button (only visible if items in cart) */}
      <AnimatePresence>
        {totalItems > 0 && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-6 inset-x-0 z-40 flex justify-center pointer-events-none px-4"
          >
            <button
              onClick={() => dispatch(toggleCart())}
              style={{ backgroundColor: brandColor }}
              className="pointer-events-auto flex w-full max-w-md items-center justify-between rounded-full px-6 py-4 text-white shadow-xl transition-transform hover:scale-[1.02] active:scale-95"
            >
              <div className="flex items-center gap-3">
                <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
                  <ShoppingBag size={20} />
                  <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white shadow-sm">
                    {totalItems}
                  </span>
                </div>
                <div className="flex flex-col items-start">
                  <span className="text-sm font-medium text-white/80">Total</span>
                  <span className="font-black">₹{totalPrice.toFixed(2)}</span>
                </div>
              </div>
              <span className="font-black tracking-wide flex items-center gap-1">
                View Cart <ChevronRight size={18} />
              </span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <CartDrawer />
    </div>
  );
}
