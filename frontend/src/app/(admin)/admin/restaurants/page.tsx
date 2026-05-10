'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Store, 
  Search, 
  Filter, 
  MapPin, 
  Star, 
  ShoppingBag, 
  DollarSign, 
  Activity, 
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  MoreVertical,
  Globe,
  UtensilsCrossed
} from 'lucide-react';
import { cn } from '@/lib/utils';

const MOCK_ADMIN_RESTAURANTS = [
  { id: 'res_1', name: 'Spice Garden', slug: 'spice-garden', seller: 'Rajesh Kumar', status: 'active', orders: 1240, revenue: 450000, rating: 4.8, city: 'Delhi', logo: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=100&h=100&fit=crop' },
  { id: 'res_2', name: 'Burger Loft', slug: 'burger-loft', seller: 'Anita Sharma', status: 'active', orders: 850, revenue: 320000, rating: 4.5, city: 'Mumbai', logo: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=100&h=100&fit=crop' },
  { id: 'res_3', name: 'Pizza Hub', slug: 'pizza-hub', seller: 'Sarah Wilson', status: 'pending', orders: 0, revenue: 0, rating: 0, city: 'Bangalore', logo: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=100&h=100&fit=crop' },
  { id: 'res_4', name: 'Sushi Zen', slug: 'sushi-zen', seller: 'Kevin Durant', status: 'active', orders: 2400, revenue: 1200000, rating: 4.9, city: 'Pune', logo: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=100&h=100&fit=crop' },
];

export default function AdminRestaurantsPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = MOCK_ADMIN_RESTAURANTS.filter(r => 
    r.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    r.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight font-[var(--font-outfit)]">Restaurant Monitoring</h1>
          <p className="text-white/40 font-bold uppercase tracking-widest text-[10px] mt-1">Real-time status of all digital outlets</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl flex items-center gap-2">
            <Globe size={14} className="text-[var(--brand)]" />
            <span className="text-[10px] font-black text-white uppercase tracking-widest">Active Across 12 Cities</span>
          </div>
        </div>
      </div>

      {/* Global Filter Bar */}
      <div className="card bg-[#0f0f1e] p-4 flex flex-col md:flex-row gap-4 border-white/5">
        <div className="flex-1 relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-[var(--brand)]" size={20} />
          <input 
            type="text" 
            placeholder="Search by restaurant name, city, or seller..." 
            className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/5 rounded-xl outline-none focus:border-[var(--brand)] transition-all font-bold text-sm text-white placeholder:text-white/20"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <select className="bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-xs font-black text-white uppercase tracking-widest outline-none cursor-pointer hover:bg-white/10 transition-all">
            <option>All Cities</option>
            <option>Delhi</option>
            <option>Mumbai</option>
          </select>
          <button className="btn bg-white/5 text-white/60 hover:text-white hover:bg-white/10 border border-white/10 p-3 rounded-xl">
            <Filter size={20} />
          </button>
        </div>
      </div>

      {/* Restaurants Table */}
      <div className="bg-[#0f0f1e] border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white/[0.02]">
                <th className="px-8 py-5 text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Outlet</th>
                <th className="px-8 py-5 text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Owner</th>
                <th className="px-8 py-5 text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Status</th>
                <th className="px-8 py-5 text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Activity</th>
                <th className="px-8 py-5 text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Performance</th>
                <th className="px-8 py-5 text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map((res) => (
                <tr key={res.id} className="hover:bg-white/[0.01] transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl overflow-hidden border border-white/10 shadow-lg">
                        <img src={res.logo} alt={res.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="text-sm font-black text-white tracking-tight">{res.name}</p>
                        <p className="text-[10px] text-white/20 font-bold uppercase tracking-widest flex items-center gap-1 mt-0.5">
                          <MapPin size={10} /> {res.city}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <p className="text-sm font-bold text-white/80">{res.seller}</p>
                    <p className="text-[10px] text-white/20 font-black uppercase tracking-widest">Partner</p>
                  </td>
                  <td className="px-8 py-6">
                    <span className={cn(
                      "px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest inline-flex items-center gap-1.5",
                      res.status === 'active' ? "bg-green-500/10 text-green-500" : "bg-amber-500/10 text-amber-500"
                    )}>
                      <div className={cn("w-1.2 h-1.2 rounded-full", res.status === 'active' ? "bg-green-500" : "bg-amber-500")} />
                      {res.status}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Orders</span>
                        <span className="text-sm font-black text-white">{res.orders.toLocaleString()}</span>
                      </div>
                      <div className="w-px h-8 bg-white/5" />
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Revenue</span>
                        <span className="text-sm font-black text-[var(--brand)]">₹{(res.revenue / 1000).toFixed(1)}K</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-1.5 text-amber-500 font-black text-sm">
                      <Star size={14} fill="currentColor" /> {res.rating || 'N/A'}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2">
                      <button className="p-2 rounded-lg bg-white/5 text-white/40 hover:text-white transition-all">
                        <ExternalLink size={16} />
                      </button>
                      <button className="p-2 rounded-lg bg-white/5 text-white/40 hover:text-white transition-all">
                        <MoreVertical size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Global Stats Footer */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card bg-gradient-to-tr from-[#1a1a2e] to-[#0f0f1e] p-6 border-white/5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center text-green-500">
              <Activity size={20} />
            </div>
            <h3 className="text-sm font-black text-white uppercase tracking-widest">Platform Activity</h3>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-xs text-white/40 font-bold">Active Sessions</span>
              <span className="text-sm font-black text-white">422</span>
            </div>
            <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
              <div className="w-[65%] h-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]" />
            </div>
          </div>
        </div>
        <div className="card bg-gradient-to-tr from-[#1a1a2e] to-[#0f0f1e] p-6 border-white/5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-[var(--brand)]/10 flex items-center justify-center text-[var(--brand)]">
              <UtensilsCrossed size={20} />
            </div>
            <h3 className="text-sm font-black text-white uppercase tracking-widest">Menu Health</h3>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-xs text-white/40 font-bold">Menu Coverage</span>
              <span className="text-sm font-black text-white">94%</span>
            </div>
            <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
              <div className="w-[94%] h-full bg-[var(--brand)] shadow-[0_0_8px_rgba(108,71,255,0.4)]" />
            </div>
          </div>
        </div>
        <div className="card bg-gradient-to-tr from-[#1a1a2e] to-[#0f0f1e] p-6 border-white/5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500">
              <ShoppingBag size={20} />
            </div>
            <h3 className="text-sm font-black text-white uppercase tracking-widest">Growth Rate</h3>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-xs text-white/40 font-bold">New Registrations</span>
              <span className="text-sm font-black text-white">+18.4%</span>
            </div>
            <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
              <div className="w-[45%] h-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.4)]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
