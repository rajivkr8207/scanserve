'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '@/components/ui/GlassCard';
import { IndianRupee, Store, Users, Activity } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const data = [
  { name: 'Jan', revenue: 400000 },
  { name: 'Feb', revenue: 300000 },
  { name: 'Mar', revenue: 500000 },
  { name: 'Apr', revenue: 780000 },
  { name: 'May', revenue: 689000 },
  { name: 'Jun', revenue: 939000 },
];

export default function AdminDashboardPage() {
  const stats = [
    { title: 'Platform Revenue (Monthly)', value: '₹9,39,000', icon: IndianRupee, trend: '+24%', isPositive: true },
    { title: 'Total Restaurants', value: '1,248', icon: Store, trend: '+12', isPositive: true },
    { title: 'Active Sellers', value: '892', icon: Users, trend: '+5', isPositive: true },
    { title: 'Live Orders', value: '14,302', icon: Activity, trend: 'High Traffic', isPositive: true },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <GlassCard intensity="light" hoverEffect className="p-6 border-red-500/10 dark:border-red-500/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[var(--text-secondary)] text-sm font-medium">{stat.title}</p>
                    <h3 className="text-2xl font-black mt-1 text-[var(--text-primary)]">{stat.value}</h3>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600">
                    <Icon size={24} />
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-2 text-sm">
                  <span className={`font-bold px-2 py-0.5 rounded-full ${stat.isPositive ? 'bg-green-500/10 text-green-600' : 'bg-red-500/10 text-red-600'}`}>
                    {stat.trend}
                  </span>
                </div>
              </GlassCard>
            </motion.div>
          );
        })}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <GlassCard intensity="light" className="p-6 h-[400px] flex flex-col">
          <h3 className="text-xl font-bold mb-6 text-[var(--text-primary)]">Platform Growth</h3>
          <div className="flex-1 w-full min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `₹${v/1000}k`} />
                <Tooltip 
                  cursor={{ fill: 'var(--surface-2)' }}
                  contentStyle={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)', borderRadius: '12px' }}
                />
                <Bar dataKey="revenue" fill="#dc2626" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
}
