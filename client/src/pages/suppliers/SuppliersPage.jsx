import React, { useState, useMemo } from 'react';
import { 
  Truck, 
  Search, 
  Plus, 
  Receipt, 
  Phone, 
  MapPin, 
  IndianRupee, 
  Edit2, 
  Trash2, 
  Download, 
  CheckCircle2, 
  Package, 
  Calendar,
  AlertTriangle
} from 'lucide-react';
import { useStore } from '../../context/StoreContext.jsx';
import Modal from '../../components/ui/Modal.jsx';
import Badge from '../../components/ui/Badge.jsx';
import { formatINR, formatDateTime, formatDate, downloadCSV } from '../../utils/formatters.js';
import { useSearchParams } from 'react-router-dom';

export default function SuppliersPage() {
  const { 
    suppliers, 
    purchases, 
    products, 
    addSupplier, 
    updateSupplier, 
    deleteSupplier, 
    completePurchase,
    totalSupplierDue
  } = useStore();

  const [searchParams, setSearchParams] = useSearchParams();
  const currentTab = searchParams.get('tab') || 'list'; // 'list' | 'purchases'

  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [isAddSupplierModalOpen, setIsAddSupplierModalOpen] = useState(false);
  const [isEditSupplierModalOpen, setIsEditSupplierModalOpen] = useState(false);
  const [isNewPurchaseModalOpen, setIsNewPurchaseModalOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);

  // Forms
  const [supplierForm, setSupplierForm] = useState({
    name: '',
    contact_person: '',
    phone: '',
    email: '',
    address: '',
    gstin: '',
    lead_time_days: 3
  });

  // Purchase Order Entry Form State
  const [poForm, setPoForm] = useState({
    supplier_id: suppliers[0]?.id || '',
    invoice_number: `PO-${Date.now().toString().slice(-5)}`,
    items: [],
    paid_amount: '',
    payment_method: 'BANK_TRANSFER'
  });

  const [poItemInput, setPoItemInput] = useState({
    product_id: products[0]?.id || '',
    quantity: '10',
    unit_cost: products[0]?.purchase_price || '100'
  });

  // Filtered Suppliers
  const filteredSuppliers = useMemo(() => {
    return suppliers.filter(s => {
      return s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.phone.includes(searchQuery) ||
        (s.contact_person && s.contact_person.toLowerCase().includes(searchQuery.toLowerCase()));
    });
  }, [suppliers, searchQuery]);

  // Handlers
  const handleOpenAddSupplier = () => {
    setSupplierForm({ name: '', contact_person: '', phone: '', email: '', address: '', gstin: '', lead_time_days: 3 });
    setIsAddSupplierModalOpen(true);
  };

  const handleOpenEditSupplier = (sup) => {
    setSelectedSupplier(sup);
    setSupplierForm({
      name: sup.name,
      contact_person: sup.contact_person || '',
      phone: sup.phone,
      email: sup.email || '',
      address: sup.address || '',
      gstin: sup.gstin || '',
      lead_time_days: sup.lead_time_days || 3
    });
    setIsEditSupplierModalOpen(true);
  };

  const handleSaveSupplierAdd = (e) => {
    e.preventDefault();
    if (!supplierForm.name || !supplierForm.phone) return;
    addSupplier(supplierForm);
    setIsAddSupplierModalOpen(false);
  };

  const handleSaveSupplierEdit = (e) => {
    e.preventDefault();
    if (!selectedSupplier || !supplierForm.name) return;
    updateSupplier(selectedSupplier.id, supplierForm);
    setIsEditSupplierModalOpen(false);
  };

  const handleDeleteSupplier = (sup) => {
    if (sup.balance_due > 0) {
      alert(`Cannot delete supplier "${sup.name}" while there is a pending balance due of ${formatINR(sup.balance_due)}.`);
      return;
    }
    if (window.confirm(`Are you sure you want to delete supplier "${sup.name}"?`)) {
      deleteSupplier(sup.id);
    }
  };

  // Purchase workflow item addition
  const handleAddPoItem = () => {
    const prod = products.find(p => p.id === poItemInput.product_id);
    if (!prod) return;
    const qty = Number(poItemInput.quantity);
    const cost = Number(poItemInput.unit_cost);
    if (qty <= 0 || cost < 0) return;

    setPoForm(prev => ({
      ...prev,
      items: [
        ...prev.items,
        {
          product_id: prod.id,
          product_name: prod.name,
          quantity: qty,
          unit_cost: cost,
          total_cost: qty * cost
        }
      ]
    }));
  };

  const handleRemovePoItem = (index) => {
    setPoForm(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const poSubtotal = poForm.items.reduce((sum, item) => sum + item.total_cost, 0);
  const poTax = Math.round(poSubtotal * 0.05 * 100) / 100;
  const poTotal = poSubtotal + poTax;

  const handleCompletePO = (e) => {
    e.preventDefault();
    if (poForm.items.length === 0) {
      alert('Please add at least one product item to the purchase order.');
      return;
    }

    const sup = suppliers.find(s => s.id === poForm.supplier_id);
    const paidAmt = Number(poForm.paid_amount || poTotal);

    completePurchase({
      supplier_id: poForm.supplier_id,
      supplier_name: sup ? sup.name : 'Wholesaler',
      invoice_number: poForm.invoice_number,
      subtotal: poSubtotal,
      tax_amount: poTax,
      total_amount: poTotal,
      paid_amount: paidAmt,
      payment_method: poForm.payment_method,
      items: poForm.items
    });

    setIsNewPurchaseModalOpen(false);
    setPoForm({
      supplier_id: suppliers[0]?.id || '',
      invoice_number: `PO-${Date.now().toString().slice(-5)}`,
      items: [],
      paid_amount: '',
      payment_method: 'BANK_TRANSFER'
    });
  };

  const handleExportCSV = () => {
    const rows = purchases.map(p => ({
      ID: p.id,
      Supplier: p.supplier_name,
      InvoiceNumber: p.invoice_number,
      Date: p.purchase_date,
      Subtotal: p.subtotal,
      Tax: p.tax_amount,
      TotalAmount: p.total_amount,
      PaidAmount: p.paid_amount,
      PaymentStatus: p.payment_status
    }));
    downloadCSV('VyaparMitra_Purchase_Records', rows);
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-sand-100 tracking-tight">Suppliers & Purchase Management</h2>
          <p className="text-xs text-sand-300/70">Manage FMCG distributors, generate purchase orders, track payables & auto-update inventory</p>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 rounded-xl bg-[#142319] border border-[#243D2D] text-sand-200 text-xs font-semibold hover:bg-[#1A2E21] transition-colors flex items-center space-x-1.5 shadow-card"
          >
            <Download className="w-3.5 h-3.5 text-sand-300" />
            <span>Export Orders</span>
          </button>
          <button
            onClick={() => {
              setPoForm({
                supplier_id: suppliers[0]?.id || '',
                invoice_number: `PO-${Date.now().toString().slice(-5)}`,
                items: [],
                paid_amount: '',
                payment_method: 'BANK_TRANSFER'
              });
              setIsNewPurchaseModalOpen(true);
            }}
            className="px-4 py-2 rounded-xl bg-forest-700 hover:bg-forest-600 text-sand-100 text-xs font-bold transition-colors flex items-center space-x-1.5 shadow-sm border border-forest-500/30"
          >
            <Plus className="w-4 h-4 text-sand-200" />
            <span>New Purchase Entry</span>
          </button>
        </div>
      </div>

      {/* METRIC RIBBON */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#142319] p-5 rounded-2xl border border-[#243D2D] shadow-card">
          <p className="text-[11px] font-bold text-sand-300/60 uppercase tracking-wider">Outstanding Supplier Payables</p>
          <p className="text-2xl font-extrabold text-rose-400 mt-1 font-mono">{formatINR(totalSupplierDue)}</p>
          <p className="text-xs text-sand-300/70 mt-1 font-medium">Pending balances due to distributors</p>
        </div>
        <div className="bg-[#142319] p-5 rounded-2xl border border-[#243D2D] shadow-card">
          <p className="text-[11px] font-bold text-sand-300/60 uppercase tracking-wider">Active Wholesalers</p>
          <p className="text-2xl font-extrabold text-sand-100 mt-1">{suppliers.length} Distributors</p>
          <p className="text-xs text-sand-300/70 mt-1 font-medium">HUL, ITC, Fortune, Tata Consumer</p>
        </div>
        <div className="bg-[#142319] p-5 rounded-2xl border border-[#243D2D] shadow-card">
          <p className="text-[11px] font-bold text-sand-300/60 uppercase tracking-wider">Total Purchase Volume</p>
          <p className="text-2xl font-extrabold text-sand-100 mt-1 font-mono">
            {formatINR(purchases.reduce((sum, p) => sum + (p.total_amount || 0), 0))}
          </p>
          <p className="text-xs text-sand-300/70 mt-1 font-medium">{purchases.length} recorded restocking entries</p>
        </div>
      </div>

      {/* NAVIGATION TABS */}
      <div className="flex border-b border-[#243D2D] space-x-6 text-sm font-bold">
        <button
          onClick={() => setSearchParams({ tab: 'list' })}
          className={`pb-3 relative transition-colors ${currentTab === 'list' ? 'text-sand-100 border-b-2 border-electric-500' : 'text-sand-300/60 hover:text-sand-100'}`}
        >
          Distributor Directory ({suppliers.length})
        </button>
        <button
          onClick={() => setSearchParams({ tab: 'purchases' })}
          className={`pb-3 relative transition-colors ${currentTab === 'purchases' ? 'text-sand-100 border-b-2 border-electric-500' : 'text-sand-300/60 hover:text-sand-100'}`}
        >
          Purchase Records & Stock-In ({purchases.length})
        </button>
      </div>

      {/* TAB 1: SUPPLIERS DIRECTORY */}
      {currentTab === 'list' && (
        <div className="space-y-4">
          <div className="bg-[#142319] p-4 rounded-3xl border border-[#243D2D] shadow-card flex justify-between items-center">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-sand-300/50" />
              <input
                type="text"
                placeholder="Search suppliers by company name or phone..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-[#18291E] border border-[#243D2D] rounded-xl text-xs text-sand-100 placeholder:text-sand-300/40 focus:outline-none focus:ring-2 focus:ring-forest-600/30"
              />
            </div>
            <button
              onClick={handleOpenAddSupplier}
              className="px-3.5 py-2 rounded-xl bg-forest-700 hover:bg-forest-600 text-sand-100 text-xs font-bold transition-colors flex items-center space-x-1 border border-forest-500/30"
            >
              <Plus className="w-4 h-4 text-sand-200" />
              <span>Add Supplier</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSuppliers.map(sup => (
              <div key={sup.id} className="bg-[#142319] p-5 rounded-3xl border border-[#243D2D] shadow-card flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-sm font-extrabold text-sand-100">{sup.name}</h4>
                      {sup.contact_person && (
                        <p className="text-xs text-sand-300/70 font-medium mt-0.5">Contact: {sup.contact_person}</p>
                      )}
                    </div>
                    <Badge variant={sup.balance_due > 0 ? 'warning' : 'success'}>
                      {sup.balance_due > 0 ? 'Balance Due' : 'Settled'}
                    </Badge>
                  </div>

                  <div className="mt-3 space-y-1 text-xs text-sand-300/80">
                    <p className="flex items-center"><Phone className="w-3 h-3 mr-1 text-sand-300/50" /> {sup.phone}</p>
                    <p className="flex items-center truncate"><MapPin className="w-3 h-3 mr-1 text-sand-300/50 shrink-0" /> {sup.address}</p>
                    {sup.gstin && <p className="font-mono text-[11px] text-sand-300/60">GSTIN: {sup.gstin}</p>}
                  </div>
                </div>

                <div className="pt-3 border-t border-[#243D2D] flex items-center justify-between">
                  <div>
                    <p className="text-[10px] text-sand-300/60 uppercase font-bold">Outstanding Payable</p>
                    <p className="text-sm font-extrabold font-mono text-rose-400">{formatINR(sup.balance_due)}</p>
                  </div>

                  <div className="flex items-center space-x-1.5">
                    <button
                      onClick={() => handleOpenEditSupplier(sup)}
                      className="p-1.5 text-sand-300 hover:text-white hover:bg-[#1E3426] rounded-lg transition-colors"
                      title="Edit Supplier"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteSupplier(sup)}
                      className="p-1.5 text-rose-400/70 hover:text-rose-400 hover:bg-rose-950/30 rounded-lg transition-colors"
                      title="Delete Supplier"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: PURCHASES TABLE */}
      {currentTab === 'purchases' && (
        <div className="bg-[#142319] rounded-3xl border border-[#243D2D] shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#243D2D] bg-[#18291E] text-sand-300/60 uppercase font-semibold">
                  <th className="py-3 px-4">PO Invoice #</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Supplier</th>
                  <th className="py-3 px-4 text-center">Items Ordered</th>
                  <th className="py-3 px-4 text-right">Invoice Total</th>
                  <th className="py-3 px-4 text-right">Amount Paid</th>
                  <th className="py-3 px-4 text-center">Payment Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#243D2D]">
                {purchases.map(po => (
                  <tr key={po.id} className="hover:bg-[#1A2E21] transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-sand-200">{po.invoice_number}</td>
                    <td className="py-3.5 px-4 text-sand-300/70 whitespace-nowrap">{formatDateTime(po.purchase_date)}</td>
                    <td className="py-3.5 px-4 font-bold text-sand-100">{po.supplier_name}</td>
                    <td className="py-3.5 px-4 text-center font-mono font-medium text-sand-200">
                      {(po.items || []).length} lines
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-extrabold text-sand-100">
                      {formatINR(po.total_amount)}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-emerald-400">
                      {formatINR(po.paid_amount)}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <Badge variant={po.payment_status === 'PAID' ? 'success' : (po.payment_status === 'PARTIAL' ? 'warning' : 'danger')}>
                        {po.payment_status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL: ADD / EDIT SUPPLIER */}
      <Modal
        isOpen={isAddSupplierModalOpen || isEditSupplierModalOpen}
        onClose={() => { setIsAddSupplierModalOpen(false); setIsEditSupplierModalOpen(false); }}
        title={isAddSupplierModalOpen ? "Add New Supplier / Distributor" : `Edit Supplier: ${selectedSupplier?.name}`}
        subtitle="Wholesale FMCG vendor profile and logistics terms"
      >
        <form onSubmit={isAddSupplierModalOpen ? handleSaveSupplierAdd : handleSaveSupplierEdit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-sand-200 mb-1">Company / Depot Name *</label>
            <input
              type="text"
              required
              value={supplierForm.name}
              onChange={e => setSupplierForm({ ...supplierForm, name: e.target.value })}
              placeholder="e.g. ITC Wholesale Distributors"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#18291E] border border-[#243D2D] text-sand-100 text-xs focus:outline-none focus:ring-2 focus:ring-forest-600/30"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-sand-200 mb-1">Contact Person Name</label>
              <input
                type="text"
                value={supplierForm.contact_person}
                onChange={e => setSupplierForm({ ...supplierForm, contact_person: e.target.value })}
                placeholder="e.g. Manoj Sharma"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#18291E] border border-[#243D2D] text-sand-100 text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-sand-200 mb-1">Phone Number *</label>
              <input
                type="tel"
                required
                value={supplierForm.phone}
                onChange={e => setSupplierForm({ ...supplierForm, phone: e.target.value })}
                placeholder="+91 98440 00000"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#18291E] border border-[#243D2D] text-sand-100 text-xs focus:outline-none focus:ring-2 focus:ring-forest-600/30"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-sand-200 mb-1">GSTIN Number</label>
              <input
                type="text"
                value={supplierForm.gstin}
                onChange={e => setSupplierForm({ ...supplierForm, gstin: e.target.value })}
                placeholder="29AAACI1681G1Z0"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#18291E] border border-[#243D2D] text-sand-100 text-xs font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-sand-200 mb-1">Lead Time (Days)</label>
              <input
                type="number"
                min="1"
                value={supplierForm.lead_time_days}
                onChange={e => setSupplierForm({ ...supplierForm, lead_time_days: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#18291E] border border-[#243D2D] text-sand-100 text-xs font-mono"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-sand-200 mb-1">Warehouse / Depot Address</label>
            <input
              type="text"
              value={supplierForm.address}
              onChange={e => setSupplierForm({ ...supplierForm, address: e.target.value })}
              placeholder="APMC yard, Industrial Area, Bangalore"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#18291E] border border-[#243D2D] text-sand-100 text-xs"
            />
          </div>

          <div className="pt-4 border-t border-[#243D2D] flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => { setIsAddSupplierModalOpen(false); setIsEditSupplierModalOpen(false); }}
              className="px-4 py-2 text-xs font-bold text-sand-300 hover:text-white hover:bg-[#18291E] rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold bg-forest-700 hover:bg-forest-600 text-sand-100 rounded-xl border border-forest-500/30"
            >
              {isAddSupplierModalOpen ? "Save Supplier" : "Update Supplier"}
            </button>
          </div>
        </form>
      </Modal>

      {/* MODAL: NEW PURCHASE ORDER (STOCK-IN WORKFLOW) */}
      <Modal
        isOpen={isNewPurchaseModalOpen}
        onClose={() => setIsNewPurchaseModalOpen(false)}
        title="Purchase Order Entry (Stock Replenishment)"
        subtitle="Received stock will immediately increment current product inventory"
        maxWidth="max-w-3xl"
      >
        <form onSubmit={handleCompletePO} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-sand-200 mb-1">Select Supplier *</label>
              <select
                value={poForm.supplier_id}
                onChange={e => setPoForm({ ...poForm, supplier_id: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#18291E] border border-[#243D2D] text-sand-100 text-xs font-semibold cursor-pointer"
              >
                {suppliers.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-sand-200 mb-1">Supplier Invoice / PO #</label>
              <input
                type="text"
                required
                value={poForm.invoice_number}
                onChange={e => setPoForm({ ...poForm, invoice_number: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#18291E] border border-[#243D2D] text-sand-100 text-xs font-mono font-bold"
              />
            </div>
          </div>

          {/* Line Items Builder */}
          <div className="p-3.5 rounded-2xl bg-[#18291E] border border-[#243D2D] space-y-3">
            <p className="text-xs font-bold text-sand-100">Add Restocked Items</p>
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
              <div className="sm:col-span-6">
                <select
                  value={poItemInput.product_id}
                  onChange={e => {
                    const prod = products.find(p => p.id === e.target.value);
                    setPoItemInput({
                      ...poItemInput,
                      product_id: e.target.value,
                      unit_cost: prod ? prod.purchase_price : poItemInput.unit_cost
                    });
                  }}
                  className="w-full px-3 py-2 rounded-xl bg-[#142319] border border-[#243D2D] text-sand-100 text-xs font-semibold cursor-pointer"
                >
                  {products.map(p => (
                    <option key={p.id} value={p.id}>{p.name} (Current: {p.stock_quantity})</option>
                  ))}
                </select>
              </div>
              <div className="sm:col-span-2">
                <input
                  type="number"
                  min="1"
                  placeholder="Qty"
                  value={poItemInput.quantity}
                  onChange={e => setPoItemInput({ ...poItemInput, quantity: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#142319] border border-[#243D2D] text-sand-100 text-xs font-mono font-bold"
                />
              </div>
              <div className="sm:col-span-2">
                <input
                  type="number"
                  min="0"
                  placeholder="Cost ₹"
                  value={poItemInput.unit_cost}
                  onChange={e => setPoItemInput({ ...poItemInput, unit_cost: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#142319] border border-[#243D2D] text-sand-100 text-xs font-mono font-bold"
                />
              </div>
              <div className="sm:col-span-2">
                <button
                  type="button"
                  onClick={handleAddPoItem}
                  className="w-full py-2 bg-forest-700 hover:bg-forest-600 text-sand-100 rounded-xl text-xs font-bold transition-colors border border-forest-500/30"
                >
                  + Add Item
                </button>
              </div>
            </div>

            {/* Added Items List */}
            {poForm.items.length > 0 && (
              <div className="divide-y divide-[#243D2D] mt-2 bg-[#142319] rounded-xl border border-[#243D2D] p-2 text-xs">
                {poForm.items.map((item, idx) => (
                  <div key={idx} className="py-2 px-1 flex justify-between items-center">
                    <div>
                      <span className="font-bold text-sand-100">{item.product_name}</span>
                      <span className="text-sand-300/60 font-mono ml-2">({item.quantity} × {formatINR(item.unit_cost)})</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="font-mono font-bold text-sand-200">{formatINR(item.total_cost)}</span>
                      <button
                        type="button"
                        onClick={() => handleRemovePoItem(idx)}
                        className="text-rose-400 hover:text-rose-300 font-bold"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Payment & Totals */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-bold text-sand-200 mb-1">Amount Paid to Supplier Now (₹)</label>
              <input
                type="number"
                min="0"
                placeholder={`Full payment: ₹${poTotal}`}
                value={poForm.paid_amount}
                onChange={e => setPoForm({ ...poForm, paid_amount: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#18291E] border border-[#243D2D] text-sand-100 text-xs font-mono font-bold"
              />
              <p className="text-[11px] text-sand-300/50 mt-1">Leave empty or enter full amount for 100% paid.</p>
            </div>

            <div className="p-3 rounded-2xl bg-[#18291E] border border-[#243D2D] text-xs space-y-1">
              <div className="flex justify-between text-sand-300/80">
                <span>Subtotal Cost:</span>
                <span className="font-mono text-sand-100">{formatINR(poSubtotal)}</span>
              </div>
              <div className="flex justify-between text-sand-300/80">
                <span>GST Tax (5%):</span>
                <span className="font-mono text-sand-100">{formatINR(poTax)}</span>
              </div>
              <div className="flex justify-between font-black text-sand-100 pt-1 border-t border-[#243D2D]">
                <span>Total Purchase Cost:</span>
                <span className="font-mono text-sm text-sand-100">{formatINR(poTotal)}</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[#243D2D] flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setIsNewPurchaseModalOpen(false)}
              className="px-4 py-2 text-xs font-bold text-sand-300 hover:text-white hover:bg-[#18291E] rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold bg-forest-700 hover:bg-forest-600 text-sand-100 rounded-xl shadow-sm border border-forest-500/30"
            >
              Confirm Purchase & Receive Stock
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
