// frontend/src/components/logistics/LogisticsSidebar.jsx
import React, { useState } from 'react';
import {
  LayoutDashboard,
  PackageCheck,
  Truck,
  Route,
  Car,
  UserCheck,
  Compass,
  MapPin,
  CalendarCheck,
  CheckSquare,
  Users,
  BarChart3,
  Bell,
  User,
  ChevronDown,
  ChevronRight,
  LogOut,
  Radio,
  Boxes,
  Shield,
  Warehouse
} from 'lucide-react';

export const logisticsNavItems = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    subItems: [{ id: 'dashboard', label: 'Logistics Overview' }]
  },
  {
    id: 'orders',
    label: 'Order Management',
    icon: PackageCheck,
    badgeKey: 'pendingOrders',
    subItems: [
      { id: 'all-orders', label: 'All Orders' },
      { id: 'create-order', label: 'Create Order' },
      { id: 'pending-orders', label: 'Pending Orders' },
      { id: 'approved-orders', label: 'Approved Orders' },
      { id: 'cancelled-orders', label: 'Cancelled Orders' }
    ]
  },
  {
    id: 'shipments',
    label: 'Shipment Management',
    icon: Truck,
    badgeKey: 'shipmentsInTransit',
    subItems: [
      { id: 'all-shipments', label: 'All Shipments' },
      { id: 'shipments-processing', label: 'Processing' },
      { id: 'shipments-in-transit', label: 'In Transit' },
      { id: 'shipments-delivered', label: 'Delivered' }
    ]
  },
  {
    id: 'trips',
    label: 'Trip Management',
    icon: Route,
    badgeKey: 'activeTrips',
    subItems: [
      { id: 'all-trips', label: 'All Trips' },
      { id: 'create-trip', label: 'Create Trip' },
      { id: 'active-trips', label: 'Active Trips' },
      { id: 'completed-trips', label: 'Completed Trips' }
    ]
  },
  {
    id: 'vehicle-assignment',
    label: 'Vehicle Assignment',
    icon: Car,
    subItems: [
      { id: 'available-vehicles', label: 'Available Vehicles' },
      { id: 'assign-vehicles', label: 'Assign Vehicles' }
    ]
  },
  {
    id: 'driver-assignment',
    label: 'Driver Assignment',
    icon: UserCheck,
    subItems: [
      { id: 'available-drivers', label: 'Available Drivers' },
      { id: 'assign-drivers', label: 'Assign Drivers' }
    ]
  },
  {
    id: 'route-management',
    label: 'Route Management',
    icon: Compass,
    subItems: [
      { id: 'create-route', label: 'Create Route' },
      { id: 'route-planning', label: 'Route Planning' },
      { id: 'route-optimization', label: 'Route Optimization' }
    ]
  },
  {
    id: 'gps-tracking',
    label: 'GPS Tracking',
    icon: MapPin,
    liveBadge: true,
    subItems: [
      { id: 'live-tracking', label: 'Live Tracking' },
      { id: 'trip-tracking', label: 'Trip Tracking' }
    ]
  },
  {
    id: 'pickup-management',
    label: 'Pickup Management',
    icon: CalendarCheck,
    subItems: [
      { id: 'pickup-schedule', label: 'Pickup Schedule' },
      { id: 'pickup-confirmation', label: 'Pickup Confirmation' }
    ]
  },
  {
    id: 'delivery-management',
    label: 'Delivery Management',
    icon: CheckSquare,
    subItems: [
      { id: 'delivery-schedule', label: 'Delivery Schedule' },
      { id: 'delivery-status', label: 'Delivery Status' },
      { id: 'proof-of-delivery', label: 'Proof of Delivery' }
    ]
  },
  {
    id: 'customer-orders',
    label: 'Customer Orders',
    icon: Users,
    subItems: [
      { id: 'customer-requests', label: 'Customer Requests' },
      { id: 'order-history', label: 'Order History' }
    ]
  },
  {
    id: 'reports',
    label: 'Logistics Reports',
    icon: BarChart3,
    subItems: [
      { id: 'order-reports', label: 'Order Reports' },
      { id: 'shipment-reports', label: 'Shipment Reports' },
      { id: 'trip-reports', label: 'Trip Reports' }
    ]
  },
  {
    id: 'notifications',
    label: 'Notifications',
    icon: Bell,
    badgeKey: 'unreadNotifs',
    subItems: [
      { id: 'delayed-orders', label: 'Delayed Orders' },
      { id: 'trip-alerts', label: 'Trip Alerts' }
    ]
  },
  {
    id: 'profile',
    label: 'My Profile',
    icon: User,
    subItems: [
      { id: 'profile-info', label: 'Profile' },
      { id: 'change-password', label: 'Change Password' }
    ]
  }
];

