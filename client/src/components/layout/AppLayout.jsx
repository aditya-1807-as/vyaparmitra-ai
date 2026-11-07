import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar.jsx';
import TopNav from './TopNav.jsx';
import AuthModal from '../auth/AuthModal.jsx';
import { useStore } from '../../context/StoreContext.jsx';

export default function AppLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const { isAuthModalOpen, setIsAuthModalOpen } = useStore();

  return (
    <div className="min-h-screen bg-[#0C140E] text-[#F5EFE6] flex flex-col antialiased">
      {/* Sidebar Navigation */}
      <Sidebar
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
      />

      {/* Main Content Viewport */}
      <div className={`
        flex-1 flex flex-col transition-all duration-300
        ${isSidebarCollapsed ? 'lg:pl-20' : 'lg:pl-72'}
      `}>
        {/* Top Navigation */}
        <TopNav
          onMobileMenuToggle={() => setIsSidebarOpen(true)}
          isSidebarCollapsed={isSidebarCollapsed}
        />

        {/* Dynamic Page Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          <Outlet />
        </main>
      </div>

      {/* User Accounts & Workspace Switcher Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </div>
  );
}
