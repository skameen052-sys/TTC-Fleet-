import api from './api';

export const fleetService = {
  // Vehicles
  getVehicles: (params) => api.get('/vehicles', { params }),
  getVehicleById: (id) => api.get(`/vehicles/${id}`),
  createVehicle: (data) => api.post('/vehicles', data),
  updateVehicle: (id, data) => api.put(`/vehicles/${id}`, data),
  deleteVehicle: (id) => api.delete(`/vehicles/${id}`),

  // Drivers
  getDrivers: (params) => api.get('/drivers', { params }),
  getDriverById: (id) => api.get(`/drivers/${id}`),
  getExpiringDrivers: (days) => api.get('/drivers/expiring', { params: { days } }),
  createDriver: (data) => api.post('/drivers', data),
  updateDriver: (id, data) => api.put(`/drivers/${id}`, data),
  deleteDriver: (id) => api.delete(`/drivers/${id}`),
};
