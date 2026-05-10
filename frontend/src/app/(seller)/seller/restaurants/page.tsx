'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Search, 
  Store, 
  MapPin, 
  Settings, 
  ExternalLink, 
  MoreVertical,
  QrCode,
  ChefHat,
  BarChart3,
  Star,
  Users
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const MOCK_RESTAURANTS = [
  {
    _id: 'res_123',
    name: 'Spice Garden',
    slug: 'spice-garden',
    cuisine: 'Indian Fusion',
    address: '123 Gourmet St, Foodville',
    status: 'active',
    rating: 4.8,
    ordersToday: 42,
    revenueToday: 12500,
    logo: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=100&h=100&fit=crop'
  },
  {
    _id: 'res_456',
    name: 'Burger Loft',
    slug: 'burger-loft',
    cuisine: 'American',
    address: '45 High Rise Ave, City Center',
    status: 'active',
    rating: 4.5,
    ordersToday: 28,
    revenueToday: 8400,
    logo: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=100&h=100&fit=crop'
  }
];

export default function RestaurantsListPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = MOCK_RESTAURANTS.filter(r => 
    r.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    r.cuisine.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-[var(--text-primary)] tracking-tight font-[var(--font-outfit)]">My Restaurants</h1>
          <p className="text-[var(--text-secondary)] font-medium">Manage and monitor all your business outlets.</p>
        </div>
        <button className="btn btn-primary btn-lg gap-2 shadow-xl shadow-[var(--brand-glow)]">
          <Plus size={20} /> Add New Restaurant
        </button>
      </div>

      {/* Search & Stats Header */}
      <div className="grid md:grid-cols-4 gap-6">
        <div className="md:col-span-2 relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] group-focus-within:text-[var(--brand)] transition-colors" size={20} />
          <input 
            type="text" 
            placeholder="Search restaurants by name or cuisine..." 
            className="w-full pl-12 pr-4 py-4 bg-[var(--surface)] border-2 border-[var(--border)] rounded-2xl outline-none focus:border-[var(--brand)] transition-all font-bold text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="card p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
            <Store size={24} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest">Total Active</p>
            <p className="text-xl font-black text-[var(--text-primary)] tracking-tight">2 Outlets</p>
          </div>
        </div>
        <div className="card p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center text-green-600">
            <Users size={24} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest">Customers Today</p>
            <p className="text-xl font-black text-[var(--text-primary)] tracking-tight">184 Total</p>
          </div>
        </div>
      </div>

      {/* Restaurant Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {filtered.map((res, i) => (
          <motion.div
            key={res._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="card group overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-[var(--border)] group-hover:border-[var(--brand)] transition-colors shadow-lg">
                    <img src={res.logo} alt={res.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-[var(--text-primary)] tracking-tight">{res.name}</h3>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs font-bold text-[var(--brand)] uppercase tracking-wider">{res.cuisine}</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--border)]" />
                      <span className="flex items-center gap-1 text-xs font-bold text-amber-500">
                        <Star size={12} fill="currentColor" /> {res.rating}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="badge badge-success px-3 py-1 font-bold text-[10px] uppercase">Active</span>
                  <button className="p-2 rounded-xl hover:bg-[var(--surface-2)] text-[var(--text-muted)] transition-colors">
                    <MoreVertical size={18} />
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm font-medium text-[var(--text-secondary)] mb-8">
                <MapPin size={16} className="text-[var(--brand)]" /> {res.address}
              </div>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-[var(--surface-2)] p-4 rounded-2xl border border-[var(--border)]">
                  <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest mb-1">Today's Orders</p>
                  <p className="text-lg font-black text-[var(--text-primary)]">{res.ordersToday}</p>
                </div>
                <div className="bg-[var(--surface-2)] p-4 rounded-2xl border border-[var(--border)]">
                  <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest mb-1">Today's Revenue</p>
                  <p className="text-lg font-black text-[var(--brand)]">₹{res.revenueToday.toLocaleString()}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <Link href={`/restaurants/${res._id}/menu`} className="btn btn-ghost btn-sm px-0 flex-col gap-1 py-3 h-auto group/btn">
                  <ChefHat size={20} className="group-hover/btn:text-[var(--brand)] transition-colors" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Menu</span>
                </Link>
                <Link href={`/qr?restaurantId=${res._id}`} className="btn btn-ghost btn-sm px-0 flex-col gap-1 py-3 h-auto group/btn">
                  <QrCode size={20} className="group-hover/btn:text-[var(--brand)] transition-colors" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">QR Codes</span>
                </Link>
                <Link href={`/analytics?restaurantId=${res._id}`} className="btn btn-ghost btn-sm px-0 flex-col gap-1 py-3 h-auto group/btn">
                  <BarChart3 size={20} className="group-hover/btn:text-[var(--brand)] transition-colors" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Analytics</span>
                </Link>
                <Link href={`/restaurants/${res._id}/settings`} className="btn btn-ghost btn-sm px-0 flex-col gap-1 py-3 h-auto group/btn">
                  <Settings size={20} className="group-hover/btn:text-[var(--brand)] transition-colors" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Settings</span>
                </Link>
              </div>
            </div>
            
            <div className="border-t border-[var(--border)] bg-[var(--surface-2)]/50 p-4">
              <Link 
                href={`/${res.slug}`} 
                target="_blank"
                className="flex items-center justify-center gap-2 text-xs font-black text-[var(--brand)] uppercase tracking-widest hover:underline"
              >
                View Customer Landing <ExternalLink size={14} />
              </Link>
            </div>
          </motion.div>
        ))}

        {/* Add New Placeholder */}
        <motion.button
          whileHover={{ scale: 0.99 }}
          className="border-4 border-dashed border-[var(--border)] rounded-[2rem] flex flex-col items-center justify-center gap-4 py-12 group hover:border-[var(--brand)] hover:bg-[var(--brand-light)] transition-all"
        >
          <div className="w-16 h-16 rounded-full bg-[var(--surface-2)] flex items-center justify-center text-[var(--text-muted)] group-hover:bg-[var(--brand)] group-hover:text-white transition-all shadow-sm">
            <Plus size={32} />
          </div>
          <div>
            <p className="text-xl font-black text-[var(--text-primary)] tracking-tight">Add New Outlet</p>
            <p className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest mt-1">Scale your business</p>
          </div>
        </motion.button>
      </div>
    </div>
  );
}
