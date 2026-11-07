import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { StoreProvider } from './context/StoreContext.jsx';

// Layouts
import AppLayout from './components/layout/AppLayout.jsx';
import SuperAdminLayout from './components/layout/SuperAdminLayout.jsx';

// Route Guards
import { ProtectedRoute, SuperAdminRoute, PublicRoute } from './components/auth/RouteGuards.jsx';

// Public Landing Page & Auth Pages
import LandingPage from './pages/landing/LandingPage.jsx';
import LoginPage from './pages/auth/LoginPage.jsx';
import RegisterPage from './pages/auth/RegisterPage.jsx';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage.jsx';

// 8 Shop Owner Dashboard Modules
import OverviewPage from './pages/dashboard/OverviewPage.jsx';
import InventoryPage from './pages/inventory/InventoryPage.jsx';
import POSBillingPage from './pages/sales/POSBillingPage.jsx';
import InvoicesPage from './pages/sales/InvoicesPage.jsx';
import CustomersPage from './pages/customers/CustomersPage.jsx';
import SuppliersPage from './pages/suppliers/SuppliersPage.jsx';
import AIAssistantPage from './pages/ai/AIAssistantPage.jsx';
import AnalyticsReportsPage from './pages/analytics/AnalyticsReportsPage.jsx';
import AdminSettingsPage from './pages/admin/AdminSettingsPage.jsx';

// Super Admin Control Plane Pages
import SuperAdminDashboardPage from './pages/superadmin/SuperAdminDashboardPage.jsx';
import SuperAdminShopsPage from './pages/superadmin/SuperAdminShopsPage.jsx';
import SuperAdminUsersPage from './pages/superadmin/SuperAdminUsersPage.jsx';
import SuperAdminSubscriptionsPage from './pages/superadmin/SuperAdminSubscriptionsPage.jsx';
import SuperAdminAnalyticsPage from './pages/superadmin/SuperAdminAnalyticsPage.jsx';
import SuperAdminActivityPage from './pages/superadmin/SuperAdminActivityPage.jsx';
import SuperAdminSettingsPage from './pages/superadmin/SuperAdminSettingsPage.jsx';

export default function App() {
  return (
    <StoreProvider>
      <BrowserRouter>
        <Routes>
          {/* Public SaaS Landing Page */}
          <Route path="/" element={<LandingPage />} />

          {/* Authentication Routes (PublicOnly) */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <RegisterPage />
              </PublicRoute>
            }
          />
          <Route
            path="/forgot-password"
            element={
              <PublicRoute>
                <ForgotPasswordPage />
              </PublicRoute>
            }
          />

          {/* Super Admin Control Plane Portal (Strict SuperAdminRoute Guard) */}
          <Route
            path="/super-admin"
            element={
              <SuperAdminRoute>
                <SuperAdminLayout />
              </SuperAdminRoute>
            }
          >
            <Route index element={<Navigate to="/super-admin/dashboard" replace />} />
            <Route path="dashboard" element={<SuperAdminDashboardPage />} />
            <Route path="shops" element={<SuperAdminShopsPage />} />
            <Route path="users" element={<SuperAdminUsersPage />} />
            <Route path="subscriptions" element={<SuperAdminSubscriptionsPage />} />
            <Route path="analytics" element={<SuperAdminAnalyticsPage />} />
            <Route path="activity" element={<SuperAdminActivityPage />} />
            <Route path="settings" element={<SuperAdminSettingsPage />} />
            <Route path="*" element={<Navigate to="/super-admin/dashboard" replace />} />
          </Route>

          {/* Shop Owner Business Workspace (8 Core Modules under ProtectedRoute) */}
          <Route
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<OverviewPage />} />
            <Route path="/overview" element={<Navigate to="/dashboard" replace />} />
            <Route path="/inventory" element={<InventoryPage />} />
            <Route path="/sales" element={<Navigate to="/sales/pos" replace />} />
            <Route path="/sales/pos" element={<POSBillingPage />} />
            <Route path="/sales/invoices" element={<InvoicesPage />} />
            <Route path="/customers" element={<CustomersPage />} />
            <Route path="/suppliers" element={<SuppliersPage />} />
            <Route path="/ai-assistant" element={<AIAssistantPage />} />
            <Route path="/analytics" element={<AnalyticsReportsPage />} />
            <Route path="/settings" element={<AdminSettingsPage />} />
            <Route path="/admin" element={<Navigate to="/settings" replace />} />
          </Route>

          {/* Wildcard Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </StoreProvider>
  );
}
