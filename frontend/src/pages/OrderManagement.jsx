import React, { useState, useEffect } from 'react';
import { Package, Plus, Search, Edit2, Trash2, RefreshCw, CheckCircle, Clock, XCircle, ArrowRight } from 'lucide-react';
import { orderService } from '../services/orderService';
import { Modal } from '../components/Modal';

export const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [formData, setFormData] = useState({
    orderNumber: '',
    customerName: 'Acme Logistics Global',
    requiredDeliveryDate: '2026-11-28',
    status: 'PENDING',
    priority: 'HIGH',
    pickupAddress: 'Warehouse Depot A, Hyderabad',
    deliveryAddress: 'Distribution Hub, Bengaluru',
    totalWeightKg: 15000,
    totalAmount: 95000,
  });

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await orderService.getOrders({
        status: statusFilter !== 'ALL' ? statusFilter : undefined,
        search: searchTerm || undefined,
      });
      if (res && res.data) {
        setOrders(res.data);
      }
    } catch (err) {
      console.error('Failed to load orders', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchOrders();
  };

  const handleOpenAdd = () => {
    setIsEditing(false);
    setCurrentId(null);
    setFormData({
      orderNumber: 'ORD-2024-' + Math.floor(1000 + Math.random() * 9000),
      customerName: 'Acme Logistics Global',
      requiredDeliveryDate: '2026-11-28',
      status: 'PENDING',
      priority: 'HIGH',
      pickupAddress: 'Warehouse Depot A, Hyderabad',
      deliveryAddress: 'Distribution Hub, Bengaluru',
      totalWeightKg: 15000,
      totalAmount: 95000,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await orderService.updateOrder(currentId, formData);
      } else {
        await orderService.createOrder(formData);
      }
      setShowModal(false);
      fetchOrders();
    } catch (err) {
      alert(err.message || 'Error saving order');
    }
  };

  const handleQuickStatus = async (id, status) => {
    try {
      await orderService.updateStatus(id, status);
      fetchOrders();
    } catch (err) {
      alert(err.message || 'Error updating order status');
    }
  };

  const handleDelete = async (id, orderNum) => {
    if (window.confirm(`Are you sure you want to cancel order ${orderNum}?`)) {
      try {
        await orderService.deleteOrder(id);
        fetchOrders();
      } catch (err) {
        alert(err.message || 'Error deleting order');
      }
    }
  };

  return (
    <div className="module-page animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#fff', margin: 0 }}>Order Management</h1>
          <p style={{ color: '#94a3b8', fontSize: '13.5px', margin: '4px 0 0' }}>
            Customer logistics orders, booking workflows, load capacities, and dispatch authorizations.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn-secondary" onClick={fetchOrders} title="Refresh">
            <RefreshCw size={15} />
            <span>Refresh</span>
          </button>
          <button className="btn-primary" onClick={handleOpenAdd}>
            <Plus size={16} />
            <span>Create Order</span>
          </button>
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '12px', overflowX: 'auto' }}>
        {['ALL', 'PENDING', 'APPROVED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'].map((st) => (
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
              whiteSpace: 'nowrap',
              transition: 'all 0.15s',
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
            <p>Loading logistics orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <div style={{ padding: '60px', textAlign: 'center', color: '#94a3b8' }}>
            <Package size={42} style={{ margin: '0 auto 12px', opacity: 0.5 }} />
            <p style={{ fontSize: '15px', color: '#e2e8f0', fontWeight: '600' }}>No orders found</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
              <thead>
                <tr style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.06)', color: '#94a3b8', textTransform: 'uppercase', fontSize: '11px', letterSpacing: '0.5px' }}>
                  <th style={{ padding: '14px 20px' }}>Order Number</th>
                  <th style={{ padding: '14px 16px' }}>Customer</th>
                  <th style={{ padding: '14px 16px' }}>Route Corridor</th>
                  <th style={{ padding: '14px 16px' }}>Weight / Value</th>
                  <th style={{ padding: '14px 16px' }}>Priority</th>
                  <th style={{ padding: '14px 16px' }}>Status</th>
                  <th style={{ padding: '14px 20px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', color: '#e2e8f0' }}>
                    <td style={{ padding: '14px 20px' }}>
                      <div style={{ fontWeight: '700', color: '#fff', fontSize: '13.5px' }}>{o.orderNumber}</div>
                      <div style={{ fontSize: '11px', color: '#94a3b8' }}>Date: {o.orderDate}</div>
                    </td>
                    <td style={{ padding: '14px 16px', color: '#cbd5e1', fontWeight: '600' }}>{o.customerName}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ color: '#fff', fontSize: '12px' }}>{o.pickupAddress}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#f97316', fontSize: '11.5px' }}>
                        <ArrowRight size={12} />
                        {o.deliveryAddress}
                      </div>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ color: '#fff' }}>₹{Number(o.totalAmount || 0).toLocaleString('en-IN')}</div>
                      <div style={{ fontSize: '11px', color: '#94a3b8' }}>{(o.totalWeightKg / 1000).toFixed(1)} Tons</div>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{
                        padding: '3px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: '700',
                        background: o.priority === 'URGENT' ? 'rgba(239,68,68,0.15)' : o.priority === 'HIGH' ? 'rgba(249,115,22,0.15)' : 'rgba(56,189,248,0.15)',
                        color: o.priority === 'URGENT' ? '#ef4444' : o.priority === 'HIGH' ? '#f97316' : '#38bdf8',
                      }}>
                        {o.priority}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{
                        padding: '3px 9px', borderRadius: '12px', fontSize: '11px', fontWeight: '700',
                        background:
                          o.status === 'APPROVED' ? 'rgba(16,185,129,0.15)' :
                          o.status === 'PENDING' ? 'rgba(245,158,11,0.15)' :
                          o.status === 'COMPLETED' ? 'rgba(56,189,248,0.15)' : 'rgba(239,68,68,0.15)',
                        color:
                          o.status === 'APPROVED' ? '#10b981' :
                          o.status === 'PENDING' ? '#f59e0b' :
                          o.status === 'COMPLETED' ? '#38bdf8' : '#ef4444',
                      }}>
                        {o.status}
                      </span>
                    </td>
                    <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                      {o.status === 'PENDING' && (
                        <button
                          onClick={() => handleQuickStatus(o.id, 'APPROVED')}
                          style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', color: '#10b981', borderRadius: '6px', padding: '4px 8px', fontSize: '11px', fontWeight: '600', cursor: 'pointer', marginRight: '6px' }}
                        >
                          Approve
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(o.id, o.orderNumber)}
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
        title="Create Logistics Order"
      >
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label className="form-label" style={{ color: '#cbd5e1' }}>Customer Name *</label>
            <input
              type="text"
              className="form-input"
              style={{ background: '#1c263d', borderColor: '#2d3b55', color: '#fff' }}
              value={formData.customerName}
              onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label className="form-label" style={{ color: '#cbd5e1' }}>Pickup Location *</label>
              <input
                type="text"
                className="form-input"
                style={{ background: '#1c263d', borderColor: '#2d3b55', color: '#fff' }}
                value={formData.pickupAddress}
                onChange={(e) => setFormData({ ...formData, pickupAddress: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="form-label" style={{ color: '#cbd5e1' }}>Delivery Destination *</label>
              <input
                type="text"
                className="form-input"
                style={{ background: '#1c263d', borderColor: '#2d3b55', color: '#fff' }}
                value={formData.deliveryAddress}
                onChange={(e) => setFormData({ ...formData, deliveryAddress: e.target.value })}
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
            <div>
              <label className="form-label" style={{ color: '#cbd5e1' }}>Weight (KG)</label>
              <input
                type="number"
                className="form-input"
                style={{ background: '#1c263d', borderColor: '#2d3b55', color: '#fff' }}
                value={formData.totalWeightKg}
                onChange={(e) => setFormData({ ...formData, totalWeightKg: parseFloat(e.target.value) })}
              />
            </div>
            <div>
              <label className="form-label" style={{ color: '#cbd5e1' }}>Order Amount (₹)</label>
              <input
                type="number"
                className="form-input"
                style={{ background: '#1c263d', borderColor: '#2d3b55', color: '#fff' }}
                value={formData.totalAmount}
                onChange={(e) => setFormData({ ...formData, totalAmount: parseFloat(e.target.value) })}
              />
            </div>
            <div>
              <label className="form-label" style={{ color: '#cbd5e1' }}>Priority</label>
              <select
                className="form-input"
                style={{ background: '#1c263d', borderColor: '#2d3b55', color: '#fff' }}
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="URGENT">Urgent</option>
              </select>
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
              Confirm Order
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
