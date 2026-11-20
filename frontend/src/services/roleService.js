import api from './api';

export const roleService = {
  getAllRoles: async () => {
    return api.get('/roles');
  },
  getRoleById: async (id) => {
    return api.get(`/roles/${id}`);
  },
  getAllPermissions: async () => {
    return api.get('/roles/permissions');
  },
  updatePermissions: async (roleId, permissions) => {
    return api.put(`/roles/${roleId}/permissions`, permissions);
  }
};
