// frontend/src/services/warehouseService.js
// Enterprise WMS Service for TTC Fleet360 - Warehouse Management System

const STORAGE_KEY = 'ttc_warehouse360_data_v1';

const INITIAL_WAREHOUSE_DATA = {
  warehouses: [
    {
      id: 'WH-CENTRAL-01',
      name: 'Chicago Central Logistics Hub',
      code: 'CHI-01',
      location: '4820 W 39th St, Chicago, IL 60632',
      manager: 'Ethan Cole',
      contactPhone: '+1 (312) 555-0192',
      totalCapacitySqFt: 150000,
      totalCapacityPallets: 12000,
      occupiedPallets: 9840,
      availablePallets: 2160,
      utilizationRate: 82,
      baysCount: 16,
      activeBays: 12,
      status: 'Optimal',
      type: 'Distribution Hub',
      operatingHours: '24/7 Continuous'
    },
    {
      id: 'WH-EAST-02',
      name: 'Cleveland Industrial Terminal',
      code: 'CLE-02',
      location: '1840 E 55th St, Cleveland, OH 44103',
      manager: 'Sarah Jenkins',
      contactPhone: '+1 (216) 555-0841',
      totalCapacitySqFt: 95000,
      totalCapacityPallets: 7500,
      occupiedPallets: 5100,
      availablePallets: 2400,
      utilizationRate: 68,
      baysCount: 10,
      activeBays: 7,
      status: 'Normal',
      type: 'Freight Cross-Dock',
      operatingHours: '05:00 - 23:00'
    },
    {
      id: 'WH-MIDWEST-03',
      name: 'Detroit Automotive Depot',
      code: 'DET-03',
      location: '12500 E 8 Mile Rd, Detroit, MI 48205',
      manager: 'Robert Kowalski',
      contactPhone: '+1 (313) 555-4472',
      totalCapacitySqFt: 120000,
      totalCapacityPallets: 9500,
      occupiedPallets: 8645,
      availablePallets: 855,
      utilizationRate: 91,
      baysCount: 14,
      activeBays: 13,
      status: 'Near Capacity',
      type: 'Automotive Parts Depot',
      operatingHours: '24/7 Continuous'
    },
    {
      id: 'WH-SOUTH-04',
      name: 'Indianapolis Freight Center',
      code: 'IND-04',
      location: '3800 S High School Rd, Indianapolis, IN 46241',
      manager: 'David Miller',
      contactPhone: '+1 (317) 555-8914',
      totalCapacitySqFt: 85000,
      totalCapacityPallets: 6800,
      occupiedPallets: 3672,
      availablePallets: 3128,
      utilizationRate: 54,
      baysCount: 8,
      activeBays: 5,
      status: 'Underutilized',
      type: 'Regional Staging',
      operatingHours: '06:00 - 22:00'
    },
    {
      id: 'WH-METRO-05',
      name: 'Milwaukee Fulfillment Warehouse',
      code: 'MKE-05',
      location: '7200 S 13th St, Milwaukee, WI 53221',
      manager: 'Elena Rostova',
      contactPhone: '+1 (414) 555-3211',
      totalCapacitySqFt: 110000,
      totalCapacityPallets: 8800,
      occupiedPallets: 6688,
      availablePallets: 2112,
      utilizationRate: 76,
      baysCount: 12,
      activeBays: 9,
      status: 'Normal',
      type: 'E-Commerce / Palletized',
      operatingHours: '06:00 - 00:00'
    },
    {
      id: 'WH-COLD-06',
      name: 'Toledo Temperature Controlled Facility',
      code: 'TOL-06',
      location: '2800 E Manhattan Blvd, Toledo, OH 43611',
      manager: 'Marcus Bradley',
      contactPhone: '+1 (419) 555-7720',
      totalCapacitySqFt: 60000,
      totalCapacityPallets: 4800,
      occupiedPallets: 4224,
      availablePallets: 576,
      utilizationRate: 88,
      baysCount: 6,
      activeBays: 6,
      status: 'Optimal',
      type: 'Cold Chain / Pharma',
      operatingHours: '24/7 Monitored'
    }
  ],

  inventory: [
    {
      sku: 'SKU-HYD-9021',
      name: 'Industrial Hydraulic Cylinder (6-Ton)',
      category: 'Industrial Machinery',
      warehouseId: 'WH-CENTRAL-01',
      zone: 'Zone A - Bay 04',
      quantityOnHand: 480,
      reserved: 120,
      available: 360,
      reorderPoint: 150,
      unitCost: 340.00,
      status: 'Available',
      supplier: 'Midwest Heavy Hydraulics',
      weightKg: 28.5,
      lastRestocked: '2026-11-18'
    },
    {
      sku: 'SKU-BRK-4410',
      name: 'Commercial Brake Rotor Assembly (Class 8)',
      category: 'Automotive Parts',
      warehouseId: 'WH-CENTRAL-01',
      zone: 'Zone B - Rack 12',
      quantityOnHand: 840,
      reserved: 240,
      available: 600,
      reorderPoint: 200,
      unitCost: 118.50,
      status: 'Available',
      supplier: 'Brembo Commercial NA',
      weightKg: 16.2,
      lastRestocked: '2026-11-19'
    },
    {
      sku: 'SKU-LITH-778',
      name: 'Lithium Iron Battery Module (48V 100Ah)',
      category: 'Electrical Components',
      warehouseId: 'WH-CENTRAL-01',
      zone: 'Zone E - HAZMAT Sec 02',
      quantityOnHand: 64,
      reserved: 48,
      available: 16,
      reorderPoint: 50,
      unitCost: 890.00,
      status: 'Low Stock',
      supplier: 'EnerTech Powertrain Corp',
      weightKg: 42.0,
      lastRestocked: '2026-11-10'
    },
    {
      sku: 'SKU-FLTR-102',
      name: 'Heavy Diesel Engine Air Intake Filter',
      category: 'Automotive Parts',
      warehouseId: 'WH-CENTRAL-01',
      zone: 'Zone B - Rack 05',
      quantityOnHand: 1420,
      reserved: 300,
      available: 1120,
      reorderPoint: 400,
      unitCost: 34.00,
      status: 'Available',
      supplier: 'Donaldson Filtration',
      weightKg: 3.4,
      lastRestocked: '2026-11-20'
    },
    {
      sku: 'SKU-DEF-550',
      name: 'Diesel Exhaust Fluid (DEF) Drum 208L',
      category: 'Chemicals & Lubricants',
      warehouseId: 'WH-CENTRAL-01',
      zone: 'Zone F - Liquid Bulk',
      quantityOnHand: 32,
      reserved: 32,
      available: 0,
      reorderPoint: 40,
      unitCost: 145.00,
      status: 'Out of Stock',
      supplier: 'BlueSky Fluids Inc',
      weightKg: 230.0,
      lastRestocked: '2026-11-05'
    },
    {
      sku: 'SKU-TRN-8820',
      name: 'Automatic 10-Speed Transmission Gearset',
      category: 'Automotive Parts',
      warehouseId: 'WH-MIDWEST-03',
      zone: 'Zone C - Heavy Bay 01',
      quantityOnHand: 92,
      reserved: 18,
      available: 74,
      reorderPoint: 25,
      unitCost: 2450.00,
      status: 'Available',
      supplier: 'Allison Transmission Corp',
      weightKg: 114.0,
      lastRestocked: '2026-11-17'
    },
    {
      sku: 'SKU-SENS-309',
      name: 'CAN-Bus ECU Telemetry Sensor Unit',
      category: 'Electrical Components',
      warehouseId: 'WH-CENTRAL-01',
      zone: 'Zone D - High Security',
      quantityOnHand: 310,
      reserved: 60,
      available: 250,
      reorderPoint: 80,
      unitCost: 215.00,
      status: 'Available',
      supplier: 'Bosch Mobility Solutions',
      weightKg: 0.8,
      lastRestocked: '2026-11-19'
    },
    {
      sku: 'SKU-WRAP-400',
      name: 'Industrial Pallet Stretch Film (80 Gauge)',
      category: 'Packaging Materials',
      warehouseId: 'WH-CENTRAL-01',
      zone: 'Zone A - Staging 01',
      quantityOnHand: 2400,
      reserved: 400,
      available: 2000,
      reorderPoint: 500,
      unitCost: 18.20,
      status: 'Available',
      supplier: 'Berry Global Pack',
      weightKg: 14.5,
      lastRestocked: '2026-11-15'
    },
    {
      sku: 'SKU-RAD-6612',
      name: 'Heavy Radiator Core Assembly (Aluminum)',
      category: 'Automotive Parts',
      warehouseId: 'WH-CENTRAL-01',
      zone: 'Zone B - Rack 18',
      quantityOnHand: 18,
      reserved: 12,
      available: 6,
      reorderPoint: 20,
      unitCost: 480.00,
      status: 'Low Stock',
      supplier: 'Spectra Premium NA',
      weightKg: 22.0,
      lastRestocked: '2026-11-08'
    },
    {
      sku: 'SKU-OIL-15W4',
      name: 'Synthetic Heavy Duty Diesel Oil 15W-40 (Pail 20L)',
      category: 'Chemicals & Lubricants',
      warehouseId: 'WH-CENTRAL-01',
      zone: 'Zone F - Racks 01-04',
      quantityOnHand: 520,
      reserved: 100,
      available: 420,
      reorderPoint: 120,
      unitCost: 68.00,
      status: 'Available',
      supplier: 'Shell Rotella T6',
      weightKg: 19.2,
      lastRestocked: '2026-11-19'
    }
  ],

  incomingGoods: [
    {
      id: 'INC-7081',
      shipmentId: 'SHP-IN-9821',
      supplier: 'Midwest Heavy Hydraulics',
      carrier: 'Freightliner Express (TTC-9912)',
      driverName: 'Carl Sanders',
      expectedDate: 'Today, 11:30 AM',
      itemsCount: 180,
      palletCount: 14,
      grossWeightKg: 4200,
      destinationBay: 'Dock Bay 04',
      status: 'Arrived at Gate',
      billOfLading: 'BOL-78912-MHH',
      temperatureControlled: false,
      inspectionStatus: 'Pending Inspection'
    },
    {
      id: 'INC-7082',
      shipmentId: 'SHP-IN-9822',
      supplier: 'Bosch Mobility Solutions',
      carrier: 'Apex Logistics (TRK-4401)',
      driverName: 'Lisa Monroe',
      expectedDate: 'Today, 01:15 PM',
      itemsCount: 650,
      palletCount: 8,
      grossWeightKg: 1100,
      destinationBay: 'Dock Bay 02',
      status: 'In Transit',
      billOfLading: 'BOL-88204-BOS',
      temperatureControlled: false,
      inspectionStatus: 'Awaiting Arrival'
    },
    {
      id: 'INC-7083',
      shipmentId: 'SHP-IN-9823',
      supplier: 'BlueSky Fluids Inc',
      carrier: 'LiquidBulk Haulers (TNK-102)',
      driverName: 'Hector Alvarez',
      expectedDate: 'Today, 03:00 PM',
      itemsCount: 48,
      palletCount: 24,
      grossWeightKg: 11200,
      destinationBay: 'Dock Bay 07 (Bulk)',
      status: 'Scheduled',
      billOfLading: 'BOL-90311-BSF',
      temperatureControlled: false,
      inspectionStatus: 'Awaiting Arrival'
    },
    {
      id: 'INC-7084',
      shipmentId: 'SHP-IN-9824',
      supplier: 'Donaldson Filtration',
      carrier: 'TTC Fleet (TTC-8492-HD)',
      driverName: 'Marcus Vance',
      expectedDate: 'Today, 04:30 PM',
      itemsCount: 320,
      palletCount: 12,
      grossWeightKg: 2800,
      destinationBay: 'Dock Bay 03',
      status: 'In Transit',
      billOfLading: 'BOL-91823-DON',
      temperatureControlled: false,
      inspectionStatus: 'Awaiting Arrival'
    },
    {
      id: 'INC-7079',
      shipmentId: 'SHP-IN-9818',
      supplier: 'Brembo Commercial NA',
      carrier: 'Interstate Freight (TRK-781)',
      driverName: 'Timothy Vance',
      expectedDate: 'Today, 08:00 AM',
      itemsCount: 400,
      palletCount: 16,
      grossWeightKg: 6480,
      destinationBay: 'Dock Bay 01',
      status: 'Received & Stored',
      billOfLading: 'BOL-74120-BREM',
      temperatureControlled: false,
      inspectionStatus: 'Passed (100% QA)'
    }
  ],

  outgoingGoods: [
    {
      id: 'OUT-5011',
      orderId: 'ORD-DISP-4101',
      destination: 'Detroit Automotive Depot (WH-MIDWEST-03)',
      carrier: 'TTC Fleet Logistics (TTC-8492-HD)',
      assignedDriver: 'Marcus Vance (D-01)',
      dispatchTime: 'Today, 02:00 PM',
      stagingBay: 'Staging Area A-3',
      dockBay: 'Dock Bay 08',
      palletCount: 18,
      weightKg: 14200,
      loadingStatus: 'Loading in Progress (70%)',
      dispatchStatus: 'Ready for Dispatch',
      sealNumber: 'SEAL-8921-TTC',
      priority: 'High'
    },
    {
      id: 'OUT-5012',
      orderId: 'ORD-DISP-4102',
      destination: 'Cleveland Industrial Terminal (WH-EAST-02)',
      carrier: 'TTC Fleet Logistics (TTC-3104-CD)',
      assignedDriver: 'James R. Kelly',
      dispatchTime: 'Today, 03:30 PM',
      stagingBay: 'Staging Area B-1',
      dockBay: 'Dock Bay 09',
      palletCount: 12,
      weightKg: 8900,
      loadingStatus: 'Staged at Bay',
      dispatchStatus: 'Pending Driver Check-in',
      sealNumber: 'SEAL-8922-TTC',
      priority: 'Standard'
    },
    {
      id: 'OUT-5013',
      orderId: 'ORD-DISP-4103',
      destination: 'Caterpillar Heavy Assembly Plant, Peoria IL',
      carrier: 'Penske Dedicated (TRK-901)',
      assignedDriver: 'Darren Price',
      dispatchTime: 'Today, 05:00 PM',
      stagingBay: 'Staging Area A-1',
      dockBay: 'Dock Bay 10',
      palletCount: 22,
      weightKg: 18400,
      loadingStatus: 'Palletizing & Wrapping',
      dispatchStatus: 'Staging',
      sealNumber: 'Pending',
      priority: 'Critical / Expedited'
    },
    {
      id: 'OUT-5014',
      orderId: 'ORD-DISP-4104',
      destination: 'Milwaukee Fulfillment Warehouse (WH-METRO-05)',
      carrier: 'TTC Regional Line (TTC-6612-LT)',
      assignedDriver: 'Frank Rodriguez',
      dispatchTime: 'Today, 06:15 PM',
      stagingBay: 'Staging Area C-2',
      dockBay: 'Dock Bay 11',
      palletCount: 10,
      weightKg: 5400,
      loadingStatus: 'Queued for Loading',
      dispatchStatus: 'Scheduled',
      sealNumber: 'Pending',
      priority: 'Standard'
    },
    {
      id: 'OUT-5009',
      orderId: 'ORD-DISP-4098',
      destination: 'Indianapolis Freight Center (WH-SOUTH-04)',
      carrier: 'TTC Freight (TTC-2281-ST)',
      assignedDriver: 'Kevin Lee',
      dispatchTime: 'Today, 09:30 AM',
      stagingBay: 'Staging Area B-4',
      dockBay: 'Dock Bay 06',
      palletCount: 16,
      weightKg: 11200,
      loadingStatus: 'Completed & Sealed',
      dispatchStatus: 'Dispatched (En Route)',
      sealNumber: 'SEAL-8919-TTC',
      priority: 'Standard'
    }
  ],

  loadingSchedule: [
    {
      bay: 'Dock Bay 01',
      type: 'Unloading',
      carrier: 'Interstate Freight (TRK-781)',
      shipment: 'SHP-IN-9818',
      scheduledTime: '08:00 - 09:15',
      actualTime: 'Completed at 09:05',
      status: 'Completed',
      operator: 'Bay Team Alpha (Lead: D. Miller)'
    },
    {
      bay: 'Dock Bay 04',
      type: 'Unloading',
      carrier: 'Freightliner Express (TTC-9912)',
      shipment: 'SHP-IN-9821',
      scheduledTime: '11:15 - 12:30',
      actualTime: 'In Progress (55%)',
      status: 'In Progress',
      operator: 'Forklift Op #3 (M. Taylor)'
    },
    {
      bay: 'Dock Bay 08',
      type: 'Loading',
      carrier: 'TTC Fleet (TTC-8492-HD)',
      shipment: 'ORD-DISP-4101',
      scheduledTime: '12:30 - 01:45',
      actualTime: 'In Progress (70%)',
      status: 'In Progress',
      operator: 'Loading Crew #1 (J. Smith)'
    },
    {
      bay: 'Dock Bay 09',
      type: 'Loading',
      carrier: 'TTC Fleet (TTC-3104-CD)',
      shipment: 'ORD-DISP-4102',
      scheduledTime: '14:00 - 15:15',
      actualTime: 'Staged at Apron',
      status: 'Scheduled',
      operator: 'Staging Crew #2'
    },
    {
      bay: 'Dock Bay 02',
      type: 'Unloading',
      carrier: 'Apex Logistics (TRK-4401)',
      shipment: 'SHP-IN-9822',
      scheduledTime: '13:15 - 14:30',
      actualTime: 'Awaiting Gate Arrival',
      status: 'Scheduled',
      operator: 'Bay Team Beta'
    },
    {
      bay: 'Dock Bay 10',
      type: 'Loading',
      carrier: 'Penske Dedicated (TRK-901)',
      shipment: 'ORD-DISP-4103',
      scheduledTime: '16:00 - 17:30',
      actualTime: 'Queue Scheduled',
      status: 'Scheduled',
      operator: 'Bay Team Gamma'
    }
  ],

  stockMovement: [
    {
      id: 'MOV-1092',
      timestamp: 'Today, 10:45 AM',
      type: 'Stock In',
      sku: 'SKU-BRK-4410',
      name: 'Commercial Brake Rotor Assembly',
      quantity: +400,
      fromLocation: 'Receiving Dock 01',
      toLocation: 'Zone B - Rack 12',
      operator: 'Ethan Cole (MGR)',
      reference: 'BOL-74120-BREM'
    },
    {
      id: 'MOV-1091',
      timestamp: 'Today, 10:15 AM',
      type: 'Stock Out',
      sku: 'SKU-HYD-9021',
      name: 'Industrial Hydraulic Cylinder (6-Ton)',
      quantity: -60,
      fromLocation: 'Zone A - Bay 04',
      toLocation: 'Staging Bay 08',
      operator: 'Operator J. Smith',
      reference: 'ORD-DISP-4101'
    },
    {
      id: 'MOV-1090',
      timestamp: 'Today, 09:30 AM',
      type: 'Transfer Out',
      sku: 'SKU-OIL-15W4',
      name: 'Synthetic Diesel Oil 15W-40',
      quantity: -80,
      fromLocation: 'Zone F - Racks 01-04',
      toLocation: 'WH-SOUTH-04 (Indianapolis)',
      operator: 'Operator K. Lee',
      reference: 'TRF-WH-0842'
    },
    {
      id: 'MOV-1089',
      timestamp: 'Today, 09:00 AM',
      type: 'Stock In',
      sku: 'SKU-FLTR-102',
      name: 'Heavy Diesel Engine Air Intake Filter',
      quantity: +200,
      fromLocation: 'Receiving Dock 02',
      toLocation: 'Zone B - Rack 05',
      operator: 'Operator M. Taylor',
      reference: 'BOL-73901-DON'
    },
    {
      id: 'MOV-1088',
      timestamp: 'Yesterday, 04:20 PM',
      type: 'Damaged Quarantine',
      sku: 'SKU-LITH-778',
      name: 'Lithium Iron Battery Module (48V)',
      quantity: -2,
      fromLocation: 'Zone E - HAZMAT Sec 02',
      toLocation: 'Quarantine Cage Q-01',
      operator: 'Safety Lead R. Vance',
      reference: 'DMG-2026-084'
    }
  ],

  stockTransfers: [
    {
      id: 'TRF-901',
      originWarehouse: 'Chicago Central Logistics Hub (WH-CENTRAL-01)',
      destWarehouse: 'Detroit Automotive Depot (WH-MIDWEST-03)',
      sku: 'SKU-HYD-9021',
      itemName: 'Industrial Hydraulic Cylinder (6-Ton)',
      quantity: 120,
      requestedBy: 'Robert Kowalski',
      dispatchedDate: '2026-11-20',
      status: 'In Transit',
      carrier: 'TTC Regional Trans (TTC-5521)',
      eta: 'Today, 03:00 PM'
    },
    {
      id: 'TRF-902',
      originWarehouse: 'Chicago Central Logistics Hub (WH-CENTRAL-01)',
      destWarehouse: 'Indianapolis Freight Center (WH-SOUTH-04)',
      sku: 'SKU-OIL-15W4',
      itemName: 'Synthetic Heavy Duty Diesel Oil 15W-40',
      quantity: 80,
      requestedBy: 'David Miller',
      dispatchedDate: '2026-11-21',
      status: 'In Transit',
      carrier: 'TTC Freight (TTC-2281-ST)',
      eta: 'Today, 01:30 PM'
    },
    {
      id: 'TRF-900',
      originWarehouse: 'Cleveland Industrial Terminal (WH-EAST-02)',
      destWarehouse: 'Chicago Central Logistics Hub (WH-CENTRAL-01)',
      sku: 'SKU-FLTR-102',
      itemName: 'Heavy Diesel Engine Air Intake Filter',
      quantity: 350,
      requestedBy: 'Ethan Cole',
      dispatchedDate: '2026-11-19',
      status: 'Completed',
      carrier: 'Apex Logistics (TRK-4401)',
      eta: 'Delivered'
    }
  ],

  damagedGoods: [
    {
      id: 'DMG-101',
      sku: 'SKU-LITH-778',
      name: 'Lithium Iron Battery Module (48V)',
      quantity: 2,
      warehouseId: 'WH-CENTRAL-01',
      location: 'Quarantine Cage Q-01',
      reason: 'Forklift tine puncture on outer protective casing during rack transfer.',
      reportedBy: 'Robert Vance (Safety Inspector)',
      reportedDate: '2026-11-20',
      action: 'Awaiting OEM Battery Disposal / Credit Authorization',
      status: 'In Quarantine',
      costImpact: 1780.00
    },
    {
      id: 'DMG-102',
      sku: 'SKU-RAD-6612',
      name: 'Heavy Radiator Core Assembly',
      quantity: 3,
      warehouseId: 'WH-CENTRAL-01',
      location: 'Quarantine Bay Q-03',
      reason: 'Crushed fin matrix observed upon opening pallet shrink wrap.',
      reportedBy: 'Michael Taylor (Dock Lead)',
      reportedDate: '2026-11-18',
      action: 'Supplier RMA #RMA-8812 Filed with Spectra Premium',
      status: 'Claim Pending',
      costImpact: 1440.00
    }
  ],

  alerts: [
    {
      id: 'ALT-WH-01',
      type: 'low-stock',
      severity: 'warning',
      title: 'Low Stock Alert: Lithium Battery Modules',
      message: 'Only 16 units available at WH-CENTRAL-01. Reorder threshold is 50 units.',
      time: '15m ago',
      read: false
    },
    {
      id: 'ALT-WH-02',
      type: 'out-of-stock',
      severity: 'critical',
      title: 'Out of Stock Alert: DEF Fluid Drums',
      message: 'Diesel Exhaust Fluid 208L is completely depleted. 32 units reserved for pending dispatches.',
      time: '45m ago',
      read: false
    },
    {
      id: 'ALT-WH-03',
      type: 'pending-receiving',
      severity: 'info',
      title: 'Incoming Shipment Arrived at Gate: SHP-IN-9821',
      message: 'Freightliner Express (TTC-9912) checked in at Gate 2. Ready for Dock Bay 04 unloading.',
      time: '1h ago',
      read: false
    },
    {
      id: 'ALT-WH-04',
      type: 'pending-dispatch',
      severity: 'warning',
      title: 'Dispatch Departure Scheduled: ORD-DISP-4101',
      message: 'Driver Marcus Vance (TTC-8492-HD) staging at Dock Bay 08. Target departure: 02:00 PM.',
      time: '2h ago',
      read: true
    },
    {
      id: 'ALT-WH-05',
      type: 'damaged-goods',
      severity: 'critical',
      title: 'Damaged Goods Quarantine Record Logged',
      message: '2 units of Lithium Battery Module placed in Hazmat Quarantine Cage Q-01.',
      time: '4h ago',
      read: true
    },
    {
      id: 'ALT-WH-06',
      type: 'capacity',
      severity: 'warning',
      title: 'Warehouse Utilization Alert: Detroit Depot (91%)',
      message: 'Detroit Automotive Depot (WH-MIDWEST-03) has exceeded 90% pallet capacity.',
      time: '5h ago',
      read: true
    }
  ]
};

