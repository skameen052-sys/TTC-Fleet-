// frontend/src/services/billingService.js
// Enterprise Billing & Finance Management Service for TTC Fleet360
// Manages Invoices, Payments, Expenses, Refunds, Taxes, Transportation Charges and Profit & Loss

const BILLING_STORAGE_KEY = 'ttc_billing360_data_v1';

const INITIAL_INVOICES = [
  {
    id: 'INV-2026-001',
    invoiceNumber: 'INV-2026-001',
    orderId: 'ORD-9101',
    customerId: 'CUST-8021',
    customerName: 'NexGen Industrial Corp',
    billingDate: '2026-11-18',
    dueDate: '2026-12-05',
    subtotal: 125000,
    tax: 22500,
    total: 147500,
    paidAmount: 147500,
    balance: 0,
    status: 'Paid',
    paidDate: '2026-11-20',
    paymentMethod: 'Bank Wire (RTGS)',
    serviceType: 'Heavy Freight Haulage',
    notes: 'NH-44 Corridor interstate heavy machinery haulage',
    items: [
      { desc: 'Industrial Machinery Freight (4,850 kg) - Chicago to Detroit', qty: 1, rate: 110000, taxRate: 18 },
      { desc: 'Express Priority Transit & Satellite Telemetry', qty: 1, rate: 15000, taxRate: 18 }
    ]
  },
  {
    id: 'INV-2026-002',
    invoiceNumber: 'INV-2026-002',
    orderId: 'ORD-9102',
    customerId: 'CUST-8022',
    customerName: 'Apex FMCG Logistics Ltd',
    billingDate: '2026-11-20',
    dueDate: '2026-12-10',
    subtotal: 75000,
    tax: 13500,
    total: 88500,
    paidAmount: 0,
    balance: 88500,
    status: 'Pending',
    paidDate: null,
    paymentMethod: 'Corporate ACH',
    serviceType: 'Dedicated Fleet Distribution',
    notes: 'Multi-stop FMCG depot fulfillment',
    items: [
      { desc: 'Palletized Consumer Goods (12 Pallets) - Hyderabad to Bangalore', qty: 1, rate: 65000, taxRate: 18 },
      { desc: 'Automated Loading Bay Docking Fee', qty: 1, rate: 10000, taxRate: 18 }
    ]
  },
  {
    id: 'INV-2026-003',
    invoiceNumber: 'INV-2026-003',
    orderId: 'ORD-9103',
    customerId: 'CUST-8023',
    customerName: 'Nova Cold Chain Pharma',
    billingDate: '2026-11-10',
    dueDate: '2026-11-22',
    subtotal: 55000,
    tax: 9900,
    total: 64900,
    paidAmount: 20000,
    balance: 44900,
    status: 'Overdue',
    paidDate: null,
    paymentMethod: 'Online Payment Gateway',
    serviceType: 'Refrigerated Cold Chain',
    notes: 'Vaccine consignment at -20°C monitored transit',
    items: [
      { desc: 'Temperature-Controlled Pharma Freight (3,200 kg)', qty: 1, rate: 50000, taxRate: 18 },
      { desc: 'Continuous Temperature Logger Certification', qty: 1, rate: 5000, taxRate: 18 }
    ]
  },
  {
    id: 'INV-2026-004',
    invoiceNumber: 'INV-2026-004',
    orderId: 'ORD-9104',
    customerId: 'CUST-8024',
    customerName: 'Zenith Heavy Machinery',
    billingDate: '2026-11-22',
    dueDate: '2026-12-15',
    subtotal: 92000,
    tax: 16560,
    total: 108560,
    paidAmount: 0,
    balance: 108560,
    status: 'Sent',
    paidDate: null,
    paymentMethod: 'Bank Wire (NEFT)',
    serviceType: 'Oversized Container Transit',
    notes: 'Hydraulic press shipment with escort vehicle',
    items: [
      { desc: 'Over-Dimensional Heavy Cargo Haulage', qty: 1, rate: 82000, taxRate: 18 },
      { desc: 'Pilot Escort & Highway Permit Surcharges', qty: 1, rate: 10000, taxRate: 18 }
    ]
  },
  {
    id: 'INV-2026-005',
    invoiceNumber: 'INV-2026-005',
    orderId: 'ORD-9105',
    customerId: 'CUST-8021',
    customerName: 'NexGen Industrial Corp',
    billingDate: '2026-11-23',
    dueDate: '2026-12-20',
    subtotal: 38000,
    tax: 6840,
    total: 44840,
    paidAmount: 0,
    balance: 44840,
    status: 'Draft',
    paidDate: null,
    paymentMethod: 'Pending Selection',
    serviceType: 'Regional Courier Dispatch',
    notes: 'Industrial replacement bearings rapid dispatch',
    items: [
      { desc: 'Emergency Spares Air-Suspension Freight', qty: 1, rate: 38000, taxRate: 18 }
    ]
  }
];

