import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Activity,
  Search,
  Filter,
  ShieldAlert,
  Store,
  UserCheck,
  Settings,
  Clock,
  RefreshCw,
  FileText
} from 'lucide-react';
import { useStore } from '../../context/StoreContext.jsx';

export default function SuperAdminActivityPage() {
  const { fetchSuperAdminActivity } = useStore();

  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [eventTypeFilter, setEventTypeFilter] = useState('ALL');

  const loadLogs = async () => {
    try {
      setLoading(true);
      const res = await fetchSuperAdminActivity({
        eventType: eventTypeFilter !== 'ALL' ? eventTypeFilter : undefined
      });
      setLogs(res.activityLogs || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, [eventTypeFilter]);

  const getEventBadge = (type) => {
    if (type?.includes('SUSPENDED')) {
      return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
    }
    if (type?.includes('ACTIVATED') || type?.includes('REGISTERED')) {
      return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
    }
    if (type?.includes('LOGIN')) {
      return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40';
    }
    return 'bg-[#8B5CF6]/20 text-[#8B5CF6] border-[#8B5CF6]/40';
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1F3427]">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            Platform Audit Trail & Activity
            <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-[#1F3D2B] text-[#E8DCC4] border border-[#2F523B]">
              Immutable Logs
            </span>
          </h1>
          <p className="text-xs text-[#9EAEA3] mt-1">
            Complete compliance logging of administrative actions, shop status shifts, and security events
          </p>
        </div>

        <button
          onClick={loadLogs}
          className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-[#142319] hover:bg-[#1A2E21] border border-[#243D2D] text-xs font-bold text-[#E8DCC4] transition-all"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Reload Stream</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1">
        {[
          { id: 'ALL', label: 'All Events' },
          { id: 'SHOP_SUSPENDED', label: 'Shop Suspensions' },
          { id: 'SHOP_ACTIVATED', label: 'Shop Restorations' },
          { id: 'USER_LOGIN', label: 'Logins' },
          { id: 'SHOP_REGISTERED', label: 'New Registrations' },
          { id: 'PLATFORM_SETTINGS_UPDATED', label: 'Settings Modified' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setEventTypeFilter(tab.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              eventTypeFilter === tab.id
                ? 'bg-[#8B5CF6] text-white shadow-purple-glow'
                : 'bg-[#122016] text-[#9EAEA3] hover:text-white border border-[#1F3427]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Logs Table */}
      <div className="rounded-3xl bg-[#122016] border border-[#1F3427] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0E1711] text-[#9EAEA3] font-bold border-b border-[#1F3427]">
              <tr>
                <th className="p-4">Timestamp</th>
                <th className="p-4">Event Type</th>
                <th className="p-4">Actor</th>
                <th className="p-4">Description</th>
                <th className="p-4">Target Workspace</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1F3427] text-[#C5BBA4]">
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-[#9EAEA3]">
                    No audit logs matching selected filter.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-[#15251B] transition-colors">
                    <td className="p-4 font-mono text-[11px] text-[#9EAEA3] whitespace-nowrap">
                      {new Date(log.created_at).toLocaleString()}
                    </td>

                    <td className="p-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase border ${getEventBadge(log.event_type)}`}>
                        {log.event_type}
                      </span>
                    </td>

                    <td className="p-4">
                      <p className="font-semibold text-white">{log.actor_email}</p>
                      <p className="text-[10px] text-[#6E7F74] font-mono">ID: {log.actor_id || 'system'}</p>
                    </td>

                    <td className="p-4 max-w-md">
                      <p className="text-white leading-relaxed">{log.description}</p>
                      {log.metadata && Object.keys(log.metadata).length > 0 && (
                        <p className="text-[10px] text-[#8B5CF6] font-mono mt-0.5 truncate">
                          Meta: {JSON.stringify(log.metadata)}
                        </p>
                      )}
                    </td>

                    <td className="p-4 font-mono text-xs text-[#E8DCC4]">
                      {log.shop_id || 'Platform Wide'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
