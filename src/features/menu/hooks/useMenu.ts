'use client'

import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { setLoading, setItems, addItem, updateItem, deleteItem, setError } from '../store/menu.slice'
import { menuService, CreateMenuItemRequest } from '../services/menu.service'
import { toast } from 'react-hot-toast'

export const useMenu = () => {
  const dispatch = useAppDispatch()
  const { items, loading, error } = useAppSelector((state) => state.menu)

  const fetchMenuItems = async () => {
    try {
      dispatch(setLoading(true))
      dispatch(setError(null))
      const items = await menuService.getMenuItems()
      dispatch(setItems(items))
    } catch (error: any) {
      dispatch(setError(error.message))
      toast.error('Failed to fetch menu items')
    } finally {
      dispatch(setLoading(false))
    }
  }

  const createMenuItem = async (data: CreateMenuItemRequest) => {
    try {
      const item = await menuService.createMenuItem(data)
      dispatch(addItem(item))
      toast.success('Menu item created successfully')
      return item
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create menu item')
      throw error
    }
  }

  const updateMenuItem = async (id: string, data: Partial<CreateMenuItemRequest>) => {
    try {
      const item = await menuService.updateMenuItem(id, data)
      dispatch(updateItem(item))
      toast.success('Menu item updated successfully')
      return item
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update menu item')
      throw error
    }
  }

  const deleteMenuItem = async (id: string) => {
    try {
      await menuService.deleteMenuItem(id)
      dispatch(deleteItem(id))
      toast.success('Menu item deleted successfully')
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete menu item')
      throw error
    }
  }

  useEffect(() => {
    fetchMenuItems()
  }, [])

  return {
    items,
    loading,
    error,
    fetchMenuItems,
    createMenuItem,
    updateMenuItem,
    deleteMenuItem,
  }
}