'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { setTableNumber, clearCart } from '@/store/slices/cartSlice';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { GlassCard } from '@/components/ui/GlassCard';
import { ArrowLeft, CreditCard, Banknote, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function CheckoutPage({ params }: { params: { slug: string } }) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((state) => state.cart.items);
  const tableNumber = useAppSelector((state) => state.cart.tableNumber);
  
  const [paymentMethod, setPaymentMethod] = React.useState<'online' | 'cash'>('online');
  const [isProcessing, setIsProcessing] = React.useState(false);

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const taxes = subtotal * 0.05; // 5% GST
  const total = subtotal + taxes;

  const handlePlaceOrder = () => {
    if (!tableNumber) {
      alert('Please enter your table number');
      return;
    }
    
    setIsProcessing(true);
    // Simulate API call
    setTimeout(() => {
      setIsProcessing(false);
      dispatch(clearCart());
      // Navigate to order tracking page with a mock order ID
      const mockOrderId = Math.random().toString(36).substring(7);
      router.push(`/${params.slug}/order/${mockOrderId}`);
    }, 1500);
  };

  if (cartItems.length === 0 && !isProcessing) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
        <h2 className="text-2xl font-bold mb-2">Cart is empty</h2>
        <p className="text-[var(--text-secondary)] mb-6">You need to add items to checkout.</p>
        <Button onClick={() => router.push(`/${params.slug}`)}>Back to Menu</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[var(--bg)] pb-32">
      {/* Header */}
      <div className="bg-[var(--surface)] sticky top-0 z-30 border-b border-[var(--border)] p-4 flex items-center gap-4">
        <button onClick={() => router.back()} className="p-2 rounded-full hover:bg-[var(--surface-2)] transition-colors">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-bold">Checkout</h1>
      </div>

      <div className="p-4 space-y-6 flex-1">
        {/* Table Number */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <GlassCard intensity="light" className="p-5">
            <h2 className="text-lg font-bold mb-4">Dining Details</h2>
            <Input
              label="Table Number *"
              placeholder="e.g. 12"
              type="number"
              value={tableNumber || ''}
              onChange={(e: any) => dispatch(setTableNumber(e.target.value))}
              required
            />
            <p className="text-xs text-[var(--text-muted)] mt-2">
              Please enter the table number printed on your QR code stand.
            </p>
          </GlassCard>
        </motion.div>

        {/* Order Summary */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <GlassCard intensity="light" className="p-5">
            <h2 className="text-lg font-bold mb-4">Order Summary</h2>
            <div className="space-y-3 mb-4">
              {cartItems.map(item => (
                <div key={item.id} className="flex justify-between text-sm">
                  <div className="flex gap-2">
                    <span className="font-medium text-[var(--text-secondary)]">{item.quantity}x</span>
                    <span>{item.name}</span>
                  </div>
                  <span className="font-medium">₹{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            
            <div className="pt-4 border-t border-[var(--border)] space-y-2 text-sm">
              <div className="flex justify-between text-[var(--text-secondary)]">
                <span>Item Total</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[var(--text-secondary)]">
                <span>Taxes & Charges (5%)</span>
                <span>₹{taxes.toFixed(2)}</span>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Payment Method */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <GlassCard intensity="light" className="p-5">
            <h2 className="text-lg font-bold mb-4">Payment Method</h2>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setPaymentMethod('online')}
                className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all ${
                  paymentMethod === 'online' 
                    ? 'border-[var(--brand)] bg-[var(--brand-light)] text-[var(--brand)]' 
                    : 'border-[var(--border)] bg-[var(--surface)] text-[var(--text-secondary)]'
                }`}
              >
                <CreditCard size={24} />
                <span className="font-medium">Pay Online</span>
                {paymentMethod === 'online' && <CheckCircle2 size={16} className="absolute top-2 right-2" />}
              </button>
              
              <button
                onClick={() => setPaymentMethod('cash')}
                className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all relative ${
                  paymentMethod === 'cash' 
                    ? 'border-[var(--brand)] bg-[var(--brand-light)] text-[var(--brand)]' 
                    : 'border-[var(--border)] bg-[var(--surface)] text-[var(--text-secondary)]'
                }`}
              >
                <Banknote size={24} />
                <span className="font-medium">Pay at Counter</span>
                {paymentMethod === 'cash' && <CheckCircle2 size={16} className="absolute top-2 right-2" />}
              </button>
            </div>
          </GlassCard>
        </motion.div>
      </div>

      {/* Bottom Action Bar */}
      <div className="fixed bottom-0 inset-x-0 max-w-md mx-auto bg-[var(--surface)] border-t border-[var(--border)] p-4 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-40">
        <div className="flex items-center justify-between mb-4">
          <div className="flex flex-col">
            <span className="text-[var(--text-secondary)] text-sm font-medium">Total to Pay</span>
            <span className="text-xl font-bold text-[var(--brand)]">₹{total.toFixed(2)}</span>
          </div>
        </div>
        <Button 
          className="w-full h-14 text-lg rounded-2xl" 
          onClick={handlePlaceOrder}
          isLoading={isProcessing}
        >
          Place Order
        </Button>
      </div>
    </div>
  );
}
