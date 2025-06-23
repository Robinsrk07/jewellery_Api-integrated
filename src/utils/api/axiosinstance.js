import axios from 'axios';
import { getAccessToken } from '../utils/tokenUtils';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

axiosInstance.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


axiosInstance.interceptors.response.use(
  response => response,
  error => {
    // You can optionally redirect to login if token is expired
    if (error.response?.status === 401) {
      console.warn('Unauthorized. You may want to redirect to login.');
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
