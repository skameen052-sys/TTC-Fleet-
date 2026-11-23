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
  ArrowRightLeft,
  Building2,
  Wrench,
  Package
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
      const datePart = now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
      const timePart = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
      setCurrentDateTime(`${datePart} • ${timePart}`);
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
      <div className="header-left-col" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', minWidth: 0, flexShrink: 1, overflow: 'hidden' }}>
        <h1 className="header-page-title" style={{ fontSize: '17px', fontWeight: 800, margin: 0, lineHeight: 1.2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {pageTitle}
        </h1>
        <div className="driver-header-badge" style={{ color: '#3478F6', display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: '11px', fontWeight: 600, marginTop: 2, whiteSpace: 'nowrap' }}>
          <span className="live-pulse-green" style={{ width: 6, height: 6, backgroundColor: '#3478F6', boxShadow: '0 0 0 3px rgba(52, 120, 246, 0.25)', flexShrink: 0 }} />
          <span>Active Enterprise Fleet OS</span>
        </div>
      </div>

      {/* Middle & Right Navigation Elements */}
      <div className="header-right-col">
        {/* Quick Portal Switcher Pill */}
        {onSwitchPortal && (
          <div className="header-portal-switcher-container" style={{ position: 'relative' }} ref={portalRef}>
            <button
              onClick={() => setShowPortalDropdown(!showPortalDropdown)}
              className="header-portal-switcher-btn"
              title="Current: Fleet Manager Portal"
            >
              <Truck size={14} color="#1D4ED8" />
              <span>Fleet Manager</span>
              <ChevronDown size={13} color="#1D4ED8" />
            </button>

            {showPortalDropdown && (
              <div className="header-portal-dropdown">
                <div className="header-portal-dropdown-title">
                  Switch Workspace Portal
                </div>
                <button
                  onClick={() => {
                    setShowPortalDropdown(false);
                    onSwitchPortal('admin');
                  }}
                  className="header-portal-dropdown-item"
                  style={{ color: '#FF7A1A' }}
                >
                  <Shield size={14} color="#FF7A1A" />
                  <span>Admin Dashboard</span>
                </button>

                <button
                  onClick={() => {
                    setShowPortalDropdown(false);
                    onSwitchPortal('manager');
                  }}
                  className="header-portal-dropdown-item"
                  style={{ color: '#1D4ED8', background: '#EFF6FF', fontWeight: 700 }}
                >
                  <Truck size={14} color="#1D4ED8" />
                  <span style={{ flex: 1, textAlign: 'left' }}>Fleet Manager</span>
                  <span className="portal-badge-active">Active</span>
                </button>

                <button
                  onClick={() => {
                    setShowPortalDropdown(false);
                    onSwitchPortal('driver');
                  }}
                  className="header-portal-dropdown-item"
                  style={{ color: '#16A34A' }}
                >
                  <User size={14} color="#16A34A" />
                  <span>Driver Portal</span>
                </button>

                <button
                  onClick={() => {
                    setShowPortalDropdown(false);
                    onSwitchPortal('maintenance');
                  }}
                  className="header-portal-dropdown-item"
                  style={{ color: '#f59e0b' }}
                >
                  <Wrench size={14} color="#f59e0b" />
                  <span>Maintenance Dashboard</span>
                </button>

                <button
                  onClick={() => {
                    setShowPortalDropdown(false);
                    onSwitchPortal('warehouse');
                  }}
                  className="header-portal-dropdown-item"
                  style={{ color: '#EA580C' }}
                >
                  <Building2 size={14} color="#EA580C" />
                  <span>Warehouse Portal</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* Live Fleet Telemetry Pill */}
        <div
          className="driver-trip-telemetry-pill fleet-telemetry-pill"
          onClick={() => onSelectTab && onSelectTab('vehicles')}
          title="Click to view Fleet Assets"
          style={{ background: '#EFF6FF', borderColor: '#BFDBFE' }}
        >
          <div className="pill-icon-circle" style={{ background: '#DBEAFE' }}>
            <Truck size={13} color="#2563EB" strokeWidth={2.5} />
          </div>
          <span className="pill-trip-id">16 Assets</span>
          <span className="pill-dot">•</span>
          <span className="pill-status-text" style={{ color: '#16A36A' }}>
            <span className="live-dot-pulse" />
            14 Active
          </span>
          <span className="pill-eta-badge" style={{ background: '#2563EB' }}>92% Online</span>
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

        {/* Live Date & Time pill */}
        <div className="header-datetime-pill">
          <Calendar size={15} color="#3478F6" />
          <span>{currentDateTime || 'Mon, Nov 23, 2026 • 10:25 AM'}</span>
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
            <div className="user-avatar-circle" style={{ backgroundColor: '#2563EB', color: '#FFFFFF', fontWeight: '800' }}>
              <span>{currentUser?.fullName ? currentUser.fullName.split(' ').map(n=>n[0]).join('').slice(0,2) : 'VM'}</span>
            </div>
            <div className="user-text-info">
              <span className="user-display-name">{currentUser?.fullName || 'Vikram Malhotra'}</span>
              <span className="user-role-text" style={{ color: '#2563EB' }}>Fleet Operations Manager</span>
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
