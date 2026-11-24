// frontend/src/services/logisticsService.js
// Enterprise Transportation & Logistics Management Service for TTC Fleet360

import { workflowService } from './workflowService';

const STORAGE_KEY = 'ttc_logistics360_data_v1';

const INITIAL_LOGISTICS_DATA = {
  manager: {
    name: 'Elena Rostova',
    employeeId: 'LOG-DIR-094',
    email: 'elena.rostova@fleet360.ttc.com',
    phone: '+1 (312) 555-0819',
    role: 'ROLE_LOGISTICS_MANAGER',
    portal: 'logistics',
    designation: 'Director of Global Logistics & Transportation',
    department: 'Supply Chain & Freight Operations',
    location: 'Chicago Intermodal Logistics Command Center'
  },

  orders: [
    {
      id: 'ORD-9101',
      customerName: 'NexGen Industrial Corp',
      customerContact: '+1 (312) 555-8912',
      pickupLocation: 'Chicago Hub (CHI-01)',
      deliveryLocation: 'Detroit Automotive Depot (DET-03)',
      orderDate: '2026-11-20',
      expectedDelivery: '2026-11-23',
      priority: 'Urgent',
      amount: 14850,
      status: 'In Transit',
      itemsCount: 124,
      totalWeightKg: 4850,
      assignedTripId: 'TRIP-7011',
      assignedShipmentId: 'SHP-8201',
      type: 'Industrial Automation Machinery'
    },
    {
      id: 'ORD-9102',
      customerName: 'Apex Health Systems',
      customerContact: '+1 (216) 555-3921',
      pickupLocation: 'Cleveland Terminal (CLE-02)',
      deliveryLocation: 'Columbus Medical Facility',
      orderDate: '2026-11-21',
      expectedDelivery: '2026-11-24',
      priority: 'Urgent',
      amount: 22400,
      status: 'Approved',
      itemsCount: 65,
      totalWeightKg: 1200,
      assignedTripId: 'TRIP-7012',
      assignedShipmentId: 'SHP-8202',
      type: 'Cold-Chain Pharmaceuticals'
    },
    {
      id: 'ORD-9103',
      customerName: 'Midwest Prime Retailers',
      customerContact: '+1 (317) 555-4089',
      pickupLocation: 'Indianapolis Hub (IND-04)',
      deliveryLocation: 'Chicago Central Logistics (CHI-01)',
      orderDate: '2026-11-22',
      expectedDelivery: '2026-11-25',
      priority: 'Standard',
      amount: 8900,
      status: 'Processing',
      itemsCount: 380,
      totalWeightKg: 3400,
      assignedTripId: null,
      assignedShipmentId: 'SHP-8203',
      type: 'Consumer Goods & Electronics'
    },
    {
      id: 'ORD-9104',
      customerName: 'Precision Aero Parts Inc',
      customerContact: '+1 (513) 555-7788',
      pickupLocation: 'Cincinnati Aerospace Yard',
      deliveryLocation: 'Cleveland Terminal (CLE-02)',
      orderDate: '2026-11-22',
      expectedDelivery: '2026-11-26',
      priority: 'High',
      amount: 31500,
      status: 'Pending',
      itemsCount: 42,
      totalWeightKg: 2800,
      assignedTripId: null,
      assignedShipmentId: null,
      type: 'Turbine Components'
    },
    {
      id: 'ORD-9105',
      customerName: 'Great Lakes Agri Supplies',
      customerContact: '+1 (414) 555-9014',
      pickupLocation: 'Milwaukee Harbor Terminal',
      deliveryLocation: 'Rockford Regional Cross-Dock',
      orderDate: '2026-11-19',
      expectedDelivery: '2026-11-21',
      priority: 'Standard',
      amount: 11200,
      status: 'Delivered',
      itemsCount: 520,
      totalWeightKg: 8500,
      assignedTripId: 'TRIP-7009',
      assignedShipmentId: 'SHP-8199',
      type: 'Agricultural Chemicals & Feeds'
    },
    {
      id: 'ORD-9106',
      customerName: 'Vanguard Solar Technologies',
      customerContact: '+1 (614) 555-3211',
      pickupLocation: 'Toledo Distribution Hub',
      deliveryLocation: 'Columbus East Array Hub',
      orderDate: '2026-11-23',
      expectedDelivery: '2026-11-27',
      priority: 'High',
      amount: 18750,
      status: 'Pending',
      itemsCount: 94,
      totalWeightKg: 4200,
      assignedTripId: null,
      assignedShipmentId: null,
      type: 'Solar Photovoltaic Inverters'
    },
    {
      id: 'ORD-9107',
      customerName: 'Titan Heavy Metals',
      customerContact: '+1 (219) 555-6672',
      pickupLocation: 'Gary Steel Terminal',
      deliveryLocation: 'Detroit Assembly Plant 4',
      orderDate: '2026-11-18',
      expectedDelivery: '2026-11-20',
      priority: 'Standard',
      amount: 27900,
      status: 'Cancelled',
      itemsCount: 18,
      totalWeightKg: 14200,
      assignedTripId: null,
      assignedShipmentId: null,
      type: 'Structural Alloy Beams'
    }
  ],

  shipments: [
    {
      id: 'SHP-8201',
      orderId: 'ORD-9101',
      customerName: 'NexGen Industrial Corp',
      origin: 'Chicago Hub (CHI-01)',
      destination: 'Detroit Automotive Depot (DET-03)',
      dispatchDate: '2026-11-21 06:30',
      expectedDelivery: '2026-11-23 15:00',
      status: 'In Transit',
      assignedVehicleReg: 'TTC-8492-HD',
      assignedDriver: 'Marcus Vance',
      progressPercent: 68,
      currentLocation: 'I-94 East near Kalamazoo, MI',
      estimatedDistanceKm: 452
    },
    {
      id: 'SHP-8202',
      orderId: 'ORD-9102',
      customerName: 'Apex Health Systems',
      origin: 'Cleveland Terminal (CLE-02)',
      destination: 'Columbus Medical Facility',
      dispatchDate: '2026-11-22 08:00',
      expectedDelivery: '2026-11-24 12:00',
      status: 'Processing',
      assignedVehicleReg: 'TTC-7741-RF',
      assignedDriver: 'Sarah Jenkins',
      progressPercent: 20,
      currentLocation: 'Loading Bay 4, Cleveland',
      estimatedDistanceKm: 230
    },
    {
      id: 'SHP-8203',
      orderId: 'ORD-9103',
      customerName: 'Midwest Prime Retailers',
      origin: 'Indianapolis Hub (IND-04)',
      destination: 'Chicago Central Logistics (CHI-01)',
      dispatchDate: '2026-11-23 09:15',
      expectedDelivery: '2026-11-25 18:00',
      status: 'Ready for Dispatch',
      assignedVehicleReg: 'TTC-5120-EV',
      assignedDriver: 'Rajesh Sharma',
      progressPercent: 5,
      currentLocation: 'Staging Area A, Indianapolis',
      estimatedDistanceKm: 295
    },
    {
      id: 'SHP-8199',
      orderId: 'ORD-9105',
      customerName: 'Great Lakes Agri Supplies',
      origin: 'Milwaukee Harbor Terminal',
      destination: 'Rockford Regional Cross-Dock',
      dispatchDate: '2026-11-20 07:00',
      expectedDelivery: '2026-11-21 16:30',
      status: 'Delivered',
      assignedVehicleReg: 'TTC-9034-HD',
      assignedDriver: 'David Miller',
      progressPercent: 100,
      currentLocation: 'Delivered - Dock 2, Rockford',
      estimatedDistanceKm: 148
    },
    {
      id: 'SHP-8198',
      orderId: 'ORD-9098',
      customerName: 'Stellar Precision Tools',
      origin: 'Chicago Hub (CHI-01)',
      destination: 'Grand Rapids Freight Depot',
      dispatchDate: '2026-11-20 14:00',
      expectedDelivery: '2026-11-22 10:00',
      status: 'Delayed',
      assignedVehicleReg: 'TTC-4190-CV',
      assignedDriver: 'Carlos Mendez',
      progressPercent: 55,
      currentLocation: 'Traffic Congestion I-196',
      estimatedDistanceKm: 285
    }
  ],

  trips: [
    {
      id: 'TRIP-7011',
      orderId: 'ORD-9101',
      shipmentId: 'SHP-8201',
      vehicleReg: 'TTC-8492-HD',
      driverName: 'Marcus Vance',
      driverPhone: '+1 (312) 555-0144',
      startLocation: 'Chicago Hub (CHI-01)',
      destination: 'Detroit Automotive Depot (DET-03)',
      departureTime: '2026-11-21 06:30',
      expectedArrival: '2026-11-23 15:00',
      totalDistanceKm: 452,
      status: 'Active',
      routeCode: 'RT-CHI-DET-01',
      fuelConsumedLiters: 142,
      currentSpeedKmh: 88,
      etaHours: '2h 15m'
    },
    {
      id: 'TRIP-7012',
      orderId: 'ORD-9102',
      shipmentId: 'SHP-8202',
      vehicleReg: 'TTC-7741-RF',
      driverName: 'Sarah Jenkins',
      driverPhone: '+1 (216) 555-8902',
      startLocation: 'Cleveland Terminal (CLE-02)',
      destination: 'Columbus Medical Facility',
      departureTime: '2026-11-22 08:00',
      expectedArrival: '2026-11-24 12:00',
      totalDistanceKm: 230,
      status: 'Scheduled',
      routeCode: 'RT-CLE-COL-02',
      fuelConsumedLiters: 48,
      currentSpeedKmh: 0,
      etaHours: '3h 30m'
    },
    {
      id: 'TRIP-7009',
      orderId: 'ORD-9105',
      shipmentId: 'SHP-8199',
      vehicleReg: 'TTC-9034-HD',
      driverName: 'David Miller',
      driverPhone: '+1 (414) 555-7312',
      startLocation: 'Milwaukee Harbor Terminal',
      destination: 'Rockford Regional Cross-Dock',
      departureTime: '2026-11-20 07:00',
      expectedArrival: '2026-11-21 16:30',
      totalDistanceKm: 148,
      status: 'Completed',
      routeCode: 'RT-MKE-RFD-03',
      fuelConsumedLiters: 52,
      currentSpeedKmh: 0,
      etaHours: 'Delivered'
    },
    {
      id: 'TRIP-7010',
      orderId: 'ORD-9098',
      shipmentId: 'SHP-8198',
      vehicleReg: 'TTC-4190-CV',
      driverName: 'Carlos Mendez',
      driverPhone: '+1 (312) 555-6490',
      startLocation: 'Chicago Hub (CHI-01)',
      destination: 'Grand Rapids Freight Depot',
      departureTime: '2026-11-20 14:00',
      expectedArrival: '2026-11-22 10:00',
      totalDistanceKm: 285,
      status: 'Delayed',
      routeCode: 'RT-CHI-GRR-01',
      fuelConsumedLiters: 92,
      currentSpeedKmh: 42,
      etaHours: '4h 10m'
    }
  ],

  vehicles: [
    {
      regNumber: 'TTC-8492-HD',
      type: 'Heavy Duty Prime Mover',
      capacityKg: 24000,
      currentLoadKg: 18500,
      status: 'In Transit',
      assignedDriver: 'Marcus Vance',
      currentLocation: 'I-94 East Mile 82',
      fuelLevelPercent: 78,
      mileageKm: 142580,
      maintenanceDueDays: 45
    },
    {
      regNumber: 'TTC-7741-RF',
      type: 'Refrigerated Cold-Chain Hauler',
      capacityKg: 18000,
      currentLoadKg: 4200,
      status: 'Assigned',
      assignedDriver: 'Sarah Jenkins',
      currentLocation: 'Cleveland Hub Staging',
      fuelLevelPercent: 92,
      mileageKm: 98400,
      maintenanceDueDays: 18
    },
    {
      regNumber: 'TTC-5120-EV',
      type: 'Electric Commercial Cargo Van',
      capacityKg: 6500,
      currentLoadKg: 0,
      status: 'Available',
      assignedDriver: null,
      currentLocation: 'Indianapolis Charging Station',
      fuelLevelPercent: 100,
      mileageKm: 34100,
      maintenanceDueDays: 90
    },
    {
      regNumber: 'TTC-9034-HD',
      type: 'Heavy Duty Prime Mover',
      capacityKg: 26000,
      currentLoadKg: 0,
      status: 'Available',
      assignedDriver: null,
      currentLocation: 'Rockford Freight Yard',
      fuelLevelPercent: 84,
      mileageKm: 189200,
      maintenanceDueDays: 12
    },
    {
      regNumber: 'TTC-4190-CV',
      type: 'Medium Freight Cargo Van',
      capacityKg: 8500,
      currentLoadKg: 6800,
      status: 'In Transit',
      assignedDriver: 'Carlos Mendez',
      currentLocation: 'I-196 Corridor',
      fuelLevelPercent: 54,
      mileageKm: 112400,
      maintenanceDueDays: 30
    },
    {
      regNumber: 'TTC-6628-HD',
      type: 'Heavy Duty Triple-Axle',
      capacityKg: 28000,
      currentLoadKg: 0,
      status: 'Available',
      assignedDriver: null,
      currentLocation: 'Chicago Central Logistics Yard',
      fuelLevelPercent: 95,
      mileageKm: 62000,
      maintenanceDueDays: 60
    }
  ],

  drivers: [
    {
      id: 'DRV-101',
      name: 'Marcus Vance',
      licenseNumber: 'CDL-IL-948201',
      licenseClass: 'Class A (Hazmat & Tanker)',
      phone: '+1 (312) 555-0144',
      status: 'Assigned',
      currentVehicle: 'TTC-8492-HD',
      rating: 4.95,
      completedTrips: 342,
      onTimeDeliveryRate: 99.2,
      currentLocation: 'In Transit (I-94 East)'
    },
    {
      id: 'DRV-102',
      name: 'Sarah Jenkins',
      licenseNumber: 'CDL-OH-552194',
      licenseClass: 'Class A (Refrigerated Endorsed)',
      phone: '+1 (216) 555-8902',
      status: 'Assigned',
      currentVehicle: 'TTC-7741-RF',
      rating: 4.91,
      completedTrips: 280,
      onTimeDeliveryRate: 98.7,
      currentLocation: 'Cleveland Logistics Hub'
    },
    {
      id: 'DRV-103',
      name: 'Rajesh Sharma',
      licenseNumber: 'CDL-IN-441209',
      licenseClass: 'Class A (Double/Triple Trailers)',
      phone: '+1 (317) 555-8812',
      status: 'Available',
      currentVehicle: null,
      rating: 4.88,
      completedTrips: 215,
      onTimeDeliveryRate: 97.9,
      currentLocation: 'Indianapolis Terminal'
    },
    {
      id: 'DRV-104',
      name: 'David Miller',
      licenseNumber: 'CDL-WI-883102',
      licenseClass: 'Class A',
      phone: '+1 (414) 555-7312',
      status: 'Available',
      currentVehicle: null,
      rating: 4.94,
      completedTrips: 310,
      onTimeDeliveryRate: 99.4,
      currentLocation: 'Rockford Terminal'
    },
    {
      id: 'DRV-105',
      name: 'Carlos Mendez',
      licenseNumber: 'CDL-MI-772108',
      licenseClass: 'Class B',
      phone: '+1 (312) 555-6490',
      status: 'Assigned',
      currentVehicle: 'TTC-4190-CV',
      rating: 4.79,
      completedTrips: 185,
      onTimeDeliveryRate: 95.8,
      currentLocation: 'I-196 En Route'
    },
    {
      id: 'DRV-106',
      name: 'Aisha Al-Mansoor',
      licenseNumber: 'CDL-IL-339482',
      licenseClass: 'Class A (Hazmat & Tanker)',
      phone: '+1 (312) 555-9120',
      status: 'Available',
      currentVehicle: null,
      rating: 4.97,
      completedTrips: 260,
      onTimeDeliveryRate: 99.8,
      currentLocation: 'Chicago Central Logistics Yard'
    }
  ],

  routes: [
    {
      id: 'RT-CHI-DET-01',
      name: 'I-94 Expressway Express',
      origin: 'Chicago Central Hub (CHI-01)',
      destination: 'Detroit Automotive Depot (DET-03)',
      distanceKm: 452,
      estDurationHours: '4h 45m',
      highway: 'I-94 E',
      tollCost: 18.5,
      estimatedFuelLiters: 145,
      status: 'Optimal',
      trafficCondition: 'Moderate Near Kalamazoo',
      alternativeRoutes: [
        { name: 'I-80 / I-69 Bypass', distanceKm: 480, duration: '5h 15m', tolls: 24.0 },
        { name: 'US-12 Scenic Route', distanceKm: 438, duration: '6h 10m', tolls: 0.0 }
      ],
      optimizationSuggestion: 'Maintain cruise speed at 85 km/h to save ~12L diesel on the Kalamazoo gradient.'
    },
    {
      id: 'RT-CLE-COL-02',
      name: 'I-71 Southbound Direct',
      origin: 'Cleveland Industrial Terminal (CLE-02)',
      destination: 'Columbus Medical Facility',
      distanceKm: 230,
      estDurationHours: '2h 20m',
      highway: 'I-71 S',
      tollCost: 0,
      estimatedFuelLiters: 74,
      status: 'Optimal',
      trafficCondition: 'Clear & Flowing',
      alternativeRoutes: [
        { name: 'US-42 South Corridor', distanceKm: 245, duration: '3h 05m', tolls: 0.0 }
      ],
      optimizationSuggestion: 'Departure between 09:30 and 11:30 avoids Cleveland morning rush and cuts transit by 18 mins.'
    },
    {
      id: 'RT-IND-CHI-04',
      name: 'I-65 Northbound Freight Corridor',
      origin: 'Indianapolis Hub (IND-04)',
      destination: 'Chicago Central Logistics (CHI-01)',
      distanceKm: 295,
      estDurationHours: '3h 10m',
      highway: 'I-65 N to I-90 W',
      tollCost: 9.8,
      estimatedFuelLiters: 96,
      status: 'Caution',
      trafficCondition: 'Roadworks near Gary, IN',
      alternativeRoutes: [
        { name: 'US-41 North', distanceKm: 312, duration: '4h 00m', tolls: 0.0 }
      ],
      optimizationSuggestion: 'Shift to I-80 W bypass at Crown Point to avoid construction delays at Gary.'
    }
  ],

  pickups: [
    {
      id: 'PK-401',
      orderId: 'ORD-9101',
      customerName: 'NexGen Industrial Corp',
      address: '4820 W 39th St, Chicago, IL 60632',
      scheduledDate: '2026-11-21 06:00',
      assignedDriver: 'Marcus Vance',
      status: 'Completed',
      itemsCount: 124,
      notes: 'All machinery pallets strapped and certified by warehouse inspector.'
    },
    {
      id: 'PK-402',
      orderId: 'ORD-9102',
      customerName: 'Apex Health Systems',
      address: '1840 E 55th St, Cleveland, OH 44103',
      scheduledDate: '2026-11-22 07:30',
      assignedDriver: 'Sarah Jenkins',
      status: 'Completed',
      itemsCount: 65,
      notes: 'Cryo-containers loaded under continuous temperature telemetry (-20°C).'
    },
    {
      id: 'PK-403',
      orderId: 'ORD-9103',
      customerName: 'Midwest Prime Retailers',
      address: '4200 S Meridian St, Indianapolis, IN 46217',
      scheduledDate: '2026-11-23 09:00',
      assignedDriver: 'Rajesh Sharma',
      status: 'Scheduled',
      itemsCount: 380,
      notes: 'Dock 3 scheduled for automated barcode scan verification.'
    },
    {
      id: 'PK-404',
      orderId: 'ORD-9104',
      customerName: 'Precision Aero Parts Inc',
      address: '8800 Aerospace Blvd, Cincinnati, OH 45241',
      scheduledDate: '2026-11-24 10:00',
      assignedDriver: 'Unassigned',
      status: 'Pending',
      itemsCount: 42,
      notes: 'Heavy lift crane required during loading.'
    }
  ],

  deliveries: [
    {
      id: 'DEL-501',
      orderId: 'ORD-9105',
      customerName: 'Great Lakes Agri Supplies',
      address: '3200 Kishwaukee St, Rockford, IL 61109',
      assignedDriver: 'David Miller',
      expectedDate: '2026-11-21 16:30',
      status: 'Delivered',
      proofOfDelivery: {
        receivedBy: 'Arthur Vance (Facility Superintendent)',
        signatureTimestamp: '2026-11-21 16:24:18',
        signatureUrl: '/assets/signatures/sample-sig-1.png',
        notes: 'Delivered in mint condition, seal #TTC-9941 intact.'
      }
    },
    {
      id: 'DEL-502',
      orderId: 'ORD-9101',
      customerName: 'NexGen Industrial Corp',
      address: '12500 E 8 Mile Rd, Detroit, MI 48205',
      assignedDriver: 'Marcus Vance',
      expectedDate: '2026-11-23 15:00',
      status: 'Pending',
      proofOfDelivery: null
    },
    {
      id: 'DEL-503',
      orderId: 'ORD-9102',
      customerName: 'Apex Health Systems',
      address: '700 Childrens Dr, Columbus, OH 43205',
      assignedDriver: 'Sarah Jenkins',
      expectedDate: '2026-11-24 12:00',
      status: 'Pending',
      proofOfDelivery: null
    },
    {
      id: 'DEL-504',
      orderId: 'ORD-9098',
      customerName: 'Stellar Precision Tools',
      address: '550 44th St SW, Grand Rapids, MI 49548',
      assignedDriver: 'Carlos Mendez',
      expectedDate: '2026-11-22 10:00',
      status: 'Failed',
      proofOfDelivery: {
        receivedBy: 'Attempted Delivery - Facility Closed',
        signatureTimestamp: '2026-11-22 10:14:00',
        signatureUrl: null,
        notes: 'Warehouse gates locked. Rescheduling delivery for next business day.'
      }
    }
  ],

  customerRequests: [
    {
      id: 'CR-301',
      customerName: 'NexGen Industrial Corp',
      contactEmail: 'logistics@nexgen-ind.com',
      serviceType: 'Dedicated Full Truckload (FTL)',
      origin: 'Chicago, IL',
      destination: 'Toronto, ON (Cross-Border)',
      requestedDate: '2026-11-28',
      estimatedWeightKg: 16500,
      status: 'Under Review',
      quoteAmount: 6400
    },
    {
      id: 'CR-302',
      customerName: 'Horizon BioPharma',
      contactEmail: 'supply@horizonbiopharma.org',
      serviceType: 'Refrigerated Cold-Chain (-80°C Dry Ice)',
      origin: 'Cleveland, OH',
      destination: 'Chicago Medical District',
      requestedDate: '2026-11-29',
      estimatedWeightKg: 850,
      status: 'Quote Sent',
      quoteAmount: 4200
    },
    {
      id: 'CR-303',
      customerName: 'Prairie Agricultural Mills',
      contactEmail: 'freight@prairiemills.com',
      serviceType: 'Bulk Grain Hopper',
      origin: 'Des Moines, IA',
      destination: 'Milwaukee Port',
      requestedDate: '2026-11-30',
      estimatedWeightKg: 28000,
      status: 'Approved',
      quoteAmount: 3850
    }
  ],

  activities: [
    {
      id: 'ACT-101',
      type: 'order_approved',
      title: 'Order ORD-9102 Approved',
      description: 'Elena Rostova approved cold-chain transport for Apex Health Systems ($22,400).',
      time: '12 mins ago',
      timestamp: '2026-11-23 10:12',
      status: 'success'
    },
    {
      id: 'ACT-102',
      type: 'trip_dispatched',
      title: 'Trip TRIP-7011 Cruising On Schedule',
      description: 'Marcus Vance reported mile 82 on I-94 East with 88 km/h telemetry sync.',
      time: '28 mins ago',
      timestamp: '2026-11-23 09:56',
      status: 'info'
    },
    {
      id: 'ACT-103',
      type: 'driver_assigned',
      title: 'Driver Sarah Jenkins Assigned to SHP-8202',
      description: 'Refrigerated hauler TTC-7741-RF dispatched to Cleveland Loading Bay 4.',
      time: '1 hour ago',
      timestamp: '2026-11-23 09:24',
      status: 'info'
    },
    {
      id: 'ACT-104',
      type: 'delivery_confirmed',
      title: 'Proof of Delivery Filed for DEL-501',
      description: 'Arthur Vance signed for 520 agri-supply units at Rockford Terminal.',
      time: '3 hours ago',
      timestamp: '2026-11-23 07:45',
      status: 'success'
    },
    {
      id: 'ACT-105',
      type: 'delay_warning',
      title: 'Route Disruption Reported on I-196',
      description: 'Carlos Mendez experienced 45-min bottleneck on route RT-CHI-GRR-01.',
      time: '4 hours ago',
      timestamp: '2026-11-23 06:18',
      status: 'warning'
    }
  ],

  alerts: [
    {
      id: 'ALT-201',
      severity: 'warning',
      title: 'Unassigned Order ORD-9104 Requires Transportation',
      message: 'Precision Aero Parts (42 units, 2,800 kg) awaiting truck and driver assignment.',
      linkTab: 'vehicle-assignment',
      time: '20 mins ago'
    },
    {
      id: 'ALT-202',
      severity: 'warning',
      title: 'Delayed Shipment Alert: SHP-8198 (Stellar Tools)',
      message: 'Transit delay of 50 minutes reported on I-196 due to heavy highway resurfacing.',
      linkTab: 'shipment-management',
      time: '45 mins ago'
    },
    {
      id: 'ALT-203',
      severity: 'critical',
      title: 'Heavy Lift Crane Required at Cincinnati Yard',
      message: 'Pickup PK-404 requires confirmation of 15-ton mobile crane on site before vehicle arrives.',
      linkTab: 'pickup-management',
      time: '1 hour ago'
    },
    {
      id: 'ALT-204',
      severity: 'info',
      title: 'Electric Hauler TTC-5120-EV 100% Charged',
      message: 'Battery at full capacity at Indianapolis Hub. Ready for assignment.',
      linkTab: 'vehicle-assignment',
      time: '2 hours ago'
    }
  ],

  notifications: [
    {
      id: 'NOTIF-1',
      title: 'New Customer Request from NexGen Industrial',
      message: 'Requested dedicated FTL cross-border quote for 16,500 kg machinery to Toronto.',
      time: '15 mins ago',
      read: false,
      type: 'order'
    },
    {
      id: 'NOTIF-2',
      title: 'Shipment SHP-8201 Crossed Indiana State Line',
      message: 'Marcus Vance entered Michigan corridor. Estimated arrival Detroit: 14:45.',
      time: '35 mins ago',
      read: false,
      type: 'trip'
    },
    {
      id: 'NOTIF-3',
      title: 'Driver Aisha Al-Mansoor Returned to Available Pool',
      message: 'Driver rest period completed. Ready for high-priority dispatch assignment.',
      time: '1 hour ago',
      read: false,
      type: 'driver'
    },
    {
      id: 'NOTIF-4',
      title: 'Proof of Delivery Filed for DEL-501',
      message: 'Delivery confirmed with electronic signature and zero reported damage.',
      time: '3 hours ago',
      read: true,
      type: 'delivery'
    }
  ],

  analytics: {
    dailyOrderTrends: [
      { label: 'Mon', value: 24, amount: 84200 },
      { label: 'Tue', value: 31, amount: 112400 },
      { label: 'Wed', value: 28, amount: 96800 },
      { label: 'Thu', value: 38, amount: 142100 },
      { label: 'Fri', value: 42, amount: 168900 },
      { label: 'Sat', value: 22, amount: 78500 },
      { label: 'Sun', value: 16, amount: 54100 }
    ],
    monthlyShipmentTrends: [
      { label: 'Jul', value: 410, onTime: 395 },
      { label: 'Aug', value: 450, onTime: 438 },
      { label: 'Sep', value: 490, onTime: 476 },
      { label: 'Oct', value: 520, onTime: 508 },
      { label: 'Nov', value: 580, onTime: 571 },
      { label: 'Dec', value: 610, onTime: 601 }
    ],
    deliverySuccessRate: 98.4,
    onTimeDeliveryPercent: 96.2,
    tripCompletionRate: 99.1,
    orderStatusDistribution: [
      { label: 'In Transit', value: 28, color: '#3478F6' },
      { label: 'Approved', value: 34, color: '#16A36A' },
      { label: 'Processing', value: 18, color: '#FF7A1A' },
      { label: 'Pending', value: 14, color: '#F59E0B' },
      { label: 'Delivered', value: 48, color: '#10B981' },
      { label: 'Cancelled', value: 4, color: '#EF4444' }
    ],
    transportationPerformance: [
      { label: 'Chicago Central', value: 98.8, trips: 142 },
      { label: 'Cleveland East', value: 97.4, trips: 98 },
      { label: 'Detroit Automotive', value: 96.9, trips: 112 },
      { label: 'Indianapolis Hub', value: 98.1, trips: 86 },
      { label: 'Milwaukee Harbor', value: 99.2, trips: 64 }
    ]
  }
};

