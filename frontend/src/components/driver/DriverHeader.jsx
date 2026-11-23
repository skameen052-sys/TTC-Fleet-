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
  User,
  Building2
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
  const notifRef = useRef(null);
  const profileRef = useRef(null);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const datePart = now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
      const timePart = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
      setCurrentDateTime(`${datePart} • ${timePart}`);
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
        <div className="driver-header-badge" style={{ color: '#16A36A', display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: '11px', fontWeight: 600, marginTop: 2, whiteSpace: 'nowrap' }}>
          <span className="live-pulse-green" style={{ width: 6, height: 6, backgroundColor: '#16A36A', boxShadow: '0 0 0 3px rgba(22, 163, 106, 0.25)', flexShrink: 0 }} />
          <span>Active Commercial CDL Session</span>
        </div>
      </div>

      {/* Middle & Right Navigation Elements */}
      <div className="header-right-col">
        {/* Active Trip Telemetry Pill */}
        <div
          className="driver-trip-telemetry-pill"
          onClick={() => onSelectTab && onSelectTab('active-trip')}
          title="Click to view Active Trip details"
          style={{ background: '#F0FDF4', borderColor: '#BBF7D0' }}
        >
          <div className="pill-icon-circle" style={{ background: '#DCFCE7' }}>
            <Navigation size={13} color="#16A36A" strokeWidth={2.4} />
          </div>
          <span className="pill-trip-id">{activeTrip?.id || 'TRIP-5082'}</span>
          <span className="pill-dot">•</span>
          <span className="pill-status-text" style={{ color: '#16A36A' }}>
            <span className="live-dot-pulse" />
            {activeTrip?.status || 'In Transit'}
          </span>
          <span className="pill-eta-badge" style={{ background: '#16A36A' }}>ETA {activeTrip?.route?.eta || '1h 45m'}</span>
        </div>

        {/* Live Date & Time pill */}
        <div className="header-datetime-pill">
          <Calendar size={15} color="#3478F6" />
          <span>{currentDateTime || 'Mon, Nov 23, 2026 • 10:25 AM'}</span>
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
            <div className="user-avatar-circle driver-avatar" style={{ backgroundColor: '#16A36A', color: '#FFFFFF', fontWeight: '800' }}>
              <span>{driver?.fullName ? driver.fullName.split(' ').map(n=>n[0]).join('').slice(0,2) : 'MV'}</span>
            </div>
            <div className="user-text-info">
              <span className="user-display-name">{driver?.fullName || 'Marcus Vance'}</span>
              <span className="user-role-text" style={{ color: '#16A36A' }}>Commercial CDL • {driver?.assignedVehicleReg || 'TTC-8492-HD'}</span>
            </div>
            <ChevronDown size={14} color="#718096" />
          </div>

          {showProfileDropdown && (
            <div className="header-dropdown profile-dropdown">
              <div className="profile-dropdown-header">
                <div className="profile-name">{driver?.fullName || 'Marcus Vance'}</div>
                <div className="profile-email">{driver?.email || 'm.vance@fleet360.ttc.com'}</div>
                <span className="profile-tag">CDL-A Pilot ({driver?.assignedVehicleReg || 'TTC-8492-HD'})</span>
              </div>
              <div className="dropdown-menu-list">
                {onSwitchPortal && (
                  <>
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
                      style={{ color: '#00a3ff', fontWeight: 600 }}
                      onClick={() => {
                        setShowProfileDropdown(false);
                        onSwitchPortal('manager');
                      }}
                    >
                      <Truck size={15} color="#00a3ff" /> Switch to Fleet Manager
                    </button>
                    <button
                      className="dropdown-menu-btn"
                      style={{ color: '#EA580C', fontWeight: 600 }}
                      onClick={() => {
                        setShowProfileDropdown(false);
                        onSwitchPortal('warehouse');
                      }}
                    >
                      <Building2 size={15} color="#EA580C" /> Switch to Warehouse OS
                    </button>
                  </>
                )}
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
