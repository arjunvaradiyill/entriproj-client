import axios from 'axios';

// Create axios instance
const api = axios.create({
  baseURL: 'http://localhost:3000/api'
});

// Add request interceptor
api.interceptors.request.use(
  config => {
    // Get token from localStorage
    const token = localStorage.getItem('token');
    
    // If token exists, add to headers
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle token expiration
api.interceptors.response.use(
  response => response,
  error => {
    // If unauthorized error and not already on login page
    if (error.response?.status === 401 && !window.location.pathname.includes('/login')) {
      // Clear token and redirect to login
      localStorage.removeItem('token');
      window.location.href = `/login?redirect=${window.location.pathname}`;
    }
    return Promise.reject(error);
  }
);

export default api;