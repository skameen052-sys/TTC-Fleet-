import api from './api';

export const reportService = {
  getComprehensiveReport: () => api.get('/reports/comprehensive'),
};
