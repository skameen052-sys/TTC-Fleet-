// frontend/src/components/logistics/LogisticsHeader.jsx
import React, { useState, useEffect, useRef } from 'react';
import {
  Calendar,
  Bell,
  Search,
  ChevronDown,
  Boxes,
  Truck,
  CheckCheck,
  Settings,
  LogOut,
  Shield,
  Warehouse,
  User,
  PackageCheck
} from 'lucide-react';

export const LogisticsHeader = ({
  activeTabTitle = 'Logistics Manager Dashboard',
  manager,
  notifications = [],
  searchQuery,
  onSearchChange,
  onSelectTab,
  onLogout,
  onSwitchPortal
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
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length || 3;

  return (
    <header className="fleet-header logistics-header">
      {/* Page Title & Breadcrumb */}
      <div className="header-left-col" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', minWidth: 0, flexShrink: 1, overflow: 'hidden' }}>
        <h1 className="header-page-title" style={{ fontSize: '17px', fontWeight: 800, margin: 0, lineHeight: 1.2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {activeTabTitle}
        </h1>
        <div className="driver-header-badge" style={{ color: '#7955E8', display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: '11px', fontWeight: 600, marginTop: 2, whiteSpace: 'nowrap' }}>
          <span className="live-pulse-green" style={{ width: 6, height: 6, backgroundColor: '#7955E8', boxShadow: '0 0 0 3px rgba(121, 85, 232, 0.25)', flexShrink: 0 }} />
          <span>Transportation & Logistics Operations</span>
        </div>
      </div>

      {/* Middle & Right Navigation Elements */}
      <div className="header-right-col">
        {/* Live Logistics Telemetry Pill */}
        <div
          className="driver-trip-telemetry-pill logistics-telemetry-pill"
          onClick={() => onSelectTab && onSelectTab('shipments')}
          title="Click to view Shipments in Transit"
          style={{ background: '#F5F3FF', borderColor: '#DDD6FE' }}
        >
          <div className="pill-icon-circle" style={{ background: '#EDE9FE' }}>
            <Boxes size={13} color="#7955E8" strokeWidth={2.5} />
          </div>
          <span className="pill-trip-id">48 Active</span>
          <span className="pill-dot">•</span>
          <span className="pill-status-text" style={{ color: '#16A36A' }}>
            <span className="live-dot-pulse" />
            98.4% On-Time
          </span>
          <span className="pill-eta-badge" style={{ background: '#7955E8' }}>Optimal</span>
        </div>

        {/* Global Search Pill */}
        <div className="header-search-wrapper">
          <Search className="header-search-icon" size={16} />
          <input
            ref={searchInputRef}
            type="text"
            className="header-search-input"
            placeholder="Search orders, shipments, trips..."
            value={searchQuery || ''}
            onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
          />
          <kbd className="header-search-kbd">/</kbd>
        </div>

        {/* Live Date & Time pill */}
        <div className="header-datetime-pill">
          <Calendar size={15} color="#3478F6" />
          <span>{currentDateTime || 'Mon, Nov 23, 2026 • 10:49 AM'}</span>
        </div>

        {/* Notification Bell Button */}
        <div className="header-notif-container" ref={notifRef}>
          <button
            className="header-bell-btn"
            onClick={() => setShowNotificationsDropdown(!showNotificationsDropdown)}
            title="Logistics Notifications"
          >
            <Bell size={18} color="#14213D" />
            {unreadCount > 0 && <span className="notif-badge-count">{unreadCount}</span>}
          </button>

          {/* Notifications Dropdown */}
          {showNotificationsDropdown && (
            <div className="header-dropdown notifications-dropdown">
              <div className="dropdown-header">
                <span className="dropdown-title">Logistics Alerts & Updates</span>
                <button
                  className="dropdown-action-btn"
                  onClick={() => alert('All logistics notifications marked as read.')}
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
                      onClick={() => {
                        setShowNotificationsDropdown(false);
                        onSelectTab && onSelectTab('notifications');
                      }}
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
            <div className="user-avatar-circle" style={{ backgroundColor: '#7955E8', color: '#FFFFFF', fontWeight: '800' }}>
              <span>{manager?.name ? manager.name.split(' ').map(n => n[0]).join('').slice(0, 2) : 'ER'}</span>
            </div>
            <div className="user-text-info">
              <span className="user-display-name">{manager?.name || 'Elena Rostova'}</span>
              <span className="user-role-text" style={{ color: '#7955E8' }}>Director of Logistics</span>
            </div>
            <ChevronDown size={14} color="#718096" />
          </div>

          {/* Profile Dropdown */}
          {showProfileDropdown && (
            <div className="header-dropdown profile-dropdown">
              <div className="profile-dropdown-header">
                <div className="profile-name">{manager?.name || 'Elena Rostova'}</div>
                <div className="profile-email">{manager?.email || 'elena.rostova@fleet360.ttc.com'}</div>
                <span className="profile-tag" style={{ backgroundColor: '#F5F3FF', color: '#7955E8' }}>
                  ROLE_LOGISTICS_MANAGER
                </span>
              </div>
              <div className="dropdown-menu-list">
                <button
                  className="dropdown-menu-btn"
                  onClick={() => {
                    setShowProfileDropdown(false);
                    onSelectTab && onSelectTab('profile');
                  }}
                >
                  <User size={15} /> My Profile
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
