'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { CheckCircle2, ChefHat, Clock, Utensils, ReceiptText, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function OrderTrackingPage({ params }: { params: { slug: string; orderId: string } }) {
  const router = useRouter();
  // Mock order status progression
  const [statusIndex, setStatusIndex] = React.useState(0);

  const statuses = [
    { title: 'Order Placed', description: 'We have received your order', icon: ReceiptText, time: '12:30 PM' },
    { title: 'Confirmed', description: 'Restaurant confirmed your order', icon: CheckCircle2, time: '12:32 PM' },
    { title: 'Preparing', description: 'Your food is being prepared', icon: ChefHat, time: '12:35 PM' },
    { title: 'Served', description: 'Enjoy your meal!', icon: Utensils, time: 'Pending' },
  ];

  React.useEffect(() => {
    const timer1 = setTimeout(() => setStatusIndex(1), 3000);
    const timer2 = setTimeout(() => setStatusIndex(2), 7000);
    return () => { clearTimeout(timer1); clearTimeout(timer2); };
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-[var(--bg)] pb-12">
      {/* Header */}
      <div className="bg-[var(--surface)] sticky top-0 z-30 border-b border-[var(--border)] p-4 flex items-center justify-between">
        <button onClick={() => router.push(`/${params.slug}`)} className="p-2 rounded-full hover:bg-[var(--surface-2)] transition-colors">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-bold">Track Order</h1>
        <div className="w-10" /> {/* Spacer */}
      </div>

      <div className="p-4 space-y-6">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center py-6 text-center">
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4 shadow-[0_0_40px_rgba(34,197,94,0.3)]">
            <CheckCircle2 size={40} className="text-green-600 dark:text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-[var(--text-primary)]">Order Received!</h2>
          <p className="text-[var(--text-secondary)] mt-1">Order ID: #{params.orderId.toUpperCase()}</p>
        </motion.div>

        <GlassCard intensity="heavy" className="p-6 relative overflow-hidden">
          {/* Decorative blur */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--brand)]/10 blur-[50px] rounded-full pointer-events-none" />
          
          <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
            <Clock size={20} className="text-[var(--brand)]" /> Live Status
          </h3>

          <div className="order-timeline">
            {statuses.map((status, idx) => {
              const isCompleted = idx <= statusIndex;
              const isActive = idx === statusIndex;
              const Icon = status.icon;

              return (
                <div key={idx} className="order-step">
                  {idx < statuses.length - 1 && (
                    <div className={`order-step-line ${isCompleted ? 'done' : ''}`} />
                  )}
                  <motion.div 
                    initial={false}
                    animate={{ scale: isActive ? 1.1 : 1 }}
                    className={`order-step-dot ${isActive ? 'active' : ''} ${isCompleted && !isActive ? 'done' : ''}`}
                  >
                    <Icon size={16} />
                  </motion.div>
                  <div className="flex-1 pb-1 pt-1">
                    <h4 className={`font-bold text-base ${isActive ? 'text-[var(--brand)]' : isCompleted ? 'text-[var(--text-primary)]' : 'text-[var(--text-muted)]'}`}>
                      {status.title}
                    </h4>
                    <p className={`text-sm mt-0.5 ${isActive ? 'text-[var(--text-primary)]' : 'text-[var(--text-muted)]'}`}>
                      {status.description}
                    </p>
                  </div>
                  <div className="text-xs font-medium text-[var(--text-muted)] pt-1.5">
                    {status.time}
                  </div>
                </div>
              );
            })}
          </div>
        </GlassCard>

        <Button 
          className="w-full" 
          variant="secondary"
          onClick={() => router.push(`/${params.slug}`)}
        >
          Browse Menu Again
        </Button>
      </div>
    </div>
  );
}
