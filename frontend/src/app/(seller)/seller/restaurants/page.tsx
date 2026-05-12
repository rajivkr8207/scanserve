'use client';

import React, { useState, useEffect } from 'react';
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
  Users,
  Loader2,
  X
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useRestaurants } from '@/features/restaurant/hooks/useRestaurants';
import { Modal } from '@/components/ui/Modal';
import { toast } from 'sonner';

export default function RestaurantsListPage() {
  const { restaurants, loading, error, fetchRestaurants, createRestaurant } = useRestaurants();
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: {
      street: '',
      city: '',
      state: '',
      pincode: '',
      country: 'India'
    },
    contact: {
      phone: '',
      email: ''
    },
    cuisineTypes: [] as string[]
  });

  useEffect(() => {
    fetchRestaurants();
  }, [fetchRestaurants]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createRestaurant(formData);
      setIsAddModalOpen(false);
      toast.success('Restaurant created successfully');
    } catch (err: any) {
      toast.error(err.message || 'Failed to create restaurant');
    }
  };

  const filtered = restaurants.filter((r: any) =>
    r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.cuisineTypes?.some((c: string) => c.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading && restaurants.length === 0) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="w-12 h-12 text-[var(--brand)] animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-[var(--text-primary)] tracking-tight font-[var(--font-outfit)]">My Restaurants</h1>
          <p className="text-[var(--text-secondary)] font-medium">Manage and monitor all your business outlets.</p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="btn btn-primary btn-lg gap-2 shadow-xl shadow-[var(--brand-glow)]"
          disabled={restaurants.length > 0} // Limit to 1 for now based on backend logic
        >
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
            onChange={(e: any) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="card p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
            <Store size={24} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest">Total Active</p>
            <p className="text-xl font-black text-[var(--text-primary)] tracking-tight">{restaurants.length} Outlets</p>
          </div>
        </div>
        <div className="card p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center text-green-600">
            <Users size={24} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest">Customers Today</p>
            <p className="text-xl font-black text-[var(--text-primary)] tracking-tight">0 Total</p>
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
                  <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-[var(--border)] group-hover:border-[var(--brand)] transition-colors shadow-lg bg-[var(--surface-2)] flex items-center justify-center">
                    {res.logo ? (
                      <img src={res.logo} alt={res.name} className="w-full h-full object-cover" />
                    ) : (
                      <Store size={32} className="text-[var(--text-muted)]" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-[var(--text-primary)] tracking-tight">{res.name}</h3>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs font-bold text-[var(--brand)] uppercase tracking-wider">
                        {res.cuisineTypes?.[0] || 'General'}
                      </span>
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--border)]" />
                      <span className="flex items-center gap-1 text-xs font-bold text-amber-500">
                        <Star size={12} fill="currentColor" /> 5.0
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={cn(
                    "badge px-3 py-1 font-bold text-[10px] uppercase",
                    res.isActive ? "badge-success" : "badge-error"
                  )}>
                    {res.isActive ? 'Active' : 'Inactive'}
                  </span>
                  <button className="p-2 rounded-xl hover:bg-[var(--surface-2)] text-[var(--text-muted)] transition-colors">
                    <MoreVertical size={18} />
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm font-medium text-[var(--text-secondary)] mb-8">
                <MapPin size={16} className="text-[var(--brand)]" /> {res.address.city}, {res.address.state}
              </div>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-[var(--surface-2)] p-4 rounded-2xl border border-[var(--border)]">
                  <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest mb-1">Status</p>
                  <p className="text-lg font-black text-[var(--text-primary)]">{res.isOpen ? 'Open' : 'Closed'}</p>
                </div>
                <div className="bg-[var(--surface-2)] p-4 rounded-2xl border border-[var(--border)]">
                  <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest mb-1">Today's Revenue</p>
                  <p className="text-lg font-black text-[var(--brand)]">₹0</p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <Link href={`/seller/restaurants/${res._id}/menu`} className="btn btn-ghost btn-sm px-0 flex-col gap-1 py-3 h-auto group/btn">
                  <ChefHat size={20} className="group-hover/btn:text-[var(--brand)] transition-colors" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Menu</span>
                </Link>
                <Link href={`/seller/qr?restaurantId=${res._id}`} className="btn btn-ghost btn-sm px-0 flex-col gap-1 py-3 h-auto group/btn">
                  <QrCode size={20} className="group-hover/btn:text-[var(--brand)] transition-colors" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">QR Codes</span>
                </Link>
                <Link href={`/seller/analytics?restaurantId=${res._id}`} className="btn btn-ghost btn-sm px-0 flex-col gap-1 py-3 h-auto group/btn">
                  <BarChart3 size={20} className="group-hover/btn:text-[var(--brand)] transition-colors" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Analytics</span>
                </Link>
                <Link href={`/seller/restaurants/${res._id}/settings`} className="btn btn-ghost btn-sm px-0 flex-col gap-1 py-3 h-auto group/btn">
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
        {restaurants.length === 0 && (
          <motion.button
            whileHover={{ scale: 0.99 }}
            onClick={() => setIsAddModalOpen(true)}
            className="border-4 border-dashed border-[var(--border)] rounded-[2rem] flex flex-col items-center justify-center gap-4 py-12 group hover:border-[var(--brand)] hover:bg-[var(--brand-light)] transition-all"
          >
            <div className="w-16 h-16 rounded-full bg-[var(--surface-2)] flex items-center justify-center text-[var(--text-muted)] group-hover:bg-[var(--brand)] group-hover:text-white transition-all shadow-sm">
              <Plus size={32} />
            </div>
            <div>
              <p className="text-xl font-black text-[var(--text-primary)] tracking-tight">Add Your First Outlet</p>
              <p className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest mt-1">Scale your business</p>
            </div>
          </motion.button>
        )}
      </div>

      {/* Add Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Restaurant"
        maxWidth="2xl"
      >
        <form onSubmit={handleCreate} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="label">Restaurant Name</label>
              <input
                type="text"
                required
                className="input-field"
                placeholder="e.g. Spice Garden"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="col-span-2">
              <label className="label">Description</label>
              <textarea
                className="input-field h-24"
                placeholder="Tell us about your restaurant..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div className="col-span-2">
              <h3 className="text-sm font-black uppercase tracking-widest text-[var(--text-muted)] mb-2">Address</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <input
                    type="text"
                    required
                    className="input-field"
                    placeholder="Street Address"
                    value={formData.address.street}
                    onChange={(e) => setFormData({ ...formData, address: { ...formData.address, street: e.target.value } })}
                  />
                </div>
                <input
                  type="text"
                  required
                  className="input-field"
                  placeholder="City"
                  value={formData.address.city}
                  onChange={(e) => setFormData({ ...formData, address: { ...formData.address, city: e.target.value } })}
                />
                <input
                  type="text"
                  required
                  className="input-field"
                  placeholder="State"
                  value={formData.address.state}
                  onChange={(e) => setFormData({ ...formData, address: { ...formData.address, state: e.target.value } })}
                />
                <input
                  type="text"
                  required
                  className="input-field"
                  placeholder="Pincode"
                  value={formData.address.pincode}
                  onChange={(e) => setFormData({ ...formData, address: { ...formData.address, pincode: e.target.value } })}
                />
              </div>
            </div>

            <div className="col-span-2">
              <h3 className="text-sm font-black uppercase tracking-widest text-[var(--text-muted)] mb-2">Contact</h3>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="tel"
                  required
                  className="input-field"
                  placeholder="Phone Number"
                  value={formData.contact.phone}
                  onChange={(e) => setFormData({ ...formData, contact: { ...formData.contact, phone: e.target.value } })}
                />
                <input
                  type="email"
                  className="input-field"
                  placeholder="Email (Optional)"
                  value={formData.contact.email}
                  onChange={(e) => setFormData({ ...formData, contact: { ...formData.contact, email: e.target.value } })}
                />
              </div>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              className="btn btn-ghost flex-1"
              onClick={() => setIsAddModalOpen(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary flex-[2] gap-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              Create Restaurant
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
