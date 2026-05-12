import axios from 'axios';
import { ENV } from '@/config/env';

const api = axios.create({
  baseURL: `${ENV.NEXT_PUBLIC_API_URL}/api/v1`,
  withCredentials: true,
});


api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || 'Something went wrong';
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(new Error(message));
  }
);

export default api;
