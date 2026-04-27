'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Store,
  Menu as MenuIcon,
  ArrowUpRight,
  Plus,
  Users,
  TrendingUp,
  ChevronRight,
  Utensils,
  Clock
} from 'lucide-react';
import { restaurantService } from '@/modules/restaurant/services/restaurantService';
import { IRestaurant } from '@shared/types/restaurant.type';

export default function DashboardPage() {
  const [restaurants, setRestaurants] = useState<IRestaurant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await restaurantService.getMyRestaurants();
        setRestaurants(data);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const stats = [
    { name: 'Total Restaurants', value: restaurants.length, icon: Store, color: 'bg-blue-500', trend: '+12%' },
    { name: 'Total Menu Items', value: '0', icon: MenuIcon, color: 'bg-indigo-500', trend: '+5%' },
    { name: 'Total Scans', value: '0', icon: TrendingUp, color: 'bg-emerald-500', trend: '+25%' },
    { name: 'Average Rating', value: '4.8', icon: Users, color: 'bg-amber-500', trend: '0%' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden bg-indigo-600 rounded-3xl p-8 md:p-12 text-white shadow-xl shadow-indigo-100">
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">Your Restaurant Empire Starts Here!</h1>
          <p className="text-indigo-100 text-lg mb-8 opacity-90">
            Manage your menus, track orders, and grow your business with ScanServe's smart digital solutions.
          </p>
          <div className="flex flex-wrap gap-4">
            {restaurants.length > 0 ? (
              <Link
                href={`/restaurants/${restaurants[0]._id}/settings`}
                className="px-6 py-3 bg-white text-indigo-600 font-semibold rounded-xl hover:bg-indigo-50 transition-colors flex items-center gap-2"
              >
                <Store size={20} />
                Manage Restaurant
              </Link>
            ) : (
              <Link
                href="/restaurants"
                className="px-6 py-3 bg-white text-indigo-600 font-semibold rounded-xl hover:bg-indigo-50 transition-colors flex items-center gap-2"
              >
                <Plus size={20} />
                Add New Restaurant
              </Link>
            )}
            <button className="px-6 py-3 bg-indigo-500 text-white font-semibold rounded-xl border border-indigo-400 hover:bg-indigo-400 transition-colors">
              View Analytics
            </button>
          </div>
        </div>
        {/* Abstract background shapes */}
        <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-64 h-64 bg-indigo-400/20 rounded-full blur-3xl" />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200">
            <div className="flex items-start justify-between mb-4">
              <div className={`${stat.color} p-3 rounded-xl text-white shadow-lg`}>
                <stat.icon size={24} />
              </div>
              <span className="text-emerald-600 text-xs font-bold px-2 py-1 bg-emerald-50 rounded-full flex items-center gap-1">
                {stat.trend} <ArrowUpRight size={12} />
              </span>
            </div>
            <p className="text-slate-500 font-medium text-sm mb-1">{stat.name}</p>
            <h3 className="text-2xl font-bold text-slate-900">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Restaurants */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900">Your Restaurants</h3>
            <Link href="/restaurants" className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
              View all <ChevronRight size={16} />
            </Link>
          </div>
          <div className="divide-y divide-slate-50">
            {restaurants.length > 0 ? (
              restaurants.slice(0, 5).map((restaurant) => (
                <div key={restaurant._id} className="p-4 hover:bg-slate-50 transition-colors flex items-center justify-between group">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-500 transition-colors">
                      {restaurant.logo ? (
                        <img src={restaurant.logo} alt={restaurant.name} className="w-full h-full object-cover rounded-xl" />
                      ) : (
                        <Store size={28} />
                      )}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">{restaurant.name}</h4>
                      <p className="text-sm text-slate-500">{restaurant.cuisineTypes.join(', ')}</p>
                    </div>
                  </div>
                  <Link
                    href={`/restaurants/${restaurant._id}/menu`}
                    className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                  >
                    <MenuIcon size={20} />
                  </Link>
                </div>
              ))
            ) : (
              <div className="p-12 text-center">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                  <Store size={32} />
                </div>
                <h4 className="font-bold text-slate-900 mb-2">No restaurants found</h4>
                <p className="text-slate-500 text-sm mb-6">Create your first restaurant to get started.</p>
                <Link
                  href="/restaurants"
                  className="inline-flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-100"
                >
                  <Plus size={18} /> Add Restaurant
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions / Tips */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-6">Quick Actions</h3>
            <div className="grid grid-cols-1 gap-3">
              <button className="flex items-center gap-3 p-4 rounded-2xl bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-all group">
                <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Utensils size={20} />
                </div>
                <span className="font-semibold">Update Daily Menu</span>
              </button>
              <button className="flex items-center gap-3 p-4 rounded-2xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-all group">
                <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Clock size={20} />
                </div>
                <span className="font-semibold">Manage Hours</span>
              </button>
            </div>
          </div>

          <div className="bg-gradient-to-br from-amber-400 to-orange-500 p-6 rounded-3xl text-white shadow-lg shadow-orange-100">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <TrendingUp size={20} />
              </div>
              <span className="font-bold">Pro Tip</span>
            </div>
            <p className="font-medium text-sm leading-relaxed mb-4">
              Adding high-quality images to your menu items can increase order volume by up to 30%.
            </p>
            <button className="w-full py-2 bg-white/20 hover:bg-white/30 rounded-xl font-bold text-sm transition-colors backdrop-blur-sm">
              Upload Images Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
