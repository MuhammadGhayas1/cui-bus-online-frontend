import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL ||
  process.env.API_BASE_URL ||
  'http://localhost:8080/api/student';

if (__DEV__) {
  console.warn(
    "If testing on a physical device, ensure EXPO_PUBLIC_API_BASE_URL uses your computer's local IP (e.g., http://192.168.x.x:8080), not localhost."
  );
}

let onUnauthorizedCallback: (() => void) | null = null;

export const setOnUnauthorized = (callback: () => void) => {
  onUnauthorizedCallback = callback;
};

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

apiClient.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('@student_id');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      // Ignore token read error silently in interceptor
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      if (onUnauthorizedCallback) {
        onUnauthorizedCallback();
      }
    }

    if (error.code === 'ERR_NETWORK' || !error.response) {
      error.friendlyMessage =
        'Unable to connect to the server. Please check your internet connection.';
    }

    return Promise.reject(error);
  }
);

export default apiClient;
