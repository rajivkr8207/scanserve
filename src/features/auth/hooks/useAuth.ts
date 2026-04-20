'use client'

import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { setLoading, setUser, setToken, logout, setError } from '../store/auth.slice'
import { authService, LoginRequest, RegisterRequest } from '../services/auth.service'
import { toast } from 'react-hot-toast'

export const useAuth = () => {
  const dispatch = useAppDispatch()
  const { user, token, isAuthenticated, loading } = useAppSelector(
    (state) => state.auth
  )

  const login = async (data: LoginRequest) => {
    try {
      dispatch(setLoading(true))
      dispatch(setError(null))
      const response = await authService.login(data)
      dispatch(setUser(response.user))
      dispatch(setToken(response.token))
      localStorage.setItem('token', response.token)
      toast.success('Login successful')
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Login failed')
      throw error
    } finally {
      dispatch(setLoading(false))
    }
  }

  const register = async (data: RegisterRequest) => {
    try {
      dispatch(setLoading(true))
      const response = await authService.register(data)
      dispatch(setUser(response.user))
      dispatch(setToken(response.token))
      localStorage.setItem('token', response.token)
      toast.success('Registration successful')
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Registration failed')
      throw error
    } finally {
      dispatch(setLoading(false))
    }
  }

  const logoutUser = async () => {
    try {
      await authService.logout()
    } catch (error) {
      // Ignore logout errors
    } finally {
      dispatch(logout())
      localStorage.removeItem('token')
      toast.success('Logged out')
    }
  }

  const checkAuth = async () => {
    if (token && !isAuthenticated) {
      try {
        dispatch(setLoading(true))
        dispatch(setError(null))
        const user = await authService.getProfile()
        dispatch(setUser(user))
      } catch (error) {
        localStorage.removeItem('token')
        dispatch(logout())
      } finally {
        dispatch(setLoading(false))
      }
    }
  }

  useEffect(() => {
    checkAuth()
  }, [])

  return {
    user,
    token,
    isAuthenticated,
    loading,
    login,
    register,
    logout: logoutUser,
  }
}