export const LogisticsSidebar = ({
  activeTab = 'dashboard',
  onSelectTab,
  metrics,
  unreadCount = 3,
  manager,
  onLogout,
  onSwitchPortal
}) => {
  const [expandedSections, setExpandedSections] = useState({
    orders: true,
    shipments: true,
    trips: false,
    'vehicle-assignment': false,
    'driver-assignment': false,
    'route-management': false,
    'gps-tracking': false,
    'pickup-management': false,
    'delivery-management': false,
    'customer-orders': false,
    reports: false,
    notifications: false,
    profile: false
  });

  const toggleSection = (id) => {
    setExpandedSections(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const getBadge = (key) => {
    if (key === 'pendingOrders') return metrics?.pendingOrders || 3;
    if (key === 'shipmentsInTransit') return metrics?.shipmentsInTransit || 2;
    if (key === 'activeTrips') return metrics?.activeTrips || 1;
    if (key === 'unreadNotifs') return unreadCount > 0 ? unreadCount : null;
    return null;
  };

  return (
    <aside className="fleet-sidebar logistics-sidebar">
      {/* Brand Header */}
      <div className="sidebar-brand-box">
        <div className="brand-logo-icon" style={{ background: 'linear-gradient(135deg, #FF7A1A 0%, #E65100 100%)' }}>
          <Boxes size={22} color="#FFFFFF" strokeWidth={2.4} />
        </div>
        <div className="brand-text-col">
          <span className="brand-app-name">
            TTC FLEET<span className="orange-accent-text">360</span>
          </span>
          <span className="brand-sub-badge" style={{ color: '#FF7A1A', background: 'rgba(255, 122, 26, 0.12)' }}>
            LOGISTICS MANAGER OS
          </span>
        </div>
      </div>

      {/* Main Navigation List */}
      <div className="sidebar-section-label">Logistics & Transportation</div>
      <nav className="sidebar-nav-list" style={{ overflowY: 'auto', flex: 1, maxHeight: 'calc(100vh - 280px)' }}>
        {logisticsNavItems.map(item => {
          const Icon = item.icon;
          const isParentActive =
            activeTab === item.id ||
            (item.subItems && item.subItems.some(sub => sub.id === activeTab));
          const isExpanded = expandedSections[item.id];
          const badge = getBadge(item.badgeKey);

          return (
            <div key={item.id} className="nav-group-item">
              <button
                className={`sidebar-nav-btn ${isParentActive ? 'active' : ''}`}
                onClick={() => {
                  if (item.subItems && item.subItems.length > 1) {
                    toggleSection(item.id);
                  } else {
                    onSelectTab(item.id);
                  }
                }}
              >
                <Icon className="btn-icon" size={17} strokeWidth={isParentActive ? 2.5 : 2} />
                <span style={{ flex: 1, textAlign: 'left' }}>{item.label}</span>

                {item.liveBadge && (
                  <span className="nav-live-pill" style={{ marginRight: 6 }}>
                    <span className="live-dot" /> LIVE
                  </span>
                )}

                {badge !== null && !item.liveBadge && (
                  <span className="nav-badge-pill" style={{ marginRight: 6 }}>
                    {badge}
                  </span>
                )}

                {item.subItems && item.subItems.length > 1 && (
                  <span style={{ color: '#94A3B8', display: 'flex', alignItems: 'center' }}>
                    {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                  </span>
                )}
              </button>

              {/* Submenu items */}
              {item.subItems && item.subItems.length > 1 && isExpanded && (
                <div className="sidebar-submenu-list" style={{ paddingLeft: '28px', marginTop: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {item.subItems.map(sub => {
                    const isSubActive = activeTab === sub.id;
                    return (
                      <button
                        key={sub.id}
                        className={`sidebar-sub-btn ${isSubActive ? 'active' : ''}`}
                        onClick={() => onSelectTab(sub.id)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 8,
                          padding: '6px 12px',
                          fontSize: '12px',
                          color: isSubActive ? '#FF7A1A' : '#94A3B8',
                          background: isSubActive ? 'rgba(255, 122, 26, 0.12)' : 'transparent',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontWeight: isSubActive ? 700 : 500,
                          textAlign: 'left',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        <span style={{ width: 4, height: 4, borderRadius: '50%', backgroundColor: isSubActive ? '#FF7A1A' : '#64748B' }} />
                        <span>{sub.label}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Logistics Dispatch Control Card in Sidebar */}
      <div className="telemetry-sidebar-card" style={{ borderColor: 'rgba(255, 122, 26, 0.3)', margin: '8px 12px 4px 12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span className="pulse-circle" style={{ backgroundColor: '#FF7A1A', boxShadow: '0 0 0 3px rgba(255, 122, 26, 0.25)' }} />
          <div>
            <div className="telemetry-card-title" style={{ color: '#FF7A1A' }}>LOGISTICS CONTROL</div>
            <div className="telemetry-card-sub">Dispatcher Grid 100% Sync</div>
          </div>
        </div>
        <Radio size={16} color="#FF7A1A" />
      </div>

      {/* Quick Portal Switcher */}
      {onSwitchPortal && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', margin: '4px 12px' }}>
          <button
            className="sidebar-switcher-btn"
            style={{ background: 'rgba(0,163,255,0.1)', border: '1px solid rgba(0,163,255,0.25)', color: '#00d2ff', fontSize: '11px', padding: '6px 10px' }}
            onClick={() => onSwitchPortal('manager')}
            title="Switch to Fleet Manager"
          >
            <Truck size={13} color="#00d2ff" />
            <span>Switch to Fleet Manager</span>
          </button>
          <button
            className="sidebar-switcher-btn"
            style={{ background: 'rgba(255,122,26,0.1)', border: '1px solid rgba(255,122,26,0.25)', color: '#FF9E4A', fontSize: '11px', padding: '6px 10px' }}
            onClick={() => onSwitchPortal('warehouse')}
            title="Switch to Warehouse OS"
          >
            <Warehouse size={13} color="#FF9E4A" />
            <span>Switch to Warehouse OS</span>
          </button>
        </div>
      )}

      {/* Bottom Profile Summary & Logout */}
      <div className="sidebar-footer-profile" style={{ padding: '8px 14px', borderTop: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
          <div style={{ width: 28, height: 28, borderRadius: '50%', backgroundColor: '#FF7A1A', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 800 }}>
            <span>ER</span>
          </div>
          <div style={{ minWidth: 0, overflow: 'hidden' }}>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#E2E8F0', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
              {manager?.name || 'Elena Rostova'}
            </div>
            <div style={{ fontSize: '10px', color: '#94A3B8' }}>Logistics Director</div>
          </div>
        </div>
        <button
          onClick={onLogout}
          title="Sign Out"
          style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', padding: 4 }}
        >
          <LogOut size={16} />
        </button>
      </div>
    </aside>
  );
};
