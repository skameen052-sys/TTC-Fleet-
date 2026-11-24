// frontend/src/services/customerService.js
// Enterprise Customer Logistics Service for TTC Fleet360
// Seamlessly integrated with logisticsService (localStorage: ttc_logistics360_data_v1)

import { logisticsService } from './logisticsService';
import { workflowService } from './workflowService';
import { billingService } from './billingService';

const CUSTOMER_STORAGE_KEY = 'ttc_customer360_data_v1';

const INITIAL_CUSTOMER_PROFILE = {
  id: 'CUST-8021',
  name: 'Sarah Jenkins',
  companyName: 'NexGen Industrial Corp',
  accountType: 'Enterprise Freight Partner (Tier-1)',
  email: 'customer@ttcfleet360.com',
  phone: '+1 (312) 555-8912',
  taxId: 'US-EIN-94-3829104',
  billingAddress: 'NexGen Industrial Tower, 450 N Michigan Ave, Suite 1800, Chicago, IL 60611',
  shippingAddresses: [
    {
      id: 'ADDR-1',
      label: 'Chicago Production Plant (Primary)',
      dock: 'Dock 4-B',
      address: '4200 S Pulaski Rd, Chicago, IL 60632',
      contact: 'Marcus Vance (+1 312-555-0199)',
      isDefault: true
    },
    {
      id: 'ADDR-2',
      label: 'Detroit Assembly Terminal',
      dock: 'Bay 12 South',
      address: '7500 E Jefferson Ave, Detroit, MI 48214',
      contact: 'Elena Rostova (+1 313-555-4821)',
      isDefault: false
    },
    {
      id: 'ADDR-3',
      label: 'Cleveland Regional Hub',
      dock: 'Cargo Gate 2',
      address: '1800 E 55th St, Cleveland, OH 44103',
      contact: 'David Miller (+1 216-555-9201)',
      isDefault: false
    }
  ]
};

const INITIAL_INVOICES = [
  {
    id: 'INV-2026-8901',
    orderId: 'ORD-9101',
    date: '2026-11-20',
    dueDate: '2026-12-05',
    amount: 14850,
    tax: 1188,
    total: 16038,
    status: 'Paid',
    paidDate: '2026-11-21',
    paymentMethod: 'ACH Corporate Transfer (Ref #ACH-98214)',
    items: [
      { desc: 'Industrial Machinery Freight (4,850 kg) - Chicago to Detroit', qty: 1, rate: 13500 },
      { desc: 'Priority Dedicated Fleet Transit & Telemetry', qty: 1, rate: 1350 }
    ]
  },
  {
    id: 'INV-2026-8902',
    orderId: 'ORD-9103',
    date: '2026-11-21',
    dueDate: '2026-12-06',
    amount: 31200,
    tax: 2496,
    total: 33696,
    status: 'Pending',
    paidDate: null,
    paymentMethod: null,
    items: [
      { desc: 'High-Value Electronics Freight (3,400 kg) - Indianapolis to Chicago', qty: 1, rate: 28500 },
      { desc: 'Temperature & Climate Monitoring Telemetry', qty: 1, rate: 2700 }
    ]
  },
  {
    id: 'INV-2026-8903',
    orderId: 'ORD-9107',
    date: '2026-11-18',
    dueDate: '2026-12-02',
    amount: 18750,
    tax: 1500,
    total: 20250,
    status: 'Paid',
    paidDate: '2026-11-19',
    paymentMethod: 'Fleet Wire Direct (Ref #WIRE-4491)',
    items: [
      { desc: 'Automated Microchip Assemblies (820 kg) - Columbus to Detroit', qty: 1, rate: 17200 },
      { desc: 'Security Escort & Geo-Fenced Telemetry', qty: 1, rate: 1550 }
    ]
  },
  {
    id: 'INV-2026-8904',
    orderId: 'ORD-9108',
    date: '2026-11-22',
    dueDate: '2026-12-08',
    amount: 9800,
    tax: 784,
    total: 10584,
    status: 'Pending',
    paidDate: null,
    paymentMethod: null,
    items: [
      { desc: 'Precision Cold-Chain Reagents (1,150 kg) - Milwaukee to Chicago', qty: 1, rate: 8900 },
      { desc: 'Active Reefer Cryo-Log Unit', qty: 1, rate: 900 }
    ]
  }
];