const INITIAL_BILLS = [
  {
    id: 'BILL-1001',
    billNumber: 'IOCL-NOV-892',
    vendor: 'Indian Oil Corporation Ltd (IOCL)',
    category: 'Fuel Expenses',
    amount: 22179,
    date: '2026-11-21',
    dueDate: '2026-12-05',
    status: 'Paid',
    paidDate: '2026-11-22',
    paymentMethod: 'Corporate Fuel Card',
    description: 'Bulk High-Speed Diesel (HSD) refueling for Heavy Haul Fleet (TRK-01 to TRK-06)'
  },
  {
    id: 'BILL-1002',
    billNumber: 'VOLVO-SVC-410',
    vendor: 'Volvo Trucks India Services',
    category: 'Vehicle Maintenance',
    amount: 42500,
    date: '2026-11-19',
    dueDate: '2026-12-03',
    status: 'Paid',
    paidDate: '2026-11-20',
    paymentMethod: 'Corporate Bank Transfer',
    description: 'Major B-Service Overhaul, brake retarding calibration for Volvo FH16 (AP-09-XY-8492)'
  },
  {
    id: 'BILL-1003',
    billNumber: 'TOLL-FASTAG-99',
    vendor: 'National Highways Toll Authority (IHMCL FASTag)',
    category: 'Transportation Charges',
    amount: 14800,
    date: '2026-11-20',
    dueDate: '2026-11-25',
    status: 'Pending',
    paidDate: null,
    paymentMethod: 'Automated FASTag Wallet',
    description: 'Interstate Electronic Toll Plazas on NH-44 and Golden Quadrilateral routes'
  },
  {
    id: 'BILL-1004',
    billNumber: 'WH-LEASE-HYD',
    vendor: 'Hyderabad Central Logistics Park SEZ',
    category: 'Warehouse Expenses',
    amount: 35000,
    date: '2026-11-01',
    dueDate: '2026-11-15',
    status: 'Paid',
    paidDate: '2026-11-05',
    paymentMethod: 'Bank Wire (RTGS)',
    description: 'Bay 4 & Cold Storage Unit monthly operational lease and docking charges'
  }
];

const INITIAL_PAYMENTS = [
  {
    id: 'PAY-8001',
    transactionRef: 'TXN-RTGS-98214',
    invoiceId: 'INV-2026-001',
    customerName: 'NexGen Industrial Corp',
    amount: 147500,
    date: '2026-11-20',
    method: 'Bank Wire (RTGS)',
    status: 'Completed',
    verifiedBy: 'Finance Controller',
    notes: 'Received via HDFC Corporate Banking'
  },
  {
    id: 'PAY-8002',
    transactionRef: 'TXN-UPI-41829',
    invoiceId: 'INV-2026-003',
    customerName: 'Nova Cold Chain Pharma',
    amount: 20000,
    date: '2026-11-15',
    method: 'Online Payment Gateway',
    status: 'Completed',
    verifiedBy: 'Automated Webhook',
    notes: 'Part-payment received towards INV-2026-003'
  },
  {
    id: 'PAY-8003',
    transactionRef: 'TXN-ACH-00291',
    invoiceId: 'INV-2026-002',
    customerName: 'Apex FMCG Logistics Ltd',
    amount: 88500,
    date: '2026-11-22',
    method: 'Corporate ACH',
    status: 'Pending',
    verifiedBy: 'Pending Settlement',
    notes: 'Clearing cycle T+2 initiated'
  },
  {
    id: 'PAY-8004',
    transactionRef: 'TXN-GATE-9912',
    invoiceId: 'INV-2026-004',
    customerName: 'Zenith Heavy Machinery',
    amount: 108560,
    date: '2026-11-21',
    method: 'Corporate Credit Card',
    status: 'Failed',
    verifiedBy: 'Payment Gateway',
    notes: 'Transaction limit exceeded on corporate merchant card'
  }
];

