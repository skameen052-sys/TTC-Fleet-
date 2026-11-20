import React, { useState } from 'react';
import { InteractiveAreaChart, InteractiveBarChart, InteractiveDonutChart } from '../common/Charts';
import { BarChart3, TrendingUp, Calendar, Filter, PieChart, DollarSign, Download } from 'lucide-react';

export const ChartsAndReports = ({ analytics, vehicles = [], fuelStats, maintenanceData }) => {
  const [activeDateFilter, setActiveDateFilter] = useState('30d'); // 7d | 30d | 90d | year
  const [activeMetricTab, setActiveMetricTab] = useState('utilization'); // utilization | fuel | maintenance | expenses

  // Compute category distribution
  const categoryCounts = vehicles.reduce((acc, v) => {
    acc[v.category] = (acc[v.category] || 0) + 1;
    return acc;
  }, {});

  const categoryDonutSegments = [
    { label: 'Heavy Duty', value: categoryCounts['Heavy Duty Truck'] || 6, color: '#2563eb' },
    { label: 'Delivery Vans', value: categoryCounts['Delivery Cargo Van'] || 4, color: '#3b82f6' },
    { label: 'Electric Cargo', value: categoryCounts['Electric Cargo'] || 3, color: '#10b981' },
    { label: 'Refrigerated', value: categoryCounts['Refrigerated Truck'] || 2, color: '#8b5cf6' },
    { label: 'Utility Vans', value: categoryCounts['Utility Van'] || 2, color: '#f59e0b' }
  ];

  // Expenses data for bar chart
  const monthlyExpenses = analytics.reports.monthlyExpenses.map(item => ({
    label: item.month,
    value: item.total,
    fuel: item.fuel,
    maintenance: item.maintenance
  }));

  // Date filter multiplier
  const multiplier = activeDateFilter === '7d' ? 0.25 : activeDateFilter === '90d' ? 3 : activeDateFilter === 'year' ? 12 : 1;

  return (
    <div className="content-card">
      <div className="section-header">
        <div>
          <h2 className="section-title">
            <BarChart3 size={18} color="#2563eb" />
            <span>Executive Analytics, Charts & Fleet Reports</span>
          </h2>
          <p className="section-subtitle">Multi-dimensional telemetry metrics, OPEX expenditures & asset allocation</p>
        </div>

        {/* Date Filter & Metric Tabs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <div className="filter-tabs">
            <button
              className={`filter-tab ${activeDateFilter === '7d' ? 'active' : ''}`}
              onClick={() => setActiveDateFilter('7d')}
            >
              7 Days
            </button>
            <button
              className={`filter-tab ${activeDateFilter === '30d' ? 'active' : ''}`}
              onClick={() => setActiveDateFilter('30d')}
            >
              30 Days
            </button>
            <button
              className={`filter-tab ${activeDateFilter === '90d' ? 'active' : ''}`}
              onClick={() => setActiveDateFilter('90d')}
            >
              90 Days
            </button>
            <button
              className={`filter-tab ${activeDateFilter === 'year' ? 'active' : ''}`}
              onClick={() => setActiveDateFilter('year')}
            >
              This Year
            </button>
          </div>

          <button
            className="btn btn-secondary"
            style={{ padding: '6px 12px', fontSize: '12px' }}
            onClick={() => alert(`Exporting Executive Fleet Report for ${activeDateFilter.toUpperCase()} range (CSV / PDF)`)}
          >
            <Download size={13} /> Export Report
          </button>
        </div>
      </div>

      {/* Metric Selector Tabs */}
      <div style={{ display: 'flex', gap: 8, borderBottom: '1px solid #e2e8f0', paddingBottom: 12, marginBottom: 18, overflowX: 'auto' }}>
        {[
          { id: 'utilization', label: '1. Fleet Utilization Curve' },
          { id: 'fuel', label: '2. Fuel & Energy Spend Trend' },
          { id: 'maintenance', label: '3. Maintenance Cost Trend' },
          { id: 'expenses', label: '4. Monthly Fleet OPEX Breakdown' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveMetricTab(tab.id)}
            style={{
              padding: '7px 14px',
              fontSize: '12.5px',
              fontWeight: '600',
              borderRadius: '6px',
              border: activeMetricTab === tab.id ? '1px solid #2563eb' : '1px solid transparent',
              backgroundColor: activeMetricTab === tab.id ? '#eff6ff' : '#f8fafc',
              color: activeMetricTab === tab.id ? '#2563eb' : '#64748b',
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Grid: Selected Interactive Chart + Category Distribution Donut */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.7fr 1fr', gap: 24, alignItems: 'center' }}>
        {/* Active Chart View */}
        <div>
          {activeMetricTab === 'utilization' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <span style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a' }}>
                  Vehicle Utilization Progression ({activeDateFilter.toUpperCase()})
                </span>
                <span style={{ fontSize: '12px', fontWeight: '600', color: '#16a34a' }}>
                  Target: &gt; 75.0% (Current: 78.5%)
                </span>
              </div>
              <InteractiveAreaChart
                data={analytics.utilization.weeklyUsageData.map(d => ({
                  label: d.label,
                  value: d.utilizationRate
                }))}
                xKey="label"
                yKey="value"
                unit="%"
                color="#2563eb"
                height={220}
              />
            </div>
          )}

          {activeMetricTab === 'fuel' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <span style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a' }}>
                  Fuel & Power Expenditures ($ USD)
                </span>
                <span style={{ fontSize: '12px', fontWeight: '600', color: '#2563eb' }}>
                  Total: ${(fuelStats.monthlyFuelExpense * multiplier).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </span>
              </div>
              <InteractiveAreaChart
                data={fuelStats.monthlyExpenseTrend.map(d => ({
                  label: d.month,
                  value: Math.round(d.total * multiplier)
                }))}
                xKey="label"
                yKey="value"
                unit="$"
                color="#0284c7"
                height={220}
              />
            </div>
          )}

          {activeMetricTab === 'maintenance' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <span style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a' }}>
                  Preventive & Corrective Maintenance Spend ($ USD)
                </span>
                <span style={{ fontSize: '12px', fontWeight: '600', color: '#7c3aed' }}>
                  Total: ${(maintenanceData.monthlyExpense * multiplier).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </span>
              </div>
              <InteractiveBarChart
                data={monthlyExpenses.map(d => ({
                  label: d.label,
                  value: Math.round(d.maintenance * multiplier)
                }))}
                xKey="label"
                yKey="value"
                unit="$"
                color="#7c3aed"
                height={220}
              />
            </div>
          )}

          {activeMetricTab === 'expenses' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <span style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a' }}>
                  Comprehensive Monthly Fleet Expenses ($ USD)
                </span>
                <span style={{ fontSize: '12px', fontWeight: '600', color: '#0f172a' }}>
                  Avg: $98,400 / mo
                </span>
              </div>
              <InteractiveBarChart
                data={monthlyExpenses.map(d => ({
                  label: d.label,
                  value: Math.round(d.value * multiplier)
                }))}
                xKey="label"
                yKey="value"
                unit="$"
                color="#0f172a"
                height={220}
              />
            </div>
          )}
        </div>

        {/* Vehicle Category Distribution Donut Chart */}
        <div style={{ padding: '16px', backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <div style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
            <PieChart size={15} color="#2563eb" />
            <span>Vehicle Category Distribution</span>
          </div>

          <InteractiveDonutChart
            segments={categoryDonutSegments}
            size={170}
            innerRadiusRatio={0.62}
            centerTitle="Fleet Mix"
            centerValue={`${vehicles.length}`}
          />
        </div>
      </div>
    </div>
  );
};