class WarehouseService {
  constructor() {
    this.listeners = [];
    this.data = this.loadFromStorage();
  }

  loadFromStorage() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Could not read warehouse data from localStorage:', e);
    }
    return JSON.parse(JSON.stringify(INITIAL_WAREHOUSE_DATA));
  }

  saveToStorage() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
    } catch (e) {
      console.warn('Could not save warehouse data to localStorage:', e);
    }
    this.notify();
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notify() {
    this.listeners.forEach(l => l(this.data));
  }

  getData() {
    return this.data;
  }

  // --- Summary Metrics ---
  getSummaryMetrics() {
    const totalWarehouses = this.data.warehouses.length;
    const totalInventoryItems = this.data.inventory.length;
    const totalStockQuantity = this.data.inventory.reduce((sum, item) => sum + (item.quantityOnHand || 0), 0);
    const incomingShipments = this.data.incomingGoods.filter(s => s.status !== 'Received & Stored').length;
    const outgoingShipments = this.data.outgoingGoods.length;
    const pendingReceipts = this.data.incomingGoods.filter(s => s.status === 'Arrived at Gate' || s.status === 'In Transit').length;
    const pendingDispatches = this.data.outgoingGoods.filter(s => s.dispatchStatus !== 'Dispatched (En Route)').length;
    const lowStockItems = this.data.inventory.filter(i => i.status === 'Low Stock' || i.quantityOnHand <= i.reorderPoint).length;
    const damagedItems = this.data.damagedGoods.reduce((sum, d) => sum + (d.quantity || 0), 0);

    return {
      totalWarehouses,
      totalInventoryItems,
      totalStockQuantity,
      incomingShipments,
      outgoingShipments,
      pendingReceipts,
      pendingDispatches,
      lowStockItems,
      damagedItems
    };
  }

  // --- Inventory Actions ---
  addInventoryItem(item) {
    const newItem = {
      sku: item.sku || `SKU-${Date.now().toString().slice(-6)}`,
      name: item.name || 'New Inventory Item',
      category: item.category || 'Automotive Parts',
      warehouseId: item.warehouseId || 'WH-CENTRAL-01',
      zone: item.zone || 'Zone A - General',
      quantityOnHand: Number(item.quantityOnHand || 0),
      reserved: 0,
      available: Number(item.quantityOnHand || 0),
      reorderPoint: Number(item.reorderPoint || 50),
      unitCost: Number(item.unitCost || 45.00),
      status: Number(item.quantityOnHand || 0) <= Number(item.reorderPoint || 50) ? 'Low Stock' : 'Available',
      supplier: item.supplier || 'Standard Supplier',
      weightKg: Number(item.weightKg || 5.0),
      lastRestocked: new Date().toISOString().split('T')[0]
    };

    this.data.inventory.unshift(newItem);

    // Record Stock Movement
    this.addStockMovement({
      type: 'Stock In',
      sku: newItem.sku,
      name: newItem.name,
      quantity: newItem.quantityOnHand,
      fromLocation: 'Supplier Restock',
      toLocation: `${newItem.warehouseId} (${newItem.zone})`,
      operator: 'Ethan Cole (MGR)',
      reference: `INITIAL-${newItem.sku}`
    });

    this.saveToStorage();
    return newItem;
  }

  recordStockIn(stockInData) {
    const { sku, quantity, location, supplier, reference } = stockInData;
    const qty = Number(quantity || 0);

    const item = this.data.inventory.find(i => i.sku === sku);
    if (item) {
      item.quantityOnHand += qty;
      item.available += qty;
      item.lastRestocked = new Date().toISOString().split('T')[0];
      if (item.quantityOnHand > item.reorderPoint) {
        item.status = 'Available';
      }
    }

    this.addStockMovement({
      type: 'Stock In',
      sku,
      name: item ? item.name : 'Restocked Item',
      quantity: +qty,
      fromLocation: supplier || 'Receiving Dock',
      toLocation: location || (item ? item.zone : 'Zone A'),
      operator: 'Ethan Cole (MGR)',
      reference: reference || `STK-IN-${Date.now().toString().slice(-4)}`
    });

    this.saveToStorage();
  }

  recordStockOut(stockOutData) {
    const { sku, quantity, destination, reason, reference } = stockOutData;
    const qty = Number(quantity || 0);

    const item = this.data.inventory.find(i => i.sku === sku);
    if (item) {
      if (item.available < qty) {
        throw new Error(`Insufficient available stock for ${sku}. Available: ${item.available}, Requested: ${qty}`);
      }
      item.quantityOnHand -= qty;
      item.available -= qty;
      if (item.available === 0) {
        item.status = 'Out of Stock';
      } else if (item.available <= item.reorderPoint) {
        item.status = 'Low Stock';
      }
    }

    this.addStockMovement({
      type: 'Stock Out',
      sku,
      name: item ? item.name : 'Dispatched Item',
      quantity: -qty,
      fromLocation: item ? item.zone : 'Warehouse Zone',
      toLocation: destination || 'Outbound Loading Dock',
      operator: 'Ethan Cole (MGR)',
      reference: reference || `STK-OUT-${Date.now().toString().slice(-4)}`
    });

    this.saveToStorage();
  }

  // --- Receiving Actions ---
  confirmReceiving(shipmentId) {
    const shipment = this.data.incomingGoods.find(s => s.id === shipmentId || s.shipmentId === shipmentId);
    if (shipment) {
      shipment.status = 'Received & Stored';
      shipment.inspectionStatus = 'Passed (100% QA)';
      this.saveToStorage();
      return shipment;
    }
    return null;
  }

  // --- Dispatch Actions ---
  createDispatch(dispatchData) {
    const newDispatch = {
      id: `OUT-${Date.now().toString().slice(-4)}`,
      orderId: dispatchData.orderId || `ORD-DISP-${Date.now().toString().slice(-4)}`,
      destination: dispatchData.destination || 'Regional Terminal Hub',
      carrier: dispatchData.carrier || 'TTC Dedicated Freight',
      assignedDriver: dispatchData.assignedDriver || 'Assigned Driver',
      dispatchTime: dispatchData.dispatchTime || 'Today, Scheduled',
      stagingBay: dispatchData.stagingBay || 'Staging Bay A-1',
      dockBay: dispatchData.dockBay || 'Dock Bay 08',
      palletCount: Number(dispatchData.palletCount || 10),
      weightKg: Number(dispatchData.weightKg || 5000),
      loadingStatus: 'Staged at Bay',
      dispatchStatus: 'Ready for Dispatch',
      sealNumber: `SEAL-${Date.now().toString().slice(-4)}-TTC`,
      priority: dispatchData.priority || 'Standard'
    };

    this.data.outgoingGoods.unshift(newDispatch);
    this.saveToStorage();
    return newDispatch;
  }

  confirmDispatch(dispatchId) {
    const d = this.data.outgoingGoods.find(item => item.id === dispatchId || item.orderId === dispatchId);
    if (d) {
      d.loadingStatus = 'Completed & Sealed';
      d.dispatchStatus = 'Dispatched (En Route)';
      this.saveToStorage();
      return d;
    }
    return null;
  }

  // --- Stock Transfers ---
  transferStock(transferData) {
    const newTransfer = {
      id: `TRF-${Date.now().toString().slice(-4)}`,
      originWarehouse: transferData.originWarehouse || 'WH-CENTRAL-01',
      destWarehouse: transferData.destWarehouse || 'WH-MIDWEST-03',
      sku: transferData.sku,
      itemName: transferData.itemName || 'Transferred Item',
      quantity: Number(transferData.quantity || 10),
      requestedBy: 'Ethan Cole (WMS Lead)',
      dispatchedDate: new Date().toISOString().split('T')[0],
      status: 'In Transit',
      carrier: transferData.carrier || 'TTC Inter-Warehouse Express',
      eta: 'Next Day, 10:00 AM'
    };

    this.data.stockTransfers.unshift(newTransfer);

    // Record Movement
    this.addStockMovement({
      type: 'Transfer Out',
      sku: newTransfer.sku,
      name: newTransfer.itemName,
      quantity: -newTransfer.quantity,
      fromLocation: newTransfer.originWarehouse,
      toLocation: newTransfer.destWarehouse,
      operator: 'Ethan Cole (MGR)',
      reference: newTransfer.id
    });

    this.saveToStorage();
    return newTransfer;
  }

  // --- Damaged Goods Reporting ---
  reportDamagedGoods(damageData) {
    const newReport = {
      id: `DMG-${Date.now().toString().slice(-4)}`,
      sku: damageData.sku,
      name: damageData.name || 'Damaged Stock Item',
      quantity: Number(damageData.quantity || 1),
      warehouseId: damageData.warehouseId || 'WH-CENTRAL-01',
      location: damageData.location || 'Quarantine Cage Q-01',
      reason: damageData.reason || 'Handling Damage / Inspection Defect',
      reportedBy: 'Ethan Cole (Warehouse Director)',
      reportedDate: new Date().toISOString().split('T')[0],
      action: 'Placed in Hazmat Quarantine Cage',
      status: 'In Quarantine',
      costImpact: Number(damageData.costImpact || 450.00)
    };

    this.data.damagedGoods.unshift(newReport);

    // Deduct available from inventory
    const item = this.data.inventory.find(i => i.sku === damageData.sku);
    if (item) {
      item.available = Math.max(0, item.available - newReport.quantity);
    }

    // Add alert
    this.data.alerts.unshift({
      id: `ALT-DMG-${Date.now().toString().slice(-4)}`,
      type: 'damaged-goods',
      severity: 'critical',
      title: `Damaged Stock Quarantined: ${newReport.sku}`,
      message: `${newReport.quantity} units moved to ${newReport.location}. Reason: ${newReport.reason}`,
      time: 'Just now',
      read: false
    });

    this.saveToStorage();
    return newReport;
  }

  // --- Add Stock Movement ---
  addStockMovement(mov) {
    const newMovement = {
      id: `MOV-${Date.now().toString().slice(-4)}`,
      timestamp: 'Just now',
      type: mov.type || 'Stock Adjustment',
      sku: mov.sku,
      name: mov.name,
      quantity: mov.quantity,
      fromLocation: mov.fromLocation,
      toLocation: mov.toLocation,
      operator: mov.operator || 'Ethan Cole',
      reference: mov.reference || 'SYSTEM'
    };
    this.data.stockMovement.unshift(newMovement);
  }

  // --- Warehouses Management ---
  addWarehouse(whData) {
    const newWh = {
      id: `WH-${(whData.code || 'HUB').toUpperCase()}-${Date.now().toString().slice(-2)}`,
      name: whData.name || 'New Logistics Terminal',
      code: whData.code || 'NEW-01',
      location: whData.location || 'Regional Logistics Park',
      manager: whData.manager || 'Ethan Cole',
      contactPhone: whData.contactPhone || '+1 (800) 555-0100',
      totalCapacitySqFt: Number(whData.totalCapacitySqFt || 100000),
      totalCapacityPallets: Number(whData.totalCapacityPallets || 8000),
      occupiedPallets: 0,
      availablePallets: Number(whData.totalCapacityPallets || 8000),
      utilizationRate: 0,
      baysCount: Number(whData.baysCount || 10),
      activeBays: 0,
      status: 'Active',
      type: whData.type || 'Distribution Hub',
      operatingHours: whData.operatingHours || '24/7 Continuous'
    };
    this.data.warehouses.push(newWh);
    this.saveToStorage();
    return newWh;
  }

  markAlertRead(id) {
    const alert = this.data.alerts.find(a => a.id === id);
    if (alert) {
      alert.read = true;
      this.saveToStorage();
    }
  }

  markAllAlertsRead() {
    this.data.alerts.forEach(a => { a.read = true; });
    this.saveToStorage();
  }
}

export const warehouseService = new WarehouseService();
