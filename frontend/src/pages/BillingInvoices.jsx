import React, { useState, useEffect } from 'react';
import { FileText, Plus, RefreshCw, Trash2, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';
import { billingService } from '../services/billingService';
import { Modal } from '../components/Modal';

export const BillingInvoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    invoiceNumber: '',
    customerName: 'Acme Logistics Global',
    orderNumber: 'ORD-2024-8801',
    dueDate: '2026-12-15',
    subtotal: 100000,
    taxRatePercent: 18,
    taxAmount: 18000,
    totalAmount: 118000,
    status: 'PENDING',
  });

  useEffect(() => {
    fetchInvoices();
  }, [statusFilter]);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const res = await billingService.getInvoices({
        status: statusFilter !== 'ALL' ? statusFilter : undefined,
      });
      if (res && res.data) {
        setInvoices(res.data);
      }
    } catch (err) {
      console.error('Failed to load invoices', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setFormData({
      invoiceNumber: 'INV-2024-' + Math.floor(1000 + Math.random() * 9000),
      customerName: 'Acme Logistics Global',
      orderNumber: 'ORD-2024-8801',
      dueDate: '2026-12-15',
      subtotal: 100000,
      taxRatePercent: 18,
      taxAmount: 18000,
      totalAmount: 118000,
      status: 'PENDING',
    });
    setShowModal(true);
  };

  const handleSubtotalChange = (sub) => {
    const s = parseFloat(sub) || 0;
    const tax = s * 0.18;
    setFormData((prev) => ({
      ...prev,
      subtotal: s,
      taxAmount: tax,
      totalAmount: s + tax,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await billingService.createInvoice(formData);
      setShowModal(false);
      fetchInvoices();
    } catch (err) {
      alert(err.message || 'Error creating invoice');
    }
  };

  const handleMarkPaid = async (id) => {
    try {
      await billingService.updateInvoiceStatus(id, 'PAID');
      fetchInvoices();
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const handleDelete = async (id, num) => {
    if (window.confirm(`Delete invoice ${num}?`)) {
      try {
        await billingService.deleteInvoice(id);
        fetchInvoices();
      } catch (err) {
        alert('Failed to delete invoice');
      }
    }
  };

  return (
    <div className="module-page animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#fff', margin: 0 }}>Billing & Invoices</h1>
          <p style={{ color: '#94a3b8', fontSize: '13.5px', margin: '4px 0 0' }}>
            GST tax invoices, credit settlements, pending accounts receivable, and payment logs.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn-secondary" onClick={fetchInvoices} title="Refresh">
            <RefreshCw size={15} />
            <span>Refresh</span>
          </button>
          <button className="btn-primary" onClick={handleOpenAdd}>
            <Plus size={16} />
            <span>Generate Invoice</span>
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '12px' }}>
        {['ALL', 'PENDING', 'PAID', 'OVERDUE', 'CANCELLED'].map((st) => (
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
            <p>Loading invoices...</p>
          </div>
        ) : invoices.length === 0 ? (
          <div style={{ padding: '60px', textAlign: 'center', color: '#94a3b8' }}>
            <FileText size={42} style={{ margin: '0 auto 12px', opacity: 0.5 }} />
            <p style={{ fontSize: '15px', color: '#e2e8f0', fontWeight: '600' }}>No invoices found</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
              <thead>
                <tr style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.06)', color: '#94a3b8', textTransform: 'uppercase', fontSize: '11px', letterSpacing: '0.5px' }}>
                  <th style={{ padding: '14px 20px' }}>Invoice #</th>
                  <th style={{ padding: '14px 16px' }}>Customer</th>
                  <th style={{ padding: '14px 16px' }}>Due Date</th>
                  <th style={{ padding: '14px 16px' }}>Subtotal</th>
                  <th style={{ padding: '14px 16px' }}>GST (18%)</th>
                  <th style={{ padding: '14px 16px' }}>Total Amount</th>
                  <th style={{ padding: '14px 16px' }}>Status</th>
                  <th style={{ padding: '14px 20px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((inv) => (
                  <tr key={inv.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', color: '#e2e8f0' }}>
                    <td style={{ padding: '14px 20px', fontWeight: '700', color: '#f97316' }}>{inv.invoiceNumber}</td>
                    <td style={{ padding: '14px 16px', color: '#fff', fontWeight: '600' }}>{inv.customerName}</td>
                    <td style={{ padding: '14px 16px', color: '#cbd5e1' }}>{inv.dueDate}</td>
                    <td style={{ padding: '14px 16px', color: '#cbd5e1' }}>₹{Number(inv.subtotal || 0).toLocaleString('en-IN')}</td>
                    <td style={{ padding: '14px 16px', color: '#cbd5e1' }}>₹{Number(inv.taxAmount || 0).toLocaleString('en-IN')}</td>
                    <td style={{ padding: '14px 16px', color: '#10b981', fontWeight: '700' }}>
                      ₹{Number(inv.totalAmount || 0).toLocaleString('en-IN')}
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{
                        padding: '3px 9px', borderRadius: '12px', fontSize: '11px', fontWeight: '700',
                        background: inv.status === 'PAID' ? 'rgba(16,185,129,0.15)' : 'rgba(245,158,11,0.15)',
                        color: inv.status === 'PAID' ? '#10b981' : '#f59e0b',
                      }}>
                        {inv.status}
                      </span>
                    </td>
                    <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                      {inv.status !== 'PAID' && (
                        <button
                          onClick={() => handleMarkPaid(inv.id)}
                          style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', color: '#10b981', borderRadius: '6px', padding: '4px 8px', fontSize: '11px', fontWeight: '600', cursor: 'pointer', marginRight: '6px' }}
                        >
                          Mark Paid
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(inv.id, inv.invoiceNumber)}
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

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Generate GST Invoice">
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
              <label className="form-label" style={{ color: '#cbd5e1' }}>Subtotal (₹) *</label>
              <input
                type="number"
                className="form-input"
                style={{ background: '#1c263d', borderColor: '#2d3b55', color: '#fff' }}
                value={formData.subtotal}
                onChange={(e) => handleSubtotalChange(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="form-label" style={{ color: '#cbd5e1' }}>Total with GST (₹)</label>
              <input
                type="number"
                className="form-input"
                style={{ background: '#1c263d', borderColor: '#2d3b55', color: '#10b981', fontWeight: '700' }}
                value={formData.totalAmount}
                readOnly
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '14px' }}>
            <button type="button" className="btn-secondary" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setShowModal(false)}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
              Issue Invoice
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