const INITIAL_PAYMENTS = [
  {
    id: 'PAY-7701',
    invoiceId: 'INV-2026-8901',
    amount: 16038,
    date: '2026-11-21 14:32',
    method: 'Corporate ACH Transfer',
    account: 'JPMorgan Chase ****4892',
    status: 'Completed',
    receiptUrl: '#receipt-7701'
  },
  {
    id: 'PAY-7702',
    invoiceId: 'INV-2026-8903',
    amount: 20250,
    date: '2026-11-19 11:15',
    method: 'Fleet Wire Direct',
    account: 'Wells Fargo Commercial ****1092',
    status: 'Completed',
    receiptUrl: '#receipt-7702'
  }
];

const INITIAL_REFUNDS = [
  {
    id: 'REF-301',
    orderId: 'ORD-8941',
    invoiceId: 'INV-2026-8402',
    amount: 1250,
    reason: 'Dock Delay Demurrage Credit - Carrier late arrival at Chicago Gate 4B',
    date: '2026-11-15',
    status: 'Approved',
    resolutionDate: '2026-11-17',
    notes: 'Credit memo issued and credited back to Corporate ACH line.'
  }
];

const INITIAL_SUPPORT_TICKETS = [
  {
    id: 'TICK-902',
    subject: 'Request for Expedited Temperature Logging Report on ORD-9101',
    category: 'Telemetry & Reports',
    priority: 'Normal',
    createdAt: '2026-11-22 09:40',
    status: 'Resolved',
    description: 'Please provide the hourly IoT refrigerated sensor log export for audit compliance.',
    responses: [
      {
        sender: 'TTC Logistics Dispatch Support',
        time: '2026-11-22 10:15',
        text: 'Hello Sarah, telemetry logs exported from Freightliner TTC-8492-HD have been uploaded to your document vault.'
      }
    ]
  },
  {
    id: 'TICK-903',
    subject: 'Add Auxiliary Delivery Gate Clearance for Detroit Terminal',
    category: 'Delivery Address',
    priority: 'High',
    createdAt: '2026-11-23 08:30',
    status: 'In Progress',
    description: 'We need gate code clearance for Bay 12 South added to the driver trip brief for today’s incoming dispatch.',
    responses: [
      {
        sender: 'Alexandre Mercer (Fleet Ops)',
        time: '2026-11-23 09:05',
        text: 'Driver Marcus Vance has been updated with the Bay 12 South code via his Driver Portal HUD.'
      }
    ]
  }
];

const INITIAL_NOTIFICATIONS = [
  {
    id: 'NOTIF-C1',
    type: 'shipment_update',
    title: 'Shipment SHP-8201 In Transit',
    message: 'Freightliner TTC-8492-HD is cruising on I-94 East. ETA Detroit: 1h 45m.',
    time: '15 mins ago',
    unread: true,
    orderId: 'ORD-9101',
    shipmentId: 'SHP-8201'
  },
  {
    id: 'NOTIF-C2',
    type: 'order_approved',
    title: 'Order ORD-9102 Approved',
    message: 'Your transport booking for Cleveland Terminal to Columbus has been authorized by Logistics Operations.',
    time: '1 hour ago',
    unread: true,
    orderId: 'ORD-9102'
  },
  {
    id: 'NOTIF-C3',
    type: 'billing',
    title: 'New Invoice INV-2026-8904 Generated',
    message: 'Invoice of $10,584.00 for Cold-Chain Freight ORD-9108 is available for download.',
    time: '4 hours ago',
    unread: false,
    invoiceId: 'INV-2026-8904'
  },
  {
    id: 'NOTIF-C4',
    type: 'payment',
    title: 'Payment Confirmed - Ref #PAY-7701',
    message: 'Corporate ACH payment of $16,038.00 has cleared successfully for Invoice INV-2026-8901.',
    time: '2 days ago',
    unread: false
  }
];

class CustomerService {
  constructor() {
    this.subscribers = [];
    this.data = this.loadData();

    // Subscribe to logistics service updates so customer view is always in sync with Admin/Logistics manager
    try {
      logisticsService.subscribe(() => {
        this.notifySubscribers();
      });
    } catch (_) {}

    if (typeof window !== 'undefined') {
      window.addEventListener('storage', (e) => {
        if (e.key === 'ttc_logistics360_data_v1') {
          this.notifySubscribers();
        }
      });
    }
  }

