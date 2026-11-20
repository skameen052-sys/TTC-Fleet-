import api from './api';

export const trackingService = {
  // GPS
  getLiveTelemetry: () => api.get('/tracking/live'),
  getVehicleTelemetry: (plateNumber) => api.get(`/tracking/vehicle/${plateNumber}`),

  // Routes
  getRoutes: () => api.get('/routes'),
  getRouteById: (id) => api.get(`/routes/${id}`),
  createRoute: (data) => api.post('/routes', data),
  updateRoute: (id, data) => api.put(`/routes/${id}`, data),
  deleteRoute: (id) => api.delete(`/routes/${id}`),
};
