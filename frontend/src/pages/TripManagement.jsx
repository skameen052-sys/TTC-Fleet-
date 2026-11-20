import React, { useState, useEffect } from 'react';
import { Route as RouteIcon, Plus, RefreshCw, Trash2, MapPin, Fuel, Gauge } from 'lucide-react';
import { tripService } from '../services/tripService';
import { Modal } from '../components/Modal';

export const TripManagement = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    tripNumber: '',
    vehiclePlate: 'TS-09-UB-8821',
    driverName: 'Rahul Kumar',
    origin: 'Hyderabad',
    destination: 'Bengaluru',
    distanceKm: 569,
    fuelUsedLiters: 140,
    status: 'ACTIVE',
    routeCode: 'RT-HYD-BLR',
  });

  useEffect(() => {
    fetchTrips();
  }, [statusFilter]);

  const fetchTrips = async () => {
    try {
      setLoading(true);
      const res = await tripService.getTrips({
        status: statusFilter !== 'ALL' ? statusFilter : undefined,
      });
      if (res && res.data) {
        setTrips(res.data);
      }
    } catch (err) {
      console.error('Failed to load trips', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setFormData({
      tripNumber: 'TRIP-' + Math.floor(3000 + Math.random() * 7000),
      vehiclePlate: 'TS-09-UB-8821',
      driverName: 'Rahul Kumar',
      origin: 'Hyderabad',
      destination: 'Bengaluru',
      distanceKm: 569,
      fuelUsedLiters: 140,
      status: 'ACTIVE',
      routeCode: 'RT-HYD-BLR',
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await tripService.createTrip(formData);
      setShowModal(false);
      fetchTrips();
    } catch (err) {
      alert(err.message || 'Error scheduling trip');
    }
  };

  const handleDelete = async (id, num) => {
    if (window.confirm(`Delete trip ${num}?`)) {
      try {
        await tripService.deleteTrip(id);
        fetchTrips();
      } catch (err) {
        alert('Failed to delete trip');
      }
    }
  };

  return (
    <div className="module-page animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#fff', margin: 0 }}>Trip Management</h1>
          <p style={{ color: '#94a3b8', fontSize: '13.5px', margin: '4px 0 0' }}>
            Trip manifests, planned vs actual durations, odometer logs, and fuel tracking.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn-secondary" onClick={fetchTrips} title="Refresh">
            <RefreshCw size={15} />
            <span>Refresh</span>
          </button>
          <button className="btn-primary" onClick={handleOpenAdd}>
            <Plus size={16} />
            <span>Create Trip</span>
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '12px' }}>
        {['ALL', 'ACTIVE', 'SCHEDULED', 'COMPLETED', 'CANCELLED'].map((st) => (
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
            {st}
          </button>
        ))}
      </div>

      <div style={{ background: '#111726', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '60px', textAlign: 'center', color: '#94a3b8' }}>
            <RefreshCw size={32} className="spin" style={{ margin: '0 auto 12px' }} />
            <p>Loading trips...</p>
          </div>
        ) : trips.length === 0 ? (
          <div style={{ padding: '60px', textAlign: 'center', color: '#94a3b8' }}>
            <RouteIcon size={42} style={{ margin: '0 auto 12px', opacity: 0.5 }} />
            <p style={{ fontSize: '15px', color: '#e2e8f0', fontWeight: '600' }}>No trips found</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
              <thead>
                <tr style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.06)', color: '#94a3b8', textTransform: 'uppercase', fontSize: '11px', letterSpacing: '0.5px' }}>
                  <th style={{ padding: '14px 20px' }}>Trip #</th>
                  <th style={{ padding: '14px 16px' }}>Hauler / Driver</th>
                  <th style={{ padding: '14px 16px' }}>Corridor</th>
                  <th style={{ padding: '14px 16px' }}>Distance</th>
                  <th style={{ padding: '14px 16px' }}>Fuel Consumption</th>
                  <th style={{ padding: '14px 16px' }}>Status</th>
                  <th style={{ padding: '14px 20px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {trips.map((t) => (
                  <tr key={t.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', color: '#e2e8f0' }}>
                    <td style={{ padding: '14px 20px' }}>
                      <div style={{ fontWeight: '700', color: '#fff', fontSize: '13.5px' }}>{t.tripNumber}</div>
                      <div style={{ fontSize: '11px', color: '#f97316' }}>{t.routeCode || 'Standard Route'}</div>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ color: '#fff', fontWeight: '600' }}>{t.vehiclePlate}</div>
                      <div style={{ fontSize: '11.5px', color: '#10b981' }}>{t.driverName}</div>
                    </td>
                    <td style={{ padding: '14px 16px', color: '#cbd5e1' }}>
                      {t.origin} → {t.destination}
                    </td>
                    <td style={{ padding: '14px 16px', color: '#cbd5e1' }}>
                      {t.distanceKm} KM
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{ color: '#f97316', fontWeight: '600' }}>{t.fuelUsedLiters} Liters</span>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{
                        padding: '3px 9px', borderRadius: '12px', fontSize: '11px', fontWeight: '700',
                        background: t.status === 'ACTIVE' ? 'rgba(249,115,22,0.15)' : 'rgba(16,185,129,0.15)',
                        color: t.status === 'ACTIVE' ? '#f97316' : '#10b981',
                      }}>
                        {t.status}
                      </span>
                    </td>
                    <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                      <button
                        onClick={() => handleDelete(t.id, t.tripNumber)}
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

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Create Transport Trip">
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
              <label className="form-label" style={{ color: '#cbd5e1' }}>Origin Hub</label>
              <input
                type="text"
                className="form-input"
                style={{ background: '#1c263d', borderColor: '#2d3b55', color: '#fff' }}
                value={formData.origin}
                onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="form-label" style={{ color: '#cbd5e1' }}>Destination Hub</label>
              <input
                type="text"
                className="form-input"
                style={{ background: '#1c263d', borderColor: '#2d3b55', color: '#fff' }}
                value={formData.destination}
                onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                required
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '14px' }}>
            <button type="button" className="btn-secondary" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setShowModal(false)}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
              Schedule Trip
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
