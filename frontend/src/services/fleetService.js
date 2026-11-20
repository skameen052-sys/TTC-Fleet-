import { initialFleetData } from '../data/initialFleetData';

const STORAGE_KEY = 'ttc_fleet360_data_v1';

class FleetService {
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
      console.warn('LocalStorage error:', e);
    }
    return JSON.parse(JSON.stringify(initialFleetData));
  }

  saveData() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
    } catch (e) {
      console.warn('LocalStorage save error:', e);
    }
    this.notifySubscribers();
  }

  subscribe(callback) {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter(cb => cb !== callback);
    };
  }

  notifySubscribers() {
    this.subscribers.forEach(cb => cb(this.data));
  }

  // Get Summary Metrics (8 summary cards required)
  getSummaryMetrics() {
    const totalVehicles = this.data.vehicles.length;
    const activeVehicles = this.data.vehicles.filter(v => v.status === 'On Trip' || v.status === 'Available').length;
    const availableVehicles = this.data.vehicles.filter(v => v.status === 'Available').length;
    const vehiclesOnTrip = this.data.vehicles.filter(v => v.status === 'On Trip').length;
    const vehiclesUnderMaintenance = this.data.vehicles.filter(v => v.status === 'Under Maintenance').length;
    const inactiveVehicles = this.data.vehicles.filter(v => v.status === 'Out of Service').length;
    const totalDrivers = this.data.drivers.length;
    const availableDrivers = this.data.drivers.filter(d => d.status === 'Available').length;

    return {
      totalVehicles,
      activeVehicles,
      availableVehicles,
      vehiclesOnTrip,
      vehiclesUnderMaintenance,
      inactiveVehicles,
      totalDrivers,
      availableDrivers
    };
  }

  // Vehicle Status Overview Breakdown
  getVehicleStatusOverview() {
    const total = this.data.vehicles.length || 1;
    const available = this.data.vehicles.filter(v => v.status === 'Available').length;
    const onTrip = this.data.vehicles.filter(v => v.status === 'On Trip').length;
    const waiting = this.data.vehicles.filter(v => v.status === 'Waiting for Assignment').length;
    const maintenance = this.data.vehicles.filter(v => v.status === 'Under Maintenance').length;
    const outOfService = this.data.vehicles.filter(v => v.status === 'Out of Service').length;

    return {
      available: { count: available, percent: Math.round((available / total) * 100) },
      onTrip: { count: onTrip, percent: Math.round((onTrip / total) * 100) },
      waiting: { count: waiting, percent: Math.round((waiting / total) * 100) },
      maintenance: { count: maintenance, percent: Math.round((maintenance / total) * 100) },
      outOfService: { count: outOfService, percent: Math.round((outOfService / total) * 100) },
      total
    };
  }

  // Live GPS tracking points
  getGpsTrackingData() {
    return this.data.liveGpsData;
  }

  // Fuel Management statistics
  getFuelStats() {
    return this.data.fuelStats;
  }

  // Maintenance statistics
  getMaintenanceData() {
    return this.data.maintenance;
  }

  // Assignments
  getAssignments() {
    return this.data.assignments;
  }

  // Inspections
  getInspections() {
    return this.data.inspections;
  }

  // Analytics & Reports
  getAnalytics() {
    return this.data.analytics;
  }

  // Notifications
  getNotifications() {
    return this.data.notifications;
  }

  // Add new vehicle
  addVehicle(vehicle) {
    const newId = `V-${100 + this.data.vehicles.length + 1}`;
    const newVehicle = {
      id: newId,
      regNumber: vehicle.regNumber.toUpperCase().trim(),
      vin: vehicle.vin ? vehicle.vin.toUpperCase().trim() : `VIN${Date.now()}`,
      make: vehicle.make || 'Freightliner',
      model: vehicle.model || 'Cascadia',
      year: parseInt(vehicle.year, 10) || 2024,
      category: vehicle.category || 'Heavy Duty Truck',
      status: vehicle.status || 'Available',
      fuelType: vehicle.fuelType || 'Diesel',
      mileage: parseInt(vehicle.mileage, 10) || 0,
      maxPayloadKg: parseInt(vehicle.maxPayloadKg, 10) || 15000,
      batteryHealth: 100,
      currentLocation: vehicle.currentLocation || 'Central Depot Bay, Chicago IL',
      assignedDriverId: null,
      assignedDriverName: null,
      efficiency: vehicle.fuelType === 'Electric' ? '1.4 kWh/mi' : '8.2 mpg'
    };

    this.data.vehicles.unshift(newVehicle);

    // Also add to GPS tracking
    const newGps = {
      id: `GPS-${newId}`,
      vehicleReg: newVehicle.regNumber,
      category: newVehicle.category,
      driverName: 'Unassigned',
      driverPhone: 'N/A',
      lat: 41.8781 + (Math.random() - 0.5) * 0.1,
      lng: -87.6298 + (Math.random() - 0.5) * 0.1,
      speedKmh: 0,
      heading: 0,
      status: newVehicle.status,
      destination: 'Stationary - Staging Bay',
      origin: 'Central Logistics Yard',
      eta: 'Standby',
      lastUpdated: 'Just now',
      fuelOrBattery: '100%',
      odometer: `${newVehicle.mileage.toLocaleString()} km`
    };
    this.data.liveGpsData.push(newGps);

    this.saveData();
    return newVehicle;
  }

  // Assign vehicle to driver
  assignVehicle({ vehicleReg, driverId, routeName, expectedReturn }) {
    const vehicle = this.data.vehicles.find(v => v.regNumber === vehicleReg);
    const driver = this.data.drivers.find(d => d.id === driverId);

    if (!vehicle || !driver) {
      throw new Error('Vehicle or Driver not found');
    }

    vehicle.status = 'On Trip';
    vehicle.assignedDriverId = driver.id;
    vehicle.assignedDriverName = driver.fullName;

    driver.status = 'On Duty';
    driver.assignedVehicleReg = vehicle.regNumber;

    const newAssignment = {
      id: `ASG-${700 + this.data.assignments.length + 1}`,
      vehicleReg: vehicle.regNumber,
      driverId: driver.id,
      driverName: driver.fullName,
      routeName: routeName || 'Regional Distribution Route',
      assignedDate: new Date().toISOString().replace('T', ' ').substring(0, 16),
      status: 'Active',
      expectedReturn: expectedReturn || 'Tomorrow 18:00'
    };

    this.data.assignments.unshift(newAssignment);

    // Update GPS tracking entry
    const gps = this.data.liveGpsData.find(g => g.vehicleReg === vehicleReg);
    if (gps) {
      gps.status = 'On Trip';
      gps.driverName = driver.fullName;
      gps.driverPhone = driver.phone;
      gps.speedKmh = 62;
      gps.destination = routeName || 'Dispatched Corridor';
      gps.eta = '1h 30m';
      gps.lastUpdated = 'Just now';
    }

    this.saveData();
    return newAssignment;
  }

  // Add fuel record
  addFuelRecord(record) {
    const newRecord = {
      id: `FR-${800 + this.data.fuelStats.recentFuelRecords.length + 1}`,
      vehicleReg: record.vehicleReg,
      date: record.date || new Date().toISOString().substring(0, 10),
      liters: parseFloat(record.liters) || 100,
      cost: parseFloat(record.cost) || 125.00,
      odometer: parseInt(record.odometer, 10) || 50000,
      station: record.station || 'Pilot Travel Center, Chicago IL',
      fullTank: record.fullTank !== false
    };

    this.data.fuelStats.recentFuelRecords.unshift(newRecord);
    this.data.fuelStats.totalFuelConsumedLiters += newRecord.liters;
    this.data.fuelStats.monthlyFuelExpense += newRecord.cost;

    this.saveData();
    return newRecord;
  }

  // Schedule Maintenance
  scheduleMaintenance(record) {
    const newRecord = {
      id: `M-${400 + this.data.maintenance.records.length + 1}`,
      vehicleReg: record.vehicleReg,
      serviceType: record.serviceType,
      description: record.description || 'Preventive fleet inspection and service overhaul.',
      status: record.status || 'Upcoming',
      scheduledDate: record.scheduledDate || new Date().toISOString().substring(0, 10),
      completedDate: null,
      cost: parseFloat(record.cost) || 550.00,
      serviceCenter: record.serviceCenter || 'Central Depot Main Service Bay',
      priority: record.priority || 'Routine'
    };

    this.data.maintenance.records.unshift(newRecord);
    if (newRecord.status === 'Under Repair') {
      const v = this.data.vehicles.find(veh => veh.regNumber === record.vehicleReg);
      if (v) v.status = 'Under Maintenance';
    }

    this.saveData();
    return newRecord;
  }

  // Record Vehicle Inspection
  recordInspection(record) {
    const newInspection = {
      id: `INS-${900 + this.data.inspections.length + 1}`,
      vehicleReg: record.vehicleReg,
      inspectorName: record.inspectorName || 'Lead Inspector Alex Mercer',
      inspectionDate: new Date().toISOString().replace('T', ' ').substring(0, 16),
      odometerKm: parseInt(record.odometerKm, 10) || 50000,
      tiresStatus: record.tiresStatus || 'Pass (8/32")',
      brakesStatus: record.brakesStatus || 'Pass (12mm)',
      lightsStatus: record.lightsStatus || 'Pass',
      fluidsStatus: record.fluidsStatus || 'Pass',
      overallStatus: record.overallStatus || 'Passed',
      notes: record.notes || 'Full multi-point pre-trip checklist completed.'
    };

    this.data.inspections.unshift(newInspection);
    this.saveData();
    return newInspection;
  }

  // Live GPS simulation
  simulateGpsTick() {
    this.data.liveGpsData.forEach(item => {
      if (item.status === 'On Trip') {
        const deltaLat = (Math.random() - 0.48) * 0.005;
        const deltaLng = (Math.random() - 0.48) * 0.005;
        item.lat = +(item.lat + deltaLat).toFixed(4);
        item.lng = +(item.lng + deltaLng).toFixed(4);
        item.speedKmh = Math.floor(58 + Math.random() * 16);
        item.lastUpdated = 'Just now';
      }
    });
    this.saveData();
  }

  // Mark notification read
  markNotificationRead(id) {
    const notif = this.data.notifications.find(n => n.id === id);
    if (notif) {
      notif.read = true;
      this.saveData();
    }
  }

  // Mark all notifications read
  markAllNotificationsRead() {
    this.data.notifications.forEach(n => n.read = true);
    this.saveData();
  }

  // ==========================================
  // DRIVER PORTAL DATA & WORKFLOW METHODS
  // ==========================================
  getDriverPortalData(driverId = 'D-01') {
    if (!this.data.driverPortal) {
      this.data.driverPortal = {
        driver: {
          id: 'D-01',
          fullName: 'Marcus Vance',
          licenseNumber: 'CDL-IL-9840192',
          licenseType: 'Class A Commercial (CDL)',
          licenseExpiry: '2028-09-15',
          dotMedicalExpiry: '2027-04-10',
          phone: '+1 (312) 555-0143',
          email: 'm.vance@fleet360.ttc.com',
          status: 'On Duty',
          rating: 4.95,
          experienceYears: 12,
          safetyScore: 98,
          assignedVehicleReg: 'TTC-8492-HD',
          tripsCompleted: 482
        },
        metrics: {
          totalAssignedTrips: 18,
          todayTrips: 1,
          activeTrips: 1,
          upcomingTrips: 3,
          completedTrips: 482,
          pendingDeliveries: 1,
          totalDistanceTravelled: '124,580 km'
        },
        activeTrip: {
          id: 'TRIP-5082',
          orderId: 'ORD-9821',
          shipmentId: 'SHP-7740',
          vehicleReg: 'TTC-8492-HD',
          status: 'In Transit',
          currentStageIndex: 5,
          stages: [
            { id: 1, name: 'Assigned', time: '06:00 AM', completed: true },
            { id: 2, name: 'Accepted', time: '06:05 AM', completed: true },
            { id: 3, name: 'Reached Pickup Location', time: '06:25 AM', completed: true },
            { id: 4, name: 'Goods Picked Up', time: '06:40 AM', completed: true },
            { id: 5, name: 'Trip Started', time: '06:45 AM', completed: true },
            { id: 6, name: 'In Transit', time: 'In Progress (ETA 1h 45m)', active: true },
            { id: 7, name: 'Reached Destination', time: 'Pending', upcoming: true },
            { id: 8, name: 'Goods Delivered', time: 'Pending', upcoming: true },
            { id: 9, name: 'Trip Completed', time: 'Pending', upcoming: true }
          ],
          pickup: {
            address: 'Chicago Central Logistics Depot, 4420 S Western Ave, Chicago IL',
            contactName: 'Dan Reynolds (Dock Master)',
            contactPhone: '+1 (312) 555-0188',
            goodsDescription: 'Industrial Machinery Components & Hydraulics',
            packageQuantity: '18 Heavy Pallets (14,200 kg)',
            scheduledTime: 'Today at 06:30 AM',
            isConfirmed: true,
            pickupTimestamp: '2026-11-20 06:40 AM',
            photos: ['/assets/fleet-manager-trucks.jpg']
          },
          delivery: {
            address: 'Cleveland Intermodal Freight Terminal, 1200 E 55th St, Cleveland OH',
            receiverName: 'Sarah Jenkins (Receiving Supervisor)',
            receiverPhone: '+1 (216) 555-0142',
            expectedTime: 'Today at 04:30 PM',
            isConfirmed: false,
            signatureCaptured: false,
            podUploaded: false,
            deliveryTimestamp: null,
            failedReason: null
          },
          route: {
            origin: 'Chicago Central Depot, IL',
            destination: 'Cleveland Freight Terminal, OH',
            currentLocation: 'I-90 East Mile 142, Toledo OH',
            totalDistanceKm: 552,
            remainingKm: 184,
            speedKmh: 68,
            eta: '1h 45m',
            isGpsSharing: true,
            gpsStatus: 'GPS Online (±3m Differential GNSS)',
            pickupCoords: [41.8781, -87.6298],
            currentCoords: [41.6528, -83.5379],
            destCoords: [41.4993, -81.6944]
          }
        },
        vehicle: {
          regNumber: 'TTC-8492-HD',
          vin: '1FUJG6AV9NL109283',
          make: 'Freightliner',
          model: 'Cascadia Evolution',
          year: 2023,
          category: 'Heavy Duty Truck (Class 8)',
          maxCapacity: '24,000 kg Payload',
          odometerKm: 74210,
          inspectionStatus: 'Certified Safe (Valid for 24h)',
          maintenanceAlert: 'A-Service PM due in 1,420 km (Scheduled Nov 24)',
          fuelLevel: '74% Diesel (Estimated 520 km range)'
        },
        driverTrips: [
          {
            id: 'TRIP-5082',
            orderId: 'ORD-9821',
            status: 'In Transit',
            origin: 'Chicago Central Depot, IL',
            destination: 'Cleveland Freight Terminal, OH',
            date: 'Today, Nov 20',
            distance: '552 km',
            cargo: '18 Pallets Machinery',
            type: 'active'
          },
          {
            id: 'TRIP-5089',
            orderId: 'ORD-9844',
            status: 'Upcoming',
            origin: 'Cleveland Terminal, OH',
            destination: 'Pittsburgh Distribution Yard, PA',
            date: 'Tomorrow, Nov 21 (07:00 AM)',
            distance: '215 km',
            cargo: '12 Pallets Electronics',
            type: 'upcoming'
          },
          {
            id: 'TRIP-5094',
            orderId: 'ORD-9870',
            status: 'Upcoming',
            origin: 'Pittsburgh Yard, PA',
            destination: 'Columbus Logistics Center, OH',
            date: 'Nov 22, 2026 (09:00 AM)',
            distance: '302 km',
            cargo: 'Automotive Assemblies',
            type: 'upcoming'
          },
          {
            id: 'TRIP-5061',
            orderId: 'ORD-9750',
            status: 'Completed',
            origin: 'Detroit Logistics Hub, MI',
            destination: 'Chicago Central Depot, IL',
            date: 'Nov 18, 2026',
            distance: '460 km',
            cargo: 'Engine Castings',
            type: 'history'
          },
          {
            id: 'TRIP-5054',
            orderId: 'ORD-9712',
            status: 'Completed',
            origin: 'Milwaukee Cold Storage, WI',
            destination: 'Chicago Distribution Yard, IL',
            date: 'Nov 16, 2026',
            distance: '148 km',
            cargo: 'Packaged Foods',
            type: 'history'
          },
          {
            id: 'TRIP-5032',
            orderId: 'ORD-9680',
            status: 'Cancelled',
            origin: 'Gary Staging Bay, IN',
            destination: 'Rockford Terminal, IL',
            date: 'Nov 12, 2026',
            distance: '180 km',
            cargo: 'Steel Sheets (Weather Stop)',
            type: 'history'
          }
        ],
        fuelLogs: [
          { id: 'DFR-01', date: '2026-11-19', vehicle: 'TTC-8492-HD', liters: 380, cost: 475.00, odometer: 74120, station: 'Pilot Travel Center #412, Toledo OH', receiptStatus: 'Verified' },
          { id: 'DFR-02', date: '2026-11-17', vehicle: 'TTC-8492-HD', liters: 395, cost: 493.75, odometer: 73540, station: 'Love’s Travel Stop #610, Elkhart IN', receiptStatus: 'Verified' }
        ],
        documents: [
          { id: 'DOC-D1', name: 'Commercial Driver License (Class A)', number: 'CDL-IL-9840192', expiry: '2028-09-15', status: 'Valid', issuer: 'State of Illinois' },
          { id: 'DOC-D2', name: 'DOT Medical Examiner Certificate', number: 'MED-90281-IL', expiry: '2027-04-10', status: 'Valid', issuer: 'Concentra Urgent Care' },
          { id: 'DOC-D3', name: 'Commercial Vehicle Registration (Cab Card)', number: 'REG-TTC-8492', expiry: '2027-01-31', status: 'Valid', issuer: 'Illinois DOT' },
          { id: 'DOC-D4', name: 'Fleet Cargo Liability Insurance Policy', number: 'ICC-9948201-HD', expiry: '2027-06-30', status: 'Active', issuer: 'Travelers Commercial' }
        ],
        driverNotifications: [
          { id: 'DN-1', title: 'Route Advisory: Snow Squall Warning', message: 'Lake effect snow squall reported on I-90 between Mile 160 and 190. Reduce speed to 50 km/h.', time: '12 mins ago', type: 'emergency', read: false },
          { id: 'DN-2', title: 'Trip Assignment Confirmed: TRIP-5082', message: '18 pallets industrial machinery loaded at Chicago Depot. Dock release approved.', time: '3 hours ago', type: 'assignment', read: true },
          { id: 'DN-3', title: 'Upcoming Trip Scheduled', message: 'You have been assigned TRIP-5089 (Cleveland to Pittsburgh) departing tomorrow at 07:00 AM.', time: '5 hours ago', type: 'info', read: true }
        ]
      };
      this.saveData();
    }
    return this.data.driverPortal;
  }

  // Advance Trip Lifecycle Stage (no skipping mandatory stages)
  advanceDriverTripStage() {
    const portal = this.getDriverPortalData();
    const trip = portal.activeTrip;
    if (trip.currentStageIndex < trip.stages.length - 1) {
      trip.stages[trip.currentStageIndex].completed = true;
      delete trip.stages[trip.currentStageIndex].active;
      trip.currentStageIndex += 1;
      trip.stages[trip.currentStageIndex].active = true;
      trip.status = trip.stages[trip.currentStageIndex].name;
      const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      trip.stages[trip.currentStageIndex].time = nowStr;

      if (trip.currentStageIndex === 8) {
        portal.metrics.completedTrips += 1;
        portal.metrics.activeTrips = 0;
        portal.metrics.pendingDeliveries = 0;
      }
      this.saveData();
    }
    return trip;
  }

  // Confirm Pickup
  confirmDriverPickup() {
    const portal = this.getDriverPortalData();
    const trip = portal.activeTrip;
    trip.pickup.isConfirmed = true;
    trip.pickup.pickupTimestamp = new Date().toISOString().replace('T', ' ').substring(0, 16);
    if (trip.currentStageIndex < 3) {
      trip.currentStageIndex = 3;
      trip.status = 'Goods Picked Up';
    }
    this.saveData();
    return trip;
  }

  // Confirm Delivery & Submit Proof
  confirmDriverDelivery(receiverSignature = 'Signature Captured (Digital)', podPhoto = null) {
    const portal = this.getDriverPortalData();
    const trip = portal.activeTrip;
    trip.delivery.isConfirmed = true;
    trip.delivery.signatureCaptured = true;
    trip.delivery.receiverSignature = receiverSignature;
    trip.delivery.podUploaded = true;
    trip.delivery.podPhoto = podPhoto || '/assets/fleet-manager-trucks.jpg';
    trip.delivery.deliveryTimestamp = new Date().toISOString().replace('T', ' ').substring(0, 16);

    // Advance to Goods Delivered
    trip.currentStageIndex = 7;
    trip.status = 'Goods Delivered';
    this.saveData();
    return trip;
  }

  // Cancel Trip
  cancelDriverTrip(reason) {
    const portal = this.getDriverPortalData();
    portal.activeTrip.status = 'Cancelled';
    portal.activeTrip.delivery.failedReason = reason;
    portal.metrics.activeTrips = 0;
    portal.metrics.pendingDeliveries = 0;
    this.saveData();
    return portal.activeTrip;
  }

  // Toggle GPS Location Sharing
  toggleDriverGpsSharing() {
    const portal = this.getDriverPortalData();
    portal.activeTrip.route.isGpsSharing = !portal.activeTrip.route.isGpsSharing;
    this.saveData();
    return portal.activeTrip.route.isGpsSharing;
  }

  // Add Driver Fuel Record
  addDriverFuelRecord(record) {
    const portal = this.getDriverPortalData();
    const newRecord = {
      id: `DFR-0${portal.fuelLogs.length + 1}`,
      date: new Date().toISOString().substring(0, 10),
      vehicle: portal.vehicle.regNumber,
      liters: Number(record.liters) || 300,
      cost: Number(record.cost) || 390.00,
      odometer: Number(record.odometer) || portal.vehicle.odometerKm,
      station: record.station || 'Commercial Fuel Bay',
      receiptStatus: 'Submitted (Pending Review)'
    };
    portal.fuelLogs.unshift(newRecord);
    this.saveData();
    return newRecord;
  }

  // Report Vehicle Issue
  reportDriverIssue(issue) {
    const portal = this.getDriverPortalData();
    portal.vehicle.inspectionStatus = 'Issue Reported';
    portal.vehicle.maintenanceAlert = `Driver Report: ${issue.title} - Assigned to Maintenance Team`;
    portal.driverNotifications.unshift({
      id: `DN-${Date.now()}`,
      title: `Maintenance Ticket Logged: ${issue.title}`,
      message: issue.description || 'Inspection issue report dispatched to service department.',
      time: 'Just now',
      type: 'warning',
      read: false
    });
    this.saveData();
  }

  // Reset to initial data
  resetToDefaults() {
    this.data = JSON.parse(JSON.stringify(initialFleetData));
    this.saveData();
  }
}

export const fleetService = new FleetService();