const INITIAL_EXPENSES = [
  {
    id: 'EXP-501',
    category: 'Fuel Expenses',
    amount: 22179,
    date: '2026-11-21',
    vendor: 'IOCL Fuel Hub',
    vehicleId: 'AP-09-XY-8492',
    driver: 'Marcus Vance',
    paymentMethod: 'Fuel Card',
    status: 'Paid',
    description: '520 Liters HSD @ ₹89.50/L'
  },
  {
    id: 'EXP-502',
    category: 'Vehicle Maintenance',
    amount: 42500,
    date: '2026-11-19',
    vendor: 'Volvo OEM Workshop',
    vehicleId: 'AP-09-XY-8492',
    driver: 'Marcus Vance',
    paymentMethod: 'Bank Transfer',
    status: 'Paid',
    description: 'Periodic B-service, air filters, differential oil'
  },
  {
    id: 'EXP-503',
    category: 'Driver Expenses',
    amount: 18500,
    date: '2026-11-20',
    vendor: 'Interstate Crew Roster',
    vehicleId: 'All Vehicles',
    driver: 'Roster Staff (4 Drivers)',
    paymentMethod: 'Direct Payroll Wire',
    status: 'Paid',
    description: 'Driver highway night allowances & daily food stipends'
  },
  {
    id: 'EXP-504',
    category: 'Warehouse Expenses',
    amount: 35000,
    date: '2026-11-01',
    vendor: 'Hyderabad SEZ Logistics',
    vehicleId: 'Facility HQ',
    driver: 'N/A',
    paymentMethod: 'RTGS',
    status: 'Paid',
    description: 'Dock warehouse bay lease and power consumption'
  },
  {
    id: 'EXP-505',
    category: 'Transportation Charges',
    amount: 14800,
    date: '2026-11-20',
    vendor: 'IHMCL FASTag Tolls',
    vehicleId: 'Active Fleet',
    driver: 'Multiple',
    paymentMethod: 'Automated Wallet',
    status: 'Pending',
    description: 'Highway toll barrier pass charges'
  },
  {
    id: 'EXP-506',
    category: 'Other Operational Expenses',
    amount: 8200,
    date: '2026-11-18',
    vendor: 'Commercial Transit Insurance',
    vehicleId: 'Cargo Consignments',
    driver: 'N/A',
    paymentMethod: 'Online Banking',
    status: 'Paid',
    description: 'Goods-In-Transit marine insurance endorsement'
  }
];

