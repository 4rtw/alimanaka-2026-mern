import axios from 'axios';
import { API_TIMEOUT_MS } from './constants';

const API_URL = process.env.API_URL || 'https://alimanaka.chantilly-shaula.ts.net:8443/api';

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
