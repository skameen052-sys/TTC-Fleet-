import React from 'react';
import {
  Truck,
  CheckCircle2,
  AlertTriangle,
  Users,
  UserCheck,
  Building2,
  ShoppingBag,
  Package,
  Navigation,
  DollarSign,
  Fuel,
  Wrench
} from 'lucide-react';

export const LiveOperationalFleetPulse = ({ onCardClick }) => {
  const pulseCards = [
    {
      id: 'total-vehicles',
      title: 'Total Vehicles',
      value: '6',
      subtext: 'Heavy haul & transit',
      icon: Truck,
      color: '#f97316',
      target: 'fleet'
    },
    {
      id: 'active-vehicles',
      title: 'Active Vehicles',
      value: '6',
      subtext: 'Currently on road',
      icon: CheckCircle2,
      color: '#10b981',
      target: 'fleet'
    },
    {
      id: 'inactive-vehicles',
      title: 'Inactive Vehicles',
      value: '4',
      subtext: 'Depot / inspection',
      icon: AlertTriangle,
      color: '#ef4444',
      target: 'fleet'
    },
    {
      id: 'total-drivers',
      title: 'Total Drivers',
      value: '4',
      subtext: 'Licensed pilots',
      icon: Users,
      color: '#38bdf8',
      target: 'users'
    },
    {
      id: 'available-drivers',
      title: 'Available Drivers',
      value: '2',
      subtext: 'Ready for allocation',
      icon: UserCheck,
      color: '#2dd4bf',
      target: 'users'
    },
    {
      id: 'total-customers',
      title: 'Total Customers',
      value: '3',
      subtext: 'Active enterprise clients',
      icon: Building2,
      color: '#c084fc',
      target: 'company'
    },
    {
      id: 'total-orders',
      title: 'Total Orders',
      value: '3',
      subtext: 'B2B freight contracts',
      icon: ShoppingBag,
      color: '#f43f5e',
      target: 'fleet'
    },
    {
      id: 'active-shipments',
      title: 'Active Shipments',
      value: '2',
      subtext: 'Consignments in transit',
      icon: Package,
      color: '#fbbf24',
      target: 'fleet'
    },
    {
      id: 'total-trips',
      title: 'Total Trips',
      value: '2',
      subtext: 'Inter-state dispatches',
      icon: Navigation,
      color: '#22d3ee',
      target: 'fleet'
    },
    {
      id: 'revenue-overview',
      title: 'Revenue Overview',
      value: '₹1,47,500',
      subtext: 'Billed & realized turnover',
      icon: DollarSign,
      color: '#10b981',
      target: 'subscriptions'
    },
    {
      id: 'fuel-expenses',
      title: 'Fuel Expenses',
      value: '₹22,179',
      subtext: 'HSD refueling outlays',
      icon: Fuel,
      color: '#fb923c',
      target: 'fleet'
    },
    {
      id: 'maintenance-expenses',
      title: 'Maintenance Expenses',
      value: '₹42,500',
      subtext: 'Workshop & OEM repairs',
      icon: Wrench,
      color: '#f87171',
      target: 'fleet'
    }
  ];

  return (
    <div className="live-pulse-container" style={{ margin: '22px 0' }}>
      {/* Header Row */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '14px'
        }}
      >
        <div>
          <h3
            style={{
              fontSize: '16px',
              fontWeight: 700,
              color: '#FFFFFF',
              margin: '0 0 4px 0',
              letterSpacing: '-0.01em'
            }}
          >
            Live Operational Fleet Pulse
          </h3>
          <p
            style={{
              fontSize: '12px',
              color: '#94a3b8',
              margin: 0
            }}
          >
            Real-time synchronization across fleet, drivers, shipments, and finance
          </p>
        </div>

        {/* Pulsing Live Telemetry Badge */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            borderRadius: '20px',
            padding: '4px 12px',
            fontSize: '11px',
            color: '#10b981',
            fontWeight: 700
          }}
        >
          <span
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: '#10b981',
              boxShadow: '0 0 8px #10b981'
            }}
          />
          <span>Telemetry Live</span>
        </div>
      </div>

      {/* 12 Metric Cards Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '12px'
        }}
      >
        {pulseCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.id}
              onClick={() => onCardClick && onCardClick(card.target)}
              style={{
                backgroundColor: 'rgba(19, 27, 46, 0.75)',
                border: '1px solid rgba(255, 255, 255, 0.07)',
                borderRadius: '12px',
                padding: '14px 16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                backdropFilter: 'blur(8px)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255, 122, 26, 0.35)';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.backgroundColor = 'rgba(24, 34, 58, 0.9)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.07)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.backgroundColor = 'rgba(19, 27, 46, 0.75)';
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <span
                  style={{
                    fontSize: '11.5px',
                    color: '#94a3b8',
                    fontWeight: 600
                  }}
                >
                  {card.title}
                </span>
                <div
                  style={{
                    width: '26px',
                    height: '26px',
                    borderRadius: '6px',
                    backgroundColor: `${card.color}18`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Icon size={14} color={card.color} strokeWidth={2.2} />
                </div>
              </div>

              <div
                style={{
                  fontSize: '19px',
                  fontWeight: 800,
                  color: '#FFFFFF',
                  letterSpacing: '-0.02em'
                }}
              >
                {card.value}
              </div>

              <div
                style={{
                  fontSize: '10.5px',
                  color: '#64748b',
                  fontWeight: 500,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}
              >
                {card.subtext}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
