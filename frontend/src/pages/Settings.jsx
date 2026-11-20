import React from 'react';
import { Shield, Key, Lock, Bell, Terminal, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Settings = () => {
  const { user } = useAuth();

  return (
    <div className="module-container animate-fade-in">
      <div className="module-header-row">
        <div>
          <h1 className="module-title">Security & System Preferences</h1>
          <p className="module-desc">
            Manage your individual credentials, security tokens, and view connected infrastructure.
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {/* Credentials Card */}
        <div className="fleet-table-card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#fff', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Key size={18} color="#f97316" />
            <span>Active Session Information</span>
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '8px' }}>
              <span style={{ color: '#94a3b8' }}>Authenticated User</span>
              <span style={{ color: '#fff', fontWeight: 600 }}>{user?.fullName}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '8px' }}>
              <span style={{ color: '#94a3b8' }}>Corporate Email</span>
              <span style={{ color: '#fff' }}>{user?.email}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '8px' }}>
              <span style={{ color: '#94a3b8' }}>Primary System Role</span>
              <span style={{ color: '#f97316', fontWeight: 700 }}>{user?.roles?.[0]?.replace('ROLE_', '')}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '8px' }}>
              <span style={{ color: '#94a3b8' }}>Encryption Standard</span>
              <span style={{ color: '#10b981', fontWeight: 600 }}>BCrypt 256-bit Hashing</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#94a3b8' }}>Token Strategy</span>
              <span style={{ color: '#0ea5e9', fontWeight: 600 }}>Signed JWT Bearer</span>
            </div>
          </div>
        </div>

        {/* Infrastructure & Stack Card */}
        <div className="fleet-table-card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#fff', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Terminal size={18} color="#0ea5e9" />
            <span>Infrastructure Connectivity</span>
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '8px' }}>
              <span style={{ color: '#94a3b8' }}>Backend Framework</span>
              <span style={{ color: '#10b981', fontWeight: 600 }}>Java Spring Boot 3.2.5</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '8px' }}>
              <span style={{ color: '#94a3b8' }}>Relational Database</span>
              <span style={{ color: '#0ea5e9', fontWeight: 600 }}>PostgreSQL (Spring Data JPA)</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '8px' }}>
              <span style={{ color: '#94a3b8' }}>In-Memory Cache</span>
              <span style={{ color: '#ef4444', fontWeight: 600 }}>Redis Cache Engine</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '8px' }}>
              <span style={{ color: '#94a3b8' }}>Object Storage</span>
              <span style={{ color: '#f59e0b', fontWeight: 600 }}>AWS S3 (Amazon Web Services)</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#94a3b8' }}>Frontend Engine</span>
              <span style={{ color: '#00d2ff', fontWeight: 600 }}>React.js + Vite</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
