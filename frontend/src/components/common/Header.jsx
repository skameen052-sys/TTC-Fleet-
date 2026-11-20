import React, { useState, useEffect, useRef } from 'react';
import { Search, Bell, Calendar, ChevronDown, CheckCheck, Settings, LogOut, Truck } from 'lucide-react';

export const Header = ({
  pageTitle = 'Fleet Manager Dashboard',
  searchQuery,
  onSearchChange,
  notifications = [],
  onMarkNotificationRead,
  onMarkAllNotificationsRead,
  onSelectTab,
  onLogout,
  onSwitchToDriver,
  currentUser
}) => {
  const [currentDateTime, setCurrentDateTime] = useState('');
  const [showNotificationsDropdown, setShowNotificationsDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const searchInputRef = useRef(null);
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
            <div className="user-avatar-circle" style={{ backgroundColor: '#FF7A1A', color: '#FFFFFF', fontWeight: '800' }}>
              <span>{currentUser?.fullName?.[0]?.toUpperCase() || 'A'}</span>
            </div>
            <div className="user-text-info">
              <span className="user-display-name">{currentUser?.fullName || 'Alexandre Mercer'}</span>
              <span className="user-role-text">{currentUser?.role === 'ROLE_FLEET_MANAGER' ? 'Fleet Manager (Lead)' : (currentUser?.role || 'Fleet Manager')}</span>
            </div>
            <ChevronDown size={14} color="#718096" />
          </div>

          {/* Profile Dropdown */}
          {showProfileDropdown && (
            <div className="header-dropdown profile-dropdown">
              <div className="profile-dropdown-header">
                <div className="profile-name">{currentUser?.fullName || 'Alexandre Mercer'}</div>
                <div className="profile-email">{currentUser?.email || 'alex.mercer@fleet360.ttc.com'}</div>
                <span className="profile-tag">{currentUser?.role || 'ROLE_FLEET_MANAGER'}</span>
              </div>
              <div className="dropdown-menu-list">
                {onSwitchToDriver && (
                  <button
                    className="dropdown-menu-btn"
                    style={{ color: '#FF7A1A', fontWeight: 600 }}
                    onClick={() => {
                      setShowProfileDropdown(false);
                      onSwitchToDriver();
                    }}
                  >
                    <Truck size={15} color="#FF7A1A" /> Switch to Driver Portal
                  </button>
                )}
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
