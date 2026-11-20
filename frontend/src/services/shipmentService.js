import api from './api';

export const shipmentService = {
  getShipments: (params) => api.get('/shipments', { params }),
  getShipmentById: (id) => api.get(`/shipments/${id}`),
  createShipment: (data) => api.post('/shipments', data),
  updateShipment: (id, data) => api.put(`/shipments/${id}`, data),
  deleteShipment: (id) => api.delete(`/shipments/${id}`),
};
