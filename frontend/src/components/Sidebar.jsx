import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  ShieldCheck,
  Building2,
  Briefcase,
  CreditCard,
  Sliders,
  ClipboardList,
  Settings,
  LogOut,
  Truck,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import sidebarTruckImg from '../assets/sidebar-truck.jpg';

export const Sidebar = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'User Management', path: '/users', icon: Users },
    { name: 'Role & Permissions', path: '/roles', icon: ShieldCheck },
    { name: 'Branch Management', path: '/branches', icon: Building2 },
    { name: 'Company Profile', path: '/company', icon: Briefcase },
    { name: 'Subscription Management', path: '/subscriptions', icon: CreditCard },
    { name: 'Configuration', path: '/configuration', icon: Sliders },
    { name: 'Audit Logs', path: '/audit-logs', icon: ClipboardList },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <aside className="dashboard-sidebar">
      <div>
        {/* Brand Header */}
        <div className="sidebar-brand-block">
          <div className="brand-row">
            <div className="brand-icon-truck">
              <Truck size={20} strokeWidth={2.5} />
            </div>
            <div className="brand-name">
              TTC <span>Fleet360</span>
            </div>
          </div>
          <div className="brand-tagline">Logistics & Fleet Management</div>
        </div>

        {/* Navigation links */}
        <nav className="sidebar-nav-list">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `sidebar-nav-item ${isActive ? 'active' : ''}`
                }
              >
                <Icon size={18} className="nav-icon" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      <div>
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
