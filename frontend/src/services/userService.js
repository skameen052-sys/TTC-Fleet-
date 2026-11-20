import api from './api';

export const userService = {
  getUsers: async (params = {}) => {
    return api.get('/users', { params });
  },
  getUserById: async (id) => {
    return api.get(`/users/${id}`);
  },
  createUser: async (userData) => {
    return api.post('/users', userData);
  },
  updateUser: async (id, userData) => {
    return api.put(`/users/${id}`, userData);
  },
  toggleStatus: async (id, active) => {
    return api.patch(`/users/${id}/status?active=${active}`);
  },
  deleteUser: async (id) => {
    return api.delete(`/users/${id}`);
  }
};
