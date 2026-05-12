'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Search, Plus, Edit2, Trash2, MoreVertical, GripVertical, Store, Loader2 } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import { useRestaurants } from '@/features/restaurant/hooks/useRestaurants';
import { useMenuManagement } from '@/features/menu/hooks/useMenuManagement';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export default function GlobalMenuPage() {
  const { restaurants, loading: loadingRestaurants } = useRestaurants();
  const [selectedRestaurantId, setSelectedRestaurantId] = React.useState<string>('');
  const [mounted, setMounted] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState('');

  const {
    categories,
    menuItems,
    loading: loadingMenu,
    fetchData,
    toggleAvailability,
    deleteMenuItem
  } = useMenuManagement(selectedRestaurantId);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Automatically select first restaurant if none selected
  React.useEffect(() => {
    if (restaurants.length > 0 && !selectedRestaurantId) {
      setSelectedRestaurantId(restaurants[0]._id);
    }
  }, [restaurants, selectedRestaurantId]);

  React.useEffect(() => {
    if (selectedRestaurantId) {
      fetchData();
    }
  }, [selectedRestaurantId, fetchData]);

  const filteredItems = menuItems.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (typeof item.category === 'object' ? item.category?.name : '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!mounted) return null;

  if (loadingRestaurants) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="w-12 h-12 text-[var(--brand)] animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Top Header & Restaurant Selector */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black text-[var(--text-primary)] tracking-tight font-[var(--font-outfit)]">Inventory & Menu</h1>
          <p className="text-[var(--text-secondary)] font-medium">Global view of all your items across outlets.</p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          <div className="relative w-full sm:w-64 group">
            <Store size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] group-focus-within:text-[var(--brand)]" />
            <select
              value={selectedRestaurantId}
              onChange={(e) => setSelectedRestaurantId(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-[var(--surface)] border-2 border-[var(--border)] rounded-2xl outline-none focus:border-[var(--brand)] transition-all font-bold text-sm appearance-none"
            >
              <option value="">Select Restaurant</option>
              {restaurants.map(res => (
                <option key={res._id} value={res._id}>{res.name}</option>
              ))}
            </select>
          </div>
          {selectedRestaurantId && (
            <Link href={`/seller/restaurants/${selectedRestaurantId}/menu`} className="w-full sm:w-auto">
              <Button leftIcon={<Edit2 size={18} />} variant="ghost" className="w-full">
                Edit Menu
              </Button>
            </Link>
          )}
        </div>
      </div>

      {!selectedRestaurantId ? (
        <div className="card p-20 flex flex-col items-center justify-center text-center gap-6 border-dashed border-4">
          <div className="w-20 h-20 rounded-full bg-[var(--surface-2)] flex items-center justify-center text-[var(--text-muted)]">
            <Store size={40} />
          </div>
          <div>
            <h2 className="text-2xl font-black">No Restaurant Selected</h2>
            <p className="text-[var(--text-secondary)] font-medium mt-2">Select an outlet from the dropdown above to manage its menu.</p>
          </div>
          {restaurants.length === 0 && (
            <Link href="/seller/restaurants">
              <Button variant="primary">Create Restaurant</Button>
            </Link>
          )}
        </div>
      ) : (
        <>
          {/* Controls */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <Input
              placeholder="Search items by name or category..."
              leftIcon={<Search size={18} />}
              className="max-w-md bg-[var(--surface-2)] border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Link href={`/seller/restaurants/${selectedRestaurantId}/menu`}>
              <Button leftIcon={<Plus size={18} />}>
                Add Menu Item
              </Button>
            </Link>
          </div>

          {/* Menu Table */}
          <GlassCard intensity="light" className="p-0 overflow-hidden">
            <div className="w-full overflow-x-auto custom-scrollbar">
              <table className="data-table">
                <thead>
                  <tr>
                    <th className="w-12"></th>
                    <th>Item Details</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Status</th>
                    <th className="text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence mode="wait">
                    {loadingMenu ? (
                      <tr>
                        <td colSpan={6} className="text-center py-20">
                          <Loader2 className="w-8 h-8 text-[var(--brand)] animate-spin mx-auto" />
                        </td>
                      </tr>
                    ) : filteredItems.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="text-center py-20 text-[var(--text-muted)] font-medium">
                          No items found matching your search.
                        </td>
                      </tr>
                    ) : (
                      filteredItems?.map((item, index) => (
                        <motion.tr
                          key={item._id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="group"
                        >
                          <td className="text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-grab">
                            <GripVertical size={18} />
                          </td>
                          <td>
                            <div className="flex items-center gap-3">
                              <div className={cn(
                                "w-3 h-3 rounded-[3px] border-[1.5px] flex items-center justify-center",
                                item.isVeg ? "border-green-600" : "border-red-600"
                              )}>
                                <div className={cn(
                                  "w-1.5 h-1.5 rounded-full",
                                  item.isVeg ? "bg-green-600" : "bg-red-600"
                                )} />
                              </div>
                              <span className="font-semibold text-[var(--text-primary)]">{item.name}</span>
                            </div>
                          </td>
                          <td>
                            <span className="px-3 py-1 rounded-full bg-[var(--surface-2)] text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
                              {typeof item.category === 'object' ? item.category.name : 'General'}
                            </span>
                          </td>
                          <td className="font-bold text-[var(--text-primary)]">₹{item.price}</td>
                          <td>
                            <button
                              className={cn(
                                "badge cursor-pointer",
                                item.isAvailable ? "badge-success" : "badge-error"
                              )}
                              onClick={() => toggleAvailability(item._id)}
                            >
                              {item.isAvailable ? 'Available' : 'Out of Stock'}
                            </button>
                          </td>
                          <td>
                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Link href={`/seller/restaurants/${selectedRestaurantId}/menu`}>
                                <button className="p-2 text-[var(--text-secondary)] hover:text-[var(--brand)] hover:bg-[var(--brand-light)] rounded-lg transition-colors">
                                  <Edit2 size={16} />
                                </button>
                              </Link>
                              <button
                                className="p-2 text-[var(--text-secondary)] hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                                onClick={() => {
                                  if (confirm('Delete this item?')) deleteMenuItem(item._id);
                                }}
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      ))
                    )}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </GlassCard>
        </>
      )}
    </div>
  );
}
