import React, { useState } from 'react';

// Sleek Interactive Area / Line Chart
export const InteractiveAreaChart = ({ data = [], xKey = 'label', yKey = 'value', height = 220, unit = '', color = '#2563eb' }) => {
  const [hoverIndex, setHoverIndex] = useState(null);

  if (!data || data.length === 0) {
    return <div style={{ height, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>No data available</div>;
  }

  const values = data.map(d => Number(d[yKey]) || 0);
  const minVal = Math.min(...values, 0);
  const maxVal = Math.max(...values, 10);
  const range = maxVal - minVal || 1;

  const width = 600;
  const paddingX = 40;
  const paddingY = 24;
  const chartW = width - paddingX * 2;
  const chartH = height - paddingY * 2;

  const points = data.map((d, i) => {
    const x = paddingX + (i / (data.length - 1 || 1)) * chartW;
    const y = paddingY + chartH - ((Number(d[yKey]) - minVal) / range) * chartH;
    return { x, y, data: d, val: d[yKey] };
  });

  const pathD = points.reduce((acc, p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`), '');
  const areaD = `${pathD} L ${points[points.length - 1].x} ${paddingY + chartH} L ${points[0].x} ${paddingY + chartH} Z`;

  const gradientId = `grad-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div style={{ position: 'relative', width: '100%', height }}>
      <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.32" />
            <stop offset="100%" stopColor={color} stopOpacity="0.02" />
          </linearGradient>
        </defs>

        {/* Horizontal grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((pct, i) => {
          const y = paddingY + chartH * (1 - pct);
          const gridVal = Math.round(minVal + pct * range);
          return (
            <g key={i}>
              <line x1={paddingX} y1={y} x2={width - paddingX} y2={y} stroke="#e2e8f0" strokeDasharray="3 3" strokeWidth="1" />
              <text x={paddingX - 8} y={y + 4} fill="#94a3b8" fontSize="10" textAnchor="end" fontWeight="500">
                {gridVal}{unit}
              </text>
            </g>
          );
        })}

        {/* Area fill */}
        <path d={areaD} fill={`url(#${gradientId})`} />

        {/* Line stroke */}
        <path d={pathD} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

        {/* Interactive points */}
        {points.map((p, i) => {
          const isHovered = hoverIndex === i;
          return (
            <g key={i} onMouseEnter={() => setHoverIndex(i)} onMouseLeave={() => setHoverIndex(null)} style={{ cursor: 'pointer' }}>
              {/* Invisible larger hover target */}
              <circle cx={p.x} cy={p.y} r="14" fill="transparent" />
              <circle
                cx={p.x}
                cy={p.y}
                r={isHovered ? '6' : '3.5'}
                fill={isHovered ? color : '#ffffff'}
                stroke={color}
                strokeWidth={isHovered ? '3' : '2'}
                style={{ transition: 'all 0.15s ease' }}
              />
              {/* X-axis labels */}
              <text x={p.x} y={height - 6} fill="#64748b" fontSize="11" textAnchor="middle" fontWeight="500">
                {p.data[xKey]}
              </text>
            </g>
          );
        })}

        {/* Vertical hover line */}
        {hoverIndex !== null && (
          <line
            x1={points[hoverIndex].x}
            y1={paddingY}
            x2={points[hoverIndex].x}
            y2={paddingY + chartH}
            stroke="#94a3b8"
            strokeDasharray="2 2"
            strokeWidth="1.5"
          />
        )}
      </svg>

      {/* Floating tooltip */}
      {hoverIndex !== null && (
        <div
          style={{
            position: 'absolute',
            left: `${(points[hoverIndex].x / width) * 100}%`,
            top: `${(points[hoverIndex].y / height) * 100}%`,
            transform: 'translate(-50%, -130%)',
            backgroundColor: '#0f172a',
            color: 'white',
            padding: '6px 10px',
            borderRadius: '6px',
            fontSize: '12px',
            fontWeight: '600',
            whiteSpace: 'nowrap',
            boxShadow: '0 4px 12px rgba(15,23,42,0.25)',
            pointerEvents: 'none',
            zIndex: 10
          }}
        >
          <div>{points[hoverIndex].data[xKey]}</div>
          <div style={{ color: '#60a5fa', fontSize: '13px' }}>
            {points[hoverIndex].val} {unit}
          </div>
        </div>
      )}
    </div>
  );
};

// Interactive Bar Chart
export const InteractiveBarChart = ({ data = [], xKey = 'label', yKey = 'value', height = 220, unit = '', color = '#2563eb' }) => {
  const [hoverIndex, setHoverIndex] = useState(null);

  if (!data || data.length === 0) {
    return <div style={{ height, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>No data</div>;
  }

  const values = data.map(d => Number(d[yKey]) || 0);
  const maxVal = Math.max(...values, 10);

  return (
    <div style={{ height, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', paddingTop: 16 }}>
      <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', gap: 12, borderBottom: '1px solid #e2e8f0', paddingBottom: 6 }}>
        {data.map((item, i) => {
          const val = Number(item[yKey]) || 0;
          const heightPct = Math.round((val / maxVal) * 100);
          const isHovered = hoverIndex === i;

          return (
            <div
              key={i}
              style={{ flex: 1, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'center', position: 'relative' }}
              onMouseEnter={() => setHoverIndex(i)}
              onMouseLeave={() => setHoverIndex(null)}
            >
              {isHovered && (
                <div
                  style={{
                    position: 'absolute',
                    top: -34,
                    backgroundColor: '#0f172a',
                    color: 'white',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '11px',
                    fontWeight: '600',
                    whiteSpace: 'nowrap',
                    zIndex: 20
                  }}
                >
                  {val.toLocaleString()} {unit}
                </div>
              )}
              <div
                style={{
                  width: '80%',
                  height: `${Math.max(heightPct, 4)}%`,
                  backgroundColor: isHovered ? '#1d4ed8' : color,
                  borderRadius: '4px 4px 0 0',
                  transition: 'all 0.18s ease',
                  cursor: 'pointer'
                }}
              />
            </div>
          );
        })}
      </div>
      <div style={{ display: 'flex', gap: 12, paddingTop: 8 }}>
        {data.map((item, i) => (
          <div key={i} style={{ flex: 1, textAlign: 'center', fontSize: '11px', fontWeight: '500', color: hoverIndex === i ? '#0f172a' : '#64748b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {item[xKey]}
          </div>
        ))}
      </div>
    </div>
  );
};

// Interactive Donut Chart
export const InteractiveDonutChart = ({ segments = [], size = 180, innerRadiusRatio = 0.65, centerTitle = '', centerValue = '' }) => {
  const [hoverIndex, setHoverIndex] = useState(null);

  const total = segments.reduce((sum, s) => sum + (Number(s.value) || 0), 0) || 1;
  const radius = size / 2;
  const innerRadius = radius * innerRadiusRatio;

  let cumulativeAngle = 0;
  const arcSegments = segments.map((seg, i) => {
    const val = Number(seg.value) || 0;
    const fraction = val / total;
    const angle = fraction * 360;
    const startAngle = cumulativeAngle;
    const endAngle = cumulativeAngle + angle;
    cumulativeAngle = endAngle;

    const startRad = (startAngle - 90) * (Math.PI / 180);
    const endRad = (endAngle - 90) * (Math.PI / 180);

    const x1 = radius + radius * Math.cos(startRad);
    const y1 = radius + radius * Math.sin(startRad);
    const x2 = radius + radius * Math.cos(endRad);
    const y2 = radius + radius * Math.sin(endRad);

    const ix1 = radius + innerRadius * Math.cos(endRad);
    const iy1 = radius + innerRadius * Math.sin(endRad);
    const ix2 = radius + innerRadius * Math.cos(startRad);
    const iy2 = radius + innerRadius * Math.sin(startRad);

    const largeArcFlag = angle > 180 ? 1 : 0;

    const pathData = `
      M ${x1} ${y1}
      A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}
      L ${ix1} ${iy1}
      A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${ix2} ${iy2}
      Z
    `;

    return {
      ...seg,
      pathData,
      fraction,
      percent: Math.round(fraction * 100),
      index: i
    };
  });

  const activeSegment = hoverIndex !== null ? arcSegments[hoverIndex] : null;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
      <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {arcSegments.map((arc, i) => (
            <path
              key={i}
              d={arc.pathData}
              fill={arc.color}
              stroke="#ffffff"
              strokeWidth="2"
              style={{
                opacity: hoverIndex === null || hoverIndex === i ? 1 : 0.45,
                transform: hoverIndex === i ? 'scale(1.03)' : 'scale(1)',
                transformOrigin: `${radius}px ${radius}px`,
                transition: 'all 0.18s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={() => setHoverIndex(i)}
              onMouseLeave={() => setHoverIndex(null)}
            />
          ))}
        </svg>

        {/* Center label */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: size,
            height: size,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none'
          }}
        >
          <div style={{ fontSize: '11px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase' }}>
            {activeSegment ? activeSegment.label : centerTitle}
          </div>
          <div style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a' }}>
            {activeSegment ? `${activeSegment.value} (${activeSegment.percent}%)` : centerValue}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1, minWidth: 140 }}>
        {arcSegments.map((arc, i) => (
          <div
            key={i}
            onMouseEnter={() => setHoverIndex(i)}
            onMouseLeave={() => setHoverIndex(null)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '12.5px',
              cursor: 'pointer',
              padding: '3px 6px',
              borderRadius: '4px',
              backgroundColor: hoverIndex === i ? '#f1f5f9' : 'transparent',
              transition: 'background-color 0.12s ease'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 10, height: 10, borderRadius: '2px', backgroundColor: arc.color }} />
              <span style={{ color: '#334155', fontWeight: '500' }}>{arc.label}</span>
            </div>
            <span style={{ fontWeight: '700', color: '#0f172a' }}>
              {arc.value} <span style={{ color: '#94a3b8', fontWeight: '400', fontSize: '11px' }}>({arc.percent}%)</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
