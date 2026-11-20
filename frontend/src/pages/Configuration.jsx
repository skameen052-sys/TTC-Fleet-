import React, { useState, useEffect } from 'react';
import { Sliders, Bell, Shield, Activity, Save, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';
import { settingService } from '../services/settingService';

export const Configuration = () => {
  const [activeGroup, setActiveGroup] = useState('GENERAL');
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const groups = [
    { key: 'GENERAL', label: 'General System', icon: Sliders },
    { key: 'NOTIFICATIONS', label: 'Alerts & Notifications', icon: Bell },
    { key: 'OPERATIONS', label: 'Fleet Telematics', icon: Activity },
    { key: 'SECURITY', label: 'Security & Auth', icon: Shield },
  ];

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await settingService.getAllSettings();
      if (res && res.data) {
        const map = {};
        res.data.forEach((s) => {
          map[s.settingKey] = s;
        });
        setSettings(map);
      }
    } catch (err) {
      console.error('Failed to load settings', err);
    } finally {
      setLoading(false);
    }
  };

  const handleValueChange = (key, val) => {
    setSettings((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        settingValue: val,
      },
    }));
  };

  const handleSaveAll = async () => {
    setSaving(true);
    setSuccessMsg('');
    try {
      const batchMap = {};
      Object.keys(settings).forEach((k) => {
        batchMap[k] = settings[k].settingValue;
      });
      await settingService.updateBatch(batchMap);
      setSuccessMsg('System configuration parameters saved and reloaded!');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      alert('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const filteredSettings = Object.values(settings).filter(
    (s) => s.settingGroup === activeGroup
  );

  return (
    <div className="module-container animate-fade-in">
      {/* Header */}
      <div className="module-header-row">
        <div>
          <h1 className="module-title">Configuration & System Settings</h1>
          <p className="module-desc">
            Configure system parameters, GPS telematics ping intervals, security rules, and alert thresholds.
          </p>
        </div>

        <div className="module-actions-row">
          <button className="btn-secondary" onClick={fetchSettings}>
            <RefreshCw size={15} />
            <span>Reload</span>
          </button>
          <button
            className="btn-primary"
            onClick={handleSaveAll}
            disabled={saving}
          >
            <Save size={16} />
            <span>{saving ? 'Saving...' : 'Save Settings'}</span>
          </button>
        </div>
      </div>

      {successMsg && (
        <div className="login-success-banner animate-fade-in">
          <CheckCircle2 size={16} />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Main Container */}
      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '24px' }}>
        {/* Navigation Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {groups.map((g) => {
            const Icon = g.icon;
            const isSelected = activeGroup === g.key;
            return (
              <button
                key={g.key}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  borderRadius: '10px',
                  background: isSelected ? 'rgba(249, 115, 22, 0.12)' : '#111726',
                  border: isSelected ? '1.5px solid #f97316' : '1px solid rgba(255,255,255,0.06)',
                  color: isSelected ? '#ffffff' : '#94a3b8',
                  fontSize: '13.5px',
                  fontWeight: isSelected ? 700 : 500,
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onClick={() => setActiveGroup(g.key)}
              >
                <Icon size={17} color={isSelected ? '#f97316' : '#64748b'} />
                <span>{g.label}</span>
              </button>
            );
          })}
        </div>

        {/* Configuration Values Card */}
        <div className="fleet-table-card" style={{ padding: '24px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#fff', marginBottom: '18px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '12px' }}>
            {groups.find((g) => g.key === activeGroup)?.label}
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {filteredSettings.map((s) => {
              const isBool = s.valueType === 'BOOLEAN';
              const isNum = s.valueType === 'NUMBER';

              return (
                <div
                  key={s.settingKey}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '14px',
                    borderRadius: '10px',
                    background: '#141b2c',
                    border: '1px solid rgba(255,255,255,0.05)',
                  }}
                >
                  <div style={{ maxWidth: '65%' }}>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: '#ffffff' }}>
                      {s.settingKey.replace(/_/g, ' ')}
                    </div>
                    <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>
                      {s.description}
                    </div>
                  </div>

                  <div>
                    {isBool ? (
                      <label style={{ display: 'inline-flex', alignItems: 'center', cursor: 'pointer', gap: '8px' }}>
                        <input
                          type="checkbox"
                          className="remember-checkbox"
                          style={{ width: '18px', height: '18px' }}
                          checked={s.settingValue === 'true'}
                          onChange={(e) => handleValueChange(s.settingKey, e.target.checked ? 'true' : 'false')}
                        />
                        <span style={{ fontSize: '13px', color: s.settingValue === 'true' ? '#10b981' : '#64748b', fontWeight: 600 }}>
                          {s.settingValue === 'true' ? 'Enabled' : 'Disabled'}
                        </span>
                      </label>
                    ) : (
                      <input
                        type={isNum ? 'number' : 'text'}
                        className="form-input"
                        style={{
                          background: '#1c263d',
                          borderColor: '#2d3b55',
                          color: '#fff',
                          width: isNum ? '120px' : '240px',
                          textAlign: isNum ? 'right' : 'left',
                        }}
                        value={s.settingValue || ''}
                        onChange={(e) => handleValueChange(s.settingKey, e.target.value)}
                      />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
