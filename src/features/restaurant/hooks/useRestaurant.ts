'use client'

import { useState, useEffect, useCallback } from 'react'
import { restaurantService, Restaurant, CreateRestaurantRequest } from '../services/restaurant.service'
import { toast } from 'react-hot-toast'

export const useRestaurant = () => {
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchRestaurant = useCallback(async () => {
    try {
      setLoading(true)
      const data = await restaurantService.getMyRestaurant()
      setRestaurant(data)
    } catch (error) {
      console.error('Failed to fetch restaurant:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchRestaurant()
  }, [fetchRestaurant])

  const createRestaurant = async (data: CreateRestaurantRequest) => {
    try {
      setLoading(true)
      const newRestaurant = await restaurantService.createRestaurant(data)
      setRestaurant(newRestaurant)
      toast.success('Restaurant created successfully!')
      return newRestaurant
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create restaurant')
      throw error
    } finally {
      setLoading(false)
    }
  }

  const updateRestaurant = async (data: Partial<Restaurant>) => {
    try {
      setLoading(true)
      const updated = await restaurantService.updateSettings(data)
      setRestaurant(updated)
      toast.success('Settings updated successfully!')
      return updated
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update settings')
      throw error
    } finally {
      setLoading(false)
    }
  }

  return {
    restaurant,
    loading,
    createRestaurant,
    updateRestaurant,
    refresh: fetchRestaurant,
  }
}
