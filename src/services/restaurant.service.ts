import { connectDB } from '@/lib/db'
import Restaurant from '@/models/Restaurant'
import { generateSlug, generateUniqueSlug } from '@/utils/generateSlug'
import { Types } from 'mongoose'

export interface CreateRestaurantInput {
  name: string
  address?: string
  logo?: string
  ownerId: string
}

export interface UpdateSettingsInput {
  name?: string
  address?: string
  logo?: string
  theme?: string
  storeStatus?: { manualMode: 'ONLINE' | 'OFFLINE' }
  workingHours?: Record<string, { open: string; close: string; isOpen: boolean }>
  temporaryClosure?: { isActive: boolean; reason?: string; until?: string }
  orderSettings?: { codEnabled?: boolean; codMaxAmount?: number; prepaidOnly?: boolean }
}

export const restaurantService = {
  async create(input: CreateRestaurantInput) {
    await connectDB()

    // Check if owner already has a restaurant
    const existing = await Restaurant.findOne({ ownerId: input.ownerId })
    if (existing) throw new Error('You already have a restaurant registered')

    let slug = generateSlug(input.name)
    const slugTaken = await Restaurant.findOne({ slug })
    if (slugTaken) slug = generateUniqueSlug(input.name)

    return Restaurant.create({
      ownerId: new Types.ObjectId(input.ownerId),
      name: input.name,
      slug,
      address: input.address ?? '',
      logo: input.logo ?? '',
    })
  },

  async getBySlug(slug: string) {
    await connectDB()
    const restaurant = await Restaurant.findOne({ slug }).populate('ownerId', 'name email')
    if (!restaurant) throw new Error('Restaurant not found')
    return restaurant
  },

  async getByOwner(ownerId: string) {
    await connectDB()
    return Restaurant.findOne({ ownerId })
  },

  async updateSettings(ownerId: string, input: UpdateSettingsInput) {
    await connectDB()
    const restaurant = await Restaurant.findOne({ ownerId })
    if (!restaurant) throw new Error('Restaurant not found')

    // Flat-merge top level fields
    if (input.name) restaurant.name = input.name
    if (input.address !== undefined) restaurant.address = input.address
    if (input.logo !== undefined) restaurant.logo = input.logo
    if (input.theme !== undefined) restaurant.theme = input.theme
    if (input.storeStatus?.manualMode) {
      restaurant.storeStatus.manualMode = input.storeStatus.manualMode
    }
    if (input.orderSettings) {
      Object.assign(restaurant.orderSettings, input.orderSettings)
    }
    if (input.temporaryClosure) {
      restaurant.temporaryClosure.isActive = input.temporaryClosure.isActive
      if (input.temporaryClosure.reason !== undefined)
        restaurant.temporaryClosure.reason = input.temporaryClosure.reason
      if (input.temporaryClosure.until)
        restaurant.temporaryClosure.until = new Date(input.temporaryClosure.until)
    }
    if (input.workingHours) {
      for (const [day, hours] of Object.entries(input.workingHours)) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ;(restaurant.workingHours as any)[day] = hours
      }
    }

    return restaurant.save()
  },
}
