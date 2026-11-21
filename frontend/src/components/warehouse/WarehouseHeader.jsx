// frontend/src/components/warehouse/WarehouseHeader.jsx
import React, { useState, useEffect, useRef } from 'react';
import {
  Calendar,
  Bell,
  ChevronDown,
  Warehouse,
  Search,
  CheckCheck,
  LogOut,
  User,
  Settings,
  ShieldCheck,
  AlertTriangle,
  Boxes,
  Truck
} from 'lucide-react';

export const WarehouseHeader = ({
  activeTabTitle = 'Warehouse Manager Dashboard',
  user,
  alerts = [],
  onSelectTab,
  onLogout,
  onSwitchToManager,
  onSwitchToDriver,
  searchQuery,
  onSearchChange
}) => {
  const [currentDateTime, setCurrentDateTime] = useState('');
  const [showNotificationsDropdown, setShowNotificationsDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const notifRef = useRef(null);
  const profileRef = useRef(null);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const datePart = now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
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

  const unreadCount = alerts.filter(a => !a.read).length;

  return (
    <header className="fleet-header warehouse-header">
      {/* Page Title & Active Session Badge */}
      <div className="header-left-col" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', minWidth: 0, flexShrink: 1, overflow: 'hidden' }}>
        <h1 className="header-page-title" style={{ fontSize: '17px', fontWeight: 800, margin: 0, lineHeight: 1.2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {activeTabTitle}
        </h1>
        <div className="driver-header-badge" style={{ color: '#FF7A1A', display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: '11px', fontWeight: 600, marginTop: 2, whiteSpace: 'nowrap' }}>
          <span className="live-pulse-green" style={{ width: 6, height: 6, backgroundColor: '#FF7A1A', boxShadow: '0 0 0 3px rgba(255, 122, 26, 0.25)', flexShrink: 0 }} />
          <span>Active WMS Industrial Session</span>
        </div>
      </div>

      {/* Middle & Right Navigation Elements */}
      <div className="header-right-col">
        {/* Global Search Input */}
        <div className="header-search-wrapper">
          <Search className="header-search-icon" size={16} />
          <input
            type="text"
            className="header-search-input"
            placeholder="Search SKUs, shipments, bays, warehouses..."
            value={searchQuery || ''}
            onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
          />
          <kbd className="header-search-kbd">/</kbd>
        </div>

        {/* Live Warehouse Telemetry Pill */}
        <div
          className="driver-trip-telemetry-pill"
          onClick={() => onSelectTab('warehouses')}
          title="Click to view Warehouse Facilities"
          style={{ background: '#FFF5EE', borderColor: '#FFD8BA' }}
        >
          <div className="pill-icon-circle" style={{ background: '#FFF0E5' }}>
            <Warehouse size={13} color="#FF7A1A" strokeWidth={2.5} />
          </div>
          <span className="pill-trip-id">WH-CENTRAL-01</span>
          <span className="pill-dot">•</span>
          <span className="pill-status-text" style={{ color: '#16A36A' }}>
            <span className="live-dot-pulse" />
            82% Utilized
          </span>
          <span className="pill-eta-badge" style={{ background: '#16A36A' }}>Optimal</span>
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
            title="Warehouse Notifications & Alerts"
          >
            <Bell size={18} color="#14213D" />
            {unreadCount > 0 && <span className="notif-badge-count">{unreadCount}</span>}
          </button>

          {showNotificationsDropdown && (
            <div className="header-dropdown notifications-dropdown">
              <div className="dropdown-header">
                <span className="dropdown-title">Warehouse Alerts & Advisories</span>
                <button
                  className="dropdown-action-btn"
                  onClick={() => alert('All warehouse alerts marked as read.')}
                >
                  <CheckCheck size={14} /> Mark all read
                </button>
              </div>
              <div className="dropdown-list">
                {alerts.slice(0, 4).map(n => (
                  <div
                    key={n.id}
                    className={`dropdown-item ${!n.read ? 'unread' : ''}`}
                    onClick={() => {
                      setShowNotificationsDropdown(false);
                      onSelectTab('notifications');
                    }}
                  >
                    <div className="item-title" style={n.severity === 'critical' ? { color: '#EF5350' } : { color: '#14213D' }}>
                      {n.severity === 'critical' ? '🚨 ' : n.severity === 'warning' ? '⚠️ ' : '📦 '}{n.title}
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

        {/* Warehouse Profile Pill */}
        <div className="header-profile-container" ref={profileRef}>
          <div
            className="user-profile-menu driver-profile-pill"
            onClick={() => setShowProfileDropdown(!showProfileDropdown)}
          >
            <div className="user-avatar-circle" style={{ backgroundColor: '#14213D', color: '#FF7A1A' }}>
              <span>EC</span>
            </div>
            <div className="user-text-info">
              <span className="user-display-name">{user?.fullName || 'Ethan Cole'}</span>
              <span className="user-role-text" style={{ color: '#FF7A1A' }}>Warehouse Director</span>
            </div>
            <ChevronDown size={14} color="#718096" />
          </div>

          {showProfileDropdown && (
            <div className="header-dropdown profile-dropdown">
              <div className="profile-dropdown-header">
                <div className="profile-name">{user?.fullName || 'Ethan Cole'}</div>
                <div className="profile-email">{user?.email || 'ethan.cole@fleet360.ttc.com'}</div>
                <span className="profile-tag" style={{ backgroundColor: '#FFF0E5', color: '#FF7A1A' }}>
                  ROLE_WAREHOUSE_MANAGER
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
                  <User size={15} /> My Profile
                </button>
                <button
                  className="dropdown-menu-btn"
                  onClick={() => {
                    setShowProfileDropdown(false);
                    onSelectTab('warehouses');
                  }}
                >
                  <Warehouse size={15} /> Facilities Overview
                </button>
                {onSwitchToManager && (
                  <button
                    className="dropdown-menu-btn"
                    onClick={() => {
                      setShowProfileDropdown(false);
                      onSwitchToManager();
                    }}
                    style={{ color: '#3478F6', fontWeight: '700' }}
                  >
                    <Settings size={15} /> Switch to Fleet Manager
                  </button>
                )}
                {onSwitchToDriver && (
                  <button
                    className="dropdown-menu-btn"
                    onClick={() => {
                      setShowProfileDropdown(false);
                      onSwitchToDriver();
                    }}
                    style={{ color: '#FF7A1A', fontWeight: '700' }}
                  >
                    <Truck size={15} /> Switch to Driver Portal
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
