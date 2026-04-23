import { useState, useEffect } from 'react';
import { menuService } from '../services/menuService';
import type { IMenuItem } from '@shared/types/menu.type';

export const useMenu = (slug: string) => {
  const [menuItems, setMenuItems] = useState<IMenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMenu = async () => {
      if (!slug) return;
      
      try {
        setLoading(true);
        const data = await menuService.getMenuBySlug(slug);
        setMenuItems(data);
        setError(null);
      } catch (err: any) {
        setError(err.message || 'Failed to load menu');
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, [slug]);

  return { menuItems, loading, error };
};
