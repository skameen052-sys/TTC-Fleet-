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
import { CheckCircle, AlertCircle } from 'lucide-react';

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

  // Portal State: 'manager' vs 'driver'
  const [portal, setPortal] = useState(() => {
    try {
      const u = localStorage.getItem('ttc_fleet360_user') || sessionStorage.getItem('ttc_fleet360_user');
      const parsed = u ? JSON.parse(u) : null;
      if (parsed?.role === 'ROLE_DRIVER') return 'driver';
    } catch {}
    return 'manager';
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
        <LoginPage onLoginSuccess={handleLoginSuccess} />
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
    return (
      <div className="app-container driver-portal-theme">
        {/* Left Sidebar Navigation (Driver) */}
        <DriverSidebar
          activeTab={driverActiveTab}
          onSelectTab={setDriverActiveTab}
          driver={driverPortalData.driver}
          onLogout={handleLogout}
          onSwitchToManager={() => setPortal('manager')}
        />

        {/* Main Content Wrapper */}
        <div className="main-wrapper">
          {/* Top Navigation Bar (Driver) */}
          <DriverHeader
            activeTabTitle={driverPageTitle}
            driver={driverPortalData.driver}
            activeTrip={driverPortalData.activeTrip}
            notifications={driverPortalData.driverNotifications}
            onSelectTab={setDriverActiveTab}
            onLogout={handleLogout}
            onSwitchToManager={() => setPortal('manager')}
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
