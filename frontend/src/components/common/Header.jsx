import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  Bell,
  Calendar,
  ChevronDown,
  CheckCheck,
  Settings,
  LogOut,
  Truck,
  Shield,
  User,
  ArrowRightLeft
} from 'lucide-react';

export const Header = ({
  pageTitle = 'Fleet Manager Dashboard',
  searchQuery,
  onSearchChange,
  notifications = [],
  onMarkNotificationRead,
  onMarkAllNotificationsRead,
  onSelectTab,
  onLogout,
  onSwitchPortal,
  currentUser
}) => {
  const [currentDateTime, setCurrentDateTime] = useState('');
  const [showNotificationsDropdown, setShowNotificationsDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showPortalDropdown, setShowPortalDropdown] = useState(false);
  const searchInputRef = useRef(null);
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

  // Global keyboard shortcut '/' to focus search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === '/' && document.activeElement !== searchInputRef.current) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
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

  const unreadCount = notifications.filter(n => !n.read).length || 2;

  return (
    <header className="fleet-header">
      {/* Page Title */}
      <div className="header-left-col">
        <h1 className="header-page-title">{pageTitle}</h1>
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
                background: 'linear-gradient(135deg, rgba(0, 163, 255, 0.12), rgba(0, 100, 255, 0.2))',
                border: '1.5px solid #00a3ff',
                color: '#00d2ff',
                padding: '6px 14px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 0 12px rgba(0, 163, 255, 0.2)'
              }}
            >
              <Truck size={14} color="#00d2ff" />
              <span>Fleet Manager Portal</span>
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
                    background: 'rgba(0, 163, 255, 0.15)',
                    border: '1px solid rgba(0, 163, 255, 0.3)',
                    borderRadius: '8px',
                    color: '#00d2ff',
                    fontSize: '12.5px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    marginBottom: '4px'
                  }}
                >
                  <Truck size={15} color="#00d2ff" />
                  <span style={{ flex: 1, textAlign: 'left' }}>Fleet Manager (Active)</span>
                  <span style={{ fontSize: '10px', background: '#00a3ff', color: '#fff', padding: '1px 5px', borderRadius: '4px' }}>Active</span>
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
                  <User size={15} color="#10b981" />
                  <span style={{ flex: 1, textAlign: 'left' }}>Driver Portal</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* Live Date & Time pill */}
        <div className="header-datetime-pill">
          <Calendar size={15} color="#3478F6" />
          <span>{currentDateTime || 'Fri, Nov 20, 2026, 02:48:17 PM'}</span>
        </div>

        {/* Global Search Pill */}
        <div className="header-search-wrapper">
          <Search className="header-search-icon" size={16} />
          <input
            ref={searchInputRef}
            type="text"
            className="header-search-input"
            placeholder="Search vehicles, drivers, trips..."
            value={searchQuery || ''}
            onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
          />
          <kbd className="header-search-kbd">/</kbd>
        </div>

        {/* Notification Bell Button */}
        <div className="header-notif-container" ref={notifRef}>
          <button
            className="header-bell-btn"
            onClick={() => setShowNotificationsDropdown(!showNotificationsDropdown)}
            title="Notifications"
          >
            <Bell size={18} color="#14213D" />
            <span className="notif-badge-count">{unreadCount}</span>
          </button>

          {/* Notifications Dropdown */}
          {showNotificationsDropdown && (
            <div className="header-dropdown notifications-dropdown">
              <div className="dropdown-header">
                <span className="dropdown-title">Fleet Notifications</span>
                <button
                  className="dropdown-action-btn"
                  onClick={onMarkAllNotificationsRead}
                >
                  <CheckCheck size={14} /> Mark all read
                </button>
              </div>
              <div className="dropdown-list">
                {notifications.length === 0 ? (
                  <div className="dropdown-empty">No active alerts</div>
                ) : (
                  notifications.slice(0, 5).map(n => (
                    <div
                      key={n.id}
                      className={`dropdown-item ${!n.read ? 'unread' : ''}`}
                      onClick={() => onMarkNotificationRead && onMarkNotificationRead(n.id)}
                    >
                      <div className="item-title">{n.title}</div>
                      <div className="item-desc">{n.message}</div>
                      <div className="item-time">{n.time}</div>
                    </div>
                  ))
                )}
              </div>
              <div className="dropdown-footer">
                <button
                  className="dropdown-footer-link"
                  onClick={() => {
                    setShowNotificationsDropdown(false);
                    onSelectTab && onSelectTab('notifications');
                  }}
                >
                  View All Alerts
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Pill */}
        <div className="header-profile-container" ref={profileRef}>
          <div
            className="user-profile-menu"
            onClick={() => setShowProfileDropdown(!showProfileDropdown)}
          >
            <div className="user-avatar-circle" style={{ backgroundColor: '#00a3ff', color: '#FFFFFF', fontWeight: '800' }}>
              <span>{currentUser?.fullName?.[0]?.toUpperCase() || 'M'}</span>
            </div>
            <div className="user-text-info">
              <span className="user-display-name">{currentUser?.fullName || 'Vikram Malhotra'}</span>
              <span className="user-role-text">Fleet Operations Manager</span>
            </div>
            <ChevronDown size={14} color="#718096" />
          </div>

          {/* Profile Dropdown */}
          {showProfileDropdown && (
            <div className="header-dropdown profile-dropdown">
              <div className="profile-dropdown-header">
                <div className="profile-name">{currentUser?.fullName || 'Vikram Malhotra'}</div>
                <div className="profile-email">{currentUser?.email || 'manager@ttcfleet360.com'}</div>
                <span className="profile-tag">ROLE_MANAGER</span>
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
                  style={{ color: '#10b981', fontWeight: 600 }}
                  onClick={() => {
                    setShowProfileDropdown(false);
                    onSwitchPortal('driver');
                  }}
                >
                  <Truck size={15} color="#10b981" /> Switch to Driver Portal
                </button>
                <button
                  className="dropdown-menu-btn"
                  onClick={() => {
                    setShowProfileDropdown(false);
                    onSelectTab && onSelectTab('profile');
                  }}
                >
                  <Settings size={15} /> My Profile & Preferences
                </button>
                <button
                  className="dropdown-menu-btn logout"
                  onClick={() => {
                    setShowProfileDropdown(false);
                    if (onLogout) onLogout();
                    else onSelectTab && onSelectTab('login');
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
