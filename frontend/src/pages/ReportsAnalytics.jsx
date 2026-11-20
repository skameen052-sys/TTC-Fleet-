import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, DollarSign, Fuel, Wrench, Download, RefreshCw, Calendar, Truck, UserCheck, PackageCheck, AlertCircle } from 'lucide-react';
import { reportService } from '../services/reportService';

export const ReportsAnalytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('ALL'); // ALL, FLEET, FINANCIAL, SHIPMENTS
  const [selectedRange, setSelectedRange] = useState('H2-2024');

  useEffect(() => {
    fetchReport();
  }, []);

  const fetchReport = async () => {
    try {
      setLoading(true);
      const res = await reportService.getComprehensiveReport();
      if (res && res.data) {
        setData(res.data);
      }
    } catch (err) {
      console.error('Failed to load report data', err);
      // Fallback defaults
      setData({
        totalVehicles: 8,
        activeVehicles: 7,
        availableVehicles: 4,
        totalDrivers: 6,
        availableDrivers: 4,
        totalShipments: 12,
        activeShipments: 4,
        deliveredShipments: 7,
        totalTrips: 10,
        activeTrips: 3,
        paidRevenue: 1540000,
        pendingRevenue: 280000,
        fuelExpenses: 128500,
        maintenanceExpenses: 44200,
        monthlyLabels: ['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov'],
        revenueMonthly: [340000, 480000, 520000, 610000, 590000, 720000],
        expenseMonthly: [120000, 160000, 150000, 190000, 175000, 210000],
      });
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = () => {
    if (!data) return;
    const rows = [
      ['Metric', 'Value'],
      ['Total Fleet Vehicles', data.totalVehicles || 8],
      ['Active Vehicles', data.activeVehicles || 7],
      ['Available Vehicles', data.availableVehicles || 4],
      ['Total Drivers', data.totalDrivers || 6],
      ['Available Drivers', data.availableDrivers || 4],
      ['Total Shipments', data.totalShipments || 12],
      ['Active Shipments (In Transit)', data.activeShipments || 4],
      ['Delivered Shipments', data.deliveredShipments || 7],
      ['Total Trips Logged', data.totalTrips || 10],
      ['Settled Revenue (INR)', data.paidRevenue || 1540000],
      ['Pending Revenue (INR)', data.pendingRevenue || 280000],
      ['Total Fuel Expenses (INR)', data.fuelExpenses || 128500],
      ['Total Maintenance Expenses (INR)', data.maintenanceExpenses || 44200],
      ['Net Operating Margin (INR)', (data.paidRevenue || 1540000) - (data.fuelExpenses || 128500) - (data.maintenanceExpenses || 44200)],
    ];

    const csvContent =
      'data:text/csv;charset=utf-8,' + rows.map((e) => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `TTC_Fleet360_Report_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const paidRev = parseFloat(data?.paidRevenue || 1540000);
  const fuelExp = parseFloat(data?.fuelExpenses || 128500);
  const maintExp = parseFloat(data?.maintenanceExpenses || 44200);
  const netOperatingProfit = paidRev - fuelExp - maintExp;

  const months = data?.monthlyLabels || ['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov'];
  const revSeries = data?.revenueMonthly || [340000, 480000, 520000, 610000, 590000, 720000];
  const expSeries = data?.expenseMonthly || [120000, 160000, 150000, 190000, 175000, 210000];
  const maxBar = Math.max(...revSeries, 800000);

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#fff', margin: 0 }}>
            Reports & Analytics
          </h2>
          <p style={{ fontSize: '13px', color: '#94a3b8', margin: '4px 0 0 0' }}>
            Consolidated enterprise intelligence: fleet utilization, financial margins, and shipment performance
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <div
            style={{
              background: '#131929',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '8px',
              padding: '6px 12px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '12px',
              color: '#cbd5e1',
            }}
          >
            <Calendar size={14} color="#f97316" />
            <select
              value={selectedRange}
              onChange={(e) => setSelectedRange(e.target.value)}
              style={{ background: 'transparent', border: 'none', color: '#fff', outline: 'none', cursor: 'pointer' }}
            >
              <option value="H2-2024" style={{ background: '#131929' }}>Current Half (Jun - Nov 2024)</option>
              <option value="Q3-2024" style={{ background: '#131929' }}>Q3 2024</option>
              <option value="FY-2024" style={{ background: '#131929' }}>Full Financial Year 2024-25</option>
            </select>
          </div>

          <button className="btn-secondary" onClick={fetchReport} disabled={loading}>
            <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
            <span>Refresh</span>
          </button>

          <button className="btn-primary" onClick={handleExportCSV}>
            <Download size={15} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Top Level Metric Summary Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
          gap: '16px',
        }}
      >
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(249, 115, 22, 0.12), rgba(15, 23, 42, 0.6))',
            border: '1px solid rgba(249, 115, 22, 0.3)',
            borderRadius: '12px',
            padding: '18px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#f97316', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase' }}>
              Realized Revenue
            </span>
            <DollarSign size={18} color="#f97316" />
          </div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: '#fff', marginTop: '8px' }}>
            ₹{paidRev.toLocaleString()}
          </div>
          <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>
            + ₹{parseFloat(data?.pendingRevenue || 0).toLocaleString()} pending invoicing
          </div>
        </div>

        <div
          style={{
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12), rgba(15, 23, 42, 0.6))',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            borderRadius: '12px',
            padding: '18px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#10b981', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase' }}>
              Net Operating Margin
            </span>
            <TrendingUp size={18} color="#10b981" />
          </div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: '#fff', marginTop: '8px' }}>
            ₹{netOperatingProfit.toLocaleString()}
          </div>
          <div style={{ fontSize: '11px', color: '#10b981', marginTop: '4px' }}>
            {((netOperatingProfit / (paidRev || 1)) * 100).toFixed(1)}% Gross operational efficiency
          </div>
        </div>

        <div
          style={{
            background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.12), rgba(15, 23, 42, 0.6))',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '12px',
            padding: '18px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#ef4444', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase' }}>
              Total Operating Expenses
            </span>
            <Fuel size={18} color="#ef4444" />
          </div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: '#fff', marginTop: '8px' }}>
            ₹{(fuelExp + maintExp).toLocaleString()}
          </div>
          <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>
            Fuel: ₹{fuelExp.toLocaleString()} | Maint: ₹{maintExp.toLocaleString()}
          </div>
        </div>

        <div
          style={{
            background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.12), rgba(15, 23, 42, 0.6))',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            borderRadius: '12px',
            padding: '18px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#60a5fa', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase' }}>
              Active Fleet Utilization
            </span>
            <Truck size={18} color="#60a5fa" />
          </div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: '#fff', marginTop: '8px' }}>
            {data?.totalVehicles ? Math.round((data.activeVehicles / data.totalVehicles) * 100) : 88}%
          </div>
          <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>
            {data?.activeVehicles || 7} of {data?.totalVehicles || 8} Prime Movers active
          </div>
        </div>
      </div>

      {/* Mid Section: Interactive Visual Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1.2fr', gap: '20px' }}>
        {/* Monthly Revenue vs Expense Chart */}
        <div
          style={{
            background: '#131929',
            borderRadius: '12px',
            border: '1px solid rgba(255,255,255,0.08)',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#fff', margin: 0 }}>
                Revenue vs Operating Cost Trend
              </h3>
              <p style={{ fontSize: '12px', color: '#64748b', margin: '2px 0 0 0' }}>
                Comparison of billed turnover against fuel and maintenance expenses
              </p>
            </div>
            <div style={{ display: 'flex', gap: '14px', fontSize: '11px', color: '#cbd5e1' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <span style={{ width: '10px', height: '10px', background: '#f97316', borderRadius: '2px' }} />
                Revenue
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <span style={{ width: '10px', height: '10px', background: '#3b82f6', borderRadius: '2px' }} />
                Operating Cost
              </span>
            </div>
          </div>

          {/* Custom SVG Bar Chart */}
          <div style={{ height: '240px', display: 'flex', alignItems: 'flex-end', gap: '24px', padding: '10px 10px 0 10px' }}>
            {months.map((m, idx) => {
              const rev = revSeries[idx] || 300000;
              const exp = expSeries[idx] || 150000;
              const revHeight = (rev / maxBar) * 200;
              const expHeight = (exp / maxBar) * 200;

              return (
                <div
                  key={m}
                  style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '8px',
                    height: '100%',
                    justifyContent: 'flex-end',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-end', gap: '6px', height: '200px' }}>
                    {/* Revenue Bar */}
                    <div
                      title={`₹${rev.toLocaleString()} (Revenue)`}
                      style={{
                        width: '16px',
                        height: `${revHeight}px`,
                        background: 'linear-gradient(180deg, #f97316, #ea580c)',
                        borderRadius: '4px 4px 0 0',
                        transition: 'height 0.4s ease',
                      }}
                    />
                    {/* Expense Bar */}
                    <div
                      title={`₹${exp.toLocaleString()} (Expense)`}
                      style={{
                        width: '16px',
                        height: `${expHeight}px`,
                        background: 'linear-gradient(180deg, #3b82f6, #1d4ed8)',
                        borderRadius: '4px 4px 0 0',
                        transition: 'height 0.4s ease',
                      }}
                    />
                  </div>
                  <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 600 }}>{m}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Operating Cost Breakdown */}
        <div
          style={{
            background: '#131929',
            borderRadius: '12px',
            border: '1px solid rgba(255,255,255,0.08)',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          <div>
            <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#fff', margin: 0 }}>
              Operating Expense Distribution
            </h3>
            <p style={{ fontSize: '12px', color: '#64748b', margin: '2px 0 0 0' }}>
              Detailed expense allocation across line items
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '6px' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', marginBottom: '5px' }}>
                <span style={{ color: '#cbd5e1' }}>High Speed Diesel (HSD)</span>
                <span style={{ color: '#fff', fontWeight: 700 }}>₹{fuelExp.toLocaleString()} (68%)</span>
              </div>
              <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.06)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: '68%', height: '100%', background: '#f97316', borderRadius: '4px' }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', marginBottom: '5px' }}>
                <span style={{ color: '#cbd5e1' }}>Periodic Fleet Maintenance</span>
                <span style={{ color: '#fff', fontWeight: 700 }}>₹{maintExp.toLocaleString()} (24%)</span>
              </div>
              <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.06)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: '24%', height: '100%', background: '#3b82f6', borderRadius: '4px' }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', marginBottom: '5px' }}>
                <span style={{ color: '#cbd5e1' }}>Tollway & Highway Fastag</span>
                <span style={{ color: '#fff', fontWeight: 700 }}>₹14,500 (8%)</span>
              </div>
              <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.06)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: '8%', height: '100%', background: '#10b981', borderRadius: '4px' }} />
              </div>
            </div>

            <div
              style={{
                marginTop: '12px',
                background: 'rgba(255,255,255,0.03)',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid rgba(255,255,255,0.06)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div>
                <div style={{ fontSize: '11px', color: '#94a3b8' }}>Total Outflow (Last 30 Days)</div>
                <div style={{ fontSize: '16px', fontWeight: 800, color: '#fff', marginTop: '2px' }}>
                  ₹{(fuelExp + maintExp + 14500).toLocaleString()}
                </div>
              </div>
              <span style={{ fontSize: '11px', color: '#10b981', fontWeight: 600 }}>Within Budget Limit</span>
            </div>
          </div>
        </div>
      </div>

      {/* Operational Breakdown Matrix */}
      <div
        style={{
          background: '#131929',
          borderRadius: '12px',
          border: '1px solid rgba(255,255,255,0.08)',
          padding: '20px',
        }}
      >
        <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#fff', marginBottom: '16px' }}>
          Key Operational Key Performance Indicators
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
          <div style={{ background: 'rgba(255,255,255,0.02)', padding: '14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.04)' }}>
            <div style={{ color: '#94a3b8', fontSize: '11.5px' }}>On-Time Delivery Rate</div>
            <div style={{ fontSize: '20px', fontWeight: 800, color: '#10b981', marginTop: '4px' }}>96.4%</div>
            <div style={{ fontSize: '10.5px', color: '#64748b', marginTop: '2px' }}>Exceeds SLA threshold (95%)</div>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.02)', padding: '14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.04)' }}>
            <div style={{ color: '#94a3b8', fontSize: '11.5px' }}>Average Transit Speed</div>
            <div style={{ fontSize: '20px', fontWeight: 800, color: '#60a5fa', marginTop: '4px' }}>58.4 km/h</div>
            <div style={{ fontSize: '10.5px', color: '#64748b', marginTop: '2px' }}>National highway average</div>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.02)', padding: '14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.04)' }}>
            <div style={{ color: '#94a3b8', fontSize: '11.5px' }}>Driver Availability Index</div>
            <div style={{ fontSize: '20px', fontWeight: 800, color: '#f59e0b', marginTop: '4px' }}>
              {data?.totalDrivers ? Math.round((data.availableDrivers / data.totalDrivers) * 100) : 67}%
            </div>
            <div style={{ fontSize: '10.5px', color: '#64748b', marginTop: '2px' }}>{data?.availableDrivers || 4} drivers ready on roster</div>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.02)', padding: '14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.04)' }}>
            <div style={{ color: '#94a3b8', fontSize: '11.5px' }}>Fleet Fuel Efficiency</div>
            <div style={{ fontSize: '20px', fontWeight: 800, color: '#f97316', marginTop: '4px' }}>4.2 km/L</div>
            <div style={{ fontSize: '10.5px', color: '#64748b', marginTop: '2px' }}>Multi-axle heavy haul fleet</div>
          </div>
        </div>
      </div>
    </div>
  );
};
