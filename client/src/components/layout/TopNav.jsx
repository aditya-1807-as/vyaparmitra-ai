import React, { useState } from 'react';
import { 
  Menu, 
  Search, 
  Bell, 
  ChevronDown, 
  ShieldCheck, 
  UserCheck, 
  Receipt,
  Sparkles,
  Users,
  Store,
  LogOut,
  User,
  Settings,
  ArrowLeftRight,
  Package,
  X
} from 'lucide-react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useStore } from '../../context/StoreContext.jsx';
import { formatINR } from '../../utils/formatters.js';

export default function TopNav({ onMobileMenuToggle, isSidebarCollapsed }) {
  const { 
    shop, 
    currentUser, 
    lowStockProducts, 
    totalCustomerUdhaarOutstanding,
    products,
    customers,
    isSuperAdmin,
    logout
  } = useStore();

  const location = useLocation();
  const navigate = useNavigate();

  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);

  // Dynamic Page Meta & Breadcrumbs
  const getPageMeta = () => {
    const path = location.pathname;
    if (path.includes('/sales/pos')) return { title: 'Point of Sale (POS)', breadcrumb: 'Sales & Billing / POS Billing' };
    if (path.includes('/sales/invoices')) return { title: 'Invoices & Sales History', breadcrumb: 'Sales & Billing / Invoices' };
    if (path.includes('/sales')) return { title: 'Sales & Billing', breadcrumb: 'Sales / Operations' };
    if (path.includes('/inventory')) return { title: 'Inventory Management', breadcrumb: 'Inventory / Product Catalog' };
    if (path.includes('/customers')) return { title: 'Customer & Udhaar Ledger', breadcrumb: 'Customers / Khata Ledger' };
    if (path.includes('/suppliers')) return { title: 'Suppliers & Purchases', breadcrumb: 'Suppliers / Purchase Orders' };
    if (path.includes('/ai-assistant')) return { title: 'VyaparMitra AI Assistant', breadcrumb: 'Intelligence / AI Copilot' };
    if (path.includes('/analytics')) return { title: 'Business Analytics & Reports', breadcrumb: 'Intelligence / Financial Analytics' };
    if (path.includes('/settings') || path.includes('/admin')) return { title: 'Shop Settings & Permissions', breadcrumb: 'Preferences / Settings' };
    return { title: 'Store Dashboard', breadcrumb: 'Overview / Executive Summary' };
  };

  const { title, breadcrumb } = getPageMeta();

  // Search Results (filtered strictly by current user's isolated workspace)
  const filteredProducts = searchQuery.trim() 
    ? products.filter(p => p.name?.toLowerCase().includes(searchQuery.toLowerCase()) || p.sku?.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 4) 
    : [];

  const filteredCustomers = searchQuery.trim()
    ? customers.filter(c => c.name?.toLowerCase().includes(searchQuery.toLowerCase()) || c.phone?.includes(searchQuery)).slice(0, 3)
    : [];

  const totalNotifications = lowStockProducts.length + (totalCustomerUdhaarOutstanding > 20000 ? 1 : 0);

  const handleLogout = async () => {
    setShowAccountMenu(false);
    await logout();
    navigate('/login', { replace: true });
  };

  const handleSwitchAccount = async () => {
    setShowAccountMenu(false);
    await logout();
    navigate('/login', { replace: true });
  };

  return (
    <header className="sticky top-0 z-30 bg-[#0F1C14]/95 backdrop-blur-md border-b border-[#1F3427] px-4 sm:px-8 py-3.5 flex items-center justify-between transition-all">
      {/* LEFT: Mobile Menu Trigger & Page Title / Breadcrumb */}
      <div className="flex items-center space-x-3.5">
        <button
          onClick={onMobileMenuToggle}
          className="lg:hidden p-2 text-[#E8DCC4] hover:bg-[#18291E] rounded-xl transition-colors border border-[#1F3427]"
          title="Open Navigation Drawer"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <p className="text-[11px] font-mono text-[#9EAEA3] font-medium hidden sm:block">
            {breadcrumb}
          </p>
          <h1 className="text-base sm:text-lg font-black text-white tracking-tight leading-tight">
            {title}
          </h1>
        </div>
      </div>

      {/* RIGHT: Global Search, Notification Center, Shop Badge, and Profile Dropdown */}
      <div className="flex items-center space-x-3 sm:space-x-4">
        {/* Global Quick Search Bar */}
        <div className="relative hidden md:block w-52 lg:w-72">
          <div className="relative">
            <Search className="w-4 h-4 text-[#9EAEA3] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSearchResults(Boolean(e.target.value.trim()));
              }}
              onFocus={() => setShowSearchResults(Boolean(searchQuery.trim()))}
              placeholder="Search products, customers, SKUs..."
              className="w-full pl-9 pr-8 py-2 rounded-xl bg-[#142319] border border-[#243D2D] text-xs text-[#F5EFE6] placeholder-[#6E7F74] focus:outline-none focus:border-[#8B5CF6] transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setShowSearchResults(false);
                }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#9EAEA3] hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Search Dropdown Overlay */}
          {showSearchResults && (
            <div 
              className="absolute left-0 right-0 top-full mt-2 bg-[#122016] border border-[#243D2D] rounded-2xl shadow-2xl p-3 z-50 animate-in fade-in space-y-2 max-h-80 overflow-y-auto"
              onMouseLeave={() => setShowSearchResults(false)}
            >
              {filteredProducts.length === 0 && filteredCustomers.length === 0 ? (
                <p className="text-xs text-[#9EAEA3] text-center py-2">No matching items or customers found.</p>
              ) : (
                <>
                  {filteredProducts.length > 0 && (
                    <div>
                      <p className="text-[10px] font-bold text-[#6E7F74] uppercase px-2 pb-1">Products</p>
                      {filteredProducts.map(p => (
                        <div
                          key={p.id}
                          onClick={() => {
                            navigate('/inventory');
                            setShowSearchResults(false);
                          }}
                          className="flex items-center justify-between p-2 rounded-xl hover:bg-[#18291F] cursor-pointer text-xs"
                        >
                          <div>
                            <p className="font-semibold text-white">{p.name}</p>
                            <p className="text-[10px] text-[#9EAEA3] font-mono">SKU: {p.sku} • Stock: {p.stock_quantity}</p>
                          </div>
                          <span className="font-mono font-bold text-[#8B5CF6]">₹{p.selling_price}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {filteredCustomers.length > 0 && (
                    <div className="pt-2 border-t border-[#1F3427]">
                      <p className="text-[10px] font-bold text-[#6E7F74] uppercase px-2 pb-1">Customers</p>
                      {filteredCustomers.map(c => (
                        <div
                          key={c.id}
                          onClick={() => {
                            navigate('/customers');
                            setShowSearchResults(false);
                          }}
                          className="flex items-center justify-between p-2 rounded-xl hover:bg-[#18291F] cursor-pointer text-xs"
                        >
                          <div>
                            <p className="font-semibold text-white">{c.name}</p>
                            <p className="text-[10px] text-[#9EAEA3] font-mono">{c.phone}</p>
                          </div>
                          <span className="font-mono text-xs text-rose-300 font-bold">
                            Due: ₹{c.outstanding_balance || 0}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>

        {/* Current Shop / Workspace Selector Indicator */}
        <div className="hidden xl:flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-[#142319] border border-[#243D2D] text-xs">
          <Store className="w-3.5 h-3.5 text-[#8B5CF6]" />
          <span className="font-bold text-[#E8DCC4] max-w-[140px] truncate">{shop?.name || 'Store'}</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
        </div>

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifMenu(!showNotifMenu)}
            className="p-2 rounded-xl bg-[#142319] hover:bg-[#18291E] border border-[#243D2D] text-[#E8DCC4] relative transition-colors"
            title="Notifications & Alerts"
          >
            <Bell className="w-4 h-4" />
            {totalNotifications > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#8B5CF6] text-white text-[9px] font-black flex items-center justify-center shadow-purple-glow">
                {totalNotifications}
              </span>
            )}
          </button>

          {/* Notifications Popover */}
          {showNotifMenu && (
            <div 
              className="absolute right-0 top-full mt-2 w-72 bg-[#122016] rounded-2xl shadow-2xl border border-[#243D2D] p-3 z-50 animate-in fade-in space-y-2"
              onMouseLeave={() => setShowNotifMenu(false)}
            >
              <div className="flex items-center justify-between pb-2 border-b border-[#1F3427]">
                <p className="text-xs font-bold text-white">Store Alerts</p>
                <span className="text-[10px] text-[#8B5CF6] font-mono font-bold">{totalNotifications} Active</span>
              </div>

              {totalNotifications === 0 ? (
                <p className="text-xs text-[#9EAEA3] text-center py-4">All inventory & Udhaar metrics normal.</p>
              ) : (
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {lowStockProducts.length > 0 && (
                    <div className="p-2.5 rounded-xl bg-amber-950/30 border border-amber-800/50 text-xs">
                      <p className="font-bold text-amber-200 flex items-center gap-1.5">
                        <Package className="w-3.5 h-3.5 text-amber-400" />
                        <span>Low Stock Alert ({lowStockProducts.length})</span>
                      </p>
                      <p className="text-[11px] text-[#C5BBA4] mt-1">
                        {lowStockProducts[0]?.name} is near reorder threshold.
                      </p>
                    </div>
                  )}

                  {totalCustomerUdhaarOutstanding > 20000 && (
                    <div className="p-2.5 rounded-xl bg-rose-950/30 border border-rose-800/50 text-xs">
                      <p className="font-bold text-rose-200 flex items-center gap-1.5">
                        <Receipt className="w-3.5 h-3.5 text-rose-400" />
                        <span>High Credit Exposure</span>
                      </p>
                      <p className="text-[11px] text-[#C5BBA4] mt-1">
                        Total pending Udhaar is {formatINR(totalCustomerUdhaarOutstanding)}.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* ACCOUNT PROFILE DROPDOWN */}
        <div className="relative">
          <button
            onClick={() => setShowAccountMenu(!showAccountMenu)}
            className="flex items-center space-x-2.5 p-1.5 sm:px-3 sm:py-2 rounded-xl bg-[#142319] hover:bg-[#18291E] border border-[#243D2D] transition-colors"
          >
            <div className="w-7 h-7 rounded-lg bg-[#8B5CF6] text-white font-bold text-xs flex items-center justify-center shadow-purple-glow">
              {currentUser?.name?.slice(0, 2).toUpperCase() || 'RK'}
            </div>
            <div className="text-left hidden sm:block">
              <p className="text-xs font-bold text-[#F5EFE6] leading-tight">{currentUser?.name || 'Shop Owner'}</p>
              <p className="text-[10px] text-[#9EAEA3] font-semibold capitalize">{currentUser?.role || 'Owner'}</p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-[#9EAEA3]" />
          </button>

          {/* Dropdown Menu */}
          {showAccountMenu && (
            <div 
              className="absolute right-0 top-full mt-2 w-64 bg-[#122016] rounded-2xl shadow-2xl border border-[#243D2D] p-3 z-50 animate-in fade-in space-y-1"
              onMouseLeave={() => setShowAccountMenu(false)}
            >
              {/* Account Identifier Header */}
              <div className="px-3 py-2 border-b border-[#1F3427] mb-1">
                <p className="text-xs font-bold text-white truncate">{currentUser?.name}</p>
                <p className="text-[10px] text-[#9EAEA3] font-mono truncate">{currentUser?.email}</p>
                <span className="inline-block mt-1 text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-[#1F3D2B] text-[#E8DCC4] border border-[#2F523B]">
                  {currentUser?.role || 'Owner'}
                </span>
              </div>

              {/* Menu Links */}
              <button
                onClick={() => {
                  navigate('/settings?tab=profile');
                  setShowAccountMenu(false);
                }}
                className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-[#E8DCC4] hover:bg-[#18291E] hover:text-white transition-colors text-left"
              >
                <User className="w-4 h-4 text-[#8B5CF6]" />
                <span>My Profile</span>
              </button>

              <button
                onClick={() => {
                  navigate('/settings');
                  setShowAccountMenu(false);
                }}
                className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-[#E8DCC4] hover:bg-[#18291E] hover:text-white transition-colors text-left"
              >
                <Settings className="w-4 h-4 text-[#8B5CF6]" />
                <span>Shop Settings</span>
              </button>

              {isSuperAdmin && (
                <button
                  onClick={() => {
                    navigate('/super-admin/dashboard');
                    setShowAccountMenu(false);
                  }}
                  className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-[#8B5CF6] hover:bg-[#8B5CF6]/15 transition-colors text-left"
                >
                  <ShieldCheck className="w-4 h-4 text-[#8B5CF6]" />
                  <span>Platform Control Plane</span>
                </button>
              )}

              <div className="pt-2 border-t border-[#1F3427] space-y-1">
                {/* Switch Account */}
                <button
                  onClick={handleSwitchAccount}
                  className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-[#E8DCC4] hover:bg-[#18291E] transition-colors text-left"
                  title="Switch to another account (Safe logout)"
                >
                  <ArrowLeftRight className="w-4 h-4 text-[#8B5CF6]" />
                  <span>Switch Account</span>
                </button>

                {/* Logout */}
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-300 hover:bg-rose-950/40 transition-colors text-left"
                  title="Sign Out completely"
                >
                  <LogOut className="w-4 h-4 text-rose-400" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
