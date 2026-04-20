import api from '@/lib/api'
import { MenuItem } from '../types/menu.types'

export interface CreateMenuItemRequest {
  restaurantId: string
  name: string
  description: string
  price: number
  image?: string
  category: string
  isAvailable: boolean
}


export const menuService = {
  async getMenuItems(): Promise<MenuItem[]> {
    const response = await api.get('/api/menu')
    console.log(response.data, "Menu items")
    return response.data.data
  },

  async createMenuItem(data: CreateMenuItemRequest): Promise<MenuItem> {
    const response = await api.post('/api/menu', data)
    return response.data.data
  },

  async updateMenuItem(id: string, data: Partial<CreateMenuItemRequest>): Promise<MenuItem> {
    const response = await api.put(`/api/menu/${id}`, data)
    return response.data
  },

  async deleteMenuItem(id: string): Promise<void> {
    const response = await api.delete(`/api/menu/${id}`)
    return response.data
  },
}