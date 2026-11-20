import api from './api';

export const maintenanceService = {
  getMaintenanceRecords: (params) => api.get('/maintenance', { params }),
  getMaintenanceById: (id) => api.get(`/maintenance/${id}`),
  createMaintenance: (data) => api.post('/maintenance', data),
  updateMaintenance: (id, data) => api.put(`/maintenance/${id}`, data),
  deleteMaintenance: (id) => api.delete(`/maintenance/${id}`),
};
