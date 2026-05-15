import api from '@/lib/axios';
import type { IMenuTheme } from '@shared/types/menu-theme.type';

export const menuThemeService = {
  /**
   * Get all available themes (for admin/seller selection)
   */
  getAllThemes: async (): Promise<IMenuTheme[]> => {
    const response = await api.get('/themes');
    return response.data.data;
  },

  /**
   * Get theme for the logged-in seller
   */
  getMyTheme: async (): Promise<IMenuTheme> => {
    const response = await api.get('/themes/mine');
    return response.data.data;
  },

  /**
   * Get theme by ID
   */
  getThemeById: async (id: string): Promise<IMenuTheme> => {
    const response = await api.get(`/themes/${id}`);
    return response.data.data;
  },

  /**
   * Get theme by slug (public access)
   */
  getThemeBySlug: async (slug: string): Promise<IMenuTheme> => {
    const response = await api.get(`/themes/slug/${slug}`);
    return response.data.data;
  },

  /**
   * Get theme by restaurant ID (public access)
   */
  getThemeByRestaurantId: async (restaurantId: string): Promise<IMenuTheme> => {
    const response = await api.get(`/themes/restaurant/${restaurantId}`);
    return response.data.data;
  },

  /**
   * Get theme by restaurant slug (public access)
   */
  getThemeByRestaurantSlug: async (slug: string): Promise<IMenuTheme> => {
    const response = await api.get(`/themes/restaurant/slug/${slug}`);
    return response.data.data;
  },

  /**
   * Create a new theme
   */
  createTheme: async (data: Partial<IMenuTheme>): Promise<IMenuTheme> => {
    const response = await api.post('/themes', data);
    return response.data.data;
  },

  /**
   * Update an existing theme
   */
  updateTheme: async (id: string, data: Partial<IMenuTheme>): Promise<IMenuTheme> => {
    const response = await api.put(`/themes/${id}`, data);
    return response.data.data;
  },

  /**
   * Delete a theme
   */
  deleteTheme: async (id: string): Promise<void> => {
    await api.delete(`/themes/${id}`);
  }
};
