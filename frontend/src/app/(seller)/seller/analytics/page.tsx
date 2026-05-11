'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  ShoppingBag, 
  DollarSign, 
  Calendar, 
  ArrowUpRight, 
  ArrowDownRight,
  Download,
  Filter,
  PieChart as PieChartIcon,
  Layers,
  Utensils
} from 'lucide-react';
import { StatCard } from '@/components/cards/StatCard';
import { RevenueChart, OrdersChart, CategoryPieChart } from '@/components/charts/Charts';
import { cn } from '@/lib/utils';

const MOCK_REVENUE_DATA = [
  { date: '01 May', revenue: 4200, orders: 18 },
  { date: '02 May', revenue: 6800, orders: 27 },
  { date: '03 May', revenue: 5100, orders: 22 },
  { date: '04 May', revenue: 8900, orders: 35 },
  { date: '05 May', revenue: 11200, orders: 44 },
  { date: '06 May', revenue: 14500, orders: 58 },
  { date: '07 May', revenue: 9800, orders: 40 },
  { date: '08 May', revenue: 12100, orders: 48 },
  { date: '09 May', revenue: 15600, orders: 62 },
  { date: '10 May', revenue: 13400, orders: 54 },
];

const MOCK_CATEGORIES = [
  { name: 'Main Course', value: 450 },
  { name: 'Starters', value: 300 },
  { name: 'Beverages', value: 180 },
  { name: 'Desserts', value: 120 },
  { name: 'Breads', value: 90 },
];

const MOCK_TOP_ITEMS = [
  { name: 'Butter Chicken', sales: 244, revenue: 109800, growth: 12.5 },
  { name: 'Paneer Tikka', sales: 186, revenue: 52080, growth: 8.2 },
  { name: 'Dal Makhani', sales: 152, revenue: 48640, growth: -2.4 },
  { name: 'Chicken Biryani', sales: 142, revenue: 53960, growth: 15.8 },
  { name: 'Garlic Naan', sales: 128, revenue: 7680, growth: 4.1 },
];

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('7d');

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-[var(--text-primary)] tracking-tight font-[var(--font-outfit)]">Business Analytics</h1>
          <p className="text-[var(--text-secondary)] font-medium">Deep dive into your sales and customer patterns.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-[var(--surface)] border border-[var(--border)] rounded-xl p-1">
            {['24h', '7d', '30d', '1y'].map(range => (
              <button 
                key={range}
                onClick={() => setTimeRange(range)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-bold transition-all",
                  timeRange === range ? "bg-[var(--brand)] text-white shadow-md" : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                )}
              >
                {range.toUpperCase()}
              </button>
            ))}
          </div>
          <button className="btn btn-ghost btn-icon">
            <Download size={18} />
          </button>
        </div>
      </div>

      {/* Primary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Gross Revenue" value="₹124,500" icon={DollarSign} trend={24.5} trendLabel="vs last period" delay={0} prefix="₹" />
        <StatCard title="Total Orders" value={844} icon={ShoppingBag} iconColor="text-purple-500" iconBg="bg-purple-50 dark:bg-purple-950/30" trend={12.8} delay={0.05} />
        <StatCard title="Active Customers" value={1250} icon={Users} iconColor="text-blue-500" iconBg="bg-blue-50 dark:bg-blue-950/30" trend={5.2} delay={0.1} />
        <StatCard title="Peak Hour Sales" value="₹12,400" icon={TrendingUp} iconColor="text-orange-500" iconBg="bg-orange-50 dark:bg-orange-950/30" delay={0.15} />
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Revenue Growth Chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card p-8 lg:col-span-2">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl font-black text-[var(--text-primary)] tracking-tight">Revenue Growth</h3>
              <p className="text-xs text-[var(--text-muted)] mt-1 font-bold uppercase tracking-widest">Daily earnings overview</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-[var(--brand)]" />
                <span className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest">Revenue</span>
              </div>
            </div>
          </div>
          <RevenueChart data={MOCK_REVENUE_DATA} />
        </motion.div>

        {/* Sales by Category */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="card p-8">
          <h3 className="text-xl font-black text-[var(--text-primary)] tracking-tight mb-2">Sales by Category</h3>
          <p className="text-xs text-[var(--text-muted)] mb-8 font-bold uppercase tracking-widest">Distribution of orders</p>
          <div className="flex flex-col items-center">
            <CategoryPieChart data={MOCK_CATEGORIES} />
          </div>
          <div className="space-y-3 mt-6">
            {MOCK_CATEGORIES.slice(0, 3).map((cat, i) => (
              <div key={cat.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: ['#6c47ff', '#a855f7', '#ff7849'][i] }} />
                  <span className="text-sm font-bold text-[var(--text-secondary)]">{cat.name}</span>
                </div>
                <span className="text-sm font-black text-[var(--text-primary)]">{Math.round((cat.value / 1140) * 100)}%</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Top Performing Items */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="card overflow-hidden">
        <div className="p-8 border-b border-[var(--border)] flex items-center justify-between">
          <div>
            <h3 className="text-xl font-black text-[var(--text-primary)] tracking-tight">Best Selling Dishes</h3>
            <p className="text-xs text-[var(--text-muted)] mt-1 font-bold uppercase tracking-widest">Performance of top items</p>
          </div>
          <button className="text-sm font-black text-[var(--brand)] uppercase tracking-widest hover:underline">View All Dishes</button>
        </div>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Dish Name</th>
                <th>Units Sold</th>
                <th>Revenue</th>
                <th>Growth</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_TOP_ITEMS.map((item, i) => (
                <tr key={item.name}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[var(--surface-2)] flex items-center justify-center text-[var(--brand)] border border-[var(--border)]">
                        <Utensils size={18} />
                      </div>
                      <span className="font-bold text-[var(--text-primary)]">{item.name}</span>
                    </div>
                  </td>
                  <td className="font-bold">{item.sales}</td>
                  <td className="font-black">₹{item.revenue.toLocaleString()}</td>
                  <td>
                    <div className={cn("flex items-center gap-1 font-bold", item.growth > 0 ? "text-green-600" : "text-red-500")}>
                      {item.growth > 0 ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                      {Math.abs(item.growth)}%
                    </div>
                  </td>
                  <td>
                    <span className="badge badge-success font-bold text-[10px] uppercase">High Margin</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
