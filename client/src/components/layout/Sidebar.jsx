import React, { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  Truck, 
  Sparkles, 
  BarChart3, 
  Settings, 
  ChevronDown, 
  ChevronRight, 
  ChevronLeft,
  Store, 
  Receipt,
  Layers,
  ArrowRightLeft,
  BookOpenCheck,
  UserCheck,
  ShieldCheck,
  LogOut,
  ArrowLeftRight,
  Bot,
  X
} from 'lucide-react';
import { useStore } from '../../context/StoreContext.jsx';

export default function Sidebar({ isOpen, setIsOpen, isCollapsed, setIsCollapsed }) {
  const { shop, currentUser, isSuperAdmin, logout } = useStore();
  const location = useLocation();
  const navigate = useNavigate();

  // Submenu toggle states
  const [openSubmenus, setOpenSubmenus] = useState({
    inventory: true,
    sales: true,
    customers: false,
    suppliers: false
  });

  const toggleSubmenu = (menu) => {
    setOpenSubmenus(prev => ({ ...prev, [menu]: !prev[menu] }));
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  const handleSwitchAccount = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  // Structured Navigation Groups
  const navigationGroups = [
    {
      groupTitle: 'OVERVIEW',
      items: [
        {
          name: 'Dashboard',
          path: '/dashboard',
          icon: LayoutDashboard,
          badge: null
        }
      ]
    },
    {
      groupTitle: 'BUSINESS MANAGEMENT',
      items: [
        {
          name: 'Inventory',
          path: '/inventory',
          icon: Package,
          submenuKey: 'inventory',
          subitems: [
            { name: 'Products Catalog', path: '/inventory?tab=products', icon: Package },
            { name: 'Categories', path: '/inventory?tab=categories', icon: Layers },
            { name: 'Stock Movements', path: '/inventory?tab=movements', icon: ArrowRightLeft }
          ]
        },
        {
          name: 'Sales & Billing',
          path: '/sales',
          icon: ShoppingCart,
          submenuKey: 'sales',
          subitems: [
            { name: 'Rapid POS Billing', path: '/sales/pos', icon: ShoppingCart },
            { name: 'Invoices & Sales', path: '/sales/invoices', icon: Receipt }
          ]
        },
        {
          name: 'Customers & Udhaar',
          path: '/customers',
          icon: Users,
          submenuKey: 'customers',
          subitems: [
            { name: 'Customer Directory', path: '/customers?tab=list', icon: Users },
            { name: 'Digital Khata Ledger', path: '/customers?tab=udhaar', icon: BookOpenCheck }
          ]
        },
        {
          name: 'Suppliers & Purchases',
          path: '/suppliers',
          icon: Truck,
          submenuKey: 'suppliers',
          subitems: [
            { name: 'Supplier List', path: '/suppliers?tab=list', icon: Truck },
            { name: 'Purchase Orders', path: '/suppliers?tab=purchases', icon: Layers }
          ]
        }
      ]
    },
    {
      groupTitle: 'INTELLIGENCE',
      items: [
        {
          name: 'AI Business Assistant',
          path: '/ai-assistant',
          icon: Bot,
          isSpecial: true,
          badge: 'AI COPILOT'
        },
        {
          name: 'Analytics & Reports',
          path: '/analytics',
          icon: BarChart3,
          badge: null
        }
      ]
    },
    {
      groupTitle: 'PREFERENCES',
      items: [
        {
          name: 'Shop Settings',
          path: '/settings',
          icon: Settings,
          badge: null
        }
      ]
    }
  ];

  return (
    <>
      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Main Sidebar Element */}
      <aside className={`
        fixed top-0 bottom-0 left-0 z-50
        flex flex-col
        bg-[#0F1C14] border-r border-[#1F3427]
        transition-all duration-300 ease-in-out
        ${isCollapsed ? 'w-20' : 'w-64'}
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* TOP BRAND & IDENTITY SECTION */}
        <div className="p-4 border-b border-[#1F3427] flex items-center justify-between">
          <div className="flex items-center space-x-3 overflow-hidden">
            {/* Logo */}
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#1F3D2B] to-[#122016] border border-[#2F523B] flex items-center justify-center shrink-0 shadow-lg">
              <Sparkles className="w-5 h-5 text-[#8B5CF6] animate-pulse" />
            </div>

            {/* Brand Title (when expanded) */}
            {!isCollapsed && (
              <div className="truncate">
                <span className="text-base font-black text-[#F5EFE6] tracking-tight flex items-center gap-1.5">
                  Vyapar<span className="text-[#8B5CF6]">Mitra</span>
                  <span className="text-[9px] font-black uppercase px-1 py-0.2 rounded bg-[#8B5CF6]/20 text-[#8B5CF6] border border-[#8B5CF6]/40">
                    AI
                  </span>
                </span>
                <p className="text-[10px] text-[#9EAEA3] font-medium tracking-wide">Retail OS</p>
              </div>
            )}
          </div>

          {/* Desktop Collapse / Expand Toggle */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex p-1.5 text-[#9EAEA3] hover:text-[#F5EFE6] hover:bg-[#18291F] rounded-xl transition-colors border border-[#1F3427]"
            title={isCollapsed ? "Expand navigation sidebar" : "Collapse navigation sidebar"}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>

          {/* Mobile Close Button */}
          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden p-1.5 text-[#9EAEA3] hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* SHOP / BUSINESS WORKSPACE IDENTITY BADGE */}
        {!isCollapsed ? (
          <div className="mx-3 mt-3 p-3 rounded-2xl bg-[#142319] border border-[#243D2D]">
            <div className="flex items-center space-x-2.5 truncate">
              <div className="w-7 h-7 rounded-lg bg-[#1F3D2B] border border-[#2F523B] flex items-center justify-center shrink-0">
                <Store className="w-3.5 h-3.5 text-[#8B5CF6]" />
              </div>
              <div className="truncate">
                <p className="text-xs font-bold text-[#F5EFE6] truncate leading-tight">
                  {shop?.name || 'My Retail Store'}
                </p>
                <div className="flex items-center space-x-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[10px] text-[#9EAEA3] font-mono capitalize">
                    {shop?.business_type || 'Active Store'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="mx-auto mt-3 w-10 h-10 rounded-xl bg-[#142319] border border-[#243D2D] flex items-center justify-center" title={shop?.name}>
            <Store className="w-4 h-4 text-[#8B5CF6]" />
          </div>
        )}

        {/* NAVIGATION SCROLLABLE VIEWPORT */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5 select-none custom-scrollbar">
          {navigationGroups.map((group, gIdx) => (
            <div key={gIdx} className="space-y-1">
              {/* Section Header */}
              {!isCollapsed ? (
                <div className="px-3 pb-1">
                  <p className="text-[10px] font-black uppercase tracking-wider text-[#6E7F74]">
                    {group.groupTitle}
                  </p>
                </div>
              ) : (
                <div className="w-full border-t border-[#1F3427] my-2" />
              )}

              {/* Group Items */}
              {group.items.map((item) => {
                const Icon = item.icon;
                const isSubmenuActive = item.subitems && item.subitems.some(sub => 
                  location.pathname === sub.path.split('?')[0] && 
                  (!sub.path.includes('?') || location.search === sub.path.substring(sub.path.indexOf('?')))
                );
                const isActive = location.pathname.startsWith(item.path) || isSubmenuActive;
                const isMenuOpen = openSubmenus[item.submenuKey];

                return (
                  <div key={item.name} className="relative group/nav">
                    {item.subitems ? (
                      <div>
                        {/* Parent Item with Submenu */}
                        <button
                          onClick={() => !isCollapsed && toggleSubmenu(item.submenuKey)}
                          className={`
                            w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all text-left
                            ${isActive 
                              ? 'bg-[#18291F] text-[#8B5CF6] border border-[#2A4D37]' 
                              : 'text-[#9EAEA3] hover:bg-[#142319] hover:text-[#F5EFE6]'
                            }
                            ${isCollapsed ? 'justify-center px-0' : ''}
                          `}
                          title={isCollapsed ? item.name : undefined}
                        >
                          <div className="flex items-center space-x-3 truncate">
                            <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#8B5CF6]' : 'text-[#9EAEA3]'}`} />
                            {!isCollapsed && <span className="truncate">{item.name}</span>}
                          </div>

                          {!isCollapsed && (
                            <div className="text-[#9EAEA3]">
                              {isMenuOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                            </div>
                          )}
                        </button>

                        {/* Collapsed Tooltip */}
                        {isCollapsed && (
                          <div className="absolute left-full top-0 ml-2 hidden group-hover/nav:block z-50 bg-[#142319] border border-[#243D2D] rounded-xl px-3 py-1.5 text-xs font-bold text-white shadow-xl whitespace-nowrap">
                            {item.name}
                          </div>
                        )}

                        {/* Submenu Items (Expanded State) */}
                        {!isCollapsed && isMenuOpen && (
                          <div className="ml-4 pl-3 mt-1 space-y-1 border-l border-[#1F3427]">
                            {item.subitems.map((sub) => {
                              const isSubActive = location.pathname === sub.path.split('?')[0] && 
                                (!sub.path.includes('?') || location.search === sub.path.substring(sub.path.indexOf('?')));
                              const SubIcon = sub.icon;

                              return (
                                <NavLink
                                  key={sub.name}
                                  to={sub.path}
                                  onClick={() => setIsOpen(false)}
                                  className={`
                                    flex items-center space-x-2 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors
                                    ${isSubActive 
                                      ? 'text-[#8B5CF6] bg-[#8B5CF6]/15 font-bold' 
                                      : 'text-[#9EAEA3] hover:text-[#F5EFE6] hover:bg-[#142319]'
                                    }
                                  `}
                                >
                                  <SubIcon className="w-3.5 h-3.5 shrink-0" />
                                  <span className="truncate">{sub.name}</span>
                                </NavLink>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    ) : (
                      /* Standalone Nav Link */
                      <NavLink
                        to={item.path}
                        onClick={() => setIsOpen(false)}
                        className={`
                          flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all
                          ${isActive 
                            ? (item.isSpecial ? 'bg-[#8B5CF6] text-white shadow-purple-glow font-black' : 'bg-[#18291F] text-[#8B5CF6] border border-[#2A4D37]') 
                            : (item.isSpecial ? 'text-[#8B5CF6] bg-[#8B5CF6]/10 hover:bg-[#8B5CF6]/20' : 'text-[#9EAEA3] hover:bg-[#142319] hover:text-[#F5EFE6]')
                          }
                          ${isCollapsed ? 'justify-center px-0' : ''}
                        `}
                        title={isCollapsed ? item.name : undefined}
                      >
                        <div className="flex items-center space-x-3 truncate">
                          <Icon className={`w-4 h-4 shrink-0 ${item.isSpecial ? (isActive ? 'text-white' : 'text-[#8B5CF6] animate-pulse') : (isActive ? 'text-[#8B5CF6]' : 'text-[#9EAEA3]')}`} />
                          {!isCollapsed && <span className="truncate">{item.name}</span>}
                        </div>

                        {!isCollapsed && item.badge && (
                          <span className="px-2 py-0.5 text-[8px] font-black uppercase rounded-full bg-[#8B5CF6] text-white shadow-purple-glow">
                            {item.badge}
                          </span>
                        )}
                      </NavLink>
                    )}

                    {/* Tooltip for standalone item when collapsed */}
                    {isCollapsed && !item.subitems && (
                      <div className="absolute left-full top-0 ml-2 hidden group-hover/nav:block z-50 bg-[#142319] border border-[#243D2D] rounded-xl px-3 py-1.5 text-xs font-bold text-white shadow-xl whitespace-nowrap">
                        {item.name}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </nav>

        {/* SIDEBAR FOOTER: USER PROFILE & ACTIONS */}
        <div className="p-3 border-t border-[#1F3427] bg-[#0A140E] space-y-2">
          {/* User Profile Info Card */}
          <div className="p-2.5 rounded-2xl bg-[#142319] border border-[#243D2D]">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2.5 truncate">
                <div className="w-8 h-8 rounded-xl bg-[#8B5CF6] text-white font-extrabold text-xs flex items-center justify-center shrink-0 shadow-purple-glow">
                  {currentUser?.name?.slice(0, 2).toUpperCase() || 'RK'}
                </div>
                {!isCollapsed && (
                  <div className="truncate text-left">
                    <p className="text-xs font-bold text-[#F5EFE6] truncate leading-tight">
                      {currentUser?.name || 'Shop User'}
                    </p>
                    <p className="text-[10px] text-[#9EAEA3] font-medium capitalize truncate">
                      {currentUser?.role || 'Staff'} • {currentUser?.email?.slice(0, 16)}...
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quick Account Actions */}
          {!isCollapsed ? (
            <div className="grid grid-cols-2 gap-1.5">
              <button
                onClick={handleSwitchAccount}
                className="flex items-center justify-center space-x-1.5 py-1.5 px-2 rounded-xl bg-[#142319] hover:bg-[#1A2E21] border border-[#243D2D] text-[#E8DCC4] text-[11px] font-bold transition-all"
                title="Switch Account (Safely logs out and returns to login)"
              >
                <ArrowLeftRight className="w-3 h-3 text-[#8B5CF6]" />
                <span>Switch</span>
              </button>

              <button
                onClick={handleLogout}
                className="flex items-center justify-center space-x-1.5 py-1.5 px-2 rounded-xl bg-rose-950/30 hover:bg-rose-900/40 border border-rose-900/50 text-rose-300 text-[11px] font-bold transition-all"
                title="Sign Out completely"
              >
                <LogOut className="w-3 h-3 text-rose-400" />
                <span>Sign Out</span>
              </button>
            </div>
          ) : (
            <div className="flex flex-col space-y-1 items-center">
              <button
                onClick={handleLogout}
                className="w-8 h-8 rounded-xl bg-rose-950/40 border border-rose-900/60 text-rose-300 flex items-center justify-center"
                title="Sign Out"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Super Admin Access Pill (if role permits) */}
          {isSuperAdmin && !isCollapsed && (
            <NavLink
              to="/super-admin/dashboard"
              className="flex items-center justify-center space-x-1.5 py-2 px-3 rounded-xl bg-[#8B5CF6]/15 hover:bg-[#8B5CF6]/25 border border-[#8B5CF6]/40 text-[#8B5CF6] text-xs font-bold transition-all"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Super Admin Control Plane</span>
            </NavLink>
          )}
        </div>
      </aside>
    </>
  );
}
