import React, { useState, useEffect } from 'react';
import { Navigation, Plus, Search, Trash2, RefreshCw, MapPin, Truck, Calendar, CheckCircle2 } from 'lucide-react';
import { shipmentService } from '../services/shipmentService';
import { Modal } from '../components/Modal';

export const ShipmentManagement = () => {
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    shipmentNumber: '',
    trackingCode: '',
    vehiclePlate: 'TS-09-UB-8821',
    driverName: 'Rahul Kumar',
    originCity: 'Hyderabad',
    destinationCity: 'Bengaluru',
    cargoDescription: 'Heavy Commercial Cargo',
    weightKg: 18000,
    status: 'IN_TRANSIT',
  });

  useEffect(() => {
    fetchShipments();
  }, [statusFilter]);

  const fetchShipments = async () => {
    try {
      setLoading(true);
      const res = await shipmentService.getShipments({
        status: statusFilter !== 'ALL' ? statusFilter : undefined,
        search: searchTerm || undefined,
      });
      if (res && res.data) {
        setShipments(res.data);
      }
    } catch (err) {
      console.error('Failed to load shipments', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setFormData({
      shipmentNumber: 'SHP-' + Math.floor(7000 + Math.random() * 2000),
      trackingCode: 'TRK-' + Math.floor(1000 + Math.random() * 9000),
      vehiclePlate: 'TS-09-UB-8821',
      driverName: 'Rahul Kumar',
      originCity: 'Hyderabad',
      destinationCity: 'Bengaluru',
      cargoDescription: 'Heavy Commercial Cargo',
      weightKg: 18000,
      status: 'IN_TRANSIT',
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await shipmentService.createShipment(formData);
      setShowModal(false);
      fetchShipments();
    } catch (err) {
      alert(err.message || 'Error creating shipment');
    }
  };

  const handleDelete = async (id, code) => {
    if (window.confirm(`Delete shipment ${code}?`)) {
      try {
        await shipmentService.deleteShipment(id);
        fetchShipments();
      } catch (err) {
        alert('Failed to delete shipment');
      }
    }
  };

  return (
    <div className="module-page animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#fff', margin: 0 }}>Shipment Management</h1>
          <p style={{ color: '#94a3b8', fontSize: '13.5px', margin: '4px 0 0' }}>
            Real-time tracking of active freights, in-transit consignments, and proof of deliveries.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn-secondary" onClick={fetchShipments} title="Refresh">
            <RefreshCw size={15} />
            <span>Refresh</span>
          </button>
          <button className="btn-primary" onClick={handleOpenAdd}>
            <Plus size={16} />
            <span>New Shipment</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '12px' }}>
        {['ALL', 'IN_TRANSIT', 'DELIVERED', 'DELAYED', 'PENDING'].map((st) => (
          <button
            key={st}
            onClick={() => setStatusFilter(st)}
            style={{
              background: statusFilter === st ? '#f97316' : 'rgba(255,255,255,0.04)',
              color: statusFilter === st ? '#fff' : '#cbd5e1',
              border: 'none',
              borderRadius: '8px',
              padding: '7px 14px',
              fontSize: '12.5px',
              fontWeight: '600',
              cursor: 'pointer',
            }}
          >
            {st.replace('_', ' ')}
          </button>
        ))}
      </div>

      <div style={{ background: '#111726', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '60px', textAlign: 'center', color: '#94a3b8' }}>
            <RefreshCw size={32} className="spin" style={{ margin: '0 auto 12px' }} />
            <p>Loading active shipments...</p>
          </div>
        ) : shipments.length === 0 ? (
          <div style={{ padding: '60px', textAlign: 'center', color: '#94a3b8' }}>
            <Navigation size={42} style={{ margin: '0 auto 12px', opacity: 0.5 }} />
            <p style={{ fontSize: '15px', color: '#e2e8f0', fontWeight: '600' }}>No shipments found</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
              <thead>
                <tr style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.06)', color: '#94a3b8', textTransform: 'uppercase', fontSize: '11px', letterSpacing: '0.5px' }}>
                  <th style={{ padding: '14px 20px' }}>Tracking Code</th>
                  <th style={{ padding: '14px 16px' }}>Hauler / Driver</th>
                  <th style={{ padding: '14px 16px' }}>Origin → Destination</th>
                  <th style={{ padding: '14px 16px' }}>Current Location</th>
                  <th style={{ padding: '14px 16px' }}>Cargo Weight</th>
                  <th style={{ padding: '14px 16px' }}>Status</th>
                  <th style={{ padding: '14px 20px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {shipments.map((s) => (
                  <tr key={s.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', color: '#e2e8f0' }}>
                    <td style={{ padding: '14px 20px' }}>
                      <div style={{ fontWeight: '700', color: '#f97316', fontSize: '13.5px' }}>{s.trackingCode}</div>
                      <div style={{ fontSize: '11px', color: '#94a3b8' }}>Shipment #{s.shipmentNumber}</div>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ color: '#fff', fontWeight: '600' }}>{s.vehiclePlate}</div>
                      <div style={{ fontSize: '11.5px', color: '#10b981' }}>{s.driverName}</div>
                    </td>
                    <td style={{ padding: '14px 16px', color: '#cbd5e1' }}>
                      <span style={{ fontWeight: '600', color: '#fff' }}>{s.originCity}</span> → <span style={{ fontWeight: '600', color: '#fff' }}>{s.destinationCity}</span>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#cbd5e1', fontSize: '12px' }}>
                        <MapPin size={13} color="#f97316" />
                        {s.currentLocation || 'In Transit on Corridor'}
                      </div>
                    </td>
                    <td style={{ padding: '14px 16px', color: '#cbd5e1' }}>
                      {(s.weightKg / 1000).toFixed(1)} MT
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{
                        padding: '3px 9px', borderRadius: '12px', fontSize: '11px', fontWeight: '700',
                        background:
                          s.status === 'DELIVERED' ? 'rgba(16,185,129,0.15)' :
                          s.status === 'IN_TRANSIT' ? 'rgba(249,115,22,0.15)' :
                          s.status === 'DELAYED' ? 'rgba(239,68,68,0.15)' : 'rgba(148,163,184,0.15)',
                        color:
                          s.status === 'DELIVERED' ? '#10b981' :
                          s.status === 'IN_TRANSIT' ? '#f97316' :
                          s.status === 'DELAYED' ? '#ef4444' : '#94a3b8',
                      }}>
                        {s.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                      <button
                        onClick={() => handleDelete(s.id, s.trackingCode)}
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

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Dispatch New Shipment">
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
              <label className="form-label" style={{ color: '#cbd5e1' }}>Assigned Driver *</label>
              <input
                type="text"
                className="form-input"
                style={{ background: '#1c263d', borderColor: '#2d3b55', color: '#fff' }}
                value={formData.driverName}
                onChange={(e) => setFormData({ ...formData, driverName: e.target.value })}
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label className="form-label" style={{ color: '#cbd5e1' }}>Origin City *</label>
              <input
                type="text"
                className="form-input"
                style={{ background: '#1c263d', borderColor: '#2d3b55', color: '#fff' }}
                value={formData.originCity}
                onChange={(e) => setFormData({ ...formData, originCity: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="form-label" style={{ color: '#cbd5e1' }}>Destination City *</label>
              <input
                type="text"
                className="form-input"
                style={{ background: '#1c263d', borderColor: '#2d3b55', color: '#fff' }}
                value={formData.destinationCity}
                onChange={(e) => setFormData({ ...formData, destinationCity: e.target.value })}
                required
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '14px' }}>
            <button type="button" className="btn-secondary" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setShowModal(false)}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
              Dispatch Consignment
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
