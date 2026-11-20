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

// Modals
import { AddVehicleModal } from './components/modals/AddVehicleModal';
import { AssignVehicleModal } from './components/modals/AssignVehicleModal';
import { AddFuelRecordModal } from './components/modals/AddFuelRecordModal';
import { ScheduleMaintenanceModal } from './components/modals/ScheduleMaintenanceModal';
import { RecordInspectionModal } from './components/modals/RecordInspectionModal';

// Dedicated Sub-Views for Navigation Menu
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
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  const handleLoginSuccess = (userData) => {
    setCurrentUser(userData);
    setIsAuthenticated(true);
    showToast(`Welcome back, ${userData.fullName || 'Fleet Manager'}!`);
  };

  const handleLogout = () => {
    localStorage.removeItem('ttc_auth_token');
    localStorage.removeItem('ttc_fleet360_user');
    sessionStorage.removeItem('ttc_fleet360_user');
    setIsAuthenticated(false);
    showToast('Signed out of TTC Fleet360 successfully.');
  };

  // Fleet state
  const [fleetState, setFleetState] = useState(() => fleetService.loadData());

  // Modal open states
  const [isAddVehicleOpen, setIsAddVehicleOpen] = useState(false);
  const [isAssignVehicleOpen, setIsAssignVehicleOpen] = useState(false);
  const [isAddFuelOpen, setIsAddFuelOpen] = useState(false);
  const [isScheduleMaintOpen, setIsScheduleMaintOpen] = useState(false);
  const [isRecordInspectionOpen, setIsRecordInspectionOpen] = useState(false);

  // Subscribe to changes in fleetService
  useEffect(() => {
    const unsubscribe = fleetService.subscribe((updatedData) => {
      setFleetState({ ...updatedData });
    });
    return unsubscribe;
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage('');
    }, 4000);
  };

  // Actions
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

  // Page title mapping
  const activeNavItem = navigationItems.find(item => item.id === activeTab);
  const pageTitle = activeTab === 'dashboard' ? 'Fleet Manager Dashboard' : `${activeNavItem?.label || 'Fleet Manager'} - Fleet360`;

  // If not authenticated or login tab selected, render the dedicated LoginPage
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

  return (
    <div className="app-container">
      {/* 11. Left Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        metrics={summaryMetrics}
        unreadNotificationsCount={unreadNotifsCount}
        onLogout={handleLogout}
      />

      {/* Main Content Wrapper */}
      <div className="main-wrapper">
        {/* 1. Top Navigation Bar */}
        <Header
          pageTitle={pageTitle}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          notifications={notifications}
          onMarkNotificationRead={handleMarkNotificationRead}
          onMarkAllNotificationsRead={handleMarkAllNotificationsRead}
          onSelectTab={setActiveTab}
          onLogout={handleLogout}
        />

        {/* Dynamic Page Views */}
        <main className="dashboard-content">
          {/* Main Fleet Manager Dashboard */}
          {activeTab === 'dashboard' && (
            <>
              {/* 5. Hero Banner matching reference screenshot */}
              <HeroBanner />

              {/* 6. Quick Actions Section */}
              <QuickActions
                onAddVehicle={() => setIsAddVehicleOpen(true)}
                onAssignVehicle={() => setIsAssignVehicleOpen(true)}
                onAddFuelRecord={() => setIsAddFuelOpen(true)}
                onScheduleMaintenance={() => setIsScheduleMaintOpen(true)}
                onRecordInspection={() => setIsRecordInspectionOpen(true)}
                onViewLiveTracking={() => setActiveTab('tracking')}
              />

              {/* 2. Summary Cards (8 cards required) */}
              <SummaryCards
                metrics={summaryMetrics}
                onCardClick={(targetTab) => {
                  if (targetTab) setActiveTab(targetTab);
                }}
              />

              {/* Two Column Grid: Vehicle Status Overview + Fleet Utilization Analytics */}
              <div className="dashboard-grid-2col">
                {/* 3. Vehicle Status Overview */}
                <VehicleStatusOverview
                  overview={statusOverview}
                  onStatusFilter={(statusKey) => {
                    setActiveTab('vehicles');
                  }}
                />

                {/* 4. Fleet Utilization Analytics */}
                <FleetUtilizationAnalytics analytics={analytics} />
              </div>

              {/* 5. Live Fleet Tracking Interactive Map Section */}
              <div id="live-tracking-section">
                <LiveFleetTracking
                  gpsData={gpsData}
                  onSimulateTick={handleSimulateTick}
                />
              </div>

              {/* Two Column Grid: Fuel Management Overview + Maintenance Overview */}
              <div className="dashboard-grid-2col">
                {/* 6. Fuel Management Overview */}
                <FuelManagementOverview
                  fuelStats={fuelStats}
                  onOpenFuelModal={() => setIsAddFuelOpen(true)}
                />

                {/* 7. Maintenance Overview */}
                <MaintenanceOverview
                  maintenanceData={maintenanceData}
                  onOpenScheduleModal={() => setIsScheduleMaintOpen(true)}
                />
              </div>

              {/* 8. Vehicle & Driver Assignment Section */}
              <VehicleDriverAssignment
                assignments={assignments}
                vehicles={fleetState.vehicles}
                drivers={fleetState.drivers}
                onOpenAssignModal={() => setIsAssignVehicleOpen(true)}
              />

              {/* 9. Charts & Reports Section */}
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
          <CheckCircle size={18} color="#10b981" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
