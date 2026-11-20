import api from './api';

export const subscriptionService = {
  getPlans: async () => {
    return api.get('/subscriptions/plans');
  },
  getSubscriptions: async (params = {}) => {
    return api.get('/subscriptions', { params });
  },
  getUpcomingRenewals: async (days = 30) => {
    return api.get(`/subscriptions/renewals?days=${days}`);
  },
  renewSubscription: async (id, billingCycle = 'MONTHLY') => {
    return api.post(`/subscriptions/${id}/renew?billingCycle=${billingCycle}`);
  },
  getPayments: async (params = {}) => {
    return api.get('/subscriptions/payments', { params });
  }
};