const INITIAL_REFUNDS = [
  {
    id: 'REF-301',
    refundNumber: 'REF-2026-301',
    orderId: 'ORD-9080',
    invoiceId: 'INV-2026-001',
    customerName: 'NexGen Industrial Corp',
    amount: 5000,
    date: '2026-11-19',
    status: 'Completed',
    reason: 'Highway route delay detention credit waiver',
    processedDate: '2026-11-20',
    method: 'Account Credit Balance'
  },
  {
    id: 'REF-302',
    refundNumber: 'REF-2026-302',
    orderId: 'ORD-9102',
    invoiceId: 'INV-2026-002',
    customerName: 'Apex FMCG Logistics Ltd',
    amount: 3500,
    date: '2026-11-22',
    status: 'Pending',
    reason: 'Slight pallet outer packaging damage during unloading',
    processedDate: null,
    method: 'Direct Bank Refund'
  },
  {
    id: 'REF-303',
    refundNumber: 'REF-2026-303',
    orderId: 'ORD-9045',
    invoiceId: 'INV-2026-003',
    customerName: 'Nova Cold Chain Pharma',
    amount: 12000,
    date: '2026-11-12',
    status: 'Approved',
    reason: 'Prepaid surcharge reconciliation',
    processedDate: '2026-11-14',
    method: 'Adjust Against Invoice'
  },
  {
    id: 'REF-304',
    refundNumber: 'REF-2026-304',
    orderId: 'ORD-8990',
    invoiceId: 'INV-2026-004',
    customerName: 'Zenith Heavy Machinery',
    amount: 7800,
    date: '2026-11-05',
    status: 'Rejected',
    reason: 'Demurrage fee waiver outside contract SLA grace window',
    processedDate: '2026-11-06',
    method: 'N/A'
  }
];

const INITIAL_TRANSPORT_CHARGES = [
  { id: 'TC-1', service: 'Full Truckload (FTL) Heavy Haul', baseRatePerKm: 42, minDistanceKm: 150, fuelSurchargePct: 14, handlingCharge: 3500, taxRate: 18 },
  { id: 'TC-2', service: 'Less-Than-Truckload (LTL) Palletized', baseRatePerKm: 24, minDistanceKm: 100, fuelSurchargePct: 12, handlingCharge: 2000, taxRate: 18 },
  { id: 'TC-3', service: 'Refrigerated Cold Chain (-20°C)', baseRatePerKm: 58, minDistanceKm: 200, fuelSurchargePct: 18, handlingCharge: 5000, taxRate: 18 },
  { id: 'TC-4', service: 'Express Rapid Parcel Dispatch', baseRatePerKm: 32, minDistanceKm: 50, fuelSurchargePct: 10, handlingCharge: 1500, taxRate: 18 },
  { id: 'TC-5', service: 'Over-Dimensional Heavy Equipment', baseRatePerKm: 95, minDistanceKm: 250, fuelSurchargePct: 22, handlingCharge: 12000, taxRate: 18 }
];

const INITIAL_TAX_CONFIG = {
  legalEntity: 'TTC Global Freight & Fleet Solutions Pvt. Ltd.',
  gstin: '36AAACT8492K1Z9',
  pan: 'AAACT8492K',
  tan: 'HYDT12894A',
  sacCode: '996511 (Road Transport Services of Goods)',
  cgstRate: 9,
  sgstRate: 9,
  igstRate: 18,
  reverseChargeApplicable: false,
  eInvoiceEnabled: true,
  eWayBillAutoThreshold: 50000,
  taxCollectedThisMonth: 62460,
  taxPaidOnInputs: 24800,
  netTaxPayable: 37660
};

const INITIAL_NOTIFICATIONS = [
  { id: 'NOTIF-1', title: 'Overdue Invoice Reminder', message: 'Invoice INV-2026-003 for Nova Cold Chain Pharma (₹44,900) is 1 day overdue.', time: '10 min ago', type: 'urgent', read: false },
  { id: 'NOTIF-2', title: 'Payment Received', message: 'Received ₹1,47,500 via Bank Wire (RTGS) for INV-2026-001 from NexGen Industrial Corp.', time: '2 hours ago', type: 'success', read: false },
  { id: 'NOTIF-3', title: 'Refund Request Submitted', message: 'New refund request REF-2026-302 (₹3,500) awaiting finance review.', time: '4 hours ago', type: 'warning', read: false },
  { id: 'NOTIF-4', title: 'High Fuel Expense Logged', message: 'Fuel bill of ₹22,179 processed for Heavy Haul fleet refueling.', time: '1 day ago', type: 'info', read: true },
  { id: 'NOTIF-5', title: 'GST e-Invoice Sync', message: 'All 5 invoices successfully verified with GST e-Invoicing Portal.', time: '1 day ago', type: 'info', read: true }
];

class BillingService {
  constructor() {
    this.subscribers = [];
    this.data = this.loadData();
  }

