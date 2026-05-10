'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Store, 
  ShoppingBag, 
  DollarSign, 
  TrendingUp, 
  ShieldCheck, 
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Globe,
  Clock,
  MoreHorizontal,
  Server,
  Zap,
  MessageSquare
} from 'lucide-react';
import { StatCard } from '@/components/cards/StatCard';
import { RevenueChart, CategoryPieChart } from '@/components/charts/Charts';

const MOCK_PLATFORM_STATS = [
  { label: 'Total Sellers', value: 1248, trend: 12.5, icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10' },
  { label: 'Active Restaurants', value: 3840, trend: 8.2, icon: Store, color: 'text-[var(--brand)]', bg: 'bg-[var(--brand)]/10' },
  { label: 'Orders Processed', value: '84.2K', trend: 15.8, icon: ShoppingBag, color: 'text-orange-500', bg: 'bg-orange-500/10' },
  { label: 'Gross Volume', value: '₹4.8M', trend: 22.4, icon: DollarSign, color: 'text-green-500', bg: 'bg-green-500/10' },
];

const MOCK_RECENT_SELLERS = [
  { name: 'Royal Tandoor', email: 'royal@tandoor.com', status: 'verified', joined: '2h ago', revenue: 12400 },
  { name: 'Pizza Hub', email: 'hello@pizzahub.in', status: 'pending', joined: '5h ago', revenue: 0 },
  { name: 'Sushi Zen', email: 'admin@sushizen.com', status: 'verified', joined: '12h ago', revenue: 8900 },
  { name: 'Cafe Coffee Day', email: 'partner@ccd.in', status: 'verified', joined: '1d ago', revenue: 45600 },
];

const MOCK_REVENUE_CHART = [
  { date: '01 May', revenue: 142000, orders: 1800 },
  { date: '02 May', revenue: 168000, orders: 2700 },
  { date: '03 May', revenue: 151000, orders: 2200 },
  { date: '04 May', revenue: 189000, orders: 3500 },
  { date: '05 May', revenue: 212000, orders: 4400 },
  { date: '06 May', revenue: 245000, orders: 5800 },
  { date: '07 May', revenue: 198000, orders: 4000 },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-10">
      {/* Platform Health Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {MOCK_PLATFORM_STATS.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-[#0f0f1e] border border-white/5 rounded-3xl p-6 relative overflow-hidden group hover:border-white/10 transition-all"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -mr-12 -mt-12 group-hover:scale-125 transition-transform duration-500" />
            
            <div className="flex items-start justify-between mb-4 relative z-10">
              <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg", stat.bg)}>
                <stat.icon size={24} className={stat.color} />
              </div>
              <div className="flex items-center gap-1 text-green-500 font-black text-xs">
                <ArrowUpRight size={14} /> +{stat.trend}%
              </div>
            </div>

            <p className="text-xs font-black text-white/40 uppercase tracking-widest relative z-10">{stat.label}</p>
            <h3 className="text-3xl font-black text-white tracking-tighter mt-1 relative z-10">{stat.value}</h3>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Global Revenue Chart */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="lg:col-span-2 bg-[#0f0f1e] border border-white/5 rounded-[2.5rem] p-10"
        >
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-2xl font-black text-white tracking-tight font-[var(--font-outfit)]">Global Revenue</h2>
              <p className="text-sm font-bold text-white/40 mt-1 uppercase tracking-widest">Platform-wide earnings growth</p>
            </div>
            <div className="flex bg-white/5 rounded-xl p-1 border border-white/5">
              <button className="px-4 py-2 rounded-lg text-xs font-black bg-[var(--brand)] text-white">REVENUE</button>
              <button className="px-4 py-2 rounded-lg text-xs font-black text-white/40 hover:text-white transition-colors">VOLUME</button>
            </div>
          </div>
          <div className="h-[300px]">
            <RevenueChart data={MOCK_REVENUE_CHART} />
          </div>
        </motion.div>

        {/* System Health */}
        <div className="space-y-6">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-gradient-to-br from-[#1a1a2e] to-[#0f0f1e] border border-white/5 rounded-[2.5rem] p-8 shadow-2xl"
          >
            <h3 className="text-lg font-black text-white mb-6 flex items-center gap-2">
              <Activity size={20} className="text-[var(--brand)]" /> System Status
            </h3>
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/60">
                    <Server size={16} />
                  </div>
                  <span className="text-sm font-bold text-white/80">API Gateway</span>
                </div>
                <span className="text-[10px] font-black text-green-500 uppercase tracking-widest flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500" /> Operational
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/60">
                    <Zap size={16} />
                  </div>
                  <span className="text-sm font-bold text-white/80">Edge Network</span>
                </div>
                <span className="text-[10px] font-black text-green-500 uppercase tracking-widest flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500" /> 99.9% Uptime
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/60">
                    <Globe size={16} />
                  </div>
                  <span className="text-sm font-bold text-white/80">Main Database</span>
                </div>
                <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" /> Heavy Load
                </span>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-[#0f0f1e] border border-white/5 rounded-[2.5rem] p-8"
          >
            <h3 className="text-lg font-black text-white mb-6 flex items-center gap-2">
              <MessageSquare size={20} className="text-blue-500" /> Support Queue
            </h3>
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs font-bold text-white/40">Pending Complaints</p>
              <span className="text-xl font-black text-white">12</span>
            </div>
            <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
              <div className="w-[45%] h-full bg-blue-500" />
            </div>
            <button className="w-full mt-6 py-3 rounded-2xl bg-white/5 hover:bg-white/10 text-xs font-black uppercase tracking-widest text-white/60 hover:text-white transition-all">
              Manage Support
            </button>
          </motion.div>
        </div>
      </div>

      {/* Recent Sellers Table */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-[#0f0f1e] border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl"
      >
        <div className="p-10 border-b border-white/5 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-white tracking-tight font-[var(--font-outfit)]">Recently Joined</h2>
            <p className="text-sm font-bold text-white/40 mt-1 uppercase tracking-widest">Onboarding queue</p>
          </div>
          <button className="btn bg-white/5 text-white/60 hover:text-white hover:bg-white/10 btn-sm font-black px-6">VIEW ALL SELLERS</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white/[0.02]">
                <th className="px-10 py-5 text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Seller Name</th>
                <th className="px-10 py-5 text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Status</th>
                <th className="px-10 py-5 text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Joined</th>
                <th className="px-10 py-5 text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Revenue</th>
                <th className="px-10 py-5 text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {MOCK_RECENT_SELLERS.map((seller) => (
                <tr key={seller.email} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-10 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white font-black">
                        {seller.name[0]}
                      </div>
                      <div>
                        <p className="text-sm font-black text-white">{seller.name}</p>
                        <p className="text-xs text-white/20 font-bold">{seller.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-6">
                    <span className={cn(
                      "px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest",
                      seller.status === 'verified' ? "bg-green-500/10 text-green-500" : "bg-amber-500/10 text-amber-500"
                    )}>
                      {seller.status}
                    </span>
                  </td>
                  <td className="px-10 py-6 text-sm font-bold text-white/40">{seller.joined}</td>
                  <td className="px-10 py-6 text-sm font-black text-white">₹{seller.revenue.toLocaleString()}</td>
                  <td className="px-10 py-6">
                    <button className="p-2 rounded-lg bg-white/5 text-white/40 hover:text-white hover:bg-[var(--brand)] transition-all">
                      <ChevronRight size={18} />
                    </button>
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
