import axios from 'axios';
import { API_TIMEOUT_MS } from './constants';

// All API requests use a relative URL (/api).
// The Next.js route handler at /api/[...path]/route.js proxies
// requests to the backend (configured via BACKEND_API_URL env var).
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
    return Promise.reject(error.response?.data || error.message);
  }
);

export const getEvents = (year, month) => {
  return apiClient.get('/events', {
    params: { year, month }
  });
};

export default apiClient;
