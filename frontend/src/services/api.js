import axios from 'axios';

const API_BASE = '/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to attach Auth JWT and Session Token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('dt_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  let sessionToken = localStorage.getItem('dt_session_token');
  if (!sessionToken) {
    sessionToken = 'guest_' + Math.random().toString(36).substring(2, 15);
    localStorage.setItem('dt_session_token', sessionToken);
  }
  config.headers['x-session-token'] = sessionToken;

  return config;
}, (error) => Promise.reject(error));

export default api;
