import api from './api';

export const billingService = {
  // Invoices
  getInvoices: (params) => api.get('/invoices', { params }),
  getInvoiceById: (id) => api.get(`/invoices/${id}`),
  createInvoice: (data) => api.post('/invoices', data),
  updateInvoiceStatus: (id, status) => api.patch(`/invoices/${id}/status?status=${status}`),
  deleteInvoice: (id) => api.delete(`/invoices/${id}`),

  // Payments
  getPayments: (params) => api.get('/payments', { params }),
  recordPayment: (data) => api.post('/payments', data),
  refundPayment: (id, reason) => api.post(`/payments/${id}/refund?reason=${encodeURIComponent(reason || 'Customer cancellation')}`),
};
