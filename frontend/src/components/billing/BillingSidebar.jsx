import React from 'react';
import {
  LayoutDashboard,
  Receipt,
  FileText,
  CreditCard,
  Users,
  RotateCcw,
  Truck,
  TrendingDown,
  TrendingUp,
  Percent,
  BarChart3,
  History,
  Bell,
  User,
  ArrowRight,
  Shield,
  DollarSign
} from 'lucide-react';

export const billingNavItems = [
  // 1. Overview
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, category: 'Overview' },

  // 2. Billing & Invoicing
  { id: 'billing-management', label: 'Billing Management', icon: Receipt, badge: '4 Bills', category: 'Receivables & Payables' },
  { id: 'invoice-management', label: 'Invoice Management', icon: FileText, badge: '5 Invoices', category: 'Receivables & Payables' },
  { id: 'payment-management', label: 'Payment Management', icon: CreditCard, badge: 'Live', category: 'Receivables & Payables' },
  { id: 'customer-payments', label: 'Customer Payments', icon: Users, category: 'Receivables & Payables' },
  { id: 'refund-management', label: 'Refund Management', icon: RotateCcw, badge: '1 Due', category: 'Receivables & Payables' },

  // 3. Operations & Charges
  { id: 'transport-charges', label: 'Transportation Charges', icon: Truck, category: 'Cost & Tariffs' },
  { id: 'expense-management', label: 'Expense Management', icon: TrendingDown, badge: '6 Outlays', category: 'Cost & Tariffs' },
  { id: 'revenue-management', label: 'Revenue Management', icon: TrendingUp, category: 'Cost & Tariffs' },
  { id: 'tax-management', label: 'Tax Management', icon: Percent, badge: 'GST 18%', category: 'Cost & Tariffs' },

  // 4. Intelligence & Audit
  { id: 'financial-reports', label: 'Financial Reports', icon: BarChart3, category: 'Reports & Governance' },
  { id: 'transaction-history', label: 'Transaction History', icon: History, category: 'Reports & Governance' },
  { id: 'notifications', label: 'Notifications', icon: Bell, badge: '3 Unread', category: 'Reports & Governance' },
  { id: 'profile', label: 'My Profile', icon: User, category: 'Reports & Governance' }
];

export const BillingSidebar = ({ activeTab, onSelectTab, onLogout, onSwitchPortal }) => {
  const categories = [
    'Overview',
    'Receivables & Payables',
    'Cost & Tariffs',
    'Reports & Governance'
  ];

  return (
    <aside
      className="dashboard-sidebar"
      style={{
        width: '260px',
        background: '#0a0f1d',
        borderRight: '1px solid rgba(255, 255, 255, 0.08)',
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        position: 'sticky',
        top: 0,
        overflow: 'hidden',
        padding: '20px 14px',
        flexShrink: 0,
        zIndex: 50
      }}
    >
      {/* 1. Brand Block */}
      <div style={{ padding: '0 4px 16px 4px', marginBottom: '12px', borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #2563eb, #0284c7)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(37, 99, 235, 0.4)'
            }}
          >
            <DollarSign size={20} color="#ffffff" strokeWidth={2.4} />
          </div>
          <div>
            <div style={{ fontSize: '18px', fontWeight: 800, color: '#fff', letterSpacing: '-0.3px' }}>
              TTC Fleet<span style={{ color: '#38bdf8' }}>360</span>
            </div>
            <div style={{ fontSize: '10.5px', color: '#94a3b8', fontWeight: 600 }}>
              Billing & Finance Manager
            </div>
          </div>
        </div>
      </div>

      {/* 2. Scrollable Navigation (14 Modules) */}
      <nav
        style={{
          flex: 1,
          minHeight: 0,
          overflowY: 'auto',
          paddingRight: '4px',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px'
        }}
      >
        {categories.map((category) => {
          const items = billingNavItems.filter((item) => item.category === category);
          return (
            <div key={category} style={{ marginBottom: '8px' }}>
              <div
                style={{
                  fontSize: '10px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.6px',
                  color: '#64748b',
                  padding: '6px 10px 4px',
                  userSelect: 'none'
                }}
              >
                {category}
              </div>
              {items.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onSelectTab(item.id)}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      background: isActive ? 'rgba(37, 99, 235, 0.15)' : 'transparent',
                      borderLeft: isActive ? '3px solid #38bdf8' : '3px solid transparent',
                      borderTop: 'none',
                      borderRight: 'none',
                      borderBottom: 'none',
                      cursor: 'pointer',
                      padding: '8px 12px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      borderRadius: '6px',
                      marginBottom: '2px',
                      transition: 'all 0.15s ease'
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) e.currentTarget.style.background = 'transparent';
                    }}
                  >
                    <Icon
                      size={16}
                      color={isActive ? '#38bdf8' : '#94a3b8'}
                      strokeWidth={isActive ? 2.4 : 2}
                    />
                    <span
                      style={{
                        flex: 1,
                        fontSize: '12.5px',
                        fontWeight: isActive ? 600 : 500,
                        color: isActive ? '#ffffff' : '#cbd5e1'
                      }}
                    >
                      {item.label}
                    </span>
                    {item.badge && !isActive && (
                      <span
                        style={{
                          fontSize: '10px',
                          fontWeight: 700,
                          padding: '2px 6px',
                          borderRadius: '8px',
                          background: item.badge === 'Live' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255,255,255,0.06)',
                          color: item.badge === 'Live' ? '#10b981' : '#94a3b8'
                        }}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          );
        })}
      </nav>

      {/* 3. Bottom Section: Workspace Switchers & Status */}
      <div style={{ paddingTop: '12px', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
        {onSwitchPortal && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginBottom: '8px' }}>
            <button
              onClick={() => onSwitchPortal('admin')}
              style={{
                background: 'rgba(255, 122, 26, 0.08)',
                border: '1px solid rgba(255, 122, 26, 0.25)',
                color: '#FF9E4A',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 10px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '11px',
                fontWeight: 600
              }}
              title="Switch to Admin Portal"
            >
              <Shield size={13} color="#FF7A1A" />
              <span>Admin Portal</span>
            </button>
            <button
              onClick={() => onSwitchPortal('manager')}
              style={{
                background: 'rgba(0, 210, 255, 0.08)',
                border: '1px solid rgba(0, 210, 255, 0.25)',
                color: '#00d2ff',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 10px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '11px',
                fontWeight: 600
              }}
              title="Switch to Fleet Manager"
            >
              <Truck size={13} color="#00d2ff" />
              <span>Fleet Manager</span>
            </button>
          </div>
        )}

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '10.5px',
            color: '#64748b',
            padding: '4px 6px'
          }}
        >
          <span>TTC Finance OS</span>
          <span style={{ color: '#10b981' }}>● Vault Active</span>
        </div>
      </div>
    </aside>
  );
};
