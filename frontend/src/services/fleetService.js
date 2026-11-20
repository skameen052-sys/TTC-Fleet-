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

  // Reset to initial data
  resetToDefaults() {
    this.data = JSON.parse(JSON.stringify(initialFleetData));
    this.saveData();
  }
}

export const fleetService = new FleetService();
