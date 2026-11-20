import api from './api';

export const branchService = {
  getBranches: async (params = {}) => {
    return api.get('/branches', { params });
  },
  getAllBranches: async () => {
    return api.get('/branches/all');
  },
  getBranchById: async (id) => {
    return api.get(`/branches/${id}`);
  },
  createBranch: async (data) => {
    return api.post('/branches', data);
  },
  updateBranch: async (id, data) => {
    return api.put(`/branches/${id}`, data);
  },
  deleteBranch: async (id) => {
    return api.delete(`/branches/${id}`);
  },
  assignUser: async (branchId, userId, role) => {
    return api.post(`/branches/${branchId}/assign-user?userId=${userId}&role=${role || 'STAFF'}`);
  }
};
