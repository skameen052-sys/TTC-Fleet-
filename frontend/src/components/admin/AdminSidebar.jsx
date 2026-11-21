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
  ArrowRight
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
