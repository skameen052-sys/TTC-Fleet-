import React from 'react';
import {
  LayoutDashboard,
  Truck,
  Layers,
  SplitSquareVertical,
  CheckCircle2,
  FileText,
  MapPin,
  Fuel,
  Wrench,
  UserCheck,
  ClipboardCheck,
  BarChart3,
  Bell,
  User,
  Radio,
  LogOut,
  Warehouse,
  Shield
} from 'lucide-react';

export const navigationItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'vehicles', label: 'Vehicle Management', icon: Truck, badgeKey: 'vehicles' },
  { id: 'categories', label: 'Vehicle Categories', icon: Layers },
  { id: 'allocation', label: 'Vehicle Allocation', icon: SplitSquareVertical },
  { id: 'availability', label: 'Vehicle Availability', icon: CheckCircle2, badgeKey: 'available' },
  { id: 'documents', label: 'Vehicle Documents', icon: FileText, badgeKey: 'expiringDocs' },
  { id: 'tracking', label: 'GPS Tracking', icon: MapPin, liveBadge: true },
  { id: 'fuel', label: 'Fuel Management', icon: Fuel },
  { id: 'maintenance', label: 'Maintenance Management', icon: Wrench, badgeKey: 'maintenance' },
  { id: 'driver-assignment', label: 'Driver Assignment', icon: UserCheck },
  { id: 'inspection', label: 'Vehicle Inspection', icon: ClipboardCheck },
  { id: 'reports', label: 'Fleet Reports', icon: BarChart3 },
  { id: 'notifications', label: 'Notifications', icon: Bell, badgeKey: 'unreadNotifs' },
  { id: 'profile', label: 'My Profile', icon: User }
];

export const Sidebar = ({
  activeTab,
  onSelectTab,
  metrics,
  unreadNotificationsCount,
  onLogout,
  onSwitchToDriver,
  onSwitchToWarehouse,
  onSwitchPortal
}) => {
  const getBadgeValue = (item) => {
    if (item.badgeKey === 'vehicles') return metrics?.totalVehicles || 16;
    if (item.badgeKey === 'available') return metrics?.availableVehicles || 4;
    if (item.badgeKey === 'maintenance') return metrics?.vehiclesUnderMaintenance || 2;
    if (item.badgeKey === 'unreadNotifs') return unreadNotificationsCount > 0 ? unreadNotificationsCount : null;
    if (item.badgeKey === 'expiringDocs') return 2;
    return null;
  };

  return (
    <aside className="fleet-sidebar">
      {/* Brand Header */}
      <div className="sidebar-brand-box">
        <div className="brand-logo-icon">
          <Truck size={22} color="#FF7A1A" strokeWidth={2.4} />
        </div>
        <div className="brand-text-col">
          <span className="brand-app-name">
            TTC FLEET<span className="orange-accent-text">360</span>
          </span>
          <span className="brand-sub-badge">FLEET OPERATIONS OS</span>
        </div>
      </div>

      {/* Main Navigation List */}
      <div className="sidebar-section-label">Operations & Fleet</div>
      <nav className="sidebar-nav-list">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          const badge = getBadgeValue(item);
          return (
            <button
              key={item.id}
              className={`sidebar-nav-btn ${isActive ? 'active' : ''}`}
              onClick={() => onSelectTab(item.id)}
            >
              <Icon className="btn-icon" size={18} strokeWidth={isActive ? 2.5 : 2} />
              <span>{item.label}</span>

              {item.liveBadge && (
                <span className="nav-live-pill">
                  <span className="live-dot" /> LIVE
                </span>
              )}

              {badge !== null && !item.liveBadge && (
                <span className="nav-badge-pill">{badge}</span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Fleet Telemetry Status Card in Sidebar */}
      <div className="telemetry-sidebar-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span className="pulse-circle" />
          <div>
            <div className="telemetry-card-title">FLEET TELEMETRY</div>
            <div className="telemetry-card-sub">GPS Gateway Active</div>
          </div>
        </div>
        <Radio size={16} color="#16A36A" />
      </div>

      {/* Portal Switcher Buttons */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', margin: '8px 0' }}>
        {onSwitchPortal && (
          <button
            className="sidebar-switcher-btn"
            style={{ background: 'rgba(255,122,26,0.12)', border: '1px solid rgba(255,122,26,0.3)', color: '#FF9E4A' }}
            onClick={() => onSwitchPortal('admin')}
            title="Switch to Admin Dashboard"
          >
            <Shield size={14} color="#FF7A1A" />
            <span>Switch to Admin Dashboard</span>
          </button>
        )}
        {(onSwitchPortal || onSwitchToDriver) && (
          <button
            className="sidebar-switcher-btn"
            style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.3)', color: '#10B981' }}
            onClick={() => onSwitchPortal ? onSwitchPortal('driver') : onSwitchToDriver()}
            title="Switch to Driver Portal"
          >
            <Truck size={14} color="#10B981" />
            <span>Switch to Driver Portal</span>
          </button>
        )}
        {(onSwitchPortal || onSwitchToWarehouse) && (
          <button
            className="sidebar-switcher-btn"
            style={{ background: 'rgba(0,163,255,0.12)', border: '1px solid rgba(0,163,255,0.3)', color: '#00d2ff' }}
            onClick={() => onSwitchPortal ? onSwitchPortal('warehouse') : onSwitchToWarehouse()}
            title="Switch to Warehouse Portal"
          >
            <Warehouse size={14} color="#00d2ff" />
            <span>Switch to Warehouse OS</span>
          </button>
        )}
      </div>

      {/* Logout Action */}
      <button
        className="sidebar-logout-btn"
        onClick={() => onLogout ? onLogout() : onSelectTab('login')}
        title="Sign Out to Login Page"
      >
        <LogOut size={16} />
        <span>Logout</span>
      </button>

      {/* Ambient Orange Glow Curve at bottom of sidebar */}
      <div className="sidebar-ambient-glow" />
    </aside>
  );
};
