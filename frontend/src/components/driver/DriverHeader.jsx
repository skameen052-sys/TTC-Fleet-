import React, { useState, useEffect, useRef } from 'react';
import {
  Calendar,
  Bell,
  ChevronDown,
  Navigation,
  CheckCheck,
  Settings,
  LogOut,
  Shield,
  Truck,
  User
} from 'lucide-react';

export const DriverHeader = ({
  activeTabTitle = 'Driver Dashboard',
  driver,
  activeTrip,
  notifications = [],
  onSelectTab,
  onLogout,
  onSwitchPortal
}) => {
  const [currentDateTime, setCurrentDateTime] = useState('');
  const [showNotificationsDropdown, setShowNotificationsDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showPortalDropdown, setShowPortalDropdown] = useState(false);
  const notifRef = useRef(null);
  const profileRef = useRef(null);
  const portalRef = useRef(null);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options = {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      };
      setCurrentDateTime(now.toLocaleDateString('en-US', options));
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotificationsDropdown(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfileDropdown(false);
      }
      if (portalRef.current && !portalRef.current.contains(e.target)) {
        setShowPortalDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length || 1;

  return (
    <header className="fleet-header driver-header">
      {/* Page Title */}
      <div className="header-left-col" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', minWidth: 0, flexShrink: 1, overflow: 'hidden' }}>
        <h1 className="header-page-title" style={{ fontSize: '17px', fontWeight: 800, margin: 0, lineHeight: 1.2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {activeTabTitle}
        </h1>
        <div className="driver-header-badge" style={{ whiteSpace: 'nowrap', marginTop: 2 }}>
          <span className="live-pulse-green" />
          <span>Active Commercial CDL Session</span>
        </div>
      </div>

      {/* Middle & Right Navigation Elements */}
      <div className="header-right-col">
        {/* Quick Portal Switcher Pill */}
        {onSwitchPortal && (
          <div style={{ position: 'relative' }} ref={portalRef}>
            <button
              onClick={() => setShowPortalDropdown(!showPortalDropdown)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12), rgba(5, 150, 105, 0.2))',
                border: '1.5px solid #10b981',
                color: '#10b981',
                padding: '6px 14px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 0 12px rgba(16, 185, 129, 0.2)'
              }}
            >
              <User size={14} color="#10b981" />
              <span>Driver Portal</span>
              <ChevronDown size={13} />
            </button>

            {showPortalDropdown && (
              <div
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 8px)',
                  right: 0,
                  width: '240px',
                  background: '#0d121f',
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
                    setShowPortalDropdown(false);
                    onSwitchPortal('admin');
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
                    color: '#FF9E4A',
                    fontSize: '12.5px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    marginBottom: '4px'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,122,26,0.15)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <Shield size={15} color="#FF7A1A" />
                  <span style={{ flex: 1, textAlign: 'left' }}>Admin Dashboard</span>
                </button>

                <button
                  onClick={() => {
                    setShowPortalDropdown(false);
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
                    color: '#00d2ff',
                    fontSize: '12.5px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    marginBottom: '4px'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(0,163,255,0.15)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <Truck size={15} color="#00d2ff" />
                  <span style={{ flex: 1, textAlign: 'left' }}>Fleet Manager Dashboard</span>
                </button>

                <button
                  onClick={() => {
                    setShowPortalDropdown(false);
                    onSwitchPortal('driver');
                  }}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '9px 12px',
                    background: 'rgba(16, 185, 129, 0.15)',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    borderRadius: '8px',
                    color: '#10b981',
                    fontSize: '12.5px',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  <User size={15} color="#10b981" />
                  <span style={{ flex: 1, textAlign: 'left' }}>Driver Portal (Active)</span>
                  <span style={{ fontSize: '10px', background: '#10b981', color: '#fff', padding: '1px 5px', borderRadius: '4px' }}>Active</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* Active Trip Telemetry Pill */}
        <div
          className="driver-trip-telemetry-pill"
          onClick={() => onSelectTab('active-trip')}
          title="Click to view Active Trip details"
        >
          <div className="pill-icon-circle">
            <Navigation size={13} color="#FF7A1A" strokeWidth={2.4} />
          </div>
          <span className="pill-trip-id">{activeTrip?.id || 'TRIP-5082'}</span>
          <span className="pill-dot">•</span>
          <span className="pill-status-text">
            <span className="live-dot-pulse" />
            {activeTrip?.status || 'In Transit'}
          </span>
          <span className="pill-eta-badge">ETA {activeTrip?.route?.eta || '1h 45m'}</span>
        </div>

        {/* Live Date & Time pill */}
        <div className="header-datetime-pill">
          <Calendar size={15} color="#3478F6" />
          <span>{currentDateTime || 'Fri, Nov 20, 2026, 03:40:00 PM'}</span>
        </div>

        {/* Notifications Bell */}
        <div className="header-notif-container" ref={notifRef}>
          <button
            className="header-bell-btn"
            onClick={() => setShowNotificationsDropdown(!showNotificationsDropdown)}
            title="Notifications"
          >
            <Bell size={18} color="#14213D" />
            <span className="notif-badge-count">{unreadCount}</span>
          </button>

          {showNotificationsDropdown && (
            <div className="header-dropdown notifications-dropdown">
              <div className="dropdown-header">
                <span className="dropdown-title">Driver Alerts & Dispatches</span>
                <button
                  className="dropdown-action-btn"
                  onClick={() => alert('All alerts acknowledged.')}
                >
                  <CheckCheck size={14} /> Mark all read
                </button>
              </div>
              <div className="dropdown-list">
                {notifications.slice(0, 4).map(n => (
                  <div
                    key={n.id}
                    className={`dropdown-item ${!n.read ? 'unread' : ''}`}
                    onClick={() => {
                      setShowNotificationsDropdown(false);
                      onSelectTab('notifications');
                    }}
                  >
                    <div className="item-title" style={n.type === 'emergency' ? { color: '#EF5350' } : {}}>
                      {n.type === 'emergency' ? '🚨 ' : ''}{n.title}
                    </div>
                    <div className="item-desc">{n.message}</div>
                    <div className="item-time">{n.time}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Driver Profile Pill */}
        <div className="header-profile-container" ref={profileRef}>
          <div
            className="user-profile-menu driver-profile-menu"
            onClick={() => setShowProfileDropdown(!showProfileDropdown)}
          >
            <div className="user-avatar-circle driver-avatar">
              <span>{driver?.fullName?.[0] || 'M'}</span>
            </div>
            <div className="user-text-info">
              <span className="user-display-name">{driver?.fullName || 'Marcus Vance'}</span>
              <span className="user-role-text">{driver?.assignedVehicleReg || 'TTC-8492-HD'}</span>
            </div>
            <ChevronDown size={14} color="#718096" />
          </div>

          {showProfileDropdown && (
            <div className="header-dropdown profile-dropdown">
              <div className="profile-dropdown-header">
                <div className="profile-name">{driver?.fullName || 'Marcus Vance'}</div>
                <div className="profile-email">{driver?.email || 'm.vance@fleet360.ttc.com'}</div>
                <span className="profile-tag">CDL-A Pilot ({driver?.assignedVehicleReg})</span>
              </div>
              <div className="dropdown-menu-list">
                <button
                  className="dropdown-menu-btn"
                  style={{ color: '#FF7A1A', fontWeight: 600 }}
                  onClick={() => {
                    setShowProfileDropdown(false);
                    onSwitchPortal('admin');
                  }}
                >
                  <Shield size={15} color="#FF7A1A" /> Switch to Admin Dashboard
                </button>
                <button
                  className="dropdown-menu-btn"
                  style={{ color: '#00d2ff', fontWeight: 600 }}
                  onClick={() => {
                    setShowProfileDropdown(false);
                    onSwitchPortal('manager');
                  }}
                >
                  <Truck size={15} color="#00d2ff" /> Switch to Fleet Manager
                </button>
                <button
                  className="dropdown-menu-btn"
                  onClick={() => {
                    setShowProfileDropdown(false);
                    onSelectTab('profile');
                  }}
                >
                  <Settings size={15} /> Driver Profile & License
                </button>
                <button
                  className="dropdown-menu-btn logout"
                  onClick={() => {
                    setShowProfileDropdown(false);
                    if (onLogout) onLogout();
                  }}
                >
                  <LogOut size={15} /> Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
