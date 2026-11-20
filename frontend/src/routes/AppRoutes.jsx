import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Login } from '../pages/Login';
import { Dashboard } from '../pages/Dashboard';
import { UserManagement } from '../pages/UserManagement';
import { RoleManagement } from '../pages/RoleManagement';
import { BranchManagement } from '../pages/BranchManagement';
import { CompanyProfile } from '../pages/CompanyProfile';
import { SubscriptionManagement } from '../pages/SubscriptionManagement';
import { Configuration } from '../pages/Configuration';
import { AuditLogs } from '../pages/AuditLogs';
import { Settings } from '../pages/Settings';

// 16 Logistics & Operations Modules
import { FleetManagement } from '../pages/FleetManagement';
import { DriverManagement } from '../pages/DriverManagement';
import { CustomerManagement } from '../pages/CustomerManagement';
import { OrderManagement } from '../pages/OrderManagement';
import { ShipmentManagement } from '../pages/ShipmentManagement';
import { TripManagement } from '../pages/TripManagement';
import { GpsTracking } from '../pages/GpsTracking';
import { RouteManagement } from '../pages/RouteManagement';
import { FuelManagement } from '../pages/FuelManagement';
import { MaintenanceManagement } from '../pages/MaintenanceManagement';
import { WarehouseManagement } from '../pages/WarehouseManagement';
import { BillingInvoices } from '../pages/BillingInvoices';
import { PaymentManagement } from '../pages/PaymentManagement';
import { ReportsAnalytics } from '../pages/ReportsAnalytics';
import { NotificationsPage } from '../pages/NotificationsPage';
import { MyProfile } from '../pages/MyProfile';

import { DashboardLayout } from '../layouts/DashboardLayout';
import { ProtectedRoute } from './ProtectedRoute';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Login Route */}
      <Route path="/login" element={<Login />} />

      {/* Protected Dashboard and Modules */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />

        {/* Fleet & Assets */}
        <Route path="fleet" element={<FleetManagement />} />
        <Route path="drivers" element={<DriverManagement />} />
        <Route path="gps-tracking" element={<GpsTracking />} />
        <Route path="routes" element={<RouteManagement />} />
        <Route path="maintenance" element={<MaintenanceManagement />} />

        {/* Logistics & Trips */}
        <Route path="customers" element={<CustomerManagement />} />
        <Route path="orders" element={<OrderManagement />} />
        <Route path="shipments" element={<ShipmentManagement />} />
        <Route path="trips" element={<TripManagement />} />
        <Route path="warehouses" element={<WarehouseManagement />} />

        {/* Finance */}
        <Route path="fuel" element={<FuelManagement />} />
        <Route path="billing" element={<BillingInvoices />} />
        <Route path="payments" element={<PaymentManagement />} />

        {/* Intelligence, Security & System */}
        <Route path="reports" element={<ReportsAnalytics />} />
        <Route path="notifications" element={<NotificationsPage />} />
        <Route path="users" element={<UserManagement />} />
        <Route path="roles" element={<RoleManagement />} />
        <Route path="branches" element={<BranchManagement />} />
        <Route path="company" element={<CompanyProfile />} />
        <Route path="subscriptions" element={<SubscriptionManagement />} />
        <Route path="configuration" element={<Configuration />} />
        <Route path="audit-logs" element={<AuditLogs />} />
        <Route path="settings" element={<Settings />} />
        <Route path="profile" element={<MyProfile />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};
