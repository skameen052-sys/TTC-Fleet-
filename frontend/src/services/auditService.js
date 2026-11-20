import api from './api';

export const auditService = {
  getAuditLogs: async (params = {}) => {
    return api.get('/audit', { params });
  },
  getLoginHistory: async (params = {}) => {
    return api.get('/audit/login-history', { params });
  },
  getRecentActivities: async () => {
    return api.get('/audit/recent');
  }
};
