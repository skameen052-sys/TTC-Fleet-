import React from 'react';
import { ArrowUpRight } from 'lucide-react';

export const StatCard = ({ icon: Icon, colorTheme, value, label, growthPercent }) => {
  const getThemeStyles = () => {
    switch (colorTheme) {
      case 'orange':
        return {
          pillClass: 'kpi-icon-orange',
          strokeColor: '#f97316',
          textColor: '#f97316',
        };
      case 'blue':
        return {
          pillClass: 'kpi-icon-blue',
          strokeColor: '#0ea5e9',
          textColor: '#0ea5e9',
        };
      case 'green':
        return {
          pillClass: 'kpi-icon-green',
          strokeColor: '#10b981',
          textColor: '#10b981',
        };
      case 'purple':
      default:
        return {
          pillClass: 'kpi-icon-purple',
          strokeColor: '#a855f7',
          textColor: '#a855f7',
        };
    }
  };

  const theme = getThemeStyles();

  return (
    <div className="kpi-stat-card">
      <div>
        <div className="kpi-top-row">
          <div className={`kpi-icon-pill ${theme.pillClass}`}>
            <Icon size={18} strokeWidth={2.2} />
          </div>
        </div>

        <div className="kpi-metric-value">{value}</div>
        <div className="kpi-metric-label">{label}</div>
      </div>

      <div className="kpi-trend-row">
        <div className="kpi-trend-badge" style={{ color: theme.textColor }}>
          <ArrowUpRight size={14} />
          <span>{growthPercent > 0 ? `${growthPercent}%` : `${growthPercent}%`}</span>
        </div>

        {/* Custom Mini Sparkline SVG */}
        <svg className="kpi-sparkline" viewBox="0 0 52 20" fill="none">
          <path
            d="M 2 16 Q 14 4, 26 12 T 50 4"
            stroke={theme.strokeColor}
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </div>
    </div>
  );
};
