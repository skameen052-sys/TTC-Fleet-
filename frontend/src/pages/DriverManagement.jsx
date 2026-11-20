import React, { useState, useEffect } from 'react';
import { UserCheck, Plus, Search, Edit2, Trash2, RefreshCw, AlertCircle, Calendar, ShieldCheck, Award } from 'lucide-react';
import { fleetService } from '../services/fleetService';
import { Modal } from '../components/Modal';

export const DriverManagement = () => {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [availFilter, setAvailFilter] = useState('ALL');

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [formData, setFormData] = useState({
    driverCode: '',
    fullName: '',
    email: '',
    phone: '',
    licenseNumber: '',
    licenseCategory: 'HEAVY_TRANSPORT',
    licenseExpiryDate: '2026-12-31',
    status: 'ACTIVE',
    availability: 'AVAILABLE',
    experienceYears: 5,
    rating: 4.8,
    emergencyContact: '',
    assignedVehiclePlate: '',
  });

  useEffect(() => {
    fetchDrivers();
  }, [statusFilter, availFilter]);

  const fetchDrivers = async () => {
    try {
      setLoading(true);
      const res = await fleetService.getDrivers({
        status: statusFilter !== 'ALL' ? statusFilter : undefined,
        availability: availFilter !== 'ALL' ? availFilter : undefined,
        search: searchTerm || undefined,
      });
      if (res && res.data) {
        setDrivers(res.data);
      }
    } catch (err) {
      console.error('Failed to load drivers', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchDrivers();
  };

  const handleOpenAdd = () => {
    setIsEditing(false);
    setCurrentId(null);
    setFormData({
      driverCode: 'DRV-' + Math.floor(1000 + Math.random() * 9000),
      fullName: '',
      email: '',
      phone: '',
      licenseNumber: '',
      licenseCategory: 'HEAVY_TRANSPORT',
      licenseExpiryDate: '2026-12-31',
      status: 'ACTIVE',
      availability: 'AVAILABLE',
      experienceYears: 5,
      rating: 4.8,
      emergencyContact: '',
      assignedVehiclePlate: '',
    });
    setShowModal(true);
  };

  const handleOpenEdit = (d) => {
    setIsEditing(true);
    setCurrentId(d.id);
    setFormData({
      driverCode: d.driverCode || '',
      fullName: d.fullName || '',
      email: d.email || '',
      phone: d.phone || '',
      licenseNumber: d.licenseNumber || '',
      licenseCategory: d.licenseCategory || 'HEAVY_TRANSPORT',
      licenseExpiryDate: d.licenseExpiryDate || '',
      status: d.status || 'ACTIVE',
      availability: d.availability || 'AVAILABLE',
      experienceYears: d.experienceYears || 5,
      rating: d.rating || 4.8,
      emergencyContact: d.emergencyContact || '',
      assignedVehiclePlate: d.assignedVehiclePlate || '',
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await fleetService.updateDriver(currentId, formData);
      } else {
        await fleetService.createDriver(formData);
      }
      setShowModal(false);
      fetchDrivers();
    } catch (err) {
      alert(err.message || 'Error saving driver');
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to remove driver ${name}?`)) {
      try {
        await fleetService.deleteDriver(id);
        fetchDrivers();
      } catch (err) {
        alert(err.message || 'Error deleting driver');
      }
    }
  };

  // Metrics
  const totalDrivers = drivers.length;
  const availableDrivers = drivers.filter(d => d.availability === 'AVAILABLE').length;
  const onDutyDrivers = drivers.filter(d => d.availability === 'ON_DUTY').length;

  return (
    <div className="module-page animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Top Banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#fff', margin: 0 }}>Driver Management</h1>
          <p style={{ color: '#94a3b8', fontSize: '13.5px', margin: '4px 0 0' }}>
            Manage commercial drivers, credentials, license validity, and vehicle allocation.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn-secondary" onClick={fetchDrivers} title="Refresh">
            <RefreshCw size={15} />
            <span>Refresh</span>
          </button>
          <button className="btn-primary" onClick={handleOpenAdd}>
            <Plus size={16} />
            <span>Add Driver</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
        <div className="kpi-stat-card">
          <div style={{ color: '#94a3b8', fontSize: '12px', fontWeight: '600' }}>TOTAL DRIVERS</div>
          <div style={{ fontSize: '28px', fontWeight: '800', color: '#fff', marginTop: '6px' }}>{totalDrivers}</div>
          <div style={{ color: '#10b981', fontSize: '11.5px', marginTop: '4px' }}>Certified Operators</div>
        </div>
        <div className="kpi-stat-card">
          <div style={{ color: '#94a3b8', fontSize: '12px', fontWeight: '600' }}>AVAILABLE FOR DISPATCH</div>
          <div style={{ fontSize: '28px', fontWeight: '800', color: '#10b981', marginTop: '6px' }}>{availableDrivers}</div>
          <div style={{ color: '#94a3b8', fontSize: '11.5px', marginTop: '4px' }}>Ready for Trip Assignment</div>
        </div>
        <div className="kpi-stat-card">
          <div style={{ color: '#94a3b8', fontSize: '12px', fontWeight: '600' }}>CURRENTLY ON DUTY</div>
          <div style={{ fontSize: '28px', fontWeight: '800', color: '#f97316', marginTop: '6px' }}>{onDutyDrivers}</div>
          <div style={{ color: '#f97316', fontSize: '11.5px', marginTop: '4px' }}>Active Transit Operations</div>
        </div>
      </div>

      {/* Search & Filters */}
      <div style={{ background: '#111726', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <form onSubmit={handleSearch} style={{ display: 'flex', alignItems: 'center', background: '#182238', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px', padding: '6px 12px', width: '300px', gap: '8px' }}>
          <Search size={15} color="#94a3b8" />
          <input
            type="text"
            placeholder="Search driver name, phone, license..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ background: 'transparent', border: 'none', color: '#fff', fontSize: '13px', width: '100%', outline: 'none' }}
          />
        </form>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '12px', color: '#94a3b8' }}>Availability:</span>
            <select
              value={availFilter}
              onChange={(e) => setAvailFilter(e.target.value)}
              style={{ background: '#182238', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', color: '#cbd5e1', padding: '6px 10px', fontSize: '12.5px', outline: 'none' }}
            >
              <option value="ALL">All Availabilities</option>
              <option value="AVAILABLE">Available</option>
              <option value="ON_DUTY">On Duty</option>
              <option value="ON_LEAVE">On Leave</option>
            </select>
          </div>
        </div>
      </div>

      {/* Drivers Table */}
      <div style={{ background: '#111726', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '60px', textAlign: 'center', color: '#94a3b8' }}>
            <RefreshCw size={32} className="spin" style={{ margin: '0 auto 12px' }} />
            <p>Loading certified drivers...</p>
          </div>
        ) : drivers.length === 0 ? (
          <div style={{ padding: '60px', textAlign: 'center', color: '#94a3b8' }}>
            <UserCheck size={42} style={{ margin: '0 auto 12px', opacity: 0.5 }} />
            <p style={{ fontSize: '15px', color: '#e2e8f0', fontWeight: '600' }}>No drivers registered</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
              <thead>
                <tr style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.06)', color: '#94a3b8', textTransform: 'uppercase', fontSize: '11px', letterSpacing: '0.5px' }}>
                  <th style={{ padding: '14px 20px' }}>Driver</th>
                  <th style={{ padding: '14px 16px' }}>Code</th>
                  <th style={{ padding: '14px 16px' }}>Phone / Emergency</th>
                  <th style={{ padding: '14px 16px' }}>License #</th>
                  <th style={{ padding: '14px 16px' }}>License Expiry</th>
                  <th style={{ padding: '14px 16px' }}>Assigned Hauler</th>
                  <th style={{ padding: '14px 16px' }}>Availability</th>
                  <th style={{ padding: '14px 20px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {drivers.map((d) => (
                  <tr key={d.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', color: '#e2e8f0' }}>
                    <td style={{ padding: '14px 20px' }}>
                      <div style={{ fontWeight: '700', color: '#fff', fontSize: '13.5px' }}>{d.fullName}</div>
                      <div style={{ fontSize: '11.5px', color: '#94a3b8' }}>{d.experienceYears} yrs exp | Rating ★ {d.rating}</div>
                    </td>
                    <td style={{ padding: '14px 16px', color: '#cbd5e1', fontWeight: '600' }}>{d.driverCode}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ color: '#fff' }}>{d.phone}</div>
                      <div style={{ fontSize: '11px', color: '#64748b' }}>Emerg: {d.emergencyContact || 'N/A'}</div>
                    </td>
                    <td style={{ padding: '14px 16px', color: '#cbd5e1' }}>{d.licenseNumber}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#cbd5e1', fontSize: '12px' }}>
                        <Calendar size={13} color="#f97316" />
                        {d.licenseExpiryDate}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      {d.assignedVehiclePlate ? (
                        <span style={{ background: 'rgba(56,189,248,0.1)', color: '#38bdf8', padding: '3px 8px', borderRadius: '6px', fontWeight: '600', fontSize: '12px' }}>
                          {d.assignedVehiclePlate}
                        </span>
                      ) : (
                        <span style={{ color: '#64748b' }}>Unassigned</span>
                      )}
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span
                        style={{
                          padding: '3px 9px',
                          borderRadius: '12px',
                          fontSize: '11px',
                          fontWeight: '700',
                          background:
                            d.availability === 'AVAILABLE' ? 'rgba(16,185,129,0.15)' :
                            d.availability === 'ON_DUTY' ? 'rgba(249,115,22,0.15)' : 'rgba(148,163,184,0.15)',
                          color:
                            d.availability === 'AVAILABLE' ? '#10b981' :
                            d.availability === 'ON_DUTY' ? '#f97316' : '#94a3b8',
                        }}
                      >
                        {d.availability.replace('_', ' ')}
                      </span>
                    </td>
                    <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                      <button
                        onClick={() => handleOpenEdit(d)}
                        style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '6px', marginRight: '6px' }}
                      >
                        <Edit2 size={15} />
                      </button>
                      <button
                        onClick={() => handleDelete(d.id, d.fullName)}
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

      {/* Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={isEditing ? 'Edit Driver Record' : 'Register Commercial Driver'}
      >
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label className="form-label" style={{ color: '#cbd5e1' }}>Driver Code</label>
              <input
                type="text"
                className="form-input"
                style={{ background: '#1c263d', borderColor: '#2d3b55', color: '#fff' }}
                value={formData.driverCode}
                onChange={(e) => setFormData({ ...formData, driverCode: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="form-label" style={{ color: '#cbd5e1' }}>Full Name *</label>
              <input
                type="text"
                className="form-input"
                style={{ background: '#1c263d', borderColor: '#2d3b55', color: '#fff' }}
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label className="form-label" style={{ color: '#cbd5e1' }}>Phone Number *</label>
              <input
                type="text"
                className="form-input"
                style={{ background: '#1c263d', borderColor: '#2d3b55', color: '#fff' }}
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="form-label" style={{ color: '#cbd5e1' }}>Email Address</label>
              <input
                type="email"
                className="form-input"
                style={{ background: '#1c263d', borderColor: '#2d3b55', color: '#fff' }}
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label className="form-label" style={{ color: '#cbd5e1' }}>Commercial License Number *</label>
              <input
                type="text"
                className="form-input"
                style={{ background: '#1c263d', borderColor: '#2d3b55', color: '#fff' }}
                value={formData.licenseNumber}
                onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="form-label" style={{ color: '#cbd5e1' }}>License Expiry Date *</label>
              <input
                type="date"
                className="form-input"
                style={{ background: '#1c263d', borderColor: '#2d3b55', color: '#fff' }}
                value={formData.licenseExpiryDate}
                onChange={(e) => setFormData({ ...formData, licenseExpiryDate: e.target.value })}
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label className="form-label" style={{ color: '#cbd5e1' }}>Availability</label>
              <select
                className="form-input"
                style={{ background: '#1c263d', borderColor: '#2d3b55', color: '#fff' }}
                value={formData.availability}
                onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
              >
                <option value="AVAILABLE">Available</option>
                <option value="ON_DUTY">On Duty</option>
                <option value="ON_LEAVE">On Leave</option>
              </select>
            </div>
            <div>
              <label className="form-label" style={{ color: '#cbd5e1' }}>Assigned Vehicle Plate</label>
              <input
                type="text"
                className="form-input"
                style={{ background: '#1c263d', borderColor: '#2d3b55', color: '#fff' }}
                value={formData.assignedVehiclePlate}
                onChange={(e) => setFormData({ ...formData, assignedVehiclePlate: e.target.value })}
                placeholder="e.g. TS-09-UB-8821"
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
              {isEditing ? 'Save Changes' : 'Register Driver'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
