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
        <Route path="users" element={<UserManagement />} />
        <Route path="roles" element={<RoleManagement />} />
        <Route path="branches" element={<BranchManagement />} />
        <Route path="company" element={<CompanyProfile />} />
        <Route path="subscriptions" element={<SubscriptionManagement />} />
        <Route path="configuration" element={<Configuration />} />
        <Route path="audit-logs" element={<AuditLogs />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};
