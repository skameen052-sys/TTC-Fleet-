import React from 'react';
import {
  LayoutDashboard,
  Users,
  ShieldCheck,
  Building2,
  Briefcase,
  CreditCard,
  Sliders,
  FileText,
  Settings,
  LogOut,
  Truck,
  ArrowRight,
  UserCheck,
  Wrench,
  Package,
  Shield
} from 'lucide-react';

export const adminNavItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'users', label: 'User Management', icon: Users, badge: '120' },
  { id: 'roles', label: 'Role & Permissions', icon: ShieldCheck },
  { id: 'branches', label: 'Branch Management', icon: Building2, badge: '12' },
  { id: 'company', label: 'Company Profile', icon: Briefcase },
  { id: 'subscriptions', label: 'Subscription Management', icon: CreditCard, badge: '95' },
  { id: 'configuration', label: 'Configuration', icon: Sliders },
  { id: 'audit', label: 'Audit Logs', icon: FileText },
  { id: 'settings', label: 'Settings', icon: Settings }
];

export const AdminSidebar = ({ activeTab, onSelectTab, onLogout, onSwitchPortal }) => {
  return (
    <aside className="dashboard-sidebar">
      <div>
        {/* Brand Header */}
        <div className="sidebar-brand-block">
          <div className="brand-row">
            <div className="brand-icon-truck">
              <Truck size={20} color="#FFFFFF" strokeWidth={2.4} />
            </div>
            <div>
              <div className="brand-name">
                TTC Fleet<span>360</span>
              </div>
              <div className="brand-tagline">Logistics & Fleet Management</div>
            </div>
          </div>
        </div>

        {/* Navigation list matching Screenshot 2 */}
        <nav className="sidebar-nav-list">
          {adminNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
                onClick={() => onSelectTab(item.id)}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  background: isActive ? 'rgba(0, 163, 255, 0.08)' : 'transparent',
                  cursor: 'pointer'
                }}
              >
                <Icon size={17} className="nav-icon" color={isActive ? '#00d2ff' : '#94a3b8'} strokeWidth={isActive ? 2.4 : 2} />
                <span style={{ flex: 1 }}>{item.label}</span>
                {item.badge && !isActive && (
                  <span style={{
                    fontSize: '10.5px',
                    fontWeight: 700,
                    padding: '2px 7px',
                    borderRadius: '10px',
                    background: 'rgba(255,255,255,0.06)',
                    color: '#94a3b8'
                  }}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom section: Promo Card & Logout */}
      <div>
        <div className="sidebar-promo-card">
          <img
            src="/assets/dashboard-truck-hero.jpg"
            alt="Logistics Operations"
            className="sidebar-promo-img"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/assets/fleet-manager-trucks.jpg';
            }}
          />
          <div className="sidebar-promo-title">
            Smarter Logistics.<br />Stronger Operations.
          </div>
          <button
            className="sidebar-promo-btn"
            onClick={() => onSwitchPortal && onSwitchPortal('manager')}
            title="Open Fleet Manager Operations"
          >
            <span>TTC Fleet360</span>
            <ArrowRight size={12} />
          </button>
        </div>

        {/* Quick Portal Switcher Buttons */}
        {onSwitchPortal && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', margin: '8px 0' }}>
            <button
              className="sidebar-switcher-btn"
              style={{
                background: 'rgba(0,163,255,0.12)',
                border: '1px solid rgba(0,163,255,0.3)',
                color: '#00d2ff',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 10px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '11px',
                fontWeight: '600'
              }}
              onClick={() => onSwitchPortal('manager')}
              title="Switch to Fleet Manager"
            >
              <Truck size={14} color="#00d2ff" />
              <span>Fleet Manager</span>
            </button>

            <button
              className="sidebar-switcher-btn"
              style={{
                background: 'rgba(16,185,129,0.12)',
                border: '1px solid rgba(16,185,129,0.3)',
                color: '#10B981',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 10px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '11px',
                fontWeight: '600'
              }}
              onClick={() => onSwitchPortal('driver')}
              title="Switch to Driver Portal"
            >
              <UserCheck size={14} color="#10B981" />
              <span>Driver Portal</span>
            </button>

            <button
              className="sidebar-switcher-btn"
              style={{
                background: 'rgba(245,158,11,0.12)',
                border: '1px solid rgba(245,158,11,0.3)',
                color: '#f59e0b',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 10px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '11px',
                fontWeight: '600'
              }}
              onClick={() => onSwitchPortal('maintenance')}
              title="Switch to Maintenance Dashboard"
            >
              <Wrench size={14} color="#f59e0b" />
              <span>Maintenance OS</span>
            </button>

            <button
              className="sidebar-switcher-btn"
              style={{
                background: 'rgba(139,92,246,0.12)',
                border: '1px solid rgba(139,92,246,0.3)',
                color: '#8b5cf6',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 10px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '11px',
                fontWeight: '600'
              }}
              onClick={() => onSwitchPortal('warehouse')}
              title="Switch to Warehouse OS"
            >
              <Package size={14} color="#8b5cf6" />
              <span>Warehouse OS</span>
            </button>
          </div>
        )}

        <button
          className="sidebar-logout-btn"
          onClick={onLogout}
          style={{ cursor: 'pointer', border: 'none', width: '100%' }}
        >
          <LogOut size={16} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};
