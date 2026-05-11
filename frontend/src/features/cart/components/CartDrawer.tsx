'use client';

import * as React from 'react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { toggleCart, updateQuantity, removeItem, setCartOpen } from '@/store/slices/cartSlice';
import { Drawer } from '@/components/ui/Drawer';
import { Button } from '@/components/ui/Button';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useRouter } from 'next/navigation';

export const CartDrawer = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const params = useParams();
  const isOpen = useAppSelector((state) => state.cart.isOpen);
  const items = useAppSelector((state) => state.cart.items);
  
  const totalPrice = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <Drawer
      isOpen={isOpen}
      onClose={() => dispatch(setCartOpen(false))}
      title="Your Order"
      side="right"
    >
      <div className="flex flex-col h-full">
        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-[var(--text-muted)] gap-4">
            <div className="p-6 bg-[var(--surface-2)] rounded-full">
              <ShoppingBag size={48} className="opacity-50" />
            </div>
            <p className="font-medium text-lg">Your cart is empty</p>
            <p className="text-sm">Add some delicious items from the menu!</p>
            <Button
              variant="secondary"
              className="mt-4"
              onClick={() => dispatch(setCartOpen(false))}
            >
              Browse Menu
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto pr-2 pb-6 space-y-4 custom-scrollbar">
              <AnimatePresence>
                {items.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                    className="flex gap-4 bg-[var(--surface-2)] p-3 rounded-2xl border-[1px] border-[var(--border)]"
                  >
                    {item.image ? (
                      <div className="w-20 h-20 rounded-xl overflow-hidden bg-[var(--surface)] shrink-0">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="w-20 h-20 rounded-xl bg-[var(--surface)] shrink-0 flex items-center justify-center text-[var(--text-muted)]">
                        No Image
                      </div>
                    )}
                    
                    <div className="flex-1 flex flex-col justify-between py-1">
                      <div className="flex justify-between items-start gap-2">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <div className={`w-3 h-3 rounded-[3px] border-[1.5px] flex items-center justify-center ${item.isVeg ? 'border-green-600' : 'border-red-600'}`}>
                              <div className={`w-1.5 h-1.5 rounded-full ${item.isVeg ? 'bg-green-600' : 'bg-red-600'}`} />
                            </div>
                            <h3 className="font-semibold text-sm line-clamp-2 leading-snug">{item.name}</h3>
                          </div>
                          <p className="font-bold text-[var(--brand)]">₹{item.price}</p>
                        </div>
                        <button
                          onClick={() => dispatch(removeItem(item.id))}
                          className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>

                      <div className="flex items-center gap-3 mt-2 self-start bg-[var(--surface)] border-[1px] border-[var(--border)] rounded-lg p-1">
                        <button
                          className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-[var(--surface-2)] transition-colors active:scale-95 text-[var(--text-secondary)] disabled:opacity-50"
                          onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity - 1 }))}
                          disabled={item.quantity <= 1}
                        >
                          <Minus size={14} />
                        </button>
                        <span className="font-semibold w-4 text-center text-sm">{item.quantity}</span>
                        <button
                          className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-[var(--surface-2)] transition-colors active:scale-95 text-[var(--text-secondary)]"
                          onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity + 1 }))}
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            
            <div className="pt-4 border-t-[1px] border-[var(--border)] sticky bottom-0 bg-[var(--surface)] mt-auto pb-safe">
              <div className="flex justify-between items-center mb-4">
                <span className="text-[var(--text-secondary)] font-medium">Subtotal</span>
                <span className="font-bold text-lg">₹{totalPrice.toFixed(2)}</span>
              </div>
              <Button 
                className="w-full h-14 text-lg rounded-2xl"
                onClick={() => {
                  dispatch(setCartOpen(false));
                  router.push(`/${params.slug}/checkout`);
                }}
              >
                Proceed to Checkout
              </Button>
            </div>
          </>
        )}
      </div>
    </Drawer>
  );
};
