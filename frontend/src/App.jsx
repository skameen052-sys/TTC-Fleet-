import React, { useState, useEffect } from 'react';
import { Sidebar, navigationItems } from './components/common/Sidebar';
import { Header } from './components/common/Header';
import { SummaryCards } from './components/dashboard/SummaryCards';
import { VehicleStatusOverview } from './components/dashboard/VehicleStatusOverview';
import { FleetUtilizationAnalytics } from './components/dashboard/FleetUtilizationAnalytics';
import { LiveFleetTracking } from './components/dashboard/LiveFleetTracking';
import { FuelManagementOverview } from './components/dashboard/FuelManagementOverview';
import { MaintenanceOverview } from './components/dashboard/MaintenanceOverview';
import { VehicleDriverAssignment } from './components/dashboard/VehicleDriverAssignment';
import { ChartsAndReports } from './components/dashboard/ChartsAndReports';
import { QuickActions } from './components/dashboard/QuickActions';
import { HeroBanner } from './components/dashboard/HeroBanner';
import { LoginPage } from './components/auth/LoginPage';
import { AdminDashboard } from './components/admin/AdminDashboard';

// Fleet Manager Modals
import { AddVehicleModal } from './components/modals/AddVehicleModal';
import { AssignVehicleModal } from './components/modals/AssignVehicleModal';
import { AddFuelRecordModal } from './components/modals/AddFuelRecordModal';
import { ScheduleMaintenanceModal } from './components/modals/ScheduleMaintenanceModal';
import { RecordInspectionModal } from './components/modals/RecordInspectionModal';

// Fleet Manager Dedicated Sub-Views
import {
  VehicleManagementView,
  VehicleCategoriesView,
  VehicleAllocationView,
  VehicleAvailabilityView,
  VehicleDocumentsView,
  DriverAssignmentView,
  VehicleInspectionView,
  FleetReportsView,
  NotificationsView,
  MyProfileView
} from './components/views/OtherViews';

// Driver Portal Components
import { DriverSidebar, driverNavItems } from './components/driver/DriverSidebar';
import { DriverHeader } from './components/driver/DriverHeader';
import { DriverDashboard } from './components/driver/DriverDashboard';
import {
  MyTripsView,
  ActiveTripView,
  TripHistoryView,
  MyVehicleView,
  RouteNavView,
  PickupManagementView,
  DeliveryManagementView,
  ShipmentDetailsView,
  FuelRecordsView as DriverFuelRecordsView,
  VehicleInspectionView as DriverInspectionView,
  DocumentsView as DriverDocumentsView,
  NotificationsView as DriverNotificationsView,
  MyProfileView as DriverProfileView,
  DriverModals
} from './components/driver/DriverViews';

// Warehouse Manager Portal Components
import { WarehouseSidebar, warehouseNavItems } from './components/warehouse/WarehouseSidebar';
import { WarehouseHeader } from './components/warehouse/WarehouseHeader';
import { WarehouseDashboard } from './components/warehouse/WarehouseDashboard';
import { WarehouseModals } from './components/warehouse/WarehouseModals';
import {
  WarehouseManagementView,
  InventoryManagementView,
  GoodsReceivingView,
  GoodsDispatchView,
  StockInView,
  StockOutView,
  ShipmentManagementView,
  LoadingManagementView,
  UnloadingManagementView,
  StockTransfersView,
  DamagedGoodsView,
  InventoryReportsView,
  WarehouseNotificationsView,
  WarehouseProfileView
} from './components/warehouse/WarehouseViews';
import { warehouseService } from './services/warehouseService';

// Logistics Manager Portal Components
import { LogisticsSidebar, logisticsNavItems } from './components/logistics/LogisticsSidebar';
import { LogisticsHeader } from './components/logistics/LogisticsHeader';
import { LogisticsDashboard } from './components/logistics/LogisticsDashboard';
import {
  OrderManagementView as LogisticsOrderManagementView,
  ShipmentManagementView as LogisticsShipmentManagementView,
  TripManagementView as LogisticsTripManagementView,
  VehicleAssignmentView as LogisticsVehicleAssignmentView,
  RouteManagementView as LogisticsRouteManagementView,
  GpsTrackingView as LogisticsGpsTrackingView,
  PickupDeliveryView as LogisticsPickupDeliveryView,
  CustomerOrdersView as LogisticsCustomerOrdersView,
  LogisticsReportsView,
  LogisticsNotificationsView,
  LogisticsProfileView
} from './components/logistics/LogisticsViews';
import {
  CreateOrderModal,
  CreateShipmentModal,
  CreateTripModal,
  AssignResourcesModal,
  ProofOfDeliveryModal
} from './components/logistics/LogisticsModals';
import { logisticsService } from './services/logisticsService';


