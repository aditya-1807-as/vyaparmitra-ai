import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  Search,
  Filter,
  ShieldCheck,
  UserCheck,
  UserX,
  Store,
  Mail,
  Phone,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  X
} from 'lucide-react';
import { useStore } from '../../context/StoreContext.jsx';

export default function SuperAdminUsersPage() {
  const { fetchSuperAdminUsers, updateUserStatus } = useStore();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [actionSuccess, setActionSuccess] = useState('');
  const [actionError, setActionError] = useState('');

  const loadUsers = async () => {
    try {
      setLoading(true);
      const res = await fetchSuperAdminUsers({
        search: searchQuery,
        role: roleFilter,
        status: statusFilter
      });
      setUsers(res.users || []);
    } catch (err) {
      setActionError(err.message || 'Failed to fetch platform users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [searchQuery, roleFilter, statusFilter]);

  const handleToggleUserStatus = async (user) => {
    const nextStatus = user.status === 'active' ? 'deactivated' : 'active';
    try {
      setActionError('');
      await updateUserStatus(user.id, nextStatus);
      setActionSuccess(`User "${user.name}" (${user.email}) is now ${nextStatus}.`);
      await loadUsers();
    } catch (err) {
      setActionError(err.message || 'Failed to update user status');
    }
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1F3427]">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            Platform Users & Access Control
            <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-[#1F3D2B] text-[#E8DCC4] border border-[#2F523B]">
              {users.length} Users
            </span>
          </h1>
          <p className="text-xs text-[#9EAEA3] mt-1">
            Govern access permissions, inspect login roles, and activate or deactivate shop personnel
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

      {/* Filter Row */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#9EAEA3] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search users by name, email, or shop..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#122016] border border-[#1F3427] text-xs text-[#F5EFE6] placeholder-[#6E7F74] focus:outline-none focus:border-[#8B5CF6]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Role Filter */}
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-[#122016] border border-[#1F3427] text-xs text-[#E8DCC4] font-semibold focus:outline-none focus:border-[#8B5CF6]"
          >
            <option value="ALL">All Roles</option>
            <option value="Owner">Shop Owner</option>
            <option value="Manager">Store Manager</option>
            <option value="Cashier">POS Cashier</option>
            <option value="super_admin">Super Admin</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-[#122016] border border-[#1F3427] text-xs text-[#E8DCC4] font-semibold focus:outline-none focus:border-[#8B5CF6]"
          >
            <option value="ALL">All Statuses</option>
            <option value="active">Active Only</option>
            <option value="deactivated">Deactivated Only</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="rounded-3xl bg-[#122016] border border-[#1F3427] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0E1711] text-[#9EAEA3] font-bold border-b border-[#1F3427]">
              <tr>
                <th className="p-4">User Identity</th>
                <th className="p-4">Assigned Shop</th>
                <th className="p-4">Platform Role</th>
                <th className="p-4">Clearance</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1F3427] text-[#C5BBA4]">
              {users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-[#9EAEA3]">
                    No users found matching your filters.
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u.id} className="hover:bg-[#15251B] transition-colors">
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-xl font-bold text-xs flex items-center justify-center shrink-0 ${
                          u.is_superadmin ? 'bg-[#8B5CF6] text-white shadow-purple-glow' : 'bg-[#1F3D2B] text-[#E8DCC4] border border-[#2F523B]'
                        }`}>
                          {u.name?.slice(0, 2).toUpperCase() || 'US'}
                        </div>
                        <div>
                          <p className="font-bold text-white text-sm">{u.name}</p>
                          <p className="text-[11px] text-[#9EAEA3] font-mono">{u.email}</p>
                        </div>
                      </div>
                    </td>

                    <td className="p-4">
                      <p className="font-semibold text-white">{u.shop_name}</p>
                      <p className="text-[10px] text-[#6E7F74] font-mono">{u.shop_id || 'Platform Operations'}</p>
                    </td>

                    <td className="p-4 font-semibold text-white capitalize">
                      {u.role}
                    </td>

                    <td className="p-4">
                      {u.is_superadmin ? (
                        <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-[#8B5CF6]/20 text-[#8B5CF6] border border-[#8B5CF6]/40 text-[10px] font-black uppercase">
                          <ShieldCheck className="w-3 h-3" />
                          <span>SUPER ADMIN</span>
                        </span>
                      ) : (
                        <span className="text-[#9EAEA3] text-[11px]">Tenant User</span>
                      )}
                    </td>

                    <td className="p-4 text-center">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                        u.status === 'active'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                          : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                      }`}>
                        {u.status || 'active'}
                      </span>
                    </td>

                    <td className="p-4 text-right">
                      {u.is_superadmin ? (
                        <span className="text-[10px] text-[#6E7F74] font-mono">Protected</span>
                      ) : (
                        <button
                          onClick={() => handleToggleUserStatus(u)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                            u.status === 'active'
                              ? 'bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-800/80'
                              : 'bg-emerald-950/40 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-800/80'
                          }`}
                        >
                          {u.status === 'active' ? 'Deactivate' : 'Activate'}
                        </button>
                      )}
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
