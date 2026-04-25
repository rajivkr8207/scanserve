'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Plus,
  Store,
  Search,
  MoreVertical,
  ExternalLink,
  MapPin,
  Phone,
  Edit3,
  Trash2,
  Settings,
  ChevronRight
} from 'lucide-react';
import { useRestaurants } from '@/modules/restaurant/hooks/useRestaurants';
import { AuthInput } from '@/modules/auth/components/AuthInput';
import { AuthButton } from '@/modules/auth/components/AuthButton';

export default function RestaurantsPage() {
  const { restaurants, loading, error, fetchRestaurants, createRestaurant } = useRestaurants();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // New Restaurant Form State
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    cuisineTypes: '',
    address: { street: '', city: '', state: '', pincode: '', country: 'India' },
    contact: { phone: '', email: '' }
  });

  useEffect(() => {
    fetchRestaurants();
  }, [fetchRestaurants]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createRestaurant({
        ...formData,
        cuisineTypes: formData.cuisineTypes.split(',').map(s => s.trim())
      });
      setIsModalOpen(false);
      setFormData({
        name: '',
        slug: '',
        cuisineTypes: '',
        address: { street: '', city: '', state: '', pincode: '', country: 'India' },
        contact: { phone: '', email: '' }
      });
    } catch (err) {
      // Error handled by hook
    }
  };

  const filteredRestaurants = restaurants
  // ?.filter((r: any) =>
  //   r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //   r.cuisineTypes.some((c: any) => c.toLowerCase().includes(searchTerm.toLowerCase()))
  // );

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search restaurants..."
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        {restaurants.length == 0 && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 flex items-center justify-center gap-2 whitespace-nowrap"
          >
            <Plus size={20} />
            Add Restaurant
          </button>
        )}
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 flex items-center gap-3">
          <span className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-bold">!</span>
          {error}
        </div>
      )}

      {/* Restaurant Grid */}
      {loading && restaurants?.length === 0 ? (
        <div className="grid grid-cols-1 gap-6 animate-pulse">
          {[1, 2, 3].map(i => <div key={i} className="h-64 bg-slate-100 rounded-3xl" />)}
        </div>
      ) : filteredRestaurants?.length > 0 ? (
        <div className="grid grid-cols-1 gap-6">
          {filteredRestaurants.map((restaurant) => (
            <div key={restaurant._id} className="group bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-indigo-200 transition-all duration-300 overflow-hidden flex flex-col">
              {/* Cover Image Placeholder */}
              <div className="h-32 bg-slate-100 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent" />
                <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-white text-xs font-bold border border-white/20">
                  {restaurant.isActive ? 'Active' : 'Inactive'}
                </div>
              </div>

              {/* Logo Overlay */}
              <div className="px-6 -mt-10 relative z-10 flex justify-between items-end">
                <div className="w-20 h-20 bg-white rounded-2xl p-1 shadow-lg border border-slate-100">
                  <div className="w-full h-full bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
                    {restaurant.logo ? (
                      <img src={restaurant.logo} alt={restaurant.name} className="w-full h-full object-cover rounded-xl" />
                    ) : (
                      <Store size={32} />
                    )}
                  </div>
                </div>
                <div className="flex gap-2 mb-2">
                  <Link
                    href={`/restaurants/${restaurant._id}/settings`}
                    className="p-2 bg-white text-slate-500 hover:text-indigo-600 rounded-lg shadow-sm border border-slate-100 transition-colors"
                  >
                    <Settings size={18} />
                  </Link>
                  <button className="p-2 bg-white text-slate-500 hover:text-red-600 rounded-lg shadow-sm border border-slate-100 transition-colors">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              <div className="p-6 pt-4 flex-1 flex flex-col">
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-slate-900 mb-1 group-hover:text-indigo-600 transition-colors">
                    {restaurant.name}
                  </h3>
                  <p className="text-sm text-slate-500 flex items-center gap-1">
                    <MapPin size={14} /> {restaurant.address.city}, {restaurant.address.state}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                  {restaurant.cuisineTypes.slice(0, 3).map(c => (
                    <span key={c} className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 bg-slate-100 text-slate-600 rounded-md">
                      {c}
                    </span>
                  ))}
                  {restaurant.cuisineTypes.length > 3 && (
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 bg-slate-100 text-slate-600 rounded-md">
                      +{restaurant.cuisineTypes.length - 3} more
                    </span>
                  )}
                </div>

                <div className="mt-auto grid grid-cols-2 gap-3 pt-4 border-t border-slate-50">
                  <Link
                    href={`/restaurants/${restaurant._id}/menu`}
                    className="flex items-center justify-center gap-2 py-2 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors shadow-sm"
                  >
                    Manage Menu
                  </Link>
                  <Link
                    href={`/${restaurant.slug}/menu`}
                    target="_blank"
                    className="flex items-center justify-center gap-2 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-colors"
                  >
                    <ExternalLink size={16} />
                    Public View
                  </Link>
                </div>
                <Link
                  href={`/restaurants/${restaurant._id}/orders`}
                  className="mt-3 flex items-center justify-center gap-2 py-2 bg-emerald-50 text-emerald-700 font-bold rounded-xl hover:bg-emerald-100 transition-colors w-full"
                >
                  Orders
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-20 text-center bg-white rounded-3xl border border-slate-200 border-dashed">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
            <Store size={40} />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-2">No restaurants matched</h3>
          <p className="text-slate-500 mb-8 max-w-md mx-auto">Try a different search term or add a new restaurant to your collection.</p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
          >
            <Plus size={20} /> Add New Restaurant
          </button>
        </div>
      )}

      {/* Add Restaurant Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
              <div>
                <h3 className="text-xl font-bold text-slate-900">Add New Restaurant</h3>
                <p className="text-sm text-slate-500">Fill in the basic details to create your store.</p>
              </div>
              <button className="p-2 text-slate-400 hover:bg-slate-50 rounded-full" onClick={() => setIsModalOpen(false)}>
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-bold text-slate-800 text-sm uppercase tracking-wider">Store Information</h4>
                  <AuthInput
                    id="res-name" label="Restaurant Name" type="text" placeholder="e.g. Tasty Trails" required
                    value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })}
                  />
                  <AuthInput
                    id="res-slug" label="Unique Slug" type="text" placeholder="tasty-trails" required
                    value={formData.slug} onChange={e => setFormData({ ...formData, slug: e.target.value })}
                  />
                  <AuthInput
                    id="res-cuisines" label="Cuisines (comma separated)" type="text" placeholder="Indian, Chinese, Italian"
                    value={formData.cuisineTypes} onChange={e => setFormData({ ...formData, cuisineTypes: e.target.value })}
                  />
                </div>

                <div className="space-y-4">
                  <h4 className="font-bold text-slate-800 text-sm uppercase tracking-wider">Contact Details</h4>
                  <AuthInput
                    id="res-phone" label="Contact Phone" type="tel" placeholder="+91 98765 43210" required
                    value={formData.contact.phone} onChange={e => setFormData({ ...formData, contact: { ...formData.contact, phone: e.target.value } })}
                  />
                  <AuthInput
                    id="res-email" label="Contact Email" type="email" placeholder="store@example.com"
                    value={formData.contact.email} onChange={e => setFormData({ ...formData, contact: { ...formData.contact, email: e.target.value } })}
                  />
                </div>

                <div className="md:col-span-2 space-y-4 pt-4 border-t border-slate-50">
                  <h4 className="font-bold text-slate-800 text-sm uppercase tracking-wider">Address</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <AuthInput
                      id="res-street" label="Street Address" type="text" placeholder="123 Main St" required
                      value={formData.address.street} onChange={e => setFormData({ ...formData, address: { ...formData.address, street: e.target.value } })}
                    />
                    <AuthInput
                      id="res-city" label="City" type="text" placeholder="Bangalore" required
                      value={formData.address.city} onChange={e => setFormData({ ...formData, address: { ...formData.address, city: e.target.value } })}
                    />
                    <AuthInput
                      id="res-state" label="State" type="text" placeholder="Karnataka" required
                      value={formData.address.state} onChange={e => setFormData({ ...formData, address: { ...formData.address, state: e.target.value } })}
                    />
                    <AuthInput
                      id="res-pincode" label="Pincode" type="text" placeholder="560001" required
                      value={formData.address.pincode} onChange={e => setFormData({ ...formData, address: { ...formData.address, pincode: e.target.value } })}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-8 flex gap-3">
                <AuthButton type="submit" isLoading={loading} className="flex-1">Create Restaurant</AuthButton>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// Simple X icon for modal
const X = ({ size, ...props }: any) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);
