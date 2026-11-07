import React, { useState } from 'react';
import { 
  Settings, 
  Users, 
  Store, 
  ShieldCheck, 
  Plus, 
  Edit2, 
  Trash2, 
  CheckCircle2, 
  XCircle, 
  Lock, 
  CreditCard,
  Building2,
  Phone,
  Mail,
  MapPin,
  Sparkles
} from 'lucide-react';
import { useStore } from '../../context/StoreContext.jsx';
import Modal from '../../components/ui/Modal.jsx';
import Badge from '../../components/ui/Badge.jsx';
import { formatINR, formatDate } from '../../utils/formatters.js';
import { useSearchParams, Link } from 'react-router-dom';

export default function AdminSettingsPage() {
  const { 
    shop, 
    updateShop, 
    employees, 
    addEmployee, 
    updateEmployee, 
    deleteEmployee,
    currentUser,
    platformShops
  } = useStore();

  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'employees'; // 'employees' | 'settings' | 'superadmin'

  // Modals
  const [isAddEmployeeModalOpen, setIsAddEmployeeModalOpen] = useState(false);
  const [isEditEmployeeModalOpen, setIsEditEmployeeModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  // Forms
  const [employeeForm, setEmployeeForm] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'Cashier'
  });

  const [shopForm, setShopForm] = useState({
    name: shop.name,
    tagline: shop.tagline,
    business_type: shop.business_type,
    gstin: shop.gstin,
    phone: shop.phone,
    email: shop.email,
    address: shop.address,
    city: shop.city,
    state: shop.state,
    pincode: shop.pincode,
    invoice_prefix: shop.invoice_prefix,
    receipt_footer_note: shop.receipt_footer_note
  });
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Handlers
  const handleOpenAddEmployee = () => {
    setEmployeeForm({ name: '', email: '', phone: '', role: 'Cashier' });
    setIsAddEmployeeModalOpen(true);
  };

  const handleOpenEditEmployee = (emp) => {
    setSelectedEmployee(emp);
    setEmployeeForm({
      name: emp.name,
      email: emp.email,
      phone: emp.phone,
      role: emp.role
    });
    setIsEditEmployeeModalOpen(true);
  };

  const handleSaveAddEmployee = (e) => {
    e.preventDefault();
    if (!employeeForm.name || !employeeForm.email) return;
    addEmployee(employeeForm);
    setIsAddEmployeeModalOpen(false);
  };

  const handleSaveEditEmployee = (e) => {
    e.preventDefault();
    if (!selectedEmployee || !employeeForm.name) return;
    updateEmployee(selectedEmployee.id, employeeForm);
    setIsEditEmployeeModalOpen(false);
  };

  const handleDeleteEmployee = (emp) => {
    if (emp.role === 'Owner') {
      alert('The Store Owner account cannot be removed!');
      return;
    }
    if (window.confirm(`Remove employee "${emp.name}" from store team?`)) {
      deleteEmployee(emp.id);
    }
  };

  const handleSaveShopSettings = (e) => {
    e.preventDefault();
    updateShop(shopForm);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  // RBAC Matrix
  const permissionsMatrix = [
    { module: 'Overview Dashboard & Financial KPIs', owner: true, manager: true, cashier: false, inventory: false },
    { module: 'POS Terminal & Counter Billing', owner: true, manager: true, cashier: true, inventory: false },
    { module: 'Invoices & Sales History', owner: true, manager: true, cashier: true, inventory: false },
    { module: 'Product Catalog & Pricing Edits', owner: true, manager: true, cashier: false, inventory: true },
    { module: 'Stock Movements & Adjustments', owner: true, manager: true, cashier: false, inventory: true },
    { module: 'Customer Directory & Udhaar Ledger', owner: true, manager: true, cashier: false, inventory: false },
    { module: 'Record Customer Udhaar Payments', owner: true, manager: true, cashier: true, inventory: false },
    { module: 'Wholesale Purchase Orders & PO Creation', owner: true, manager: true, cashier: false, inventory: true },
    { module: 'Suppliers Directory & Vendor Dues', owner: true, manager: true, cashier: false, inventory: true },
    { module: 'AI Business Advisor & Strategic Forecasts', owner: true, manager: true, cashier: false, inventory: false },
    { module: 'Profit & Loss Reports & Tax Exports', owner: true, manager: true, cashier: false, inventory: false },
    { module: 'Employee Roles & System Permissions', owner: true, manager: false, cashier: false, inventory: false }
  ];

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-sand-100 tracking-tight">Shop Administration & Access Control</h2>
          <p className="text-xs text-sand-300/70">Employee roles, access control matrix, shop profile, and multi-tenant platform super-admin</p>
        </div>

        <div className="flex items-center space-x-2">
          {activeTab === 'employees' && (
            <button
              onClick={handleOpenAddEmployee}
              className="px-4 py-2 rounded-xl bg-forest-700 hover:bg-forest-600 text-sand-100 text-xs font-bold transition-colors flex items-center space-x-1.5 shadow-sm border border-forest-500/30"
            >
              <Plus className="w-4 h-4 text-sand-200" />
              <span>Add Staff Member</span>
            </button>
          )}
        </div>
      </div>

      {/* NAVIGATION TABS */}
      <div className="flex border-b border-[#243D2D] space-x-6 text-sm font-bold">
        <button
          onClick={() => setSearchParams({ tab: 'employees' })}
          className={`pb-3 relative transition-colors ${activeTab === 'employees' ? 'text-sand-100 border-b-2 border-electric-500' : 'text-sand-300/60 hover:text-sand-100'}`}
        >
          Staff & Roles ({employees.length})
        </button>
        <button
          onClick={() => setSearchParams({ tab: 'settings' })}
          className={`pb-3 relative transition-colors ${activeTab === 'settings' ? 'text-sand-100 border-b-2 border-electric-500' : 'text-sand-300/60 hover:text-sand-100'}`}
        >
          Shop Profile & Tax Settings
        </button>
        <button
          onClick={() => setSearchParams({ tab: 'superadmin' })}
          className={`pb-3 relative transition-colors flex items-center space-x-1.5 ${activeTab === 'superadmin' ? 'text-electric-400 border-b-2 border-electric-400' : 'text-sand-300/60 hover:text-electric-400'}`}
        >
          <ShieldCheck className="w-4 h-4 text-electric-400" />
          <span>Platform Super Admin</span>
        </button>
      </div>

      {/* TAB 1: EMPLOYEES & ROLE BASED ACCESS CONTROL (RBAC) */}
      {activeTab === 'employees' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {employees.map(emp => (
              <div key={emp.id} className="bg-[#142319] p-5 rounded-3xl border border-[#243D2D] shadow-card flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex justify-between items-start">
                    <div className="w-10 h-10 rounded-2xl bg-[#18291E] border border-[#243D2D] text-sand-200 font-extrabold flex items-center justify-center text-sm">
                      {emp.name.slice(0, 2).toUpperCase()}
                    </div>
                    <Badge variant={emp.role === 'Owner' ? 'purple' : (emp.role === 'Manager' ? 'forest' : 'sand')}>
                      {emp.role}
                    </Badge>
                  </div>
                  <h4 className="text-sm font-extrabold text-sand-100 mt-3">{emp.name}</h4>
                  <p className="text-xs text-sand-300/70 mt-0.5">{emp.email}</p>
                  <p className="text-xs text-sand-300/50 mt-0.5">{emp.phone}</p>
                </div>

                <div className="pt-3 border-t border-[#243D2D] flex justify-between items-center text-xs">
                  <span className="text-sand-300/50">Joined: {emp.joined_at}</span>
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => handleOpenEditEmployee(emp)}
                      className="p-1 text-sand-300 hover:text-white"
                      title="Edit Member"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    {emp.role !== 'Owner' && (
                      <button
                        onClick={() => handleDeleteEmployee(emp)}
                        className="p-1 text-rose-400/70 hover:text-rose-400"
                        title="Remove Member"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* RBAC PERMISSIONS MATRIX */}
          <div className="bg-[#142319] rounded-3xl border border-[#243D2D] shadow-card p-6 space-y-4">
            <div>
              <h3 className="text-base font-bold text-sand-100">Role-Based Access Control (RBAC) Matrix</h3>
              <p className="text-xs text-sand-300/70">Fine-grained permission privileges assigned per store operational staff role</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#243D2D] bg-[#18291E] text-sand-300/60 uppercase font-semibold">
                    <th className="py-3 px-4">Business Capability / Route</th>
                    <th className="py-3 px-4 text-center">Owner</th>
                    <th className="py-3 px-4 text-center">Manager</th>
                    <th className="py-3 px-4 text-center">Cashier (POS)</th>
                    <th className="py-3 px-4 text-center">Inventory Manager</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#243D2D]">
                  {permissionsMatrix.map((p, idx) => (
                    <tr key={idx} className="hover:bg-[#1A2E21]">
                      <td className="py-3 px-4 font-semibold text-sand-200">{p.module}</td>
                      <td className="py-3 px-4 text-center">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 mx-auto" />
                      </td>
                      <td className="py-3 px-4 text-center">
                        {p.manager ? <CheckCircle2 className="w-4 h-4 text-emerald-400 mx-auto" /> : <XCircle className="w-4 h-4 text-sand-300/30 mx-auto" />}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {p.cashier ? <CheckCircle2 className="w-4 h-4 text-emerald-400 mx-auto" /> : <XCircle className="w-4 h-4 text-sand-300/30 mx-auto" />}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {p.inventory ? <CheckCircle2 className="w-4 h-4 text-emerald-400 mx-auto" /> : <XCircle className="w-4 h-4 text-sand-300/30 mx-auto" />}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SHOP PROFILE & SETTINGS */}
      {activeTab === 'settings' && (
        <div className="bg-[#142319] rounded-3xl border border-[#243D2D] shadow-card p-6 max-w-4xl space-y-6">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-base font-bold text-sand-100">Store Profile & Tax Master Data</h3>
              <p className="text-xs text-sand-300/70">Configure your business details printed on customer invoices and receipts</p>
            </div>
            {saveSuccess && (
              <span className="px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/50 text-emerald-400 text-xs font-bold">
                Saved Successfully!
              </span>
            )}
          </div>

          <form onSubmit={handleSaveShopSettings} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-sand-200 mb-1">Store / Business Trade Name *</label>
                <input
                  type="text"
                  required
                  value={shopForm.name}
                  onChange={e => setShopForm({ ...shopForm, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#18291E] border border-[#243D2D] text-xs font-bold text-sand-100"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-sand-200 mb-1">Tagline</label>
                <input
                  type="text"
                  value={shopForm.tagline}
                  onChange={e => setShopForm({ ...shopForm, tagline: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#18291E] border border-[#243D2D] text-xs text-sand-100"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-sand-200 mb-1">Business Classification</label>
                <input
                  type="text"
                  value={shopForm.business_type}
                  onChange={e => setShopForm({ ...shopForm, business_type: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#18291E] border border-[#243D2D] text-xs text-sand-100"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-sand-200 mb-1">GSTIN Number</label>
                <input
                  type="text"
                  value={shopForm.gstin}
                  onChange={e => setShopForm({ ...shopForm, gstin: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#18291E] border border-[#243D2D] text-xs font-mono font-bold text-sand-100"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-sand-200 mb-1">Store Helpline Phone</label>
                <input
                  type="text"
                  value={shopForm.phone}
                  onChange={e => setShopForm({ ...shopForm, phone: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#18291E] border border-[#243D2D] text-xs text-sand-100"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-sand-200 mb-1">Support Email</label>
                <input
                  type="email"
                  value={shopForm.email}
                  onChange={e => setShopForm({ ...shopForm, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#18291E] border border-[#243D2D] text-xs text-sand-100"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-sand-200 mb-1">Physical Address</label>
                <input
                  type="text"
                  value={shopForm.address}
                  onChange={e => setShopForm({ ...shopForm, address: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#18291E] border border-[#243D2D] text-xs text-sand-100"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-sand-200 mb-1">City</label>
                <input
                  type="text"
                  value={shopForm.city}
                  onChange={e => setShopForm({ ...shopForm, city: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#18291E] border border-[#243D2D] text-xs text-sand-100"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-sand-200 mb-1">State & Pincode</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={shopForm.state}
                    onChange={e => setShopForm({ ...shopForm, state: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#18291E] border border-[#243D2D] text-xs text-sand-100"
                  />
                  <input
                    type="text"
                    value={shopForm.pincode}
                    onChange={e => setShopForm({ ...shopForm, pincode: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#18291E] border border-[#243D2D] text-xs font-mono text-sand-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-sand-200 mb-1">Invoice Prefix</label>
                <input
                  type="text"
                  value={shopForm.invoice_prefix}
                  onChange={e => setShopForm({ ...shopForm, invoice_prefix: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#18291E] border border-[#243D2D] text-xs font-mono font-bold text-sand-100"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-sand-200 mb-1">Receipt Footer Note</label>
                <textarea
                  rows="2"
                  value={shopForm.receipt_footer_note}
                  onChange={e => setShopForm({ ...shopForm, receipt_footer_note: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#18291E] border border-[#243D2D] text-xs text-sand-100"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-[#243D2D] flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 bg-forest-700 hover:bg-forest-600 text-sand-100 rounded-xl text-xs font-bold transition-colors shadow-sm border border-forest-500/30"
              >
                Save Shop Profile
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 3: PLATFORM-LEVEL SUPER ADMIN VIEW */}
      {activeTab === 'superadmin' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-gradient-to-r from-[#142319] via-[#1B3224] to-[#2E1065] text-white shadow-card border border-electric-500/30">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-electric-600 flex items-center justify-center shadow-purple-glow">
                <ShieldCheck className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-sand-100">VyaparMitra AI SaaS Platform Control Plane</h3>
                <p className="text-xs text-electric-300">
                  Global multi-tenant overview across registered retail shops in India
                </p>
                <Link
                  to="/super-admin/dashboard"
                  className="inline-flex items-center space-x-1.5 mt-2.5 py-1.5 px-3 rounded-xl bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-bold text-xs shadow-purple-glow transition-all"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Open Dedicated Super Admin Portal →</span>
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mt-6">
              <div className="p-4 rounded-2xl bg-[#18291E] border border-[#243D2D]">
                <p className="text-[11px] font-bold text-electric-300 uppercase">Registered Shops</p>
                <p className="text-2xl font-black mt-1 font-mono text-sand-100">{platformShops.length}</p>
              </div>
              <div className="p-4 rounded-2xl bg-[#18291E] border border-[#243D2D]">
                <p className="text-[11px] font-bold text-electric-300 uppercase">Active Subscriptions</p>
                <p className="text-2xl font-black mt-1 font-mono text-sand-100">{platformShops.filter(s => s.status === 'Active').length}</p>
              </div>
              <div className="p-4 rounded-2xl bg-[#18291E] border border-[#243D2D]">
                <p className="text-[11px] font-bold text-electric-300 uppercase">Platform MRR (INR)</p>
                <p className="text-2xl font-black mt-1 font-mono text-emerald-400">
                  {formatINR(platformShops.reduce((sum, s) => sum + s.mrr, 0))}
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-[#18291E] border border-[#243D2D]">
                <p className="text-[11px] font-bold text-electric-300 uppercase">Avg LTV per Tenant</p>
                <p className="text-2xl font-black mt-1 font-mono text-sand-200">₹14,990</p>
              </div>
            </div>
          </div>

          {/* Tenants List */}
          <div className="bg-[#142319] rounded-3xl border border-[#243D2D] shadow-card overflow-hidden">
            <div className="p-4 bg-[#18291E] border-b border-[#243D2D]">
              <h4 className="text-xs font-bold text-sand-200 uppercase tracking-wider">Registered Tenant Shops</h4>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#243D2D] bg-[#18291E] text-sand-300/60 uppercase font-semibold">
                    <th className="py-3 px-4">Shop Trade Name</th>
                    <th className="py-3 px-4">Location</th>
                    <th className="py-3 px-4">Active Plan</th>
                    <th className="py-3 px-4 text-right">Monthly Subscription</th>
                    <th className="py-3 px-4 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#243D2D]">
                  {platformShops.map(s => (
                    <tr key={s.id} className="hover:bg-[#1A2E21]">
                      <td className="py-3.5 px-4 font-bold text-sand-100">{s.name}</td>
                      <td className="py-3.5 px-4 text-sand-300/70">{s.city}, {s.state}</td>
                      <td className="py-3.5 px-4">
                        <Badge variant="purple">{s.plan}</Badge>
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono font-bold text-sand-100">{formatINR(s.mrr)} / mo</td>
                      <td className="py-3.5 px-4 text-center">
                        <Badge variant="success">{s.status}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADD / EDIT EMPLOYEE */}
      <Modal
        isOpen={isAddEmployeeModalOpen || isEditEmployeeModalOpen}
        onClose={() => { setIsAddEmployeeModalOpen(false); setIsEditEmployeeModalOpen(false); }}
        title={isAddEmployeeModalOpen ? "Add New Staff Member" : `Edit Member: ${selectedEmployee?.name}`}
        subtitle="Assign roles and operational access rights"
      >
        <form onSubmit={isAddEmployeeModalOpen ? handleSaveAddEmployee : handleSaveEditEmployee} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-sand-200 mb-1">Full Name *</label>
            <input
              type="text"
              required
              value={employeeForm.name}
              onChange={e => setEmployeeForm({ ...employeeForm, name: e.target.value })}
              placeholder="e.g. Suresh Patel"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#18291E] border border-[#243D2D] text-sand-100 text-xs focus:outline-none focus:ring-2 focus:ring-forest-600/30"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-sand-200 mb-1">Staff Role *</label>
            <select
              value={employeeForm.role}
              onChange={e => setEmployeeForm({ ...employeeForm, role: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#18291E] border border-[#243D2D] text-sand-100 text-xs font-semibold cursor-pointer"
            >
              <option value="Manager">Manager (Reports, Inventory, Catalog, Sales)</option>
              <option value="Cashier">Cashier (POS Terminal & Invoice Print)</option>
              <option value="Inventory Manager">Inventory Manager (Stock In, Purchases, Audits)</option>
              <option value="Owner">Owner (Full Administrative Access)</option>
            </select>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-sand-200 mb-1">Email Address *</label>
              <input
                type="email"
                required
                value={employeeForm.email}
                onChange={e => setEmployeeForm({ ...employeeForm, email: e.target.value })}
                placeholder="staff@store.in"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#18291E] border border-[#243D2D] text-sand-100 text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-sand-200 mb-1">Mobile Phone *</label>
              <input
                type="tel"
                required
                value={employeeForm.phone}
                onChange={e => setEmployeeForm({ ...employeeForm, phone: e.target.value })}
                placeholder="+91 98450 00000"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#18291E] border border-[#243D2D] text-sand-100 text-xs"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-[#243D2D] flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => { setIsAddEmployeeModalOpen(false); setIsEditEmployeeModalOpen(false); }}
              className="px-4 py-2 text-xs font-bold text-sand-300 hover:text-white hover:bg-[#18291E] rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold bg-forest-700 hover:bg-forest-600 text-sand-100 rounded-xl border border-forest-500/30"
            >
              {isAddEmployeeModalOpen ? "Add Staff Member" : "Update Profile"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
