// frontend/src/components/customer/CustomerSidebar.jsx
import React, { useState } from 'react';
import {
  LayoutDashboard,
  PlusCircle,
  Package,
  Truck,
  MapPin,
  CheckCircle2,
  Calendar,
  FileText,
  CreditCard,
  RotateCcw,
  Bell,
  HelpCircle,
  User,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Boxes,
  ShieldCheck,
  Building2
} from 'lucide-react';

export const CustomerSidebar = ({
  activeTab,
  onSelectTab,
  onLogout,
  profile,
  unreadNotificationsCount = 0
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: null },
    { id: 'create-order', label: 'Create New Order', icon: PlusCircle, badge: 'Book' },
    { id: 'orders', label: 'My Orders', icon: Package, badge: null },
    { id: 'shipments', label: 'My Shipments', icon: Truck, badge: null },
    { id: 'live-tracking', label: 'Live Tracking', icon: MapPin, badge: 'Live' },
    { id: 'delivery-history', label: 'Delivery History', icon: CheckCircle2, badge: null },
    { id: 'pickup-delivery', label: 'Pickup & Delivery', icon: Calendar, badge: null },
    { id: 'billing', label: 'Billing & Invoices', icon: FileText, badge: null },
    { id: 'payments', label: 'Payment Management', icon: CreditCard, badge: null },
    { id: 'refunds', label: 'Refund Requests', icon: RotateCcw, badge: null },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: Bell,
      badge: unreadNotificationsCount > 0 ? String(unreadNotificationsCount) : null,
      badgeColor: '#FF7A1A'
    },
    { id: 'support', label: 'Support & Complaints', icon: HelpCircle, badge: null },
    { id: 'profile', label: 'My Profile', icon: User, badge: null }
  ];

  return (
    <aside
      className="fleet-sidebar customer-sidebar"
      style={{
        width: isCollapsed ? '76px' : '260px',
        backgroundColor: '#14213D',
        transition: 'width 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        top: 0,
        bottom: 0,
        left: 0,
        zIndex: 50,
        overflowY: 'auto',
        overflowX: 'hidden',
        borderRight: '1px solid rgba(255, 255, 255, 0.08)',
        padding: '18px 12px 16px 12px'
      }}
    >
      {/* Brand Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: isCollapsed ? 'center' : 'space-between',
          paddingBottom: '16px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          marginBottom: '14px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              backgroundColor: '#FF7A1A',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              boxShadow: '0 4px 12px rgba(255, 122, 26, 0.35)'
            }}
          >
            <Boxes size={20} color="#FFFFFF" strokeWidth={2.4} />
          </div>
          {!isCollapsed && (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '15px', fontWeight: 800, color: '#FFFFFF', letterSpacing: '0.02em' }}>
                TTC FLEET<span style={{ color: '#FF7A1A' }}>360</span>
              </span>
              <span
                style={{
                  fontSize: '9.5px',
                  fontWeight: 700,
                  color: '#079DF2',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase'
                }}
              >
                Customer Portal
              </span>
            </div>
          )}
        </div>

        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          style={{
            background: 'rgba(255, 255, 255, 0.06)',
            border: 'none',
            borderRadius: '6px',
            color: '#94A3B8',
            cursor: 'pointer',
            padding: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* Customer Company Badge */}
      {!isCollapsed && (
        <div
          style={{
            background: 'rgba(7, 157, 242, 0.1)',
            border: '1px solid rgba(7, 157, 242, 0.25)',
            borderRadius: '8px',
            padding: '8px 10px',
            marginBottom: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <Building2 size={16} color="#079DF2" />
          <div style={{ overflow: 'hidden' }}>
            <div
              style={{
                fontSize: '11px',
                fontWeight: 700,
                color: '#FFFFFF',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}
            >
              {profile?.companyName || 'NexGen Industrial Corp'}
            </div>
            <div style={{ fontSize: '9.5px', color: '#94A3B8' }}>
              {profile?.id || 'CUST-8021'} • Tier 1 Client
            </div>
          </div>
        </div>
      )}

      {/* Navigation Menu */}
      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '3px' }}>
        {menuItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: isCollapsed ? 'center' : 'space-between',
                width: '100%',
                padding: isCollapsed ? '10px 0' : '9px 12px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: isActive ? '#FF7A1A' : 'transparent',
                color: isActive ? '#FFFFFF' : '#CBD5E1',
                fontSize: '12.5px',
                fontWeight: isActive ? 700 : 500,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                textAlign: 'left'
              }}
              onMouseEnter={(e) => {
                if (!isActive) e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.06)';
              }}
              onMouseLeave={(e) => {
                if (!isActive) e.currentTarget.style.backgroundColor = 'transparent';
              }}
              title={isCollapsed ? item.label : undefined}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Icon
                  size={17}
                  color={isActive ? '#FFFFFF' : '#94A3B8'}
                  strokeWidth={isActive ? 2.4 : 2}
                  style={{ flexShrink: 0 }}
                />
                {!isCollapsed && <span>{item.label}</span>}
              </div>

              {!isCollapsed && item.badge && (
                <span
                  style={{
                    fontSize: '10px',
                    fontWeight: 700,
                    padding: '1px 6px',
                    borderRadius: '10px',
                    backgroundColor: isActive
                      ? 'rgba(0,0,0,0.2)'
                      : item.badgeColor || 'rgba(255, 255, 255, 0.12)',
                    color: '#FFFFFF'
                  }}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Profile & Logout Section */}
      <div
        style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          paddingTop: '14px',
          marginTop: '10px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}
      >
        <div
          onClick={() => onSelectTab('profile')}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: isCollapsed ? 'center' : 'flex-start',
            gap: '10px',
            padding: '6px 8px',
            borderRadius: '8px',
            cursor: 'pointer',
            backgroundColor: activeTab === 'profile' ? 'rgba(255, 122, 26, 0.15)' : 'rgba(255, 255, 255, 0.03)'
          }}
        >
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: '#079DF2',
              color: '#FFFFFF',
              fontWeight: 800,
              fontSize: '11px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            SJ
          </div>
          {!isCollapsed && (
            <div style={{ overflow: 'hidden' }}>
              <div
                style={{
                  fontSize: '12px',
                  fontWeight: 700,
                  color: '#FFFFFF',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}
              >
                {profile?.name || 'Sarah Jenkins'}
              </div>
              <div style={{ fontSize: '10px', color: '#94A3B8' }}>Customer Account</div>
            </div>
          )}
        </div>

        <button
          onClick={onLogout}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: isCollapsed ? 'center' : 'flex-start',
            gap: '8px',
            width: '100%',
            padding: '8px 10px',
            borderRadius: '6px',
            border: 'none',
            backgroundColor: 'rgba(239, 68, 68, 0.12)',
            color: '#EF4444',
            fontSize: '12px',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'background 0.15s ease'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.22)')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.12)')}
          title="Sign Out"
        >
          <LogOut size={15} color="#EF4444" />
          {!isCollapsed && <span>Sign Out</span>}
        </button>
      </div>
    </aside>
  );
};
