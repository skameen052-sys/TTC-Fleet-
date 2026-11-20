import api from './api';

export const fuelService = {
  getFuelRecords: (params) => api.get('/fuel', { params }),
  getFuelRecordById: (id) => api.get(`/fuel/${id}`),
  createFuelRecord: (data) => api.post('/fuel', data),
  updateFuelRecord: (id, data) => api.put(`/fuel/${id}`, data),
  deleteFuelRecord: (id) => api.delete(`/fuel/${id}`),
};
