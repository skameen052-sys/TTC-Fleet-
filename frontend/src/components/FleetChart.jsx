import React, { useState } from 'react';
import { BarChart3 } from 'lucide-react';

export const FleetChart = ({ data }) => {
  const [hoverIndex, setHoverIndex] = useState(null);
  const [timeRange, setTimeRange] = useState('Last 6 Months');

  const months = data?.months || ['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov'];
  const trips = data?.totalTripsSeries || [40, 58, 68, 78, 74, 88];
  const onTime = data?.onTimeDeliverySeries || [30, 48, 60, 72, 68, 80];

  // SVG coordinate calculations
  // ViewBox: 0 0 460 170
  const width = 460;
  const height = 150;
  const paddingLeft = 40;
  const paddingRight = 20;
  const paddingTop = 15;
  const paddingBottom = 25;

  const chartW = width - paddingLeft - paddingRight;
  const chartH = height - paddingTop - paddingBottom;

  const getX = (index) => paddingLeft + (index / (months.length - 1)) * chartW;
  const getY = (val) => paddingTop + chartH - (val / 100) * chartH;

  const tripsPoints = trips.map((val, idx) => `${getX(idx)},${getY(val)}`).join(' ');
  const onTimePoints = onTime.map((val, idx) => `${getX(idx)},${getY(val)}`).join(' ');

  return (
    <div className="dashboard-card" style={{ flex: 1 }}>
      <div className="card-header-row">
        <div className="card-title">
          <BarChart3 size={18} color="#f97316" />
          <span>Fleet Performance</span>
        </div>
        <select
          className="card-select-pill"
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
        >
          <option>Last 6 Months</option>
          <option>Last 30 Days</option>
          <option>Year to Date</option>
        </select>
      </div>

      <div className="chart-legend-row">
        <div className="chart-legend-item">
          <span className="legend-dot dot-orange"></span>
          <span>Total Trips</span>
        </div>
        <div className="chart-legend-item">
          <span className="legend-dot dot-blue"></span>
          <span>On Time Delivery</span>
        </div>
      </div>

      <div className="chart-canvas-wrapper" style={{ position: 'relative' }}>
        <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', height: '100%', overflow: 'visible' }}>
          <defs>
            <linearGradient id="tripsGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f97316" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#f97316" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="onTimeGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines & Y axis values */}
          {[100, 75, 50, 25, 0].map((level) => {
            const y = getY(level);
            return (
              <g key={level}>
                <line
                  x1={paddingLeft}
                  y1={y}
                  x2={width - paddingRight}
                  y2={y}
                  stroke="rgba(255,255,255,0.06)"
                  strokeDasharray={level === 0 ? "none" : "3,3"}
                />
                <text
                  x={paddingLeft - 10}
                  y={y + 3.5}
                  fill="#64748b"
                  fontSize="9.5"
                  textAnchor="end"
                  fontFamily="inherit"
                >
                  {level}
                </text>
              </g>
            );
          })}

          {/* X axis labels */}
          {months.map((m, idx) => (
            <text
              key={m}
              x={getX(idx)}
              y={height}
              fill="#94a3b8"
              fontSize="10"
              textAnchor="middle"
              fontFamily="inherit"
            >
              {m}
            </text>
          ))}

          {/* Area fill for On Time */}
          <polygon
            points={`${getX(0)},${getY(0)} ${onTimePoints} ${getX(months.length - 1)},${getY(0)}`}
            fill="url(#onTimeGrad)"
          />

          {/* Lines */}
          <polyline
            points={onTimePoints}
            fill="none"
            stroke="#0ea5e9"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <polyline
            points={tripsPoints}
            fill="none"
            stroke="#f97316"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Data Points */}
          {trips.map((val, idx) => (
            <circle
              key={`trip-dot-${idx}`}
              cx={getX(idx)}
              cy={getY(val)}
              r={hoverIndex === idx ? 5 : 3.5}
              fill="#f97316"
              stroke="#111726"
              strokeWidth="2"
              onMouseEnter={() => setHoverIndex(idx)}
              onMouseLeave={() => setHoverIndex(null)}
              style={{ cursor: 'pointer', transition: 'all 0.15s' }}
            />
          ))}

          {onTime.map((val, idx) => (
            <circle
              key={`ontime-dot-${idx}`}
              cx={getX(idx)}
              cy={getY(val)}
              r={hoverIndex === idx ? 5 : 3.5}
              fill="#0ea5e9"
              stroke="#111726"
              strokeWidth="2"
              onMouseEnter={() => setHoverIndex(idx)}
              onMouseLeave={() => setHoverIndex(null)}
              style={{ cursor: 'pointer', transition: 'all 0.15s' }}
            />
          ))}
        </svg>

        {hoverIndex !== null && (
          <div
            style={{
              position: 'absolute',
              top: '10px',
              left: `${(hoverIndex / 5) * 70 + 15}%`,
              background: '#1a2236',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: '6px',
              padding: '6px 10px',
              fontSize: '11px',
              color: '#fff',
              boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
              pointerEvents: 'none',
              zIndex: 10,
            }}
          >
            <div style={{ fontWeight: 700, color: '#f97316' }}>{months[hoverIndex]}</div>
            <div>Trips: {trips[hoverIndex]}</div>
            <div>On-Time: {onTime[hoverIndex]}%</div>
          </div>
        )}
      </div>
    </div>
  );
};
