'use client';

import { useState, useCallback } from 'react';
import { menuService } from '../services/menuService';
import type { IMenuItem } from '@shared/types/menu.type';
import type { IMenuCategory } from '@shared/types/category.type';

export const useMenuManagement = (restaurantId: string) => {
  const [categories, setCategories] = useState<IMenuCategory[]>([]);
  const [menuItems, setMenuItems] = useState<IMenuItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!restaurantId) return;
    setLoading(true);
    try {
      const [cats, items] = await Promise.all([
        menuService.getCategories(restaurantId),
        menuService.getMenuItems(restaurantId)
      ]);
      setCategories(cats);
      setMenuItems(items);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch menu data');
    } finally {
      setLoading(false);
    }
  }, [restaurantId]);

  // Category Actions
  const createCategory = async (data: Partial<IMenuCategory>) => {
    try {
      const newCat = await menuService.createCategory({ ...data, restaurant: restaurantId });
      setCategories(prev => [...prev, newCat]);
      return newCat;
    } catch (err: any) {
      setError(err.message || 'Failed to create category');
      throw err;
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      await menuService.deleteCategory(id);
      setCategories(prev => prev.filter(c => c._id !== id));
    } catch (err: any) {
      setError(err.message || 'Failed to delete category');
      throw err;
    }
  };

  // Menu Item Actions
  const createMenuItem = async (data: Partial<IMenuItem>) => {
    try {
      const newItem = await menuService.createMenuItem({ ...data, restaurant: restaurantId });
      setMenuItems(prev => [...prev, newItem]);
      return newItem;
    } catch (err: any) {
      setError(err.message || 'Failed to create menu item');
      throw err;
    }
  };

  const updateMenuItem = async (id: string, data: Partial<IMenuItem>) => {
    try {
      const updated = await menuService.updateMenuItem(id, data);
      setMenuItems(prev => prev.map(item => item._id === id ? updated : item));
      return updated;
    } catch (err: any) {
      setError(err.message || 'Failed to update menu item');
      throw err;
    }
  };

  const deleteMenuItem = async (id: string) => {
    try {
      await menuService.deleteMenuItem(id);
      setMenuItems(prev => prev.filter(item => item._id !== id));
    } catch (err: any) {
      setError(err.message || 'Failed to delete menu item');
      throw err;
    }
  };

  const toggleAvailability = async (id: string) => {
    try {
      const updated = await menuService.toggleAvailability(id);
      setMenuItems(prev => prev.map(item => item._id === id ? updated : item));
    } catch (err: any) {
      setError(err.message || 'Failed to toggle availability');
      throw err;
    }
  };

  return {
    categories,
    menuItems,
    loading,
    error,
    fetchData,
    createCategory,
    deleteCategory,
    createMenuItem,
    updateMenuItem,
    deleteMenuItem,
    toggleAvailability
  };
};
