import api from './api';

export const warehouseService = {
  getWarehouses: () => api.get('/warehouses'),
  getWarehouseById: (id) => api.get(`/warehouses/${id}`),
  createWarehouse: (data) => api.post('/warehouses', data),
  updateWarehouse: (id, data) => api.put(`/warehouses/${id}`, data),
  deleteWarehouse: (id) => api.delete(`/warehouses/${id}`),

  getInventory: (params) => api.get('/warehouses/inventory', { params }),
  createInventoryItem: (data) => api.post('/warehouses/inventory', data),
  updateInventoryItem: (id, data) => api.put(`/warehouses/inventory/${id}`, data),

  getMovements: (params) => api.get('/warehouses/movements', { params }),
  recordMovement: (data) => api.post('/warehouses/movements', data),
};
