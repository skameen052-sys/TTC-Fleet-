import React, { useState } from 'react';
import {
  Search,
  Bell,
  Calendar,
  ChevronDown,
  User,
  Shield,
  Truck,
  ArrowRightLeft,
  LogOut,
  Sparkles,
  Wrench,
  Package
} from 'lucide-react';

export const AdminHeader = ({
  searchQuery,
  onSearchChange,
  currentUser,
  onLogout,
  onSwitchPortal
}) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showPortalMenu, setShowPortalMenu] = useState(false);

  return (
    <header className="dashboard-topbar">
      {/* Search Input */}
      <div className="topbar-search-box">
        <Search size={16} color="#64748b" />
        <input
          type="text"
          placeholder="Search users, branches, vehicles..."
          value={searchQuery || ''}
          onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
        />
      </div>

      {/* Right Actions: Portal Switcher, Notifications, Profile, Date */}
      <div className="topbar-right-actions">
        {/* Quick Portal Switcher */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowPortalMenu(!showPortalMenu)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'linear-gradient(135deg, rgba(255, 122, 26, 0.15), rgba(255, 85, 0, 0.25))',
              border: '1px solid rgba(255, 122, 26, 0.5)',
              color: '#FF9E4A',
              padding: '6px 14px',
              borderRadius: '20px',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 0 12px rgba(255, 122, 26, 0.2)'
            }}
          >
            <Shield size={14} color="#FF7A1A" />
            <span>Admin Portal</span>
            <ChevronDown size={13} />
          </button>

          {showPortalMenu && (
            <div
              style={{
                position: 'absolute',
                top: 'calc(100% + 8px)',
                right: 0,
                width: '240px',
                background: '#131929',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '12px',
                padding: '8px',
                boxShadow: '0 16px 32px rgba(0,0,0,0.6)',
                zIndex: 100
              }}
            >
              <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 700, padding: '6px 10px', textTransform: 'uppercase' }}>
                Switch Workspace Portal
              </div>
              <button
                onClick={() => {
                  setShowPortalMenu(false);
                  onSwitchPortal('admin');
                }}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '9px 12px',
                  background: 'rgba(255, 122, 26, 0.15)',
                  border: '1px solid rgba(255, 122, 26, 0.3)',
                  borderRadius: '8px',
                  color: '#FF9E4A',
                  fontSize: '12.5px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  marginBottom: '4px'
                }}
              >
                <Shield size={15} color="#FF7A1A" />
                <span style={{ flex: 1, textAlign: 'left' }}>Admin Dashboard (Active)</span>
                <span style={{ fontSize: '10px', background: '#FF7A1A', color: '#fff', padding: '1px 5px', borderRadius: '4px' }}>Active</span>
              </button>

              <button
                onClick={() => {
                  setShowPortalMenu(false);
                  onSwitchPortal('manager');
                }}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '9px 12px',
                  background: 'transparent',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#cbd5e1',
                  fontSize: '12.5px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  marginBottom: '4px'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <Truck size={15} color="#00d2ff" />
                <span style={{ flex: 1, textAlign: 'left' }}>Fleet Manager Dashboard</span>
              </button>

              <button
                onClick={() => {
                  setShowPortalMenu(false);
                  onSwitchPortal('driver');
                }}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '9px 12px',
                  background: 'transparent',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#cbd5e1',
                  fontSize: '12.5px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  marginBottom: '4px'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <User size={15} color="#10b981" />
                <span style={{ flex: 1, textAlign: 'left' }}>Driver Portal</span>
              </button>

              <button
                onClick={() => {
                  setShowPortalMenu(false);
                  onSwitchPortal('maintenance');
                }}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '9px 12px',
                  background: 'transparent',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#cbd5e1',
                  fontSize: '12.5px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  marginBottom: '4px'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <Wrench size={15} color="#f59e0b" />
                <span style={{ flex: 1, textAlign: 'left' }}>Maintenance Dashboard</span>
              </button>

              <button
                onClick={() => {
                  setShowPortalMenu(false);
                  onSwitchPortal('warehouse');
                }}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '9px 12px',
                  background: 'transparent',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#cbd5e1',
                  fontSize: '12.5px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  marginBottom: '4px'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <Truck size={15} color="#a855f7" />
                <span style={{ flex: 1, textAlign: 'left' }}>Warehouse Manager (WMS)</span>
              </button>

              <button
                onClick={() => {
                  setShowPortalMenu(false);
                  onSwitchPortal('logistics');
                }}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '9px 12px',
                  background: 'transparent',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#cbd5e1',
                  fontSize: '12.5px',
                  fontWeight: 500,
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <Sparkles size={15} color="#FF7A1A" />
                <span style={{ flex: 1, textAlign: 'left' }}>Logistics Manager (LOS)</span>
              </button>
            </div>
          )}
        </div>

        {/* Notifications Icon with unread badge */}
        <button className="icon-badge-btn" title="5 unread notifications">
          <Bell size={17} />
          <span className="badge-unread">5</span>
        </button>

        {/* Profile Pill */}
        <div style={{ position: 'relative' }}>
          <div
            className="profile-pill"
            onClick={() => setShowProfileMenu(!showProfileMenu)}
          >
            <div className="avatar-circle">A</div>
            <span className="profile-name">{currentUser?.fullName || 'Admin'}</span>
            <ChevronDown size={13} color="#94a3b8" />
          </div>

          {showProfileMenu && (
            <div
              style={{
                position: 'absolute',
                top: 'calc(100% + 8px)',
                right: 0,
                width: '210px',
                background: '#131929',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '12px',
                padding: '8px',
                boxShadow: '0 16px 32px rgba(0,0,0,0.6)',
                zIndex: 100
              }}
            >
              <div style={{ padding: '8px 10px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ fontWeight: 700, color: '#fff', fontSize: '13px' }}>{currentUser?.fullName || 'Super Admin'}</div>
                <div style={{ fontSize: '11px', color: '#FF7A1A' }}>{currentUser?.email || 'admin@ttcfleet360.com'}</div>
              </div>
              <button
                onClick={() => {
                  setShowProfileMenu(false);
                  onSwitchPortal('manager');
                }}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 10px',
                  background: 'transparent',
                  border: 'none',
                  color: '#cbd5e1',
                  fontSize: '12px',
                  cursor: 'pointer',
                  borderRadius: '6px'
                }}
              >
                <ArrowRightLeft size={14} /> Switch to Fleet Manager
              </button>
              <button
                onClick={() => {
                  setShowProfileMenu(false);
                  onLogout();
                }}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 10px',
                  background: 'transparent',
                  border: 'none',
                  color: '#ef4444',
                  fontSize: '12px',
                  cursor: 'pointer',
                  borderRadius: '6px'
                }}
              >
                <LogOut size={14} /> Sign Out
              </button>
            </div>
          )}
        </div>

        {/* Date Selector */}
        <div className="date-pill">
          <Calendar size={14} color="#64748b" />
          <span>Nov 19, 2024</span>
          <ChevronDown size={13} color="#64748b" />
        </div>
      </div>
    </header>
  );
};
