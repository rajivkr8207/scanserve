'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingBag, 
  Clock, 
  CheckCircle2, 
  ChefHat, 
  Bell, 
  Search, 
  Filter, 
  MoreVertical,
  ChevronRight,
  Printer,
  X,
  Hash,
  UtensilsCrossed
} from 'lucide-react';
import { cn } from '@/lib/utils';

const MOCK_ORDERS = [
  { id: '#1044', table: 'T-7', items: [{ name: 'Dal Makhani', qty: 1 }, { name: 'Rice', qty: 1 }], total: 320, status: 'pending', time: '2 min ago', type: 'Dine-in' },
  { id: '#1043', table: 'T-4', items: [{ name: 'Butter Chicken', qty: 1 }, { name: 'Naan', qty: 2 }], total: 560, status: 'preparing', time: '8 min ago', type: 'Dine-in' },
  { id: '#1042', table: 'T-2', items: [{ name: 'Paneer Tikka', qty: 1 }, { name: 'Lassi', qty: 1 }], total: 480, status: 'preparing', time: '15 min ago', type: 'Dine-in' },
  { id: '#1041', table: 'T-9', items: [{ name: 'Biryani', qty: 2 }], total: 700, status: 'ready', time: '22 min ago', type: 'Dine-in' },
  { id: '#1040', table: 'T-1', items: [{ name: 'Samosa', qty: 4 }], total: 160, status: 'served', time: '45 min ago', type: 'Dine-in' },
];

const COLUMNS = [
  { key: 'pending', label: 'New Orders', icon: Clock, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-950/30' },
  { key: 'preparing', label: 'In Kitchen', icon: ChefHat, color: 'text-[var(--brand)]', bg: 'bg-[var(--brand-light)]' },
  { key: 'ready', label: 'Ready', icon: Bell, color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-950/30' },
  { key: 'served', label: 'Served', icon: CheckCircle2, color: 'text-slate-500', bg: 'bg-slate-50 dark:bg-slate-950/30' },
];

export default function OrdersManagementPage() {
  const [orders, setOrders] = useState(MOCK_ORDERS);
  const [searchTerm, setSearchTerm] = useState('');

  const updateStatus = (id: string, newStatus: string) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: newStatus } : o));
  };

  return (
    <div className="space-y-8 h-full flex flex-col">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-[var(--text-primary)] tracking-tight font-[var(--font-outfit)]">Live Orders</h1>
          <p className="text-[var(--text-secondary)] font-medium">Manage incoming orders and track kitchen progress.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn btn-ghost gap-2 font-bold">
            <Printer size={18} /> Print All
          </button>
          <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center text-green-600 animate-pulse">
            <div className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex-1 overflow-x-auto no-scrollbar pb-6">
        <div className="flex gap-6 min-w-[1200px] h-full">
          {COLUMNS.map(col => (
            <div key={col.key} className="flex-1 flex flex-col min-w-[300px]">
              <div className="flex items-center justify-between mb-4 px-2">
                <div className="flex items-center gap-2">
                  <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", col.bg)}>
                    <col.icon size={18} className={col.color} />
                  </div>
                  <h3 className="font-black text-[var(--text-primary)] uppercase tracking-widest text-xs">{col.label}</h3>
                  <span className="badge badge-dark text-[10px] px-2 py-0.5">{orders.filter(o => o.status === col.key).length}</span>
                </div>
              </div>

              <div className="flex-1 bg-[var(--surface-2)]/30 rounded-3xl p-3 border border-[var(--border)] overflow-y-auto space-y-4">
                <AnimatePresence mode="popLayout">
                  {orders.filter(o => o.status === col.key).map((order) => (
                    <motion.div
                      key={order.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="card p-4 group cursor-pointer hover:border-[var(--brand)] transition-all shadow-sm"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-black text-[var(--brand)]">{order.id}</span>
                          <span className="w-1 h-1 rounded-full bg-[var(--border)]" />
                          <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest">{order.type}</span>
                        </div>
                        <span className="text-[10px] font-bold text-[var(--text-muted)]">{order.time}</span>
                      </div>

                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-xl bg-[var(--surface-2)] flex flex-col items-center justify-center border border-[var(--border)]">
                          <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-tighter">Table</p>
                          <p className="text-sm font-black text-[var(--text-primary)]">{order.table}</p>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-[var(--text-secondary)] line-clamp-2">
                            {order.items.map(i => `${i.name} ×${i.qty}`).join(', ')}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-[var(--border)]">
                        <span className="font-black text-[var(--text-primary)]">₹{order.total}</span>
                        <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          {col.key === 'pending' && (
                            <button 
                              onClick={() => updateStatus(order.id, 'preparing')}
                              className="btn btn-primary btn-sm rounded-lg px-3 py-1.5 text-[10px]"
                            >
                              START COOKING
                            </button>
                          )}
                          {col.key === 'preparing' && (
                            <button 
                              onClick={() => updateStatus(order.id, 'ready')}
                              className="btn btn-primary btn-sm rounded-lg px-3 py-1.5 text-[10px] bg-green-600 hover:bg-green-700 shadow-green-500/20"
                            >
                              MARK READY
                            </button>
                          )}
                          {col.key === 'ready' && (
                            <button 
                              onClick={() => updateStatus(order.id, 'served')}
                              className="btn btn-primary btn-sm rounded-lg px-3 py-1.5 text-[10px] bg-slate-800 hover:bg-black shadow-slate-500/20"
                            >
                              SERVED
                            </button>
                          )}
                          <button className="p-1.5 rounded-lg hover:bg-[var(--surface-2)] text-[var(--text-muted)]">
                            <MoreVertical size={16} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
