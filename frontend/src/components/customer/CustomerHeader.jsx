// frontend/src/components/customer/CustomerHeader.jsx
import React, { useState, useEffect, useRef } from 'react';
import {
  Calendar,
  Search,
  Bell,
  ChevronDown,
  User,
  LogOut,
  Building2,
  CheckCircle,
  Clock,
  Shield,
  FileText
} from 'lucide-react';

export const CustomerHeader = ({
  activeTabTitle = 'Customer Dashboard',
  searchQuery,
  onSearchChange,
  notifications = [],
  onMarkNotificationRead,
  onMarkAllNotificationsRead,
  profile,
  onSelectTab,
  onLogout
}) => {
  const [currentDateTime, setCurrentDateTime] = useState('');
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

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

  // Click outside listener for dropdowns
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setIsNotifOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <header className="fleet-header" style={{ position: 'sticky', top: 0, zIndex: 40, height: '60px' }}>
      {/* Left: Page Title & Breadcrumb */}
      <div className="header-left-col">
        <h1 className="header-page-title" style={{ fontSize: '17px', fontWeight: 800, color: '#14213D' }}>
          {activeTabTitle}
        </h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#64748B' }}>
          <span>Customer Portal</span>
          <span>•</span>
          <span style={{ color: '#079DF2', fontWeight: 600 }}>{profile?.companyName || 'NexGen Industrial Corp'}</span>
        </div>
      </div>

      {/* Right: Date, Search, Notifications, Profile */}
      <div className="header-right-col" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* Live Date / Time Badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: '#F1F5F9',
            padding: '5px 10px',
            borderRadius: '6px',
            fontSize: '11.5px',
            color: '#334155',
            fontWeight: 500,
            whiteSpace: 'nowrap'
          }}
        >
          <Calendar size={13} color="#079DF2" />
          <span>{currentDateTime}</span>
        </div>

        {/* Search Bar */}
        <div style={{ position: 'relative', width: '220px' }}>
          <Search
            size={14}
            color="#94A3B8"
            style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }}
          />
          <input
            type="text"
            placeholder="Search orders, shipments..."
            value={searchQuery || ''}
            onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
            style={{
              width: '100%',
              padding: '6px 10px 6px 30px',
              fontSize: '12px',
              backgroundColor: '#F8FAFC',
              border: '1px solid #E2E8F0',
              borderRadius: '6px',
              outline: 'none',
              color: '#1E293B'
            }}
          />
        </div>

        {/* Notifications Popover */}
        <div style={{ position: 'relative' }} ref={notifRef}>
          <button
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            style={{
              position: 'relative',
              width: '34px',
              height: '34px',
              borderRadius: '50%',
              backgroundColor: '#F1F5F9',
              border: '1px solid #E2E8F0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
            title="Notifications"
          >
            <Bell size={16} color="#334155" />
            {unreadCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '-2px',
                  right: '-2px',
                  backgroundColor: '#FF7A1A',
                  color: '#FFFFFF',
                  fontSize: '10px',
                  fontWeight: 800,
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '2px solid #FFFFFF'
                }}
              >
                {unreadCount}
              </span>
            )}
          </button>

          {isNotifOpen && (
            <div
              style={{
                position: 'absolute',
                top: '42px',
                right: 0,
                width: '320px',
                backgroundColor: '#FFFFFF',
                borderRadius: '8px',
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.15), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
                border: '1px solid #E2E8F0',
                overflow: 'hidden',
                zIndex: 60
              }}
            >
              <div
                style={{
                  padding: '12px 14px',
                  borderBottom: '1px solid #F1F5F9',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  backgroundColor: '#F8FAFC'
                }}
              >
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#1E293B' }}>
                  Notifications ({unreadCount} new)
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={() => onMarkAllNotificationsRead && onMarkAllNotificationsRead()}
                    style={{
                      border: 'none',
                      background: 'transparent',
                      color: '#079DF2',
                      fontSize: '11px',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                {notifications.length === 0 ? (
                  <div style={{ padding: '24px', textAlign: 'center', color: '#94A3B8', fontSize: '12px' }}>
                    No notifications
                  </div>
                ) : (
                  notifications.slice(0, 5).map(n => (
                    <div
                      key={n.id}
                      onClick={() => onMarkNotificationRead && onMarkNotificationRead(n.id)}
                      style={{
                        padding: '10px 14px',
                        borderBottom: '1px solid #F8FAFC',
                        backgroundColor: n.unread ? '#F0F9FF' : '#FFFFFF',
                        cursor: 'pointer',
                        transition: 'background 0.15s'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <span style={{ fontSize: '12px', fontWeight: n.unread ? 700 : 600, color: '#1E293B' }}>
                          {n.title}
                        </span>
                        <span style={{ fontSize: '10px', color: '#94A3B8' }}>{n.time}</span>
                      </div>
                      <p style={{ margin: '3px 0 0', fontSize: '11.5px', color: '#64748B', lineHeight: '1.4' }}>
                        {n.message}
                      </p>
                    </div>
                  ))
                )}
              </div>

              <div style={{ padding: '8px', textAlign: 'center', borderTop: '1px solid #F1F5F9' }}>
                <button
                  onClick={() => {
                    setIsNotifOpen(false);
                    onSelectTab && onSelectTab('notifications');
                  }}
                  style={{
                    border: 'none',
                    background: 'transparent',
                    color: '#FF7A1A',
                    fontSize: '11.5px',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  View All Notifications →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Profile Avatar & Dropdown */}
        <div style={{ position: 'relative' }} ref={profileRef}>
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: '#EFF6FF',
              border: '1px solid #BFDBFE',
              borderRadius: '20px',
              padding: '3px 8px 3px 3px',
              cursor: 'pointer'
            }}
          >
            <div
              style={{
                width: '26px',
                height: '26px',
                borderRadius: '50%',
                backgroundColor: '#079DF2',
                color: '#FFFFFF',
                fontWeight: 800,
                fontSize: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              SJ
            </div>
            <ChevronDown size={13} color="#1E3A8A" />
          </button>

          {isProfileOpen && (
            <div
              style={{
                position: 'absolute',
                top: '42px',
                right: 0,
                width: '230px',
                backgroundColor: '#FFFFFF',
                borderRadius: '8px',
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.15)',
                border: '1px solid #E2E8F0',
                overflow: 'hidden',
                zIndex: 60
              }}
            >
              <div style={{ padding: '12px', borderBottom: '1px solid #F1F5F9', backgroundColor: '#F8FAFC' }}>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#1E293B' }}>
                  {profile?.name || 'Sarah Jenkins'}
                </div>
                <div style={{ fontSize: '11px', color: '#64748B' }}>{profile?.companyName || 'NexGen Industrial'}</div>
                <div style={{ fontSize: '10px', color: '#079DF2', fontWeight: 600, marginTop: '2px' }}>
                  ID: {profile?.id || 'CUST-8021'}
                </div>
              </div>

              <div style={{ padding: '4px 0' }}>
                <button
                  onClick={() => {
                    setIsProfileOpen(false);
                    onSelectTab && onSelectTab('profile');
                  }}
                  style={{
                    width: '100%',
                    padding: '8px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    border: 'none',
                    backgroundColor: 'transparent',
                    fontSize: '12px',
                    color: '#334155',
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F1F5F9')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <User size={14} color="#64748B" />
                  <span>My Profile & Addresses</span>
                </button>
                <button
                  onClick={() => {
                    setIsProfileOpen(false);
                    onSelectTab && onSelectTab('billing');
                  }}
                  style={{
                    width: '100%',
                    padding: '8px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    border: 'none',
                    backgroundColor: 'transparent',
                    fontSize: '12px',
                    color: '#334155',
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F1F5F9')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <FileText size={14} color="#64748B" />
                  <span>Invoices & Statements</span>
                </button>
              </div>

              <div style={{ borderTop: '1px solid #F1F5F9', padding: '4px 0' }}>
                <button
                  onClick={() => {
                    setIsProfileOpen(false);
                    onLogout && onLogout();
                  }}
                  style={{
                    width: '100%',
                    padding: '8px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    border: 'none',
                    backgroundColor: 'transparent',
                    fontSize: '12px',
                    color: '#EF4444',
                    fontWeight: 600,
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#FEE2E2')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <LogOut size={14} color="#EF4444" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
