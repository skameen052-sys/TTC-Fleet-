import React, { useState } from 'react';
import { InteractiveAreaChart, InteractiveBarChart } from '../common/Charts';
import { BarChart2, TrendingUp, Clock, Gauge } from 'lucide-react';

export const FleetUtilizationAnalytics = ({ analytics }) => {
  const [filterPeriod, setFilterPeriod] = useState('weekly'); // daily | weekly | monthly

  const { utilization } = analytics;

  const getChartData = () => {
    if (filterPeriod === 'daily') {
      return {
        data: utilization.dailyUsageData,
        xKey: 'label',
        yKey: 'utilizationRate',
        unit: '%',
        title: '24-Hour Fleet Utilization Rhythm'
      };
    }
    if (filterPeriod === 'weekly') {
      return {
        data: utilization.weeklyUsageData,
        xKey: 'label',
        yKey: 'utilizationRate',
        unit: '%',
        title: 'Weekly Fleet Deployment Curve'
      };
    }
    return {
      data: utilization.monthlyUsageData,
      xKey: 'label',
      yKey: 'utilizationRate',
      unit: '%',
      title: 'Month-to-Date Operational Capacity'
    };
  };

  const chartInfo = getChartData();

  return (
    <div className="content-card">
      <div className="section-header">
        <div>
          <h2 className="section-title">
            <Gauge size={18} color="#2563eb" />
            <span>Fleet Utilization Analytics</span>
          </h2>
          <p className="section-subtitle">Operational efficiency, duty hours & category-wise usage</p>
        </div>

        {/* Daily, Weekly, Monthly Filter Tabs */}
        <div className="filter-tabs">
          <button
            className={`filter-tab ${filterPeriod === 'daily' ? 'active' : ''}`}
            onClick={() => setFilterPeriod('daily')}
          >
            Daily
          </button>
          <button
            className={`filter-tab ${filterPeriod === 'weekly' ? 'active' : ''}`}
            onClick={() => setFilterPeriod('weekly')}
          >
            Weekly
          </button>
          <button
            className={`filter-tab ${filterPeriod === 'monthly' ? 'active' : ''}`}
            onClick={() => setFilterPeriod('monthly')}
          >
            Monthly
          </button>
        </div>
      </div>

      {/* Top 3 KPI Badges */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 20 }}>
        <div style={{ padding: '12px 14px', backgroundColor: '#eff6ff', borderRadius: '8px', border: '1px solid #dbeafe' }}>
          <div style={{ fontSize: '11.5px', fontWeight: '600', color: '#1d4ed8' }}>Total Fleet Utilization</div>
          <div style={{ fontSize: '24px', fontWeight: '800', color: '#0f172a', margin: '2px 0' }}>
            {utilization.totalUtilizationPercent}%
          </div>
          <div style={{ fontSize: '11px', color: '#059669', display: 'flex', alignItems: 'center', gap: 3 }}>
            <TrendingUp size={11} /> +3.8% efficiency peak
          </div>
        </div>

        <div style={{ padding: '12px 14px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
          <div style={{ fontSize: '11.5px', fontWeight: '600', color: '#64748b' }}>Idle Vehicle Rate</div>
          <div style={{ fontSize: '24px', fontWeight: '800', color: '#0f172a', margin: '2px 0' }}>
            {utilization.idlePercent}%
          </div>
          <div style={{ fontSize: '11px', color: '#64748b' }}>Available in reserve depots</div>
        </div>

        <div style={{ padding: '12px 14px', backgroundColor: '#faf5ff', borderRadius: '8px', border: '1px solid #ede9fe' }}>
          <div style={{ fontSize: '11.5px', fontWeight: '600', color: '#7c3aed' }}>Maintenance Overhead</div>
          <div style={{ fontSize: '24px', fontWeight: '800', color: '#0f172a', margin: '2px 0' }}>
            {utilization.maintenancePercent}%
          </div>
          <div style={{ fontSize: '11px', color: '#7c3aed' }}>Preventive maintenance cycles</div>
        </div>
      </div>

      {/* Main Interactive Utilization Chart */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: '12.5px', fontWeight: '600', color: '#334155', marginBottom: 8 }}>
          {chartInfo.title}
        </div>
        <InteractiveAreaChart
          data={chartInfo.data}
          xKey={chartInfo.xKey}
          yKey={chartInfo.yKey}
          unit={chartInfo.unit}
          color="#2563eb"
          height={200}
        />
      </div>

      {/* Vehicle Category-Wise Utilization */}
      <div>
        <div style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a', marginBottom: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>Vehicle Category-Wise Utilization</span>
          <span style={{ fontSize: '11px', color: '#64748b', fontWeight: '500' }}>Active Assets vs Total</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {utilization.categoryUtilization.map((cat, idx) => (
            <div key={idx} style={{ padding: '8px 12px', backgroundColor: '#f8fafc', borderRadius: '6px', border: '1px solid #f1f5f9' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', fontWeight: '600', marginBottom: 4 }}>
                <span style={{ color: '#1e293b' }}>{cat.category}</span>
                <span style={{ color: '#2563eb' }}>{cat.utilizationRate}% utilized</span>
              </div>
              <div className="progress-track" style={{ height: 6 }}>
                <div
                  className="progress-fill"
                  style={{
                    width: `${cat.utilizationRate}%`,
                    backgroundColor: cat.utilizationRate > 60 ? '#2563eb' : cat.utilizationRate > 30 ? '#f59e0b' : '#94a3b8'
                  }}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#64748b', marginTop: 3 }}>
                <span>Fleet capacity: {cat.total} units</span>
                <span>{cat.onTrip || 0} dispatched, {cat.available || 0} ready</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
