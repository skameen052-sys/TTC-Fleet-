import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Truck,
  UserCheck,
  MapPin,
  Navigation,
  Wrench,
  ShoppingBag,
  Package,
  Compass,
  Warehouse,
  Fuel,
  FileText,
  CreditCard,
  BarChart3,
  Bell,
  Users,
  ShieldCheck,
  Building2,
  Briefcase,
  Crown,
  Sliders,
  ClipboardList,
  Settings,
  User,
  LogOut,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import sidebarTruckImg from '../assets/sidebar-truck.jpg';

export const Sidebar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const navSections = [
    {
      title: 'OVERVIEW',
      items: [
        { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
      ],
    },
    {
      title: 'FLEET & ASSETS',
      items: [
        { name: 'Fleet Management', path: '/fleet', icon: Truck },
        { name: 'Driver Management', path: '/drivers', icon: UserCheck },
        { name: 'GPS Tracking', path: '/gps-tracking', icon: MapPin },
        { name: 'Route Management', path: '/routes', icon: Navigation },
        { name: 'Maintenance', path: '/maintenance', icon: Wrench },
      ],
    },
    {
      title: 'LOGISTICS & TRIPS',
      items: [
        { name: 'Customer Management', path: '/customers', icon: Users },
        { name: 'Order Management', path: '/orders', icon: ShoppingBag },
        { name: 'Shipment Management', path: '/shipments', icon: Package },
        { name: 'Trip Management', path: '/trips', icon: Compass },
        { name: 'Warehouse & Stock', path: '/warehouses', icon: Warehouse },
      ],
    },
    {
      title: 'FINANCE',
      items: [
        { name: 'Fuel Management', path: '/fuel', icon: Fuel },
        { name: 'Billing & Invoices', path: '/billing', icon: FileText },
        { name: 'Payment Transactions', path: '/payments', icon: CreditCard },
      ],
    },
    {
      title: 'SYSTEM & REPORTS',
      items: [
        { name: 'Reports & Analytics', path: '/reports', icon: BarChart3 },
        { name: 'Notifications', path: '/notifications', icon: Bell },
        { name: 'User Management', path: '/users', icon: Users },
        { name: 'Role & Permissions', path: '/roles', icon: ShieldCheck },
        { name: 'Branch Management', path: '/branches', icon: Building2 },
        { name: 'Company Profile', path: '/company', icon: Briefcase },
        { name: 'Subscriptions', path: '/subscriptions', icon: Crown },
        { name: 'Configuration', path: '/configuration', icon: Sliders },
        { name: 'Audit Logs', path: '/audit-logs', icon: ClipboardList },
        { name: 'Settings', path: '/settings', icon: Settings },
        { name: 'My Profile', path: '/profile', icon: User },
      ],
    },
  ];

  return (
    <aside
      className="dashboard-sidebar"
      style={{
        overflowY: 'auto',
        scrollbarWidth: 'thin',
        scrollbarColor: 'rgba(255,255,255,0.1) transparent',
      }}
    >
      <div>
        {/* Brand Header */}
        <div className="sidebar-brand-block">
          <div className="brand-row" onClick={() => navigate('/dashboard')} style={{ cursor: 'pointer' }}>
            <div className="brand-icon-truck">
              <Truck size={20} strokeWidth={2.5} />
            </div>
            <div className="brand-name">
              TTC <span>Fleet360</span>
            </div>
          </div>
          <div className="brand-tagline">Logistics & Fleet Management</div>
        </div>

        {/* Categorized Navigation */}
        <nav className="sidebar-nav-list" style={{ overflowY: 'visible' }}>
          {navSections.map((sec) => (
            <div key={sec.title} style={{ marginBottom: '14px' }}>
              <div
                style={{
                  fontSize: '10.5px',
                  fontWeight: 700,
                  color: '#64748b',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  padding: '6px 12px 4px 12px',
                }}
              >
                {sec.title}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {sec.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      className={({ isActive }) =>
                        `sidebar-nav-item ${isActive ? 'active' : ''}`
                      }
                      style={{ padding: '8px 12px', fontSize: '13px' }}
                    >
                      <Icon size={16} className="nav-icon" />
                      <span>{item.name}</span>
                    </NavLink>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </div>

      <div style={{ marginTop: '20px' }}>
        {/* Promotional sidebar card */}
        <div className="sidebar-promo-card">
          <img
            src={sidebarTruckImg}
            alt="Logistics Operations"
            className="sidebar-promo-img"
          />
          <div className="sidebar-promo-title">
            Smarter Logistics. Stronger Operations.
          </div>
          <button
            className="sidebar-promo-btn"
            onClick={() => navigate('/subscriptions')}
          >
            <span>TTC Fleet360</span>
            <ArrowRight size={12} />
          </button>
        </div>

        {/* Logout button */}
        <button className="sidebar-logout-btn" onClick={logout}>
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};
