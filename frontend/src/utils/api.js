import axios from 'axios';

// Helper to sanitize base URL
const getBaseUrl = () => {
  let url = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  // Remove trailing slash if present to avoid double slashes
  if (url.endsWith('/')) {
    url = url.slice(0, -1);
  }
  return url;
};

const api = axios.create({
  baseURL: getBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // Debug logging
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Detailed error logging
    if (error.response) {
      console.error('API Error Status:', error.response.status);
      console.error('API Error Data:', JSON.stringify(error.response.data, null, 2));
      console.error('API Error Message:', error.response.data?.message || 'Unknown error');
    } else {
      console.error('Network/Server Error:', error.message);
    }

    // Only redirect on 401 if we are NOT already on the login page to avoid loops
    if (error.response?.status === 401) {
      const isLoginPage = window.location.pathname === '/login';
      const isRegisterPage = window.location.pathname === '/register';

      if (!isLoginPage && !isRegisterPage) {
        console.warn('Unauthorized - Redirecting to login');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
