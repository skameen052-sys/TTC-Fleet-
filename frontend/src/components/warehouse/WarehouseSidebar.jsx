// frontend/src/components/warehouse/WarehouseSidebar.jsx
import React, { useState } from 'react';
import {
  LayoutDashboard,
  Warehouse,
  Boxes,
  PackagePlus,
  PackageMinus,
  ArrowDownToLine,
  ArrowUpFromLine,
  Truck,
  Forklift,
  ArrowLeftRight,
  AlertTriangle,
  FileBarChart2,
  Bell,
  User,
  LogOut,
  ChevronDown,
  ChevronRight,
  Radio,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sparkles
} from 'lucide-react';

export const warehouseNavItems = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    badge: null
  },
  {
    id: 'warehouses',
    label: 'Warehouse Management',
    icon: Warehouse,
    subItems: [
      { id: 'all-warehouses', label: 'All Warehouses' },
      { id: 'add-warehouse', label: 'Add Warehouse' },
      { id: 'edit-warehouse', label: 'Edit Warehouse' }
    ]
  },
  {
    id: 'inventory',
    label: 'Inventory Management',
    icon: Boxes,
    subItems: [
      { id: 'all-inventory', label: 'All Inventory' },
      { id: 'add-items', label: 'Add Items' },
      { id: 'stock-details', label: 'Stock Details' }
    ]
  },
  {
    id: 'goods-receiving',
    label: 'Goods Receiving',
    icon: ArrowDownToLine,
    badge: '3',
    badgeType: 'info',
    subItems: [
      { id: 'incoming-goods', label: 'Incoming Goods' },
      { id: 'receiving-confirmation', label: 'Receiving Confirmation' }
    ]
  },
  {
    id: 'goods-dispatch',
    label: 'Goods Dispatch',
    icon: ArrowUpFromLine,
    badge: '4',
    badgeType: 'orange',
    subItems: [
      { id: 'outgoing-goods', label: 'Outgoing Goods' },
      { id: 'dispatch-records', label: 'Dispatch Records' }
    ]
  },
  {
    id: 'stock-in',
    label: 'Stock In',
    icon: PackagePlus,
    subItems: [
      { id: 'add-stock', label: 'Add Stock' },
      { id: 'receiving-history', label: 'Receiving History' }
    ]
  },
  {
    id: 'stock-out',
    label: 'Stock Out',
    icon: PackageMinus,
    subItems: [
      { id: 'remove-stock', label: 'Remove Stock' },
      { id: 'stock-out-history', label: 'Stock Out History' }
    ]
  },
  {
    id: 'shipment-management',
    label: 'Shipment Management',
    icon: Truck,
    subItems: [
      { id: 'incoming-shipments', label: 'Incoming Shipments' },
      { id: 'outgoing-shipments', label: 'Outgoing Shipments' }
    ]
  },
  {
    id: 'loading-management',
    label: 'Loading Management',
    icon: Forklift,
    subItems: [
      { id: 'loading-schedule', label: 'Loading Schedule' },
      { id: 'loading-confirmation', label: 'Loading Confirmation' }
    ]
  },
  {
    id: 'unloading-management',
    label: 'Unloading Management',
    icon: Clock,
    subItems: [
      { id: 'unloading-schedule', label: 'Unloading Schedule' },
      { id: 'unloading-confirmation', label: 'Unloading Confirmation' }
    ]
  },
  {
    id: 'stock-transfers',
    label: 'Stock Transfers',
    icon: ArrowLeftRight,
    badge: '2'
  },
  {
    id: 'damaged-goods',
    label: 'Damaged Goods',
    icon: AlertTriangle,
    badge: '2',
    badgeType: 'alert',
    subItems: [
      { id: 'damaged-stock', label: 'Damaged Stock' },
      { id: 'damage-reports', label: 'Damage Reports' }
    ]
  },
  {
    id: 'inventory-reports',
    label: 'Inventory Reports',
    icon: FileBarChart2,
    subItems: [
      { id: 'stock-reports', label: 'Stock Reports' },
      { id: 'movement-reports', label: 'Movement Reports' }
    ]
  },
  {
    id: 'notifications',
    label: 'Notifications',
    icon: Bell,
    badge: '6',
    badgeType: 'alert',
    subItems: [
      { id: 'low-stock-alerts', label: 'Low Stock Alerts' },
      { id: 'pending-dispatch-alerts', label: 'Pending Dispatch Alerts' }
    ]
  },
  {
    id: 'profile',
    label: 'My Profile',
    icon: User,
    subItems: [
      { id: 'personal-profile', label: 'Profile' },
      { id: 'change-password', label: 'Change Password' }
    ]
  }
];

