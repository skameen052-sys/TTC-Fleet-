import React from 'react';
import { InteractiveDonutChart } from '../common/Charts';
import { CheckCircle2, Navigation, Clock, Wrench, AlertOctagon } from 'lucide-react';

export const VehicleStatusOverview = ({ overview, onStatusFilter }) => {
  const statusItems = [
    {
      key: 'available',
      label: 'Available Vehicles',
      count: overview.available.count,
      percent: overview.available.percent,
      color: '#10b981',
      bgClass: 'status-available',
      icon: CheckCircle2,
      desc: 'Inspected and stationed at depot bays'
    },
    {
      key: 'onTrip',
      label: 'Running / On Trip',
      count: overview.onTrip.count,
      percent: overview.onTrip.percent,
      color: '#2563eb',
      bgClass: 'status-ontrip',
      icon: Navigation,
      desc: 'Active cargo & transport en route'
    },
    {
      key: 'waiting',
      label: 'Waiting for Assignment',
      count: overview.waiting.count,
      percent: overview.waiting.percent,
      color: '#f59e0b',
      bgClass: 'status-waiting',
      icon: Clock,
      desc: 'Ready, pending driver assignment'
    },
    {
      key: 'maintenance',
      label: 'Under Maintenance',
      count: overview.maintenance.count,
      percent: overview.maintenance.percent,
      color: '#8b5cf6',
      bgClass: 'status-maintenance',
      icon: Wrench,
      desc: 'Service bays, PM inspections & repairs'
    },
    {
      key: 'outOfService',
      label: 'Out of Service',
      count: overview.outOfService.count,
      percent: overview.outOfService.percent,
      color: '#ef4444',
      bgClass: 'status-outofservice',
      icon: AlertOctagon,
      desc: 'Decommissioned / major compliance hold'
    }
  ];

  const donutSegments = statusItems.map(item => ({
    label: item.label,
    value: item.count,
    color: item.color
  }));

  return (
    <div className="content-card">
      <div className="section-header">
        <div>
          <h2 className="section-title">
            <span>Vehicle Status Overview</span>
          </h2>
          <p className="section-subtitle">Real-time status breakdown across total fleet ({overview.total} vehicles)</p>
        </div>
        <div style={{ fontSize: '12px', fontWeight: '600', color: '#2563eb', backgroundColor: '#eff6ff', padding: '4px 10px', borderRadius: '6px' }}>
          Live Fleet Sync
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.3fr', gap: 24, alignItems: 'center' }}>
        {/* Donut Chart representation */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <InteractiveDonutChart
            segments={donutSegments}
            size={190}
            innerRadiusRatio={0.65}
            centerTitle="Total Fleet"
            centerValue={`${overview.total}`}
          />
        </div>

        {/* Progress Bars Breakdown */}
        <div className="status-bar-container">
          {statusItems.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.key}
                className="status-bar-row"
                style={{ cursor: 'pointer' }}
                onClick={() => onStatusFilter && onStatusFilter(item.key)}
              >
                <div className="status-bar-labels">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Icon size={14} color={item.color} />
                    <span style={{ fontWeight: '600', color: '#1e293b' }}>{item.label}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontWeight: '700', color: '#0f172a' }}>{item.count}</span>
                    <span style={{ fontSize: '11px', color: '#64748b', minWidth: '32px', textAlign: 'right' }}>
                      ({item.percent}%)
                    </span>
                  </div>
                </div>

                <div className="progress-track">
                  <div
                    className="progress-fill"
                    style={{
                      width: `${item.percent}%`,
                      backgroundColor: item.color
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
