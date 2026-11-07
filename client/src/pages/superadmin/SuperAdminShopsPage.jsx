import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Store,
  Search,
  Filter,
  Eye,
  AlertOctagon,
  CheckCircle2,
  X,
  ShieldCheck,
  Building,
  Phone,
  Mail,
  MapPin,
  Calendar,
  DollarSign,
  Package,
  Activity,
  AlertTriangle,
  RotateCcw
} from 'lucide-react';
import { useStore } from '../../context/StoreContext.jsx';
import { formatINR } from '../../utils/formatters.js';

export default function SuperAdminShopsPage() {
  const [searchParams] = useSearchParams();
  const targetShopId = searchParams.get('id');

  const { fetchSuperAdminShops, fetchSuperAdminShopDetails, updateShopStatus } = useStore();

  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modals
  const [selectedShop, setSelectedShop] = useState(null);
  const [shopDetailsLoading, setShopDetailsLoading] = useState(false);
  const [showSuspendModal, setShowSuspendModal] = useState(false);
  const [suspendingShop, setSuspendingShop] = useState(null);
  const [suspensionReason, setSuspensionReason] = useState('');
  const [actionError, setActionError] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');

  const loadShops = async () => {
    try {
      setLoading(true);
      const res = await fetchSuperAdminShops({ search: searchQuery, status: statusFilter });
      setShops(res.shops || []);
    } catch (err) {
      setActionError(err.message || 'Failed to load shops');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadShops();
  }, [searchQuery, statusFilter]);

  // If a specific shop ID was passed via query param, auto-open its details
  useEffect(() => {
    if (targetShopId && shops.length > 0) {
      handleViewDetails(targetShopId);
    }
  }, [targetShopId, shops.length]);

  const handleViewDetails = async (shopId) => {
    try {
      setShopDetailsLoading(true);
      const details = await fetchSuperAdminShopDetails(shopId);
      setSelectedShop(details);
    } catch (err) {
      setActionError(err.message || 'Failed to load shop details');
    } finally {
      setShopDetailsLoading(false);
    }
  };

  const handleOpenSuspendModal = (shop) => {
    setSuspendingShop(shop);
    setSuspensionReason('Regulatory compliance audit review');
    setShowSuspendModal(true);
  };

  const handleConfirmSuspend = async () => {
    if (!suspendingShop) return;
    try {
      setActionError('');
      await updateShopStatus(suspendingShop.id, 'suspended', suspensionReason);
      setActionSuccess(`Shop "${suspendingShop.name}" has been suspended.`);
      setShowSuspendModal(false);
      setSuspendingShop(null);
      await loadShops();
      if (selectedShop && selectedShop.shop.id === suspendingShop.id) {
        handleViewDetails(suspendingShop.id);
      }
    } catch (err) {
      setActionError(err.message || 'Failed to suspend shop');
    }
  };

  const handleActivateShop = async (shop) => {
    try {
      setActionError('');
      await updateShopStatus(shop.id, 'active');
      setActionSuccess(`Shop "${shop.name}" has been restored to active status.`);
      await loadShops();
      if (selectedShop && selectedShop.shop.id === shop.id) {
        handleViewDetails(shop.id);
      }
    } catch (err) {
      setActionError(err.message || 'Failed to activate shop');
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1F3427]">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            Platform Shops & Workspaces
            <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-[#1F3D2B] text-[#E8DCC4] border border-[#2F523B]">
              {shops.length} Tenants
            </span>
          </h1>
          <p className="text-xs text-[#9EAEA3] mt-1">
            Audit store status, manage operational suspensions, and monitor tenant performance
          </p>
        </div>
      </div>

      {actionSuccess && (
        <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-800/80 text-xs text-emerald-300 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{actionSuccess}</span>
          </div>
          <button onClick={() => setActionSuccess('')} className="text-emerald-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {actionError && (
        <div className="p-3.5 rounded-2xl bg-rose-950/40 border border-rose-800/80 text-xs text-rose-300 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{actionError}</span>
          </div>
          <button onClick={() => setActionError('')} className="text-rose-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#9EAEA3] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search shops by name, owner, city, or GSTIN..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#122016] border border-[#1F3427] text-xs text-[#F5EFE6] placeholder-[#6E7F74] focus:outline-none focus:border-[#8B5CF6]"
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center space-x-1.5 p-1 rounded-2xl bg-[#122016] border border-[#1F3427]">
          {['ALL', 'active', 'suspended', 'deactivated'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all ${
                statusFilter === st
                  ? 'bg-[#8B5CF6] text-white shadow-purple-glow'
                  : 'text-[#9EAEA3] hover:text-white'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Shops Table */}
      <div className="rounded-3xl bg-[#122016] border border-[#1F3427] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0E1711] text-[#9EAEA3] font-bold border-b border-[#1F3427]">
              <tr>
                <th className="p-4">Store Identity</th>
                <th className="p-4">Owner & Location</th>
                <th className="p-4">Subscription</th>
                <th className="p-4 text-center">Catalog Size</th>
                <th className="p-4 text-right">GMV Volume</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1F3427] text-[#C5BBA4]">
              {shops.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-[#9EAEA3]">
                    No retail shops found matching your search criteria.
                  </td>
                </tr>
              ) : (
                shops.map((s) => (
                  <tr key={s.id} className="hover:bg-[#15251B] transition-colors">
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-xl bg-[#1F3D2B] border border-[#2F523B] flex items-center justify-center shrink-0">
                          <Store className="w-4 h-4 text-[#8B5CF6]" />
                        </div>
                        <div>
                          <p className="font-bold text-white text-sm">{s.name}</p>
                          <p className="text-[10px] text-[#9EAEA3] font-mono">ID: {s.id} • GST: {s.gstin || 'N/A'}</p>
                        </div>
                      </div>
                    </td>

                    <td className="p-4">
                      <p className="font-semibold text-white">{s.owner_name}</p>
                      <p className="text-[11px] text-[#9EAEA3]">{s.owner_email}</p>
                      <p className="text-[10px] text-[#6E7F74] flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3" />
                        {s.city || 'India'}
                      </p>
                    </td>

                    <td className="p-4 font-semibold text-white">
                      <span className="px-2.5 py-1 rounded-full bg-[#1F3D2B] text-[#E8DCC4] border border-[#2F523B] text-[11px]">
                        {s.subscription_plan_name || 'Pro Plan'}
                      </span>
                    </td>

                    <td className="p-4 text-center font-mono font-bold text-white">
                      {s.product_count} items
                    </td>

                    <td className="p-4 text-right font-mono font-bold text-emerald-400">
                      {formatINR(s.total_sales || 0)}
                    </td>

                    <td className="p-4 text-center">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                        s.status === 'active'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                          : s.status === 'suspended'
                          ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                          : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                      }`}>
                        {s.status}
                      </span>
                      {s.suspension_reason && (
                        <p className="text-[9px] text-rose-400/80 truncate max-w-[120px] mx-auto mt-0.5" title={s.suspension_reason}>
                          {s.suspension_reason}
                        </p>
                      )}
                    </td>

                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleViewDetails(s.id)}
                          className="p-1.5 rounded-xl bg-[#142319] hover:bg-[#1A2E21] border border-[#243D2D] text-[#E8DCC4] hover:text-white transition-all"
                          title="View Shop Details & Audit"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        {s.status === 'active' ? (
                          <button
                            onClick={() => handleOpenSuspendModal(s)}
                            className="px-2.5 py-1.5 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/80 text-rose-300 text-xs font-bold transition-all flex items-center space-x-1"
                            title="Suspend Shop Access"
                          >
                            <AlertOctagon className="w-3.5 h-3.5" />
                            <span>Suspend</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => handleActivateShop(s)}
                            className="px-2.5 py-1.5 rounded-xl bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-800/80 text-emerald-300 text-xs font-bold transition-all flex items-center space-x-1"
                            title="Restore Active Status"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>Restore</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* SHOP DETAILS MODAL */}
      <AnimatePresence>
        {selectedShop && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-3xl w-full bg-[#122016] border border-[#2A4D37] rounded-3xl p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto space-y-6"
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-[#1F3427]">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#1F3D2B] border border-[#2F523B] flex items-center justify-center">
                    <Store className="w-5 h-5 text-[#8B5CF6]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">{selectedShop.shop.name}</h3>
                    <p className="text-xs text-[#9EAEA3] font-mono">Workspace ID: {selectedShop.shop.id}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedShop(null)}
                  className="p-1.5 rounded-xl text-[#9EAEA3] hover:text-white hover:bg-[#142319]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Status Banner */}
              <div className={`p-4 rounded-2xl border flex items-center justify-between ${
                selectedShop.shop.status === 'active'
                  ? 'bg-emerald-950/30 border-emerald-800/60 text-emerald-300'
                  : 'bg-rose-950/30 border-rose-800/60 text-rose-300'
              }`}>
                <div>
                  <p className="font-bold text-xs uppercase tracking-wider">
                    Store Status: {selectedShop.shop.status}
                  </p>
                  {selectedShop.shop.suspension_reason && (
                    <p className="text-xs mt-0.5">
                      Reason: <span className="text-white font-medium">{selectedShop.shop.suspension_reason}</span>
                    </p>
                  )}
                </div>

                {selectedShop.shop.status === 'active' ? (
                  <button
                    onClick={() => {
                      setSelectedShop(null);
                      handleOpenSuspendModal(selectedShop.shop);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md"
                  >
                    Suspend Shop
                  </button>
                ) : (
                  <button
                    onClick={() => handleActivateShop(selectedShop.shop)}
                    className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md"
                  >
                    Restore Store
                  </button>
                )}
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3.5 rounded-2xl bg-[#0E1711] border border-[#1F3427]">
                  <p className="text-[#9EAEA3]">Total Revenue</p>
                  <p className="text-lg font-black text-emerald-400 font-mono mt-0.5">
                    {formatINR(selectedShop.stats.totalSalesRevenue)}
                  </p>
                </div>
                <div className="p-3.5 rounded-2xl bg-[#0E1711] border border-[#1F3427]">
                  <p className="text-[#9EAEA3]">Inventory Items</p>
                  <p className="text-lg font-black text-white font-mono mt-0.5">
                    {selectedShop.stats.totalProducts}
                  </p>
                </div>
                <div className="p-3.5 rounded-2xl bg-[#0E1711] border border-[#1F3427]">
                  <p className="text-[#9EAEA3]">Customer Udhaar</p>
                  <p className="text-lg font-black text-rose-300 font-mono mt-0.5">
                    {formatINR(selectedShop.stats.totalCustomerUdhaar)}
                  </p>
                </div>
                <div className="p-3.5 rounded-2xl bg-[#0E1711] border border-[#1F3427]">
                  <p className="text-[#9EAEA3]">Store Employees</p>
                  <p className="text-lg font-black text-[#8B5CF6] font-mono mt-0.5">
                    {selectedShop.stats.totalEmployees}
                  </p>
                </div>
              </div>

              {/* Owner & Identity Details */}
              <div className="p-4 rounded-2xl bg-[#0E1711] border border-[#1F3427] space-y-2 text-xs">
                <p className="font-bold text-white uppercase tracking-wider text-[11px]">Merchant Profile</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[#C5BBA4]">
                  <p><strong className="text-white">Owner Name:</strong> {selectedShop.shop.owner_name}</p>
                  <p><strong className="text-white">Owner Email:</strong> {selectedShop.shop.owner_email}</p>
                  <p><strong className="text-white">Phone:</strong> {selectedShop.shop.phone}</p>
                  <p><strong className="text-white">GSTIN:</strong> {selectedShop.shop.gstin || 'None'}</p>
                  <p><strong className="text-white">City / State:</strong> {selectedShop.shop.city || 'India'}</p>
                  <p><strong className="text-white">Registered At:</strong> {new Date(selectedShop.shop.created_at || Date.now()).toLocaleDateString()}</p>
                </div>
              </div>

              {/* Shop Audit Activity Logs */}
              <div className="space-y-2">
                <p className="font-bold text-white text-xs uppercase tracking-wider">Recent Workspace Audit Logs</p>
                <div className="rounded-2xl bg-[#0E1711] border border-[#1F3427] p-3 max-h-48 overflow-y-auto space-y-2 text-xs">
                  {(selectedShop.activityLogs || []).length === 0 ? (
                    <p className="text-[#9EAEA3] text-center py-2">No activity logged for this workspace yet.</p>
                  ) : (
                    selectedShop.activityLogs.map((log) => (
                      <div key={log.id} className="p-2.5 rounded-xl bg-[#142319] border border-[#1F3427] flex items-start justify-between">
                        <div>
                          <p className="font-semibold text-white">{log.description}</p>
                          <p className="text-[10px] text-[#9EAEA3] font-mono mt-0.5">
                            Event: {log.event_type} • By: {log.actor_email}
                          </p>
                        </div>
                        <span className="text-[10px] text-[#6E7F74] font-mono shrink-0 ml-2">
                          {new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-[#1F3427] flex justify-end">
                <button
                  onClick={() => setSelectedShop(null)}
                  className="px-5 py-2.5 rounded-xl bg-[#142319] hover:bg-[#1A2E21] border border-[#243D2D] text-white font-bold text-xs"
                >
                  Close Profile
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* SUSPEND SHOP REASON MODAL */}
      <AnimatePresence>
        {showSuspendModal && suspendingShop && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-md w-full bg-[#142319] border border-rose-900/60 rounded-3xl p-6 shadow-2xl space-y-4"
            >
              <div className="flex items-center space-x-3 text-rose-400">
                <div className="w-10 h-10 rounded-2xl bg-rose-950/60 border border-rose-800/80 flex items-center justify-center">
                  <AlertOctagon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Suspend Retail Store Access</h3>
                  <p className="text-[11px] text-[#9EAEA3]">{suspendingShop.name}</p>
                </div>
              </div>

              <p className="text-xs text-[#C5BBA4] leading-relaxed">
                Suspending this shop will immediately block all registered store staff and owners from accessing POS billing, catalog management, or data exports until restored.
              </p>

              <div>
                <label className="block text-xs font-semibold text-[#E8DCC4] mb-1.5">
                  Administrative Suspension Reason *
                </label>
                <textarea
                  required
                  rows={3}
                  value={suspensionReason}
                  onChange={(e) => setSuspensionReason(e.target.value)}
                  placeholder="e.g. Failure to comply with Terms of Service, billing audit, or unauthorized chargeback..."
                  className="w-full p-3 rounded-xl bg-[#0E1711] border border-[#243D2D] text-xs text-white placeholder-[#6E7F74] focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="pt-3 border-t border-[#1F3427] flex items-center justify-end space-x-2">
                <button
                  onClick={() => setShowSuspendModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-[#0E1711] text-[#9EAEA3] hover:text-white text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmSuspend}
                  className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-lg"
                >
                  Confirm Suspension
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
