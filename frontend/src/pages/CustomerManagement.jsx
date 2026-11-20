import React, { useState, useEffect } from 'react';
import { Building, Plus, Search, Edit2, Trash2, RefreshCw, Mail, Phone, MapPin, DollarSign } from 'lucide-react';
import { customerService } from '../services/customerService';
import { Modal } from '../components/Modal';

export const CustomerManagement = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [formData, setFormData] = useState({
    customerCode: '',
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
    addressLine: '',
    city: 'Hyderabad',
    state: 'Telangana',
    taxId: '',
    creditLimit: 500000,
    status: 'ACTIVE',
  });

  useEffect(() => {
    fetchCustomers();
  }, [statusFilter]);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const res = await customerService.getCustomers({
        status: statusFilter !== 'ALL' ? statusFilter : undefined,
        search: searchTerm || undefined,
      });
      if (res && res.data) {
        setCustomers(res.data);
      }
    } catch (err) {
      console.error('Failed to load customers', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchCustomers();
  };

  const handleOpenAdd = () => {
    setIsEditing(false);
    setCurrentId(null);
    setFormData({
      customerCode: 'CUST-' + Math.floor(5000 + Math.random() * 5000),
      companyName: '',
      contactPerson: '',
      email: '',
      phone: '',
      addressLine: '',
      city: 'Hyderabad',
      state: 'Telangana',
      taxId: '',
      creditLimit: 500000,
      status: 'ACTIVE',
    });
    setShowModal(true);
  };

  const handleOpenEdit = (c) => {
    setIsEditing(true);
    setCurrentId(c.id);
    setFormData({
      customerCode: c.customerCode || '',
      companyName: c.companyName || '',
      contactPerson: c.contactPerson || '',
      email: c.email || '',
      phone: c.phone || '',
      addressLine: c.addressLine || '',
      city: c.city || '',
      state: c.state || '',
      taxId: c.taxId || '',
      creditLimit: c.creditLimit || 500000,
      status: c.status || 'ACTIVE',
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await customerService.updateCustomer(currentId, formData);
      } else {
        await customerService.createCustomer(formData);
      }
      setShowModal(false);
      fetchCustomers();
    } catch (err) {
      alert(err.message || 'Error saving customer');
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to remove customer ${name}?`)) {
      try {
        await customerService.deleteCustomer(id);
        fetchCustomers();
      } catch (err) {
        alert(err.message || 'Error deleting customer');
      }
    }
  };

  return (
    <div className="module-page animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#fff', margin: 0 }}>Customer Management</h1>
          <p style={{ color: '#94a3b8', fontSize: '13.5px', margin: '4px 0 0' }}>
            Enterprise shippers, contract accounts, credit limits, and billing profiles.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn-secondary" onClick={fetchCustomers} title="Refresh">
            <RefreshCw size={15} />
            <span>Refresh</span>
          </button>
          <button className="btn-primary" onClick={handleOpenAdd}>
            <Plus size={16} />
            <span>Add Customer</span>
          </button>
        </div>
      </div>

      <div style={{ background: '#111726', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <form onSubmit={handleSearch} style={{ display: 'flex', alignItems: 'center', background: '#182238', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px', padding: '6px 12px', width: '300px', gap: '8px' }}>
          <Search size={15} color="#94a3b8" />
          <input
            type="text"
            placeholder="Search company, contact person, GST..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ background: 'transparent', border: 'none', color: '#fff', fontSize: '13px', width: '100%', outline: 'none' }}
          />
        </form>

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

      <div style={{ background: '#111726', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '60px', textAlign: 'center', color: '#94a3b8' }}>
            <RefreshCw size={32} className="spin" style={{ margin: '0 auto 12px' }} />
            <p>Loading enterprise customers...</p>
          </div>
        ) : customers.length === 0 ? (
          <div style={{ padding: '60px', textAlign: 'center', color: '#94a3b8' }}>
            <Building size={42} style={{ margin: '0 auto 12px', opacity: 0.5 }} />
            <p style={{ fontSize: '15px', color: '#e2e8f0', fontWeight: '600' }}>No customers found</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
              <thead>
                <tr style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.06)', color: '#94a3b8', textTransform: 'uppercase', fontSize: '11px', letterSpacing: '0.5px' }}>
                  <th style={{ padding: '14px 20px' }}>Company Name</th>
                  <th style={{ padding: '14px 16px' }}>Contact Person</th>
                  <th style={{ padding: '14px 16px' }}>Contact Details</th>
                  <th style={{ padding: '14px 16px' }}>City / Hub</th>
                  <th style={{ padding: '14px 16px' }}>Credit Limit</th>
                  <th style={{ padding: '14px 16px' }}>Outstanding</th>
                  <th style={{ padding: '14px 16px' }}>Status</th>
                  <th style={{ padding: '14px 20px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((c) => (
                  <tr key={c.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', color: '#e2e8f0' }}>
                    <td style={{ padding: '14px 20px' }}>
                      <div style={{ fontWeight: '700', color: '#fff', fontSize: '13.5px' }}>{c.companyName}</div>
                      <div style={{ fontSize: '11px', color: '#94a3b8' }}>Code: {c.customerCode} | GST: {c.taxId || 'N/A'}</div>
                    </td>
                    <td style={{ padding: '14px 16px', color: '#cbd5e1', fontWeight: '600' }}>{c.contactPerson}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ color: '#fff' }}>{c.phone}</div>
                      <div style={{ fontSize: '11.5px', color: '#94a3b8' }}>{c.email}</div>
                    </td>
                    <td style={{ padding: '14px 16px', color: '#cbd5e1' }}>{c.city}, {c.state}</td>
                    <td style={{ padding: '14px 16px', color: '#10b981', fontWeight: '600' }}>
                      ₹{c.creditLimit ? Number(c.creditLimit).toLocaleString('en-IN') : '0'}
                    </td>
                    <td style={{ padding: '14px 16px', color: '#f97316', fontWeight: '600' }}>
                      ₹{c.outstandingBalance ? Number(c.outstandingBalance).toLocaleString('en-IN') : '0'}
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{ color: c.status === 'ACTIVE' ? '#10b981' : '#ef4444', fontWeight: '600', fontSize: '12px' }}>
                        ● {c.status}
                      </span>
                    </td>
                    <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                      <button
                        onClick={() => handleOpenEdit(c)}
                        style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '6px', marginRight: '6px' }}
                      >
                        <Edit2 size={15} />
                      </button>
                      <button
                        onClick={() => handleDelete(c.id, c.companyName)}
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

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={isEditing ? 'Edit Customer' : 'Register New Customer Account'}
      >
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label className="form-label" style={{ color: '#cbd5e1' }}>Company Name *</label>
              <input
                type="text"
                className="form-input"
                style={{ background: '#1c263d', borderColor: '#2d3b55', color: '#fff' }}
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="form-label" style={{ color: '#cbd5e1' }}>Contact Person *</label>
              <input
                type="text"
                className="form-input"
                style={{ background: '#1c263d', borderColor: '#2d3b55', color: '#fff' }}
                value={formData.contactPerson}
                onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label className="form-label" style={{ color: '#cbd5e1' }}>Email Address *</label>
              <input
                type="email"
                className="form-input"
                style={{ background: '#1c263d', borderColor: '#2d3b55', color: '#fff' }}
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
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
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
            <div>
              <label className="form-label" style={{ color: '#cbd5e1' }}>City</label>
              <input
                type="text"
                className="form-input"
                style={{ background: '#1c263d', borderColor: '#2d3b55', color: '#fff' }}
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
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
              />
            </div>
            <div>
              <label className="form-label" style={{ color: '#cbd5e1' }}>GST / Tax ID</label>
              <input
                type="text"
                className="form-input"
                style={{ background: '#1c263d', borderColor: '#2d3b55', color: '#fff' }}
                value={formData.taxId}
                onChange={(e) => setFormData({ ...formData, taxId: e.target.value })}
                placeholder="GSTIN"
              />
            </div>
          </div>

          <div>
            <label className="form-label" style={{ color: '#cbd5e1' }}>Approved Credit Limit (INR)</label>
            <input
              type="number"
              className="form-input"
              style={{ background: '#1c263d', borderColor: '#2d3b55', color: '#fff' }}
              value={formData.creditLimit}
              onChange={(e) => setFormData({ ...formData, creditLimit: parseFloat(e.target.value) })}
            />
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
              {isEditing ? 'Save Changes' : 'Register Customer'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
