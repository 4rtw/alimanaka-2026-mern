import axios from 'axios';
import { API_TIMEOUT_MS } from './constants';

// Use relative URL — Next.js rewrites proxy /api/* to the backend.
// The backend URL is configured in next.config.js rewrites.
const API_URL = '/api';

const apiClient = axios.create({
  baseURL: API_URL,
  timeout: API_TIMEOUT_MS,
  headers: {
    'Content-Type': 'application/json'
  }
});

apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error('API call error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const getEvents = (year, month) => {
  return apiClient.get('/events', {
    params: { year, month }
  });
};

export const getMonths = () => {
  return apiClient.get('/events/months');
};

export default apiClient;
