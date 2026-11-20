import React, { useState, useEffect } from 'react';
import { Truck, Plus, Search, Edit2, Trash2, Filter, RefreshCw, CheckCircle2, AlertTriangle, ShieldCheck, Gauge } from 'lucide-react';
import { fleetService } from '../services/fleetService';
import { Modal } from '../components/Modal';

export const FleetManagement = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [formData, setFormData] = useState({
    plateNumber: '',
    vin: '',
    make: 'Tata Motors',
    model: 'Prima 5530.S',
    manufacturingYear: 2023,
    category: 'HEAVY_TRUCK',
    status: 'ACTIVE',
    availability: 'AVAILABLE',
    payloadCapacityKg: 25000,
    fuelType: 'DIESEL',
    odometerKm: 120000,
    currentCity: 'Hyderabad',
    assignedDriverName: '',
  });

  useEffect(() => {
    fetchVehicles();
  }, [categoryFilter, statusFilter]);

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const res = await fleetService.getVehicles({
        category: categoryFilter !== 'ALL' ? categoryFilter : undefined,
        status: statusFilter !== 'ALL' ? statusFilter : undefined,
        search: searchTerm || undefined,
      });
      if (res && res.data) {
        setVehicles(res.data);
      }
    } catch (err) {
      console.error('Failed to load fleet', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchVehicles();
  };

  const handleOpenAdd = () => {
    setIsEditing(false);
    setCurrentId(null);
    setFormData({
      plateNumber: '',
      vin: '',
      make: 'Tata Motors',
      model: 'Prima 5530.S',
      manufacturingYear: 2023,
      category: 'HEAVY_TRUCK',
      status: 'ACTIVE',
      availability: 'AVAILABLE',
      payloadCapacityKg: 25000,
      fuelType: 'DIESEL',
      odometerKm: 100000,
      currentCity: 'Hyderabad',
      assignedDriverName: '',
    });
    setShowModal(true);
  };

  const handleOpenEdit = (v) => {
    setIsEditing(true);
    setCurrentId(v.id);
    setFormData({
      plateNumber: v.plateNumber || '',
      vin: v.vin || '',
      make: v.make || '',
      model: v.model || '',
      manufacturingYear: v.manufacturingYear || 2023,
      category: v.category || 'HEAVY_TRUCK',
      status: v.status || 'ACTIVE',
      availability: v.availability || 'AVAILABLE',
      payloadCapacityKg: v.payloadCapacityKg || 25000,
      fuelType: v.fuelType || 'DIESEL',
      odometerKm: v.odometerKm || 100000,
      currentCity: v.currentCity || '',
      assignedDriverName: v.assignedDriverName || '',
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await fleetService.updateVehicle(currentId, formData);
      } else {
        await fleetService.createVehicle(formData);
      }
      setShowModal(false);
      fetchVehicles();
    } catch (err) {
      alert(err.message || 'Error saving vehicle');
    }
  };

  const handleDelete = async (id, plate) => {
    if (window.confirm(`Are you sure you want to delete vehicle ${plate}?`)) {
      try {
        await fleetService.deleteVehicle(id);
        fetchVehicles();
      } catch (err) {
        alert(err.message || 'Error deleting vehicle');
      }
    }
  };

  // Metrics
  const totalCount = vehicles.length;
  const activeCount = vehicles.filter(v => v.status === 'ACTIVE').length;
  const onTripCount = vehicles.filter(v => v.availability === 'ON_TRIP').length;
  const maintenanceCount = vehicles.filter(v => v.availability === 'IN_MAINTENANCE').length;

  return (
    <div className="module-page animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Top Banner & KPI Summary */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#fff', margin: 0 }}>Fleet Management</h1>
          <p style={{ color: '#94a3b8', fontSize: '13.5px', margin: '4px 0 0' }}>
            Monitor, allocate, and manage enterprise transport vehicles and haulers.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn-secondary" onClick={fetchVehicles} title="Refresh">
            <RefreshCw size={15} />
            <span>Refresh</span>
          </button>
          <button className="btn-primary" onClick={handleOpenAdd}>
            <Plus size={16} />
            <span>Add Vehicle</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
        <div className="kpi-stat-card">
          <div style={{ color: '#94a3b8', fontSize: '12px', fontWeight: '600' }}>TOTAL FLEET</div>
          <div style={{ fontSize: '28px', fontWeight: '800', color: '#fff', marginTop: '6px' }}>{totalCount}</div>
          <div style={{ color: '#10b981', fontSize: '11.5px', marginTop: '4px' }}>Registered Vehicles</div>
        </div>
        <div className="kpi-stat-card">
          <div style={{ color: '#94a3b8', fontSize: '12px', fontWeight: '600' }}>ACTIVE VEHICLES</div>
          <div style={{ fontSize: '28px', fontWeight: '800', color: '#38bdf8', marginTop: '6px' }}>{activeCount}</div>
          <div style={{ color: '#94a3b8', fontSize: '11.5px', marginTop: '4px' }}>Road-Ready Fleet</div>
        </div>
        <div className="kpi-stat-card">
          <div style={{ color: '#94a3b8', fontSize: '12px', fontWeight: '600' }}>ON TRANSIT / TRIP</div>
          <div style={{ fontSize: '28px', fontWeight: '800', color: '#f97316', marginTop: '6px' }}>{onTripCount}</div>
          <div style={{ color: '#f97316', fontSize: '11.5px', marginTop: '4px' }}>Active Freight Dispatches</div>
        </div>
        <div className="kpi-stat-card">
          <div style={{ color: '#94a3b8', fontSize: '12px', fontWeight: '600' }}>MAINTENANCE / BAY</div>
          <div style={{ fontSize: '28px', fontWeight: '800', color: '#ec4899', marginTop: '6px' }}>{maintenanceCount}</div>
          <div style={{ color: '#94a3b8', fontSize: '11.5px', marginTop: '4px' }}>Scheduled Service</div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div style={{ background: '#111726', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <form onSubmit={handleSearch} style={{ display: 'flex', alignItems: 'center', background: '#182238', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px', padding: '6px 12px', width: '300px', gap: '8px' }}>
          <Search size={15} color="#94a3b8" />
          <input
            type="text"
            placeholder="Search plate, model, city..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ background: 'transparent', border: 'none', color: '#fff', fontSize: '13px', width: '100%', outline: 'none' }}
          />
        </form>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '12px', color: '#94a3b8' }}>Category:</span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              style={{ background: '#182238', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', color: '#cbd5e1', padding: '6px 10px', fontSize: '12.5px', outline: 'none' }}
            >
              <option value="ALL">All Categories</option>
              <option value="HEAVY_TRUCK">Heavy Truck</option>
              <option value="MEDIUM_HAULER">Medium Hauler</option>
              <option value="CONTAINER_CARRIER">Container Carrier</option>
              <option value="TANKER">Tanker</option>
              <option value="TRAILER">Trailer</option>
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '12px', color: '#94a3b8' }}>Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{ background: '#182238', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', color: '#cbd5e1', padding: '6px 10px', fontSize: '12.5px', outline: 'none' }}
            >
              <option value="ALL">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Fleet Table */}
      <div style={{ background: '#111726', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '60px', textAlign: 'center', color: '#94a3b8' }}>
            <RefreshCw size={32} className="spin" style={{ margin: '0 auto 12px' }} />
            <p>Loading fleet assets...</p>
          </div>
        ) : vehicles.length === 0 ? (
          <div style={{ padding: '60px', textAlign: 'center', color: '#94a3b8' }}>
            <Truck size={42} style={{ margin: '0 auto 12px', opacity: 0.5 }} />
            <p style={{ fontSize: '15px', color: '#e2e8f0', fontWeight: '600' }}>No vehicles found</p>
            <p style={{ fontSize: '13px' }}>Try adjusting your search criteria or add a new vehicle.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
              <thead>
                <tr style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.06)', color: '#94a3b8', textTransform: 'uppercase', fontSize: '11px', letterSpacing: '0.5px' }}>
                  <th style={{ padding: '14px 20px' }}>Vehicle / Plate</th>
                  <th style={{ padding: '14px 16px' }}>Category</th>
                  <th style={{ padding: '14px 16px' }}>Payload</th>
                  <th style={{ padding: '14px 16px' }}>Assigned Driver</th>
                  <th style={{ padding: '14px 16px' }}>Location</th>
                  <th style={{ padding: '14px 16px' }}>Availability</th>
                  <th style={{ padding: '14px 16px' }}>Status</th>
                  <th style={{ padding: '14px 20px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {vehicles.map((v) => (
                  <tr key={v.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', color: '#e2e8f0', transition: 'background 0.15s' }}>
                    <td style={{ padding: '14px 20px' }}>
                      <div style={{ fontWeight: '700', color: '#fff', fontSize: '13.5px' }}>{v.plateNumber}</div>
                      <div style={{ fontSize: '11.5px', color: '#94a3b8' }}>{v.make} {v.model} ({v.manufacturingYear})</div>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{ background: 'rgba(249,115,22,0.1)', color: '#f97316', padding: '3px 8px', borderRadius: '6px', fontSize: '11.5px', fontWeight: '600' }}>
                        {v.category.replace('_', ' ')}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{ color: '#cbd5e1' }}>{(v.payloadCapacityKg / 1000).toFixed(1)} MT</span>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      {v.assignedDriverName ? (
                        <span style={{ color: '#10b981', fontWeight: '600' }}>{v.assignedDriverName}</span>
                      ) : (
                        <span style={{ color: '#64748b', fontStyle: 'italic' }}>Unassigned</span>
                      )}
                    </td>
                    <td style={{ padding: '14px 16px', color: '#cbd5e1' }}>{v.currentCity || 'Depot'}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <span
                        style={{
                          padding: '3px 9px',
                          borderRadius: '12px',
                          fontSize: '11px',
                          fontWeight: '700',
                          background:
                            v.availability === 'AVAILABLE' ? 'rgba(16,185,129,0.15)' :
                            v.availability === 'ON_TRIP' ? 'rgba(249,115,22,0.15)' :
                            v.availability === 'IN_MAINTENANCE' ? 'rgba(236,72,153,0.15)' : 'rgba(148,163,184,0.15)',
                          color:
                            v.availability === 'AVAILABLE' ? '#10b981' :
                            v.availability === 'ON_TRIP' ? '#f97316' :
                            v.availability === 'IN_MAINTENANCE' ? '#ec4899' : '#94a3b8',
                        }}
                      >
                        {v.availability.replace('_', ' ')}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{ color: v.status === 'ACTIVE' ? '#10b981' : '#ef4444', fontWeight: '600', fontSize: '12px' }}>
                        ● {v.status}
                      </span>
                    </td>
                    <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                      <button
                        onClick={() => handleOpenEdit(v)}
                        style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '6px', marginRight: '6px' }}
                        title="Edit Vehicle"
                      >
                        <Edit2 size={15} />
                      </button>
                      <button
                        onClick={() => handleDelete(v.id, v.plateNumber)}
                        style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '6px' }}
                        title="Delete Vehicle"
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

      {/* Add / Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={isEditing ? 'Edit Vehicle Asset' : 'Register New Fleet Vehicle'}
      >
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label className="form-label" style={{ color: '#cbd5e1' }}>License Plate Number *</label>
              <input
                type="text"
                className="form-input"
                style={{ background: '#1c263d', borderColor: '#2d3b55', color: '#fff' }}
                value={formData.plateNumber}
                onChange={(e) => setFormData({ ...formData, plateNumber: e.target.value })}
                placeholder="e.g. TS-09-UB-8821"
                required
              />
            </div>
            <div>
              <label className="form-label" style={{ color: '#cbd5e1' }}>VIN / Chassis Number</label>
              <input
                type="text"
                className="form-input"
                style={{ background: '#1c263d', borderColor: '#2d3b55', color: '#fff' }}
                value={formData.vin}
                onChange={(e) => setFormData({ ...formData, vin: e.target.value })}
                placeholder="VIN-XXXX-XXXX"
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label className="form-label" style={{ color: '#cbd5e1' }}>Make / Manufacturer *</label>
              <input
                type="text"
                className="form-input"
                style={{ background: '#1c263d', borderColor: '#2d3b55', color: '#fff' }}
                value={formData.make}
                onChange={(e) => setFormData({ ...formData, make: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="form-label" style={{ color: '#cbd5e1' }}>Model *</label>
              <input
                type="text"
                className="form-input"
                style={{ background: '#1c263d', borderColor: '#2d3b55', color: '#fff' }}
                value={formData.model}
                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
            <div>
              <label className="form-label" style={{ color: '#cbd5e1' }}>Category</label>
              <select
                className="form-input"
                style={{ background: '#1c263d', borderColor: '#2d3b55', color: '#fff' }}
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                <option value="HEAVY_TRUCK">Heavy Truck</option>
                <option value="MEDIUM_HAULER">Medium Hauler</option>
                <option value="CONTAINER_CARRIER">Container Carrier</option>
                <option value="TANKER">Tanker</option>
                <option value="TRAILER">Trailer</option>
                <option value="LIGHT_DELIVERY">Light Delivery</option>
              </select>
            </div>
            <div>
              <label className="form-label" style={{ color: '#cbd5e1' }}>Availability</label>
              <select
                className="form-input"
                style={{ background: '#1c263d', borderColor: '#2d3b55', color: '#fff' }}
                value={formData.availability}
                onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
              >
                <option value="AVAILABLE">Available</option>
                <option value="ON_TRIP">On Trip</option>
                <option value="IN_MAINTENANCE">In Maintenance</option>
                <option value="RESERVED">Reserved</option>
              </select>
            </div>
            <div>
              <label className="form-label" style={{ color: '#cbd5e1' }}>Status</label>
              <select
                className="form-input"
                style={{ background: '#1c263d', borderColor: '#2d3b55', color: '#fff' }}
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label className="form-label" style={{ color: '#cbd5e1' }}>Capacity (KG)</label>
              <input
                type="number"
                className="form-input"
                style={{ background: '#1c263d', borderColor: '#2d3b55', color: '#fff' }}
                value={formData.payloadCapacityKg}
                onChange={(e) => setFormData({ ...formData, payloadCapacityKg: parseFloat(e.target.value) })}
              />
            </div>
            <div>
              <label className="form-label" style={{ color: '#cbd5e1' }}>Assigned Driver Name</label>
              <input
                type="text"
                className="form-input"
                style={{ background: '#1c263d', borderColor: '#2d3b55', color: '#fff' }}
                value={formData.assignedDriverName}
                onChange={(e) => setFormData({ ...formData, assignedDriverName: e.target.value })}
                placeholder="e.g. Rahul Kumar"
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '14px' }}>
            <button
              type="button"
              className="btn-secondary"
              style={{ flex: 1, justifyContent: 'center' }}
              onClick={() => setShowModal(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              style={{ flex: 1, justifyContent: 'center' }}
            >
              {isEditing ? 'Save Changes' : 'Register Vehicle'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
