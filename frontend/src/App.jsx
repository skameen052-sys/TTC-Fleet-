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

import { fleetService } from './services/fleetService';
import { CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';

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
          backgroundColor: '#F4F7FC',
          fontFamily: 'Inter, system-ui, sans-serif',
          padding: 24,
          color: '#14213D'
        }}>
          <div style={{
            maxWidth: 520,
            width: '100%',
            backgroundColor: '#FFFFFF',
            borderRadius: 16,
            padding: 36,
            boxShadow: '0 20px 40px rgba(20, 33, 61, 0.08)',
            border: '1px solid #E5EAF2',
            textAlign: 'center'
          }}>
            <div style={{
              width: 54,
              height: 54,
              borderRadius: '50%',
              backgroundColor: '#FFF0E5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 18px auto'
            }}>
              <AlertCircle size={32} color="#FF7A1A" />
            </div>
            <h2 style={{ fontSize: 22, fontWeight: 700, margin: '0 0 8px 0', color: '#14213D' }}>
              Portal Display Notice
            </h2>
            <p style={{ fontSize: 14, color: '#718096', lineHeight: 1.6, margin: '0 0 24px 0' }}>
              The portal encountered an unexpected display state. Click below to refresh your session and load fresh fleet telemetry.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <button
                onClick={() => this.setState({ hasError: false })}
                style={{
                  padding: '10px 20px',
                  borderRadius: 8,
                  border: '1px solid #E5EAF2',
                  backgroundColor: '#FFFFFF',
                  color: '#14213D',
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
      return u ? JSON.parse(u) : { fullName: 'Alexandre Mercer', role: 'ROLE_FLEET_MANAGER', email: 'alex.mercer@fleet360.ttc.com' };
    } catch {
      return { fullName: 'Alexandre Mercer', role: 'ROLE_FLEET_MANAGER', email: 'alex.mercer@fleet360.ttc.com' };
    }
  });

  // Portal State: 'manager' (Fleet Manager Portal) vs 'driver' (Driver Portal)
  const [portal, setPortal] = useState(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.get('portal') === 'driver') return 'driver';
      if (params.get('portal') === 'manager') return 'manager';

      const u = localStorage.getItem('ttc_fleet360_user') || sessionStorage.getItem('ttc_fleet360_user');
      const parsed = u ? JSON.parse(u) : null;
      if (parsed?.role === 'ROLE_DRIVER') {
        return 'driver';
      }
    } catch {}
    return 'manager'; // Default to Fleet Manager Portal
  });

  const [activeTab, setActiveTab] = useState('dashboard');
  const [driverActiveTab, setDriverActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  // Fleet state & Driver state
  const [fleetState, setFleetState] = useState(() => fleetService.loadData());
  const [driverPortalData, setDriverPortalData] = useState(() => fleetService.getDriverPortalData());

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

  // Subscribe to changes in fleetService
  useEffect(() => {
    const unsubscribe = fleetService.subscribe((updatedData) => {
      setFleetState({ ...updatedData });
      setDriverPortalData(fleetService.getDriverPortalData());
    });
    return unsubscribe;
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
    if (userData.role === 'ROLE_DRIVER') {
      setPortal('driver');
      setDriverActiveTab('dashboard');
    } else {
      setPortal('manager');
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

  // Page title mapping for Manager
  const activeNavItem = navigationItems.find(item => item.id === activeTab);
  const managerPageTitle = activeTab === 'dashboard' ? 'Fleet Manager Dashboard' : `${activeNavItem?.label || 'Fleet Manager'} - Fleet360`;

  // Page title mapping for Driver
  const activeDriverNavItem = driverNavItems.find(item => item.id === driverActiveTab);
  const driverPageTitle = driverActiveTab === 'dashboard' ? 'Driver Dashboard' : `${activeDriverNavItem?.label || 'Driver Portal'} - Fleet360`;

  // If not authenticated or login tab selected, render dedicated LoginPage
  if (!isAuthenticated || activeTab === 'login') {
    return (
      <>
        <LoginPage onLoginSuccess={handleLoginSuccess} initialPortal="manager" />
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
  // RENDER DRIVER PORTAL
  // =========================================================================
  if (portal === 'driver') {
    const safeDriverData = driverPortalData || fleetService.getDriverPortalData() || {};
    const safeDriver = safeDriverData.driver || { fullName: 'Marcus Vance', assignedVehicleReg: 'TTC-8492-HD' };
    const safeActiveTrip = safeDriverData.activeTrip || { id: 'TRIP-5082', route: { eta: '1h 45m', currentCoords: [41.6528, -83.5379] } };
    const safeVehicle = safeDriverData.vehicle || { regNumber: 'TTC-8492-HD', make: 'Freightliner', model: 'Cascadia' };
    const safeTrips = safeDriverData.trips || safeDriverData.driverTrips || [];
    const safeFuelLogs = safeDriverData.fuelLogs || [];
    const safeDocuments = safeDriverData.documents || [];
    const safeNotifications = safeDriverData.driverNotifications || [];
    const safeMetrics = safeDriverData.metrics || {};

    return (
      <ErrorBoundary>
        <div className="app-container driver-portal-theme">
          {/* Left Sidebar Navigation (Driver) */}
          <DriverSidebar
            activeTab={driverActiveTab}
            onSelectTab={setDriverActiveTab}
            driver={safeDriver}
            onLogout={handleLogout}
            onSwitchToManager={() => {
              setPortal('manager');
              setActiveTab('dashboard');
            }}
          />

          {/* Main Content Wrapper */}
          <div className="main-wrapper">
            {/* Top Navigation Bar (Driver) */}
            <DriverHeader
              activeTabTitle={driverPageTitle}
              driver={safeDriver}
              activeTrip={safeActiveTrip}
              notifications={safeNotifications}
              onSelectTab={setDriverActiveTab}
              onLogout={handleLogout}
              onSwitchToManager={() => {
                setPortal('manager');
                setActiveTab('dashboard');
              }}
            />

            {/* Dynamic Driver Page Views */}
            <main className="dashboard-content">
              <ErrorBoundary>
                {driverActiveTab === 'dashboard' && (
                  <DriverDashboard
                    driverData={{
                      ...safeDriverData,
                      driver: safeDriver,
                      activeTrip: safeActiveTrip,
                      vehicle: safeVehicle,
                      metrics: safeMetrics,
                      trips: safeTrips,
                      driverTrips: safeTrips,
                      fuelLogs: safeFuelLogs,
                      documents: safeDocuments,
                      driverNotifications: safeNotifications
                    }}
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
                    trips={safeTrips}
                    onSelectTrip={() => setDriverActiveTab('active-trip')}
                  />
                )}

                {driverActiveTab === 'active-trip' && (
                  <ActiveTripView
                    activeTrip={safeActiveTrip}
                    onAdvanceStage={handleAdvanceDriverStage}
                    onOpenPodModal={() => setIsDriverPodOpen(true)}
                    onOpenIssueModal={() => setIsDriverIssueOpen(true)}
                    onToggleGps={() => handleToggleGpsSharing(safeActiveTrip?.id || 'TRIP-5082')}
                  />
                )}

                {driverActiveTab === 'trip-history' && (
                  <TripHistoryView trips={safeTrips} />
                )}

                {driverActiveTab === 'my-vehicle' && (
                  <MyVehicleView
                    vehicle={safeVehicle}
                    onReportIssue={() => setIsDriverIssueOpen(true)}
                  />
                )}

                {driverActiveTab === 'route-nav' && (
                  <RouteNavView
                    activeTrip={safeActiveTrip}
                    onToggleGps={() => handleToggleGpsSharing(safeActiveTrip?.id || 'TRIP-5082')}
                  />
                )}

                {driverActiveTab === 'pickup' && (
                  <PickupManagementView
                    pickup={safeActiveTrip?.pickup}
                    onConfirmPickup={(notes) => handleConfirmPickup(safeActiveTrip?.id || 'TRIP-5082', notes)}
                  />
                )}

                {driverActiveTab === 'delivery' && (
                  <DeliveryManagementView
                    delivery={safeActiveTrip?.delivery}
                    onConfirmDelivery={(recipient, podPhoto) => handleConfirmDelivery(safeActiveTrip?.id || 'TRIP-5082', recipient, podPhoto)}
                  />
                )}

                {driverActiveTab === 'shipment' && (
                  <ShipmentDetailsView
                    activeTrip={safeActiveTrip}
                    onOpenPodModal={() => setIsDriverPodOpen(true)}
                  />
                )}

                {driverActiveTab === 'fuel' && (
                  <DriverFuelRecordsView
                    fuelLogs={safeFuelLogs}
                    onAddFuel={() => setIsDriverFuelOpen(true)}
                  />
                )}

                {driverActiveTab === 'inspection' && (
                  <DriverInspectionView
                    vehicle={safeVehicle}
                    onReportIssue={() => setIsDriverIssueOpen(true)}
                  />
                )}

                {driverActiveTab === 'documents' && (
                  <DriverDocumentsView
                    documents={safeDocuments}
                    driver={safeDriver}
                    vehicle={safeVehicle}
                  />
                )}

                {driverActiveTab === 'notifications' && (
                  <DriverNotificationsView
                    notifications={safeNotifications}
                  />
                )}

                {driverActiveTab === 'profile' && (
                  <DriverProfileView
                    driver={safeDriver}
                    metrics={safeMetrics}
                  />
                )}
              </ErrorBoundary>
            </main>
          </div>

          {/* Driver Modals */}
          <DriverModals.FuelModal
            isOpen={isDriverFuelOpen}
            onClose={() => setIsDriverFuelOpen(false)}
            onSubmit={handleAddDriverFuel}
            vehicleReg={safeVehicle?.regNumber}
          />

          <DriverModals.ReportIssueModal
            isOpen={isDriverIssueOpen}
            onClose={() => setIsDriverIssueOpen(false)}
            onSubmit={handleReportDriverIssue}
            vehicleReg={safeVehicle?.regNumber}
          />

          <DriverModals.PodModal
            isOpen={isDriverPodOpen}
            onClose={() => setIsDriverPodOpen(false)}
            onSubmit={(sigName) => handleConfirmDelivery(safeActiveTrip?.id, sigName, true)}
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
  // RENDER FLEET MANAGER PORTAL
  // =========================================================================
  return (
    <div className="app-container">
      {/* Left Sidebar Navigation (Fleet Manager) */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        metrics={summaryMetrics}
        unreadNotificationsCount={unreadNotifsCount}
        onLogout={handleLogout}
        onSwitchToDriver={() => setPortal('driver')}
      />

      {/* Main Content Wrapper */}
      <div className="main-wrapper">
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
  );
}
