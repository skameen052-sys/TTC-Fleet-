// frontend/src/components/logistics/LogisticsHeader.jsx
import React, { useState, useEffect, useRef } from 'react';
import { PortalSwitcher } from '../common/PortalSwitcher';
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
      <div className="header-left-col" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', flexShrink: 0, minWidth: 'max-content' }}>
        <h1 className="header-page-title" style={{ fontSize: '17px', fontWeight: 800, margin: 0, lineHeight: 1.2, whiteSpace: 'nowrap', color: '#14213D' }}>
          {activeTabTitle}
        </h1>
        <div className="driver-header-badge" style={{ color: '#7955E8', display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: '11px', fontWeight: 600, marginTop: 2, whiteSpace: 'nowrap' }}>
          <span className="live-pulse-green" style={{ width: 6, height: 6, backgroundColor: '#7955E8', boxShadow: '0 0 0 3px rgba(121, 85, 232, 0.25)', flexShrink: 0 }} />
          <span>Transportation & Logistics Operations</span>
        </div>
      </div>

      {/* Middle & Right Navigation Elements */}
      <div className="header-right-col" style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, justifyContent: 'flex-end', minWidth: 0 }}>
        {/* Quick Portal Switcher (7 Portals) */}
        {onSwitchPortal && (
          <PortalSwitcher currentPortal="logistics" onSwitchPortal={onSwitchPortal} />
        )}

        {/* Live Logistics Telemetry Pill */}
        <div
          className="driver-trip-telemetry-pill logistics-telemetry-pill"
          onClick={() => onSelectTab && onSelectTab('shipments')}
          title="Click to view Shipments in Transit"
          style={{ background: '#F5F3FF', borderColor: '#DDD6FE', padding: '4px 10px', flexShrink: 0 }}
        >
          <div className="pill-icon-circle" style={{ background: '#EDE9FE', width: 22, height: 22 }}>
            <Boxes size={12} color="#7955E8" strokeWidth={2.5} />
          </div>
          <span className="pill-trip-id" style={{ fontSize: '12px' }}>48 Active</span>
          <span className="pill-dot">•</span>
          <span className="pill-status-text" style={{ color: '#16A36A', fontSize: '11px' }}>
            <span className="live-dot-pulse" />
            98.4% On-Time
          </span>
          <span className="pill-eta-badge" style={{ background: '#7955E8', fontSize: '10px', padding: '1px 6px' }}>Optimal</span>
        </div>

        {/* Global Search Pill */}
        <div className="header-search-wrapper" style={{ maxWidth: '210px', width: '100%', minWidth: '130px', flexShrink: 1 }}>
          <Search className="header-search-icon" size={15} />
          <input
            ref={searchInputRef}
            type="text"
            className="header-search-input"
            placeholder="Search orders, shipments..."
            value={searchQuery || ''}
            onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
            style={{ fontSize: '12px' }}
          />
          <kbd className="header-search-kbd">/</kbd>
        </div>

        {/* Live Date & Time pill */}
        <div className="header-datetime-pill" style={{ flexShrink: 0, padding: '4px 8px', fontSize: '11.5px' }}>
          <Calendar size={13} color="#3478F6" />
          <span>{currentDateTime || 'Mon, Nov 23, 2026 • 01:28 PM'}</span>
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
            className="user-profile-menu user-profile-avatar-pill"
            onClick={() => setShowProfileDropdown(!showProfileDropdown)}
            title={manager?.name || 'Elena Rostova'}
            style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, padding: '3px 8px 3px 3px', borderRadius: 20 }}
          >
            <div className="user-avatar-circle" style={{ backgroundColor: '#7955E8', color: '#FFFFFF', fontWeight: '800' }}>
              <span>{manager?.name ? manager.name.split(' ').map(n => n[0]).join('').slice(0, 2) : 'ER'}</span>
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
