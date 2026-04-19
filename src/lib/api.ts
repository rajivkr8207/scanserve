import axios from 'axios'

const api = axios.create({
  // Backend runs inside Next.js as App Router Route Handlers — no separate server needed
  baseURL: process.env.NEXT_PUBLIC_API_URL || '/api',
  withCredentials: true, // Send cookies with requests
  headers: {
    'Content-Type': 'application/json',
  },
})

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api