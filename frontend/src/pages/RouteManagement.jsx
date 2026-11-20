import React, { useState, useEffect } from 'react';
import { Map, Plus, RefreshCw, Trash2, Edit2, Navigation, ArrowRight } from 'lucide-react';
import { trackingService } from '../services/trackingService';
import { Modal } from '../components/Modal';

export const RouteManagement = () => {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [formData, setFormData] = useState({
    routeCode: '',
    routeName: '',
    originCity: 'Hyderabad',
    destinationCity: 'Bengaluru',
    distanceKm: 569,
    estimatedDurationHours: 8.5,
    waypointsSummary: 'Jadcherla -> Kurnool -> Anantapur',
    tollExpenses: 1450,
    status: 'ACTIVE',
  });

  useEffect(() => {
    fetchRoutes();
  }, []);

  const fetchRoutes = async () => {
    try {
      setLoading(true);
      const res = await trackingService.getRoutes();
      if (res && res.data) {
        setRoutes(res.data);
      }
    } catch (err) {
      console.error('Failed to load routes', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setIsEditing(false);
    setCurrentId(null);
    setFormData({
      routeCode: 'RT-' + Math.floor(100 + Math.random() * 900),
      routeName: '',
      originCity: 'Hyderabad',
      destinationCity: 'Bengaluru',
      distanceKm: 569,
      estimatedDurationHours: 8.5,
      waypointsSummary: 'Jadcherla -> Kurnool -> Anantapur',
      tollExpenses: 1450,
      status: 'ACTIVE',
    });
    setShowModal(true);
  };

  const handleOpenEdit = (r) => {
    setIsEditing(true);
    setCurrentId(r.id);
    setFormData({
      routeCode: r.routeCode,
      routeName: r.routeName,
      originCity: r.originCity,
      destinationCity: r.destinationCity,
      distanceKm: r.distanceKm,
      estimatedDurationHours: r.estimatedDurationHours,
      waypointsSummary: r.waypointsSummary || '',
      tollExpenses: r.tollExpenses || 0,
      status: r.status,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await trackingService.updateRoute(currentId, formData);
      } else {
        await trackingService.createRoute(formData);
      }
      setShowModal(false);
      fetchRoutes();
    } catch (err) {
      alert(err.message || 'Error saving route');
    }
  };

  const handleDelete = async (id, code) => {
    if (window.confirm(`Delete corridor ${code}?`)) {
      try {
        await trackingService.deleteRoute(id);
        fetchRoutes();
      } catch (err) {
        alert('Failed to delete route');
      }
    }
  };

  return (
    <div className="module-page animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#fff', margin: 0 }}>Route Management & Optimization</h1>
          <p style={{ color: '#94a3b8', fontSize: '13.5px', margin: '4px 0 0' }}>
            Freight corridors, waypoints, toll calculations, and mileage planning.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn-secondary" onClick={fetchRoutes} title="Refresh">
            <RefreshCw size={15} />
            <span>Refresh</span>
          </button>
          <button className="btn-primary" onClick={handleOpenAdd}>
            <Plus size={16} />
            <span>Add Route Corridor</span>
          </button>
        </div>
      </div>

      <div style={{ background: '#111726', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '60px', textAlign: 'center', color: '#94a3b8' }}>
            <RefreshCw size={32} className="spin" style={{ margin: '0 auto 12px' }} />
            <p>Loading route corridors...</p>
          </div>
        ) : routes.length === 0 ? (
          <div style={{ padding: '60px', textAlign: 'center', color: '#94a3b8' }}>
            <Map size={42} style={{ margin: '0 auto 12px', opacity: 0.5 }} />
            <p style={{ fontSize: '15px', color: '#e2e8f0', fontWeight: '600' }}>No routes defined</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
              <thead>
                <tr style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.06)', color: '#94a3b8', textTransform: 'uppercase', fontSize: '11px', letterSpacing: '0.5px' }}>
                  <th style={{ padding: '14px 20px' }}>Corridor Code</th>
                  <th style={{ padding: '14px 16px' }}>Route Name</th>
                  <th style={{ padding: '14px 16px' }}>Origin → Destination</th>
                  <th style={{ padding: '14px 16px' }}>Distance / Est Duration</th>
                  <th style={{ padding: '14px 16px' }}>Toll Cost</th>
                  <th style={{ padding: '14px 16px' }}>Status</th>
                  <th style={{ padding: '14px 20px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {routes.map((r) => (
                  <tr key={r.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', color: '#e2e8f0' }}>
                    <td style={{ padding: '14px 20px', fontWeight: '700', color: '#f97316' }}>{r.routeCode}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ fontWeight: '600', color: '#fff' }}>{r.routeName}</div>
                      <div style={{ fontSize: '11.5px', color: '#94a3b8' }}>{r.waypointsSummary}</div>
                    </td>
                    <td style={{ padding: '14px 16px', color: '#cbd5e1' }}>
                      {r.originCity} → {r.destinationCity}
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ color: '#fff' }}>{r.distanceKm} KM</div>
                      <div style={{ fontSize: '11px', color: '#38bdf8' }}>~{r.estimatedDurationHours} Hours</div>
                    </td>
                    <td style={{ padding: '14px 16px', color: '#cbd5e1', fontWeight: '600' }}>
                      ₹{Number(r.tollExpenses || 0).toLocaleString('en-IN')}
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{ color: r.status === 'ACTIVE' ? '#10b981' : '#f59e0b', fontWeight: '600', fontSize: '12px' }}>
                        ● {r.status}
                      </span>
                    </td>
                    <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                      <button
                        onClick={() => handleOpenEdit(r)}
                        style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '6px', marginRight: '6px' }}
                      >
                        <Edit2 size={15} />
                      </button>
                      <button
                        onClick={() => handleDelete(r.id, r.routeCode)}
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

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={isEditing ? 'Edit Route Corridor' : 'Define Route Corridor'}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label className="form-label" style={{ color: '#cbd5e1' }}>Route Code *</label>
              <input
                type="text"
                className="form-input"
                style={{ background: '#1c263d', borderColor: '#2d3b55', color: '#fff' }}
                value={formData.routeCode}
                onChange={(e) => setFormData({ ...formData, routeCode: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="form-label" style={{ color: '#cbd5e1' }}>Route Name *</label>
              <input
                type="text"
                className="form-input"
                style={{ background: '#1c263d', borderColor: '#2d3b55', color: '#fff' }}
                value={formData.routeName}
                onChange={(e) => setFormData({ ...formData, routeName: e.target.value })}
                placeholder="e.g. Hyderabad - Bengaluru Freight Express"
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label className="form-label" style={{ color: '#cbd5e1' }}>Origin City</label>
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
              <label className="form-label" style={{ color: '#cbd5e1' }}>Destination City</label>
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

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label className="form-label" style={{ color: '#cbd5e1' }}>Distance (KM)</label>
              <input
                type="number"
                className="form-input"
                style={{ background: '#1c263d', borderColor: '#2d3b55', color: '#fff' }}
                value={formData.distanceKm}
                onChange={(e) => setFormData({ ...formData, distanceKm: parseFloat(e.target.value) })}
                required
              />
            </div>
            <div>
              <label className="form-label" style={{ color: '#cbd5e1' }}>Estimated Tolls (₹)</label>
              <input
                type="number"
                className="form-input"
                style={{ background: '#1c263d', borderColor: '#2d3b55', color: '#fff' }}
                value={formData.tollExpenses}
                onChange={(e) => setFormData({ ...formData, tollExpenses: parseFloat(e.target.value) })}
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '14px' }}>
            <button type="button" className="btn-secondary" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setShowModal(false)}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
              Save Route
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
