import api from '@/lib/api'

export interface WorkingHourSlot {
  open: string
  close: string
  isOpen: boolean
}

export type WeekDay = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday'

export interface Restaurant {
  _id: string
  ownerId: string
  name: string
  slug: string
  address: string
  logo?: string
  theme: string
  storeStatus: { manualMode: 'ONLINE' | 'OFFLINE' }
  workingHours: Record<WeekDay, WorkingHourSlot>
  temporaryClosure: { isActive: boolean; reason?: string; until?: string }
  orderSettings: { codEnabled: boolean; codMaxAmount: number; prepaidOnly: boolean }
}

export interface CreateRestaurantRequest {
  name: string
  address?: string
  logo?: string
}

export const restaurantService = {
  async getMyRestaurant(): Promise<Restaurant | null> {
    try {
      const response = await api.get('/api/restaurant')
      return response.data.data
    } catch (error: any) {
      if (error.response?.status === 404) return null
      throw error
    }
  },

  async createRestaurant(data: CreateRestaurantRequest): Promise<Restaurant> {
    const response = await api.post('/api/restaurant', data)
    return response.data.data
  },

  async updateSettings(data: Partial<Restaurant>): Promise<Restaurant> {
    const response = await api.patch('/api/restaurant/settings', data)
    return response.data.data
  },
}