  loadData() {
    try {
      const stored = localStorage.getItem(BILLING_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Error loading billing data from storage:', e);
    }
    return {
      invoices: INITIAL_INVOICES,
      bills: INITIAL_BILLS,
      payments: INITIAL_PAYMENTS,
      expenses: INITIAL_EXPENSES,
      refunds: INITIAL_REFUNDS,
      transportCharges: INITIAL_TRANSPORT_CHARGES,
      taxConfig: INITIAL_TAX_CONFIG,
      notifications: INITIAL_NOTIFICATIONS
    };
  }

  saveData() {
    try {
      localStorage.setItem(BILLING_STORAGE_KEY, JSON.stringify(this.data));
    } catch (e) {
      console.error('Error saving billing data to storage:', e);
    }
    this.notifySubscribers();
  }

  subscribe(callback) {
    this.subscribers.push(callback);
    callback(this.getData());
    return () => {
      this.subscribers = this.subscribers.filter(cb => cb !== callback);
    };
  }

  notifySubscribers() {
    const data = this.getData();
    this.subscribers.forEach(cb => {
      try {
        cb(data);
      } catch (err) {
        console.error('Error notifying billing subscriber:', err);
      }
    });
  }

  getData() {
    return this.data;
  }

  // Summary Metrics for the Dashboard (10 Cards)
  getSummaryMetrics() {
    const invoices = this.data.invoices || [];
    const payments = this.data.payments || [];
    const expenses = this.data.expenses || [];
    const refunds = this.data.refunds || [];

    // Total realized revenue from paid and partial payments
    const totalRevenue = invoices.reduce((sum, inv) => sum + (Number(inv.paidAmount) || 0), 0);
    const monthlyRevenue = invoices
      .filter(inv => inv.billingDate && inv.billingDate.startsWith('2026-11'))
      .reduce((sum, inv) => sum + (Number(inv.total) || 0), 0);
    const todayRevenue = 147500; // Simulated today settlement

    const totalInvoices = invoices.length;
    const paidInvoices = invoices.filter(inv => inv.status === 'Paid').length;
    const pendingInvoices = invoices.filter(inv => inv.status === 'Pending' || inv.status === 'Sent').length;
    const overdueInvoices = invoices.filter(inv => inv.status === 'Overdue').length;

    const totalExpenses = expenses.reduce((sum, exp) => sum + (Number(exp.amount) || 0), 0);
    const outstandingPayments = invoices.reduce((sum, inv) => sum + (Number(inv.balance) || 0), 0);
    const totalRefunds = refunds
      .filter(r => r.status === 'Completed' || r.status === 'Approved')
      .reduce((sum, r) => sum + (Number(r.amount) || 0), 0);

    const netProfit = totalRevenue - totalExpenses;
    const profitMarginPct = totalRevenue > 0 ? Math.round((netProfit / totalRevenue) * 100) : 0;

    return {
      totalRevenue,
      monthlyRevenue,
      todayRevenue,
      totalInvoices,
      paidInvoices,
      pendingInvoices,
      overdueInvoices,
      totalExpenses,
      outstandingPayments,
      totalRefunds,
      netProfit,
      profitMarginPct
    };
  }

  // Invoice Management
  createInvoice(invoiceData) {
    const nextNum = (this.data.invoices.length + 1).toString().padStart(3, '0');
    const newInvoice = {
      id: `INV-2026-${nextNum}`,
      invoiceNumber: `INV-2026-${nextNum}`,
      orderId: invoiceData.orderId || `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      customerId: invoiceData.customerId || 'CUST-8021',
      customerName: invoiceData.customerName || 'Enterprise Shipper',
      billingDate: invoiceData.billingDate || new Date().toISOString().split('T')[0],
      dueDate: invoiceData.dueDate || new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0],
      subtotal: Number(invoiceData.subtotal) || 50000,
      tax: Number(invoiceData.tax) || Math.round((Number(invoiceData.subtotal) || 50000) * 0.18),
      total: 0,
      paidAmount: 0,
      balance: 0,
      status: invoiceData.status || 'Pending',
      paidDate: null,
      paymentMethod: invoiceData.paymentMethod || 'Bank Wire (RTGS)',
      serviceType: invoiceData.serviceType || 'Full Truckload Heavy Freight',
      notes: invoiceData.notes || 'Automated Freight Invoice',
      items: invoiceData.items || [{ desc: 'Freight Transport Services', qty: 1, rate: 50000, taxRate: 18 }]
    };

    newInvoice.total = newInvoice.subtotal + newInvoice.tax;
    newInvoice.balance = newInvoice.total;

    this.data.invoices.unshift(newInvoice);

    // Add notification
    this.data.notifications.unshift({
      id: `NOTIF-${Date.now()}`,
      title: 'New Invoice Generated',
      message: `Invoice ${newInvoice.invoiceNumber} for ${newInvoice.customerName} (₹${newInvoice.total.toLocaleString('en-IN')}) generated.`,
      time: 'Just now',
      type: 'info',
      read: false
    });

    this.saveData();
    return newInvoice;
  }

  updateInvoiceStatus(invoiceId, status) {
    const inv = this.data.invoices.find(i => i.id === invoiceId);
    if (inv) {
      inv.status = status;
      if (status === 'Paid') {
        inv.paidAmount = inv.total;
        inv.balance = 0;
        inv.paidDate = new Date().toISOString().split('T')[0];
      }
      this.saveData();
    }
    return inv;
  }

  // Payment Management
  recordPayment(paymentData) {
    const newPayment = {
      id: `PAY-${Math.floor(8000 + Math.random() * 1000)}`,
      transactionRef: paymentData.transactionRef || `TXN-MAN-${Date.now().toString().slice(-6)}`,
      invoiceId: paymentData.invoiceId,
      customerName: paymentData.customerName || 'Enterprise Client',
      amount: Number(paymentData.amount) || 0,
      date: paymentData.date || new Date().toISOString().split('T')[0],
      method: paymentData.method || 'Bank Wire (RTGS)',
      status: paymentData.status || 'Completed',
      verifiedBy: 'Finance Controller',
      notes: paymentData.notes || 'Payment recorded manually'
    };

    this.data.payments.unshift(newPayment);

    // If matches an invoice, update invoice
    if (paymentData.invoiceId) {
      const inv = this.data.invoices.find(i => i.id === paymentData.invoiceId || i.invoiceNumber === paymentData.invoiceId);
      if (inv) {
        inv.paidAmount = (Number(inv.paidAmount) || 0) + newPayment.amount;
        inv.balance = Math.max(0, inv.total - inv.paidAmount);
        if (inv.balance === 0) {
          inv.status = 'Paid';
          inv.paidDate = newPayment.date;
        }
      }
    }

    this.data.notifications.unshift({
      id: `NOTIF-${Date.now()}`,
      title: 'Payment Recorded',
      message: `Payment of ₹${newPayment.amount.toLocaleString('en-IN')} recorded for ${newPayment.customerName}.`,
      time: 'Just now',
      type: 'success',
      read: false
    });

    this.saveData();
    return newPayment;
  }

  // Expense Management
  recordExpense(expenseData) {
    const newExpense = {
      id: `EXP-${Math.floor(500 + Math.random() * 500)}`,
      category: expenseData.category || 'Other Operational Expenses',
      amount: Number(expenseData.amount) || 0,
      date: expenseData.date || new Date().toISOString().split('T')[0],
      vendor: expenseData.vendor || 'Operational Vendor',
      vehicleId: expenseData.vehicleId || 'N/A',
      driver: expenseData.driver || 'N/A',
      paymentMethod: expenseData.paymentMethod || 'Corporate Card',
      status: expenseData.status || 'Paid',
      description: expenseData.description || 'Operational Expense'
    };

    this.data.expenses.unshift(newExpense);
    this.saveData();
    return newExpense;
  }

  // Refund Management
  processRefund(refundId, action, notes) {
    const ref = this.data.refunds.find(r => r.id === refundId);
    if (ref) {
      ref.status = action; // 'Approved' | 'Completed' | 'Rejected'
      ref.processedDate = new Date().toISOString().split('T')[0];
      if (notes) ref.notes = notes;
      this.saveData();
    }
    return ref;
  }

  // Create Bill
  createBill(billData) {
    const newBill = {
      id: `BILL-${Math.floor(1000 + Math.random() * 9000)}`,
      billNumber: billData.billNumber || `BILL-${Date.now().toString().slice(-4)}`,
      vendor: billData.vendor || 'Vendor Partner',
      category: billData.category || 'Maintenance',
      amount: Number(billData.amount) || 0,
      date: billData.date || new Date().toISOString().split('T')[0],
      dueDate: billData.dueDate || new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0],
      status: billData.status || 'Pending',
      paidDate: null,
      paymentMethod: billData.paymentMethod || 'Bank Transfer',
      description: billData.description || 'Vendor Operational Bill'
    };
    this.data.bills.unshift(newBill);
    this.saveData();
    return newBill;
  }

  // Mark notification read
  markNotificationRead(id) {
    const n = this.data.notifications.find(item => item.id === id);
    if (n) {
      n.read = true;
      this.saveData();
    }
  }

  markAllNotificationsRead() {
    this.data.notifications.forEach(n => { n.read = true; });
    this.saveData();
  }

  // Profit and Loss report dataset
  getProfitAndLossReport() {
    const metrics = this.getSummaryMetrics();
    return {
      totalRevenue: metrics.totalRevenue,
      totalExpenses: metrics.totalExpenses,
      netProfit: metrics.netProfit,
      expenseRatio: metrics.totalRevenue > 0 ? Math.round((metrics.totalExpenses / metrics.totalRevenue) * 100) : 0,
      breakdown: [
        { label: 'Freight Transport Revenue', amount: 125000, type: 'revenue' },
        { label: 'Value-Added Telemetry & Cold Chain', amount: 22500, type: 'revenue' },
        { label: 'Fuel & Energy Outlays', amount: 22179, type: 'expense' },
        { label: 'OEM Maintenance & Bay Overhauls', amount: 42500, type: 'expense' },
        { label: 'Driver Allowances & Stipends', amount: 18500, type: 'expense' },
        { label: 'Dock Warehousing & Handling', amount: 35000, type: 'expense' },
        { label: 'Highway Toll Charges (FASTag)', amount: 14800, type: 'expense' },
        { label: 'Transit Insurance & Misc', amount: 8200, type: 'expense' }
      ]
    };
  }

  // Export CSV
  exportCSV(type = 'invoices') {
    let rows = [];
    if (type === 'invoices') {
      rows = [
        ['Invoice Number', 'Customer', 'Date', 'Due Date', 'Subtotal', 'Tax', 'Total', 'Paid', 'Balance', 'Status'],
        ...this.data.invoices.map(i => [
          i.invoiceNumber,
          `"${i.customerName}"`,
          i.billingDate,
          i.dueDate,
          i.subtotal,
          i.tax,
          i.total,
          i.paidAmount,
          i.balance,
          i.status
        ])
      ];
    } else if (type === 'expenses') {
      rows = [
        ['ID', 'Category', 'Vendor', 'Amount', 'Date', 'Payment Method', 'Status', 'Description'],
        ...this.data.expenses.map(e => [
          e.id,
          `"${e.category}"`,
          `"${e.vendor}"`,
          e.amount,
          e.date,
          e.paymentMethod,
          e.status,
          `"${e.description}"`
        ])
      ];
    } else if (type === 'payments') {
      rows = [
        ['ID', 'Txn Ref', 'Invoice ID', 'Customer', 'Amount', 'Date', 'Method', 'Status'],
        ...this.data.payments.map(p => [
          p.id,
          p.transactionRef,
          p.invoiceId,
          `"${p.customerName}"`,
          p.amount,
          p.date,
          p.method,
          p.status
        ])
      ];
    }

    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map(e => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `TTC_Fleet360_${type}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

export const billingService = new BillingService();