  loadData() {
    if (typeof window === 'undefined') {
      return {
        profile: INITIAL_CUSTOMER_PROFILE,
        invoices: INITIAL_INVOICES,
        payments: INITIAL_PAYMENTS,
        refunds: INITIAL_REFUNDS,
        tickets: INITIAL_SUPPORT_TICKETS,
        notifications: INITIAL_NOTIFICATIONS
      };
    }

    try {
      const stored = localStorage.getItem(CUSTOMER_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Error loading customer data, initializing fresh:', e);
    }

    const initial = {
      profile: INITIAL_CUSTOMER_PROFILE,
      invoices: INITIAL_INVOICES,
      payments: INITIAL_PAYMENTS,
      refunds: INITIAL_REFUNDS,
      tickets: INITIAL_SUPPORT_TICKETS,
      notifications: INITIAL_NOTIFICATIONS
    };
    this.saveData(initial);
    return initial;
  }

  saveData(data) {
    this.data = data;
    if (typeof window !== 'undefined') {
      localStorage.setItem(CUSTOMER_STORAGE_KEY, JSON.stringify(data));
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
        console.error('Error notifying customer subscriber:', err);
      }
    });
  }

  // Combined customer data getter that merges shared logistics orders and customer portal state
  getData() {
    const sharedLogistics = logisticsService.getData();
    const companyName = this.data.profile.companyName;

    // Filter orders matching this customer or default to all if company match
    const orders = sharedLogistics.orders || [];
    const customerOrders = orders.filter(
      o => o.customerName === companyName || !o.customerName || o.customerId === this.data.profile.id
    );

    // Merge active shipments for these orders
    const shipments = sharedLogistics.shipments || [];
    const customerShipments = shipments.filter(s =>
      customerOrders.some(o => o.id === s.orderId) || s.customerName === companyName
    );

    const trips = sharedLogistics.trips || [];
    const deliveries = sharedLogistics.deliveries || [];

    return {
      profile: this.data.profile,
      orders: customerOrders.length > 0 ? customerOrders : orders, // Fallback to all logistics orders for demo richness
      allSystemOrders: orders,
      shipments: customerShipments.length > 0 ? customerShipments : shipments,
      trips,
      deliveries,
      invoices: this.data.invoices,
      payments: this.data.payments,
      refunds: this.data.refunds,
      tickets: this.data.tickets,
      notifications: this.data.notifications
    };
  }

  // Metrics calculation
  getSummaryMetrics() {
    const { orders, shipments, invoices, payments } = this.getData();

    const pendingOrders = orders.filter(o => o.status === 'Pending' || o.status === 'Processing').length;
    const approvedOrders = orders.filter(o => o.status === 'Approved').length;
    const inTransitShipments = shipments.filter(s => s.status === 'In Transit').length;
    const deliveredShipments = shipments.filter(s => s.status === 'Delivered').length;

    const pendingInvoices = invoices.filter(i => i.status === 'Pending');
    const pendingPaymentsTotal = pendingInvoices.reduce((acc, i) => acc + (i.total || i.amount || 0), 0);
    const totalPaymentsMade = payments
      .filter(p => p.status === 'Completed')
      .reduce((acc, p) => acc + (p.amount || 0), 0);

    return {
      totalOrders: orders.length,
      pendingOrders,
      approvedOrders,
      activeShipments: shipments.filter(s => s.status !== 'Delivered' && s.status !== 'Cancelled').length,
      inTransitShipments,
      deliveredShipments,
      pendingPaymentsCount: pendingInvoices.length,
      pendingPaymentsTotal,
      totalPaymentsMade
    };
  }

  // 1. Create Transportation Order (Books into logisticsService so Admin & Logistics Manager receive it immediately!)
  createOrder(bookingData) {
    const amountCalc = (bookingData.totalWeightKg || 1000) * 2.8 + 1200;
    const orderPayload = {
      customerName: this.data.profile.companyName,
      customerContact: this.data.profile.phone,
      customerId: this.data.profile.id,
      pickupLocation: bookingData.pickupLocation,
      deliveryLocation: bookingData.deliveryLocation,
      orderDate: new Date().toISOString().split('T')[0],
      expectedDelivery: bookingData.expectedDeliveryDate,
      priority: bookingData.priority || 'Standard',
      amount: Math.round(amountCalc),
      status: 'Pending',
      itemsCount: parseInt(bookingData.packageCount) || 1,
      totalWeightKg: parseInt(bookingData.totalWeightKg) || 1000,
      type: bookingData.goodsCategory || 'Commercial Freight',
      description: bookingData.goodsDescription || '',
      specialInstructions: bookingData.specialInstructions || '',
      contactPerson: bookingData.contactPersonName || this.data.profile.name,
      contactPhone: bookingData.contactPersonPhone || this.data.profile.phone,
      dimensions: bookingData.dimensions || 'Standard Palletized'
    };

    // Save directly to shared logisticsService!
    const newOrder = logisticsService.addOrder(orderPayload);

    // Sync to centralized workflowService
    try {
      workflowService.createOrder({
        orderId: newOrder.id,
        customerId: this.data.profile.id,
        customerName: this.data.profile.companyName,
        customerContact: this.data.profile.phone,
        pickupAddress: newOrder.pickupLocation,
        deliveryAddress: newOrder.deliveryLocation,
        pickupDate: newOrder.orderDate,
        expectedDeliveryDate: newOrder.expectedDelivery,
        goodsCategory: newOrder.type,
        goodsDescription: newOrder.description,
        packageQuantity: newOrder.itemsCount,
        weightKg: newOrder.totalWeightKg,
        specialInstructions: newOrder.specialInstructions,
        amount: newOrder.amount
      });
    } catch (_) {}

    // Also generate a draft invoice for this order
    const newInvoice = {
      id: `INV-2026-${Math.floor(8900 + Math.random() * 999)}`,
      orderId: newOrder.id,
      date: newOrder.orderDate,
      dueDate: new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0],
      amount: newOrder.amount,
      tax: Math.round(newOrder.amount * 0.08),
      total: Math.round(newOrder.amount * 1.08),
      status: 'Pending',
      paidDate: null,
      paymentMethod: null,
      items: [
        {
          desc: `${newOrder.type} (${newOrder.totalWeightKg} kg) - ${newOrder.pickupLocation} to ${newOrder.deliveryLocation}`,
          qty: 1,
          rate: newOrder.amount
        }
      ]
    };

    const newNotification = {
      id: `NOTIF-C-${Date.now()}`,
      type: 'order_created',
      title: `Order ${newOrder.id} Placed Successfully`,
      message: `Your booking for ${newOrder.pickupLocation} to ${newOrder.deliveryLocation} is awaiting Admin / Operations approval.`,
      time: 'Just now',
      unread: true,
      orderId: newOrder.id
    };

    const updatedData = {
      ...this.data,
      invoices: [newInvoice, ...this.data.invoices],
      notifications: [newNotification, ...this.data.notifications]
    };

    this.saveData(updatedData);
    return newOrder;
  }

  // Cancel order (if still pending)
  cancelOrder(orderId, reason = 'Cancelled by Customer') {
    logisticsService.updateOrderStatus(orderId, 'Cancelled');
    const newNotification = {
      id: `NOTIF-C-${Date.now()}`,
      type: 'order_cancelled',
      title: `Order ${orderId} Cancelled`,
      message: `Order was cancelled. Reason: ${reason}.`,
      time: 'Just now',
      unread: true,
      orderId
    };
    this.saveData({
      ...this.data,
      notifications: [newNotification, ...this.data.notifications]
    });
  }

  // Make Payment
  makePayment(invoiceId, paymentDetails) {
    const targetInvoice = this.data.invoices.find(i => i.id === invoiceId);
    if (!targetInvoice) return false;

    const paymentAmount = targetInvoice.total || targetInvoice.amount;
    const newPayment = {
      id: `PAY-${Math.floor(7700 + Math.random() * 999)}`,
      invoiceId,
      amount: paymentAmount,
      date: new Date().toISOString().slice(0, 16).replace('T', ' '),
      method: paymentDetails.method || 'Corporate ACH Direct',
      account: paymentDetails.account || 'Corporate Account ****4892',
      status: 'Completed',
      receiptUrl: `#receipt-${invoiceId}`
    };

    const updatedInvoices = this.data.invoices.map(inv =>
      inv.id === invoiceId
        ? {
            ...inv,
            status: 'Paid',
            paidDate: new Date().toISOString().split('T')[0],
            paymentMethod: paymentDetails.method || 'Corporate ACH Direct'
          }
        : inv
    );

    const paymentNotif = {
      id: `NOTIF-C-${Date.now()}`,
      type: 'payment',
      title: `Payment Received for ${invoiceId}`,
      message: `Payment of $${paymentAmount.toLocaleString()} completed successfully. Ref: ${newPayment.id}.`,
      time: 'Just now',
      unread: true,
      invoiceId
    };

    this.saveData({
      ...this.data,
      invoices: updatedInvoices,
      payments: [newPayment, ...this.data.payments],
      notifications: [paymentNotif, ...this.data.notifications]
    });

    // Sync to centralized workflowService & billingService
    try {
      workflowService.payInvoice(invoiceId, paymentDetails.method || 'Corporate ACH Direct', this.data.profile.name);
      billingService.recordPayment({
        invoiceId,
        customerName: this.data.profile.companyName,
        amount: paymentAmount,
        method: paymentDetails.method || 'Corporate ACH Direct',
        date: new Date().toISOString().split('T')[0],
        status: 'Completed',
        notes: `Customer settled invoice ${invoiceId}`
      });
    } catch (_) {}

    return newPayment;
  }

  // Request Refund
  requestRefund(refundData) {
    const newRefund = {
      id: `REF-${Math.floor(300 + Math.random() * 699)}`,
      orderId: refundData.orderId,
      invoiceId: refundData.invoiceId || 'N/A',
      amount: parseFloat(refundData.amount) || 500,
      reason: refundData.reason,
      date: new Date().toISOString().split('T')[0],
      status: 'Under Review',
      resolutionDate: null,
      notes: refundData.notes || 'Submitted for claims assessment.'
    };

    const notif = {
      id: `NOTIF-C-${Date.now()}`,
      type: 'refund',
      title: `Refund Request ${newRefund.id} Logged`,
      message: `Claim for $${newRefund.amount} on Order ${newRefund.orderId} is being audited by Finance.`,
      time: 'Just now',
      unread: true
    };

    this.saveData({
      ...this.data,
      refunds: [newRefund, ...this.data.refunds],
      notifications: [notif, ...this.data.notifications]
    });

    return newRefund;
  }

  // Raise Support Ticket / Complaint
  createSupportTicket(ticketData) {
    const newTicket = {
      id: `TICK-${Math.floor(900 + Math.random() * 999)}`,
      subject: ticketData.subject,
      category: ticketData.category || 'General Support',
      priority: ticketData.priority || 'Normal',
      createdAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
      status: 'Open',
      description: ticketData.description,
      responses: [
        {
          sender: 'TTC Customer Support Bot',
          time: 'Just now',
          text: 'Thank you for reaching out. A dedicated logistics dispatcher has been assigned to your ticket.'
        }
      ]
    };

    const notif = {
      id: `NOTIF-C-${Date.now()}`,
      type: 'support',
      title: `Ticket ${newTicket.id} Created`,
      message: `"${newTicket.subject}" has been queued with Customer Success Operations.`,
      time: 'Just now',
      unread: true
    };

    this.saveData({
      ...this.data,
      tickets: [newTicket, ...this.data.tickets],
      notifications: [notif, ...this.data.notifications]
    });

    return newTicket;
  }

  // Add / Update Address
  saveShippingAddress(addressData) {
    let updatedAddresses;
    if (addressData.id) {
      updatedAddresses = this.data.profile.shippingAddresses.map(a =>
        a.id === addressData.id ? { ...a, ...addressData } : a
      );
    } else {
      const newAddr = {
        id: `ADDR-${Date.now()}`,
        ...addressData,
        isDefault: this.data.profile.shippingAddresses.length === 0
      };
      updatedAddresses = [...this.data.profile.shippingAddresses, newAddr];
    }

    this.saveData({
      ...this.data,
      profile: {
        ...this.data.profile,
        shippingAddresses: updatedAddresses
      }
    });
  }

  // Notifications
  markNotificationRead(notifId) {
    const updated = this.data.notifications.map(n =>
      n.id === notifId ? { ...n, unread: false } : n
    );
    this.saveData({
      ...this.data,
      notifications: updated
    });
  }

  markAllNotificationsRead() {
    const updated = this.data.notifications.map(n => ({ ...n, unread: false }));
    this.saveData({
      ...this.data,
      notifications: updated
    });
  }

  // Profile update
  updateProfile(profileData) {
    this.saveData({
      ...this.data,
      profile: {
        ...this.data.profile,
        ...profileData
      }
    });
  }
}

export const customerService = new CustomerService();
