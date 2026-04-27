'use client';

import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { 
  setRestaurants, 
  setLoading, 
  setError, 
  addRestaurant, 
  updateRestaurantInList 
} from '@/store/slices/restaurantSlice';
import { restaurantService } from '../services/restaurantService';
import type { IRestaurant } from '@shared/types/restaurant.type';

export const useRestaurants = () => {
  const dispatch = useAppDispatch();
  const { restaurants, isLoading: loading, error } = useAppSelector(state => state.restaurant);

  const fetchRestaurants = useCallback(async () => {
    dispatch(setLoading(true));
    try {
      const data = await restaurantService.getMyRestaurants();
      dispatch(setRestaurants(Array.isArray(data) ? data : data ? [data] : []));
      dispatch(setError(null));
    } catch (err: any) {
      if (err.response?.status === 404) {
        dispatch(setRestaurants([]));
        dispatch(setError(null));
      } else {
        dispatch(setError(err.message || 'Failed to fetch restaurants'));
      }
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  const createRestaurant = async (data: Partial<IRestaurant>) => {
    dispatch(setLoading(true));
    try {
      const newRestaurant = await restaurantService.createRestaurant(data);
      dispatch(addRestaurant(newRestaurant));
      dispatch(setError(null));
      return newRestaurant;
    } catch (err: any) {
      dispatch(setError(err.message || 'Failed to create restaurant'));
      throw err;
    } finally {
      dispatch(setLoading(false));
    }
  };

  const updateRestaurant = async (data: Partial<IRestaurant>) => {
    dispatch(setLoading(true));
    try {
      const updated = await restaurantService.updateRestaurant(data);
      dispatch(updateRestaurantInList(updated));
      dispatch(setError(null));
      return updated;
    } catch (err: any) {
      dispatch(setError(err.message || 'Failed to update restaurant'));
      throw err;
    } finally {
      dispatch(setLoading(false));
    }
  };

  return {
    restaurants,
    loading,
    error,
    fetchRestaurants,
    createRestaurant,
    updateRestaurant,
  };
};
