import api from '@/lib/axios';
import type { IRestaurant } from '@shared/types/restaurant.type';

export const restaurantService = {
  createRestaurant: async (data: Partial<IRestaurant>): Promise<IRestaurant> => {
    const response = await api.post('/restaurant', data);
    return response.data.data;
  },

  getMyRestaurants: async (): Promise<IRestaurant[]> => {
    const response = await api.get('/restaurant/my');
    const data = response.data.data;
    if (!data) return [];
    return Array.isArray(data) ? data : [data];
  },

  getRestaurantById: async (id: string): Promise<IRestaurant> => {
    const response = await api.get(`/restaurant/${id}`);
    return response.data.data;
  },

  updateRestaurant: async (data: Partial<IRestaurant>): Promise<IRestaurant> => {
    const response = await api.put('/restaurant', data);
    return response.data.data;
  },

  patchRestaurantBasic: async (data: Partial<IRestaurant>): Promise<IRestaurant> => {
    const response = await api.patch('/restaurant/basic', data);
    return response.data.data;
  },

  patchRestaurantImages: async (formData: FormData): Promise<IRestaurant> => {
    const response = await api.patch('/restaurant/images', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  },
};
