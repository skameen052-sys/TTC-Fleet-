import React from 'react';
import { MapPin } from 'lucide-react';
import mapVisualImg from '../assets/india-map.jpg';

export const BranchMap = ({ distribution }) => {
  const items = distribution || [
    { city: 'Hyderabad', percentage: 35, color: '#f97316' },
    { city: 'Bengaluru', percentage: 30, color: '#10b981' },
    { city: 'Chennai', percentage: 20, color: '#ea580c' },
    { city: 'Others', percentage: 15, color: '#8b5cf6' },
  ];

  return (
    <div className="dashboard-card">
      <div className="card-header-row">
        <div className="card-title">
          <MapPin size={18} color="#f97316" />
          <span>Branch Distribution</span>
        </div>
      </div>

      <div className="branch-dist-container">
        {/* Glowing Map Visual */}
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <img
            src={mapVisualImg}
            alt="India Regional Logistics Distribution"
            className="branch-map-img"
          />
        </div>

        {/* Legend list */}
        <div className="branch-legend-list">
          {items.map((item) => (
            <div key={item.city} className="branch-legend-item">
              <span className="city-name">
                <span
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: item.color,
                    display: 'inline-block',
                    boxShadow: `0 0 8px ${item.color}80`,
                  }}
                />
                {item.city}
              </span>
              <span className="percentage-val">{item.percentage}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
