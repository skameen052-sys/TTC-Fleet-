import api from './api';

export const companyService = {
  getProfile: async () => {
    return api.get('/company');
  },
  updateProfile: async (data) => {
    return api.put('/company', data);
  },
  uploadLogo: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/company/logo', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  }
};
