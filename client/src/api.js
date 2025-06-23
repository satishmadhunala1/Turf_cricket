import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000' });

// Add a request interceptor to include the auth token
API.interceptors.request.use((config) => {
  const userInfo = localStorage.getItem('userInfo')
    ? JSON.parse(localStorage.getItem('userInfo'))
    : null;

  if (userInfo && userInfo.token) {
    config.headers.Authorization = `Bearer ${userInfo.token}`;
  }

  return config;
});

export default API;