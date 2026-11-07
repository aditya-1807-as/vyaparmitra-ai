import React, { useState } from 'react';
import { Outlet, NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Store,
  Users,
  CreditCard,
  BarChart3,
  ShieldCheck,
  FileText,
  Settings,
  Sparkles,
  LogOut,
  Menu,
  X,
  ChevronRight,
  ExternalLink,
  Activity,
  AlertTriangle,
  Server
} from 'lucide-react';
import { useStore } from '../../context/StoreContext.jsx';

export default function SuperAdminLayout() {
  const { currentUser, logout } = useStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { name: 'Platform Dashboard', path: '/super-admin/dashboard', icon: LayoutDashboard },
    { name: 'Shops & Stores', path: '/super-admin/shops', icon: Store },
    { name: 'Platform Users', path: '/super-admin/users', icon: Users },
    { name: 'Subscriptions & MRR', path: '/super-admin/subscriptions', icon: CreditCard },
    { name: 'Platform Analytics', path: '/super-admin/analytics', icon: BarChart3 },
    { name: 'Audit Activity Log', path: '/super-admin/activity', icon: Activity },
    { name: 'System Settings', path: '/super-admin/settings', icon: Settings }
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#0A120C] text-[#F5EFE6] flex flex-col antialiased">
      {/* Top Banner / Header */}
      <header className="sticky top-0 z-40 bg-[#0E1A11]/95 backdrop-blur-md border-b border-[#1F3427] px-4 sm:px-8 py-3 flex items-center justify-between">
        {/* Left: Brand & Mode */}
        <div className="flex items-center space-x-3.5">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-[#E8DCC4] hover:bg-[#142319] rounded-xl transition-colors"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <Link to="/super-admin/dashboard" className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#8B5CF6] to-[#6D28D9] text-white flex items-center justify-center shadow-purple-glow">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-base font-black text-white tracking-tight flex items-center gap-1.5">
                VyaparMitra AI
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-[#8B5CF6]/20 text-[#8B5CF6] border border-[#8B5CF6]/40 tracking-wider">
                  CONTROL PLANE
                </span>
              </span>
              <p className="text-[10px] text-[#9EAEA3] font-mono">Platform Super Admin v2.0</p>
            </div>
          </Link>
        </div>

        {/* Right: System Health, Shop View, Profile */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          {/* Health Indicator */}
          <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-full bg-[#122016] border border-[#243D2D] text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[#9EAEA3] text-[11px] font-mono">Systems 100% Operational</span>
          </div>

          {/* Switch to Shop View */}
          <Link
            to="/dashboard"
            className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-[#142319] hover:bg-[#1A2E21] border border-[#243D2D] text-xs font-bold text-[#E8DCC4] transition-all"
            title="Inspect Shop Owner Perspective"
          >
            <Store className="w-3.5 h-3.5 text-[#8B5CF6]" />
            <span>Shop View</span>
          </Link>

          {/* Profile & Logout */}
          <div className="flex items-center space-x-3 pl-2 border-l border-[#1F3427]">
            <div className="text-right hidden md:block">
              <p className="text-xs font-bold text-white leading-tight">{currentUser?.name || 'Administrator'}</p>
              <p className="text-[10px] font-mono text-[#8B5CF6] font-semibold">{currentUser?.email || 'admin@vyaparmitra.ai'}</p>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 rounded-xl text-[#9EAEA3] hover:text-rose-400 hover:bg-rose-950/30 border border-transparent hover:border-rose-900/50 transition-colors"
              title="Sign Out of Control Plane"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <div className="flex-1 flex">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex w-64 flex-col bg-[#0C170F] border-r border-[#1F3427] shrink-0 p-4 space-y-6">
          <div className="px-2">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#6E7F74]">
              Platform Administration
            </p>
          </div>

          <nav className="flex-1 space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) => `
                    flex items-center space-x-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all
                    ${isActive
                      ? 'bg-[#8B5CF6] text-white shadow-purple-glow font-black'
                      : 'text-[#9EAEA3] hover:bg-[#142319] hover:text-[#F5EFE6]'
                    }
                  `}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="truncate">{item.name}</span>
                </NavLink>
              );
            })}
          </nav>

          {/* Sidebar Footer Info */}
          <div className="p-3 rounded-2xl bg-[#122016] border border-[#1F3427] space-y-2 text-xs">
            <div className="flex items-center space-x-2 text-[11px] font-bold text-white">
              <Server className="w-3.5 h-3.5 text-[#8B5CF6]" />
              <span>Multi-Tenant Cluster</span>
            </div>
            <p className="text-[10px] text-[#9EAEA3] leading-relaxed">
              Strict database isolation enforced across all 5 registered retail shops.
            </p>
          </div>
        </aside>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
            <div className="relative w-72 bg-[#0C170F] border-r border-[#1F3427] p-5 flex flex-col space-y-6 z-10">
              <div className="flex items-center justify-between pb-3 border-b border-[#1F3427]">
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="w-5 h-5 text-[#8B5CF6]" />
                  <span className="font-bold text-sm text-white">Super Admin Menu</span>
                </div>
                <button onClick={() => setMobileMenuOpen(false)} className="text-[#9EAEA3]">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="flex-1 space-y-1.5">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={({ isActive }) => `
                        flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all
                        ${isActive
                          ? 'bg-[#8B5CF6] text-white shadow-purple-glow font-black'
                          : 'text-[#9EAEA3] hover:bg-[#142319] hover:text-[#F5EFE6]'
                        }
                      `}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <span>{item.name}</span>
                    </NavLink>
                  );
                })}
              </nav>

              <div className="pt-4 border-t border-[#1F3427] space-y-2">
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2.5 px-3 rounded-xl bg-[#142319] border border-[#243D2D] text-xs font-bold text-[#E8DCC4] flex items-center justify-center space-x-2"
                >
                  <Store className="w-4 h-4 text-[#8B5CF6]" />
                  <span>Switch to Shop View</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full py-2.5 px-3 rounded-xl bg-rose-950/40 border border-rose-900/60 text-xs font-bold text-rose-300 flex items-center justify-center space-x-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main Content Viewport */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
