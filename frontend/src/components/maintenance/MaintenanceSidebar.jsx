import React from 'react';
import {
  Wrench,
  Calendar,
  History,
  AlertTriangle,
  Activity,
  ShieldCheck,
  Users,
  Package,
  User,
  Radio,
  LogOut,
  Truck,
  Shield,
  Layers,
  LayoutDashboard
} from 'lucide-react';

export const maintenanceNavItems = [
  { id: 'dashboard', label: 'Dashboard Overview', icon: LayoutDashboard },
  { id: 'schedules', label: 'Maintenance Schedules', icon: Calendar, badge: '5' },
  { id: 'history', label: 'Service History', icon: History },
  { id: 'requests', label: 'Repair Requests', icon: AlertTriangle, badge: '3', badgeType: 'alert' },
  { id: 'health', label: 'Vehicle Health & Telematics', icon: Activity, liveBadge: true },
  { id: 'compliance', label: 'Compliance & Safety Docs', icon: ShieldCheck, badge: '2' },
  { id: 'technicians', label: 'Technician Allocation', icon: Users },
  { id: 'profile', label: 'Maintenance Profile', icon: User }
];

export const MaintenanceSidebar = ({
  activeTab,
  onSelectTab,
  metrics,
  unreadAlertsCount = 3,
  onLogout,
  onSwitchPortal
}) => {
  return (
    <aside className="fleet-sidebar maintenance-sidebar">
      {/* Brand Header */}
      <div className="sidebar-brand-box">
        <div
          className="brand-logo-icon"
          style={{
            background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
            boxShadow: '0 4px 14px rgba(245, 158, 11, 0.4)'
          }}
        >
          <Wrench size={22} color="#FFFFFF" strokeWidth={2.4} />
        </div>
        <div className="brand-text-wrap">
          <span className="brand-app-name">
            TTC FLEET<span className="orange-accent-text">360</span>
          </span>
          <span className="brand-sub-badge" style={{ color: '#fbbf24' }}>
            MAINTENANCE OS
          </span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="sidebar-nav-container">
        <div className="nav-group-section">
          <div className="nav-group-title">ASSET HEALTH & REPAIR</div>
          <div className="nav-items-list">
            {maintenanceNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  className={`nav-item-btn ${isActive ? 'active' : ''}`}
                  onClick={() => onSelectTab(item.id)}
                  title={item.label}
                >
                  <Icon className="btn-icon" size={18} strokeWidth={isActive ? 2.5 : 2} />
                  <span>{item.label}</span>

                  {item.liveBadge && (
                    <span className="nav-live-pill">
                      <span className="live-dot" /> LIVE
                    </span>
                  )}

                  {item.badge && !item.liveBadge && (
                    <span
                      className={`nav-badge-pill ${item.badgeType === 'alert' ? 'badge-alert' : ''}`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* System Status Pill */}
      <div className="sidebar-system-status">
        <div className="status-indicator-dot" />
        <div className="status-info-col">
          <span className="status-title">Workshop Bays</span>
          <span className="status-desc">2 In Repair • 4 Ready</span>
        </div>
        <Radio size={16} color="#16A36A" />
      </div>

      {/* Portal Switcher Buttons */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', margin: '8px 0' }}>
        {onSwitchPortal && (
          <>
            <button
              className="sidebar-switcher-btn"
              style={{
                background: 'rgba(255,122,26,0.12)',
                border: '1px solid rgba(255,122,26,0.3)',
                color: '#FF9E4A'
              }}
              onClick={() => onSwitchPortal('admin')}
              title="Switch to Admin Dashboard"
            >
              <Shield size={14} color="#FF7A1A" />
              <span>Switch to Admin Dashboard</span>
            </button>

            <button
              className="sidebar-switcher-btn"
              style={{
                background: 'rgba(0,163,255,0.12)',
                border: '1px solid rgba(0,163,255,0.3)',
                color: '#00d2ff'
              }}
              onClick={() => onSwitchPortal('manager')}
              title="Switch to Fleet Manager"
            >
              <Truck size={14} color="#00d2ff" />
              <span>Switch to Fleet Manager</span>
            </button>

            <button
              className="sidebar-switcher-btn"
              style={{
                background: 'rgba(16,185,129,0.12)',
                border: '1px solid rgba(16,185,129,0.3)',
                color: '#10B981'
              }}
              onClick={() => onSwitchPortal('driver')}
              title="Switch to Driver Portal"
            >
              <Users size={14} color="#10B981" />
              <span>Switch to Driver Portal</span>
            </button>
          </>
        )}
      </div>

      {/* Logout Action */}
      <button
        type="button"
        className="sidebar-logout-btn"
        onClick={onLogout}
        title="Sign Out of TTC Fleet360"
      >
        <LogOut size={16} />
        <span>Sign Out</span>
      </button>
    </aside>
  );
};
