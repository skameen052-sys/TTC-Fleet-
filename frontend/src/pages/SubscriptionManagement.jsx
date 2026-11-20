import React, { useState, useEffect } from 'react';
import { CreditCard, Crown, Check, AlertCircle, RefreshCw, Receipt, Clock, DollarSign, CheckCircle2 } from 'lucide-react';
import { subscriptionService } from '../services/subscriptionService';
import { Modal } from '../components/Modal';

export const SubscriptionManagement = () => {
  const [activeTab, setActiveTab] = useState('plans'); // 'plans', 'subscriptions', 'payments'
  const [plans, setPlans] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Renew modal
  const [showRenewModal, setShowRenewModal] = useState(false);
  const [selectedSub, setSelectedSub] = useState(null);
  const [billingCycle, setBillingCycle] = useState('MONTHLY');
  const [renewing, setRenewing] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'plans') {
        const res = await subscriptionService.getPlans();
        if (res && res.data) setPlans(res.data);
      } else if (activeTab === 'subscriptions') {
        const res = await subscriptionService.getSubscriptions({ size: 50 });
        if (res && res.data) setSubscriptions(res.data.content || []);
      } else if (activeTab === 'payments') {
        const res = await subscriptionService.getPayments({ size: 50 });
        if (res && res.data) setPayments(res.data.content || []);
      }
    } catch (err) {
      console.error('Failed to load subscription data', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenRenew = (sub) => {
    setSelectedSub(sub);
    setBillingCycle(sub.billingCycle || 'MONTHLY');
    setSuccessMsg('');
    setShowRenewModal(true);
  };

  const handleConfirmRenew = async () => {
    if (!selectedSub) return;
    setRenewing(true);
    try {
      await subscriptionService.renewSubscription(selectedSub.id, billingCycle);
      setSuccessMsg(`Subscription for ${selectedSub.companyName} renewed successfully!`);
      setTimeout(() => {
        setShowRenewModal(false);
        loadData();
      }, 1500);
    } catch (err) {
      alert('Renewal failed');
    } finally {
      setRenewing(false);
    }
  };

  return (
    <div className="module-container animate-fade-in">
      {/* Header */}
      <div className="module-header-row">
        <div>
          <h1 className="module-title">Subscription & Billing Management</h1>
          <p className="module-desc">
            Manage enterprise licensing tiers, track upcoming renewal expiries, and access payment invoices.
          </p>
        </div>

        <div className="module-actions-row">
          <div style={{ display: 'flex', background: '#111726', padding: '4px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.08)' }}>
            <button
              style={{
                padding: '6px 14px',
                borderRadius: '8px',
                background: activeTab === 'plans' ? '#f97316' : 'transparent',
                color: activeTab === 'plans' ? '#fff' : '#94a3b8',
                fontWeight: 600,
                fontSize: '12.5px',
              }}
              onClick={() => setActiveTab('plans')}
            >
              Subscription Tiers
            </button>
            <button
              style={{
                padding: '6px 14px',
                borderRadius: '8px',
                background: activeTab === 'subscriptions' ? '#f97316' : 'transparent',
                color: activeTab === 'subscriptions' ? '#fff' : '#94a3b8',
                fontWeight: 600,
                fontSize: '12.5px',
              }}
              onClick={() => setActiveTab('subscriptions')}
            >
              Active Subscriptions
            </button>
            <button
              style={{
                padding: '6px 14px',
                borderRadius: '8px',
                background: activeTab === 'payments' ? '#f97316' : 'transparent',
                color: activeTab === 'payments' ? '#fff' : '#94a3b8',
                fontWeight: 600,
                fontSize: '12.5px',
              }}
              onClick={() => setActiveTab('payments')}
            >
              Payment History
            </button>
          </div>

          <button className="btn-secondary" onClick={loadData}>
            <RefreshCw size={15} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Subscription Tiers */}
      {activeTab === 'plans' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
          {plans.map((p) => {
            const isPopular = p.isPopular;
            let features = [];
            try {
              features = typeof p.featuresJson === 'string' ? JSON.parse(p.featuresJson) : p.featuresJson || [];
            } catch (e) {
              features = ['GPS Live Tracking', 'Telematics', 'Trip Logs'];
            }

            return (
              <div
                key={p.id}
                className={`fleet-table-card ${isPopular ? 'popular' : ''}`}
                style={{
                  padding: '28px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  border: isPopular ? '2px solid #f59e0b' : '1px solid rgba(255,255,255,0.08)',
                  position: 'relative',
                  background: isPopular ? '#151d30' : '#111726',
                  boxShadow: isPopular ? '0 0 25px rgba(245, 158, 11, 0.2)' : 'none',
                }}
              >
                {isPopular && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '-12px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      background: '#f59e0b',
                      color: '#000',
                      fontSize: '10px',
                      fontWeight: 800,
                      padding: '3px 12px',
                      borderRadius: '12px',
                      textTransform: 'uppercase',
                    }}
                  >
                    Most Popular
                  </div>
                )}

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#fff' }}>{p.planName}</h3>
                    <Crown size={22} color={isPopular ? '#f59e0b' : '#94a3b8'} />
                  </div>

                  <div style={{ margin: '18px 0' }}>
                    <span style={{ fontSize: '32px', fontWeight: 800, color: '#fff', fontFamily: 'var(--font-heading)' }}>
                      ₹{p.monthlyPrice?.toLocaleString()}
                    </span>
                    <span style={{ fontSize: '13px', color: '#94a3b8' }}> / month</span>
                    <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                      Billed annually at ₹{p.annualPrice?.toLocaleString()}/yr
                    </div>
                  </div>

                  <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '16px', marginBottom: '20px' }}>
                    <div style={{ fontSize: '12.5px', color: '#cbd5e1', marginBottom: '10px' }}>
                      <strong>Max Fleet:</strong> {p.maxFleetSize} Vehicles • <strong>Max Hubs:</strong> {p.maxBranches}
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {features.map((f, idx) => (
                        <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12.5px', color: '#cbd5e1' }}>
                          <Check size={14} color="#10b981" />
                          <span>{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <button
                  className={isPopular ? 'btn-primary' : 'btn-secondary'}
                  style={{ width: '100%', justifyContent: 'center', marginTop: '14px' }}
                  onClick={() => alert(`Upgrading to ${p.planName} plan tier...`)}
                >
                  Choose {p.planName}
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Tab 2: Active Subscriptions */}
      {activeTab === 'subscriptions' && (
        <div className="fleet-table-card">
          <div style={{ overflowX: 'auto' }}>
            <table className="fleet-table">
              <thead>
                <tr>
                  <th>Subscription Code</th>
                  <th>Client Company</th>
                  <th>Plan Tier</th>
                  <th>Billing Cycle</th>
                  <th>Validity Dates</th>
                  <th>Expiry Countdown</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="8" style={{ textAlign: 'center', padding: '36px', color: '#94a3b8' }}>
                      Loading subscriptions...
                    </td>
                  </tr>
                ) : subscriptions.length === 0 ? (
                  <tr>
                    <td colSpan="8" style={{ textAlign: 'center', padding: '36px', color: '#94a3b8' }}>
                      No subscriptions on record.
                    </td>
                  </tr>
                ) : (
                  subscriptions.map((s) => (
                    <tr key={s.id}>
                      <td>
                        <span style={{ fontWeight: 700, color: '#f97316' }}>{s.subscriptionCode}</span>
                      </td>
                      <td style={{ fontWeight: 600, color: '#fff' }}>{s.companyName}</td>
                      <td>
                        <span
                          style={{
                            background: 'rgba(245, 158, 11, 0.15)',
                            color: '#f59e0b',
                            padding: '3px 8px',
                            borderRadius: '6px',
                            fontWeight: 700,
                            fontSize: '11px',
                          }}
                        >
                          {s.planName}
                        </span>
                      </td>
                      <td>{s.billingCycle}</td>
                      <td style={{ fontSize: '12px', color: '#94a3b8' }}>
                        {s.startDate} → {s.endDate}
                      </td>
                      <td>
                        <span
                          className={`expiry-badge ${s.daysUntilExpiry <= 7 ? 'badge-red' : s.daysUntilExpiry <= 15 ? 'badge-orange' : 'badge-blue'}`}
                        >
                          {s.daysUntilExpiry <= 7 ? `Expires in ${s.daysUntilExpiry} days` : `${s.daysUntilExpiry} days remaining`}
                        </span>
                      </td>
                      <td>
                        <span className="status-pill status-active">{s.status}</span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <button
                          className="btn-primary"
                          style={{ padding: '4px 10px', fontSize: '11.5px' }}
                          onClick={() => handleOpenRenew(s)}
                        >
                          Renew
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Payment History */}
      {activeTab === 'payments' && (
        <div className="fleet-table-card">
          <div style={{ overflowX: 'auto' }}>
            <table className="fleet-table">
              <thead>
                <tr>
                  <th>Invoice #</th>
                  <th>Company</th>
                  <th>Amount</th>
                  <th>Payment Method</th>
                  <th>Transaction Ref</th>
                  <th>Payment Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '36px', color: '#94a3b8' }}>
                      Loading payment transactions...
                    </td>
                  </tr>
                ) : payments.length === 0 ? (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '36px', color: '#94a3b8' }}>
                      No payment history recorded yet.
                    </td>
                  </tr>
                ) : (
                  payments.map((p) => (
                    <tr key={p.id}>
                      <td>
                        <span style={{ fontWeight: 700, color: '#0ea5e9' }}>{p.invoiceNumber}</span>
                      </td>
                      <td style={{ fontWeight: 600, color: '#fff' }}>{p.payerCompany}</td>
                      <td style={{ fontWeight: 700, color: '#f97316' }}>
                        ₹{p.amount?.toLocaleString()}
                      </td>
                      <td>{p.paymentMethod}</td>
                      <td style={{ fontFamily: 'monospace', fontSize: '11px', color: '#94a3b8' }}>
                        {p.transactionReference}
                      </td>
                      <td style={{ fontSize: '12px', color: '#94a3b8' }}>
                        {new Date(p.paymentDate).toLocaleDateString()}
                      </td>
                      <td>
                        <span className="status-pill status-active">{p.paymentStatus}</span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Renew Modal */}
      <Modal
        isOpen={showRenewModal}
        onClose={() => setShowRenewModal(false)}
        title={`Renew Subscription: ${selectedSub?.companyName}`}
      >
        {successMsg ? (
          <div style={{ textAlign: 'center', padding: '20px 0', color: '#10b981' }}>
            <CheckCircle2 size={40} style={{ margin: '0 auto 10px' }} />
            <p>{successMsg}</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <p style={{ color: '#94a3b8', fontSize: '13px' }}>
              Select renewal duration and billing preference. Payment receipt will be recorded automatically.
            </p>

            <div className="form-group">
              <label className="form-label" style={{ color: '#cbd5e1' }}>Billing Duration</label>
              <select
                className="form-input"
                style={{ background: '#1c263d', borderColor: '#2d3b55', color: '#fff' }}
                value={billingCycle}
                onChange={(e) => setBillingCycle(e.target.value)}
              >
                <option value="MONTHLY">1 Month Extension (Standard Monthly)</option>
                <option value="ANNUAL">12 Month Extension (Annual Tier - 15% discount)</option>
              </select>
            </div>

            <div
              style={{
                background: '#161e30',
                padding: '14px',
                borderRadius: '10px',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ color: '#cbd5e1' }}>Plan Tier</span>
                <span style={{ color: '#f59e0b', fontWeight: 700 }}>{selectedSub?.planName}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ color: '#cbd5e1' }}>Current Expiry</span>
                <span style={{ color: '#ef4444', fontWeight: 600 }}>{selectedSub?.endDate}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#cbd5e1' }}>Total Amount</span>
                <span style={{ color: '#f97316', fontWeight: 800 }}>
                  ₹{billingCycle === 'ANNUAL' ? '24,990' : '2,499'}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
              <button
                className="btn-secondary"
                style={{ flex: 1, justifyContent: 'center' }}
                onClick={() => setShowRenewModal(false)}
              >
                Cancel
              </button>
              <button
                className="btn-primary"
                style={{ flex: 1, justifyContent: 'center' }}
                onClick={handleConfirmRenew}
                disabled={renewing}
              >
                {renewing ? 'Processing Renewal...' : 'Confirm & Renew'}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
