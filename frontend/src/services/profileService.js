import api from './api';

export const profileService = {
  getMyProfile: () => api.get('/profile'),
  updateProfile: (data) => api.put('/profile', data),
  changePassword: (data) => api.post('/profile/change-password', data),
};
