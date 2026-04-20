export interface MenuItem {
  _id: string
  name: string
  description: string
  price: number
  image?: string
  category: string
  isAvailable: boolean
  createdAt: string
  updatedAt: string
}

export interface MenuState {
  items: MenuItem[]
  loading: boolean
  error: string | null
}