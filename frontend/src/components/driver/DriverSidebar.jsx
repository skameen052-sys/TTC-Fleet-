import React from 'react';
import {
  LayoutDashboard,
  Truck,
  MapPin,
  Route,
  PackageCheck,
  PackageX,
  Boxes,
  Fuel,
  ClipboardCheck,
  FileText,
  Bell,
  User,
  ShieldCheck,
  Radio,
  LogOut,
  Warehouse,
  Shield
} from 'lucide-react';

export const driverNavItems = [
  { id: 'dashboard', label: 'Driver Dashboard', icon: LayoutDashboard },
  { id: 'my-trips', label: 'My Trips', icon: Truck, badge: '1', badgeType: 'active' },
  { id: 'active-trip', label: 'Active Trip', icon: MapPin, liveBadge: true },
  { id: 'my-vehicle', label: 'My Vehicle', icon: Truck },
  { id: 'route-nav', label: 'Route Navigation', icon: Route },
  { id: 'pickup', label: 'Pickup Management', icon: PackageCheck },
  { id: 'delivery', label: 'Delivery Management', icon: PackageX },
  { id: 'shipment', label: 'Shipment Details', icon: Boxes },
  { id: 'fuel', label: 'Fuel Records', icon: Fuel },
  { id: 'inspection', label: 'Vehicle Inspection', icon: ClipboardCheck },
  { id: 'documents', label: 'Documents', icon: FileText, badge: '4' },
  { id: 'notifications', label: 'Notifications', icon: Bell, badge: '1', badgeType: 'alert' },
  { id: 'profile', label: 'My Profile', icon: User }
];

export const DriverSidebar = ({
  activeTab,
  onSelectTab,
  driver,
  onLogout,
  onSwitchToManager,
  onSwitchToWarehouse,
  onSwitchPortal
}) => {
  return (
    <aside className="fleet-sidebar driver-sidebar">
      {/* Brand Header */}
      <div className="sidebar-brand-box">
        <div className="brand-logo-icon">
          <Truck size={22} color="#FF7A1A" strokeWidth={2.4} />
        </div>
        <div className="brand-text-col">
          <span className="brand-app-name">
            TTC FLEET<span className="orange-accent-text">360</span>
          </span>
          <span className="brand-sub-badge">DRIVER PORTAL OS</span>
        </div>
      </div>

      {/* Driver Identity Card in Sidebar */}
      <div className="driver-sidebar-badge">
        <div className="driver-badge-avatar">MV</div>
        <div className="driver-badge-text">
          <div className="driver-badge-name">{driver?.fullName || 'Marcus Vance'}</div>
          <div className="driver-badge-sub">CDL Class-A | {driver?.assignedVehicleReg || 'TTC-8492-HD'}</div>
        </div>
        <ShieldCheck size={16} color="#16A36A" />
      </div>

      {/* Main Navigation List */}
      <div className="sidebar-section-label">Driver Operations</div>
      <nav className="sidebar-nav-list">
        {driverNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
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

              {item.badge && !item.liveBadge && (
                <span className={`nav-badge-pill ${item.badgeType === 'alert' ? 'badge-alert' : ''}`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* GPS Telemetry Pill */}
      <div className="telemetry-sidebar-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span className="pulse-circle" />
          <div>
            <div className="telemetry-card-title">LIVE GPS TRACKING</div>
            <div className="telemetry-card-sub">I-90 E Corridor (68 km/h)</div>
          </div>
        </div>
        <Radio size={16} color="#16A36A" />
      </div>

      {/* Switch Portal Buttons */}
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
        {(onSwitchPortal || onSwitchToManager) && (
          <button
            className="sidebar-switcher-btn"
            style={{ background: 'rgba(0,163,255,0.12)', border: '1px solid rgba(0,163,255,0.3)', color: '#00d2ff' }}
            onClick={() => onSwitchPortal ? onSwitchPortal('manager') : onSwitchToManager()}
            title="Switch to Fleet Manager"
          >
            <Truck size={14} color="#00d2ff" />
            <span>Switch to Fleet Manager</span>
          </button>
        )}
        {(onSwitchPortal || onSwitchToWarehouse) && (
          <button
            className="sidebar-switcher-btn"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: '#cbd5e1' }}
            onClick={() => onSwitchPortal ? onSwitchPortal('warehouse') : onSwitchToWarehouse()}
            title="Switch to Warehouse OS"
          >
            <Warehouse size={14} />
            <span>Switch to Warehouse OS</span>
          </button>
        )}
      </div>

      {/* Logout Action */}
      <button
        className="sidebar-logout-btn"
        onClick={onLogout}
        title="Sign Out of Driver Portal"
      >
        <LogOut size={16} />
        <span>Logout</span>
      </button>

      {/* Ambient Orange Glow */}
      <div className="sidebar-ambient-glow" />
    </aside>
  );
};
