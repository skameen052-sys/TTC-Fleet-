import api from './api';

export const notificationService = {
  getAll: () => api.get('/notifications'),
  getUnread: () => api.get('/notifications/unread'),
  getUnreadCount: () => api.get('/notifications/unread-count'),
  createNotification: (data) => api.post('/notifications', data),
  markAsRead: (id) => api.patch(`/notifications/${id}/read`),
  markAllAsRead: () => api.post('/notifications/mark-all-read'),
};
