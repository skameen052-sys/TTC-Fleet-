import React, { useState } from 'react';
import {
  FileText,
  CreditCard,
  DollarSign,
  TrendingUp,
  TrendingDown,
  RotateCcw,
  Truck,
  Percent,
  BarChart3,
  History,
  Bell,
  User,
  PlusCircle,
  Search,
  Filter,
  Download,
  Eye,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Printer,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
  Building2,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

const formatINR = (val) => `₹${Number(val || 0).toLocaleString('en-IN')}`;

// ============================================================================
// 1. BILLING MANAGEMENT VIEW (Module 2)
// ============================================================================
export const BillingManagementView = ({ bills = [], onOpenCreateBill }) => {
  const [filter, setFilter] = useState('ALL');
  const [search, setSearch] = useState('');

  const filtered = bills.filter(b => {
    const matchFilter = filter === 'ALL' || b.status === filter;
    const matchSearch =
      b.vendor.toLowerCase().includes(search.toLowerCase()) ||
      b.billNumber.toLowerCase().includes(search.toLowerCase()) ||
      b.category.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const totalPayables = bills.filter(b => b.status === 'Pending').reduce((sum, b) => sum + b.amount, 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#fff', margin: 0 }}>Vendor Billing & Accounts Payable</h2>
          <p style={{ fontSize: '12px', color: '#94a3b8', margin: '3px 0 0' }}>Manage vendor bills, maintenance work orders, fuel cards, and facility leases</p>
        </div>
        <button
          onClick={onOpenCreateBill}
          style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'linear-gradient(135deg, #2563eb, #0284c7)', border: 'none', color: '#fff', padding: '8px 16px', borderRadius: '8px', fontSize: '12.5px', fontWeight: 600, cursor: 'pointer' }}
        >
          <PlusCircle size={15} /> Create Vendor Bill
        </button>
      </div>

      {/* Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px' }}>
        <div style={{ background: '#111726', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '16px' }}>
          <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 600 }}>Total Recorded Bills</div>
          <div style={{ fontSize: '22px', fontWeight: 800, color: '#fff', margin: '4px 0' }}>{bills.length} Bills</div>
          <div style={{ fontSize: '11px', color: '#10b981' }}>Fuel, Maintenance, Tolls & Leases</div>
        </div>
        <div style={{ background: '#111726', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '16px' }}>
          <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 600 }}>Pending Payables Balance</div>
          <div style={{ fontSize: '22px', fontWeight: 800, color: '#f59e0b', margin: '4px 0' }}>{formatINR(totalPayables)}</div>
          <div style={{ fontSize: '11px', color: '#94a3b8' }}>Due within next 15 days</div>
        </div>
        <div style={{ background: '#111726', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '16px' }}>
          <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 600 }}>Settled Bills This Month</div>
          <div style={{ fontSize: '22px', fontWeight: 800, color: '#10b981', margin: '4px 0' }}>
            {formatINR(bills.filter(b => b.status === 'Paid').reduce((sum, b) => sum + b.amount, 0))}
          </div>
          <div style={{ fontSize: '11px', color: '#10b981' }}>100% on-time settlement</div>
        </div>
      </div>

      {/* Table Toolbar */}
      <div style={{ background: '#111726', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', overflow: 'hidden' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 18px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.04)', padding: '6px 12px', borderRadius: '6px', width: '280px' }}>
            <Search size={14} color="#64748b" />
            <input
              type="text"
              placeholder="Search vendor, bill #, category..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ background: 'transparent', border: 'none', color: '#fff', fontSize: '12px', outline: 'none', width: '100%' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '6px' }}>
            {['ALL', 'Paid', 'Pending', 'Overdue'].map(st => (
              <button
                key={st}
                onClick={() => setFilter(st)}
                style={{
                  background: filter === st ? 'rgba(37,99,235,0.2)' : 'transparent',
                  border: filter === st ? '1px solid #2563eb' : '1px solid rgba(255,255,255,0.08)',
                  color: filter === st ? '#38bdf8' : '#94a3b8',
                  padding: '5px 12px',
                  borderRadius: '6px',
                  fontSize: '11.5px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '12.5px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', color: '#94a3b8', background: 'rgba(255,255,255,0.02)' }}>
              <th style={{ padding: '12px 18px' }}>Bill # & Vendor</th>
              <th style={{ padding: '12px 18px' }}>Category</th>
              <th style={{ padding: '12px 18px' }}>Billing Date</th>
              <th style={{ padding: '12px 18px' }}>Due Date</th>
              <th style={{ padding: '12px 18px', textAlign: 'right' }}>Amount</th>
              <th style={{ padding: '12px 18px' }}>Status</th>
              <th style={{ padding: '12px 18px', textAlign: 'right' }}>Settlement</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(b => (
              <tr key={b.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <td style={{ padding: '12px 18px' }}>
                  <div style={{ fontWeight: 600, color: '#fff' }}>{b.vendor}</div>
                  <div style={{ fontSize: '10.5px', color: '#94a3b8' }}>{b.billNumber} • {b.description}</div>
                </td>
                <td style={{ padding: '12px 18px', color: '#cbd5e1' }}>{b.category}</td>
                <td style={{ padding: '12px 18px', color: '#94a3b8' }}>{b.date}</td>
                <td style={{ padding: '12px 18px', color: '#94a3b8' }}>{b.dueDate}</td>
                <td style={{ padding: '12px 18px', textAlign: 'right', fontWeight: 700, color: '#fff' }}>{formatINR(b.amount)}</td>
                <td style={{ padding: '12px 18px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 700, padding: '3px 8px', borderRadius: '6px', background: b.status === 'Paid' ? 'rgba(16,185,129,0.15)' : 'rgba(245,158,11,0.15)', color: b.status === 'Paid' ? '#10b981' : '#f59e0b' }}>
                    {b.status}
                  </span>
                </td>
                <td style={{ padding: '12px 18px', textAlign: 'right', color: '#94a3b8', fontSize: '11px' }}>{b.paymentMethod}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ============================================================================
// 2. INVOICE MANAGEMENT VIEW (Module 3)
// ============================================================================
export const InvoiceManagementView = ({
  invoices = [],
  onOpenCreateInvoice,
  onViewInvoice,
  onMarkPaid,
  onExportCSV
}) => {
  const [filter, setFilter] = useState('ALL');
  const [search, setSearch] = useState('');

  const filtered = invoices.filter(inv => {
    const matchFilter = filter === 'ALL' || inv.status === filter;
    const matchSearch =
      inv.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
      inv.customerName.toLowerCase().includes(search.toLowerCase()) ||
      inv.serviceType.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#fff', margin: 0 }}>Customer Freight Invoices</h2>
          <p style={{ fontSize: '12px', color: '#94a3b8', margin: '3px 0 0' }}>Draft, issue, track, and manage GST-compliant electronic freight invoices</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => onExportCSV && onExportCSV('invoices')}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: '#cbd5e1', padding: '8px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}
          >
            <Download size={14} /> Export CSV
          </button>
          <button
            onClick={onOpenCreateInvoice}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'linear-gradient(135deg, #2563eb, #0284c7)', border: 'none', color: '#fff', padding: '8px 16px', borderRadius: '8px', fontSize: '12.5px', fontWeight: 600, cursor: 'pointer' }}
          >
            <PlusCircle size={15} /> Create New Invoice
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div style={{ background: '#111726', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', overflow: 'hidden' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 18px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.04)', padding: '6px 12px', borderRadius: '6px', width: '280px' }}>
            <Search size={14} color="#64748b" />
            <input
              type="text"
              placeholder="Search invoice #, customer, service..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ background: 'transparent', border: 'none', color: '#fff', fontSize: '12px', outline: 'none', width: '100%' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '6px' }}>
            {['ALL', 'Paid', 'Pending', 'Overdue', 'Draft', 'Sent'].map(st => (
              <button
                key={st}
                onClick={() => setFilter(st)}
                style={{
                  background: filter === st ? 'rgba(37,99,235,0.2)' : 'transparent',
                  border: filter === st ? '1px solid #2563eb' : '1px solid rgba(255,255,255,0.08)',
                  color: filter === st ? '#38bdf8' : '#94a3b8',
                  padding: '5px 12px',
                  borderRadius: '6px',
                  fontSize: '11.5px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '12.5px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', color: '#94a3b8', background: 'rgba(255,255,255,0.02)' }}>
              <th style={{ padding: '12px 18px' }}>Invoice Details</th>
              <th style={{ padding: '12px 18px' }}>Service Type</th>
              <th style={{ padding: '12px 18px' }}>Issue Date</th>
              <th style={{ padding: '12px 18px' }}>Due Date</th>
              <th style={{ padding: '12px 18px', textAlign: 'right' }}>Total (Incl. GST)</th>
              <th style={{ padding: '12px 18px', textAlign: 'right' }}>Balance</th>
              <th style={{ padding: '12px 18px' }}>Status</th>
              <th style={{ padding: '12px 18px', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(inv => (
              <tr key={inv.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <td style={{ padding: '12px 18px' }}>
                  <div style={{ fontWeight: 700, color: '#38bdf8' }}>{inv.invoiceNumber}</div>
                  <div style={{ color: '#fff', fontWeight: 600 }}>{inv.customerName}</div>
                  <div style={{ fontSize: '10.5px', color: '#94a3b8' }}>Order: {inv.orderId}</div>
                </td>
                <td style={{ padding: '12px 18px', color: '#cbd5e1' }}>{inv.serviceType}</td>
                <td style={{ padding: '12px 18px', color: '#94a3b8' }}>{inv.billingDate}</td>
                <td style={{ padding: '12px 18px', color: '#94a3b8' }}>{inv.dueDate}</td>
                <td style={{ padding: '12px 18px', textAlign: 'right', fontWeight: 700, color: '#fff' }}>{formatINR(inv.total)}</td>
                <td style={{ padding: '12px 18px', textAlign: 'right', fontWeight: 700, color: inv.balance > 0 ? '#f59e0b' : '#10b981' }}>
                  {formatINR(inv.balance)}
                </td>
                <td style={{ padding: '12px 18px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 700, padding: '3px 8px', borderRadius: '6px', background: inv.status === 'Paid' ? 'rgba(16,185,129,0.15)' : inv.status === 'Overdue' ? 'rgba(239,68,68,0.15)' : 'rgba(245,158,11,0.15)', color: inv.status === 'Paid' ? '#10b981' : inv.status === 'Overdue' ? '#ef4444' : '#f59e0b' }}>
                    {inv.status}
                  </span>
                </td>
                <td style={{ padding: '12px 18px', textAlign: 'right' }}>
                  <button
                    onClick={() => onViewInvoice && onViewInvoice(inv)}
                    style={{ background: 'transparent', border: '1px solid rgba(56,189,248,0.3)', color: '#38bdf8', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '11px', marginRight: '6px' }}
                    title="View & Print Tax Invoice"
                  >
                    <Eye size={12} style={{ verticalAlign: 'middle', marginRight: '3px' }} /> View
                  </button>
                  {inv.status !== 'Paid' && (
                    <button
                      onClick={() => onMarkPaid && onMarkPaid(inv.id)}
                      style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', color: '#10b981', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '11px' }}
                      title="Quick Settle"
                    >
                      Settle
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ============================================================================
// 3. PAYMENT MANAGEMENT VIEW (Module 4)
// ============================================================================
export const PaymentManagementView = ({ payments = [], onOpenRecordPayment }) => {
  const [filter, setFilter] = useState('ALL');
  const [search, setSearch] = useState('');

  const filtered = payments.filter(p => {
    const matchFilter = filter === 'ALL' || p.status === filter;
    const matchSearch =
      p.customerName.toLowerCase().includes(search.toLowerCase()) ||
      p.transactionRef.toLowerCase().includes(search.toLowerCase()) ||
      p.method.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#fff', margin: 0 }}>Payment Transactions & Reconciliation</h2>
          <p style={{ fontSize: '12px', color: '#94a3b8', margin: '3px 0 0' }}>Track bank RTGS, NEFT, corporate ACH, and gateway settlements</p>
        </div>
        <button
          onClick={onOpenRecordPayment}
          style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'linear-gradient(135deg, #10b981, #059669)', border: 'none', color: '#fff', padding: '8px 16px', borderRadius: '8px', fontSize: '12.5px', fontWeight: 600, cursor: 'pointer' }}
        >
          <CreditCard size={15} /> Record Inward Payment
        </button>
      </div>

      <div style={{ background: '#111726', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', overflow: 'hidden' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 18px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.04)', padding: '6px 12px', borderRadius: '6px', width: '280px' }}>
            <Search size={14} color="#64748b" />
            <input
              type="text"
              placeholder="Search txn ref, customer, method..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ background: 'transparent', border: 'none', color: '#fff', fontSize: '12px', outline: 'none', width: '100%' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '6px' }}>
            {['ALL', 'Completed', 'Pending', 'Failed'].map(st => (
              <button
                key={st}
                onClick={() => setFilter(st)}
                style={{
                  background: filter === st ? 'rgba(37,99,235,0.2)' : 'transparent',
                  border: filter === st ? '1px solid #2563eb' : '1px solid rgba(255,255,255,0.08)',
                  color: filter === st ? '#38bdf8' : '#94a3b8',
                  padding: '5px 12px',
                  borderRadius: '6px',
                  fontSize: '11.5px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '12.5px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', color: '#94a3b8', background: 'rgba(255,255,255,0.02)' }}>
              <th style={{ padding: '12px 18px' }}>Transaction Ref</th>
              <th style={{ padding: '12px 18px' }}>Customer Shipper</th>
              <th style={{ padding: '12px 18px' }}>Invoice Ref</th>
              <th style={{ padding: '12px 18px' }}>Settlement Date</th>
              <th style={{ padding: '12px 18px' }}>Payment Mode</th>
              <th style={{ padding: '12px 18px', textAlign: 'right' }}>Amount</th>
              <th style={{ padding: '12px 18px' }}>Status</th>
              <th style={{ padding: '12px 18px' }}>Verification</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(p => (
              <tr key={p.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <td style={{ padding: '12px 18px', fontFamily: 'monospace', color: '#38bdf8', fontWeight: 600 }}>{p.transactionRef}</td>
                <td style={{ padding: '12px 18px', color: '#fff', fontWeight: 600 }}>{p.customerName}</td>
                <td style={{ padding: '12px 18px', color: '#94a3b8' }}>{p.invoiceId}</td>
                <td style={{ padding: '12px 18px', color: '#94a3b8' }}>{p.date}</td>
                <td style={{ padding: '12px 18px', color: '#cbd5e1' }}>{p.method}</td>
                <td style={{ padding: '12px 18px', textAlign: 'right', fontWeight: 700, color: '#10b981' }}>{formatINR(p.amount)}</td>
                <td style={{ padding: '12px 18px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 700, padding: '3px 8px', borderRadius: '6px', background: p.status === 'Completed' ? 'rgba(16,185,129,0.15)' : p.status === 'Failed' ? 'rgba(239,68,68,0.15)' : 'rgba(245,158,11,0.15)', color: p.status === 'Completed' ? '#10b981' : p.status === 'Failed' ? '#ef4444' : '#f59e0b' }}>
                    {p.status}
                  </span>
                </td>
                <td style={{ padding: '12px 18px', color: '#64748b', fontSize: '11px' }}>{p.verifiedBy}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ============================================================================
// 4. CUSTOMER PAYMENTS VIEW (Module 5)
// ============================================================================
export const CustomerPaymentsView = ({ invoices = [] }) => {
  const customerMap = invoices.reduce((acc, inv) => {
    if (!acc[inv.customerName]) {
      acc[inv.customerName] = {
        name: inv.customerName,
        totalBilled: 0,
        totalPaid: 0,
        outstanding: 0,
        invoiceCount: 0
      };
    }
    acc[inv.customerName].totalBilled += inv.total;
    acc[inv.customerName].totalPaid += inv.paidAmount;
    acc[inv.customerName].outstanding += inv.balance;
    acc[inv.customerName].invoiceCount += 1;
    return acc;
  }, {});

  const customers = Object.values(customerMap);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div>
        <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#fff', margin: 0 }}>Customer Accounts Receivable & Aging</h2>
        <p style={{ fontSize: '12px', color: '#94a3b8', margin: '3px 0 0' }}>Customer-wise freight credit limits, realized payments, and outstanding exposure</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px' }}>
        {customers.map(c => (
          <div key={c.name} style={{ background: '#111726', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <Building2 size={16} color="#38bdf8" />
              <div style={{ fontWeight: 700, color: '#fff', fontSize: '13px' }}>{c.name}</div>
            </div>
            <div style={{ fontSize: '11.5px', color: '#94a3b8', display: 'flex', flexDirection: 'column', gap: '4px', margin: '10px 0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Total Invoiced:</span>
                <strong style={{ color: '#fff' }}>{formatINR(c.totalBilled)}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Total Collected:</span>
                <strong style={{ color: '#10b981' }}>{formatINR(c.totalPaid)}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Outstanding Due:</span>
                <strong style={{ color: c.outstanding > 0 ? '#f59e0b' : '#64748b' }}>{formatINR(c.outstanding)}</strong>
              </div>
            </div>
            <div style={{ fontSize: '10.5px', color: '#64748b' }}>{c.invoiceCount} Active Freight Contracts</div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ============================================================================
// 5. REFUND MANAGEMENT VIEW (Module 6)
// ============================================================================
export const RefundManagementView = ({ refunds = [], onProcessRefund }) => {
  const [filter, setFilter] = useState('ALL');

  const filtered = refunds.filter(r => filter === 'ALL' || r.status === filter);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div>
        <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#fff', margin: 0 }}>Customer Refund Requests & Claims</h2>
        <p style={{ fontSize: '12px', color: '#94a3b8', margin: '3px 0 0' }}>Detention waivers, cargo claims reconciliation, and direct bank refund credits</p>
      </div>

      <div style={{ background: '#111726', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '12.5px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', color: '#94a3b8', background: 'rgba(255,255,255,0.02)' }}>
              <th style={{ padding: '12px 18px' }}>Claim Ref & Customer</th>
              <th style={{ padding: '12px 18px' }}>Order / Invoice</th>
              <th style={{ padding: '12px 18px' }}>Claim Date</th>
              <th style={{ padding: '12px 18px' }}>Reason</th>
              <th style={{ padding: '12px 18px', textAlign: 'right' }}>Claim Amount</th>
              <th style={{ padding: '12px 18px' }}>Status</th>
              <th style={{ padding: '12px 18px', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(r => (
              <tr key={r.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <td style={{ padding: '12px 18px' }}>
                  <div style={{ fontWeight: 700, color: '#fff' }}>{r.customerName}</div>
                  <div style={{ fontSize: '10.5px', color: '#38bdf8' }}>{r.refundNumber}</div>
                </td>
                <td style={{ padding: '12px 18px', color: '#94a3b8' }}>{r.orderId} • {r.invoiceId}</td>
                <td style={{ padding: '12px 18px', color: '#94a3b8' }}>{r.date}</td>
                <td style={{ padding: '12px 18px', color: '#cbd5e1' }}>{r.reason}</td>
                <td style={{ padding: '12px 18px', textAlign: 'right', fontWeight: 700, color: '#f43f5e' }}>{formatINR(r.amount)}</td>
                <td style={{ padding: '12px 18px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 700, padding: '3px 8px', borderRadius: '6px', background: r.status === 'Completed' ? 'rgba(16,185,129,0.15)' : r.status === 'Rejected' ? 'rgba(239,68,68,0.15)' : 'rgba(245,158,11,0.15)', color: r.status === 'Completed' ? '#10b981' : r.status === 'Rejected' ? '#ef4444' : '#f59e0b' }}>
                    {r.status}
                  </span>
                </td>
                <td style={{ padding: '12px 18px', textAlign: 'right' }}>
                  {r.status === 'Pending' && (
                    <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                      <button
                        onClick={() => onProcessRefund && onProcessRefund(r.id, 'Approved')}
                        style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', color: '#10b981', padding: '3px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '11px' }}
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => onProcessRefund && onProcessRefund(r.id, 'Rejected')}
                        style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444', padding: '3px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '11px' }}
                      >
                        Reject
                      </button>
                    </div>
                  )}
                  {r.status === 'Approved' && (
                    <button
                      onClick={() => onProcessRefund && onProcessRefund(r.id, 'Completed')}
                      style={{ background: 'rgba(56,189,248,0.15)', border: '1px solid rgba(56,189,248,0.3)', color: '#38bdf8', padding: '3px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '11px' }}
                    >
                      Disburse
                    </button>
                  )}
                  {r.status === 'Completed' && (
                    <span style={{ fontSize: '11px', color: '#10b981' }}>Settled ✔</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ============================================================================
// 6. TRANSPORTATION CHARGES VIEW (Module 7)
// ============================================================================
export const TransportationChargesView = ({ transportCharges = [] }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div>
        <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#fff', margin: 0 }}>Transportation Charges & Tariff Master</h2>
        <p style={{ fontSize: '12px', color: '#94a3b8', margin: '3px 0 0' }}>Base distance tariffs, fuel surcharges, handling fees, and GST tax classifications</p>
      </div>

      <div style={{ background: '#111726', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '12.5px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', color: '#94a3b8', background: 'rgba(255,255,255,0.02)' }}>
              <th style={{ padding: '12px 18px' }}>Transportation Service Category</th>
              <th style={{ padding: '12px 18px' }}>Base Tariff / KM</th>
              <th style={{ padding: '12px 18px' }}>Min Distance</th>
              <th style={{ padding: '12px 18px' }}>Fuel Surcharge</th>
              <th style={{ padding: '12px 18px' }}>Loading / Dock Fee</th>
              <th style={{ padding: '12px 18px' }}>GST Rate</th>
              <th style={{ padding: '12px 18px', textAlign: 'right' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {transportCharges.map(tc => (
              <tr key={tc.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <td style={{ padding: '12px 18px', fontWeight: 700, color: '#fff' }}>{tc.service}</td>
                <td style={{ padding: '12px 18px', color: '#38bdf8', fontWeight: 600 }}>₹{tc.baseRatePerKm}/km</td>
                <td style={{ padding: '12px 18px', color: '#94a3b8' }}>{tc.minDistanceKm} KM</td>
                <td style={{ padding: '12px 18px', color: '#f59e0b' }}>+{tc.fuelSurchargePct}% HSD Index</td>
                <td style={{ padding: '12px 18px', color: '#cbd5e1' }}>₹{tc.handlingCharge}</td>
                <td style={{ padding: '12px 18px', color: '#10b981', fontWeight: 600 }}>{tc.taxRate}% (SAC 996511)</td>
                <td style={{ padding: '12px 18px', textAlign: 'right', color: '#10b981', fontWeight: 700 }}>Active Tariff</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ============================================================================
// 7. EXPENSE MANAGEMENT VIEW (Module 8)
// ============================================================================
export const ExpenseManagementView = ({ expenses = [], onOpenAddExpense }) => {
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  const filtered = expenses.filter(e => categoryFilter === 'ALL' || e.category === categoryFilter);

  const totalExpense = expenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#fff', margin: 0 }}>Operational Expense Management (OPEX)</h2>
          <p style={{ fontSize: '12px', color: '#94a3b8', margin: '3px 0 0' }}>Log and reconcile fuel, maintenance, driver allowances, tolls, and warehouse storage</p>
        </div>
        <button
          onClick={onOpenAddExpense}
          style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'linear-gradient(135deg, #f97316, #ea580c)', border: 'none', color: '#fff', padding: '8px 16px', borderRadius: '8px', fontSize: '12.5px', fontWeight: 600, cursor: 'pointer' }}
        >
          <PlusCircle size={15} /> Add Expense Outlay
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px' }}>
        <div style={{ background: '#111726', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '16px' }}>
          <div style={{ fontSize: '11px', color: '#94a3b8' }}>Total OPEX Logged</div>
          <div style={{ fontSize: '22px', fontWeight: 800, color: '#f97316', margin: '4px 0' }}>{formatINR(totalExpense)}</div>
          <div style={{ fontSize: '11px', color: '#94a3b8' }}>Across 6 Operational Categories</div>
        </div>
        <div style={{ background: '#111726', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '16px' }}>
          <div style={{ fontSize: '11px', color: '#94a3b8' }}>Fuel & Energy Share</div>
          <div style={{ fontSize: '22px', fontWeight: 800, color: '#38bdf8', margin: '4px 0' }}>{formatINR(22179)}</div>
          <div style={{ fontSize: '11px', color: '#38bdf8' }}>15.7% of monthly turnover</div>
        </div>
        <div style={{ background: '#111726', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '16px' }}>
          <div style={{ fontSize: '11px', color: '#94a3b8' }}>Maintenance Overhauls</div>
          <div style={{ fontSize: '22px', fontWeight: 800, color: '#f43f5e', margin: '4px 0' }}>{formatINR(42500)}</div>
          <div style={{ fontSize: '11px', color: '#f43f5e' }}>Volvo & OEM Service bay work orders</div>
        </div>
      </div>

      <div style={{ background: '#111726', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', overflow: 'hidden' }}>
        <div style={{ display: 'flex', gap: '6px', padding: '12px 18px', borderBottom: '1px solid rgba(255,255,255,0.06)', overflowX: 'auto' }}>
          {['ALL', 'Fuel Expenses', 'Vehicle Maintenance', 'Driver Expenses', 'Warehouse Expenses', 'Transportation Charges'].map(cat => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              style={{
                background: categoryFilter === cat ? 'rgba(249,115,22,0.2)' : 'transparent',
                border: categoryFilter === cat ? '1px solid #f97316' : '1px solid rgba(255,255,255,0.08)',
                color: categoryFilter === cat ? '#FF9E4A' : '#94a3b8',
                padding: '5px 12px',
                borderRadius: '6px',
                fontSize: '11.5px',
                fontWeight: 600,
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '12.5px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', color: '#94a3b8', background: 'rgba(255,255,255,0.02)' }}>
              <th style={{ padding: '12px 18px' }}>Category & Payee</th>
              <th style={{ padding: '12px 18px' }}>Description</th>
              <th style={{ padding: '12px 18px' }}>Vehicle / Driver</th>
              <th style={{ padding: '12px 18px' }}>Date</th>
              <th style={{ padding: '12px 18px', textAlign: 'right' }}>Amount</th>
              <th style={{ padding: '12px 18px' }}>Payment Mode</th>
              <th style={{ padding: '12px 18px', textAlign: 'right' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(e => (
              <tr key={e.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <td style={{ padding: '12px 18px' }}>
                  <div style={{ fontWeight: 700, color: '#fff' }}>{e.category}</div>
                  <div style={{ fontSize: '10.5px', color: '#FF9E4A' }}>{e.vendor}</div>
                </td>
                <td style={{ padding: '12px 18px', color: '#cbd5e1' }}>{e.description}</td>
                <td style={{ padding: '12px 18px', color: '#94a3b8' }}>{e.vehicleId} • {e.driver}</td>
                <td style={{ padding: '12px 18px', color: '#94a3b8' }}>{e.date}</td>
                <td style={{ padding: '12px 18px', textAlign: 'right', fontWeight: 700, color: '#f43f5e' }}>{formatINR(e.amount)}</td>
                <td style={{ padding: '12px 18px', color: '#cbd5e1' }}>{e.paymentMethod}</td>
                <td style={{ padding: '12px 18px', textAlign: 'right', color: '#10b981', fontWeight: 600 }}>{e.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ============================================================================
// 8. REVENUE MANAGEMENT VIEW (Module 9)
// ============================================================================
export const RevenueManagementView = ({ invoices = [] }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div>
        <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#fff', margin: 0 }}>Revenue & Turnover Analytics</h2>
        <p style={{ fontSize: '12px', color: '#94a3b8', margin: '3px 0 0' }}>Daily, monthly and annual realized billing velocity</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
        <div style={{ background: '#111726', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '18px' }}>
          <div style={{ fontSize: '11px', color: '#94a3b8' }}>Today's Cleared Revenue</div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: '#10b981', margin: '4px 0' }}>₹1,47,500</div>
          <div style={{ fontSize: '11px', color: '#10b981' }}>+12.4% vs same day last week</div>
        </div>
        <div style={{ background: '#111726', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '18px' }}>
          <div style={{ fontSize: '11px', color: '#94a3b8' }}>Monthly Contract Turnover</div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: '#38bdf8', margin: '4px 0' }}>₹4,52,400</div>
          <div style={{ fontSize: '11px', color: '#38bdf8' }}>5 active shippers</div>
        </div>
        <div style={{ background: '#111726', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '18px' }}>
          <div style={{ fontSize: '11px', color: '#94a3b8' }}>Year-to-Date (YTD) Revenue</div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: '#a855f7', margin: '4px 0' }}>₹48,92,000</div>
          <div style={{ fontSize: '11px', color: '#a855f7' }}>98.6% collection rate</div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// 9. TAX MANAGEMENT VIEW (Module 10)
// ============================================================================
export const TaxManagementView = ({ taxConfig = {} }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div>
        <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#fff', margin: 0 }}>Goods & Services Tax (GST) Governance</h2>
        <p style={{ fontSize: '12px', color: '#94a3b8', margin: '3px 0 0' }}>Automated CGST/SGST/IGST computation, e-Way bill compliance & input tax credit (ITC)</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
        <div style={{ background: '#111726', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '20px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#fff', margin: '0 0 14px 0' }}>Corporate Tax Entity Credentials</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '12.5px', color: '#cbd5e1' }}>
            <div><strong>Entity Name:</strong> TTC Global Freight & Fleet Solutions Pvt. Ltd.</div>
            <div><strong>Registered GSTIN:</strong> <span style={{ fontFamily: 'monospace', color: '#38bdf8' }}>36AAACT8492K1Z9</span></div>
            <div><strong>Permanent Account Number (PAN):</strong> AAACT8492K</div>
            <div><strong>SAC Code:</strong> 996511 (Road Freight Transport of Goods)</div>
            <div><strong>e-Invoicing Portal:</strong> <span style={{ color: '#10b981', fontWeight: 700 }}>● Active & Real-Time Synced</span></div>
          </div>
        </div>

        <div style={{ background: '#111726', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '20px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#fff', margin: '0 0 14px 0' }}>Monthly Tax Liability & ITC Reconciliation</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '12.5px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8' }}>
              <span>Gross Tax Collected on Outward Freight:</span>
              <strong style={{ color: '#fff' }}>₹62,460</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8' }}>
              <span>Input Tax Credit (ITC) on Fuel & Maintenance:</span>
              <strong style={{ color: '#10b981' }}>-₹24,800</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#fff', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '8px', fontWeight: 700, fontSize: '14px' }}>
              <span>Net GST Payable to Treasury:</span>
              <span style={{ color: '#38bdf8' }}>₹37,660</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// 10. FINANCIAL REPORTS VIEW (Module 11)
// ============================================================================
export const FinancialReportsView = ({ billingService }) => {
  const pnl = billingService?.getProfitAndLossReport ? billingService.getProfitAndLossReport() : {
    totalRevenue: 147500,
    totalExpenses: 82879,
    netProfit: 64621,
    expenseRatio: 56
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#fff', margin: 0 }}>Executive Profit & Loss Ledger</h2>
          <p style={{ fontSize: '12px', color: '#94a3b8', margin: '3px 0 0' }}>Detailed revenue, operational outlays, EBITDA and bottom-line margin</p>
        </div>
        <button
          onClick={() => billingService?.exportCSV && billingService.exportCSV('invoices')}
          style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', padding: '8px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}
        >
          <Download size={14} /> Export P&L Statement
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px' }}>
        <div style={{ background: '#111726', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '16px' }}>
          <div style={{ fontSize: '11px', color: '#94a3b8' }}>Total Realized Turnover</div>
          <div style={{ fontSize: '22px', fontWeight: 800, color: '#10b981', margin: '4px 0' }}>{formatINR(pnl.totalRevenue)}</div>
          <div style={{ fontSize: '11px', color: '#10b981' }}>Cleared Inward Receipts</div>
        </div>
        <div style={{ background: '#111726', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '16px' }}>
          <div style={{ fontSize: '11px', color: '#94a3b8' }}>Total OPEX Outlays</div>
          <div style={{ fontSize: '22px', fontWeight: 800, color: '#f43f5e', margin: '4px 0' }}>{formatINR(pnl.totalExpenses)}</div>
          <div style={{ fontSize: '11px', color: '#f43f5e' }}>Fuel, Repairs, Tolls, Staff</div>
        </div>
        <div style={{ background: '#111726', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '16px' }}>
          <div style={{ fontSize: '11px', color: '#94a3b8' }}>Net Operating Profit</div>
          <div style={{ fontSize: '22px', fontWeight: 800, color: '#38bdf8', margin: '4px 0' }}>{formatINR(pnl.netProfit)}</div>
          <div style={{ fontSize: '11px', color: '#38bdf8' }}>Healthy Net Bottom Line</div>
        </div>
        <div style={{ background: '#111726', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '16px' }}>
          <div style={{ fontSize: '11px', color: '#94a3b8' }}>Expense-to-Revenue Ratio</div>
          <div style={{ fontSize: '22px', fontWeight: 800, color: '#f59e0b', margin: '4px 0' }}>{pnl.expenseRatio}%</div>
          <div style={{ fontSize: '11px', color: '#10b981' }}>Target benchmark: &lt;65%</div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// 11. TRANSACTION HISTORY VIEW (Module 12)
// ============================================================================
export const TransactionHistoryView = ({ payments = [], expenses = [] }) => {
  const transactions = [
    ...payments.map(p => ({
      id: p.id,
      date: p.date,
      type: 'INWARD_PAYMENT',
      party: p.customerName,
      ref: p.transactionRef,
      amount: p.amount,
      status: p.status,
      isCredit: true
    })),
    ...expenses.map(e => ({
      id: e.id,
      date: e.date,
      type: `EXPENSE_${e.category.toUpperCase().replace(/\s+/g, '_')}`,
      party: e.vendor,
      ref: e.id,
      amount: e.amount,
      status: e.status,
      isCredit: false
    }))
  ].sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div>
        <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#fff', margin: 0 }}>Comprehensive Financial Transaction Ledger</h2>
        <p style={{ fontSize: '12px', color: '#94a3b8', margin: '3px 0 0' }}>Audited debit and credit movements across treasury accounts</p>
      </div>

      <div style={{ background: '#111726', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '12.5px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', color: '#94a3b8', background: 'rgba(255,255,255,0.02)' }}>
              <th style={{ padding: '12px 18px' }}>Date</th>
              <th style={{ padding: '12px 18px' }}>Transaction ID / Ref</th>
              <th style={{ padding: '12px 18px' }}>Nature / Description</th>
              <th style={{ padding: '12px 18px' }}>Counterparty</th>
              <th style={{ padding: '12px 18px', textAlign: 'right' }}>Amount</th>
              <th style={{ padding: '12px 18px', textAlign: 'right' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map(t => (
              <tr key={t.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <td style={{ padding: '12px 18px', color: '#94a3b8' }}>{t.date}</td>
                <td style={{ padding: '12px 18px', fontFamily: 'monospace', color: '#38bdf8' }}>{t.ref}</td>
                <td style={{ padding: '12px 18px', color: '#fff', fontWeight: 600 }}>{t.type}</td>
                <td style={{ padding: '12px 18px', color: '#cbd5e1' }}>{t.party}</td>
                <td style={{ padding: '12px 18px', textAlign: 'right', fontWeight: 700, color: t.isCredit ? '#10b981' : '#f43f5e' }}>
                  {t.isCredit ? `+${formatINR(t.amount)}` : `-${formatINR(t.amount)}`}
                </td>
                <td style={{ padding: '12px 18px', textAlign: 'right', color: '#10b981', fontWeight: 600 }}>{t.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ============================================================================
// 12. BILLING NOTIFICATIONS VIEW (Module 13)
// ============================================================================
export const BillingNotificationsView = ({ notifications = [], onMarkRead, onMarkAllRead }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#fff', margin: 0 }}>Payment Reminders & Financial Alerts</h2>
          <p style={{ fontSize: '12px', color: '#94a3b8', margin: '3px 0 0' }}>Overdue payment notices, GST sync status, and large expense authorizations</p>
        </div>
        <button
          onClick={onMarkAllRead}
          style={{ background: 'rgba(56,189,248,0.12)', border: '1px solid rgba(56,189,248,0.3)', color: '#38bdf8', padding: '6px 14px', borderRadius: '6px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}
        >
          Mark All As Read
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {notifications.map(n => (
          <div
            key={n.id}
            style={{
              background: '#111726',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '10px',
              padding: '14px 18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: n.type === 'urgent' ? 'rgba(239,68,68,0.15)' : n.type === 'success' ? 'rgba(16,185,129,0.15)' : 'rgba(56,189,248,0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {n.type === 'urgent' ? <AlertTriangle size={16} color="#ef4444" /> : n.type === 'success' ? <CheckCircle2 size={16} color="#10b981" /> : <Bell size={16} color="#38bdf8" />}
              </div>
              <div>
                <div style={{ fontWeight: 700, color: '#fff', fontSize: '13px' }}>{n.title}</div>
                <div style={{ fontSize: '12px', color: '#cbd5e1', margin: '2px 0' }}>{n.message}</div>
                <div style={{ fontSize: '10.5px', color: '#64748b' }}>{n.time}</div>
              </div>
            </div>
            {!n.read && (
              <button
                onClick={() => onMarkRead && onMarkRead(n.id)}
                style={{ background: 'transparent', border: '1px solid #64748b', color: '#94a3b8', padding: '4px 10px', borderRadius: '4px', fontSize: '11px', cursor: 'pointer' }}
              >
                Dismiss
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// ============================================================================
// 13. BILLING PROFILE VIEW (Module 14)
// ============================================================================
export const BillingProfileView = ({ currentUser = {} }) => {
  const [currPass, setCurrPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [msg, setMsg] = useState('');

  const handlePasswordChange = (e) => {
    e.preventDefault();
    if (newPass.length < 6) {
      setMsg('Error: New password must be at least 6 characters.');
      return;
    }
    if (newPass !== confirmPass) {
      setMsg('Error: Passwords do not match.');
      return;
    }
    setMsg('Success: Finance Manager credentials updated successfully.');
    setCurrPass('');
    setNewPass('');
    setConfirmPass('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div>
        <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#fff', margin: 0 }}>Finance Manager Profile & Security</h2>
        <p style={{ fontSize: '12px', color: '#94a3b8', margin: '3px 0 0' }}>Treasury officer credentials, signing authorization, and security controls</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div style={{ background: '#111726', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
            <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'linear-gradient(135deg, #2563eb, #0284c7)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: 800, color: '#fff' }}>
              {(currentUser?.fullName || 'D').charAt(0)}
            </div>
            <div>
              <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#fff', margin: 0 }}>{currentUser?.fullName || 'Devin Vance'}</h3>
              <div style={{ fontSize: '12px', color: '#38bdf8', fontWeight: 600 }}>Chief Financial Controller</div>
              <div style={{ fontSize: '11px', color: '#94a3b8' }}>{currentUser?.email || 'finance@ttcfleet360.com'}</div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '12.5px', color: '#cbd5e1' }}>
            <div><strong>Staff Identifier:</strong> FIN-CFO-891</div>
            <div><strong>Department:</strong> Corporate Accounts & Treasury</div>
            <div><strong>Signing Authority:</strong> Invoices up to ₹10,00,000</div>
            <div><strong>Digital Token:</strong> <span style={{ color: '#10b981', fontWeight: 700 }}>● Active (Hardware Authenticated)</span></div>
          </div>
        </div>

        <div style={{ background: '#111726', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '24px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#fff', margin: '0 0 14px 0' }}>Change Treasury Password</h3>
          {msg && (
            <div style={{ padding: '8px 12px', borderRadius: '6px', marginBottom: '12px', fontSize: '12px', background: msg.startsWith('Success') ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)', color: msg.startsWith('Success') ? '#10b981' : '#ef4444' }}>
              {msg}
            </div>
          )}
          <form onSubmit={handlePasswordChange} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '11px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Current Password</label>
              <input type="password" value={currPass} onChange={e => setCurrPass(e.target.value)} required style={{ width: '100%', background: '#1e293b', color: '#fff', border: '1px solid rgba(255,255,255,0.12)', padding: '8px', borderRadius: '6px', boxSizing: 'border-box' }} />
            </div>
            <div>
              <label style={{ fontSize: '11px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>New Password</label>
              <input type="password" value={newPass} onChange={e => setNewPass(e.target.value)} required style={{ width: '100%', background: '#1e293b', color: '#fff', border: '1px solid rgba(255,255,255,0.12)', padding: '8px', borderRadius: '6px', boxSizing: 'border-box' }} />
            </div>
            <div>
              <label style={{ fontSize: '11px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Confirm Password</label>
              <input type="password" value={confirmPass} onChange={e => setConfirmPass(e.target.value)} required style={{ width: '100%', background: '#1e293b', color: '#fff', border: '1px solid rgba(255,255,255,0.12)', padding: '8px', borderRadius: '6px', boxSizing: 'border-box' }} />
            </div>
            <button type="submit" style={{ background: 'linear-gradient(135deg, #2563eb, #0284c7)', border: 'none', color: '#fff', padding: '9px', borderRadius: '6px', fontWeight: 600, cursor: 'pointer', marginTop: '6px' }}>
              Update Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
