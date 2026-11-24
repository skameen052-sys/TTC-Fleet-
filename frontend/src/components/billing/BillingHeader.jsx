import React, { useState, useEffect } from 'react';
import { PortalSwitcher } from '../common/PortalSwitcher';
import {
  Search,
  Bell,
  Calendar,
  ChevronDown,
  User,
  CreditCard,
  Shield,
  Truck,
  Package,
  Building2,
  Sparkles,
  LogOut,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowRight
} from 'lucide-react';

export const BillingHeader = ({
  searchQuery,
  onSearchChange,
  currentUser,
  onLogout,
  onSwitchPortal,
  onNavigateTab,
  notifications = []
}) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showPortalMenu, setShowPortalMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [currentDateStr, setCurrentDateStr] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentDateStr(
        now.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  const defaultNotifs = [
    { id: 1, title: 'Overdue: INV-2026-003 (₹44,900)', time: '10 min ago', desc: 'Nova Cold Chain Pharma is 1 day overdue', type: 'urgent' },
    { id: 2, title: 'Payment Received: ₹1,47,500', time: '2 hrs ago', desc: 'NexGen Industrial Corp via Bank Wire RTGS', type: 'success' },
    { id: 3, title: 'Refund Claim Awaiting Review', time: '4 hrs ago', desc: 'Apex FMCG Logistics submitted REF-2026-302 (₹3,500)', type: 'warning' },
    { id: 4, title: 'GST e-Invoice Filing Confirmed', time: '1 day ago', desc: 'All 5 invoices synced with NIC GST portal', type: 'info' }
  ];

  const activeNotifs = notifications.length > 0 ? notifications : defaultNotifs;
  const unreadCount = activeNotifs.length;

  return (
    <header
      className="dashboard-topbar"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '14px 24px',
        background: '#0d1322',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        position: 'sticky',
        top: 0,
        zIndex: 40
      }}
    >
      {/* 1. Global Search Box */}
      <div
        className="topbar-search-box"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          background: 'rgba(255, 255, 255, 0.04)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '20px',
          padding: '6px 14px',
          width: '380px'
        }}
      >
        <Search size={16} color="#64748b" />
        <input
          type="text"
          placeholder="Search invoices, payments, bills, customers, GSTIN..."
          value={searchQuery || ''}
          onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#fff',
            fontSize: '12.5px',
            outline: 'none',
            width: '100%'
          }}
        />
      </div>

      {/* 2. Right Action Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* Workspace Portal Switcher (7 Portals) */}
        {onSwitchPortal && (
          <PortalSwitcher currentPortal="billing" onSwitchPortal={onSwitchPortal} />
        )}

        {/* Notifications Icon with Unread Dropdown */}
        <div style={{ position: 'relative' }}>
          <button
            className="icon-badge-btn"
            title="Payment reminders & alerts"
            onClick={() => {
              setShowNotifMenu(!showNotifMenu);
              setShowPortalMenu(false);
              setShowProfileMenu(false);
            }}
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              padding: '7px 9px',
              cursor: 'pointer',
              color: '#94a3b8',
              display: 'flex',
              alignItems: 'center',
              position: 'relative'
            }}
          >
            <Bell size={17} />
            <span
              style={{
                position: 'absolute',
                top: '-4px',
                right: '-4px',
                background: '#ef4444',
                color: '#fff',
                borderRadius: '10px',
                fontSize: '9.5px',
                fontWeight: 800,
                padding: '1px 5px'
              }}
            >
              {unreadCount}
            </span>
          </button>

          {showNotifMenu && (
            <div
              style={{
                position: 'absolute',
                top: 'calc(100% + 8px)',
                right: 0,
                width: '320px',
                background: '#131929',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '12px',
                padding: '12px',
                boxShadow: '0 16px 32px rgba(0,0,0,0.6)',
                zIndex: 100
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '8px', marginBottom: '8px' }}>
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#fff' }}>Financial Reminders</span>
                <span style={{ fontSize: '11px', color: '#38bdf8', fontWeight: 600 }}>{unreadCount} Alerts</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '240px', overflowY: 'auto' }}>
                {activeNotifs.map((n, i) => (
                  <div key={n.id || i} style={{ padding: '8px 10px', background: 'rgba(255,255,255,0.03)', borderRadius: '6px', fontSize: '12px' }}>
                    <div style={{ color: '#fff', fontWeight: 600 }}>{n.title}</div>
                    <div style={{ color: '#94a3b8', fontSize: '11px', margin: '2px 0' }}>{n.desc || n.message}</div>
                    <div style={{ color: '#64748b', fontSize: '10px' }}>{n.time}</div>
                  </div>
                ))}
              </div>
              <button
                onClick={() => {
                  setShowNotifMenu(false);
                  if (onNavigateTab) onNavigateTab('notifications');
                }}
                style={{
                  width: '100%',
                  marginTop: '10px',
                  padding: '7px 0',
                  background: 'rgba(37, 99, 235, 0.15)',
                  border: '1px solid rgba(37, 99, 235, 0.3)',
                  borderRadius: '6px',
                  color: '#38bdf8',
                  fontSize: '11.5px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                View All Financial Reminders →
              </button>
            </div>
          )}
        </div>

        {/* Profile Pill */}
        <div style={{ position: 'relative' }}>
          <div
            onClick={() => {
              setShowProfileMenu(!showProfileMenu);
              setShowPortalMenu(false);
              setShowNotifMenu(false);
            }}
            title={currentUser?.fullName || 'Finance Controller'}
            style={{
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '4px 10px 4px 5px',
              borderRadius: '24px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}
          >
            <div
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #2563eb, #0284c7)',
                color: '#fff',
                fontSize: '12px',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {(currentUser?.fullName || 'Finance').charAt(0).toUpperCase()}
            </div>
            <span style={{ color: '#ffffff', fontSize: '12.5px', fontWeight: 600 }}>
              {currentUser?.fullName || 'Devin Vance'}
            </span>
            <ChevronDown size={13} color="#94a3b8" />
          </div>

          {showProfileMenu && (
            <div
              style={{
                position: 'absolute',
                top: 'calc(100% + 8px)',
                right: 0,
                width: '220px',
                background: '#131929',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '12px',
                padding: '8px',
                boxShadow: '0 16px 32px rgba(0,0,0,0.6)',
                zIndex: 100
              }}
            >
              <div style={{ padding: '8px 10px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ fontWeight: 700, color: '#fff', fontSize: '13px' }}>{currentUser?.fullName || 'Devin Vance'}</div>
                <div style={{ fontSize: '11px', color: '#38bdf8' }}>{currentUser?.title || 'Chief Financial Controller'}</div>
              </div>
              <button
                onClick={() => {
                  setShowProfileMenu(false);
                  if (onNavigateTab) onNavigateTab('profile');
                }}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 10px',
                  background: 'transparent',
                  border: 'none',
                  color: '#cbd5e1',
                  fontSize: '12px',
                  cursor: 'pointer',
                  borderRadius: '6px'
                }}
              >
                <User size={14} /> My Profile & Security
              </button>
              <button
                onClick={() => {
                  setShowProfileMenu(false);
                  onLogout();
                }}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 10px',
                  background: 'transparent',
                  border: 'none',
                  color: '#ef4444',
                  fontSize: '12px',
                  cursor: 'pointer',
                  borderRadius: '6px'
                }}
              >
                <LogOut size={14} /> Sign Out
              </button>
            </div>
          )}
        </div>

        {/* Live Date Pill */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            padding: '6px 12px',
            borderRadius: '20px',
            fontSize: '12px',
            color: '#cbd5e1',
            fontWeight: 600
          }}
        >
          <Calendar size={14} color="#64748b" />
          <span>{currentDateStr || 'Nov 23, 2026'}</span>
        </div>
      </div>
    </header>
  );
};
