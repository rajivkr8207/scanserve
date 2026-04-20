import api from '@/lib/api'
import { User } from '../types/auth.types'

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  name: string
  email: string
  password: string
}

export interface AuthResponse {
  user: User
  token: string
}

export const authService = {
  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await api.post('/api/auth/login', data)
    return response.data
  },

  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await api.post('/api/auth/register', data)
    return response.data
  },

  async getProfile(): Promise<User> {
    const response = await api.get('/api/auth/profile')
    return response.data
  },

  async logout(): Promise<void> {
    await api.post('/api/auth/logout')
  },
}