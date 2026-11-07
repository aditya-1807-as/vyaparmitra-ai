import React from 'react';
import { Navigate, useLocation, Link } from 'react-router-dom';
import { useStore } from '../../context/StoreContext.jsx';
import { ShieldAlert, ArrowLeft, Store } from 'lucide-react';

/**
 * ProtectedRoute: Requires an authenticated user session.
 * Unauthenticated users are redirected to /login with attempted location.
 */
export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, currentUser, authInitialized } = useStore();
  const location = useLocation();

  if (!authInitialized) {
    return (
      <div className="min-h-screen bg-[#0C140E] flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-[#8B5CF6] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated || !currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

/**
 * SuperAdminRoute: Requires Super Admin privileges (role === 'super_admin' or is_superadmin: true).
 * Non-admins receive an explicit Access Denied 403 screen with option to return to shop dashboard.
 */
export const SuperAdminRoute = ({ children }) => {
  const { isAuthenticated, currentUser, isSuperAdmin, authInitialized } = useStore();
  const location = useLocation();

  if (!authInitialized) {
    return (
      <div className="min-h-screen bg-[#0C140E] flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-[#8B5CF6] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated || !currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!isSuperAdmin) {
    return (
      <div className="min-h-screen bg-[#0C140E] text-[#F5EFE6] flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-[#142319] border border-rose-900/60 rounded-3xl p-8 text-center shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-rose-600 to-rose-400" />
          <div className="w-16 h-16 rounded-2xl bg-rose-950/60 border border-rose-800/80 text-rose-400 flex items-center justify-center mx-auto mb-5 shadow-lg">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-rose-300 tracking-tight">403 Forbidden</h2>
          <h3 className="text-lg font-bold text-[#F5EFE6] mt-1">Super Admin Access Required</h3>
          <p className="text-sm text-[#9EAEA3] mt-3 leading-relaxed">
            Your current account (<span className="text-sand font-mono font-medium">{currentUser?.email}</span>) does not possess platform administrative clearance. This area is reserved strictly for VyaparMitra AI platform administrators.
          </p>
          <div className="mt-8 pt-6 border-t border-[#1F3427] flex flex-col sm:flex-row gap-3">
            <Link
              to="/dashboard"
              className="flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl bg-[#1F3D2B] hover:bg-[#2A4D37] text-[#E8DCC4] font-bold text-sm border border-[#2F523B] transition-all"
            >
              <Store className="w-4 h-4 text-[#8B5CF6]" />
              <span>Back to Store</span>
            </Link>
            <Link
              to="/login"
              className="flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-bold text-sm shadow-purple-glow transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Switch Account</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return children;
};

/**
 * PublicRoute: For login, registration, and forgot password.
 * Redirects already logged in users to their appropriate portal.
 */
export const PublicRoute = ({ children }) => {
  const { isAuthenticated, currentUser, isSuperAdmin, authInitialized } = useStore();

  if (!authInitialized) {
    return null;
  }

  if (isAuthenticated && currentUser) {
    if (isSuperAdmin) {
      return <Navigate to="/super-admin/dashboard" replace />;
    }
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};
