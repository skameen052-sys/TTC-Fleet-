import React, { useState } from 'react';
import {
  BarChart2,
  MapPin,
  Clock,
  ArrowRight,
  User,
  Building,
  CreditCard,
  Settings,
  ChevronDown
} from 'lucide-react';

export const MiddleRowGrid = ({ onNavigate }) => {
  const [selectedRange, setSelectedRange] = useState('Last 6 Months');

  // Chart data points
  // Jun, Jul, Aug, Sep, Oct, Nov
  const months = ['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov'];
  const totalTrips = [45, 62, 70, 78, 72, 86]; // scaled up to 100
  const onTimeDelivery = [38, 52, 60, 72, 68, 80];

  return (
    <div className="dashboard-grid-3col">
      {/* 1. Fleet Performance Chart Card */}
      <div className="dashboard-card">
        <div className="card-header-row">
          <div className="card-title">
            <BarChart2 size={16} color="#f97316" />
            <span>Fleet Performance</span>
          </div>
          <div className="card-select-pill" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span>{selectedRange}</span>
            <ChevronDown size={11} />
          </div>
        </div>

        {/* Legend */}
        <div className="chart-legend-row">
          <div className="chart-legend-item">
            <span className="legend-dot dot-orange" />
            <span>Total Trips</span>
          </div>
          <div className="chart-legend-item">
            <span className="legend-dot dot-blue" />
            <span>On Time Delivery</span>
          </div>
        </div>

        {/* SVG Interactive Line Chart matching Screenshot 2 */}
        <div className="chart-canvas-wrapper" style={{ position: 'relative', width: '100%', height: '180px' }}>
          <svg viewBox="0 0 340 160" style={{ width: '100%', height: '100%' }}>
            {/* Horizontal Grid lines */}
            <line x1="30" y1="20" x2="330" y2="20" stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />
            <text x="5" y="24" fill="#64748b" fontSize="9">100</text>

            <line x1="30" y1="55" x2="330" y2="55" stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />
            <text x="10" y="59" fill="#64748b" fontSize="9">75</text>

            <line x1="30" y1="90" x2="330" y2="90" stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />
            <text x="10" y="94" fill="#64748b" fontSize="9">50</text>

            <line x1="30" y1="125" x2="330" y2="125" stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />
            <text x="10" y="129" fill="#64748b" fontSize="9">25</text>

            <line x1="30" y1="145" x2="330" y2="145" stroke="rgba(255,255,255,0.12)" />
            <text x="15" y="148" fill="#64748b" fontSize="9">0</text>

            {/* X-Axis Month Labels */}
            {months.map((m, idx) => (
              <text key={m} x={50 + idx * 52} y="157" fill="#94a3b8" fontSize="9.5" textAnchor="middle">
                {m}
              </text>
            ))}

            {/* On Time Delivery Line (Blue) */}
            <path
              d="M 50 105 L 102 85 L 154 75 L 206 58 L 258 64 L 310 46"
              fill="none"
              stroke="#0ea5e9"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* On Time Dots */}
            {[[50, 105], [102, 85], [154, 75], [206, 58], [258, 64], [310, 46]].map(([x, y], i) => (
              <circle key={i} cx={x} cy={y} r="3.5" fill="#0ea5e9" stroke="#0a0e17" strokeWidth="1.5" />
            ))}

            {/* Total Trips Line (Orange) */}
            <path
              d="M 50 96 L 102 72 L 154 62 L 206 48 L 258 52 L 310 32"
              fill="none"
              stroke="#f97316"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Total Trips Dots */}
            {[[50, 96], [102, 72], [154, 62], [206, 48], [258, 52], [310, 32]].map(([x, y], i) => (
              <circle key={i} cx={x} cy={y} r="3.5" fill="#f97316" stroke="#0a0e17" strokeWidth="1.5" />
            ))}
          </svg>
        </div>
      </div>

      {/* 2. Branch Distribution Card */}
      <div className="dashboard-card">
        <div className="card-header-row">
          <div className="card-title">
            <MapPin size={16} color="#f97316" />
            <span>Branch Distribution</span>
          </div>
        </div>

        <div className="branch-dist-container">
          {/* Futuristic 3D Route Map of India */}
          <div style={{ width: '130px', height: '160px', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg viewBox="0 0 140 170" style={{ width: '100%', height: '100%', filter: 'drop-shadow(0 0 10px rgba(0, 163, 255, 0.25))' }}>
              <defs>
                <linearGradient id="mapGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#1e293b" />
                  <stop offset="100%" stopColor="#0f172a" />
                </linearGradient>
                <linearGradient id="routeOrange" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f97316" />
                  <stop offset="100%" stopColor="#ea580c" />
                </linearGradient>
              </defs>

              {/* Simplified stylized outline of India */}
              <path
                d="M 68 15 C 80 15, 88 28, 85 40 C 95 48, 115 50, 118 62 C 122 75, 105 82, 100 90 C 95 105, 82 125, 75 145 C 72 152, 68 156, 65 145 C 58 125, 45 105, 42 90 C 35 78, 25 72, 30 55 C 34 42, 50 35, 55 25 Z"
                fill="url(#mapGlow)"
                stroke="#0284c7"
                strokeWidth="1.5"
                opacity="0.85"
              />

              {/* Route connecting lines */}
              <path d="M 68 85 L 64 110" stroke="#f97316" strokeWidth="1.5" strokeDasharray="2 2" />
              <path d="M 68 85 L 78 115" stroke="#f97316" strokeWidth="1.5" strokeDasharray="2 2" />
              <path d="M 64 110 L 78 115" stroke="#10b981" strokeWidth="1.5" strokeDasharray="2 2" />
              <path d="M 68 85 L 85 65" stroke="#38bdf8" strokeWidth="1.2" strokeDasharray="2 2" />

              {/* Hyderabad Pin (Orange) */}
              <circle cx="68" cy="85" r="5" fill="#f97316" />
              <circle cx="68" cy="85" r="9" fill="none" stroke="#f97316" strokeWidth="1" opacity="0.5" />

              {/* Bengaluru Pin (Green) */}
              <circle cx="64" cy="110" r="4.5" fill="#10b981" />
              <circle cx="64" cy="110" r="8" fill="none" stroke="#10b981" strokeWidth="1" opacity="0.5" />

              {/* Chennai Pin (Amber) */}
              <circle cx="78" cy="115" r="4" fill="#f59e0b" />
              <circle cx="78" cy="115" r="7" fill="none" stroke="#f59e0b" strokeWidth="1" opacity="0.5" />

              {/* Delhi / North Pin */}
              <circle cx="62" cy="45" r="3.5" fill="#38bdf8" />
            </svg>
          </div>

          {/* Breakdown Percentage Legend */}
          <div className="branch-legend-list">
            <div className="branch-legend-item">
              <span className="city-name">
                <span className="legend-dot dot-orange" />
                <span>Hyderabad</span>
              </span>
              <span className="percentage-val">35%</span>
            </div>
            <div className="branch-legend-item">
              <span className="city-name">
                <span className="legend-dot" style={{ background: '#10b981' }} />
                <span>Bengaluru</span>
              </span>
              <span className="percentage-val">30%</span>
            </div>
            <div className="branch-legend-item">
              <span className="city-name">
                <span className="legend-dot" style={{ background: '#f59e0b' }} />
                <span>Chennai</span>
              </span>
              <span className="percentage-val">20%</span>
            </div>
            <div className="branch-legend-item">
              <span className="city-name">
                <span className="legend-dot" style={{ background: '#a855f7' }} />
                <span>Others</span>
              </span>
              <span className="percentage-val">15%</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Recent Activities Feed */}
      <div className="dashboard-card">
        <div className="card-header-row">
          <div className="card-title">
            <Clock size={16} color="#f97316" />
            <span>Recent Activities</span>
          </div>
          <div
            className="card-action-link"
            onClick={() => onNavigate && onNavigate('audit')}
          >
            <span>View All</span>
            <ArrowRight size={12} />
          </div>
        </div>

        <div className="activity-list">
          {/* Rahul Kumar */}
          <div className="activity-item">
            <div className="activity-left">
              <div className="activity-icon">
                <User size={14} />
              </div>
              <div>
                <div className="activity-title">Rahul Kumar</div>
                <div className="activity-sub">User user registered • 2 min ago</div>
              </div>
            </div>
            <span className="activity-badge badge-new">New</span>
          </div>

          {/* Bengaluru Branch */}
          <div className="activity-item">
            <div className="activity-left">
              <div className="activity-icon">
                <Building size={14} />
              </div>
              <div>
                <div className="activity-title">Bengaluru Branch</div>
                <div className="activity-sub">Updated branch details • 5 min ago</div>
              </div>
            </div>
            <span className="activity-badge badge-updated">Updated</span>
          </div>

          {/* Premium Plan */}
          <div className="activity-item">
            <div className="activity-left">
              <div className="activity-icon">
                <CreditCard size={14} />
              </div>
              <div>
                <div className="activity-title">Premium Plan</div>
                <div className="activity-sub">Subscription renewed • 15 min ago</div>
              </div>
            </div>
            <span className="activity-badge badge-success">Success</span>
          </div>

          {/* Admin */}
          <div className="activity-item">
            <div className="activity-left">
              <div className="activity-icon">
                <Settings size={14} />
              </div>
              <div>
                <div className="activity-title">Admin</div>
                <div className="activity-sub">Updated system settings • 18 min ago</div>
              </div>
            </div>
            <span className="activity-badge badge-info">Info</span>
          </div>
        </div>
      </div>
    </div>
  );
};
