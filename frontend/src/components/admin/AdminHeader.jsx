import React, { useState, useEffect } from 'react';
import { PortalSwitcher } from '../common/PortalSwitcher';
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
  Package,
  Building2,
  CheckCircle2,
  AlertTriangle,
  Clock,
  CreditCard
} from 'lucide-react';

export const AdminHeader = ({
  searchQuery,
  onSearchChange,
  currentUser,
  onLogout,
  onSwitchPortal,
  onNavigateTab
}) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showPortalMenu, setShowPortalMenu] = useState(false);
  const [showNotificationsMenu, setShowNotificationsMenu] = useState(false);
  const [currentDateStr, setCurrentDateStr] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentDateStr(
        now.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  const notifications = [
    { id: 1, title: 'Maintenance Due: Volvo FH16 (TRK-01)', time: '12 min ago', type: 'warning' },
    { id: 2, title: 'Driver License Expiry: Marcus Vance in 20 days', time: '1 hr ago', type: 'info' },
    { id: 3, title: 'NH-44 Highway Congestion reroute SHP-8091', time: '2 hrs ago', type: 'warning' },
    { id: 4, title: 'Invoice INV-2024-001 (₹45,000) pending payment', time: '3 hrs ago', type: 'info' },
    { id: 5, title: 'Warehouse Hyderabad Central: Low pallet stock', time: '5 hrs ago', type: 'alert' }
  ];

  return (
    <header className="dashboard-topbar" style={{ position: 'relative', zIndex: 40 }}>
      {/* 1. Global Search Input */}
      <div className="topbar-search-box">
        <Search size={16} color="#64748b" />
        <input
          type="text"
          placeholder="Search vehicles, drivers, shipments, orders, invoices..."
          value={searchQuery || ''}
          onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
        />
      </div>

      {/* 2. Right Actions: Portal Switcher, Notifications, Profile, Live Date */}
      <div className="topbar-right-actions" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* Workspace Portal Switcher (7 Portals) */}
        {onSwitchPortal && (
          <PortalSwitcher currentPortal="admin" onSwitchPortal={onSwitchPortal} />
        )}

        {/* Notifications Bell with Interactive Dropdown */}
        <div style={{ position: 'relative' }}>
          <button
            className="icon-badge-btn"
            title="5 unread notifications"
            onClick={() => {
              setShowNotificationsMenu(!showNotificationsMenu);
              setShowPortalMenu(false);
              setShowProfileMenu(false);
            }}
            style={{ cursor: 'pointer' }}
          >
            <Bell size={17} />
            <span className="badge-unread">5</span>
          </button>

          {showNotificationsMenu && (
            <div
              style={{
                position: 'absolute',
                top: 'calc(100% + 8px)',
                right: 0,
                width: '320px',
                background: '#131929',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '12px',
                padding: '12px',
                boxShadow: '0 16px 32px rgba(0,0,0,0.6)',
                zIndex: 100
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderBottom: '1px solid rgba(255,255,255,0.06)',
                  paddingBottom: '8px',
                  marginBottom: '8px'
                }}
              >
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#fff' }}>Operational Alerts</span>
                <span style={{ fontSize: '11px', color: '#10b981', fontWeight: 600 }}>5 Unread</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '240px', overflowY: 'auto' }}>
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    style={{
                      padding: '8px 10px',
                      background: 'rgba(255,255,255,0.03)',
                      borderRadius: '6px',
                      fontSize: '12px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '3px'
                    }}
                  >
                    <div style={{ color: '#e2e8f0', fontWeight: 500 }}>{n.title}</div>
                    <div style={{ color: '#94a3b8', fontSize: '10.5px' }}>{n.time}</div>
                  </div>
                ))}
              </div>
              <button
                onClick={() => {
                  setShowNotificationsMenu(false);
                  if (onNavigateTab) onNavigateTab('notifications');
                }}
                style={{
                  width: '100%',
                  marginTop: '10px',
                  padding: '7px 0',
                  background: 'rgba(255, 122, 26, 0.12)',
                  border: '1px solid rgba(255, 122, 26, 0.3)',
                  borderRadius: '6px',
                  color: '#FF9E4A',
                  fontSize: '11.5px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                View All Notifications →
              </button>
            </div>
          )}
        </div>

        {/* Profile Pill with User Name & Avatar */}
        <div style={{ position: 'relative' }}>
          <div
            className="profile-pill"
            onClick={() => {
              setShowProfileMenu(!showProfileMenu);
              setShowPortalMenu(false);
              setShowNotificationsMenu(false);
            }}
            title={currentUser?.fullName || 'Super Admin'}
            style={{
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '4px 10px 4px 5px',
              borderRadius: '24px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}
          >
            <div className="avatar-circle" style={{ width: '28px', height: '28px', fontSize: '12px' }}>
              {(currentUser?.fullName || 'Admin').charAt(0).toUpperCase()}
            </div>
            <span
              className="profile-name"
              style={{
                color: '#ffffff',
                fontSize: '12.5px',
                fontWeight: 600,
                letterSpacing: '-0.2px'
              }}
            >
              {currentUser?.fullName || 'Super Admin'}
            </span>
            <ChevronDown size={13} color="#94a3b8" />
          </div>

          {showProfileMenu && (
            <div
              style={{
                position: 'absolute',
                top: 'calc(100% + 8px)',
                right: 0,
                width: '220px',
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
                  if (onNavigateTab) onNavigateTab('profile');
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
                <User size={14} /> My Profile & Security
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

        {/* Dynamic Live Date Pill */}
        <div className="date-pill" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Calendar size={14} color="#64748b" />
          <span style={{ fontSize: '12px', fontWeight: 600, color: '#cbd5e1' }}>{currentDateStr || 'Nov 23, 2026'}</span>
        </div>
      </div>
    </header>
  );
};