export const WarehouseSidebar = ({
  activeTab,
  onSelectTab,
  user,
  onLogout,
  onSwitchToManager,
  onSwitchToDriver
}) => {
  // Manage expandable submenus
  const [expandedMenus, setExpandedMenus] = useState({
    warehouses: false,
    inventory: false,
    'goods-receiving': false,
    'goods-dispatch': false,
    'stock-in': false,
    'stock-out': false,
    'shipment-management': false,
    'loading-management': false,
    'unloading-management': false,
    'damaged-goods': false,
    'inventory-reports': false,
    notifications: false,
    profile: false
  });

  // Auto-expand parent section when activeTab is one of its sub-items
  React.useEffect(() => {
    const parentItem = warehouseNavItems.find(item =>
      item.subItems && item.subItems.some(sub => sub.id === activeTab)
    );
    if (parentItem) {
      setExpandedMenus(prev => ({
        ...prev,
        [parentItem.id]: true
      }));
    }
  }, [activeTab]);

  const toggleSubmenu = (itemId, e) => {
    e.stopPropagation();
    setExpandedMenus(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  const handleNavClick = (item) => {
    if (item.subItems && item.subItems.length > 0) {
      setExpandedMenus(prev => ({
        ...prev,
        [item.id]: true
      }));
      onSelectTab(item.subItems[0].id);
    } else {
      onSelectTab(item.id);
    }
  };

  return (
    <aside className="fleet-sidebar warehouse-sidebar">
      {/* Brand Header */}
      <div className="sidebar-brand-box">
        <div className="brand-logo-icon" style={{ background: 'linear-gradient(135deg, #FF7A1A, #E0630D)' }}>
          <Warehouse size={22} color="#FFFFFF" strokeWidth={2.4} />
        </div>
        <div className="brand-text-col">
          <span className="brand-app-name">
            TTC FLEET<span className="orange-accent-text">360</span>
          </span>
          <span className="brand-sub-badge" style={{ color: '#FFB37C' }}>WAREHOUSE OS</span>
        </div>
      </div>

      {/* Warehouse Manager Identity Card in Sidebar */}
      <div className="driver-sidebar-badge warehouse-manager-badge">
        <div className="driver-badge-avatar" style={{ background: 'linear-gradient(135deg, #3478F6, #1E3155)' }}>
          EC
        </div>
        <div className="driver-badge-text">
          <div className="driver-badge-name">{user?.fullName || 'Ethan Cole'}</div>
          <div className="driver-badge-sub">Director WH-01 | Chicago Hub</div>
        </div>
        <ShieldCheck size={16} color="#16A36A" />
      </div>

      {/* Navigation Label */}
      <div className="sidebar-section-label">Warehouse Operations</div>

      {/* Main Navigation List */}
      <nav className="sidebar-nav-list">
        {warehouseNavItems.map((item) => {
          const Icon = item.icon;
          const isItemActive = activeTab === item.id || (item.subItems && item.subItems.some(sub => sub.id === activeTab));
          const isExpanded = expandedMenus[item.id];
          const hasSub = item.subItems && item.subItems.length > 0;

          return (
            <div key={item.id} className="nav-item-group">
              <button
                className={`sidebar-nav-btn ${isItemActive ? 'active' : ''}`}
                onClick={() => handleNavClick(item)}
              >
                <Icon className="btn-icon" size={18} strokeWidth={isItemActive ? 2.5 : 2} />
                <span style={{ flex: 1, textAlign: 'left' }}>{item.label}</span>

                {item.badge && (
                  <span
                    className="nav-badge-pill"
                    style={
                      item.badgeType === 'alert'
                        ? { backgroundColor: '#EF5350', color: '#FFFFFF' }
                        : item.badgeType === 'orange'
                        ? { backgroundColor: '#FF7A1A', color: '#FFFFFF' }
                        : { backgroundColor: '#3478F6', color: '#FFFFFF' }
                    }
                  >
                    {item.badge}
                  </span>
                )}

                {hasSub && (
                  <span
                    className="submenu-arrow-toggle"
                    onClick={(e) => toggleSubmenu(item.id, e)}
                    style={{ marginLeft: 6, color: '#94A3B8' }}
                  >
                    {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                  </span>
                )}
              </button>

              {/* Submenu Items */}
              {hasSub && isExpanded && (
                <div className="sidebar-submenu-list">
                  {item.subItems.map((sub) => {
                    const isSubActive = activeTab === sub.id;
                    return (
                      <button
                        key={sub.id}
                        className={`sidebar-submenu-btn ${isSubActive ? 'active' : ''}`}
                        onClick={() => onSelectTab(sub.id)}
                      >
                        <span className="submenu-bullet" />
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

      {/* Sidebar Footer Elements */}
      <div className="sidebar-footer-group" style={{ marginTop: 'auto', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {/* WMS Telemetry Pill */}
        <div className="telemetry-sidebar-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span className="pulse-circle" />
            <div>
              <div className="telemetry-card-title">WMS GATEWAY ACTIVE</div>
              <div className="telemetry-card-sub">CHI-01 • 82% Capacity</div>
            </div>
          </div>
          <Radio size={16} color="#16A36A" />
        </div>

        {/* Logout Action */}
        <button
          className="sidebar-logout-btn"
          onClick={onLogout}
          title="Sign Out of Warehouse OS"
        >
          <LogOut size={16} />
          <span>Logout</span>
        </button>
      </div>

      {/* Ambient Orange Glow */}
      <div className="sidebar-ambient-glow" />
    </aside>
  );
};