class LogisticsService {
  constructor() {
    this.subscribers = [];
    this.data = this.loadData();
  }

  loadData() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Could not read logistics data from localStorage:', e);
    }
    this.saveData(INITIAL_LOGISTICS_DATA);
    return INITIAL_LOGISTICS_DATA;
  }

  saveData(data) {
    this.data = data;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.warn('Could not save logistics data to localStorage:', e);
    }
    this.notifySubscribers();
  }

  getData() {
    return this.data;
  }

  subscribe(callback) {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter(sub => sub !== callback);
    };
  }

  notifySubscribers() {
    this.subscribers.forEach(cb => {
      try {
        cb(this.data);
      } catch (err) {
        console.error('Error notifying logistics subscriber:', err);
      }
    });
  }

  // Summary Metrics
  getSummaryMetrics() {
    const orders = this.data.orders || [];
    const shipments = this.data.shipments || [];
    const trips = this.data.trips || [];
    const deliveries = this.data.deliveries || [];
    const pickups = this.data.pickups || [];

    return {
      totalOrders: orders.length,
      newOrders: orders.filter(o => o.status === 'Pending').length,
      pendingOrders: orders.filter(o => o.status === 'Pending' || o.status === 'Processing').length,
      approvedOrders: orders.filter(o => o.status === 'Approved').length,
      totalShipments: shipments.length,
      shipmentsInTransit: shipments.filter(s => s.status === 'In Transit').length,
      activeTrips: trips.filter(t => t.status === 'Active').length,
      completedTrips: trips.filter(t => t.status === 'Completed').length,
      delayedDeliveries: shipments.filter(s => s.status === 'Delayed').length,
      pendingPickups: pickups.filter(p => p.status === 'Pending' || p.status === 'Scheduled').length,
      totalRevenue: orders.reduce((acc, o) => acc + (o.amount || 0), 0)
    };
  }

  // Order Actions
  addOrder(order) {
    const newId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder = {
      id: newId,
      status: 'Pending',
      orderDate: new Date().toISOString().split('T')[0],
      assignedTripId: null,
      assignedShipmentId: null,
      ...order
    };
    const updated = {
      ...this.data,
      orders: [newOrder, ...this.data.orders],
      activities: [
        {
          id: `ACT-${Date.now()}`,
          type: 'order_created',
          title: `New Order ${newId} Created`,
          description: `Order from ${order.customerName} added to dispatch pipeline ($${order.amount || 0}).`,
          time: 'Just now',
          timestamp: new Date().toISOString().slice(0, 16).replace('T', ' '),
          status: 'info'
        },
        ...this.data.activities
      ]
    };
    this.saveData(updated);

    // Sync to centralized workflowService
    try {
      workflowService.updateOrderStatus(orderId, newStatus, this.data.manager?.name || 'Elena Rostova');
    } catch (_) {}
    return newOrder;
  }

  updateOrderStatus(orderId, newStatus) {
    const updatedOrders = this.data.orders.map(o => (o.id === orderId ? { ...o, status: newStatus } : o));
    const targetOrder = this.data.orders.find(o => o.id === orderId);
    const updated = {
      ...this.data,
      orders: updatedOrders,
      activities: [
        {
          id: `ACT-${Date.now()}`,
          type: 'order_status_updated',
          title: `Order ${orderId} Status: ${newStatus}`,
          description: `${targetOrder?.customerName || 'Customer'} order transitioned to ${newStatus}.`,
          time: 'Just now',
          timestamp: new Date().toISOString().slice(0, 16).replace('T', ' '),
          status: newStatus === 'Approved' ? 'success' : newStatus === 'Cancelled' ? 'error' : 'info'
        },
        ...this.data.activities
      ]
    };
    this.saveData(updated);

    // Sync to centralized workflowService
    try {
      workflowService.updateOrderStatus(orderId, newStatus, this.data.manager?.name || 'Elena Rostova');
    } catch (_) {}
  }

  // Shipment Actions
  createShipment(shipment) {
    const newId = `SHP-${Math.floor(8000 + Math.random() * 1000)}`;
    const newShipment = {
      id: newId,
      dispatchDate: new Date().toISOString().slice(0, 16).replace('T', ' '),
      status: 'Processing',
      progressPercent: 10,
      ...shipment
    };
    const updated = {
      ...this.data,
      shipments: [newShipment, ...this.data.shipments],
      activities: [
        {
          id: `ACT-${Date.now()}`,
          type: 'shipment_created',
          title: `Shipment ${newId} Booked`,
          description: `Consignment from ${shipment.origin} to ${shipment.destination} prepped for transit.`,
          time: 'Just now',
          timestamp: new Date().toISOString().slice(0, 16).replace('T', ' '),
          status: 'info'
        },
        ...this.data.activities
      ]
    };
    this.saveData(updated);

    // Sync to centralized workflowService
    try {
      workflowService.updateOrderStatus(orderId, newStatus, this.data.manager?.name || 'Elena Rostova');
    } catch (_) {}
    return newShipment;
  }

  // Trip Actions
  createTrip(trip) {
    const newId = `TRIP-${Math.floor(7000 + Math.random() * 1000)}`;
    const newTrip = {
      id: newId,
      departureTime: new Date().toISOString().slice(0, 16).replace('T', ' '),
      status: 'Scheduled',
      currentSpeedKmh: 0,
      fuelConsumedLiters: 0,
      ...trip
    };

    // Mark vehicle & driver as assigned
    const updatedVehicles = this.data.vehicles.map(v =>
      v.regNumber === trip.vehicleReg ? { ...v, status: 'Assigned', assignedDriver: trip.driverName } : v
    );
    const updatedDrivers = this.data.drivers.map(d =>
      d.name === trip.driverName ? { ...d, status: 'Assigned', currentVehicle: trip.vehicleReg } : d
    );

    const updated = {
      ...this.data,
      trips: [newTrip, ...this.data.trips],
      vehicles: updatedVehicles,
      drivers: updatedDrivers,
      activities: [
        {
          id: `ACT-${Date.now()}`,
          type: 'trip_created',
          title: `Trip ${newId} Scheduled`,
          description: `Assigned vehicle ${trip.vehicleReg} and driver ${trip.driverName} on route ${trip.startLocation} -> ${trip.destination}.`,
          time: 'Just now',
          timestamp: new Date().toISOString().slice(0, 16).replace('T', ' '),
          status: 'success'
        },
        ...this.data.activities
      ]
    };
    this.saveData(updated);

    // Sync to centralized workflowService
    try {
      workflowService.updateOrderStatus(orderId, newStatus, this.data.manager?.name || 'Elena Rostova');
    } catch (_) {}
    return newTrip;
  }

  assignVehicleAndDriver(tripId, vehicleReg, driverName) {
    const updatedTrips = this.data.trips.map(t =>
      t.id === tripId ? { ...t, vehicleReg, driverName, status: 'Active' } : t
    );
    const updatedVehicles = this.data.vehicles.map(v =>
      v.regNumber === vehicleReg ? { ...v, status: 'In Transit', assignedDriver: driverName } : v
    );
    const updatedDrivers = this.data.drivers.map(d =>
      d.name === driverName ? { ...d, status: 'Assigned', currentVehicle: vehicleReg } : d
    );

    const updated = {
      ...this.data,
      trips: updatedTrips,
      vehicles: updatedVehicles,
      drivers: updatedDrivers,
      activities: [
        {
          id: `ACT-${Date.now()}`,
          type: 'assignment_updated',
          title: `Dispatch Assigned: ${driverName} with ${vehicleReg}`,
          description: `Assigned to Trip ${tripId}. GPS cruise telemetry activated.`,
          time: 'Just now',
          timestamp: new Date().toISOString().slice(0, 16).replace('T', ' '),
          status: 'success'
        },
        ...this.data.activities
      ]
    };
    this.saveData(updated);

    // Sync to centralized workflowService
    try {
      workflowService.updateOrderStatus(orderId, newStatus, this.data.manager?.name || 'Elena Rostova');
    } catch (_) {}
  }

  confirmPickup(pickupId, notes) {
    const updatedPickups = this.data.pickups.map(p =>
      p.id === pickupId ? { ...p, status: 'Completed', notes: notes || p.notes } : p
    );
    const target = this.data.pickups.find(p => p.id === pickupId);
    const updated = {
      ...this.data,
      pickups: updatedPickups,
      activities: [
        {
          id: `ACT-${Date.now()}`,
          type: 'pickup_confirmed',
          title: `Pickup ${pickupId} Confirmed`,
          description: `Consignment for ${target?.customerName || 'Customer'} verified and loaded.`,
          time: 'Just now',
          timestamp: new Date().toISOString().slice(0, 16).replace('T', ' '),
          status: 'success'
        },
        ...this.data.activities
      ]
    };
    this.saveData(updated);

    // Sync to centralized workflowService
    try {
      workflowService.updateOrderStatus(orderId, newStatus, this.data.manager?.name || 'Elena Rostova');
    } catch (_) {}
  }

  confirmDelivery(deliveryId, proofData) {
    const updatedDeliveries = this.data.deliveries.map(d =>
      d.id === deliveryId
        ? {
            ...d,
            status: 'Delivered',
            proofOfDelivery: {
              receivedBy: proofData.receivedBy || 'Authorized Warehouse Receiver',
              signatureTimestamp: new Date().toISOString().slice(0, 19).replace('T', ' '),
              signatureUrl: '/assets/signatures/sample-sig-1.png',
              notes: proofData.notes || 'Delivered on schedule with complete item verification.'
            }
          }
        : d
    );
    const target = this.data.deliveries.find(d => d.id === deliveryId);
    const updated = {
      ...this.data,
      deliveries: updatedDeliveries,
      activities: [
        {
          id: `ACT-${Date.now()}`,
          type: 'delivery_completed',
          title: `Delivery ${deliveryId} Completed`,
          description: `Proof of delivery confirmed for ${target?.customerName || 'Customer'}.`,
          time: 'Just now',
          timestamp: new Date().toISOString().slice(0, 16).replace('T', ' '),
          status: 'success'
        },
        ...this.data.activities
      ]
    };
    this.saveData(updated);

    // Sync to centralized workflowService
    try {
      workflowService.updateOrderStatus(orderId, newStatus, this.data.manager?.name || 'Elena Rostova');
    } catch (_) {}
  }

  markNotificationRead(notifId) {
    const updatedNotifs = this.data.notifications.map(n =>
      n.id === notifId ? { ...n, read: true } : n
    );
    this.saveData({ ...this.data, notifications: updatedNotifs });
  }

  markAllNotificationsRead() {
    const updatedNotifs = this.data.notifications.map(n => ({ ...n, read: true }));
    this.saveData({ ...this.data, notifications: updatedNotifs });
  }

  updateProfile(profileData) {
    const updatedManager = { ...this.data.manager, ...profileData };
    this.saveData({ ...this.data, manager: updatedManager });
  }
}

export const logisticsService = new LogisticsService();
