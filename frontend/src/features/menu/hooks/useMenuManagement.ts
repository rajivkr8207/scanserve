'use client';

import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { 
  fetchMenuData, 
  addMenuItemToState, 
  updateMenuItemInState, 
  removeMenuItemFromState,
  addCategoryToState,
  removeCategoryFromState,
  setMenuLoading
} from '@/store/slices/menuSlice';
import { menuService } from '../services/menuService';
import type { IMenuItem } from '@shared/types/menu.type';
import type { IMenuCategory } from '@shared/types/category.type';

export const useMenuManagement = (restaurantId: string) => {
  const dispatch = useAppDispatch();
  const { categories, menuItems, loading, error, lastFetchedRestaurantId } = useAppSelector(s => s.menu);

  const fetchData = useCallback(async (force = false) => {
    if (!restaurantId) return;
    
    // Avoid refetching if we already have data for this restaurant
    if (!force && lastFetchedRestaurantId === restaurantId && menuItems.length > 0) {
      return;
    }
    
    dispatch(fetchMenuData(restaurantId));
  }, [restaurantId, lastFetchedRestaurantId, menuItems.length, dispatch]);

  // Category Actions
  const createCategory = async (data: Partial<IMenuCategory>) => {
    try {
      const newCat = await menuService.createCategory({ ...data, restaurant: restaurantId });
      dispatch(addCategoryToState(newCat));
      return newCat;
    } catch (err: any) {
      throw err;
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      await menuService.deleteCategory(id);
      dispatch(removeCategoryFromState(id));
    } catch (err: any) {
      throw err;
    }
  };

  // Menu Item Actions
  const createMenuItem = async (data: Partial<IMenuItem>) => {
    try {
      const newItem = await menuService.createMenuItem({ ...data, restaurant: restaurantId });
      dispatch(addMenuItemToState(newItem));
      return newItem;
    } catch (err: any) {
      throw err;
    }
  };

  const updateMenuItem = async (id: string, data: Partial<IMenuItem>) => {
    try {
      const updated = await menuService.updateMenuItem(id, data);
      dispatch(updateMenuItemInState(updated));
      return updated;
    } catch (err: any) {
      throw err;
    }
  };

  const deleteMenuItem = async (id: string) => {
    try {
      await menuService.deleteMenuItem(id);
      dispatch(removeMenuItemFromState(id));
    } catch (err: any) {
      throw err;
    }
  };

  const toggleAvailability = async (id: string) => {
    try {
      const updated = await menuService.toggleAvailability(id);
      dispatch(updateMenuItemInState(updated));
      return updated;
    } catch (err: any) {
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
