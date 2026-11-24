/**
 * TTC FLEET360 - Centralized End-to-End Workflow Service
 * Coordinates shared real-time state across:
 * - Customer Dashboard
 * - Admin Dashboard
 * - Logistics Manager Dashboard
 * - Fleet Manager Dashboard
 * - Driver Dashboard
 * - Warehouse Manager Dashboard
 * - Billing & Finance Dashboard
 */

const API_BASE = 'http://localhost:8080/api/workflow';
const STORAGE_KEY = 'ttc_unified_fleet360_state_v1';
const EVENT_NAME = 'ttc_workflow_update';

const DEFAULT_STATE = {
  orders: [
    {
      id: 1,
      orderId: 'ORD-89214',
      customerId: 'CUST-8021',
      customerName: 'NexGen Industrial Corp',
      customerContact: '+1 (555) 349-2041',
      pickupAddress: 'Los Angeles Logistics Terminal, Dock 14',
      deliveryAddress: 'Phoenix Regional Distribution Hub, Bay 3',
      pickupDate: '2026-11-24',
      expectedDeliveryDate: '2026-11-25',
      goodsCategory: 'Automotive Subassemblies & Precision Electronics',
      goodsDescription: 'High-value air-ride freight packages',
      packageQuantity: 48,
      weightKg: 14200.0,
      specialInstructions: 'Handle with air-ride suspension. High value freight.',
      orderStatus: 'In Transit',
      amount: 18450.0,
      assignedShipmentId: 'SHP-67210',
      assignedTripId: 'TRP-4501',
      createdAt: '2026-11-24T07:52:54'
    }
  ],
  shipments: [
    {
      id: 1,
      shipmentId: 'SHP-67210',
      orderId: 'ORD-89214',
      customerId: 'CUST-8021',
      customerName: 'NexGen Industrial Corp',
      origin: 'Los Angeles, CA',
      destination: 'Phoenix, AZ',
      status: 'In Transit',
      assignedVehicleReg: 'TTC-8492-HD',
      assignedDriver: 'Marcus Vance (D-01)',
      requiresWarehouse: false,
      estimatedDistanceKm: 612.0,
      progressPercent: 68,
      currentLocation: 'I-10 Eastbound, Mile 236 near Blythe',
      createdAt: '2026-11-24T08:52:54'
    }
  ],
  trips: [
    {
      id: 1,
      tripId: 'TRP-4501',
      orderId: 'ORD-89214',
      shipmentId: 'SHP-67210',
      vehicleReg: 'TTC-8492-HD',
      driverId: 'D-01',
      driverName: 'Marcus Vance',
      driverPhone: '+1 (555) 019-2834',
      startLocation: 'Los Angeles Logistics Terminal',
      destination: 'Phoenix Distribution Hub',
      status: 'In Transit',
      routeCode: 'RT-LA-PHX-01',
      currentSpeedKmh: 92,
      etaHours: '2h 15m remaining',
      latitude: 33.7490,
      longitude: -114.7140,
      podSignature: null,
      podPhotoUrl: null,
      deliveredAt: null,
      createdAt: '2026-11-24T09:52:54'
    }
  ],
  allocations: [
    {
      id: 1,
      requestId: 'REQ-3019',
      shipmentId: 'SHP-67210',
      orderId: 'ORD-89214',
      requestedVehicleType: 'Heavy Linehaul (Volvo FH16)',
      requiredCapacityKg: 14200.0,
      route: 'Los Angeles, CA -> Phoenix, AZ',
      status: 'Confirmed',
      assignedVehicleReg: 'TTC-8492-HD',
      assignedDriverId: 'D-01',
      assignedDriverName: 'Marcus Vance',
      createdAt: '2026-11-24T08:52:54'
    }
  ],
  warehouseOperations: [],
  inventory: [
    { id: 1, sku: 'SKU-ELEC-902', name: 'Micro-controller BCM-4', warehouseId: 'WH-CENTRAL-01', quantity: 240, bay: 'BAY-A3' },
    { id: 2, sku: 'SKU-AUTO-110', name: 'Brake Rotor Castings', warehouseId: 'WH-CENTRAL-01', quantity: 85, bay: 'BAY-C1' }
  ],
  invoices: [
    {
      id: 1,
      invoiceId: 'INV-94021',
      orderId: 'ORD-89214',
      shipmentId: 'SHP-67210',
      customerId: 'CUST-8021',
      customerName: 'NexGen Industrial Corp',
      amount: 15635.59,
      tax: 2814.41,
      total: 18450.0,
      status: 'Paid',
      paymentMethod: 'RTGS Wire Transfer',
      createdAt: '2026-11-24T08:52:54'
    }
  ],
  payments: [
    {
      id: 1,
      paymentId: 'PAY-89102',
      invoiceId: 'INV-94021',
      orderId: 'ORD-89214',
      customerId: 'CUST-8021',
      amount: 18450.0,
      method: 'RTGS Wire Transfer',
      transactionRef: 'TXN-CORP-A9B4208',
      status: 'Completed',
      createdAt: '2026-11-24T08:55:00'
    }
  ],
  notifications: [
    {
      id: 1,
      notificationId: 'NOTIF-1',
      recipientRole: 'ROLE_DRIVER',
      recipientId: 'D-01',
      title: 'New Trip Assigned',
      message: 'Trip TRP-4501 assigned to vehicle TTC-8492-HD for NexGen Industrial Corp.',
      type: 'info',
      linkPortal: 'driver',
      linkTab: 'trips',
      isRead: false,
      createdAt: '2026-11-24T09:00:00'
    }
  ],
  auditLogs: [
    {
      id: 1,
      logId: 'AUD-INIT',
      timestamp: '2026-11-24 07:50:00',
      actorRole: 'admin',
      actorUsername: 'SYSTEM',
      action: 'SYSTEM_BOOT',
      entityType: 'SYSTEM',
      entityId: 'ALL',
      details: 'Enterprise Unified Workflow Subsystem initialized'
    }
  ]
};

