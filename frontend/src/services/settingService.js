import api from './api';

export const settingService = {
  getAllSettings: async () => {
    return api.get('/settings');
  },
  getSettingsGrouped: async () => {
    return api.get('/settings/grouped');
  },
  getPublicSettings: async () => {
    return api.get('/settings/public');
  },
  updateSetting: async (key, value) => {
    return api.put(`/settings/${key}?value=${encodeURIComponent(value)}`);
  },
  updateBatch: async (settingsMap) => {
    return api.put('/settings/batch', settingsMap);
  }
};
