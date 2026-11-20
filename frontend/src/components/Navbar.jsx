import React, { useState } from 'react';
import { Search, Bell, Calendar, ChevronDown, User, Shield, LogOut, CheckCircle, AlertTriangle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export const Navbar = ({ onSearch }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [unreadCount, setUnreadCount] = useState(9);

  const notifications = [
    { id: 1, text: 'Acme Corp subscription renews in 7 days', time: '10m ago', type: 'alert' },
    { id: 2, text: 'Vehicle DL-01-AB-1234 reached Bengaluru depot', time: '25m ago', type: 'info' },
    { id: 3, text: 'New fleet driver Rahul Kumar registered', time: '1h ago', type: 'success' },
    { id: 4, text: 'Maintenance alert: Brake inspection due on HYD-32', time: '2h ago', type: 'alert' },
  ];

  return (
    <header className="dashboard-topbar">
      {/* Global Search */}
      <div className="topbar-search-box">
        <Search size={16} />
        <input
          type="text"
          placeholder="Search users, branches, vehicles..."
          onChange={(e) => onSearch && onSearch(e.target.value)}
        />
      </div>

      {/* Right Actions */}
      <div className="topbar-right-actions">
        {/* Notification Bell */}
        <div style={{ position: 'relative' }}>
          <button
            className="icon-badge-btn"
            onClick={() => setShowNotifications(!showNotifications)}
            title="Notifications"
          >
            <Bell size={18} />
            {unreadCount > 0 && <span className="badge-unread">{unreadCount}</span>}
          </button>

          {showNotifications && (
            <div
              style={{
                position: 'absolute',
                right: 0,
                top: '48px',
                width: '320px',
                background: '#131929',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: '12px',
                padding: '14px',
                boxShadow: '0 12px 30px rgba(0,0,0,0.5)',
                zIndex: 100,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '10px',
                  borderBottom: '1px solid rgba(255,255,255,0.06)',
                  paddingBottom: '8px',
                }}
              >
                <span style={{ fontSize: '13px', fontWeight: '700', color: '#fff' }}>
                  Notifications ({unreadCount})
                </span>
                <span
                  style={{ fontSize: '11px', color: '#f97316', cursor: 'pointer' }}
                  onClick={() => setUnreadCount(0)}
                >
                  Mark all read
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    style={{
                      padding: '8px',
                      background: 'rgba(255,255,255,0.02)',
                      borderRadius: '8px',
                      fontSize: '12px',
                    }}
                  >
                    <div style={{ color: '#e2e8f0', fontWeight: '500' }}>{n.text}</div>
                    <div style={{ color: '#64748b', fontSize: '10.5px', marginTop: '2px' }}>
                      {n.time}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Pill */}
        <div style={{ position: 'relative' }}>
          <div className="profile-pill" onClick={() => setShowProfileMenu(!showProfileMenu)}>
            <div className="avatar-circle">
              {user?.firstName ? user.firstName.charAt(0) : 'A'}
            </div>
            <span className="profile-name">
              {user?.firstName ? `${user.firstName}` : 'Admin'}
            </span>
            <ChevronDown size={14} color="#94a3b8" />
          </div>

          {showProfileMenu && (
            <div
              style={{
                position: 'absolute',
                right: 0,
                top: '48px',
                width: '210px',
                background: '#131929',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: '12px',
                padding: '8px',
                boxShadow: '0 12px 30px rgba(0,0,0,0.5)',
                zIndex: 100,
              }}
            >
              <div style={{ padding: '8px 10px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ fontSize: '13px', fontWeight: '700', color: '#fff' }}>
                  {user?.fullName || 'Administrator'}
                </div>
                <div style={{ fontSize: '11px', color: '#94a3b8' }}>
                  {user?.roles?.[0]?.replace('ROLE_', '') || 'SUPER ADMIN'}
                </div>
              </div>
              <button
                style={{
                  width: '100%',
                  padding: '8px 10px',
                  background: 'none',
                  color: '#cbd5e1',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '13px',
                  textAlign: 'left',
                  borderRadius: '6px',
                }}
                onClick={() => {
                  setShowProfileMenu(false);
                  navigate('/company');
                }}
              >
                <User size={15} />
                <span>Company Profile</span>
              </button>
              <button
                style={{
                  width: '100%',
                  padding: '8px 10px',
                  background: 'none',
                  color: '#cbd5e1',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '13px',
                  textAlign: 'left',
                  borderRadius: '6px',
                }}
                onClick={() => {
                  setShowProfileMenu(false);
                  navigate('/settings');
                }}
              >
                <Shield size={15} />
                <span>System Security</span>
              </button>
              <button
                style={{
                  width: '100%',
                  padding: '8px 10px',
                  background: 'none',
                  color: '#ef4444',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '13px',
                  textAlign: 'left',
                  borderRadius: '6px',
                  marginTop: '4px',
                  borderTop: '1px solid rgba(255,255,255,0.04)',
                }}
                onClick={logout}
              >
                <LogOut size={15} />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>

        {/* Date Selector Pill */}
        <div className="date-pill">
          <Calendar size={15} color="#f97316" />
          <span>Nov 19, 2024</span>
          <ChevronDown size={14} color="#64748b" />
        </div>
      </div>
    </header>
  );
};
