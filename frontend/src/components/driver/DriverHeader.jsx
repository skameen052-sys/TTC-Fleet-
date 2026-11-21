import React, { useState, useEffect, useRef } from 'react';
import {
  Calendar,
  Bell,
  ChevronDown,
  Navigation,
  Radio,
  CheckCheck,
  Settings,
  LogOut,
  ShieldCheck,
  User
} from 'lucide-react';

export const DriverHeader = ({
  activeTabTitle = 'Driver Dashboard',
  driver,
  activeTrip,
  notifications = [],
  onSelectTab,
  onLogout,
  onSwitchToManager
}) => {
  const [currentDateTime, setCurrentDateTime] = useState('');
  const [showNotificationsDropdown, setShowNotificationsDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const notifRef = useRef(null);
  const profileRef = useRef(null);

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
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length || 1;

  return (
    <header className="fleet-header driver-header">
      {/* Page Title & Active Session Badge */}
      <div className="header-left-col">
        <div>
          <h1 className="header-page-title">{activeTabTitle}</h1>
          <div className="driver-header-badge">
            <span className="live-pulse-green" />
            <span>Active Commercial CDL Session</span>
          </div>
        </div>
      </div>

      {/* Middle & Right Navigation Elements */}
      <div className="header-right-col">
        {/* Active Trip Telemetry Pill */}
        <div
          className="driver-trip-telemetry-pill"
          onClick={() => onSelectTab('active-trip')}
          title="Click to view Active Trip details"
        >
          <div className="pill-icon-circle">
            <Navigation size={13} color="#FF7A1A" strokeWidth={2.5} />
          </div>
          <span className="pill-trip-id">{activeTrip?.id || 'TRIP-5082'}</span>
          <span className="pill-dot">•</span>
          <span className="pill-status-text">
            <span className="live-dot-pulse" />
            In Transit
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
              <div className="dropdown-footer">
                <button
                  className="dropdown-footer-link"
                  onClick={() => {
                    setShowNotificationsDropdown(false);
                    onSelectTab('notifications');
                  }}
                >
                  View All Alerts
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Driver Profile Pill */}
        <div className="header-profile-container" ref={profileRef}>
          <div
            className="user-profile-menu driver-profile-pill"
            onClick={() => setShowProfileDropdown(!showProfileDropdown)}
          >
            <div className="user-avatar-circle" style={{ backgroundColor: '#14213D', color: '#FF7A1A' }}>
              <span>MV</span>
            </div>
            <div className="user-text-info">
              <span className="user-display-name">{driver?.fullName || 'Marcus Vance'}</span>
              <span className="user-role-text" style={{ color: '#16A36A' }}>CDL Lead Driver (D-01)</span>
            </div>
            <ChevronDown size={14} color="#718096" />
          </div>

          {showProfileDropdown && (
            <div className="header-dropdown profile-dropdown">
              <div className="profile-dropdown-header">
                <div className="profile-name">{driver?.fullName || 'Marcus Vance'}</div>
                <div className="profile-email">{driver?.email || 'm.vance@fleet360.ttc.com'}</div>
                <span className="profile-tag" style={{ backgroundColor: '#E8F8F0', color: '#16A36A' }}>
                  ROLE_DRIVER
                </span>
              </div>
              <div className="dropdown-menu-list">
                <button
                  className="dropdown-menu-btn"
                  onClick={() => {
                    setShowProfileDropdown(false);
                    onSelectTab('profile');
                  }}
                >
                  <User size={15} /> My Driver Profile
                </button>
                <button
                  className="dropdown-menu-btn"
                  onClick={() => {
                    setShowProfileDropdown(false);
                    onSelectTab('documents');
                  }}
                >
                  <ShieldCheck size={15} /> CDL & DOT Credentials
                </button>
                {onSwitchToManager && (
                  <button
                    className="dropdown-menu-btn"
                    onClick={() => {
                      setShowProfileDropdown(false);
                      onSwitchToManager();
                    }}
                    style={{ color: '#FF7A1A', fontWeight: '700' }}
                  >
                    <Settings size={15} /> Switch to Fleet Manager
                  </button>
                )}
                <button
                  className="dropdown-menu-btn logout"
                  onClick={() => {
                    setShowProfileDropdown(false);
                    onLogout();
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
