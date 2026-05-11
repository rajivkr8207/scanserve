'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '@/components/ui/GlassCard';
import { IndianRupee, TrendingUp, Users, UtensilsCrossed } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';

const data = [
  { name: 'Mon', revenue: 4000, orders: 24 },
  { name: 'Tue', revenue: 3000, orders: 18 },
  { name: 'Wed', revenue: 5000, orders: 35 },
  { name: 'Thu', revenue: 2780, orders: 15 },
  { name: 'Fri', revenue: 6890, orders: 48 },
  { name: 'Sat', revenue: 8390, orders: 62 },
  { name: 'Sun', revenue: 9490, orders: 75 },
];

export default function SellerDashboard() {
  const stats = [
    { title: 'Total Revenue', value: '₹39,550', icon: IndianRupee, trend: '+12.5%', isPositive: true },
    { title: 'Total Orders', value: '277', icon: TrendingUp, trend: '+8.2%', isPositive: true },
    { title: 'Active Tables', value: '14/20', icon: Users, trend: '-2.4%', isPositive: false },
    { title: 'Popular Dish', value: 'Butter Chicken', icon: UtensilsCrossed, trend: '48 orders', isPositive: true },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Row */}
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
              <GlassCard intensity="light" hoverEffect className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[var(--text-secondary)] text-sm font-medium">{stat.title}</p>
                    <h3 className="text-2xl font-bold mt-1 text-[var(--text-primary)]">{stat.value}</h3>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-[var(--brand-light)] flex items-center justify-center text-[var(--brand)]">
                    <Icon size={24} />
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-2 text-sm">
                  <span className={`font-medium px-2 py-0.5 rounded-full ${stat.isPositive ? 'bg-green-500/10 text-green-600' : 'bg-red-500/10 text-red-600'}`}>
                    {stat.trend}
                  </span>
                  <span className="text-[var(--text-muted)]">from last week</span>
                </div>
              </GlassCard>
            </motion.div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2"
        >
          <GlassCard intensity="light" className="p-6 h-[400px] flex flex-col">
            <h3 className="text-lg font-bold mb-6 text-[var(--text-primary)]">Revenue Overview</h3>
            <div className="flex-1 w-full min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--brand)" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="var(--brand)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                  <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${value}`} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)', borderRadius: '12px' }}
                    itemStyle={{ color: 'var(--brand)' }}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="var(--brand)" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="lg:col-span-1"
        >
          <GlassCard intensity="light" className="p-6 h-[400px] flex flex-col">
            <h3 className="text-lg font-bold mb-6 text-[var(--text-primary)]">Orders Volume</h3>
            <div className="flex-1 w-full min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                  <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)', borderRadius: '12px' }}
                  />
                  <Line type="monotone" dataKey="orders" stroke="#10b981" strokeWidth={3} dot={{ fill: '#10b981', strokeWidth: 2 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
}
