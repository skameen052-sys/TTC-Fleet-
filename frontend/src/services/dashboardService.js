import api from './api';

export const dashboardService = {
  getSummary: async () => {
    return api.get('/dashboard/summary');
  }
};
