import React, { useState, useEffect } from 'react';
import { ShieldCheck, Check, Key, Lock, Save, RefreshCw, AlertCircle } from 'lucide-react';
import { roleService } from '../services/roleService';

export const RoleManagement = () => {
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null);
  const [activePerms, setActivePerms] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [rolesRes, permsRes] = await Promise.all([
        roleService.getAllRoles(),
        roleService.getAllPermissions(),
      ]);

      if (rolesRes && rolesRes.data) {
        setRoles(rolesRes.data);
        if (rolesRes.data.length > 0) {
          selectRole(rolesRes.data[0]);
        }
      }
      if (permsRes && permsRes.data) {
        setPermissions(permsRes.data);
      }
    } catch (err) {
      console.error('Failed to load roles and permissions', err);
    } finally {
      setLoading(false);
    }
  };

  const selectRole = (role) => {
    setSelectedRole(role);
    const permNames = new Set((role.permissions || []).map((p) => p.name));
    setActivePerms(permNames);
    setMessage('');
  };

  const handleTogglePermission = (permName) => {
    const updated = new Set(activePerms);
    if (updated.has(permName)) {
      updated.delete(permName);
    } else {
      updated.add(permName);
    }
    setActivePerms(updated);
  };

  const handleSavePermissions = async () => {
    if (!selectedRole) return;
    setSaving(true);
    setMessage('');
    try {
      await roleService.updatePermissions(selectedRole.id, Array.from(activePerms));
      setMessage('Permissions updated and applied successfully!');
      // Refresh role list
      const res = await roleService.getAllRoles();
      if (res && res.data) {
        setRoles(res.data);
      }
    } catch (err) {
      alert('Failed to update permissions');
    } finally {
      setSaving(false);
    }
  };

  // Group permissions by category
  const groupedPermissions = permissions.reduce((acc, p) => {
    if (!acc[p.category]) acc[p.category] = [];
    acc[p.category].push(p);
    return acc;
  }, {});

  return (
    <div className="module-container animate-fade-in">
      {/* Header */}
      <div className="module-header-row">
        <div>
          <h1 className="module-title">Role-Based Access Control (RBAC)</h1>
          <p className="module-desc">
            Define system authorization tiers, enforce role policies, and configure modular access matrix.
          </p>
        </div>

        <div className="module-actions-row">
          <button className="btn-secondary" onClick={loadData}>
            <RefreshCw size={15} />
            <span>Reload Roles</span>
          </button>
          <button
            className="btn-primary"
            onClick={handleSavePermissions}
            disabled={saving || !selectedRole}
          >
            <Save size={15} />
            <span>{saving ? 'Saving...' : 'Save Permissions'}</span>
          </button>
        </div>
      </div>

      {message && (
        <div className="login-success-banner animate-fade-in">
          <Check size={16} />
          <span>{message}</span>
        </div>
      )}

      {/* Grid: Left Column Roles List, Right Column Permission Matrix */}
      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '24px' }}>
        {/* Roles List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            System Roles ({roles.length})
          </h3>

          {roles.map((r) => {
            const isSelected = selectedRole?.id === r.id;
            return (
              <div
                key={r.id}
                onClick={() => selectRole(r)}
                style={{
                  background: isSelected ? 'rgba(0, 163, 255, 0.08)' : '#111726',
                  border: isSelected ? '1.5px solid #00a3ff' : '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '12px',
                  padding: '14px 16px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  boxShadow: isSelected ? '0 0 16px rgba(0, 163, 255, 0.2)' : 'none',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <ShieldCheck size={17} color={isSelected ? '#00d2ff' : '#f97316'} />
                    <span style={{ fontWeight: 700, color: isSelected ? '#ffffff' : '#e2e8f0', fontSize: '14px' }}>
                      {r.name.replace('ROLE_', '')}
                    </span>
                  </div>
                  <span style={{ fontSize: '11px', color: '#64748b' }}>
                    {(r.permissions || []).length} perms
                  </span>
                </div>
                <div style={{ fontSize: '11.5px', color: '#94a3b8', marginTop: '6px' }}>
                  {r.description}
                </div>
              </div>
            );
          })}
        </div>

        {/* Permissions Matrix */}
        <div className="fleet-table-card" style={{ padding: '20px' }}>
          <div style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '12px', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '17px', fontWeight: 800, color: '#ffffff' }}>
              Permissions for {selectedRole?.name.replace('ROLE_', '')}
            </h2>
            <p style={{ fontSize: '12.5px', color: '#94a3b8', marginTop: '4px' }}>
              Select granular privileges granted to users assigned this role.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {Object.keys(groupedPermissions).map((category) => (
              <div key={category}>
                <div
                  style={{
                    fontSize: '12px',
                    fontWeight: 700,
                    color: '#f97316',
                    textTransform: 'uppercase',
                    letterSpacing: '0.6px',
                    marginBottom: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <Key size={13} />
                  <span>{category} Module</span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '10px' }}>
                  {groupedPermissions[category].map((perm) => {
                    const isChecked = activePerms.has(perm.name);
                    return (
                      <label
                        key={perm.id}
                        style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '10px',
                          background: isChecked ? 'rgba(249, 115, 22, 0.08)' : '#141b2c',
                          border: isChecked ? '1px solid rgba(249, 115, 22, 0.3)' : '1px solid rgba(255,255,255,0.06)',
                          borderRadius: '8px',
                          padding: '10px 12px',
                          cursor: 'pointer',
                          transition: 'all 0.15s',
                        }}
                      >
                        <input
                          type="checkbox"
                          className="remember-checkbox"
                          checked={isChecked}
                          onChange={() => handleTogglePermission(perm.name)}
                          style={{ marginTop: '2px' }}
                        />
                        <div>
                          <div style={{ fontSize: '12.5px', fontWeight: 600, color: isChecked ? '#ffffff' : '#cbd5e1' }}>
                            {perm.name}
                          </div>
                          <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
                            {perm.description}
                          </div>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
