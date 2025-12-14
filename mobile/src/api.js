import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Get API URL from environment variable or use default
const getApiUrl = () => {
  // For production, use deployed backend
  // For development, use localhost (you may need to use your machine's IP for physical devices)
  // Example: 'http://192.168.1.100:5000/api' for physical device
  // Or use 'http://localhost:5000/api' for emulator
  return __DEV__ 
    ? 'http://localhost:5000/api'  // Change to your IP for physical device testing
    : 'https://school-ems.onrender.com/api';
};

const api = axios.create({
  baseURL: getApiUrl(),
  timeout: 10000,
});

// Request interceptor to add token
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error getting token:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (error.response?.status === 401) {
      // Clear invalid token
      try {
        await AsyncStorage.removeItem('token');
        await AsyncStorage.removeItem('user');
      } catch (e) {
        console.error('Error clearing storage:', e);
      }
    }
    return Promise.reject(error);
  }
);

export default api;

