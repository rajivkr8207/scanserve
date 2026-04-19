export interface User {
  id: string
  email: string
  name: string
  role: 'admin' | 'seller' | 'customer'
}

export interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  loading: boolean
}