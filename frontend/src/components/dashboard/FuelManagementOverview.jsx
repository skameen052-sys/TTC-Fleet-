import React, { useState } from 'react';
import { InteractiveBarChart, InteractiveAreaChart } from '../common/Charts';
import { Fuel, TrendingDown, DollarSign, Droplets, Zap, ChevronRight, PlusCircle } from 'lucide-react';

export const FuelManagementOverview = ({ fuelStats, onOpenFuelModal }) => {
  const [chartView, setChartView] = useState('monthly'); // monthly | category

  const monthlyTrendData = fuelStats.monthlyExpenseTrend.map(m => ({
    label: m.month,
    value: m.total,
    diesel: m.diesel,
    gas: m.gas,
    ev: m.evElectric
  }));

  const categoryUsageData = fuelStats.vehicleWiseFuelUsage.map(c => ({
    label: c.category.split(' ')[0],
    fullName: c.category,
    value: c.cost,
    liters: c.liters,
    efficiency: c.efficiency
  }));

  return (
    <div className="content-card">
      <div className="section-header">
        <div>
          <h2 className="section-title">
            <Fuel size={18} color="#2563eb" />
            <span>Fuel & Energy Management Overview</span>
          </h2>
          <p className="section-subtitle">Consumption tracking, spend audits & green transition efficiency</p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div className="filter-tabs">
            <button
              className={`filter-tab ${chartView === 'monthly' ? 'active' : ''}`}
              onClick={() => setChartView('monthly')}
            >
              Expense Trends
            </button>
            <button
              className={`filter-tab ${chartView === 'category' ? 'active' : ''}`}
              onClick={() => setChartView('category')}
            >
              Category Spend
            </button>
          </div>

          <button
            className="btn btn-primary"
            style={{ padding: '6px 12px', fontSize: '12px' }}
            onClick={onOpenFuelModal}
          >
            <PlusCircle size={13} /> Add Fuel Log
          </button>
        </div>
      </div>

      {/* 4 Fuel KPI Badges */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
        <div style={{ padding: '12px 14px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
          <div style={{ fontSize: '11px', color: '#64748b', fontWeight: '600', textTransform: 'uppercase' }}>
            Total Fuel Consumed
          </div>
          <div style={{ fontSize: '22px', fontWeight: '800', color: '#0f172a', margin: '2px 0' }}>
            {fuelStats.totalFuelConsumedLiters.toLocaleString()} <span style={{ fontSize: '11px', fontWeight: '500', color: '#64748b' }}>Liters</span>
          </div>
          <div style={{ fontSize: '11px', color: '#059669', display: 'flex', alignItems: 'center', gap: 3 }}>
            <TrendingDown size={11} /> -3.2% vs prev. cycle
          </div>
        </div>

        <div style={{ padding: '12px 14px', backgroundColor: '#eff6ff', borderRadius: '8px', border: '1px solid #dbeafe' }}>
          <div style={{ fontSize: '11px', color: '#1d4ed8', fontWeight: '600', textTransform: 'uppercase' }}>
            Monthly Fuel Expenses
          </div>
          <div style={{ fontSize: '22px', fontWeight: '800', color: '#0f172a', margin: '2px 0' }}>
            ${fuelStats.monthlyFuelExpense.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div style={{ fontSize: '11px', color: '#64748b' }}>Budget variance: Optimal</div>
        </div>

        <div style={{ padding: '12px 14px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
          <div style={{ fontSize: '11px', color: '#64748b', fontWeight: '600', textTransform: 'uppercase' }}>
            Average Consumption
          </div>
          <div style={{ fontSize: '22px', fontWeight: '800', color: '#0f172a', margin: '2px 0' }}>
            {fuelStats.avgFuelConsumptionL100Km} <span style={{ fontSize: '11px', fontWeight: '500', color: '#64748b' }}>L/100km</span>
          </div>
          <div style={{ fontSize: '11px', color: '#64748b' }}>Fleet-wide weighted avg</div>
        </div>

        <div style={{ padding: '12px 14px', backgroundColor: '#ecfdf5', borderRadius: '8px', border: '1px solid #a7f3d0' }}>
          <div style={{ fontSize: '11px', color: '#047857', fontWeight: '600', textTransform: 'uppercase' }}>
            Cost Efficiency / KM
          </div>
          <div style={{ fontSize: '22px', fontWeight: '800', color: '#047857', margin: '2px 0' }}>
            ${fuelStats.averageCostPerKm} <span style={{ fontSize: '11px', fontWeight: '500', color: '#047857' }}>/ km</span>
          </div>
          <div style={{ fontSize: '11px', color: '#059669' }}>Total: 215,400 km driven</div>
        </div>
      </div>

      {/* Main Chart Section */}
      <div style={{ marginBottom: 20 }}>
        {chartView === 'monthly' ? (
          <div>
            <div style={{ fontSize: '12.5px', fontWeight: '600', color: '#334155', marginBottom: 8 }}>
              6-Month Fuel & Energy Expense Trend ($)
            </div>
            <InteractiveAreaChart
              data={monthlyTrendData}
              xKey="label"
              yKey="value"
              unit="$"
              color="#2563eb"
              height={180}
            />
          </div>
        ) : (
          <div>
            <div style={{ fontSize: '12.5px', fontWeight: '600', color: '#334155', marginBottom: 8 }}>
              Category-Wise Fuel Spend Distribution ($)
            </div>
            <InteractiveBarChart
              data={categoryUsageData}
              xKey="label"
              yKey="value"
              unit="$"
              color="#1d4ed8"
              height={180}
            />
          </div>
        )}
      </div>

      {/* Vehicle Category-Wise Usage & Mileage Breakdown Table */}
      <div>
        <div style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a', marginBottom: 10 }}>
          Category Fuel Performance & Efficiency Comparison
        </div>
        <div className="table-responsive">
          <table className="enterprise-table">
            <thead>
              <tr>
                <th>Category</th>
                <th>Volume (Liters)</th>
                <th>Total Cost ($)</th>
                <th>Distance Covered</th>
                <th>Efficiency Benchmark</th>
              </tr>
            </thead>
            <tbody>
              {fuelStats.vehicleWiseFuelUsage.map((row, idx) => (
                <tr key={idx}>
                  <td style={{ fontWeight: '600', color: '#0f172a' }}>{row.category}</td>
                  <td>{row.liters > 0 ? `${row.liters.toLocaleString()} L` : 'Zero Emission'}</td>
                  <td style={{ fontWeight: '700', color: '#1e293b' }}>${row.cost.toLocaleString()}</td>
                  <td>{row.mileageKm.toLocaleString()} km</td>
                  <td>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontWeight: '600', color: '#2563eb', backgroundColor: '#eff6ff', padding: '2px 8px', borderRadius: '4px', fontSize: '12px' }}>
                      {row.efficiency}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
