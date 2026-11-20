import React, { useState, useEffect } from 'react';
import { Building2, Search, Plus, MapPin, Truck, Users, Edit2, Trash2, UserCheck, RefreshCw } from 'lucide-react';
import { branchService } from '../services/branchService';
import { userService } from '../services/userService';
import { Modal } from '../components/Modal';

export const BranchManagement = () => {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState(null);

  // Available users for assignment
  const [availableUsers, setAvailableUsers] = useState([]);
  const [assignUserId, setAssignUserId] = useState('');
  const [assignRole, setAssignRole] = useState('FLEET_LEAD');

  const [formData, setFormData] = useState({
    branchCode: '',
    branchName: '',
    city: '',
    state: '',
    country: 'India',
    postalCode: '',
    addressLine: '',
    contactEmail: '',
    contactPhone: '',
    status: 'ACTIVE',
    totalVehicles: 10,
  });

  useEffect(() => {
    fetchBranches();
  }, [searchTerm, statusFilter]);

  const fetchBranches = async () => {
    try {
      setLoading(true);
      const res = await branchService.getBranches({
        search: searchTerm || undefined,
        status: statusFilter || undefined,
        size: 50,
      });
      if (res && res.data) {
        setBranches(res.data.content || []);
      }
    } catch (err) {
      console.error('Failed to fetch branches', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBranch = async (e) => {
    e.preventDefault();
    try {
      await branchService.createBranch(formData);
      setShowAddModal(false);
      resetForm();
      fetchBranches();
    } catch (err) {
      alert(err.message || 'Error creating branch');
    }
  };

  const handleUpdateBranch = async (e) => {
    e.preventDefault();
    try {
      await branchService.updateBranch(selectedBranch.id, formData);
      setShowEditModal(false);
      setSelectedBranch(null);
      resetForm();
      fetchBranches();
    } catch (err) {
      alert(err.message || 'Error updating branch');
    }
  };

  const handleDeleteBranch = async (branch) => {
    if (window.confirm(`Are you sure you want to decommission branch "${branch.branchName}"?`)) {
      try {
        await branchService.deleteBranch(branch.id);
        fetchBranches();
      } catch (err) {
        alert('Failed to delete branch');
      }
    }
  };

  const openAssignModal = async (branch) => {
    setSelectedBranch(branch);
    try {
      const res = await userService.getUsers({ size: 100 });
      if (res && res.data) {
        setAvailableUsers(res.data.content || []);
        if (res.data.content?.length > 0) {
          setAssignUserId(res.data.content[0].id);
        }
      }
      setShowAssignModal(true);
    } catch (e) {
      alert('Could not fetch user list');
    }
  };

  const handleConfirmAssign = async (e) => {
    e.preventDefault();
    try {
      await branchService.assignUser(selectedBranch.id, assignUserId, assignRole);
      setShowAssignModal(false);
      alert('User assigned successfully to branch!');
      fetchBranches();
    } catch (err) {
      alert('Assignment failed');
    }
  };

  const openEditModal = (branch) => {
    setSelectedBranch(branch);
    setFormData({
      branchCode: branch.branchCode,
      branchName: branch.branchName,
      city: branch.city,
      state: branch.state,
      country: branch.country || 'India',
      postalCode: branch.postalCode || '',
      addressLine: branch.addressLine || '',
      contactEmail: branch.contactEmail || '',
      contactPhone: branch.contactPhone || '',
      status: branch.status || 'ACTIVE',
      totalVehicles: branch.totalVehicles || 0,
    });
    setShowEditModal(true);
  };

  const resetForm = () => {
    setFormData({
      branchCode: '',
      branchName: '',
      city: '',
      state: '',
      country: 'India',
      postalCode: '',
      addressLine: '',
      contactEmail: '',
      contactPhone: '',
      status: 'ACTIVE',
      totalVehicles: 10,
    });
  };

  const totalAssignedFleet = branches.reduce((acc, b) => acc + (b.totalVehicles || 0), 0);

  return (
    <div className="module-container animate-fade-in">
      {/* Header */}
      <div className="module-header-row">
        <div>
          <h1 className="module-title">Branch & Location Management</h1>
          <p className="module-desc">
            Supervise regional depots, hub vehicle allocations, operational status, and staff deployments.
          </p>
        </div>

        <div className="module-actions-row">
          <button className="btn-secondary" onClick={fetchBranches}>
            <RefreshCw size={15} />
            <span>Refresh</span>
          </button>
          <button
            className="btn-primary"
            onClick={() => {
              resetForm();
              setShowAddModal(true);
            }}
          >
            <Plus size={16} />
            <span>Create Branch</span>
          </button>
        </div>
      </div>

      {/* Mini KPI banner for branches */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
        <div className="dashboard-card" style={{ padding: '16px' }}>
          <div style={{ fontSize: '12px', color: '#94a3b8' }}>Total Regional Hubs</div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: '#0ea5e9', marginTop: '4px' }}>
            {branches.length} Depots
          </div>
        </div>
        <div className="dashboard-card" style={{ padding: '16px' }}>
          <div style={{ fontSize: '12px', color: '#94a3b8' }}>Total Allocated Fleet</div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: '#f97316', marginTop: '4px' }}>
            {totalAssignedFleet} Heavy Trucks
          </div>
        </div>
        <div className="dashboard-card" style={{ padding: '16px' }}>
          <div style={{ fontSize: '12px', color: '#94a3b8' }}>Operational Status</div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: '#10b981', marginTop: '4px' }}>
            100% Active
          </div>
        </div>
      </div>

      {/* Table Card */}
      <div className="fleet-table-card">
        <div className="table-toolbar">
          <div className="table-search-input">
            <Search size={15} />
            <input
              type="text"
              placeholder="Search branch code, name, city..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <select
              className="card-select-pill"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="ACTIVE">Active Hubs</option>
              <option value="UNDER_MAINTENANCE">Under Maintenance</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="fleet-table">
            <thead>
              <tr>
                <th>Branch Code</th>
                <th>Hub Name</th>
                <th>Location</th>
                <th>Vehicles Allocated</th>
                <th>Assigned Staff</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '36px', color: '#94a3b8' }}>
                    Loading branches...
                  </td>
                </tr>
              ) : branches.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '36px', color: '#94a3b8' }}>
                    No branches found.
                  </td>
                </tr>
              ) : (
                branches.map((b) => (
                  <tr key={b.id}>
                    <td>
                      <span style={{ fontWeight: 700, color: '#f97316' }}>{b.branchCode}</span>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, color: '#fff' }}>{b.branchName}</div>
                      <div style={{ fontSize: '11px', color: '#94a3b8' }}>{b.contactEmail}</div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <MapPin size={13} color="#0ea5e9" />
                        <span>{b.city}, {b.state}</span>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <Truck size={14} color="#10b981" />
                        <span style={{ fontWeight: 700 }}>{b.totalVehicles} Vehicles</span>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <Users size={14} color="#a855f7" />
                        <span>{b.assignedUserCount || 0} Members</span>
                      </div>
                    </td>
                    <td>
                      <span className={`status-pill ${b.status === 'ACTIVE' ? 'status-active' : 'status-warning'}`}>
                        {b.status}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '8px' }}>
                        <button
                          className="icon-badge-btn"
                          style={{ width: '30px', height: '30px' }}
                          onClick={() => openAssignModal(b)}
                          title="Assign Staff Member"
                        >
                          <UserCheck size={13} color="#0ea5e9" />
                        </button>
                        <button
                          className="icon-badge-btn"
                          style={{ width: '30px', height: '30px' }}
                          onClick={() => openEditModal(b)}
                          title="Edit Branch"
                        >
                          <Edit2 size={13} />
                        </button>
                        <button
                          className="icon-badge-btn"
                          style={{ width: '30px', height: '30px', color: '#ef4444' }}
                          onClick={() => handleDeleteBranch(b)}
                          title="Decommission Branch"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Branch Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Create New Regional Hub"
      >
        <form onSubmit={handleCreateBranch} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '12px' }}>
            <div>
              <label className="form-label" style={{ color: '#cbd5e1' }}>Branch Code</label>
              <input
                type="text"
                className="form-input"
                style={{ background: '#1c263d', borderColor: '#2d3b55', color: '#fff' }}
                value={formData.branchCode}
                onChange={(e) => setFormData({ ...formData, branchCode: e.target.value.toUpperCase() })}
                placeholder="e.g. BOM-02"
                required
              />
            </div>
            <div>
              <label className="form-label" style={{ color: '#cbd5e1' }}>Branch Name</label>
              <input
                type="text"
                className="form-input"
                style={{ background: '#1c263d', borderColor: '#2d3b55', color: '#fff' }}
                value={formData.branchName}
                onChange={(e) => setFormData({ ...formData, branchName: e.target.value })}
                placeholder="e.g. Mumbai North Freight Hub"
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label className="form-label" style={{ color: '#cbd5e1' }}>City</label>
              <input
                type="text"
                className="form-input"
                style={{ background: '#1c263d', borderColor: '#2d3b55', color: '#fff' }}
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="form-label" style={{ color: '#cbd5e1' }}>State</label>
              <input
                type="text"
                className="form-input"
                style={{ background: '#1c263d', borderColor: '#2d3b55', color: '#fff' }}
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label className="form-label" style={{ color: '#cbd5e1' }}>Contact Email</label>
              <input
                type="email"
                className="form-input"
                style={{ background: '#1c263d', borderColor: '#2d3b55', color: '#fff' }}
                value={formData.contactEmail}
                onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
              />
            </div>
            <div>
              <label className="form-label" style={{ color: '#cbd5e1' }}>Initial Vehicles</label>
              <input
                type="number"
                className="form-input"
                style={{ background: '#1c263d', borderColor: '#2d3b55', color: '#fff' }}
                value={formData.totalVehicles}
                onChange={(e) => setFormData({ ...formData, totalVehicles: parseInt(e.target.value || '0') })}
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '14px' }}>
            <button
              type="button"
              className="btn-secondary"
              style={{ flex: 1, justifyContent: 'center' }}
              onClick={() => setShowAddModal(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              style={{ flex: 1, justifyContent: 'center' }}
            >
              Save Branch
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Branch Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Regional Hub"
      >
        <form onSubmit={handleUpdateBranch} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label className="form-label" style={{ color: '#cbd5e1' }}>Branch Name</label>
            <input
              type="text"
              className="form-input"
              style={{ background: '#1c263d', borderColor: '#2d3b55', color: '#fff' }}
              value={formData.branchName}
              onChange={(e) => setFormData({ ...formData, branchName: e.target.value })}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label className="form-label" style={{ color: '#cbd5e1' }}>City</label>
              <input
                type="text"
                className="form-input"
                style={{ background: '#1c263d', borderColor: '#2d3b55', color: '#fff' }}
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="form-label" style={{ color: '#cbd5e1' }}>State</label>
              <input
                type="text"
                className="form-input"
                style={{ background: '#1c263d', borderColor: '#2d3b55', color: '#fff' }}
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label className="form-label" style={{ color: '#cbd5e1' }}>Total Vehicles</label>
              <input
                type="number"
                className="form-input"
                style={{ background: '#1c263d', borderColor: '#2d3b55', color: '#fff' }}
                value={formData.totalVehicles}
                onChange={(e) => setFormData({ ...formData, totalVehicles: parseInt(e.target.value || '0') })}
              />
            </div>
            <div>
              <label className="form-label" style={{ color: '#cbd5e1' }}>Status</label>
              <select
                className="form-input"
                style={{ background: '#1c263d', borderColor: '#2d3b55', color: '#fff' }}
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="ACTIVE">ACTIVE</option>
                <option value="UNDER_MAINTENANCE">UNDER MAINTENANCE</option>
                <option value="INACTIVE">INACTIVE</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '14px' }}>
            <button
              type="button"
              className="btn-secondary"
              style={{ flex: 1, justifyContent: 'center' }}
              onClick={() => setShowEditModal(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              style={{ flex: 1, justifyContent: 'center' }}
            >
              Update Hub
            </button>
          </div>
        </form>
      </Modal>

      {/* Staff Allocation Modal */}
      <Modal
        isOpen={showAssignModal}
        onClose={() => setShowAssignModal(false)}
        title={`Allocate Personnel to ${selectedBranch?.branchName}`}
      >
        <form onSubmit={handleConfirmAssign} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label className="form-label" style={{ color: '#cbd5e1' }}>Select Team Member</label>
            <select
              className="form-input"
              style={{ background: '#1c263d', borderColor: '#2d3b55', color: '#fff' }}
              value={assignUserId}
              onChange={(e) => setAssignUserId(e.target.value)}
            >
              {availableUsers.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.fullName} ({u.email}) - {u.department || 'Operations'}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="form-label" style={{ color: '#cbd5e1' }}>Hub Assignment Role</label>
            <select
              className="form-input"
              style={{ background: '#1c263d', borderColor: '#2d3b55', color: '#fff' }}
              value={assignRole}
              onChange={(e) => setAssignRole(e.target.value)}
            >
              <option value="BRANCH_MANAGER">Hub Operations Manager</option>
              <option value="DISPATCHER">Regional Dispatch Lead</option>
              <option value="FLEET_LEAD">Fleet Diagnostics Lead</option>
              <option value="STAFF">Terminal Staff</option>
            </select>
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '14px' }}>
            <button
              type="button"
              className="btn-secondary"
              style={{ flex: 1, justifyContent: 'center' }}
              onClick={() => setShowAssignModal(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              style={{ flex: 1, justifyContent: 'center' }}
            >
              Assign Member
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
