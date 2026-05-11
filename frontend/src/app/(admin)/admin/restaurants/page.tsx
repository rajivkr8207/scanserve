'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard } from '@/components/ui/GlassCard';
import { Input } from '@/components/ui/Input';
import { Search, Filter, CheckCircle2, XCircle, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/Button';

const MOCK_RESTAURANTS = [
  { id: '1', name: 'Spice Garden', owner: 'Rahul Sharma', email: 'rahul@spicegarden.com', status: 'approved', date: '2026-05-10' },
  { id: '2', name: 'Neon Lounge', owner: 'Vikas Kumar', email: 'vikas@neonlounge.in', status: 'pending', date: '2026-05-11' },
  { id: '3', name: 'Cafe Mocha', owner: 'Priya Desai', email: 'priya@cafemocha.com', status: 'rejected', date: '2026-05-09' },
  { id: '4', name: 'Urban Grill', owner: 'Amit Singh', email: 'amit@urbangrill.co', status: 'approved', date: '2026-05-08' },
];

export default function AdminRestaurantsPage() {
  const [search, setSearch] = React.useState('');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Restaurant Approvals</h1>
          <p className="text-[var(--text-secondary)] text-sm">Manage and onboard new sellers to the platform.</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Input 
            placeholder="Search restaurants..." 
            leftIcon={<Search size={18} />}
            value={search}
            onChange={(e: any) => setSearch(e.target.value)}
            className="w-full sm:w-64 bg-[var(--surface-2)]"
          />
          <Button variant="secondary" size="icon">
            <Filter size={18} />
          </Button>
        </div>
      </div>

      <GlassCard intensity="light" className="p-0 overflow-hidden">
        <div className="w-full overflow-x-auto custom-scrollbar">
          <table className="data-table">
            <thead>
              <tr>
                <th>Restaurant Name</th>
                <th>Owner Details</th>
                <th>Registration Date</th>
                <th>Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {MOCK_RESTAURANTS.filter((r: any) => r.name.toLowerCase().includes(search.toLowerCase())).map((restaurant, index) => (
                  <motion.tr
                    key={restaurant.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="group"
                  >
                    <td>
                      <span className="font-bold text-[var(--text-primary)]">{restaurant.name}</span>
                    </td>
                    <td>
                      <div className="flex flex-col">
                        <span className="font-medium text-[var(--text-primary)]">{restaurant.owner}</span>
                        <span className="text-xs text-[var(--text-muted)]">{restaurant.email}</span>
                      </div>
                    </td>
                    <td className="text-[var(--text-secondary)]">
                      {restaurant.date}
                    </td>
                    <td>
                      <span className={`badge ${
                        restaurant.status === 'approved' ? 'badge-success' : 
                        restaurant.status === 'rejected' ? 'badge-error' : 'badge-warning'
                      }`}>
                        {restaurant.status.toUpperCase()}
                      </span>
                    </td>
                    <td>
                      <div className="flex items-center justify-end gap-2">
                        {restaurant.status === 'pending' && (
                          <>
                            <button className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/30 rounded-lg transition-colors" title="Approve">
                              <CheckCircle2 size={18} />
                            </button>
                            <button className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors" title="Reject">
                              <XCircle size={18} />
                            </button>
                          </>
                        )}
                        <button className="p-2 text-[var(--text-secondary)] hover:bg-[var(--surface-2)] rounded-lg transition-colors">
                          <MoreVertical size={18} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
}
