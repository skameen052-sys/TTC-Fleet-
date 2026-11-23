import React, { useState } from 'react';
import {
  Wrench,
  Search,
  Bell,
  Calendar,
  PlusCircle,
  ShieldCheck,
  ChevronDown,
  Layers,
  Truck,
  Shield,
  Users,
  LogOut,
  Activity
} from 'lucide-react';

export const MaintenanceHeader = ({
  activeTabTitle = 'Maintenance Dashboard',
  searchQuery,
  onSearchChange,
  unreadAlertsCount = 3,
  onScheduleService,
  onLogout,
  onSwitchPortal,
  currentUser
}) => {
  const [isPortalMenuOpen, setIsPortalMenuOpen] = useState(false);
  const [isAlertsOpen, setIsAlertsOpen] = useState(false);

  const maintenanceAlerts = [
    { id: 1, title: 'Front Brake Wear Critical', vehicle: 'TTC-7203-DV', time: '18m ago', type: 'danger' },
    { id: 2, title: 'PM Service A Due (1,420 km)', vehicle: 'TTC-8492-HD', time: '1h ago', type: 'warning' },
    { id: 3, title: 'PUC & Fitness Renewal Pending', vehicle: 'TTC-5520-RF', time: '3h ago', type: 'info' }
  ];

  return (
    <header className="fleet-header" style={{ position: 'sticky', top: 0, zIndex: 40, borderBottom: '1px solid #E5EAF2' }}>
      <div className="header-inner">
        {/* Left Column: Title & Live Diagnostic Tag */}
        <div className="header-left-col">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h1 className="header-page-title" style={{ fontSize: '20px', fontWeight: '800', color: '#14213D', margin: 0 }}>
              {activeTabTitle}
            </h1>
            <span
              style={{
                backgroundColor: '#ECFDF5',
                color: '#065F46',
                border: '1px solid #A7F3D0',
                padding: '3px 9px',
                borderRadius: '16px',
                fontSize: '11px',
                fontWeight: '700',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px'
              }}
            >
              <Activity size={12} color="#059669" />
              <span>OBD-II LIVE</span>
            </span>
          </div>
          <div className="header-subtitle-row" style={{ fontSize: '12px', color: '#64748B', marginTop: '2px' }}>
            Workshop Bays • Preventive Overhauls • Health Telematics
          </div>
        </div>

        {/* Right Column: Search, Schedule Button, Portal Switcher & Profile */}
        <div className="header-right-col" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Search Box */}
          <div className="header-search-box" style={{ position: 'relative', width: '220px' }}>
            <Search
              size={15}
              color="#94A3B8"
              style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }}
            />
            <input
              type="text"
              placeholder="Search vehicles, work orders..."
              value={searchQuery || ''}
              onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
              style={{
                width: '100%',
                padding: '7px 12px 7px 32px',
                fontSize: '12.5px',
                border: '1px solid #E2E8F0',
                borderRadius: '20px',
                backgroundColor: '#F8FAFC',
                outline: 'none'
              }}
            />
          </div>

          {/* Quick Schedule Button */}
          {onScheduleService && (
            <button
              onClick={onScheduleService}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                backgroundColor: '#F59E0B',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '8px',
                padding: '7px 14px',
                fontSize: '12.5px',
                fontWeight: '700',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(245, 158, 11, 0.35)'
              }}
            >
              <PlusCircle size={15} />
              <span>Schedule Service</span>
            </button>
          )}

          {/* Alerts Bell */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setIsAlertsOpen(!isAlertsOpen)}
              style={{
                position: 'relative',
                background: '#F1F5F9',
                border: '1px solid #E2E8F0',
                borderRadius: '50%',
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
              title="Maintenance Alerts"
            >
              <Bell size={17} color="#1E293B" />
              {unreadAlertsCount > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '-2px',
                    right: '-2px',
                    backgroundColor: '#EF4444',
                    color: '#FFFFFF',
                    borderRadius: '50%',
                    width: '17px',
                    height: '17px',
                    fontSize: '10px',
                    fontWeight: '800',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '2px solid #FFFFFF'
                  }}
                >
                  {unreadAlertsCount}
                </span>
              )}
            </button>

            {isAlertsOpen && (
              <div
                style={{
                  position: 'absolute',
                  right: 0,
                  top: '46px',
                  width: '300px',
                  backgroundColor: '#FFFFFF',
                  borderRadius: '12px',
                  boxShadow: '0 12px 30px rgba(0,0,0,0.15)',
                  border: '1px solid #E2E8F0',
                  padding: '12px',
                  zIndex: 100
                }}
              >
                <div style={{ fontWeight: '700', fontSize: '13px', marginBottom: '8px', color: '#0F172A' }}>
                  Maintenance & Inspection Alerts
                </div>
                {maintenanceAlerts.map((a) => (
                  <div
                    key={a.id}
                    style={{
                      padding: '8px',
                      borderBottom: '1px solid #F1F5F9',
                      fontSize: '12px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '2px'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '600', color: '#1E293B' }}>
                      <span>{a.title}</span>
                      <span style={{ fontSize: '10px', color: '#94A3B8' }}>{a.time}</span>
                    </div>
                    <span style={{ fontSize: '11px', color: '#64748B' }}>Asset: {a.vehicle}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 1-Click Portal Switcher Dropdown Pill */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setIsPortalMenuOpen(!isPortalMenuOpen)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                backgroundColor: 'rgba(245, 158, 11, 0.1)',
                border: '1px solid rgba(245, 158, 11, 0.4)',
                borderRadius: '20px',
                padding: '6px 14px',
                fontSize: '12.5px',
                fontWeight: '700',
                color: '#D97706',
                cursor: 'pointer'
              }}
            >
              <Wrench size={14} color="#D97706" />
              <span>Maintenance OS</span>
              <ChevronDown size={13} color="#D97706" />
            </button>

            {isPortalMenuOpen && (
              <div
                style={{
                  position: 'absolute',
                  right: 0,
                  top: '44px',
                  width: '240px',
                  backgroundColor: '#FFFFFF',
                  borderRadius: '12px',
                  boxShadow: '0 12px 30px rgba(0,0,0,0.15)',
                  border: '1px solid #E2E8F0',
                  padding: '8px',
                  zIndex: 100
                }}
              >
                <div style={{ padding: '6px 10px', fontSize: '11px', fontWeight: '700', color: '#94A3B8', textTransform: 'uppercase' }}>
                  Switch Application Portal
                </div>

                <button
                  onClick={() => {
                    setIsPortalMenuOpen(false);
                    onSwitchPortal && onSwitchPortal('admin');
                  }}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '8px 10px',
                    borderRadius: '8px',
                    border: 'none',
                    background: 'transparent',
                    cursor: 'pointer',
                    textAlign: 'left',
                    fontSize: '12.5px',
                    color: '#0F172A',
                    fontWeight: '600'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#FFF0E5')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <Shield size={16} color="#FF7A1A" />
                  <span>Admin Dashboard</span>
                </button>

                <button
                  onClick={() => {
                    setIsPortalMenuOpen(false);
                    onSwitchPortal && onSwitchPortal('manager');
                  }}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '8px 10px',
                    borderRadius: '8px',
                    border: 'none',
                    background: 'transparent',
                    cursor: 'pointer',
                    textAlign: 'left',
                    fontSize: '12.5px',
                    color: '#0F172A',
                    fontWeight: '600'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#EFF6FF')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <Truck size={16} color="#00A3FF" />
                  <span>Fleet Manager Dashboard</span>
                </button>

                <button
                  onClick={() => {
                    setIsPortalMenuOpen(false);
                    onSwitchPortal && onSwitchPortal('driver');
                  }}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '8px 10px',
                    borderRadius: '8px',
                    border: 'none',
                    background: 'transparent',
                    cursor: 'pointer',
                    textAlign: 'left',
                    fontSize: '12.5px',
                    color: '#0F172A',
                    fontWeight: '600'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#ECFDF5')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <Users size={16} color="#10B981" />
                  <span>Driver Portal Dashboard</span>
                </button>
              </div>
            )}
          </div>

          {/* User Profile Avatar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: '6px' }}>
            <div
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '50%',
                backgroundColor: '#F59E0B',
                color: '#FFFFFF',
                fontWeight: '800',
                fontSize: '13px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              DK
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.2 }}>
              <span style={{ fontSize: '12.5px', fontWeight: '700', color: '#1E293B' }}>
                {currentUser?.fullName || 'Dave Kowalski'}
              </span>
              <span style={{ fontSize: '10.5px', color: '#64748B' }}>Master Tech Lead</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
