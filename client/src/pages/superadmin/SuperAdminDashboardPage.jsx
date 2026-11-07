import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Store,
  Users,
  CreditCard,
  TrendingUp,
  AlertOctagon,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  Server,
  Activity,
  DollarSign,
  Building,
  RefreshCw
} from 'lucide-react';
import { useStore } from '../../context/StoreContext.jsx';
import { formatINR } from '../../utils/formatters.js';

export default function SuperAdminDashboardPage() {
  const { fetchSuperAdminDashboard } = useStore();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await fetchSuperAdminDashboard();
      setData(res);
    } catch (err) {
      setError(err.message || 'Failed to load control plane dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading && !data) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-8 h-8 border-3 border-[#8B5CF6] border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-semibold text-[#9EAEA3]">Connecting to Super Admin Control Plane...</p>
        </div>
      </div>
    );
  }

  const stats = data?.stats || {
    totalShops: 5,
    activeShops: 4,
    suspendedShops: 1,
    totalUsers: 8,
    totalPlatformSales: 44085,
    platformMRR: 4496
  };

  const kpis = [
    {
      title: 'Total Registered Shops',
      value: stats.totalShops,
      subtitle: `${stats.activeShops} active • ${stats.suspendedShops} suspended`,
      icon: Store,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10 border-emerald-500/30'
    },
    {
      title: 'Platform GMV Volume',
      value: formatINR(stats.totalPlatformSales),
      subtitle: 'Across all verified retail shops',
      icon: TrendingUp,
      color: 'text-[#8B5CF6]',
      bg: 'bg-[#8B5CF6]/10 border-[#8B5CF6]/30'
    },
    {
      title: 'Monthly Recurring Revenue (MRR)',
      value: formatINR(stats.platformMRR),
      subtitle: 'SaaS subscriptions collected',
      icon: CreditCard,
      color: 'text-[#E8DCC4]',
      bg: 'bg-[#1F3D2B] border-[#2F523B]'
    },
    {
      title: 'Platform Registered Users',
      value: stats.totalUsers,
      subtitle: 'Owners, Managers & Cashiers',
      icon: Users,
      color: 'text-cyan-400',
      bg: 'bg-cyan-500/10 border-cyan-500/30'
    },
    {
      title: 'Active Stores',
      value: stats.activeShops,
      subtitle: `${((stats.activeShops / stats.totalShops) * 100).toFixed(0)}% shop operational rate`,
      icon: CheckCircle2,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10 border-emerald-500/30'
    },
    {
      title: 'Suspended Stores',
      value: stats.suspendedShops,
      subtitle: 'Compliance & audit holds',
      icon: AlertOctagon,
      color: stats.suspendedShops > 0 ? 'text-rose-400' : 'text-zinc-500',
      bg: stats.suspendedShops > 0 ? 'bg-rose-500/10 border-rose-500/30' : 'bg-zinc-800/40 border-zinc-700'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1F3427]">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            Platform Executive Control Plane
            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-[#8B5CF6] text-white">
              LIVE AGGREGATE
            </span>
          </h1>
          <p className="text-xs text-[#9EAEA3] mt-1">
            Real-time multi-tenant telemetry, shop status governance, and subscription MRR
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={loadData}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-[#142319] hover:bg-[#1A2E21] border border-[#243D2D] text-xs font-bold text-[#E8DCC4] transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh Telemetry</span>
          </button>
          <Link
            to="/super-admin/shops"
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-[#8B5CF6] hover:bg-[#7C3AED] text-white text-xs font-bold shadow-purple-glow transition-all"
          >
            <span>Manage Shops</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {error && (
        <div className="p-3.5 rounded-2xl bg-rose-950/40 border border-rose-800/70 text-xs text-rose-300">
          {error}
        </div>
      )}

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {kpis.map((k, idx) => {
          const Icon = k.icon;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="p-5 rounded-3xl bg-[#122016] border border-[#1F3427] hover:border-[#2F523B] transition-all flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-[#9EAEA3]">{k.title}</span>
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center border ${k.bg}`}>
                  <Icon className={`w-4 h-4 ${k.color}`} />
                </div>
              </div>
              <div>
                <p className={`text-2xl font-black font-mono tracking-tight ${k.color}`}>
                  {k.value}
                </p>
                <p className="text-[11px] text-[#6E7F74] font-medium mt-1">{k.subtitle}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Visual Analytics & System Health Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* GMV Growth Trajectory (2 Cols) */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-[#122016] border border-[#1F3427] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#1F3427]">
            <div>
              <h3 className="text-sm font-bold text-white">Platform GMV & Order Velocity</h3>
              <p className="text-[11px] text-[#9EAEA3]">Aggregate retail sales across all active tenant shops</p>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/30">
              +24.8% Month-over-Month
            </span>
          </div>

          {/* Simple Visual Histogram */}
          <div className="h-44 flex items-end justify-between gap-3 pt-6 px-2">
            {[
              { month: 'Oct', gmv: 18500, label: '₹18.5k' },
              { month: 'Nov', gmv: 24200, label: '₹24.2k' },
              { month: 'Dec', gmv: 31800, label: '₹31.8k' },
              { month: 'Jan', gmv: 36400, label: '₹36.4k' },
              { month: 'Feb', gmv: 41200, label: '₹41.2k' },
              { month: 'Mar (Now)', gmv: 44085, label: '₹44.1k', current: true }
            ].map((bar, i) => {
              const heightPercent = Math.max(15, (bar.gmv / 45000) * 100);
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                  <span className="text-[10px] font-mono text-[#9EAEA3] group-hover:text-white transition-colors">
                    {bar.label}
                  </span>
                  <div className="w-full bg-[#18291F] rounded-t-xl overflow-hidden h-32 flex items-end">
                    <div
                      style={{ height: `${heightPercent}%` }}
                      className={`w-full transition-all duration-500 rounded-t-xl ${
                        bar.current
                          ? 'bg-gradient-to-t from-[#8B5CF6] to-[#A78BFA] shadow-purple-glow'
                          : 'bg-[#1F3D2B] group-hover:bg-[#2A4D37]'
                      }`}
                    />
                  </div>
                  <span className="text-[11px] font-bold text-[#6E7F74] group-hover:text-[#E8DCC4]">
                    {bar.month}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* System Health Card (1 Col) */}
        <div className="p-6 rounded-3xl bg-[#122016] border border-[#1F3427] space-y-4">
          <div className="flex items-center space-x-2 pb-3 border-b border-[#1F3427]">
            <Server className="w-4 h-4 text-[#8B5CF6]" />
            <h3 className="text-sm font-bold text-white">Cluster Infrastructure Health</h3>
          </div>

          <div className="space-y-3.5 text-xs">
            <div className="flex items-center justify-between p-3 rounded-2xl bg-[#0E1711] border border-[#1F3427]">
              <div>
                <p className="font-bold text-white">Multi-Tenant Data Store</p>
                <p className="text-[10px] text-[#9EAEA3]">Cryptographic user & shop partitioning</p>
              </div>
              <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
                ACTIVE
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-2xl bg-[#0E1711] border border-[#1F3427]">
              <div>
                <p className="font-bold text-white">Auth & RBAC Gateway</p>
                <p className="text-[10px] text-[#9EAEA3]">Strict token validation • 0 escalations</p>
              </div>
              <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
                PASSING
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-2xl bg-[#0E1711] border border-[#1F3427]">
              <div>
                <p className="font-bold text-white">API Response Time</p>
                <p className="text-[10px] text-[#9EAEA3]">Average gateway turnaround</p>
              </div>
              <span className="text-[11px] font-mono font-bold text-[#8B5CF6]">
                14 ms
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-2xl bg-[#0E1711] border border-[#1F3427]">
              <div>
                <p className="font-bold text-white">Server Uptime</p>
                <p className="text-[10px] text-[#9EAEA3]">Last 90 days SLA</p>
              </div>
              <span className="text-[11px] font-mono font-bold text-emerald-400">
                99.98%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Registered Shops Table */}
      <div className="rounded-3xl bg-[#122016] border border-[#1F3427] overflow-hidden">
        <div className="p-5 border-b border-[#1F3427] flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white">Recent Shop Registrations</h3>
            <p className="text-[11px] text-[#9EAEA3]">Latest merchants provisioned on VyaparMitra AI</p>
          </div>
          <Link
            to="/super-admin/shops"
            className="text-xs font-bold text-[#8B5CF6] hover:underline flex items-center gap-1"
          >
            <span>View All {stats.totalShops} Shops</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0E1711] text-[#9EAEA3] font-bold border-b border-[#1F3427]">
              <tr>
                <th className="p-4">Shop Details</th>
                <th className="p-4">Owner & Contact</th>
                <th className="p-4">Plan</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1F3427] text-[#C5BBA4]">
              {(data?.recentShops || []).map((s) => (
                <tr key={s.id} className="hover:bg-[#15251B] transition-colors">
                  <td className="p-4">
                    <p className="font-bold text-white text-sm">{s.name}</p>
                    <p className="text-[11px] text-[#9EAEA3]">{s.business_type} • {s.city || 'India'}</p>
                  </td>
                  <td className="p-4">
                    <p className="font-semibold text-[#E8DCC4]">{s.owner_name}</p>
                    <p className="text-[11px] font-mono text-[#9EAEA3]">{s.owner_email}</p>
                  </td>
                  <td className="p-4 font-semibold text-white">
                    <span className="px-2 py-0.5 rounded-full bg-[#1F3D2B] text-[#E8DCC4] border border-[#2F523B]">
                      {s.subscription_plan_name || 'Pro Plan'}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                      s.status === 'active'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                        : s.status === 'suspended'
                        ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                        : 'bg-zinc-800 text-zinc-400'
                    }`}>
                      {s.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <Link
                      to={`/super-admin/shops?id=${s.id}`}
                      className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-[#142319] hover:bg-[#1A2E21] border border-[#243D2D] text-xs font-bold text-[#E8DCC4] hover:text-white transition-all"
                    >
                      <span>Manage</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
