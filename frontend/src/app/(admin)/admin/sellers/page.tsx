'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  Search, 
  Filter, 
  MoreVertical, 
  ChevronRight, 
  ShieldCheck, 
  AlertCircle, 
  Ban,
  Mail,
  ExternalLink,
  Store,
  DollarSign,
  TrendingUp,
  Download,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Modal } from '@/components/ui/Modal';

const MOCK_SELLERS = [
  { id: 'sel_1', name: 'Rajesh Kumar', email: 'rajesh@spicetreat.com', status: 'active', restaurants: 3, totalRevenue: 1240000, joined: '12 Jan 2026', phone: '+91 98765 43210' },
  { id: 'sel_2', name: 'Anita Sharma', email: 'anita@burgerloft.in', status: 'pending', restaurants: 1, totalRevenue: 0, joined: '02 May 2026', phone: '+91 87654 32109' },
  { id: 'sel_3', name: 'Kevin Durant', email: 'kevin@zenfood.com', status: 'suspended', restaurants: 2, totalRevenue: 450000, joined: '15 Feb 2026', phone: '+91 76543 21098' },
  { id: 'sel_4', name: 'Sarah Wilson', email: 'sarah@pizzahub.co', status: 'active', restaurants: 5, totalRevenue: 2890000, joined: '20 Dec 2025', phone: '+91 65432 10987' },
];

export default function AdminSellersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSeller, setSelectedSeller] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filtered = MOCK_SELLERS.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight font-[var(--font-outfit)]">Seller Directory</h1>
          <p className="text-white/40 font-bold uppercase tracking-widest text-[10px] mt-1">Platform-wide user management</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn bg-white/5 text-white/60 hover:text-white hover:bg-white/10 gap-2 font-black px-6">
            <Download size={18} /> Export List
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-[var(--brand)] transition-colors" size={20} />
          <input 
            type="text" 
            placeholder="Search sellers by name, email, or ID..." 
            className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/5 rounded-2xl outline-none focus:border-[var(--brand)] transition-all font-bold text-sm text-white placeholder:text-white/20"
            value={searchTerm}
            onChange={(e: any) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          {['all', 'active', 'pending', 'suspended'].map(tab => (
            <button 
              key={tab}
              className={cn(
                "px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border",
                tab === 'all' 
                  ? "border-[var(--brand)] bg-[var(--brand)]/10 text-[var(--brand)]" 
                  : "border-white/5 text-white/40 hover:text-white hover:bg-white/5"
              )}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Sellers List */}
      <div className="bg-[#0f0f1e] border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white/[0.02]">
                <th className="px-8 py-5 text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Seller</th>
                <th className="px-8 py-5 text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Status</th>
                <th className="px-8 py-5 text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Outlets</th>
                <th className="px-8 py-5 text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Total Revenue</th>
                <th className="px-8 py-5 text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Joined</th>
                <th className="px-8 py-5 text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map((seller) => (
                <tr key={seller.id} className="hover:bg-white/[0.01] transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-white/10 to-white/5 flex items-center justify-center text-white font-black text-lg border border-white/5">
                        {seller.name[0]}
                      </div>
                      <div>
                        <p className="text-sm font-black text-white tracking-tight">{seller.name}</p>
                        <p className="text-[10px] text-white/20 font-bold uppercase tracking-widest mt-0.5">{seller.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={cn(
                      "px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest inline-flex items-center gap-1.5",
                      seller.status === 'active' ? "bg-green-500/10 text-green-500" : 
                      seller.status === 'pending' ? "bg-amber-500/10 text-amber-500" : 
                      "bg-red-500/10 text-red-500"
                    )}>
                      <div className={cn(
                        "w-1.5 h-1.5 rounded-full",
                        seller.status === 'active' ? "bg-green-500" : 
                        seller.status === 'pending' ? "bg-amber-500" : "bg-red-500"
                      )} />
                      {seller.status}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2">
                      <Store size={14} className="text-white/20" />
                      <span className="text-sm font-black text-white">{seller.restaurants}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-sm font-black text-[var(--brand)]">₹{seller.totalRevenue.toLocaleString()}</td>
                  <td className="px-8 py-6 text-xs font-bold text-white/40 tracking-tight">{seller.joined}</td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => { setSelectedSeller(seller); setIsModalOpen(true); }}
                        className="p-2 rounded-lg bg-white/5 text-white/40 hover:text-white hover:bg-white/10 transition-all"
                      >
                        <ExternalLink size={16} />
                      </button>
                      <button className="p-2 rounded-lg bg-white/5 text-white/40 hover:text-red-500 hover:bg-red-500/10 transition-all">
                        <Ban size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Seller Details Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title="Seller Profile"
        maxWidth="lg"
      >
        {selectedSeller && (
          <div className="space-y-8">
            <div className="flex items-center gap-6 pb-6 border-b border-white/5">
              <div className="w-20 h-20 rounded-[2rem] gradient-brand flex items-center justify-center text-white font-black text-3xl shadow-2xl">
                {selectedSeller.name[0]}
              </div>
              <div>
                <h2 className="text-2xl font-black text-white tracking-tight">{selectedSeller.name}</h2>
                <div className="flex items-center gap-4 mt-2">
                  <span className="flex items-center gap-1.5 text-xs font-bold text-white/40 tracking-tight">
                    <Mail size={14} /> {selectedSeller.email}
                  </span>
                  <span className="flex items-center gap-1.5 text-xs font-bold text-white/40 tracking-tight">
                    <ShieldCheck size={14} className="text-green-500" /> KYC Verified
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-6">
              <div className="bg-white/5 p-5 rounded-2xl border border-white/5">
                <p className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-1">Total Stores</p>
                <p className="text-xl font-black text-white">{selectedSeller.restaurants}</p>
              </div>
              <div className="bg-white/5 p-5 rounded-2xl border border-white/5 col-span-2">
                <p className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-1">Lifetime Revenue</p>
                <p className="text-xl font-black text-[var(--brand)]">₹{selectedSeller.totalRevenue.toLocaleString()}</p>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xs font-black text-white/40 uppercase tracking-widest">Administrative Actions</h3>
              <div className="grid grid-cols-2 gap-4">
                <button className="flex items-center justify-center gap-3 py-4 rounded-2xl bg-green-500/10 text-green-500 font-black text-xs uppercase tracking-widest border border-green-500/20 hover:bg-green-500 hover:text-white transition-all">
                  <CheckCircle2 size={18} /> Approve KYC
                </button>
                <button className="flex items-center justify-center gap-3 py-4 rounded-2xl bg-red-500/10 text-red-500 font-black text-xs uppercase tracking-widest border border-red-500/20 hover:bg-red-500 hover:text-white transition-all">
                  <XCircle size={18} /> Suspend Account
                </button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
