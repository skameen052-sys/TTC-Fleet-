import React, { useState, useEffect } from 'react';
import { Fuel, Plus, Search, Trash2, RefreshCw, DollarSign, Calendar, TrendingUp } from 'lucide-react';
import { fuelService } from '../services/fuelService';
import { Modal } from '../components/Modal';

export const FuelManagement = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    vehiclePlate: 'TS-09-UB-8821',
    driverName: 'Rahul Kumar',
    recordDate: new Date().toISOString().split('T')[0],
    liters: 140,
    costPerLiter: 94.50,
    totalCost: 13230,
    odometerReading: 142500,
    fuelStation: 'IOCL Highway Depot, Shadnagar',
    paymentMethod: 'FLEET_CARD',
    receiptNumber: '',
  });

  useEffect(() => {
    fetchFuel();
  }, []);

  const fetchFuel = async () => {
    try {
      setLoading(true);
      const res = await fuelService.getFuelRecords();
      if (res && res.data) {
        setRecords(res.data);
      }
    } catch (err) {
      console.error('Failed to load fuel records', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setFormData({
      vehiclePlate: 'TS-09-UB-8821',
      driverName: 'Rahul Kumar',
      recordDate: new Date().toISOString().split('T')[0],
      liters: 140,
      costPerLiter: 94.50,
      totalCost: 13230,
      odometerReading: 142500,
      fuelStation: 'IOCL Highway Depot, Shadnagar',
      paymentMethod: 'FLEET_CARD',
      receiptNumber: 'REC-' + Math.floor(10000 + Math.random() * 90000),
    });
    setShowModal(true);
  };

  const handleLitersOrCostChange = (liters, rate) => {
    const l = parseFloat(liters) || 0;
    const r = parseFloat(rate) || 0;
    setFormData((prev) => ({
      ...prev,
      liters: l,
      costPerLiter: r,
      totalCost: Math.round(l * r),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await fuelService.createFuelRecord(formData);
      setShowModal(false);
      fetchFuel();
    } catch (err) {
      alert(err.message || 'Error saving fuel record');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this fuel record?')) {
      try {
        await fuelService.deleteFuelRecord(id);
        fetchFuel();
      } catch (err) {
        alert('Failed to delete fuel record');
      }
    }
  };

  const totalFuelSpend = records.reduce((sum, r) => sum + Number(r.totalCost || 0), 0);
  const totalLiters = records.reduce((sum, r) => sum + Number(r.liters || 0), 0);

  return (
    <div className="module-page animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#fff', margin: 0 }}>Fuel Management & Expenses</h1>
          <p style={{ color: '#94a3b8', fontSize: '13.5px', margin: '4px 0 0' }}>
            Bunk receipts, fleet fuel card reconciliations, diesel consumption, and mileage telemetry.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn-secondary" onClick={fetchFuel} title="Refresh">
            <RefreshCw size={15} />
            <span>Refresh</span>
          </button>
          <button className="btn-primary" onClick={handleOpenAdd}>
            <Plus size={16} />
            <span>Log Fuel Entry</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        <div className="kpi-stat-card">
          <div style={{ color: '#94a3b8', fontSize: '12px', fontWeight: '600' }}>TOTAL FUEL EXPENSES</div>
          <div style={{ fontSize: '28px', fontWeight: '800', color: '#f97316', marginTop: '6px' }}>
            ₹{totalFuelSpend.toLocaleString('en-IN')}
          </div>
          <div style={{ color: '#94a3b8', fontSize: '11.5px', marginTop: '4px' }}>Reconciled Fleet Cards</div>
        </div>
        <div className="kpi-stat-card">
          <div style={{ color: '#94a3b8', fontSize: '12px', fontWeight: '600' }}>TOTAL DIESEL / LNG FILLED</div>
          <div style={{ fontSize: '28px', fontWeight: '800', color: '#38bdf8', marginTop: '6px' }}>
            {totalLiters.toFixed(0)} <span style={{ fontSize: '14px' }}>Liters</span>
          </div>
          <div style={{ color: '#10b981', fontSize: '11.5px', marginTop: '4px' }}>Avg Consumption Rate: 3.8 km/L</div>
        </div>
      </div>

      <div style={{ background: '#111726', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '60px', textAlign: 'center', color: '#94a3b8' }}>
            <RefreshCw size={32} className="spin" style={{ margin: '0 auto 12px' }} />
            <p>Loading fuel records...</p>
          </div>
        ) : records.length === 0 ? (
          <div style={{ padding: '60px', textAlign: 'center', color: '#94a3b8' }}>
            <Fuel size={42} style={{ margin: '0 auto 12px', opacity: 0.5 }} />
            <p style={{ fontSize: '15px', color: '#e2e8f0', fontWeight: '600' }}>No fuel records found</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
              <thead>
                <tr style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.06)', color: '#94a3b8', textTransform: 'uppercase', fontSize: '11px', letterSpacing: '0.5px' }}>
                  <th style={{ padding: '14px 20px' }}>Date / Station</th>
                  <th style={{ padding: '14px 16px' }}>Vehicle Plate</th>
                  <th style={{ padding: '14px 16px' }}>Driver</th>
                  <th style={{ padding: '14px 16px' }}>Liters</th>
                  <th style={{ padding: '14px 16px' }}>Rate / Liter</th>
                  <th style={{ padding: '14px 16px' }}>Total Amount</th>
                  <th style={{ padding: '14px 16px' }}>Payment Mode</th>
                  <th style={{ padding: '14px 20px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {records.map((r) => (
                  <tr key={r.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', color: '#e2e8f0' }}>
                    <td style={{ padding: '14px 20px' }}>
                      <div style={{ fontWeight: '700', color: '#fff', fontSize: '13px' }}>{r.recordDate}</div>
                      <div style={{ fontSize: '11.5px', color: '#94a3b8' }}>{r.fuelStation}</div>
                    </td>
                    <td style={{ padding: '14px 16px', color: '#38bdf8', fontWeight: '700' }}>{r.vehiclePlate}</td>
                    <td style={{ padding: '14px 16px', color: '#cbd5e1' }}>{r.driverName}</td>
                    <td style={{ padding: '14px 16px', color: '#fff', fontWeight: '600' }}>{r.liters} L</td>
                    <td style={{ padding: '14px 16px', color: '#cbd5e1' }}>₹{r.costPerLiter}</td>
                    <td style={{ padding: '14px 16px', color: '#f97316', fontWeight: '700' }}>
                      ₹{Number(r.totalCost || 0).toLocaleString('en-IN')}
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{ background: 'rgba(255,255,255,0.06)', padding: '3px 8px', borderRadius: '6px', fontSize: '11.5px', color: '#cbd5e1' }}>
                        {r.paymentMethod}
                      </span>
                    </td>
                    <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                      <button
                        onClick={() => handleDelete(r.id)}
                        style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '6px' }}
                      >
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Log Fuel Record">
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label className="form-label" style={{ color: '#cbd5e1' }}>Vehicle Plate *</label>
              <input
                type="text"
                className="form-input"
                style={{ background: '#1c263d', borderColor: '#2d3b55', color: '#fff' }}
                value={formData.vehiclePlate}
                onChange={(e) => setFormData({ ...formData, vehiclePlate: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="form-label" style={{ color: '#cbd5e1' }}>Driver Name</label>
              <input
                type="text"
                className="form-input"
                style={{ background: '#1c263d', borderColor: '#2d3b55', color: '#fff' }}
                value={formData.driverName}
                onChange={(e) => setFormData({ ...formData, driverName: e.target.value })}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
            <div>
              <label className="form-label" style={{ color: '#cbd5e1' }}>Liters *</label>
              <input
                type="number"
                className="form-input"
                style={{ background: '#1c263d', borderColor: '#2d3b55', color: '#fff' }}
                value={formData.liters}
                onChange={(e) => handleLitersOrCostChange(e.target.value, formData.costPerLiter)}
                required
              />
            </div>
            <div>
              <label className="form-label" style={{ color: '#cbd5e1' }}>Cost / Liter (₹) *</label>
              <input
                type="number"
                step="0.01"
                className="form-input"
                style={{ background: '#1c263d', borderColor: '#2d3b55', color: '#fff' }}
                value={formData.costPerLiter}
                onChange={(e) => handleLitersOrCostChange(formData.liters, e.target.value)}
                required
              />
            </div>
            <div>
              <label className="form-label" style={{ color: '#cbd5e1' }}>Total Cost (₹)</label>
              <input
                type="number"
                className="form-input"
                style={{ background: '#1c263d', borderColor: '#2d3b55', color: '#f97316', fontWeight: '700' }}
                value={formData.totalCost}
                readOnly
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label className="form-label" style={{ color: '#cbd5e1' }}>Fuel Station</label>
              <input
                type="text"
                className="form-input"
                style={{ background: '#1c263d', borderColor: '#2d3b55', color: '#fff' }}
                value={formData.fuelStation}
                onChange={(e) => setFormData({ ...formData, fuelStation: e.target.value })}
              />
            </div>
            <div>
              <label className="form-label" style={{ color: '#cbd5e1' }}>Payment Mode</label>
              <select
                className="form-input"
                style={{ background: '#1c263d', borderColor: '#2d3b55', color: '#fff' }}
                value={formData.paymentMethod}
                onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
              >
                <option value="FLEET_CARD">Fleet Card</option>
                <option value="CORPORATE_ACCOUNT">Corporate Account</option>
                <option value="UPI">UPI</option>
                <option value="CASH">Cash</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '14px' }}>
            <button type="button" className="btn-secondary" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setShowModal(false)}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
              Save Entry
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
