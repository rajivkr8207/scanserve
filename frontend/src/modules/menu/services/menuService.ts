import api from '@/lib/axios';
import type { IMenuItem } from '@shared/types/menu.type';
import type { IMenuCategory } from '@shared/types/category.type';

export const menuService = {
  // Public
  getMenuBySlug: async (slug: string): Promise<IMenuItem[]> => {
    const response = await api.get(`/menu/public/${slug}`);
    return response.data.data;
  },

  getRestaurantInfo: async (slug: string) => {
    const response = await api.get(`/restaurant/public/${slug}`);
    return response.data.data;
  },

  // Categories
  getCategories: async (restaurantId: string): Promise<IMenuCategory[]> => {
    const response = await api.get('/category', { params: { restaurantId } });
    return response.data.data;
  },

  createCategory: async (data: Partial<IMenuCategory>): Promise<IMenuCategory> => {
    const response = await api.post('/category', data);
    return response.data.data;
  },

  updateCategory: async (id: string, data: Partial<IMenuCategory>): Promise<IMenuCategory> => {
    const response = await api.put(`/category/${id}`, data);
    return response.data.data;
  },

  deleteCategory: async (id: string): Promise<void> => {
    await api.delete(`/category/${id}`);
  },

  // Menu Items
  getMenuItems: async (restaurantId: string): Promise<IMenuItem[]> => {
    const response = await api.get('/menu', { params: { restaurantId } });
    return response.data.data;
  },

  createMenuItem: async (data: Partial<IMenuItem>): Promise<IMenuItem> => {
    const response = await api.post('/menu', data);
    return response.data.data;
  },

  updateMenuItem: async (id: string, data: Partial<IMenuItem>): Promise<IMenuItem> => {
    const response = await api.put(`/menu/${id}`, data);
    return response.data.data;
  },

  deleteMenuItem: async (id: string): Promise<void> => {
    await api.delete(`/menu/${id}`);
  },

  toggleAvailability: async (id: string): Promise<IMenuItem> => {
    const response = await api.patch(`/menu/${id}/availability`);
    return response.data.data;
  },
};
