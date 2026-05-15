import axios from 'axios';
import { ENV } from '@/config/env';

const api = axios.create({
  baseURL: `${ENV.NEXT_PUBLIC_API_URL}/api/v1`,
  withCredentials: true,
});


api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Redirect to login on 401
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }

    // Attach a friendly message to the error object if it doesn't have one
    if (error.response?.data?.message) {
      error.message = error.response.data.message;
    }

    return Promise.reject(error);
  }
);

export default api;
