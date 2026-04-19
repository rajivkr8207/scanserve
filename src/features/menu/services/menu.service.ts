import api from '@/lib/api'
import { MenuItem } from '../types/menu.types'

export interface CreateMenuItemRequest {
  name: string
  description: string
  price: number
  image?: string
  category: string
  isAvailable: boolean
}

export const menuService = {
  async getMenuItems(): Promise<MenuItem[]> {
    const response = await api.get('/menu')
    return response.data
  },

  async createMenuItem(data: CreateMenuItemRequest): Promise<MenuItem> {
    const response = await api.post('/menu', data)
    return response.data
  },

  async updateMenuItem(id: string, data: Partial<CreateMenuItemRequest>): Promise<MenuItem> {
    const response = await api.put(`/menu/${id}`, data)
    return response.data
  },

  async deleteMenuItem(id: string): Promise<void> {
    await api.delete(`/menu/${id}`)
  },
}