import React, { useState } from 'react';
import { BillingSidebar } from './BillingSidebar';
import { BillingHeader } from './BillingHeader';
import {
  BillingManagementView,
  InvoiceManagementView,
  PaymentManagementView,
  CustomerPaymentsView,
  RefundManagementView,
  TransportationChargesView,
  ExpenseManagementView,
  RevenueManagementView,
  TaxManagementView,
  FinancialReportsView,
  TransactionHistoryView,
  BillingNotificationsView,
  BillingProfileView
} from './BillingViews';

import {
  CreateInvoiceModal,
  RecordPaymentModal,
  AddExpenseModal,
  ViewInvoiceModal
} from './BillingModals';

import {
  DollarSign,
  Receipt,
  FileText,
  CreditCard,
  Clock,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  TrendingUp,
  TrendingDown,
  Percent,
  PlusCircle,
  Download,
  Eye,
  BarChart3,
  Calendar,
  Building2,
  Truck,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

const formatINR = (val) => `₹${Number(val || 0).toLocaleString('en-IN')}`;

export const BillingDashboard = ({
  currentUser,
  onLogout,
  onSwitchPortal,
  billingData = {},
  billingService,
  showToast
}) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState('This Month (Nov 2026)');

  // Modals state
  const [isCreateInvoiceOpen, setIsCreateInvoiceOpen] = useState(false);
  const [isRecordPaymentOpen, setIsRecordPaymentOpen] = useState(false);
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [selectedInvoiceForView, setSelectedInvoiceForView] = useState(null);

  // Dynamic data from service with safe fallback
  const rawData = billingService?.getData ? billingService.getData() : billingData;
  const invoices = rawData?.invoices || [];
  const bills = rawData?.bills || [];
  const payments = rawData?.payments || [];
  const expenses = rawData?.expenses || [];
  const refunds = rawData?.refunds || [];
  const transportCharges = rawData?.transportCharges || [];
  const taxConfig = rawData?.taxConfig || {};
  const notifications = rawData?.notifications || [];

  // Metrics from service
  const metrics = billingService?.getSummaryMetrics ? billingService.getSummaryMetrics() : {
    totalRevenue: 147500,
    monthlyRevenue: 452400,
    todayRevenue: 147500,
    totalInvoices: invoices.length || 5,
    paidInvoices: invoices.filter(i => i.status === 'Paid').length || 1,
    pendingInvoices: invoices.filter(i => i.status === 'Pending' || i.status === 'Sent').length || 2,
    overdueInvoices: invoices.filter(i => i.status === 'Overdue').length || 1,
    totalExpenses: 82879,
    outstandingPayments: 242000,
    totalRefunds: 17000,
    netProfit: 64621,
    profitMarginPct: 44
  };

  // 10 Summary Cards (Section A)
  const summaryCards = [
    {
      id: 'total-revenue',
      title: 'Total Revenue',
      value: formatINR(metrics.totalRevenue),
      growth: '+14.8%',
      comparison: 'vs last month',
      isPositive: true,
      icon: DollarSign,
      color: '#10b981',
      target: 'revenue-management'
    },
    {
      id: 'monthly-revenue',
      title: 'Monthly Revenue',
      value: formatINR(metrics.monthlyRevenue),
      growth: '+8.2%',
      comparison: 'current billing cycle',
      isPositive: true,
      icon: TrendingUp,
      color: '#38bdf8',
      target: 'revenue-management'
    },
    {
      id: 'today-revenue',
      title: "Today's Revenue",
      value: formatINR(metrics.todayRevenue),
      growth: '+100%',
      comparison: 'cleared today',
      isPositive: true,
      icon: CheckCircle2,
      color: '#10b981',
      target: 'payment-management'
    },
    {
      id: 'total-invoices',
      title: 'Total Invoices',
      value: String(metrics.totalInvoices),
      growth: '+2',
      comparison: 'invoices generated',
      isPositive: true,
      icon: FileText,
      color: '#a855f7',
      target: 'invoice-management'
    },
    {
      id: 'paid-invoices',
      title: 'Paid Invoices',
      value: String(metrics.paidInvoices),
      growth: '100% ePOD',
      comparison: 'settled in full',
      isPositive: true,
      icon: ShieldCheck,
      color: '#10b981',
      target: 'invoice-management'
    },
    {
      id: 'pending-invoices',
      title: 'Pending Invoices',
      value: String(metrics.pendingInvoices),
      growth: 'T+15 terms',
      comparison: 'awaiting clearance',
      isPositive: null,
      icon: Clock,
      color: '#f59e0b',
      target: 'invoice-management'
    },
    {
      id: 'overdue-invoices',
      title: 'Overdue Invoices',
      value: String(metrics.overdueInvoices),
      growth: 'Action Required',
      comparison: 'past payment due date',
      isPositive: false,
      icon: AlertTriangle,
      color: '#ef4444',
      target: 'invoice-management'
    },
    {
      id: 'total-expenses',
      title: 'Total Expenses',
      value: formatINR(metrics.totalExpenses),
      growth: '-3.4%',
      comparison: 'OPEX efficiency',
      isPositive: true,
      icon: TrendingDown,
      color: '#f97316',
      target: 'expense-management'
    },
    {
      id: 'outstanding-payments',
      title: 'Outstanding Receivables',
      value: formatINR(metrics.outstandingPayments),
      growth: '3 Shippers',
      comparison: 'net exposure balance',
      isPositive: null,
      icon: CreditCard,
      color: '#f59e0b',
      target: 'customer-payments'
    },
    {
      id: 'total-refunds',
      title: 'Total Refunds',
      value: formatINR(metrics.totalRefunds),
      growth: '4 Claims',
      comparison: 'detention & adjustments',
      isPositive: null,
      icon: RotateCcw,
      color: '#ec4899',
      target: 'refund-management'
    }
  ];

  // Quick Action Handlers
  const handleCreateInvoiceSubmit = (invData) => {
    if (billingService?.createInvoice) {
      billingService.createInvoice(invData);
      if (showToast) showToast(`Invoice ${invData.invoiceNumber || 'INV-2026-NEW'} created successfully!`);
    }
  };

  const handleRecordPaymentSubmit = (payData) => {
    if (billingService?.recordPayment) {
      billingService.recordPayment(payData);
      if (showToast) showToast(`Payment of ₹${payData.amount.toLocaleString('en-IN')} recorded!`);
    }
  };

  const handleAddExpenseSubmit = (expData) => {
    if (billingService?.recordExpense) {
      billingService.recordExpense(expData);
      if (showToast) showToast(`Expense of ₹${expData.amount.toLocaleString('en-IN')} saved!`);
    }
  };

  const handleProcessRefundAction = (refundId, action) => {
    if (billingService?.processRefund) {
      billingService.processRefund(refundId, action);
      if (showToast) showToast(`Refund claim updated to ${action}`);
    }
  };

  return (
    <div className="dashboard-layout" style={{ width: '100%', overflowX: 'hidden', background: '#0b0f19', color: '#f8fafc', display: 'flex', minHeight: '100vh' }}>
      {/* 1. Left Sidebar Navigation (14 Modules) */}
      <BillingSidebar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onLogout={onLogout}
        onSwitchPortal={onSwitchPortal}
      />

      {/* 2. Main Executive Area */}
      <div className="dashboard-main" style={{ flex: 1, minWidth: 0, overflowX: 'hidden', display: 'flex', flexDirection: 'column' }}>
        {/* Fixed Header */}
        <BillingHeader
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          currentUser={currentUser}
          onLogout={onLogout}
          onSwitchPortal={onSwitchPortal}
          onNavigateTab={setActiveTab}
          notifications={notifications}
        />

        {/* Content Area */}
        <main style={{ padding: '24px', flex: 1, overflowX: 'hidden' }}>
          {activeTab === 'dashboard' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
              {/* Executive Welcome Banner */}
              <div
                style={{
                  background: 'linear-gradient(135deg, #10172a, #0b1329)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '16px',
                  padding: '24px 28px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <div>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(37,99,235,0.15)', border: '1px solid rgba(37,99,235,0.3)', padding: '3px 10px', borderRadius: '12px', color: '#38bdf8', fontSize: '11px', fontWeight: 700, marginBottom: '8px' }}>
                    <Sparkles size={12} />
                    <span>CORPORATE TREASURY & ACCOUNTS COMMAND</span>
                  </div>
                  <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#fff', margin: '0 0 4px 0', letterSpacing: '-0.3px' }}>
                    Welcome back, <span style={{ color: '#38bdf8' }}>{currentUser?.fullName || 'Devin Vance'}</span>
                  </h1>
                  <p style={{ fontSize: '12.5px', color: '#94a3b8', margin: 0 }}>
                    Monitor real-time freight cashflows, customer collections, and operational EBITDA margins.
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '11px', color: '#94a3b8' }}>Realized Net Operating Profit</div>
                    <div style={{ fontSize: '24px', fontWeight: 800, color: '#10b981' }}>{formatINR(metrics.netProfit)}</div>
                    <div style={{ fontSize: '10.5px', color: '#38bdf8' }}>{metrics.profitMarginPct}% Operating Margin</div>
                  </div>
                </div>
              </div>

              {/* Section A: 10 Summary Cards */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
                    ● FINANCIAL INTELLIGENCE SUMMARY
                  </div>
                  <span style={{ fontSize: '11px', color: '#64748b' }}>Live Ledger Synced</span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px' }}>
                  {summaryCards.map((card) => {
                    const Icon = card.icon;
                    return (
                      <div
                        key={card.id}
                        onClick={() => setActiveTab(card.target)}
                        style={{
                          background: '#111726',
                          border: '1px solid rgba(255, 255, 255, 0.08)',
                          borderRadius: '12px',
                          padding: '14px 12px',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                          minHeight: '105px'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = card.color;
                          e.currentTarget.style.transform = 'translateY(-2px)';
                          e.currentTarget.style.boxShadow = `0 6px 16px ${card.color}22`;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 600 }}>{card.title}</span>
                          <div style={{ width: '26px', height: '26px', borderRadius: '6px', background: `${card.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Icon size={14} color={card.color} />
                          </div>
                        </div>

                        <div style={{ margin: '6px 0 2px' }}>
                          <div style={{ fontSize: '19px', fontWeight: 800, color: '#fff', letterSpacing: '-0.4px' }}>
                            {card.value}
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', marginTop: '2px' }}>
                            <span style={{ color: card.isPositive === true ? '#10b981' : card.isPositive === false ? '#ef4444' : '#38bdf8', fontWeight: 600 }}>
                              {card.growth}
                            </span>
                            <span style={{ color: '#64748b' }}>{card.comparison}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Section J: Quick Action Shortcuts (7 Functional Buttons) */}
              <div style={{ background: '#111726', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '16px', padding: '16px 20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Sparkles size={16} color="#38bdf8" />
                    <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#fff', margin: 0 }}>Treasury Quick Actions</h3>
                  </div>
                  <span style={{ fontSize: '11px', color: '#64748b' }}>7 Instant Workflows</span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '10px' }}>
                  <button
                    onClick={() => setIsCreateInvoiceOpen(true)}
                    style={{ background: 'rgba(37,99,235,0.12)', border: '1px solid rgba(37,99,235,0.3)', borderRadius: '8px', padding: '10px', color: '#38bdf8', fontSize: '11.5px', fontWeight: 600, cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}
                  >
                    <PlusCircle size={16} /> Create Invoice
                  </button>

                  <button
                    onClick={() => setIsRecordPaymentOpen(true)}
                    style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '8px', padding: '10px', color: '#10b981', fontSize: '11.5px', fontWeight: 600, cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}
                  >
                    <CreditCard size={16} /> Record Payment
                  </button>

                  <button
                    onClick={() => setActiveTab('customer-payments')}
                    style={{ background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: '8px', padding: '10px', color: '#f59e0b', fontSize: '11.5px', fontWeight: 600, cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}
                  >
                    <Clock size={16} /> View Outstanding
                  </button>

                  <button
                    onClick={() => setIsAddExpenseOpen(true)}
                    style={{ background: 'rgba(249,115,22,0.12)', border: '1px solid rgba(249,115,22,0.3)', borderRadius: '8px', padding: '10px', color: '#f97316', fontSize: '11.5px', fontWeight: 600, cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}
                  >
                    <TrendingDown size={16} /> Log Expense
                  </button>

                  <button
                    onClick={() => setActiveTab('financial-reports')}
                    style={{ background: 'rgba(168,85,247,0.12)', border: '1px solid rgba(168,85,247,0.3)', borderRadius: '8px', padding: '10px', color: '#c084fc', fontSize: '11.5px', fontWeight: 600, cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}
                  >
                    <BarChart3 size={16} /> Financial Report
                  </button>

                  <button
                    onClick={() => setActiveTab('refund-management')}
                    style={{ background: 'rgba(236,72,153,0.12)', border: '1px solid rgba(236,72,153,0.3)', borderRadius: '8px', padding: '10px', color: '#f472b6', fontSize: '11.5px', fontWeight: 600, cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}
                  >
                    <RotateCcw size={16} /> Process Refund
                  </button>

                  <button
                    onClick={() => billingService?.exportCSV && billingService.exportCSV('invoices')}
                    style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', padding: '10px', color: '#cbd5e1', fontSize: '11.5px', fontWeight: 600, cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}
                  >
                    <Download size={16} /> Export Data
                  </button>
                </div>
              </div>

              {/* Section B & C: Revenue Overview & Invoice Overview */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '20px' }}>
                {/* Revenue Overview */}
                <div style={{ background: '#111726', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '16px', padding: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <TrendingUp size={18} color="#10b981" />
                      <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#fff', margin: 0 }}>Revenue Breakdown & Growth</h3>
                    </div>
                    <span style={{ fontSize: '11px', color: '#10b981', fontWeight: 700, background: 'rgba(16,185,129,0.15)', padding: '2px 8px', borderRadius: '6px' }}>
                      +14.8% YoY
                    </span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', textAlign: 'center', marginBottom: '16px' }}>
                    <div style={{ background: 'rgba(255,255,255,0.02)', padding: '10px', borderRadius: '8px' }}>
                      <div style={{ fontSize: '16px', fontWeight: 700, color: '#fff' }}>₹1.48L</div>
                      <div style={{ fontSize: '10px', color: '#94a3b8' }}>Daily Revenue</div>
                    </div>
                    <div style={{ background: 'rgba(255,255,255,0.02)', padding: '10px', borderRadius: '8px' }}>
                      <div style={{ fontSize: '16px', fontWeight: 700, color: '#fff' }}>₹2.85L</div>
                      <div style={{ fontSize: '10px', color: '#94a3b8' }}>Weekly Revenue</div>
                    </div>
                    <div style={{ background: 'rgba(255,255,255,0.02)', padding: '10px', borderRadius: '8px' }}>
                      <div style={{ fontSize: '16px', fontWeight: 700, color: '#38bdf8' }}>₹4.52L</div>
                      <div style={{ fontSize: '10px', color: '#94a3b8' }}>Monthly Revenue</div>
                    </div>
                    <div style={{ background: 'rgba(255,255,255,0.02)', padding: '10px', borderRadius: '8px' }}>
                      <div style={{ fontSize: '16px', fontWeight: 700, color: '#a855f7' }}>₹48.9L</div>
                      <div style={{ fontSize: '10px', color: '#94a3b8' }}>Yearly Revenue</div>
                    </div>
                  </div>

                  {/* Revenue by Shipper Progress Bars */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '11.5px' }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', color: '#cbd5e1', marginBottom: '3px' }}>
                        <span>NexGen Industrial Corp (Heavy Haul FTL)</span>
                        <strong>₹1,47,500 (33%)</strong>
                      </div>
                      <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.06)', borderRadius: '3px' }}>
                        <div style={{ width: '33%', height: '100%', background: '#2563eb', borderRadius: '3px' }} />
                      </div>
                    </div>

                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', color: '#cbd5e1', marginBottom: '3px' }}>
                        <span>Zenith Heavy Machinery (Oversized Container)</span>
                        <strong>₹1,08,560 (24%)</strong>
                      </div>
                      <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.06)', borderRadius: '3px' }}>
                        <div style={{ width: '24%', height: '100%', background: '#0284c7', borderRadius: '3px' }} />
                      </div>
                    </div>

                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', color: '#cbd5e1', marginBottom: '3px' }}>
                        <span>Apex FMCG Logistics Ltd (Dedicated Distribution)</span>
                        <strong>₹88,500 (20%)</strong>
                      </div>
                      <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.06)', borderRadius: '3px' }}>
                        <div style={{ width: '20%', height: '100%', background: '#10b981', borderRadius: '3px' }} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Invoice Status Overview */}
                <div style={{ background: '#111726', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '16px', padding: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <FileText size={18} color="#38bdf8" />
                      <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#fff', margin: 0 }}>Invoice Pipeline Status</h3>
                    </div>
                    <button
                      onClick={() => setActiveTab('invoice-management')}
                      style={{ background: 'none', border: 'none', color: '#38bdf8', fontSize: '11px', cursor: 'pointer' }}
                    >
                      View All →
                    </button>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: 'rgba(16,185,129,0.08)', borderRadius: '8px' }}>
                      <span style={{ color: '#fff' }}>Paid & Succeeded</span>
                      <strong style={{ color: '#10b981' }}>{metrics.paidInvoices} Invoices (₹1.48L)</strong>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: 'rgba(245,158,11,0.08)', borderRadius: '8px' }}>
                      <span style={{ color: '#fff' }}>Pending Customer Clearance</span>
                      <strong style={{ color: '#f59e0b' }}>{metrics.pendingInvoices} Invoices (₹1.97L)</strong>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: 'rgba(239,68,68,0.08)', borderRadius: '8px' }}>
                      <span style={{ color: '#fff' }}>Overdue Past Grace Window</span>
                      <strong style={{ color: '#ef4444' }}>{metrics.overdueInvoices} Invoice (₹44.9k)</strong>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }}>
                      <span style={{ color: '#fff' }}>Draft / Staging Invoices</span>
                      <strong style={{ color: '#cbd5e1' }}>1 Invoice (₹44.8k)</strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section D & E: Payment Overview & Expense Management Overview */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                {/* Payment Overview */}
                <div style={{ background: '#111726', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '16px', padding: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <CreditCard size={18} color="#38bdf8" />
                      <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#fff', margin: 0 }}>Payment Channel Settlements</h3>
                    </div>
                    <button
                      onClick={() => setActiveTab('payment-management')}
                      style={{ background: 'none', border: 'none', color: '#38bdf8', fontSize: '11px', cursor: 'pointer' }}
                    >
                      Audit Trail →
                    </button>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', textAlign: 'center', marginBottom: '14px' }}>
                    <div style={{ background: 'rgba(255,255,255,0.02)', padding: '10px', borderRadius: '8px' }}>
                      <div style={{ fontSize: '16px', fontWeight: 700, color: '#10b981' }}>₹1,47,500</div>
                      <div style={{ fontSize: '10px', color: '#94a3b8' }}>Bank Wire (RTGS)</div>
                    </div>
                    <div style={{ background: 'rgba(255,255,255,0.02)', padding: '10px', borderRadius: '8px' }}>
                      <div style={{ fontSize: '16px', fontWeight: 700, color: '#38bdf8' }}>₹20,000</div>
                      <div style={{ fontSize: '10px', color: '#94a3b8' }}>Online Gateway</div>
                    </div>
                    <div style={{ background: 'rgba(255,255,255,0.02)', padding: '10px', borderRadius: '8px' }}>
                      <div style={{ fontSize: '16px', fontWeight: 700, color: '#f59e0b' }}>₹88,500</div>
                      <div style={{ fontSize: '10px', color: '#94a3b8' }}>Corporate ACH (T+2)</div>
                    </div>
                  </div>

                  <div style={{ fontSize: '11.5px', color: '#94a3b8', background: 'rgba(255,255,255,0.02)', padding: '10px 12px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between' }}>
                    <span>Payment Verification SLA:</span>
                    <strong style={{ color: '#10b981' }}>100% Automated Webhook Clearance</strong>
                  </div>
                </div>

                {/* Expense Overview */}
                <div style={{ background: '#111726', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '16px', padding: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <TrendingDown size={18} color="#f97316" />
                      <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#fff', margin: 0 }}>Operational Expense (OPEX) Outlays</h3>
                    </div>
                    <button
                      onClick={() => setActiveTab('expense-management')}
                      style={{ background: 'none', border: 'none', color: '#f97316', fontSize: '11px', cursor: 'pointer' }}
                    >
                      Expense Breakdown →
                    </button>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', textAlign: 'center', marginBottom: '14px' }}>
                    <div style={{ background: 'rgba(249,115,22,0.08)', padding: '10px', borderRadius: '8px' }}>
                      <div style={{ fontSize: '16px', fontWeight: 700, color: '#f97316' }}>₹22,179</div>
                      <div style={{ fontSize: '10px', color: '#94a3b8' }}>Fuel Outlays</div>
                    </div>
                    <div style={{ background: 'rgba(244,63,94,0.08)', padding: '10px', borderRadius: '8px' }}>
                      <div style={{ fontSize: '16px', fontWeight: 700, color: '#f43f5e' }}>₹42,500</div>
                      <div style={{ fontSize: '10px', color: '#94a3b8' }}>Maintenance</div>
                    </div>
                    <div style={{ background: 'rgba(168,85,247,0.08)', padding: '10px', borderRadius: '8px' }}>
                      <div style={{ fontSize: '16px', fontWeight: 700, color: '#c084fc' }}>₹18,500</div>
                      <div style={{ fontSize: '10px', color: '#94a3b8' }}>Crew & Driver</div>
                    </div>
                  </div>

                  <div style={{ fontSize: '11.5px', color: '#94a3b8', background: 'rgba(255,255,255,0.02)', padding: '10px 12px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between' }}>
                    <span>Total OPEX Incurred:</span>
                    <strong style={{ color: '#fff' }}>₹82,879 (56% Expense-to-Revenue Ratio)</strong>
                  </div>
                </div>
              </div>

              {/* Section F & G: Profit & Loss Overview + Tax & Billing Overview */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                {/* Profit & Loss Overview */}
                <div style={{ background: '#111726', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '16px', padding: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <DollarSign size={18} color="#10b981" />
                      <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#fff', margin: 0 }}>Executive Profit & Loss Statement</h3>
                    </div>
                    <button
                      onClick={() => setActiveTab('financial-reports')}
                      style={{ background: 'none', border: 'none', color: '#10b981', fontSize: '11px', cursor: 'pointer' }}
                    >
                      P&L Statement →
                    </button>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12.5px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#cbd5e1' }}>
                      <span>Gross Realized Turnover:</span>
                      <strong style={{ color: '#10b981' }}>+₹1,47,500</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#cbd5e1' }}>
                      <span>Total Fleet Operational Costs (OPEX):</span>
                      <strong style={{ color: '#f43f5e' }}>-₹82,879</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#cbd5e1' }}>
                      <span>Refund Adjustments & Surcharges:</span>
                      <strong style={{ color: '#f59e0b' }}>-₹0</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#fff', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '8px', fontWeight: 800, fontSize: '14px' }}>
                      <span>Net Operating Margin (EBITDA):</span>
                      <span style={{ color: '#38bdf8' }}>+₹64,621 (44% Margin)</span>
                    </div>
                  </div>
                </div>

                {/* Tax & Billing Overview */}
                <div style={{ background: '#111726', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '16px', padding: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Percent size={18} color="#a855f7" />
                      <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#fff', margin: 0 }}>GST Tax Reconciliation</h3>
                    </div>
                    <button
                      onClick={() => setActiveTab('tax-management')}
                      style={{ background: 'none', border: 'none', color: '#a855f7', fontSize: '11px', cursor: 'pointer' }}
                    >
                      Tax Portal →
                    </button>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12.5px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#cbd5e1' }}>
                      <span>GSTIN Registered:</span>
                      <strong style={{ color: '#38bdf8', fontFamily: 'monospace' }}>36AAACT8492K1Z9</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#cbd5e1' }}>
                      <span>Outward Tax Collected (CGST+SGST / IGST 18%):</span>
                      <strong style={{ color: '#fff' }}>₹62,460</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#cbd5e1' }}>
                      <span>Input Tax Credit (ITC) Offset on OPEX:</span>
                      <strong style={{ color: '#10b981' }}>-₹24,800</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#fff', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '8px', fontWeight: 800, fontSize: '14px' }}>
                      <span>Net Tax Payable to Government Treasury:</span>
                      <span style={{ color: '#a855f7' }}>₹37,660</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section I: 6 Interactive Charts & Analytics */}
              <div style={{ background: '#111726', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '16px', padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <BarChart3 size={20} color="#38bdf8" />
                    <div>
                      <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#fff', margin: 0 }}>
                        Interactive Financial Charts & Analytics
                      </h3>
                      <p style={{ fontSize: '11px', color: '#94a3b8', margin: '2px 0 0' }}>
                        Visual models for revenue growth, OPEX trends, profit margins, and aging receivables
                      </p>
                    </div>
                  </div>
                  <span style={{ fontSize: '11px', background: 'rgba(37,99,235,0.15)', color: '#38bdf8', padding: '4px 10px', borderRadius: '12px', fontWeight: 600 }}>
                    6 Treasury Analytics
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '18px' }}>
                  {/* Chart 1: Monthly Revenue Chart */}
                  <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px', padding: '14px' }}>
                    <div style={{ fontSize: '12.5px', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>1. Monthly Revenue Curve</div>
                    <svg viewBox="0 0 280 100" style={{ width: '100%', height: '90px' }}>
                      <path d="M 10 80 Q 70 65, 140 45 T 270 20" fill="none" stroke="#10b981" strokeWidth="2.5" />
                      <circle cx="270" cy="20" r="3.5" fill="#10b981" />
                      <text x="10" y="95" fill="#64748b" fontSize="8">Jun (₹2.8L)</text>
                      <text x="130" y="95" fill="#64748b" fontSize="8">Aug (₹3.6L)</text>
                      <text x="230" y="95" fill="#64748b" fontSize="8">Nov (₹4.5L)</text>
                    </svg>
                  </div>

                  {/* Chart 2: Monthly Expenses Chart */}
                  <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px', padding: '14px' }}>
                    <div style={{ fontSize: '12.5px', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>2. Monthly Expenses OPEX Trend</div>
                    <svg viewBox="0 0 280 100" style={{ width: '100%', height: '90px' }}>
                      <path d="M 10 50 L 70 65 L 140 45 L 210 55 L 270 40" fill="none" stroke="#f97316" strokeWidth="2.5" />
                      <circle cx="270" cy="40" r="3.5" fill="#f97316" />
                      <text x="10" y="95" fill="#64748b" fontSize="8">Fuel</text>
                      <text x="130" y="95" fill="#64748b" fontSize="8">Maintenance</text>
                      <text x="240" y="95" fill="#64748b" fontSize="8">Leases</text>
                    </svg>
                  </div>

                  {/* Chart 3: Profit & Loss Chart */}
                  <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px', padding: '14px' }}>
                    <div style={{ fontSize: '12.5px', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>3. Net Profit Margin (44%)</div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '80px', gap: '20px' }}>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '20px', fontWeight: 800, color: '#38bdf8' }}>44%</div>
                        <div style={{ fontSize: '10px', color: '#94a3b8' }}>Net Margin</div>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '20px', fontWeight: 800, color: '#f59e0b' }}>56%</div>
                        <div style={{ fontSize: '10px', color: '#94a3b8' }}>Expense Ratio</div>
                      </div>
                    </div>
                  </div>

                  {/* Chart 4: Payment Status Distribution */}
                  <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px', padding: '14px' }}>
                    <div style={{ fontSize: '12.5px', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>4. Payment Status Distribution</div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', height: '80px' }}>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '18px', fontWeight: 800, color: '#10b981' }}>75%</div>
                        <div style={{ fontSize: '9.5px', color: '#94a3b8' }}>Completed</div>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '18px', fontWeight: 800, color: '#f59e0b' }}>15%</div>
                        <div style={{ fontSize: '9.5px', color: '#94a3b8' }}>Pending</div>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '18px', fontWeight: 800, color: '#ef4444' }}>10%</div>
                        <div style={{ fontSize: '9.5px', color: '#94a3b8' }}>Failed</div>
                      </div>
                    </div>
                  </div>

                  {/* Chart 5: Customer-Wise Revenue */}
                  <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px', padding: '14px' }}>
                    <div style={{ fontSize: '12.5px', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>5. Customer-Wise Revenue</div>
                    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', height: '65px', paddingBottom: '4px' }}>
                      <div style={{ width: '24px', height: '55px', background: '#2563eb', borderRadius: '3px' }} title="NexGen: ₹1.48L" />
                      <div style={{ width: '24px', height: '42px', background: '#0284c7', borderRadius: '3px' }} title="Zenith: ₹1.08L" />
                      <div style={{ width: '24px', height: '34px', background: '#38bdf8', borderRadius: '3px' }} title="Apex: ₹88.5k" />
                      <div style={{ width: '24px', height: '26px', background: '#a855f7', borderRadius: '3px' }} title="Nova: ₹64.9k" />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', color: '#64748b' }}>
                      <span>NexGen</span><span>Zenith</span><span>Apex</span><span>Nova</span>
                    </div>
                  </div>

                  {/* Chart 6: Outstanding Payment Trends */}
                  <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px', padding: '14px' }}>
                    <div style={{ fontSize: '12.5px', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>6. Outstanding Aging Analysis</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '11px', marginTop: '10px' }}>
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#cbd5e1' }}>
                          <span>0-30 Days (Current)</span><strong>₹1,97,100 (81%)</strong>
                        </div>
                        <div style={{ width: '100%', height: '5px', background: 'rgba(255,255,255,0.06)', borderRadius: '3px' }}>
                          <div style={{ width: '81%', height: '100%', background: '#38bdf8', borderRadius: '3px' }} />
                        </div>
                      </div>
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#cbd5e1' }}>
                          <span>31-60 Days (Grace)</span><strong>₹44,900 (19%)</strong>
                        </div>
                        <div style={{ width: '100%', height: '5px', background: 'rgba(255,255,255,0.06)', borderRadius: '3px' }}>
                          <div style={{ width: '19%', height: '100%', background: '#f59e0b', borderRadius: '3px' }} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 14 Navigation Modules Routing */}
          {activeTab === 'billing-management' && (
            <BillingManagementView
              bills={bills}
              onOpenCreateBill={() => setIsAddExpenseOpen(true)}
            />
          )}

          {activeTab === 'invoice-management' && (
            <InvoiceManagementView
              invoices={invoices}
              onOpenCreateInvoice={() => setIsCreateInvoiceOpen(true)}
              onViewInvoice={(inv) => setSelectedInvoiceForView(inv)}
              onMarkPaid={(id) => {
                if (billingService?.updateInvoiceStatus) {
                  billingService.updateInvoiceStatus(id, 'Paid');
                  if (showToast) showToast('Invoice settled in full!');
                }
              }}
              onExportCSV={(type) => billingService?.exportCSV && billingService.exportCSV(type)}
            />
          )}

          {activeTab === 'payment-management' && (
            <PaymentManagementView
              payments={payments}
              onOpenRecordPayment={() => setIsRecordPaymentOpen(true)}
            />
          )}

          {activeTab === 'customer-payments' && (
            <CustomerPaymentsView invoices={invoices} />
          )}

          {activeTab === 'refund-management' && (
            <RefundManagementView
              refunds={refunds}
              onProcessRefund={handleProcessRefundAction}
            />
          )}

          {activeTab === 'transport-charges' && (
            <TransportationChargesView transportCharges={transportCharges} />
          )}

          {activeTab === 'expense-management' && (
            <ExpenseManagementView
              expenses={expenses}
              onOpenAddExpense={() => setIsAddExpenseOpen(true)}
            />
          )}

          {activeTab === 'revenue-management' && (
            <RevenueManagementView invoices={invoices} />
          )}

          {activeTab === 'tax-management' && (
            <TaxManagementView taxConfig={taxConfig} />
          )}

          {activeTab === 'financial-reports' && (
            <FinancialReportsView billingService={billingService} />
          )}

          {activeTab === 'transaction-history' && (
            <TransactionHistoryView payments={payments} expenses={expenses} />
          )}

          {activeTab === 'notifications' && (
            <BillingNotificationsView
              notifications={notifications}
              onMarkRead={(id) => billingService?.markNotificationRead && billingService.markNotificationRead(id)}
              onMarkAllRead={() => billingService?.markAllNotificationsRead && billingService.markAllNotificationsRead()}
            />
          )}

          {activeTab === 'profile' && (
            <BillingProfileView currentUser={currentUser} />
          )}
        </main>
      </div>

      {/* Modals Mounted at Root */}
      <CreateInvoiceModal
        isOpen={isCreateInvoiceOpen}
        onClose={() => setIsCreateInvoiceOpen(false)}
        onCreateInvoice={handleCreateInvoiceSubmit}
      />

      <RecordPaymentModal
        isOpen={isRecordPaymentOpen}
        onClose={() => setIsRecordPaymentOpen(false)}
        invoices={invoices}
        onRecordPayment={handleRecordPaymentSubmit}
      />

      <AddExpenseModal
        isOpen={isAddExpenseOpen}
        onClose={() => setIsAddExpenseOpen(false)}
        onAddExpense={handleAddExpenseSubmit}
      />

      <ViewInvoiceModal
        isOpen={Boolean(selectedInvoiceForView)}
        onClose={() => setSelectedInvoiceForView(null)}
        invoice={selectedInvoiceForView}
      />
    </div>
  );
};
