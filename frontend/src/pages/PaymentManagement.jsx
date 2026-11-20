import React, { useState, useEffect } from 'react';
import { CreditCard, Plus, RefreshCw, RotateCcw, CheckCircle2, Clock, XCircle, Search, AlertCircle, ArrowUpRight } from 'lucide-react';
import { billingService } from '../services/billingService';
import { Modal } from '../components/Modal';

export const PaymentManagement = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  // Record Payment Modal
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    transactionReference: '',
    invoiceNumber: '',
    customerName: '',
    amount: '',
    paymentMethod: 'BANK_TRANSFER',
    status: 'SUCCESS',
    notes: '',
  });

  // Refund Modal
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [selectedTxn, setSelectedTxn] = useState(null);
  const [refundReason, setRefundReason] = useState('Customer cancellation & order revision');
  const [refunding, setRefunding] = useState(false);

  useEffect(() => {
    fetchPayments();
  }, [statusFilter]);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const res = await billingService.getPayments({
        status: statusFilter !== 'ALL' ? statusFilter : undefined,
      });
      if (res && res.data) {
        setPayments(res.data);
      }
    } catch (err) {
      console.error('Failed to load payments', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setFormData({
      transactionReference: 'TXN-' + Date.now().toString().slice(-8),
      invoiceNumber: 'INV-2024-' + Math.floor(1000 + Math.random() * 9000),
      customerName: '',
      amount: '',
      paymentMethod: 'BANK_TRANSFER',
      status: 'SUCCESS',
      notes: '',
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await billingService.recordPayment({
        ...formData,
        amount: parseFloat(formData.amount) || 0,
      });
      setShowModal(false);
      fetchPayments();
    } catch (err) {
      console.error('Failed to record payment', err);
      alert('Failed to record payment transaction');
    } finally {
      setSubmitting(false);
    }
  };

  const handleOpenRefund = (txn) => {
    setSelectedTxn(txn);
    setRefundReason('Customer return / cancellation');
    setShowRefundModal(true);
  };

  const handleConfirmRefund = async () => {
    if (!selectedTxn) return;
    try {
      setRefunding(true);
      await billingService.refundPayment(selectedTxn.id, refundReason);
      setShowRefundModal(false);
      fetchPayments();
    } catch (err) {
      console.error('Failed to refund payment', err);
      alert('Failed to refund payment transaction');
    } finally {
      setRefunding(false);
    }
  };

  const filtered = payments.filter((p) => {
    const term = searchTerm.toLowerCase();
    const matchSearch =
      (p.transactionReference && p.transactionReference.toLowerCase().includes(term)) ||
      (p.invoiceNumber && p.invoiceNumber.toLowerCase().includes(term)) ||
      (p.customerName && p.customerName.toLowerCase().includes(term)) ||
      (p.paymentMethod && p.paymentMethod.toLowerCase().includes(term));
    return matchSearch;
  });

  // Calculate summaries
  const totalCollected = payments
    .filter((p) => p.status === 'SUCCESS')
    .reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0);
  const pendingAmount = payments
    .filter((p) => p.status === 'PENDING')
    .reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0);
  const refundedAmount = payments
    .filter((p) => p.status === 'REFUNDED')
    .reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0);

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#fff', margin: 0 }}>
            Payment Management
          </h2>
          <p style={{ fontSize: '13px', color: '#94a3b8', margin: '4px 0 0 0' }}>
            Track customer payments, digital gateway transactions, and process refunds
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn-secondary" onClick={fetchPayments} disabled={loading}>
            <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
            <span>Refresh</span>
          </button>
          <button className="btn-primary" onClick={handleOpenAdd}>
            <Plus size={16} />
            <span>Record Payment</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px',
        }}
      >
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(15, 23, 42, 0.6))',
            border: '1px solid rgba(16, 185, 129, 0.25)',
            borderRadius: '12px',
            padding: '18px',
          }}
        >
          <div style={{ color: '#10b981', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase' }}>
            Total Collected (Settled)
          </div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: '#fff', marginTop: '6px' }}>
            ₹{totalCollected.toLocaleString()}
          </div>
          <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>
            {payments.filter((p) => p.status === 'SUCCESS').length} Successful Transactions
          </div>
        </div>

        <div
          style={{
            background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(15, 23, 42, 0.6))',
            border: '1px solid rgba(245, 158, 11, 0.25)',
            borderRadius: '12px',
            padding: '18px',
          }}
        >
          <div style={{ color: '#f59e0b', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase' }}>
            Pending Processing
          </div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: '#fff', marginTop: '6px' }}>
            ₹{pendingAmount.toLocaleString()}
          </div>
          <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>
            Awaiting bank reconciliation
          </div>
        </div>

        <div
          style={{
            background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(15, 23, 42, 0.6))',
            border: '1px solid rgba(239, 68, 68, 0.25)',
            borderRadius: '12px',
            padding: '18px',
          }}
        >
          <div style={{ color: '#ef4444', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase' }}>
            Refunded / Reversed
          </div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: '#fff', marginTop: '6px' }}>
            ₹{refundedAmount.toLocaleString()}
          </div>
          <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>
            {payments.filter((p) => p.status === 'REFUNDED').length} Reversals logged
          </div>
        </div>

        <div
          style={{
            background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(15, 23, 42, 0.6))',
            border: '1px solid rgba(59, 130, 246, 0.25)',
            borderRadius: '12px',
            padding: '18px',
          }}
        >
          <div style={{ color: '#60a5fa', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase' }}>
            Total Transactions
          </div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: '#fff', marginTop: '6px' }}>
            {payments.length}
          </div>
          <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>
            Direct Bank, UPI & Cards
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '12px',
          background: '#131929',
          padding: '14px 18px',
          borderRadius: '12px',
          border: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, maxWidth: '380px' }}>
          <Search size={16} color="#64748b" />
          <input
            type="text"
            placeholder="Search reference, invoice #, customer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: '#fff',
              fontSize: '13.5px',
              width: '100%',
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          {['ALL', 'SUCCESS', 'PENDING', 'FAILED', 'REFUNDED'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              style={{
                background: statusFilter === st ? '#f97316' : 'rgba(255,255,255,0.05)',
                color: statusFilter === st ? '#fff' : '#94a3b8',
                border: '1px solid rgba(255,255,255,0.08)',
                padding: '6px 14px',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Payments Table */}
      <div
        style={{
          background: '#131929',
          borderRadius: '12px',
          border: '1px solid rgba(255,255,255,0.08)',
          overflow: 'hidden',
        }}
      >
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
          <thead>
            <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
              <th style={{ padding: '14px 18px', color: '#94a3b8', fontWeight: 600 }}>Reference</th>
              <th style={{ padding: '14px 18px', color: '#94a3b8', fontWeight: 600 }}>Invoice #</th>
              <th style={{ padding: '14px 18px', color: '#94a3b8', fontWeight: 600 }}>Customer</th>
              <th style={{ padding: '14px 18px', color: '#94a3b8', fontWeight: 600 }}>Method</th>
              <th style={{ padding: '14px 18px', color: '#94a3b8', fontWeight: 600 }}>Amount</th>
              <th style={{ padding: '14px 18px', color: '#94a3b8', fontWeight: 600 }}>Status</th>
              <th style={{ padding: '14px 18px', color: '#94a3b8', fontWeight: 600 }}>Date</th>
              <th style={{ padding: '14px 18px', color: '#94a3b8', fontWeight: 600, textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="8" style={{ padding: '36px', textAlign: 'center', color: '#64748b' }}>
                  Loading payment transactions...
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan="8" style={{ padding: '36px', textAlign: 'center', color: '#64748b' }}>
                  No transactions found matching your criteria.
                </td>
              </tr>
            ) : (
              filtered.map((p) => {
                const isSuccess = p.status === 'SUCCESS';
                const isPending = p.status === 'PENDING';
                const isRefunded = p.status === 'REFUNDED';
                const isFailed = p.status === 'FAILED';

                return (
                  <tr
                    key={p.id}
                    style={{
                      borderBottom: '1px solid rgba(255,255,255,0.04)',
                      transition: 'background 0.2s',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.02)')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    <td style={{ padding: '14px 18px', color: '#fff', fontWeight: 600, fontFamily: 'monospace' }}>
                      {p.transactionReference}
                    </td>
                    <td style={{ padding: '14px 18px', color: '#f97316', fontWeight: 500 }}>
                      {p.invoiceNumber}
                    </td>
                    <td style={{ padding: '14px 18px', color: '#e2e8f0' }}>
                      {p.customerName}
                    </td>
                    <td style={{ padding: '14px 18px' }}>
                      <span
                        style={{
                          background: 'rgba(255,255,255,0.06)',
                          color: '#cbd5e1',
                          padding: '4px 10px',
                          borderRadius: '6px',
                          fontSize: '11px',
                          fontWeight: 600,
                        }}
                      >
                        {p.paymentMethod}
                      </span>
                    </td>
                    <td style={{ padding: '14px 18px', color: '#fff', fontWeight: 700 }}>
                      ₹{parseFloat(p.amount || 0).toLocaleString()}
                    </td>
                    <td style={{ padding: '14px 18px' }}>
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '4px 10px',
                          borderRadius: '20px',
                          fontSize: '11px',
                          fontWeight: 700,
                          background: isSuccess
                            ? 'rgba(16, 185, 129, 0.15)'
                            : isPending
                            ? 'rgba(245, 158, 11, 0.15)'
                            : isRefunded
                            ? 'rgba(148, 163, 184, 0.15)'
                            : 'rgba(239, 68, 68, 0.15)',
                          color: isSuccess
                            ? '#10b981'
                            : isPending
                            ? '#f59e0b'
                            : isRefunded
                            ? '#94a3b8'
                            : '#ef4444',
                        }}
                      >
                        {isSuccess && <CheckCircle2 size={12} />}
                        {isPending && <Clock size={12} />}
                        {isRefunded && <RotateCcw size={12} />}
                        {isFailed && <XCircle size={12} />}
                        {p.status}
                      </span>
                    </td>
                    <td style={{ padding: '14px 18px', color: '#94a3b8', fontSize: '12px' }}>
                      {p.transactionDate ? new Date(p.transactionDate).toLocaleDateString() : 'N/A'}
                    </td>
                    <td style={{ padding: '14px 18px', textAlign: 'right' }}>
                      {isSuccess && (
                        <button
                          onClick={() => handleOpenRefund(p)}
                          style={{
                            background: 'rgba(239, 68, 68, 0.1)',
                            border: '1px solid rgba(239, 68, 68, 0.3)',
                            color: '#ef4444',
                            padding: '5px 10px',
                            borderRadius: '6px',
                            fontSize: '11.5px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '5px',
                          }}
                        >
                          <RotateCcw size={12} />
                          <span>Refund</span>
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Record Payment Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Record Payment Transaction">
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '5px' }}>
              Transaction Reference
            </label>
            <input
              type="text"
              required
              className="form-input"
              value={formData.transactionReference}
              onChange={(e) => setFormData({ ...formData, transactionReference: e.target.value })}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '5px' }}>
                Invoice Number
              </label>
              <input
                type="text"
                required
                className="form-input"
                placeholder="e.g. INV-2024-8801"
                value={formData.invoiceNumber}
                onChange={(e) => setFormData({ ...formData, invoiceNumber: e.target.value })}
              />
            </div>
            <div>
              <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '5px' }}>
                Customer Name
              </label>
              <input
                type="text"
                required
                className="form-input"
                placeholder="Customer or Organization"
                value={formData.customerName}
                onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '5px' }}>
                Amount (₹)
              </label>
              <input
                type="number"
                required
                step="any"
                className="form-input"
                placeholder="0.00"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              />
            </div>
            <div>
              <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '5px' }}>
                Payment Method
              </label>
              <select
                className="form-input"
                value={formData.paymentMethod}
                onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
              >
                <option value="BANK_TRANSFER">Bank Transfer (NEFT/RTGS)</option>
                <option value="UPI">UPI / QR Code</option>
                <option value="CREDIT_CARD">Credit / Debit Card</option>
                <option value="CHEQUE">Cheque / Demand Draft</option>
              </select>
            </div>
          </div>

          <div>
            <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '5px' }}>
              Notes / Bank Receipt No.
            </label>
            <textarea
              className="form-input"
              rows="2"
              placeholder="UTR number or receipt notes..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
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
              disabled={submitting}
            >
              {submitting ? 'Recording...' : 'Record Payment'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Process Refund Modal */}
      <Modal
        isOpen={showRefundModal}
        onClose={() => setShowRefundModal(false)}
        title="Process Refund & Reversal"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div
            style={{
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '8px',
              padding: '12px',
              display: 'flex',
              gap: '10px',
              alignItems: 'center',
            }}
          >
            <AlertCircle size={20} color="#ef4444" />
            <div style={{ fontSize: '12.5px', color: '#fca5a5' }}>
              Are you sure you want to refund reference{' '}
              <strong>{selectedTxn?.transactionReference}</strong> for amount{' '}
              <strong>₹{parseFloat(selectedTxn?.amount || 0).toLocaleString()}</strong>?
            </div>
          </div>

          <div>
            <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '5px' }}>
              Refund Reason / Justification
            </label>
            <input
              type="text"
              required
              className="form-input"
              value={refundReason}
              onChange={(e) => setRefundReason(e.target.value)}
              placeholder="e.g. Consignment cancelled, double deduction"
            />
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
            <button
              type="button"
              className="btn-secondary"
              style={{ flex: 1, justifyContent: 'center' }}
              onClick={() => setShowRefundModal(false)}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn-primary"
              style={{ flex: 1, justifyContent: 'center', background: '#ef4444' }}
              onClick={handleConfirmRefund}
              disabled={refunding}
            >
              {refunding ? 'Refunding...' : 'Confirm Refund'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
