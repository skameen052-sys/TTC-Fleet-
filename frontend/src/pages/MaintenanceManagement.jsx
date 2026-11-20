import React, { useState, useEffect } from 'react';
import { Wrench, Plus, Trash2, RefreshCw, AlertTriangle, Calendar, CheckCircle2 } from 'lucide-react';
import { maintenanceService } from '../services/maintenanceService';
import { Modal } from '../components/Modal';

export const MaintenanceManagement = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    vehiclePlate: 'TS-09-UB-8821',
    serviceType: 'SCHEDULED_INSPECTION',
    serviceDate: new Date().toISOString().split('T')[0],
    cost: 14500,
    odometerReading: 140000,
    serviceCenter: 'Tata Commercial Service Center, Hyderabad',
    status: 'COMPLETED',
    nextServiceDueDate: '2027-02-28',
    technicianName: 'Anil Sharma',
    technicianNotes: 'Engine oil filter change, brake shoe lining inspection.',
  });

  useEffect(() => {
    fetchMaintenance();
  }, [statusFilter]);

  const fetchMaintenance = async () => {
    try {
      setLoading(true);
      const res = await maintenanceService.getMaintenanceRecords({
        status: statusFilter !== 'ALL' ? statusFilter : undefined,
      });
      if (res && res.data) {
        setRecords(res.data);
      }
    } catch (err) {
      console.error('Failed to load maintenance records', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setFormData({
      vehiclePlate: 'TS-09-UB-8821',
      serviceType: 'SCHEDULED_INSPECTION',
      serviceDate: new Date().toISOString().split('T')[0],
      cost: 14500,
      odometerReading: 140000,
      serviceCenter: 'Tata Commercial Service Center, Hyderabad',
      status: 'COMPLETED',
      nextServiceDueDate: '2027-02-28',
      technicianName: 'Anil Sharma',
      technicianNotes: '',
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await maintenanceService.createMaintenance(formData);
      setShowModal(false);
      fetchMaintenance();
    } catch (err) {
      alert(err.message || 'Error saving service record');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this maintenance record?')) {
      try {
        await maintenanceService.deleteMaintenance(id);
        fetchMaintenance();
      } catch (err) {
        alert('Failed to delete maintenance record');
      }
    }
  };

  return (
    <div className="module-page animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#fff', margin: 0 }}>Vehicle Maintenance & Repair</h1>
          <p style={{ color: '#94a3b8', fontSize: '13.5px', margin: '4px 0 0' }}>
            Service history, garage schedules, parts replacement, and periodic maintenance alerts.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn-secondary" onClick={fetchMaintenance} title="Refresh">
            <RefreshCw size={15} />
            <span>Refresh</span>
          </button>
          <button className="btn-primary" onClick={handleOpenAdd}>
            <Plus size={16} />
            <span>Log Service Record</span>
          </button>
        </div>
      </div>

      <div style={{ background: '#111726', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '60px', textAlign: 'center', color: '#94a3b8' }}>
            <RefreshCw size={32} className="spin" style={{ margin: '0 auto 12px' }} />
            <p>Loading maintenance records...</p>
          </div>
        ) : records.length === 0 ? (
          <div style={{ padding: '60px', textAlign: 'center', color: '#94a3b8' }}>
            <Wrench size={42} style={{ margin: '0 auto 12px', opacity: 0.5 }} />
            <p style={{ fontSize: '15px', color: '#e2e8f0', fontWeight: '600' }}>No service records found</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
              <thead>
                <tr style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.06)', color: '#94a3b8', textTransform: 'uppercase', fontSize: '11px', letterSpacing: '0.5px' }}>
                  <th style={{ padding: '14px 20px' }}>Vehicle Plate</th>
                  <th style={{ padding: '14px 16px' }}>Service Type</th>
                  <th style={{ padding: '14px 16px' }}>Service Center</th>
                  <th style={{ padding: '14px 16px' }}>Service Cost</th>
                  <th style={{ padding: '14px 16px' }}>Next Due Date</th>
                  <th style={{ padding: '14px 16px' }}>Status</th>
                  <th style={{ padding: '14px 20px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {records.map((r) => (
                  <tr key={r.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', color: '#e2e8f0' }}>
                    <td style={{ padding: '14px 20px', fontWeight: '700', color: '#38bdf8' }}>{r.vehiclePlate}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ color: '#fff', fontWeight: '600' }}>{r.serviceType.replace('_', ' ')}</div>
                      <div style={{ fontSize: '11.5px', color: '#94a3b8' }}>Technician: {r.technicianName}</div>
                    </td>
                    <td style={{ padding: '14px 16px', color: '#cbd5e1' }}>{r.serviceCenter}</td>
                    <td style={{ padding: '14px 16px', color: '#f97316', fontWeight: '700' }}>
                      ₹{Number(r.cost || 0).toLocaleString('en-IN')}
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#cbd5e1', fontSize: '12px' }}>
                        <Calendar size={13} color="#f97316" />
                        {r.nextServiceDueDate || 'Scheduled'}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{
                        padding: '3px 9px', borderRadius: '12px', fontSize: '11px', fontWeight: '700',
                        background: r.status === 'COMPLETED' ? 'rgba(16,185,129,0.15)' : 'rgba(236,72,153,0.15)',
                        color: r.status === 'COMPLETED' ? '#10b981' : '#ec4899',
                      }}>
                        {r.status}
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

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Log Vehicle Maintenance">
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
              <label className="form-label" style={{ color: '#cbd5e1' }}>Service Type</label>
              <select
                className="form-input"
                style={{ background: '#1c263d', borderColor: '#2d3b55', color: '#fff' }}
                value={formData.serviceType}
                onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
              >
                <option value="SCHEDULED_INSPECTION">Scheduled Inspection</option>
                <option value="OIL_CHANGE">Oil & Filter Change</option>
                <option value="BRAKE_SERVICE">Brake Valve & Pads</option>
                <option value="TIRE_ROTATION">Tire Replacement / Alignment</option>
                <option value="ENGINE_OVERHAUL">Engine Overhaul</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label className="form-label" style={{ color: '#cbd5e1' }}>Service Center</label>
              <input
                type="text"
                className="form-input"
                style={{ background: '#1c263d', borderColor: '#2d3b55', color: '#fff' }}
                value={formData.serviceCenter}
                onChange={(e) => setFormData({ ...formData, serviceCenter: e.target.value })}
              />
            </div>
            <div>
              <label className="form-label" style={{ color: '#cbd5e1' }}>Service Cost (₹) *</label>
              <input
                type="number"
                className="form-input"
                style={{ background: '#1c263d', borderColor: '#2d3b55', color: '#fff' }}
                value={formData.cost}
                onChange={(e) => setFormData({ ...formData, cost: parseFloat(e.target.value) })}
                required
              />
            </div>
          </div>

          <div>
            <label className="form-label" style={{ color: '#cbd5e1' }}>Technician Notes</label>
            <textarea
              className="form-input"
              rows={3}
              style={{ background: '#1c263d', borderColor: '#2d3b55', color: '#fff', width: '100%' }}
              value={formData.technicianNotes}
              onChange={(e) => setFormData({ ...formData, technicianNotes: e.target.value })}
            />
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '14px' }}>
            <button type="button" className="btn-secondary" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setShowModal(false)}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
              Save Service Log
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
