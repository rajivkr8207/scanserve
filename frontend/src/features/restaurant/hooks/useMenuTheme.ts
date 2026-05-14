import { useState, useCallback, useEffect } from 'react';
import { menuThemeService } from '../services/menuThemeService';
import type { IMenuTheme } from '@shared/types/menu-theme.type';
import { toast } from 'sonner';

export const useMenuTheme = (restaurantId?: string, slug?: string) => {
  const [theme, setTheme] = useState<IMenuTheme | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const fetchTheme = useCallback(async () => {
    try {
      setLoading(true);
      let data: IMenuTheme;
      if (slug) {
        data = await menuThemeService.getThemeBySlug(slug);
      } else {
        data = await menuThemeService.getMyTheme();
      }
      setTheme(data);
    } catch (error: any) {
      console.error('Failed to fetch theme:', error);
      toast.error('Failed to load theme settings. Please try again.');
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
