'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import type { IRestaurant } from '@shared/types/restaurant.type';
import type { IMenuItem } from '@shared/types/menu.type';
import TemplateSwitcher from '@/modules/menu/components/templates/TemplateSwitcher';
import { menuService } from '@/modules/menu/services/menuService';

// Extend IMenuItem for populated category
interface PopulatedMenuItem extends Omit<IMenuItem, 'category'> {
  category: {
    _id: string;
    name: string;
  } | null;
}

export default function PublicMenuPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [restaurant, setRestaurant] = useState<IRestaurant | null>(null);
  const [menu, setMenu] = useState<PopulatedMenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const [resData, menuData] = await Promise.all([
          menuService.getRestaurantInfo(slug),
          menuService.getMenuBySlug(slug),
        ]);
        setRestaurant(resData);
        setMenu(menuData as any);
      } catch (err: any) {
        setError(err.message || 'Failed to load menu');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-16 h-16 bg-slate-200 rounded-full mb-4"></div>
          <div className="h-4 w-48 bg-slate-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error || !restaurant) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Oops! Menu Not Found</h1>
        <p className="text-slate-500 mb-8">{error || "We couldn't find the restaurant you're looking for."}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-indigo-600 text-white rounded-xl font-bold"
        >
          Try Again
        </button>
      </div>
    );
  }

  return <TemplateSwitcher restaurant={restaurant} menu={menu} />;
}
