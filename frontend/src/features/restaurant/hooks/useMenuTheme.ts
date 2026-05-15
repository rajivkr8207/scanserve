import { useState, useCallback, useEffect } from 'react';
import { menuThemeService } from '../services/menuThemeService';
import type { IMenuTheme } from '@shared/types/menu-theme.type';
import { toast } from 'sonner';

export const useMenuTheme = (restaurantId?: string, slug?: string) => {
  const [theme, setTheme] = useState<IMenuTheme | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const fetchTheme = useCallback(async () => {
    const isInvalidSlug = !slug || slug === 'undefined' || slug === '[slug]';
    const isInvalidId = !restaurantId || restaurantId === 'undefined' || restaurantId === '[id]';

    if (isInvalidId && isInvalidSlug) {
      // If we don't have a valid identifier, only fetch 'mine' for the seller dashboard context
      if (!restaurantId && !slug) {
         // Potentially fetch 'mine' for seller dashboard
         try {
           setLoading(true);
           const data = await menuThemeService.getMyTheme();
           setTheme(data);
           return;
         } catch (e) {
           return;
         } finally {
           setLoading(false);
         }
      }
      return;
    }

    try {
      setLoading(true);
      let data: IMenuTheme;
      if (restaurantId) {
        data = await menuThemeService.getThemeByRestaurantId(restaurantId);
      } else if (slug) {
        data = await menuThemeService.getThemeByRestaurantSlug(slug);
      } else {
        data = await menuThemeService.getMyTheme();
      }
      setTheme(data);
    } catch (error: any) {
      console.error('Failed to fetch theme:', error);
      // Silence toast for 404s and transition states
      const status = error.response?.status;
      if (status && status !== 404) {
        toast.error('Failed to load theme settings.');
      }
    } finally {
      setLoading(false);
    }
  }, [restaurantId, slug]);

  const saveTheme = async (updatedData: Partial<IMenuTheme>) => {
    if (!theme?._id) return;
    try {
      setSaving(true);
      const updatedTheme = await menuThemeService.updateTheme(theme._id, updatedData);
      setTheme(updatedTheme);
      toast.success('Theme updated successfully');
      return updatedTheme;
    } catch (error: any) {
      toast.error(error.message || 'Failed to save theme');
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    fetchTheme();
  }, [fetchTheme]);

  return {
    theme,
    setTheme,
    loading,
    saving,
    fetchTheme,
    saveTheme
  };
};
