import api from './api';

export const authService = {
  login: async (credentials) => {
    return api.post('/auth/login', credentials);
  },
  register: async (data) => {
    return api.post('/auth/register', data);
  },
  logout: async (email) => {
    return api.post(`/auth/logout?email=${encodeURIComponent(email || '')}`);
  },
  forgotPassword: async (email) => {
    return api.post('/auth/forgot-password', { email });
  },
  resetPassword: async (data) => {
    return api.post('/auth/reset-password', data);
  },
  getCurrentUser: async () => {
    return api.get('/auth/me');
  }
};
