import api from '@/lib/axios';
import type { IMenuItem } from '@shared/types/menu.type';

export const menuService = {
  getMenuBySlug: async (slug: string): Promise<IMenuItem[]> => {
    const response = await api.get(`/menu/${slug}`);
    return response.data.data;
  },

  getRestaurantInfo: async (slug: string) => {
    const response = await api.get(`/restaurant/public/${slug}`);
    return response.data.data;
  },

  getMenuItemsByRestaurant: async (restaurantId: string): Promise<IMenuItem[]> => {
    const response = await api.get(`/menu/restaurant/${restaurantId}`);
    return response.data.data;
  },

  createMenuItem: async (data: Partial<IMenuItem>) => {
    const response = await api.post('/menu', data);
    return response.data.data;
  },

  updateMenuItem: async (id: string, data: Partial<IMenuItem>) => {
    const response = await api.put(`/menu/${id}`, data);
    return response.data.data;
  },

  deleteMenuItem: async (id: string) => {
    const response = await api.delete(`/menu/${id}`);
    return response.data.data;
  }
};