import { fleetService } from './services/fleetService';
import { CheckCircle, AlertCircle } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('TTC Fleet360 caught error in boundary:', error, errorInfo);
  }

  handleReset = () => {
    localStorage.removeItem('ttc_fleet360_data_v1');
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0d121f',
          fontFamily: 'Inter, system-ui, sans-serif',
          padding: 24,
          color: '#E2E8F0'
        }}>
          <div style={{
            maxWidth: 520,
            width: '100%',
            backgroundColor: '#131b2e',
            borderRadius: 16,
            padding: 36,
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)',
            border: '1px solid rgba(255, 122, 26, 0.3)',
            textAlign: 'center'
          }}>
            <div style={{
              width: 54,
              height: 54,
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 122, 26, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 18px auto'
            }}>
              <AlertCircle size={32} color="#FF7A1A" />
            </div>
            <h2 style={{ fontSize: 22, fontWeight: 700, margin: '0 0 8px 0', color: '#FFFFFF' }}>
              Portal Display Notice
            </h2>
            <p style={{ fontSize: 14, color: '#94A3B8', lineHeight: 1.6, margin: '0 0 24px 0' }}>
              The portal encountered an unexpected display state. Click below to refresh your session and load fresh fleet telemetry.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <button
                onClick={() => this.setState({ hasError: false })}
                style={{
                  padding: '10px 20px',
                  borderRadius: 8,
                  border: '1px solid #334155',
                  backgroundColor: '#1E293B',
                  color: '#FFFFFF',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Try Again
              </button>
              <button
                onClick={this.handleReset}
                style={{
                  padding: '10px 24px',
                  borderRadius: 8,
                  border: 'none',
                  background: 'linear-gradient(135deg, #FF7A1A 0%, #E66308 100%)',
                  color: '#FFFFFF',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Reload Fresh Data
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return Boolean(localStorage.getItem('ttc_auth_token'));
  });

  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const u = localStorage.getItem('ttc_fleet360_user') || sessionStorage.getItem('ttc_fleet360_user');
      return u ? JSON.parse(u) : { fullName: 'Admin', role: 'ROLE_ADMIN', email: 'admin@ttcfleet360.com' };
    } catch {
      return { fullName: 'Admin', role: 'ROLE_ADMIN', email: 'admin@ttcfleet360.com' };
    }
  });

  // Distinct Portals: 'admin' (Super Admin), 'manager' (Fleet Manager), 'driver' (Driver Portal), 'warehouse' (Warehouse Manager), 'logistics' (Logistics Manager)
  const [portal, setPortal] = useState(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const urlPortal = params.get('portal');
      if (urlPortal === 'driver') return 'driver';
      if (urlPortal === 'warehouse') return 'warehouse';
      if (urlPortal === 'logistics') return 'logistics';
      if (urlPortal === 'manager' || urlPortal === 'fleet') return 'manager';
      if (urlPortal === 'admin') return 'admin';

      const u = localStorage.getItem('ttc_fleet360_user') || sessionStorage.getItem('ttc_fleet360_user');
      const parsed = u ? JSON.parse(u) : null;
      if (parsed?.portal && parsed.portal !== 'maintenance') return parsed.portal;
      if (parsed?.role === 'ROLE_DRIVER') return 'driver';
      if (parsed?.role === 'ROLE_WAREHOUSE_MANAGER') return 'warehouse';
      if (parsed?.role === 'ROLE_LOGISTICS_MANAGER') return 'logistics';
      if (parsed?.role === 'ROLE_MANAGER') return 'manager';
      if (parsed?.role === 'ROLE_ADMIN') return 'admin';
    } catch {}
    return 'admin'; // Default to Super Admin Dashboard
  });

  const [activeTab, setActiveTab] = useState('dashboard');
  const [driverActiveTab, setDriverActiveTab] = useState('dashboard');
  const [warehouseActiveTab, setWarehouseActiveTab] = useState('dashboard');
  const [logisticsActiveTab, setLogisticsActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  // Fleet state, Driver state, Warehouse state & Logistics state
  const [fleetState, setFleetState] = useState(() => fleetService.loadData());
  const [driverPortalData, setDriverPortalData] = useState(() => fleetService.getDriverPortalData());
  const [warehouseData, setWarehouseData] = useState(() => warehouseService.getData());
  const [logisticsData, setLogisticsData] = useState(() => logisticsService.getData());

  // Manager Modal open states
  const [isAddVehicleOpen, setIsAddVehicleOpen] = useState(false);
  const [isAssignVehicleOpen, setIsAssignVehicleOpen] = useState(false);
  const [isAddFuelOpen, setIsAddFuelOpen] = useState(false);
  const [isScheduleMaintOpen, setIsScheduleMaintOpen] = useState(false);
  const [isRecordInspectionOpen, setIsRecordInspectionOpen] = useState(false);

  // Driver Modal open states
  const [isDriverFuelOpen, setIsDriverFuelOpen] = useState(false);
  const [isDriverIssueOpen, setIsDriverIssueOpen] = useState(false);
  const [isDriverPodOpen, setIsDriverPodOpen] = useState(false);
  const [isDriverContactOpen, setIsDriverContactOpen] = useState(false);

  // Warehouse Modal open states
  const [isAddInventoryOpen, setIsAddInventoryOpen] = useState(false);
  const [isStockInOpen, setIsStockInOpen] = useState(false);
  const [isStockOutOpen, setIsStockOutOpen] = useState(false);
  const [isReceiveShipmentOpen, setIsReceiveShipmentOpen] = useState(false);
  const [isCreateDispatchOpen, setIsCreateDispatchOpen] = useState(false);
  const [isTransferStockOpen, setIsTransferStockOpen] = useState(false);
  const [isReportDamagedOpen, setIsReportDamagedOpen] = useState(false);
  const [isAddWarehouseOpen, setIsAddWarehouseOpen] = useState(false);

  // Logistics Modal open states
  const [isLogisticsCreateOrderOpen, setIsLogisticsCreateOrderOpen] = useState(false);
  const [isLogisticsCreateShipmentOpen, setIsLogisticsCreateShipmentOpen] = useState(false);
  const [isLogisticsCreateTripOpen, setIsLogisticsCreateTripOpen] = useState(false);
  const [isLogisticsAssignOpen, setIsLogisticsAssignOpen] = useState(false);
  const [isLogisticsPodOpen, setIsLogisticsPodOpen] = useState(false);
  const [selectedPodDelivery, setSelectedPodDelivery] = useState(null);

  // Subscribe to changes in fleetService, warehouseService & logisticsService
  useEffect(() => {
    const unsubscribeFleet = fleetService.subscribe((updatedData) => {
      setFleetState({ ...updatedData });
      setDriverPortalData(fleetService.getDriverPortalData());
    });
    const unsubscribeWarehouse = warehouseService.subscribe((updatedWhData) => {
      setWarehouseData({ ...updatedWhData });
    });
    const unsubscribeLogistics = logisticsService.subscribe((updatedLogisticsData) => {
      setLogisticsData({ ...updatedLogisticsData });
    });
    return () => {
      unsubscribeFleet();
      unsubscribeWarehouse();
      unsubscribeLogistics();
    };
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage('');
    }, 4500);
  };

  const handleLoginSuccess = (userData) => {
    setCurrentUser(userData);
    setIsAuthenticated(true);
    const targetPortal = userData.portal || (
      userData.role === 'ROLE_DRIVER' ? 'driver' :
      userData.role === 'ROLE_WAREHOUSE_MANAGER' ? 'warehouse' :
      userData.role === 'ROLE_LOGISTICS_MANAGER' ? 'logistics' :
      userData.role === 'ROLE_MANAGER' ? 'manager' : 'admin'
    );
    setPortal(targetPortal);
    if (targetPortal === 'driver') {
      setDriverActiveTab('dashboard');
    } else if (targetPortal === 'warehouse') {
      setWarehouseActiveTab('dashboard');
    } else if (targetPortal === 'logistics') {
      setLogisticsActiveTab('dashboard');
    } else {
      setActiveTab('dashboard');
    }
    showToast(`Welcome back, ${userData.fullName || 'User'}!`);
  };

  const handleLogout = () => {
    localStorage.removeItem('ttc_auth_token');
    localStorage.removeItem('ttc_fleet360_user');
    sessionStorage.removeItem('ttc_fleet360_user');
    setIsAuthenticated(false);
    showToast('Signed out of TTC Fleet360 successfully.');
  };

  // Fleet Manager Actions
  const handleAddVehicle = (vehicleData) => {
    const newV = fleetService.addVehicle(vehicleData);
    showToast(`Vehicle ${newV.regNumber} registered successfully in fleet assets!`);
  };

  const handleAssignVehicle = (assignmentData) => {
    try {
      const asg = fleetService.assignVehicle(assignmentData);
      showToast(`Vehicle ${asg.vehicleReg} dispatched with driver ${asg.driverName}!`);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleAddFuelRecord = (fuelData) => {
    const record = fleetService.addFuelRecord(fuelData);
    showToast(`Fuel record ${record.id} logged for ${record.vehicleReg} (${record.liters}L)!`);
  };

  const handleScheduleMaintenance = (maintData) => {
    const m = fleetService.scheduleMaintenance(maintData);
    showToast(`Maintenance work order scheduled for ${m.vehicleReg} (${m.serviceType})!`);
  };

  const handleRecordInspection = (inspData) => {
    const ins = fleetService.recordInspection(inspData);
    showToast(`Inspection ${ins.id} certified: ${ins.overallStatus} for ${ins.vehicleReg}!`);
  };

  const handleSimulateTick = () => {
    fleetService.simulateGpsTick();
  };

  const handleMarkNotificationRead = (id) => {
    fleetService.markNotificationRead(id);
  };

  const handleMarkAllNotificationsRead = () => {
    fleetService.markAllNotificationsRead();
    showToast('All notifications marked as read.');
  };

  // Driver Actions
  const handleAdvanceDriverStage = (tripId) => {
    const updatedTrip = fleetService.advanceDriverTripStage(tripId);
    setDriverPortalData(fleetService.getDriverPortalData());
    const stageName = updatedTrip?.stages?.[updatedTrip.currentStageIndex]?.name || 'Stage updated';
    showToast(`Trip Stage updated: ${stageName}`);
  };

  const handleConfirmPickup = (tripId, notes) => {
    const updatedTrip = fleetService.confirmDriverPickup(tripId, notes);
    setDriverPortalData(fleetService.getDriverPortalData());
    showToast(`Pickup verified for shipment ${updatedTrip?.shipmentId || 'Freight'}! Cargo loaded.`);
  };

  const handleConfirmDelivery = (tripId, recipientName, podPhoto) => {
    const updatedTrip = fleetService.confirmDriverDelivery(tripId, recipientName, podPhoto);
    setDriverPortalData(fleetService.getDriverPortalData());
    showToast(`Delivery completed! Electronic POD certified for ${recipientName || 'Consignee'}.`);
  };

  const handleCancelDriverTrip = (tripId, reason) => {
    const updatedTrip = fleetService.cancelDriverTrip(tripId, reason);
    setDriverPortalData(fleetService.getDriverPortalData());
    showToast(`Trip ${tripId} cancelled: ${reason}. Logistics manager alerted.`);
  };

  const handleToggleGpsSharing = (tripId) => {
    const updatedTrip = fleetService.toggleDriverGpsSharing(tripId);
    setDriverPortalData(fleetService.getDriverPortalData());
    showToast(`Driver GPS Sharing is now ${updatedTrip?.gpsSharing ? 'ENABLED' : 'PAUSED'}.`);
  };

  const handleAddDriverFuel = (fuelData) => {
    const newLog = fleetService.addDriverFuelRecord(fuelData);
    setDriverPortalData(fleetService.getDriverPortalData());
    showToast(`Fuel refill of ${newLog.liters}L ($${newLog.cost}) logged successfully!`);
  };

  const handleReportDriverIssue = (issueData) => {
    const issue = fleetService.reportDriverIssue(issueData);
    setDriverPortalData(fleetService.getDriverPortalData());
    showToast(`Vehicle inspection defect logged: ${issue.title} (Severity: ${issue.severity}).`);
  };

  // Warehouse Manager Actions
  const handleAddInventory = (itemData) => {
    const item = warehouseService.addInventoryItem(itemData);
    showToast(`Inventory SKU ${item.sku} registered successfully!`);
  };

  const handleRecordStockIn = (stockData) => {
    warehouseService.recordStockIn(stockData);
    showToast(`Stock In recorded for ${stockData.sku} (+${stockData.quantity} units)!`);
  };

  const handleRecordStockOut = (stockData) => {
    warehouseService.recordStockOut(stockData);
    showToast(`Stock Out recorded for ${stockData.sku} (-${stockData.quantity} units)!`);
  };

  const handleConfirmReceiving = (shipmentId) => {
    const s = warehouseService.confirmReceiving(shipmentId);
    showToast(`Shipment ${s?.shipmentId || shipmentId} verified and stored into inventory!`);
  };

  const handleCreateDispatch = (dispatchData) => {
    const d = warehouseService.createDispatch(dispatchData);
    showToast(`Dispatch ${d.orderId} scheduled at ${d.dockBay} for ${d.destination}!`);
  };

  const handleConfirmDispatch = (dispatchId) => {
    const d = warehouseService.confirmDispatch(dispatchId);
    showToast(`Dispatch ${d?.orderId || dispatchId} authorized & released for transit!`);
  };

  const handleTransferStock = (transferData) => {
    const t = warehouseService.transferStock(transferData);
    showToast(`Transfer ${t.id} initiated: ${t.quantity} units to ${t.destWarehouse}!`);
  };

  const handleReportDamagedGoods = (damageData) => {
    const dmg = warehouseService.reportDamagedGoods(damageData);
    showToast(`Damaged stock ${dmg.sku} (${dmg.quantity} units) moved to quarantine!`);
  };

  const handleAddWarehouse = (whData) => {
    const wh = warehouseService.addWarehouse(whData);
    showToast(`Warehouse facility ${wh.name} (${wh.code}) registered successfully!`);
  };

  // Compute live metrics
  const summaryMetrics = fleetService.getSummaryMetrics();
  const statusOverview = fleetService.getVehicleStatusOverview();
  const gpsData = fleetService.getGpsTrackingData();
  const fuelStats = fleetService.getFuelStats();
  const maintenanceData = fleetService.getMaintenanceData();
  const assignments = fleetService.getAssignments();
  const inspections = fleetService.getInspections();
  const analytics = fleetService.getAnalytics();
  const notifications = fleetService.getNotifications();
  const unreadNotifsCount = notifications.filter(n => !n.read).length;
  const warehouseMetrics = warehouseService.getSummaryMetrics();

  // Page title mapping for Manager
  const activeNavItem = navigationItems.find(item => item.id === activeTab);
  const managerPageTitle = activeTab === 'dashboard' ? 'Fleet Dashboard' : (activeNavItem?.label || 'Fleet Manager');

  // Page title mapping for Driver
  const activeDriverNavItem = driverNavItems.find(item => item.id === driverActiveTab);
  const driverPageTitle = driverActiveTab === 'dashboard' ? 'Driver Dashboard' : (activeDriverNavItem?.label || 'Driver Portal');

  // Page title mapping for Warehouse
  const activeWarehouseNavItem = warehouseNavItems.find(item => item.id === warehouseActiveTab || (item.subItems && item.subItems.some(sub => sub.id === warehouseActiveTab)));
  const activeWarehouseSubItem = activeWarehouseNavItem?.subItems?.find(sub => sub.id === warehouseActiveTab);
  const warehousePageTitle = warehouseActiveTab === 'dashboard'
    ? 'Warehouse Dashboard'
    : activeWarehouseSubItem
      ? activeWarehouseSubItem.label
      : (activeWarehouseNavItem?.label || 'Warehouse OS');

  // Page title mapping for Logistics Manager
  const activeLogisticsNavItem = logisticsNavItems.find(item => item.id === logisticsActiveTab || (item.subItems && item.subItems.some(sub => sub.id === logisticsActiveTab)));
  const activeLogisticsSubItem = activeLogisticsNavItem?.subItems?.find(sub => sub.id === logisticsActiveTab);
  const logisticsPageTitle = logisticsActiveTab === 'dashboard'
    ? 'Logistics Dashboard'
    : activeLogisticsSubItem
      ? activeLogisticsSubItem.label
      : (activeLogisticsNavItem?.label || 'Logistics Operations');

  // If not authenticated or login tab selected, render dedicated LoginPage
  if (!isAuthenticated || activeTab === 'login') {
    return (
      <>
        <LoginPage onLoginSuccess={handleLoginSuccess} initialPortal={portal} />
        {toastMessage && (
          <div className="toast-banner">
            <CheckCircle size={18} color="#16A36A" />
            <span>{toastMessage}</span>
          </div>
        )}
      </>
    );
  }

  // =========================================================================
  // 1. RENDER SUPER ADMIN DASHBOARD (EXACT REFERENCE SCREENSHOT 2)
  // =========================================================================
  if (portal === 'admin') {
    return (
      <ErrorBoundary>
        <AdminDashboard
          currentUser={currentUser}
          onLogout={handleLogout}
          onSwitchPortal={(targetPortal) => {
            setPortal(targetPortal);
            if (targetPortal === 'driver') setDriverActiveTab('dashboard');
            else if (targetPortal === 'warehouse') setWarehouseActiveTab('dashboard');
            else if (targetPortal === 'logistics') setLogisticsActiveTab('dashboard');
            else setActiveTab('dashboard');
          }}
        />
        {toastMessage && (
          <div className="toast-banner">
            <CheckCircle size={18} color="#16A36A" />
            <span>{toastMessage}</span>
          </div>
        )}
      </ErrorBoundary>
    );
  }

  // =========================================================================
  // 2. RENDER WAREHOUSE MANAGER PORTAL
  // =========================================================================
  if (portal === 'warehouse') {
    return (
      <ErrorBoundary>
        <div className="app-container warehouse-portal-theme">
          {/* Left Sidebar Navigation (Warehouse Manager) */}
          <WarehouseSidebar
            activeTab={warehouseActiveTab}
            onSelectTab={setWarehouseActiveTab}
            user={currentUser}
            onLogout={handleLogout}
            onSwitchToManager={() => {
              setPortal('manager');
              setActiveTab('dashboard');
            }}
            onSwitchToDriver={() => {
              setPortal('driver');
              setDriverActiveTab('dashboard');
            }}
          />

          {/* Main Content Wrapper */}
          <div className="main-wrapper">
            {/* Quick Portal Switcher Banner */}
            <div style={{
              backgroundColor: '#0F172A',
              color: '#E2E8F0',
              padding: '10px 24px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '13px',
              borderBottom: '1px solid #334155',
              zIndex: 10
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ color: '#94A3B8' }}>Viewing Mode:</span>
                <strong style={{ color: '#8b5cf6' }}>Warehouse Management OS</strong>
                <span style={{ color: '#94A3B8' }}>(Ethan Cole - Logistics Depot Chief)</span>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={() => {
                    setPortal('admin');
                    setActiveTab('dashboard');
                  }}
                  style={{
                    backgroundColor: '#FF7A1A',
                    color: '#FFFFFF',
                    border: 'none',
                    padding: '6px 14px',
                    borderRadius: '6px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    fontSize: '12px'
                  }}
                >
                  👑 Open Admin Dashboard
                </button>
                <button
                  onClick={() => {
                    setPortal('manager');
                    setActiveTab('dashboard');
                  }}
                  style={{
                    backgroundColor: '#00a3ff',
                    color: '#FFFFFF',
                    border: 'none',
                    padding: '6px 14px',
                    borderRadius: '6px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    fontSize: '12px'
                  }}
                >
                  🚚 Open Fleet Manager
                </button>
                <button
                  onClick={() => {
                    setPortal('driver');
                    setDriverActiveTab('dashboard');
                  }}
                  style={{
                    backgroundColor: '#10b981',
                    color: '#FFFFFF',
                    border: 'none',
                    padding: '6px 14px',
                    borderRadius: '6px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    fontSize: '12px'
                  }}
                >
                  🧑‍✈️ Open Driver Portal
                </button>
              </div>
            </div>

            {/* Top Navigation Bar (Warehouse Manager) */}
            <WarehouseHeader
              activeTabTitle={warehousePageTitle}
              user={currentUser}
              alerts={warehouseData.alerts || []}
              onSelectTab={setWarehouseActiveTab}
              onLogout={handleLogout}
              onSwitchToManager={() => {
                setPortal('manager');
                setActiveTab('dashboard');
              }}
              onSwitchToDriver={() => {
                setPortal('driver');
                setDriverActiveTab('dashboard');
              }}
              onSwitchPortal={(p) => setPortal(p)}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />

            {/* Dynamic Warehouse Page Views */}
            <main className="dashboard-content">
              <ErrorBoundary>
                {warehouseActiveTab === 'dashboard' && (
                  <WarehouseDashboard
                    data={warehouseData}
                    metrics={warehouseMetrics}
                    onOpenAddInventory={() => setIsAddInventoryOpen(true)}
                    onOpenStockIn={() => setIsStockInOpen(true)}
                    onOpenStockOut={() => setIsStockOutOpen(true)}
                    onOpenReceiveShipment={() => setIsReceiveShipmentOpen(true)}
                    onOpenCreateDispatch={() => setIsCreateDispatchOpen(true)}
                    onOpenTransferStock={() => setIsTransferStockOpen(true)}
                    onOpenReportDamaged={() => setIsReportDamagedOpen(true)}
                    onSelectTab={setWarehouseActiveTab}
                    onConfirmReceiving={handleConfirmReceiving}
                    onConfirmDispatch={handleConfirmDispatch}
                  />
                )}

                {['warehouses', 'all-warehouses', 'add-warehouse', 'edit-warehouse'].includes(warehouseActiveTab) && (
                  <WarehouseManagementView
                    warehouses={warehouseData.warehouses || []}
                    activeSubTab={warehouseActiveTab}
                    onSelectTab={setWarehouseActiveTab}
                    onOpenAddWarehouse={() => setIsAddWarehouseOpen(true)}
                  />
                )}

                {['inventory', 'all-inventory', 'add-items', 'stock-details'].includes(warehouseActiveTab) && (
                  <InventoryManagementView
                    inventory={warehouseData.inventory || []}
                    activeSubTab={warehouseActiveTab}
                    onSelectTab={setWarehouseActiveTab}
                    onOpenAddInventory={() => setIsAddInventoryOpen(true)}
                  />
                )}

                {['goods-receiving', 'incoming-goods', 'receiving-confirmation'].includes(warehouseActiveTab) && (
                  <GoodsReceivingView
                    incomingGoods={warehouseData.incomingGoods || []}
                    activeSubTab={warehouseActiveTab}
                    onSelectTab={setWarehouseActiveTab}
                    onConfirmReceiving={handleConfirmReceiving}
                  />
                )}

                {['goods-dispatch', 'outgoing-goods', 'dispatch-records'].includes(warehouseActiveTab) && (
                  <GoodsDispatchView
                    outgoingGoods={warehouseData.outgoingGoods || []}
                    activeSubTab={warehouseActiveTab}
                    onSelectTab={setWarehouseActiveTab}
                    onConfirmDispatch={handleConfirmDispatch}
                    onOpenCreateDispatch={() => setIsCreateDispatchOpen(true)}
                  />
                )}

                {['stock-in', 'add-stock', 'receiving-history'].includes(warehouseActiveTab) && (
                  <StockInView
                    inventory={warehouseData.inventory || []}
                    stockMovement={warehouseData.stockMovement || []}
                    activeSubTab={warehouseActiveTab}
                    onSelectTab={setWarehouseActiveTab}
                    onOpenStockIn={() => setIsStockInOpen(true)}
                  />
                )}

                {['stock-out', 'remove-stock', 'stock-out-history'].includes(warehouseActiveTab) && (
                  <StockOutView
                    inventory={warehouseData.inventory || []}
                    stockMovement={warehouseData.stockMovement || []}
                    activeSubTab={warehouseActiveTab}
                    onSelectTab={setWarehouseActiveTab}
                    onOpenStockOut={() => setIsStockOutOpen(true)}
                  />
                )}

                {['shipment-management', 'incoming-shipments', 'outgoing-shipments'].includes(warehouseActiveTab) && (
                  <ShipmentManagementView
                    incomingGoods={warehouseData.incomingGoods || []}
                    outgoingGoods={warehouseData.outgoingGoods || []}
                    activeSubTab={warehouseActiveTab}
                    onSelectTab={setWarehouseActiveTab}
                  />
                )}

                {['loading-management', 'loading-schedule', 'loading-confirmation'].includes(warehouseActiveTab) && (
                  <LoadingManagementView
                    loadingSchedule={warehouseData.loadingSchedule || []}
                    activeSubTab={warehouseActiveTab}
                    onSelectTab={setWarehouseActiveTab}
                  />
                )}

                {['unloading-management', 'unloading-schedule', 'unloading-confirmation'].includes(warehouseActiveTab) && (
                  <UnloadingManagementView
                    loadingSchedule={warehouseData.loadingSchedule || []}
                    activeSubTab={warehouseActiveTab}
                    onSelectTab={setWarehouseActiveTab}
                  />
                )}

                {warehouseActiveTab === 'stock-transfers' && (
                  <StockTransfersView
                    stockTransfers={warehouseData.stockTransfers || []}
                    onOpenTransferStock={() => setIsTransferStockOpen(true)}
                  />
                )}

                {['damaged-goods', 'damaged-stock', 'damage-reports'].includes(warehouseActiveTab) && (
                  <DamagedGoodsView
                    damagedGoods={warehouseData.damagedGoods || []}
                    activeSubTab={warehouseActiveTab}
                    onSelectTab={setWarehouseActiveTab}
                    onOpenReportDamaged={() => setIsReportDamagedOpen(true)}
                  />
                )}

                {['inventory-reports', 'stock-reports', 'movement-reports'].includes(warehouseActiveTab) && (
                  <InventoryReportsView
                    inventory={warehouseData.inventory || []}
                    warehouses={warehouseData.warehouses || []}
                    activeSubTab={warehouseActiveTab}
                    onSelectTab={setWarehouseActiveTab}
                  />
                )}

                {['notifications', 'low-stock-alerts', 'pending-dispatch-alerts'].includes(warehouseActiveTab) && (
                  <WarehouseNotificationsView
                    alerts={warehouseData.alerts || []}
                    activeSubTab={warehouseActiveTab}
                    onSelectTab={setWarehouseActiveTab}
                  />
                )}

                {['profile', 'personal-profile', 'change-password'].includes(warehouseActiveTab) && (
                  <WarehouseProfileView
                    user={currentUser}
                    activeSubTab={warehouseActiveTab}
                    onSelectTab={setWarehouseActiveTab}
                    onLogout={handleLogout}
                  />
                )}
              </ErrorBoundary>
            </main>
          </div>

          {/* Warehouse Modals */}
          <WarehouseModals.AddInventoryModal
            isOpen={isAddInventoryOpen}
            onClose={() => setIsAddInventoryOpen(false)}
            onSubmit={handleAddInventory}
            warehouses={warehouseData.warehouses || []}
          />

          <WarehouseModals.StockInModal
            isOpen={isStockInOpen}
            onClose={() => setIsStockInOpen(false)}
            onSubmit={handleRecordStockIn}
            inventory={warehouseData.inventory || []}
          />

          <WarehouseModals.StockOutModal
            isOpen={isStockOutOpen}
            onClose={() => setIsStockOutOpen(false)}
            onSubmit={handleRecordStockOut}
            inventory={warehouseData.inventory || []}
          />

          <WarehouseModals.ReceiveShipmentModal
            isOpen={isReceiveShipmentOpen}
            onClose={() => setIsReceiveShipmentOpen(false)}
            onConfirm={handleConfirmReceiving}
            incomingGoods={warehouseData.incomingGoods || []}
          />

          <WarehouseModals.CreateDispatchModal
            isOpen={isCreateDispatchOpen}
            onClose={() => setIsCreateDispatchOpen(false)}
            onSubmit={handleCreateDispatch}
          />

          <WarehouseModals.TransferStockModal
            isOpen={isTransferStockOpen}
            onClose={() => setIsTransferStockOpen(false)}
            onSubmit={handleTransferStock}
            warehouses={warehouseData.warehouses || []}
            inventory={warehouseData.inventory || []}
          />

          <WarehouseModals.ReportDamagedModal
            isOpen={isReportDamagedOpen}
            onClose={() => setIsReportDamagedOpen(false)}
            onSubmit={handleReportDamagedGoods}
            inventory={warehouseData.inventory || []}
          />

          <WarehouseModals.AddWarehouseModal
            isOpen={isAddWarehouseOpen}
            onClose={() => setIsAddWarehouseOpen(false)}
            onSubmit={handleAddWarehouse}
          />

          {/* Toast Feedback Notification Banner */}
          {toastMessage && (
            <div className="toast-banner">
              <CheckCircle size={18} color="#16A36A" />
              <span>{toastMessage}</span>
            </div>
          )}
        </div>
      </ErrorBoundary>
    );
  }

  // =========================================================================
  // 2.5 RENDER LOGISTICS MANAGER PORTAL
  // =========================================================================
  if (portal === 'logistics') {
    return (
      <ErrorBoundary>
        <div className="app-container logistics-portal-theme">
          {/* Left Sidebar Navigation (Logistics Manager) */}
          <LogisticsSidebar
            activeTab={logisticsActiveTab}
            onSelectTab={setLogisticsActiveTab}
            user={currentUser}
            onLogout={handleLogout}
            metrics={logisticsData.metrics}
            onSwitchPortal={(p) => setPortal(p)}
          />

          {/* Main Content Wrapper */}
          <div className="main-wrapper">
            {/* Top Navigation Bar (Logistics Manager) */}
            <LogisticsHeader
              activeTabTitle={logisticsPageTitle}
              user={currentUser}
              alerts={logisticsData.alerts || []}
              notifications={logisticsData.notifications || []}
              onSelectTab={setLogisticsActiveTab}
              onLogout={handleLogout}
              onSwitchPortal={(p) => setPortal(p)}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />

            {/* Dynamic Logistics Page Views */}
            <main className="dashboard-content">
              <ErrorBoundary>
                {logisticsActiveTab === 'dashboard' && (
                  <LogisticsDashboard
                    data={logisticsData}
                    onSelectTab={setLogisticsActiveTab}
                    onOpenCreateOrder={() => setIsLogisticsCreateOrderOpen(true)}
                    onOpenCreateShipment={() => setIsLogisticsCreateShipmentOpen(true)}
                    onOpenCreateTrip={() => setIsLogisticsCreateTripOpen(true)}
                    onOpenAssignModal={() => setIsLogisticsAssignOpen(true)}
                    onOpenPodModal={(del) => {
                      setSelectedPodDelivery(del);
                      setIsLogisticsPodOpen(true);
                    }}
                  />
                )}

                {['orders', 'all-orders', 'create-order', 'pending-orders', 'approved-orders', 'cancelled-orders'].includes(logisticsActiveTab) && (
                  <LogisticsOrderManagementView
                    orders={logisticsData.orders || []}
                    activeSubTab={logisticsActiveTab}
                    onSelectTab={setLogisticsActiveTab}
                    onOpenCreateOrder={() => setIsLogisticsCreateOrderOpen(true)}
                    onOpenCreateShipment={() => setIsLogisticsCreateShipmentOpen(true)}
                    onOpenAssignModal={() => setIsLogisticsAssignOpen(true)}
                  />
                )}

                {['shipments', 'all-shipments', 'shipments-processing', 'shipments-in-transit', 'shipments-delivered'].includes(logisticsActiveTab) && (
                  <LogisticsShipmentManagementView
                    shipments={logisticsData.shipments || []}
                    activeSubTab={logisticsActiveTab}
                    onSelectTab={setLogisticsActiveTab}
                    onOpenCreateShipment={() => setIsLogisticsCreateShipmentOpen(true)}
                  />
                )}

                {['trips', 'all-trips', 'create-trip', 'active-trips', 'completed-trips'].includes(logisticsActiveTab) && (
                  <LogisticsTripManagementView
                    trips={logisticsData.trips || []}
                    activeSubTab={logisticsActiveTab}
                    onSelectTab={setLogisticsActiveTab}
                    onOpenCreateTrip={() => setIsLogisticsCreateTripOpen(true)}
                  />
                )}

                {['vehicles', 'available-vehicles', 'assign-vehicles', 'drivers', 'available-drivers', 'assign-drivers', 'vehicle-assignment', 'driver-assignment'].includes(logisticsActiveTab) && (
                  <LogisticsVehicleAssignmentView
                    vehicles={logisticsData.vehicles || []}
                    drivers={logisticsData.drivers || []}
                    activeSubTab={logisticsActiveTab}
                    onSelectTab={setLogisticsActiveTab}
                    onOpenAssignModal={() => setIsLogisticsAssignOpen(true)}
                  />
                )}

                {['routes', 'create-route', 'route-planning', 'route-optimization', 'route-management'].includes(logisticsActiveTab) && (
                  <LogisticsRouteManagementView
                    routes={logisticsData.routes || []}
                  />
                )}

                {['gps', 'live-tracking', 'trip-tracking', 'gps-tracking'].includes(logisticsActiveTab) && (
                  <LogisticsGpsTrackingView
                    trips={logisticsData.trips || []}
                  />
                )}

                {['pickups', 'pickup-schedule', 'pickup-confirmation', 'deliveries', 'delivery-schedule', 'delivery-status', 'proof-of-delivery', 'pickup-management', 'delivery-management'].includes(logisticsActiveTab) && (
                  <LogisticsPickupDeliveryView
                    pickups={logisticsData.pickups || []}
                    deliveries={logisticsData.deliveries || []}
                    activeSubTab={logisticsActiveTab}
                    onSelectTab={setLogisticsActiveTab}
                    onOpenPodModal={(del) => {
                      setSelectedPodDelivery(del);
                      setIsLogisticsPodOpen(true);
                    }}
                  />
                )}

                {['customer-orders', 'customer-requests', 'order-history'].includes(logisticsActiveTab) && (
                  <LogisticsCustomerOrdersView
                    customerRequests={logisticsData.customerRequests || []}
                  />
                )}

                {['reports', 'order-reports', 'shipment-reports', 'trip-reports', 'logistics-reports'].includes(logisticsActiveTab) && (
                  <LogisticsReportsView
                    analytics={logisticsData.analytics || {}}
                  />
                )}

                {['notifications', 'delayed-orders', 'trip-alerts'].includes(logisticsActiveTab) && (
                  <LogisticsNotificationsView
                    notifications={logisticsData.notifications || []}
                    alerts={logisticsData.alerts || []}
                  />
                )}

                {['profile', 'profile-info', 'change-password', 'my-profile'].includes(logisticsActiveTab) && (
                  <LogisticsProfileView
                    manager={logisticsData.manager || currentUser}
                    onSignOut={handleLogout}
                  />
                )}
              </ErrorBoundary>
            </main>
          </div>

          {/* Logistics Modals */}
          <CreateOrderModal
            isOpen={isLogisticsCreateOrderOpen}
            onClose={() => setIsLogisticsCreateOrderOpen(false)}
            onSubmit={(ord) => {
              logisticsService.addOrder(ord);
              showToast(`Order created successfully for ${ord.customerName}!`);
            }}
          />

          <CreateShipmentModal
            isOpen={isLogisticsCreateShipmentOpen}
            onClose={() => setIsLogisticsCreateShipmentOpen(false)}
            onSubmit={(shp) => {
              logisticsService.createShipment(shp);
              showToast(`Shipment dispatched for Order #${shp.orderId}!`);
            }}
            vehicles={logisticsData.vehicles || []}
            drivers={logisticsData.drivers || []}
          />

          <CreateTripModal
            isOpen={isLogisticsCreateTripOpen}
            onClose={() => setIsLogisticsCreateTripOpen(false)}
            onSubmit={(trip) => {
              logisticsService.createTrip(trip);
              showToast(`Trip dispatched on ${trip.route}!`);
            }}
            vehicles={logisticsData.vehicles || []}
            drivers={logisticsData.drivers || []}
          />

          <AssignResourcesModal
            isOpen={isLogisticsAssignOpen}
            onClose={() => setIsLogisticsAssignOpen(false)}
            onSubmit={({ vehicleReg, driverId, tripRoute }) => {
              logisticsService.assignVehicleAndDriver(vehicleReg, driverId, tripRoute);
              showToast(`Allocated Rig ${vehicleReg} with Pilot for route ${tripRoute}!`);
            }}
            vehicles={logisticsData.vehicles || []}
            drivers={logisticsData.drivers || []}
          />

          <ProofOfDeliveryModal
            isOpen={isLogisticsPodOpen}
            onClose={() => {
              setIsLogisticsPodOpen(false);
              setSelectedPodDelivery(null);
            }}
            delivery={selectedPodDelivery}
            onConfirm={(delId, recipientName) => {
              logisticsService.confirmDelivery(delId, recipientName);
              showToast(`ePOD archived successfully with signature of ${recipientName}!`);
            }}
          />

          {/* Toast Feedback Notification Banner */}
          {toastMessage && (
            <div className="toast-banner">
              <CheckCircle size={18} color="#16A36A" />
              <span>{toastMessage}</span>
            </div>
          )}
        </div>
      </ErrorBoundary>
    );
  }

  // =========================================================================
  // 3. RENDER DRIVER PORTAL
  // =========================================================================
  if (portal === 'driver') {
    return (
      <ErrorBoundary>
        <div className="app-container driver-portal-theme">
          {/* Left Sidebar Navigation (Driver) */}
          <DriverSidebar
            activeTab={driverActiveTab}
            onSelectTab={setDriverActiveTab}
            driver={driverPortalData.driver}
            onLogout={handleLogout}
            onSwitchToManager={() => {
              setPortal('manager');
              setActiveTab('dashboard');
            }}
            onSwitchPortal={(p) => setPortal(p)}
          />

        {/* Main Content Wrapper */}
        <div className="main-wrapper">
          {/* Quick Portal Switcher Banner */}
          <div style={{
            backgroundColor: '#0F172A',
            color: '#E2E8F0',
            padding: '10px 24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '13px',
            borderBottom: '1px solid #334155',
            zIndex: 10
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: '#94A3B8' }}>Viewing Mode:</span>
              <strong style={{ color: '#10B981' }}>Driver Portal</strong>
              <span style={{ color: '#94A3B8' }}>(Marcus Vance - Commercial CDL Pilot)</span>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => {
                  setPortal('admin');
                  setActiveTab('dashboard');
                }}
                style={{
                  backgroundColor: '#FF7A1A',
                  color: '#FFFFFF',
                  border: 'none',
                  padding: '6px 14px',
                  borderRadius: '6px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  fontSize: '12px'
                }}
              >
                👑 Open Admin Dashboard
              </button>
              <button
                onClick={() => {
                  setPortal('manager');
                  setActiveTab('dashboard');
                }}
                style={{
                  backgroundColor: '#00a3ff',
                  color: '#FFFFFF',
                  border: 'none',
                  padding: '6px 14px',
                  borderRadius: '6px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  fontSize: '12px'
                }}
              >
                🚚 Open Fleet Manager
              </button>
            </div>
          </div>
          {/* Top Navigation Bar (Driver) */}
          <DriverHeader
            activeTabTitle={driverPageTitle}
            driver={driverPortalData.driver}
            activeTrip={driverPortalData.activeTrip}
            notifications={driverPortalData.driverNotifications}
            onSelectTab={setDriverActiveTab}
            onLogout={handleLogout}
            onSwitchToManager={() => setPortal('manager')}
            onSwitchPortal={(p) => setPortal(p)}
          />

          {/* Dynamic Driver Page Views */}
          <main className="dashboard-content">
            {driverActiveTab === 'dashboard' && (
              <DriverDashboard
                driverData={driverPortalData}
                onAdvanceStage={handleAdvanceDriverStage}
                onConfirmPickup={handleConfirmPickup}
                onConfirmDelivery={handleConfirmDelivery}
                onCancelTrip={handleCancelDriverTrip}
                onToggleGpsSharing={handleToggleGpsSharing}
                onOpenFuelModal={() => setIsDriverFuelOpen(true)}
                onOpenIssueModal={() => setIsDriverIssueOpen(true)}
                onOpenPodModal={() => setIsDriverPodOpen(true)}
                onOpenContactModal={() => setIsDriverContactOpen(true)}
                onSelectTab={setDriverActiveTab}
              />
            )}

            {driverActiveTab === 'my-trips' && (
              <MyTripsView
                trips={driverPortalData.trips}
                onSelectTrip={() => setDriverActiveTab('active-trip')}
              />
            )}

            {driverActiveTab === 'active-trip' && (
              <ActiveTripView
                activeTrip={driverPortalData.activeTrip}
                onAdvanceStage={handleAdvanceDriverStage}
                onOpenPodModal={() => setIsDriverPodOpen(true)}
                onOpenIssueModal={() => setIsDriverIssueOpen(true)}
                onToggleGps={() => handleToggleGpsSharing(driverPortalData.activeTrip.id)}
              />
            )}

            {driverActiveTab === 'trip-history' && (
              <TripHistoryView trips={driverPortalData.trips} />
            )}

            {driverActiveTab === 'my-vehicle' && (
              <MyVehicleView
                vehicle={driverPortalData.vehicle}
                onReportIssue={() => setIsDriverIssueOpen(true)}
              />
            )}

            {driverActiveTab === 'route-nav' && (
              <RouteNavView
                activeTrip={driverPortalData.activeTrip}
                onToggleGps={() => handleToggleGpsSharing(driverPortalData.activeTrip.id)}
              />
            )}

            {driverActiveTab === 'pickup' && (
              <PickupManagementView
                pickup={driverPortalData.activeTrip?.pickup}
                onConfirmPickup={(notes) => handleConfirmPickup(driverPortalData.activeTrip.id, notes)}
              />
            )}

            {driverActiveTab === 'delivery' && (
              <DeliveryManagementView
                delivery={driverPortalData.activeTrip?.delivery}
                onConfirmDelivery={(recipient, podPhoto) => handleConfirmDelivery(driverPortalData.activeTrip.id, recipient, podPhoto)}
              />
            )}

            {driverActiveTab === 'shipment' && (
              <ShipmentDetailsView
                activeTrip={driverPortalData.activeTrip}
                onOpenPodModal={() => setIsDriverPodOpen(true)}
              />
            )}

            {driverActiveTab === 'fuel' && (
              <DriverFuelRecordsView
                fuelLogs={driverPortalData.fuelLogs}
                onAddFuel={() => setIsDriverFuelOpen(true)}
              />
            )}

            {driverActiveTab === 'inspection' && (
              <DriverInspectionView
                vehicle={driverPortalData.vehicle}
                onReportIssue={() => setIsDriverIssueOpen(true)}
              />
            )}

            {driverActiveTab === 'documents' && (
              <DriverDocumentsView
                documents={driverPortalData.documents}
                driver={driverPortalData.driver}
                vehicle={driverPortalData.vehicle}
              />
            )}

            {driverActiveTab === 'notifications' && (
              <DriverNotificationsView
                notifications={driverPortalData.driverNotifications}
              />
            )}

            {driverActiveTab === 'profile' && (
              <DriverProfileView
                driver={driverPortalData.driver}
                metrics={driverPortalData.metrics}
              />
            )}
          </main>
        </div>

        {/* Driver Modals */}
        <DriverModals.FuelModal
          isOpen={isDriverFuelOpen}
          onClose={() => setIsDriverFuelOpen(false)}
          onSubmit={handleAddDriverFuel}
          vehicleReg={driverPortalData.vehicle?.regNumber}
        />

        <DriverModals.ReportIssueModal
          isOpen={isDriverIssueOpen}
          onClose={() => setIsDriverIssueOpen(false)}
          onSubmit={handleReportDriverIssue}
          vehicleReg={driverPortalData.vehicle?.regNumber}
        />

        <DriverModals.PodModal
          isOpen={isDriverPodOpen}
          onClose={() => setIsDriverPodOpen(false)}
          onSubmit={(sigName) => handleConfirmDelivery(driverPortalData.activeTrip?.id, sigName, true)}
        />

        <DriverModals.ContactModal
          isOpen={isDriverContactOpen}
          onClose={() => setIsDriverContactOpen(false)}
        />

        {/* Toast Feedback Notification Banner */}
        {toastMessage && (
          <div className="toast-banner">
            <CheckCircle size={18} color="#16A36A" />
            <span>{toastMessage}</span>
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
}

  // =========================================================================
  // 4. RENDER FLEET OPERATIONS MANAGER PORTAL
  // =========================================================================
  return (
    <ErrorBoundary>
      <div className="app-container">
        {/* Left Sidebar Navigation (Fleet Manager) */}
        <Sidebar
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          metrics={summaryMetrics}
          unreadNotificationsCount={unreadNotifsCount}
          onLogout={handleLogout}
          onSwitchToDriver={() => setPortal('driver')}
          onSwitchToWarehouse={() => {
            setPortal('warehouse');
            setWarehouseActiveTab('dashboard');
          }}
          onSwitchPortal={(p) => setPortal(p)}
        />

      {/* Main Content Wrapper */}
      <div className="main-wrapper">
        {/* Quick Portal Switcher Banner */}
        <div style={{
          backgroundColor: '#0d121f',
          color: '#E2E8F0',
          padding: '10px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '13px',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          zIndex: 10
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: '#94A3B8' }}>Viewing Mode:</span>
            <strong style={{ color: '#00d2ff' }}>Fleet Operations Manager Portal</strong>
            <span style={{ color: '#94A3B8' }}>(16 Logistics Modules & 3D Cruising Telemetry)</span>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={() => {
                setPortal('admin');
                setActiveTab('dashboard');
              }}
              style={{
                backgroundColor: '#FF7A1A',
                color: '#FFFFFF',
                border: 'none',
                padding: '6px 14px',
                borderRadius: '6px',
                fontWeight: '700',
                cursor: 'pointer',
                fontSize: '12px'
              }}
            >
              👑 Open Admin Dashboard
            </button>
            <button
              onClick={() => {
                setPortal('driver');
                setDriverActiveTab('dashboard');
              }}
              style={{
                backgroundColor: '#10b981',
                color: '#FFFFFF',
                border: 'none',
                padding: '6px 14px',
                borderRadius: '6px',
                fontWeight: '700',
                cursor: 'pointer',
                fontSize: '12px'
              }}
            >
              🧑‍✈️ Open Driver Portal
            </button>
            <button
              onClick={() => {
                setPortal('warehouse');
                setWarehouseActiveTab('dashboard');
              }}
              style={{
                backgroundColor: '#8b5cf6',
                color: '#FFFFFF',
                border: 'none',
                padding: '6px 14px',
                borderRadius: '6px',
                fontWeight: '700',
                cursor: 'pointer',
                fontSize: '12px'
              }}
            >
              🏭 Open Warehouse OS
            </button>
          </div>
        </div>
        {/* Top Navigation Bar (Fleet Manager) */}
        <Header
          pageTitle={managerPageTitle}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          notifications={notifications}
          onMarkNotificationRead={handleMarkNotificationRead}
          onMarkAllNotificationsRead={handleMarkAllNotificationsRead}
          onSelectTab={setActiveTab}
          onLogout={handleLogout}
          onSwitchToDriver={() => setPortal('driver')}
          onSwitchPortal={(p) => setPortal(p)}
          currentUser={currentUser}
        />

        {/* Dynamic Page Views */}
        <main className="dashboard-content">
          {/* Main Fleet Manager Dashboard */}
          {activeTab === 'dashboard' && (
            <>
              {/* Hero Banner */}
              <HeroBanner />

              {/* Quick Actions Section */}
              <QuickActions
                onAddVehicle={() => setIsAddVehicleOpen(true)}
                onAssignVehicle={() => setIsAssignVehicleOpen(true)}
                onAddFuelRecord={() => setIsAddFuelOpen(true)}
                onScheduleMaintenance={() => setIsScheduleMaintOpen(true)}
                onRecordInspection={() => setIsRecordInspectionOpen(true)}
                onViewLiveTracking={() => setActiveTab('tracking')}
              />

              {/* Summary Cards */}
              <SummaryCards
                metrics={summaryMetrics}
                onCardClick={(targetTab) => {
                  if (targetTab) setActiveTab(targetTab);
                }}
              />

              {/* Two Column Grid: Vehicle Status Overview + Fleet Utilization Analytics */}
              <div className="dashboard-grid-2col">
                <VehicleStatusOverview
                  overview={statusOverview}
                  onStatusFilter={() => {
                    setActiveTab('vehicles');
                  }}
                />
                <FleetUtilizationAnalytics analytics={analytics} />
              </div>

              {/* Live Fleet Tracking Interactive Map Section */}
              <div id="live-tracking-section">
                <LiveFleetTracking
                  gpsData={gpsData}
                  onSimulateTick={handleSimulateTick}
                />
              </div>

              {/* Two Column Grid: Fuel Management Overview + Maintenance Overview */}
              <div className="dashboard-grid-2col">
                <FuelManagementOverview
                  fuelStats={fuelStats}
                  onOpenFuelModal={() => setIsAddFuelOpen(true)}
                />
                <MaintenanceOverview
                  maintenanceData={maintenanceData}
                  onOpenScheduleModal={() => setIsScheduleMaintOpen(true)}
                />
              </div>

              {/* Vehicle & Driver Assignment Section */}
              <VehicleDriverAssignment
                assignments={assignments}
                vehicles={fleetState.vehicles}
                drivers={fleetState.drivers}
                onOpenAssignModal={() => setIsAssignVehicleOpen(true)}
              />

              {/* Charts & Reports Section */}
              <ChartsAndReports
                analytics={analytics}
                vehicles={fleetState.vehicles}
                fuelStats={fuelStats}
                maintenanceData={maintenanceData}
              />
            </>
          )}

          {/* Dedicated Sub-views */}
          {activeTab === 'vehicles' && (
            <VehicleManagementView
              vehicles={fleetState.vehicles}
              onAddVehicle={() => setIsAddVehicleOpen(true)}
            />
          )}

          {activeTab === 'categories' && (
            <VehicleCategoriesView vehicles={fleetState.vehicles} />
          )}

          {activeTab === 'allocation' && (
            <VehicleAllocationView
              vehicles={fleetState.vehicles}
              assignments={assignments}
              onAssignVehicle={() => setIsAssignVehicleOpen(true)}
            />
          )}

          {activeTab === 'availability' && (
            <VehicleAvailabilityView
              vehicles={fleetState.vehicles}
              onAssignVehicle={() => setIsAssignVehicleOpen(true)}
            />
          )}

          {activeTab === 'documents' && (
            <VehicleDocumentsView maintenanceData={maintenanceData} />
          )}

          {activeTab === 'tracking' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <LiveFleetTracking
                gpsData={gpsData}
                onSimulateTick={handleSimulateTick}
              />
            </div>
          )}

          {activeTab === 'fuel' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <FuelManagementOverview
                fuelStats={fuelStats}
                onOpenFuelModal={() => setIsAddFuelOpen(true)}
              />
            </div>
          )}

          {activeTab === 'maintenance' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <MaintenanceOverview
                maintenanceData={maintenanceData}
                onOpenScheduleModal={() => setIsScheduleMaintOpen(true)}
              />
            </div>
          )}

          {activeTab === 'driver-assignment' && (
            <DriverAssignmentView
              drivers={fleetState.drivers}
              onOpenAssignModal={() => setIsAssignVehicleOpen(true)}
            />
          )}

          {activeTab === 'inspection' && (
            <VehicleInspectionView
              inspections={inspections}
              onRecordInspection={() => setIsRecordInspectionOpen(true)}
            />
          )}

          {activeTab === 'reports' && (
            <FleetReportsView
              analytics={analytics}
              fuelStats={fuelStats}
              maintenanceData={maintenanceData}
            />
          )}

          {activeTab === 'notifications' && (
            <NotificationsView
              notifications={notifications}
              onMarkRead={handleMarkNotificationRead}
              onMarkAllRead={handleMarkAllNotificationsRead}
            />
          )}

          {activeTab === 'profile' && (
            <MyProfileView />
          )}
        </main>
      </div>

      {/* Modals for Quick Actions */}
      <AddVehicleModal
        isOpen={isAddVehicleOpen}
        onClose={() => setIsAddVehicleOpen(false)}
        onAddVehicle={handleAddVehicle}
      />

      <AssignVehicleModal
        isOpen={isAssignVehicleOpen}
        onClose={() => setIsAssignVehicleOpen(false)}
        vehicles={fleetState.vehicles}
        drivers={fleetState.drivers}
        onAssignVehicle={handleAssignVehicle}
      />

      <AddFuelRecordModal
        isOpen={isAddFuelOpen}
        onClose={() => setIsAddFuelOpen(false)}
        vehicles={fleetState.vehicles}
        onAddFuelRecord={handleAddFuelRecord}
      />

      <ScheduleMaintenanceModal
        isOpen={isScheduleMaintOpen}
        onClose={() => setIsScheduleMaintOpen(false)}
        vehicles={fleetState.vehicles}
        onScheduleMaintenance={handleScheduleMaintenance}
      />

      <RecordInspectionModal
        isOpen={isRecordInspectionOpen}
        onClose={() => setIsRecordInspectionOpen(false)}
        vehicles={fleetState.vehicles}
        onRecordInspection={handleRecordInspection}
      />

      {/* Toast Feedback Notification Banner */}
      {toastMessage && (
        <div className="toast-banner">
          <CheckCircle size={18} color="#16A36A" />
          <span>{toastMessage}</span>
        </div>
      )}
      </div>
    </ErrorBoundary>
  );
}
