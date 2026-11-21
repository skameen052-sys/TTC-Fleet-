import React from 'react';
import {
  Users,
  MapPin,
  Truck,
  Crown,
  TrendingUp,
  ArrowUpRight
} from 'lucide-react';

export const WelcomeHeroBanner = ({ metrics, onCardClick }) => {
  const kpiData = [
    {
      id: 'users',
      label: 'Total Users',
      value: '120',
      trend: '12%',
      icon: Users,
      iconClass: 'kpi-icon-orange',
      color: '#f97316',
      sparklineColor: '#f97316',
      target: 'users'
    },
    {
      id: 'branches',
      label: 'Total Branches',
      value: '12',
      trend: '8%',
      icon: MapPin,
      iconClass: 'kpi-icon-blue',
      color: '#0ea5e9',
      sparklineColor: '#0ea5e9',
      target: 'branches'
    },
    {
      id: 'fleet',
      label: 'Active Fleet',
      value: '6',
      trend: '5%',
      icon: Truck,
      iconClass: 'kpi-icon-green',
      color: '#10b981',
      sparklineColor: '#10b981',
      target: 'fleet'
    },
    {
      id: 'subscriptions',
      label: 'Subscriptions',
      value: '95',
      trend: '10%',
      icon: Crown,
      iconClass: 'kpi-icon-purple',
      color: '#a855f7',
      sparklineColor: '#a855f7',
      target: 'subscriptions'
    }
  ];

  return (
    <div className="hero-greeting-banner">
      {/* Left Column: Heading & 4 KPI Stat Cards */}
      <div className="hero-left-col">
        <div className="hero-title-wrap">
          <h1 className="hero-heading">
            Welcome back, <span className="name-gradient">Admin!</span>
          </h1>
          <p className="hero-subtitle">
            Drive smarter. Manage better with TTC Fleet360.
          </p>
        </div>

        {/* 4 KPI Cards Grid */}
        <div className="kpi-cards-grid">
          {kpiData.map((kpi) => {
            const Icon = kpi.icon;
            return (
              <div
                key={kpi.id}
                className="kpi-stat-card"
                onClick={() => onCardClick && onCardClick(kpi.target)}
                style={{ cursor: 'pointer' }}
              >
                <div className="kpi-top-row">
                  <div className={`kpi-icon-pill ${kpi.iconClass}`}>
                    <Icon size={18} strokeWidth={2.4} />
                  </div>
                </div>

                <div>
                  <div className="kpi-metric-value">{kpi.value}</div>
                  <div className="kpi-metric-label">{kpi.label}</div>
                </div>

                <div className="kpi-trend-row">
                  <div className="kpi-trend-badge" style={{ color: kpi.color }}>
                    <TrendingUp size={13} />
                    <span>{kpi.trend}</span>
                  </div>

                  {/* SVG Trend Wave */}
                  <svg className="kpi-sparkline" viewBox="0 0 60 20" fill="none">
                    <path
                      d="M2 16 C 12 16, 16 12, 24 13 C 32 14, 36 6, 44 8 C 50 10, 54 4, 58 3"
                      stroke={kpi.sparklineColor}
                      strokeWidth="2.2"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right Column: 360° Logistics Hero Image Card matching Screenshot 2 */}
      <div className="hero-visual-card">
        <div style={{ position: 'relative', width: '100%', height: '100%', minHeight: '230px', borderRadius: '16px', overflow: 'hidden' }}>
          <img
            src="/assets/hero-orange-truck.jpg"
            alt="TTC Fleet360 Global Logistics 360 Orange Truck"
            className="hero-truck-image"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center center',
              borderRadius: '16px',
              display: 'block'
            }}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/assets/dashboard-truck-hero.jpg';
            }}
          />

          {/* 360 Telemetry Overlay Tag */}
          <div
            style={{
              position: 'absolute',
              bottom: '12px',
              left: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(10, 14, 23, 0.75)',
              backdropFilter: 'blur(8px)',
              padding: '4px 10px',
              borderRadius: '20px',
              border: '1px solid rgba(255, 122, 26, 0.4)',
              fontSize: '11px',
              color: '#FF9E4A',
              fontWeight: 700
            }}
          >
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
            <span>GLOBAL LOGISTICS 360°</span>
          </div>
        </div>
      </div>
    </div>
  );
};