class WorkflowService {
  constructor() {
    this.listeners = new Set();
    this.isSyncing = false;
    this.init();
  }

  init() {
    // Check if we have existing state in localStorage
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_STATE));
    }
    // Attempt initial sync with backend
    this.syncFromBackend();

    // Listen to storage events across tabs
    window.addEventListener('storage', (e) => {
      if (e.key === STORAGE_KEY) {
        this.emitChange();
      }
    });

    // Listen to custom cross-component event
    window.addEventListener(EVENT_NAME, () => {
      this.notifyListeners();
    });
  }

  getState() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : DEFAULT_STATE;
    } catch (err) {
      console.warn('[WorkflowService] Read error, resetting default:', err);
      return DEFAULT_STATE;
    }
  }

  saveState(state) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      this.emitChange();
    } catch (err) {
      console.error('[WorkflowService] Save error:', err);
    }
  }

  emitChange() {
    window.dispatchEvent(new CustomEvent(EVENT_NAME));
    this.notifyListeners();
  }

  subscribe(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  notifyListeners() {
    const currentState = this.getState();
    this.listeners.forEach((cb) => {
      try {
        cb(currentState);
      } catch (err) {
        console.error('[WorkflowService] Listener error:', err);
      }
    });
  }

  async syncFromBackend() {
    if (this.isSyncing) return;
    this.isSyncing = true;
    try {
      const res = await fetch(`${API_BASE}/state`);
      if (res.ok) {
        const backendState = await res.json();
        if (backendState && backendState.success) {
          const local = this.getState();
          // Merge backend records with local
          const merged = {
            ...local,
            orders: backendState.orders?.length > 0 ? backendState.orders : local.orders,
            shipments: backendState.shipments?.length > 0 ? backendState.shipments : local.shipments,
            trips: backendState.trips?.length > 0 ? backendState.trips : local.trips,
            allocations: backendState.allocations?.length > 0 ? backendState.allocations : local.allocations,
            warehouseOperations: backendState.warehouseOperations?.length > 0 ? backendState.warehouseOperations : local.warehouseOperations,
            invoices: backendState.invoices?.length > 0 ? backendState.invoices : local.invoices,
            payments: backendState.payments?.length > 0 ? backendState.payments : local.payments,
            notifications: backendState.notifications?.length > 0 ? backendState.notifications : local.notifications,
            auditLogs: backendState.auditLogs?.length > 0 ? backendState.auditLogs : local.auditLogs
          };
          this.saveState(merged);
        }
      }
    } catch (err) {
      // Backend might be offline; fallback smoothly to localStorage
      console.warn('[WorkflowService] Backend sync skipped (using reactive local store):', err.message);
    } finally {
      this.isSyncing = false;
    }
  }

  // ==========================================
  // STAGE 1: CUSTOMER CREATES ORDER
  // ==========================================
  async createOrder(orderInput) {
    const state = this.getState();
    const orderId = 'ORD-' + (Math.floor(10000 + Math.random() * 90000));
    const newOrder = {
      id: Date.now(),
      orderId,
      customerId: orderInput.customerId || 'CUST-8021',
      customerName: orderInput.customerName || 'NexGen Industrial Corp',
      customerContact: orderInput.customerContact || '+1 (555) 349-2041',
      pickupAddress: orderInput.pickupAddress || 'San Francisco Distribution Center, Bay 4',
      deliveryAddress: orderInput.deliveryAddress || 'Seattle Freight Hub, Dock 12',
      pickupDate: orderInput.pickupDate || new Date().toISOString().split('T')[0],
      expectedDeliveryDate: orderInput.expectedDeliveryDate || new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
      goodsCategory: orderInput.goodsCategory || 'Industrial Machinery Parts',
      goodsDescription: orderInput.goodsDescription || 'Standard freight shipment',
      packageQuantity: parseInt(orderInput.packageQuantity || 24, 10),
      weightKg: parseFloat(orderInput.weightKg || 8500.0),
      specialInstructions: orderInput.specialInstructions || 'Standard handling',
      orderStatus: 'Pending Approval',
      amount: parseFloat(orderInput.amount || 14500.0),
      assignedShipmentId: null,
      assignedTripId: null,
      createdAt: new Date().toISOString()
    };

    // Add notification for Logistics Manager
    const notif = {
      id: Date.now(),
      notificationId: 'NOTIF-' + Math.floor(1000 + Math.random() * 9000),
      recipientRole: 'ROLE_LOGISTICS_MANAGER',
      recipientId: 'ALL',
      title: 'New Customer Order Pending Approval',
      message: `Customer ${newOrder.customerName} submitted order ${orderId} (${newOrder.goodsCategory}, ${newOrder.weightKg} kg).`,
      type: 'warning',
      linkPortal: 'logistics',
      linkTab: 'orders',
      isRead: false,
      createdAt: new Date().toISOString()
    };

    const audit = {
      id: Date.now(),
      logId: 'AUD-' + Math.floor(1000 + Math.random() * 9000),
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      actorRole: 'customer',
      actorUsername: newOrder.customerId,
      action: 'CREATE_ORDER',
      entityType: 'ORDER',
      entityId: orderId,
      details: `Created new freight order ${orderId} with status Pending Approval`
    };

    state.orders = [newOrder, ...state.orders];
    state.notifications = [notif, ...state.notifications];
    state.auditLogs = [audit, ...state.auditLogs];
    this.saveState(state);

    // Call backend API asynchronously
    try {
      fetch(`${API_BASE}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newOrder)
      }).catch((e) => console.warn('Backend order call background error:', e.message));
    } catch (_) {}

    return newOrder;
  }

  // ==========================================
  // STAGE 2: LOGISTICS APPROVES ORDER
  // ==========================================
  async updateOrderStatus(orderId, newStatus, actor = 'elena.rostova', reason = '') {
    const state = this.getState();
    const orderIdx = state.orders.findIndex((o) => o.orderId === orderId);
    if (orderIdx === -1) return null;

    const order = state.orders[orderIdx];
    order.orderStatus = newStatus;

    let shipment = null;
    let trip = null;
    let allocReq = null;

    if (newStatus === 'Approved') {
      const shipmentId = 'SHP-' + Math.floor(10000 + Math.random() * 90000);
      const tripId = 'TRP-' + Math.floor(1000 + Math.random() * 9000);
      const reqId = 'REQ-' + Math.floor(1000 + Math.random() * 9000);

      shipment = {
        id: Date.now(),
        shipmentId,
        orderId,
        customerId: order.customerId,
        customerName: order.customerName,
        origin: order.pickupAddress,
        destination: order.deliveryAddress,
        status: 'Created',
        assignedVehicleReg: 'Pending Allocation',
        assignedDriver: 'Pending Allocation',
        requiresWarehouse: false,
        estimatedDistanceKm: 650.0,
        progressPercent: 0,
        currentLocation: order.pickupAddress,
        createdAt: new Date().toISOString()
      };

      trip = {
        id: Date.now(),
        tripId,
        orderId,
        shipmentId,
        vehicleReg: 'Pending Allocation',
        driverId: 'Pending Allocation',
        driverName: 'Pending Allocation',
        driverPhone: '--',
        startLocation: order.pickupAddress,
        destination: order.deliveryAddress,
        status: 'Assigned',
        routeCode: 'RT-' + orderId.replace('ORD-', ''),
        currentSpeedKmh: 0,
        etaHours: 'Awaiting Driver',
        latitude: 34.0522,
        longitude: -118.2437,
        podSignature: null,
        podPhotoUrl: null,
        deliveredAt: null,
        createdAt: new Date().toISOString()
      };

      allocReq = {
        id: Date.now(),
        requestId: reqId,
        shipmentId,
        orderId,
        requestedVehicleType: order.weightKg > 10000 ? 'Heavy Linehaul (Volvo FH16)' : 'Medium Freight Van',
        requiredCapacityKg: order.weightKg,
        route: `${order.pickupAddress} -> ${order.deliveryAddress}`,
        status: 'Pending',
        assignedVehicleReg: null,
        assignedDriverId: null,
        assignedDriverName: null,
        createdAt: new Date().toISOString()
      };

      order.assignedShipmentId = shipmentId;
      order.assignedTripId = tripId;

      state.shipments = [shipment, ...state.shipments];
      state.trips = [trip, ...state.trips];
      state.allocations = [allocReq, ...state.allocations];

      // Notify Fleet Manager
      state.notifications = [
        {
          id: Date.now(),
          notificationId: 'NOTIF-' + Math.floor(1000 + Math.random() * 9000),
          recipientRole: 'ROLE_MANAGER',
          recipientId: 'ALL',
          title: 'Resource Allocation Request',
          message: `Logistics Manager requested vehicle & driver for shipment ${shipmentId} (${order.goodsCategory}).`,
          type: 'info',
          linkPortal: 'manager',
          linkTab: 'allocation',
          isRead: false,
          createdAt: new Date().toISOString()
        },
        ...state.notifications
      ];
    }

    // Customer Notification
    state.notifications = [
      {
        id: Date.now() + 1,
        notificationId: 'NOTIF-' + Math.floor(1000 + Math.random() * 9000),
        recipientRole: 'ROLE_CUSTOMER',
        recipientId: order.customerId,
        title: `Order ${orderId} ${newStatus}`,
        message: `Your transport order has been ${newStatus.toLowerCase()} by Logistics Control.${reason ? ` Reason: ${reason}` : ''}`,
        type: newStatus === 'Approved' ? 'success' : 'alert',
        linkPortal: 'customer',
        linkTab: 'orders',
        isRead: false,
        createdAt: new Date().toISOString()
      },
      ...state.notifications
    ];

    state.auditLogs = [
      {
        id: Date.now(),
        logId: 'AUD-' + Math.floor(1000 + Math.random() * 9000),
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        actorRole: 'logistics_manager',
        actorUsername: actor,
        action: 'UPDATE_ORDER_STATUS',
        entityType: 'ORDER',
        entityId: orderId,
        details: `Order status set to ${newStatus}${reason ? ` (${reason})` : ''}`
      },
      ...state.auditLogs
    ];

    this.saveState(state);

    // Call backend API asynchronously
    try {
      fetch(`${API_BASE}/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, actor, reason })
      }).catch((e) => console.warn('Backend status call background error:', e.message));
    } catch (_) {}

    return { order, shipment, trip, allocReq };
  }

  // ==========================================
  // STAGE 3: FLEET MANAGER ALLOCATES VEHICLE & DRIVER
  // ==========================================
  async confirmAllocation(requestId, { vehicleReg, driverId, driverName, driverPhone, actor = 'Vikram Malhotra' }) {
    const state = this.getState();
    const allocIdx = state.allocations.findIndex((a) => a.requestId === requestId);
    if (allocIdx === -1) return null;

    const alloc = state.allocations[allocIdx];
    alloc.status = 'Confirmed';
    alloc.assignedVehicleReg = vehicleReg;
    alloc.assignedDriverId = driverId;
    alloc.assignedDriverName = driverName;

    // Update corresponding Trip
    const trip = state.trips.find((t) => t.shipmentId === alloc.shipmentId);
    if (trip) {
      trip.vehicleReg = vehicleReg;
      trip.driverId = driverId;
      trip.driverName = driverName;
      trip.driverPhone = driverPhone || '+1 (555) 019-2834';
      trip.status = 'Assigned';
    }

    // Update Shipment
    const ship = state.shipments.find((s) => s.shipmentId === alloc.shipmentId);
    if (ship) {
      ship.assignedVehicleReg = vehicleReg;
      ship.assignedDriver = `${driverName} (${driverId})`;
    }

    // Notify Driver
    state.notifications = [
      {
        id: Date.now(),
        notificationId: 'NOTIF-' + Math.floor(1000 + Math.random() * 9000),
        recipientRole: 'ROLE_DRIVER',
        recipientId: driverId,
        title: 'New Trip Assigned',
        message: `Linehaul trip ${trip ? trip.tripId : 'assigned'} with vehicle ${vehicleReg} is ready.`,
        type: 'info',
        linkPortal: 'driver',
        linkTab: 'trips',
        isRead: false,
        createdAt: new Date().toISOString()
      },
      ...state.notifications
    ];

    state.auditLogs = [
      {
        id: Date.now(),
        logId: 'AUD-' + Math.floor(1000 + Math.random() * 9000),
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        actorRole: 'fleet_manager',
        actorUsername: actor,
        action: 'CONFIRM_ALLOCATION',
        entityType: 'ALLOCATION',
        entityId: requestId,
        details: `Confirmed vehicle ${vehicleReg} and driver ${driverName} (${driverId})`
      },
      ...state.auditLogs
    ];

    this.saveState(state);

    // Call backend API
    try {
      fetch(`${API_BASE}/allocations/${requestId}/confirm`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vehicleReg, driverId, driverName, driverPhone, actor })
      }).catch((e) => console.warn('Backend alloc confirm error:', e.message));
    } catch (_) {}

    return { alloc, trip, ship };
  }

  // ==========================================
  // STAGE 4: DRIVER TRANSITION STATUS
  // Assigned -> Accepted -> At Pickup -> Picked Up -> Started -> In Transit -> At Destination -> Delivered -> Completed
  // ==========================================
  async updateTripStatus(tripId, newStatus, actor = 'Marcus Vance', notes = '') {
    const state = this.getState();
    const trip = state.trips.find((t) => t.tripId === tripId);
    if (!trip) return null;

    const oldStatus = trip.status;
    trip.status = newStatus;

    if (newStatus === 'Started' || newStatus === 'In Transit') {
      const ship = state.shipments.find((s) => s.shipmentId === trip.shipmentId);
      if (ship) ship.status = 'In Transit';
      const order = state.orders.find((o) => o.orderId === trip.orderId);
      if (order) order.orderStatus = 'In Transit';
    } else if (newStatus === 'Delivered' || newStatus === 'Completed') {
      trip.deliveredAt = new Date().toISOString().replace('T', ' ').substring(0, 19);
    }

    state.auditLogs = [
      {
        id: Date.now(),
        logId: 'AUD-' + Math.floor(1000 + Math.random() * 9000),
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        actorRole: 'driver',
        actorUsername: actor,
        action: 'TRIP_STATUS_TRANSITION',
        entityType: 'TRIP',
        entityId: tripId,
        details: `Trip transitioned from ${oldStatus} to ${newStatus}${notes ? ` (${notes})` : ''}`
      },
      ...state.auditLogs
    ];

    state.notifications = [
      {
        id: Date.now(),
        notificationId: 'NOTIF-' + Math.floor(1000 + Math.random() * 9000),
        recipientRole: 'ROLE_CUSTOMER',
        recipientId: 'ALL',
        title: `Trip Status: ${newStatus}`,
        message: `Driver updated trip ${tripId} status to ${newStatus}.`,
        type: 'info',
        linkPortal: 'customer',
        linkTab: 'tracking',
        isRead: false,
        createdAt: new Date().toISOString()
      },
      ...state.notifications
    ];

    this.saveState(state);

    // Call backend API
    try {
      fetch(`${API_BASE}/trips/${tripId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, actor, notes })
      }).catch((e) => console.warn('Backend trip status error:', e.message));
    } catch (_) {}

    return trip;
  }

  // ==========================================
  // STAGE 5: GPS TELEMETRY BROADCAST
  // ==========================================
  async updateTripGps(tripId, gpsData) {
    const state = this.getState();
    const trip = state.trips.find((t) => t.tripId === tripId);
    if (!trip) return null;

    if (gpsData.lat !== undefined) trip.latitude = parseFloat(gpsData.lat);
    if (gpsData.lng !== undefined) trip.longitude = parseFloat(gpsData.lng);
    if (gpsData.speed !== undefined) trip.currentSpeedKmh = parseInt(gpsData.speed, 10);
    if (gpsData.eta !== undefined) trip.etaHours = gpsData.eta;

    // Update Shipment progress
    const ship = state.shipments.find((s) => s.shipmentId === trip.shipmentId);
    if (ship && gpsData.progressPct !== undefined) {
      ship.progressPercent = parseInt(gpsData.progressPct, 10);
      if (gpsData.location) ship.currentLocation = gpsData.location;
    }

    this.saveState(state);

    try {
      fetch(`${API_BASE}/trips/${tripId}/gps`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(gpsData)
      }).catch((e) => console.warn('Backend GPS update error:', e.message));
    } catch (_) {}

    return trip;
  }

  // ==========================================
  // STAGE 6: DRIVER SUBMITS PROOF OF DELIVERY (e-POD)
  // ==========================================
  async submitPod(tripId, { receiverName, signatureSvg, photoUrl, actor = 'Marcus Vance' }) {
    const state = this.getState();
    const trip = state.trips.find((t) => t.tripId === tripId);
    if (!trip) return null;

    trip.status = 'Completed';
    trip.podSignature = signatureSvg || 'data:image/svg+xml;base64,PHN2Zz48L3N2Zz4=';
    trip.podPhotoUrl = photoUrl || '/assets/pod-delivered.jpg';
    trip.deliveredAt = new Date().toISOString().replace('T', ' ').substring(0, 19);

    // Mark Shipment Delivered
    const ship = state.shipments.find((s) => s.shipmentId === trip.shipmentId);
    if (ship) {
      ship.status = 'Delivered';
      ship.progressPercent = 100;
    }

    // Mark Order Completed
    const order = state.orders.find((o) => o.orderId === trip.orderId);
    if (order) {
      order.orderStatus = 'Completed';
    }

    // Generate Invoice for Customer
    const invoiceId = 'INV-' + Math.floor(10000 + Math.random() * 90000);
    const subtotal = order && order.amount ? order.amount : 12500.0;
    const tax = Math.round(subtotal * 0.18 * 100) / 100;
    const total = subtotal + tax;

    const newInvoice = {
      id: Date.now(),
      invoiceId,
      orderId: trip.orderId,
      shipmentId: trip.shipmentId,
      customerId: order ? order.customerId : 'CUST-8021',
      customerName: order ? order.customerName : 'NexGen Industrial Corp',
      amount: subtotal,
      tax,
      total,
      status: 'Pending',
      paymentMethod: 'Pending Payment',
      createdAt: new Date().toISOString()
    };

    state.invoices = [newInvoice, ...state.invoices];

    // Notifications
    state.notifications = [
      {
        id: Date.now(),
        notificationId: 'NOTIF-' + Math.floor(1000 + Math.random() * 9000),
        recipientRole: 'ROLE_CUSTOMER',
        recipientId: newInvoice.customerId,
        title: 'Shipment Delivered & Invoice Generated',
        message: `Order ${trip.orderId} delivered to ${receiverName}. Invoice ${invoiceId} ($${total}) is ready for payment.`,
        type: 'success',
        linkPortal: 'customer',
        linkTab: 'invoices',
        isRead: false,
        createdAt: new Date().toISOString()
      },
      {
        id: Date.now() + 1,
        notificationId: 'NOTIF-' + Math.floor(1000 + Math.random() * 9000),
        recipientRole: 'ROLE_FINANCE_MANAGER',
        recipientId: 'ALL',
        title: 'New Freight Invoice Generated',
        message: `Invoice ${invoiceId} created for ${newInvoice.customerName} - Total: $${total}.`,
        type: 'info',
        linkPortal: 'billing',
        linkTab: 'invoices',
        isRead: false,
        createdAt: new Date().toISOString()
      },
      ...state.notifications
    ];

    state.auditLogs = [
      {
        id: Date.now(),
        logId: 'AUD-' + Math.floor(1000 + Math.random() * 9000),
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        actorRole: 'driver',
        actorUsername: actor,
        action: 'SUBMIT_POD_COMPLETE_TRIP',
        entityType: 'TRIP',
        entityId: tripId,
        details: `e-POD confirmed by ${receiverName}. Trip completed and invoice ${invoiceId} generated.`
      },
      ...state.auditLogs
    ];

    this.saveState(state);

    try {
      fetch(`${API_BASE}/trips/${tripId}/pod`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ receiverName, signatureSvg, photoUrl, actor })
      }).catch((e) => console.warn('Backend POD submit error:', e.message));
    } catch (_) {}

    return { trip, ship, order, invoice: newInvoice };
  }

  // ==========================================
  // STAGE 7: CUSTOMER PAYS INVOICE
  // ==========================================
  async payInvoice(invoiceId, method = 'RTGS / Corporate NetBanking', actor = 'Sarah Jenkins (Customer)') {
    const state = this.getState();
    const invoice = state.invoices.find((i) => i.invoiceId === invoiceId);
    if (!invoice) return null;

    invoice.status = 'Paid';
    invoice.paymentMethod = method;
    invoice.paidDate = new Date().toISOString().replace('T', ' ').substring(0, 19);

    const paymentId = 'PAY-' + Math.floor(10000 + Math.random() * 90000);
    const payment = {
      id: Date.now(),
      paymentId,
      invoiceId,
      orderId: invoice.orderId,
      customerId: invoice.customerId,
      amount: invoice.total,
      method,
      transactionRef: 'TXN-CORP-' + Math.random().toString(36).substring(2, 9).toUpperCase(),
      status: 'Completed',
      createdAt: new Date().toISOString()
    };

    state.payments = [payment, ...state.payments];

    // Notification for Finance Manager & Admin
    state.notifications = [
      {
        id: Date.now(),
        notificationId: 'NOTIF-' + Math.floor(1000 + Math.random() * 9000),
        recipientRole: 'ROLE_FINANCE_MANAGER',
        recipientId: 'ALL',
        title: 'Payment Received',
        message: `Invoice ${invoiceId} settled by ${invoice.customerName} ($${invoice.total}) via ${method}.`,
        type: 'success',
        linkPortal: 'billing',
        linkTab: 'payments',
        isRead: false,
        createdAt: new Date().toISOString()
      },
      {
        id: Date.now() + 1,
        notificationId: 'NOTIF-' + Math.floor(1000 + Math.random() * 9000),
        recipientRole: 'ROLE_ADMIN',
        recipientId: 'ALL',
        title: 'Corporate Cashflow Inflow',
        message: `$${invoice.total} credited from ${invoice.customerName} for order ${invoice.orderId}.`,
        type: 'success',
        linkPortal: 'admin',
        linkTab: 'dashboard',
        isRead: false,
        createdAt: new Date().toISOString()
      },
      ...state.notifications
    ];

    state.auditLogs = [
      {
        id: Date.now(),
        logId: 'AUD-' + Math.floor(1000 + Math.random() * 9000),
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        actorRole: 'customer',
        actorUsername: actor,
        action: 'SETTLE_INVOICE_PAYMENT',
        entityType: 'PAYMENT',
        entityId: paymentId,
        details: `Settled invoice ${invoiceId} ($${invoice.total}) via ${method}`
      },
      ...state.auditLogs
    ];

    this.saveState(state);

    try {
      fetch(`${API_BASE}/billing/pay`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ invoiceId, method, actor })
      }).catch((e) => console.warn('Backend pay error:', e.message));
    } catch (_) {}

    return { invoice, payment };
  }

  // ==========================================
  // STAGE 8: WAREHOUSE RECEIVE & DISPATCH
  // ==========================================
  async warehouseReceive(shipmentId, warehouseId = 'WH-CENTRAL-01', bayNumber = 'BAY-04', actor = 'Ethan Cole') {
    const state = this.getState();
    const ship = state.shipments.find((s) => s.shipmentId === shipmentId);
    if (ship) {
      ship.status = 'In Warehouse Cross-Dock';
    }

    const op = {
      id: Date.now(),
      operationId: 'WH-RCV-' + Math.floor(1000 + Math.random() * 9000),
      warehouseId,
      shipmentId,
      operationType: 'Receiving',
      bayNumber,
      status: 'Completed',
      createdAt: new Date().toISOString()
    };

    state.warehouseOperations = [op, ...state.warehouseOperations];

    state.auditLogs = [
      {
        id: Date.now(),
        logId: 'AUD-' + Math.floor(1000 + Math.random() * 9000),
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        actorRole: 'warehouse_manager',
        actorUsername: actor,
        action: 'WAREHOUSE_GOODS_RECEIVED',
        entityType: 'WAREHOUSE',
        entityId: op.operationId,
        details: `Goods received and staged at ${warehouseId} (${bayNumber}) for shipment ${shipmentId}`
      },
      ...state.auditLogs
    ];

    this.saveState(state);

    try {
      fetch(`${API_BASE}/warehouse/receive`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ shipmentId, warehouseId, bayNumber, actor })
      }).catch((e) => console.warn('Backend warehouse receive error:', e.message));
    } catch (_) {}

    return op;
  }

  async warehouseDispatch(shipmentId, warehouseId = 'WH-CENTRAL-01', bayNumber = 'BAY-07', actor = 'Ethan Cole') {
    const state = this.getState();
    const ship = state.shipments.find((s) => s.shipmentId === shipmentId);
    if (ship) {
      ship.status = 'Ready for Dispatch';
    }

    const op = {
      id: Date.now(),
      operationId: 'WH-DSP-' + Math.floor(1000 + Math.random() * 9000),
      warehouseId,
      shipmentId,
      operationType: 'Dispatch',
      bayNumber,
      status: 'Completed',
      createdAt: new Date().toISOString()
    };

    state.warehouseOperations = [op, ...state.warehouseOperations];

    state.notifications = [
      {
        id: Date.now(),
        notificationId: 'NOTIF-' + Math.floor(1000 + Math.random() * 9000),
        recipientRole: 'ROLE_DRIVER',
        recipientId: 'ALL',
        title: 'Shipment Ready for Dispatch',
        message: `Shipment ${shipmentId} loaded and cleared from ${bayNumber}.`,
        type: 'info',
        linkPortal: 'driver',
        linkTab: 'trips',
        isRead: false,
        createdAt: new Date().toISOString()
      },
      ...state.notifications
    ];

    state.auditLogs = [
      {
        id: Date.now(),
        logId: 'AUD-' + Math.floor(1000 + Math.random() * 9000),
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        actorRole: 'warehouse_manager',
        actorUsername: actor,
        action: 'WAREHOUSE_DISPATCH_CONFIRMED',
        entityType: 'WAREHOUSE',
        entityId: op.operationId,
        details: `Shipment ${shipmentId} dispatched from ${warehouseId} (${bayNumber})`
      },
      ...state.auditLogs
    ];

    this.saveState(state);

    try {
      fetch(`${API_BASE}/warehouse/dispatch`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ shipmentId, warehouseId, bayNumber, actor })
      }).catch((e) => console.warn('Backend warehouse dispatch error:', e.message));
    } catch (_) {}

    return op;
  }

  // ==========================================
  // RESET DEMO TO INITIAL UNIFIED STATE
  // ==========================================
  async resetDemo() {
    this.saveState(DEFAULT_STATE);
    try {
      await fetch(`${API_BASE}/reset-demo`, { method: 'POST' });
    } catch (e) {
      console.warn('Backend reset demo error:', e.message);
    }
    return DEFAULT_STATE;
  }
}

export const workflowService = new WorkflowService();
export default workflowService;
