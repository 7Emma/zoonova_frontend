import axios from 'axios';

// Base URL configurable via VITE_API_BASE_URL, fallback to /api/v1/
// Expected backend paths are like: /api/v1/auth/, /api/v1/orders/, etc.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1/';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Simple request interceptor: attach access token
axiosInstance.interceptors.request.use(
  (config) => {
    const access = localStorage.getItem('access_token');
    if (access) {
      config.headers.Authorization = `Bearer ${access}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: try refreshing token on 401 once
let isRefreshing = false;
let subscribers = [];

function onRefreshed(token) {
  subscribers.forEach((cb) => cb(token));
  subscribers = [];
}

function addSubscriber(cb) {
  subscribers.push(cb);
}

axiosInstance.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalReq = err.config;

    if (err.response && err.response.status === 401 && !originalReq._retry) {
      if (isRefreshing) {
        // Wait for token to be refreshed
        return new Promise((resolve) => {
          addSubscriber((token) => {
            originalReq.headers.Authorization = `Bearer ${token}`;
            resolve(axiosInstance(originalReq));
          });
        });
      }

      originalReq._retry = true;
      isRefreshing = true;

      try {
        const refresh = localStorage.getItem('refresh_token');
        if (!refresh) throw new Error('No refresh token');

        // Use a plain axios call (no interceptors) to avoid loops
        // backend exposes auth/token/refresh/ under /api/v1/auth/
        const response = await axios.post(`${API_BASE_URL}auth/token/refresh/`, { refresh });
        const { access } = response.data;
        localStorage.setItem('access_token', access);
        onRefreshed(access);

        isRefreshing = false;
        originalReq.headers.Authorization = `Bearer ${access}`;
        return axiosInstance(originalReq);
      } catch (refreshErr) {
        isRefreshing = false;
        // If refresh failed, clear tokens and let caller handle 401
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        return Promise.reject(refreshErr);
      }
    }

    return Promise.reject(err);
  }
);

export default axiosInstance;
