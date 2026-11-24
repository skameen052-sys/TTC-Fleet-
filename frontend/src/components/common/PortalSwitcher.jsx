import React, { useState, useRef, useEffect } from 'react';
import {
  Shield,
  Truck,
  User,
  Package,
  Boxes,
  Building2,
  CreditCard,
  ChevronDown,
  Check
} from 'lucide-react';

const PORTAL_CONFIG = [
  {
    id: 'admin',
    label: 'Super Admin',
    desc: 'Executive Control & Security',
    icon: Shield,
    color: '#FF7A1A',
    bg: 'rgba(255, 122, 26, 0.15)',
    border: 'rgba(255, 122, 26, 0.35)'
  },
  {
    id: 'manager',
    label: 'Fleet Manager',
    desc: 'Telematics, Fuel & Bay Maintenance',
    icon: Truck,
    color: '#00d2ff',
    bg: 'rgba(0, 210, 255, 0.15)',
    border: 'rgba(0, 210, 255, 0.35)'
  },
  {
    id: 'driver',
    label: 'Driver Portal',
    desc: 'Trip Dispatch & e-POD HUD',
    icon: User,
    color: '#10b981',
    bg: 'rgba(16, 185, 129, 0.15)',
    border: 'rgba(16, 185, 129, 0.35)'
  },
  {
    id: 'warehouse',
    label: 'Warehouse (WMS)',
    desc: 'Stock Receiving & Cross-Dock Loading',
    icon: Package,
    color: '#a855f7',
    bg: 'rgba(168, 85, 247, 0.15)',
    border: 'rgba(168, 85, 247, 0.35)'
  },
  {
    id: 'logistics',
    label: 'Logistics (LOS)',
    desc: 'Freight Pipeline & Linehaul Routes',
    icon: Boxes,
    color: '#f97316',
    bg: 'rgba(249, 115, 22, 0.15)',
    border: 'rgba(249, 115, 22, 0.35)'
  },
  {
    id: 'customer',
    label: 'Customer Portal',
    desc: 'Book Freight & Settle Invoices',
    icon: Building2,
    color: '#38bdf8',
    bg: 'rgba(56, 189, 248, 0.15)',
    border: 'rgba(56, 189, 248, 0.35)'
  },
  {
    id: 'billing',
    label: 'Billing & Finance',
    desc: 'Invoices, Payments & Cashflow',
    icon: CreditCard,
    color: '#60a5fa',
    bg: 'rgba(96, 165, 250, 0.15)',
    border: 'rgba(96, 165, 250, 0.35)'
  }
];

export const PortalSwitcher = ({ currentPortal = 'admin', onSwitchPortal }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const activePortal = PORTAL_CONFIG.find(p => p.id === currentPortal) || PORTAL_CONFIG[0];
  const ActiveIcon = activePortal.icon;

  if (!onSwitchPortal) return null;

  return (
    <div ref={containerRef} style={{ position: 'relative', display: 'inline-block', zIndex: 90 }}>
      {/* Switcher Pill Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: activePortal.bg,
          border: `1.5px solid ${activePortal.border}`,
          color: activePortal.color,
          padding: '6px 13px',
          borderRadius: '20px',
          fontSize: '12px',
          fontWeight: 700,
          cursor: 'pointer',
          boxShadow: `0 2px 10px ${activePortal.bg}`,
          transition: 'all 0.15s ease',
          whiteSpace: 'nowrap'
        }}
        title="Switch to any Fleet360 Workspace Portal"
      >
        <ActiveIcon size={14} color={activePortal.color} />
        <span>{activePortal.label}</span>
        <ChevronDown size={12} color={activePortal.color} style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s ease' }} />
      </button>

      {/* 7-Portal Dropdown Menu */}
      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            right: 0,
            width: '270px',
            background: '#0e1626',
            border: '1px solid rgba(255, 255, 255, 0.14)',
            borderRadius: '12px',
            padding: '8px',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.75)',
            zIndex: 9999
          }}
        >
          <div
            style={{
              fontSize: '11px',
              color: '#94a3b8',
              fontWeight: 700,
              padding: '6px 10px',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              marginBottom: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <span>Switch Fleet360 Portal</span>
            <span style={{ fontSize: '10px', color: '#64748b' }}>7 Portals</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', maxHeight: '360px', overflowY: 'auto' }}>
            {PORTAL_CONFIG.map((p) => {
              const Icon = p.icon;
              const isActive = p.id === currentPortal;

              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    onSwitchPortal(p.id);
                  }}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '8px 10px',
                    background: isActive ? p.bg : 'transparent',
                    border: isActive ? `1px solid ${p.border}` : '1px solid transparent',
                    borderRadius: '8px',
                    color: isActive ? p.color : '#e2e8f0',
                    fontSize: '12.5px',
                    fontWeight: isActive ? 700 : 500,
                    cursor: 'pointer',
                    transition: 'background 0.12s ease',
                    textAlign: 'left'
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) e.currentTarget.style.background = 'transparent';
                  }}
                >
                  <div
                    style={{
                      width: '26px',
                      height: '26px',
                      borderRadius: '6px',
                      background: p.bg,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}
                  >
                    <Icon size={14} color={p.color} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '12px', fontWeight: isActive ? 700 : 600, color: isActive ? p.color : '#f1f5f9', whiteSpace: 'nowrap' }}>
                      {p.label}
                    </div>
                    <div style={{ fontSize: '10.5px', color: '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {p.desc}
                    </div>
                  </div>
                  {isActive && (
                    <span
                      style={{
                        fontSize: '9.5px',
                        background: p.color,
                        color: '#ffffff',
                        padding: '1px 5px',
                        borderRadius: '4px',
                        fontWeight: 700,
                        flexShrink: 0
                      }}
                    >
                      Active
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
