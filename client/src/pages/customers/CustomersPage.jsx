import React, { useState, useMemo } from 'react';
import { 
  Users, 
  Search, 
  Plus, 
  BookOpen, 
  Phone, 
  MapPin, 
  IndianRupee, 
  ArrowUpRight, 
  ArrowDownLeft, 
  CheckCircle2, 
  Edit2, 
  Trash2, 
  Eye, 
  Download,
  AlertCircle
} from 'lucide-react';
import { useStore } from '../../context/StoreContext.jsx';
import Modal from '../../components/ui/Modal.jsx';
import Badge from '../../components/ui/Badge.jsx';
import { formatINR, formatDateTime, formatDate, downloadCSV } from '../../utils/formatters.js';
import { useSearchParams } from 'react-router-dom';

export default function CustomersPage() {
  const { 
    customers, 
    udhaarTransactions, 
    addCustomer, 
    updateCustomer, 
    deleteCustomer, 
    recordUdhaarPayment,
    totalCustomerUdhaarOutstanding
  } = useStore();

  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'list'; // 'list' | 'udhaar'

  const [searchQuery, setSearchQuery] = useState('');
  const [filterDueOnly, setFilterDueOnly] = useState(false);

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isLedgerModalOpen, setIsLedgerModalOpen] = useState(false);

  // Selected Entities
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  // Form states
  const [customerForm, setCustomerForm] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    credit_limit: 10000
  });

  const [paymentForm, setPaymentForm] = useState({
    amount: '',
    payment_mode: 'UPI',
    notes: 'Partial settlement received'
  });

  // Filtered Customers
  const filteredCustomers = useMemo(() => {
    return customers.filter(c => {
      const matchSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.phone.includes(searchQuery) ||
        (c.email && c.email.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchDue = !filterDueOnly || (c.outstanding_balance > 0);
      return matchSearch && matchDue;
    });
  }, [customers, searchQuery, filterDueOnly]);

  // Handlers
  const handleOpenAdd = () => {
    setCustomerForm({ name: '', phone: '', email: '', address: '', credit_limit: 10000 });
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (cust) => {
    setSelectedCustomer(cust);
    setCustomerForm({
      name: cust.name,
      phone: cust.phone,
      email: cust.email || '',
      address: cust.address || '',
      credit_limit: cust.credit_limit || 10000
    });
    setIsEditModalOpen(true);
  };

  const handleOpenPayment = (cust) => {
    setSelectedCustomer(cust);
    setPaymentForm({
      amount: cust.outstanding_balance > 0 ? cust.outstanding_balance : '',
      payment_mode: 'UPI',
      notes: 'Udhaar payment received'
    });
    setIsPaymentModalOpen(true);
  };

  const handleOpenLedger = (cust) => {
    setSelectedCustomer(cust);
    setIsLedgerModalOpen(true);
  };

  const handleSaveAdd = (e) => {
    e.preventDefault();
    if (!customerForm.name || !customerForm.phone) return;
    addCustomer(customerForm);
    setIsAddModalOpen(false);
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!selectedCustomer || !customerForm.name) return;
    updateCustomer(selectedCustomer.id, customerForm);
    setIsEditModalOpen(false);
  };

  const handleDelete = (cust) => {
    if (cust.outstanding_balance > 0) {
      alert(`Cannot delete customer "${cust.name}" while they have an outstanding balance of ${formatINR(cust.outstanding_balance)}! Settle ledger first.`);
      return;
    }
    if (window.confirm(`Are you sure you want to delete customer "${cust.name}"?`)) {
      deleteCustomer(cust.id);
    }
  };

  const handleRecordPayment = (e) => {
    e.preventDefault();
    if (!selectedCustomer || !paymentForm.amount || Number(paymentForm.amount) <= 0) return;
    recordUdhaarPayment(
      selectedCustomer.id,
      Number(paymentForm.amount),
      paymentForm.payment_mode,
      paymentForm.notes
    );
    setIsPaymentModalOpen(false);
  };

  const handleExportCSV = () => {
    const rows = filteredCustomers.map(c => ({
      ID: c.id,
      Name: c.name,
      Phone: c.phone,
      Address: c.address,
      CreditLimit: c.credit_limit,
      TotalPurchases: c.total_purchases,
      OutstandingBalance: c.outstanding_balance
    }));
    downloadCSV('VyaparMitra_Customers_Ledger', rows);
  };

  // Specific Customer's Ledger
  const customerLedgerEntries = selectedCustomer
    ? udhaarTransactions.filter(t => t.customer_id === selectedCustomer.id)
    : [];

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-sand-100 tracking-tight">Customer & Udhaar Management</h2>
          <p className="text-xs text-sand-300/70">Track customer loyalty, purchase histories, credit limits & digital Khata balances</p>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 rounded-xl bg-[#142319] border border-[#243D2D] text-sand-200 text-xs font-semibold hover:bg-[#1A2E21] transition-colors flex items-center space-x-1.5 shadow-card"
          >
            <Download className="w-3.5 h-3.5 text-sand-300" />
            <span>Export Ledger</span>
          </button>
          <button
            onClick={handleOpenAdd}
            className="px-4 py-2 rounded-xl bg-forest-700 hover:bg-forest-600 text-sand-100 text-xs font-bold transition-colors flex items-center space-x-1.5 shadow-sm border border-forest-500/30"
          >
            <Plus className="w-4 h-4 text-sand-200" />
            <span>Add Customer</span>
          </button>
        </div>
      </div>

      {/* METRIC RIBBON */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#142319] p-5 rounded-2xl border border-[#243D2D] shadow-card">
          <p className="text-[11px] font-bold text-sand-300/60 uppercase tracking-wider">Total Udhaar Outstanding</p>
          <p className="text-2xl font-extrabold text-rose-400 mt-1 font-mono">{formatINR(totalCustomerUdhaarOutstanding)}</p>
          <p className="text-xs text-sand-300/70 mt-1 font-medium">Pending collection across store accounts</p>
        </div>
        <div className="bg-[#142319] p-5 rounded-2xl border border-[#243D2D] shadow-card">
          <p className="text-[11px] font-bold text-sand-300/60 uppercase tracking-wider">Registered Customers</p>
          <p className="text-2xl font-extrabold text-sand-100 mt-1">{customers.length} Profiles</p>
          <p className="text-xs text-sand-300/70 mt-1 font-medium">{customers.filter(c => c.outstanding_balance > 0).length} accounts with active credit balance</p>
        </div>
        <div className="bg-[#142319] p-5 rounded-2xl border border-[#243D2D] shadow-card">
          <p className="text-[11px] font-bold text-sand-300/60 uppercase tracking-wider">Total Customer Lifetime Spend</p>
          <p className="text-2xl font-extrabold text-sand-100 mt-1 font-mono">
            {formatINR(customers.reduce((sum, c) => sum + (c.total_purchases || 0), 0))}
          </p>
          <p className="text-xs text-sand-300/70 mt-1 font-medium">Accumulated retail sales volume</p>
        </div>
      </div>

      {/* TABS & SEARCH BAR */}
      <div className="flex border-b border-[#243D2D] space-x-6 text-sm font-bold">
        <button
          onClick={() => setSearchParams({ tab: 'list' })}
          className={`pb-3 relative transition-colors ${activeTab === 'list' ? 'text-sand-100 border-b-2 border-electric-500' : 'text-sand-300/60 hover:text-sand-100'}`}
        >
          Customer Directory ({customers.length})
        </button>
        <button
          onClick={() => setSearchParams({ tab: 'udhaar' })}
          className={`pb-3 relative transition-colors ${activeTab === 'udhaar' ? 'text-sand-100 border-b-2 border-electric-500' : 'text-sand-300/60 hover:text-sand-100'}`}
        >
          Udhaar Ledger Book ({customers.filter(c => c.outstanding_balance > 0).length} Due)
        </button>
      </div>

      {/* FILTER CONTROLS */}
      <div className="bg-[#142319] p-4 rounded-3xl border border-[#243D2D] shadow-card flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-sand-300/50" />
          <input
            type="text"
            placeholder="Search customer name, phone number..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-[#18291E] border border-[#243D2D] rounded-xl text-xs text-sand-100 placeholder:text-sand-300/40 focus:outline-none focus:ring-2 focus:ring-forest-600/30"
          />
        </div>

        <div className="flex items-center space-x-3 w-full md:w-auto">
          <label className="flex items-center space-x-2 text-xs font-semibold text-sand-200 cursor-pointer">
            <input
              type="checkbox"
              checked={filterDueOnly}
              onChange={e => setFilterDueOnly(e.target.checked)}
              className="rounded bg-[#18291E] border-[#243D2D] text-electric-500 focus:ring-electric-500/30 cursor-pointer"
            />
            <span>Show Accounts with Pending Balance Only</span>
          </label>
        </div>
      </div>

      {/* CUSTOMERS / UDHAAR TABLE */}
      <div className="bg-[#142319] rounded-3xl border border-[#243D2D] shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#243D2D] bg-[#18291E] text-sand-300/60 uppercase font-semibold">
                <th className="py-3 px-4">Customer Name & Contact</th>
                <th className="py-3 px-4">Address</th>
                <th className="py-3 px-4 text-right">Credit Limit</th>
                <th className="py-3 px-4 text-right">Lifetime Purchases</th>
                <th className="py-3 px-4 text-right">Outstanding Udhaar</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#243D2D]">
              {filteredCustomers.map(cust => {
                const hasDue = cust.outstanding_balance > 0;

                return (
                  <tr key={cust.id} className="hover:bg-[#1A2E21] transition-colors">
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-sand-100">{cust.name}</p>
                      <p className="text-[11px] text-sand-300/60 flex items-center mt-0.5">
                        <Phone className="w-3 h-3 mr-1 text-sand-300/40" /> {cust.phone}
                      </p>
                    </td>
                    <td className="py-3.5 px-4 text-sand-300/70 max-w-xs truncate">
                      {cust.address || '—'}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-medium text-sand-300/80">
                      {formatINR(cust.credit_limit)}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-semibold text-sand-100">
                      {formatINR(cust.total_purchases)}
                    </td>
                    <td className={`py-3.5 px-4 text-right font-mono font-extrabold ${hasDue ? 'text-rose-400 text-sm' : 'text-emerald-400'}`}>
                      {formatINR(cust.outstanding_balance)}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      {hasDue ? (
                        <Badge variant="danger">Balance Due</Badge>
                      ) : (
                        <Badge variant="success">All Settled</Badge>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end space-x-1.5">
                        {hasDue && (
                          <button
                            onClick={() => handleOpenPayment(cust)}
                            className="px-2.5 py-1 bg-forest-700 hover:bg-forest-600 text-sand-100 rounded-lg text-xs font-bold transition-colors shadow-sm border border-forest-500/30"
                            title="Record full or partial payment"
                          >
                            Record Payment
                          </button>
                        )}
                        <button
                          onClick={() => handleOpenLedger(cust)}
                          className="p-1.5 text-sand-200 hover:text-white hover:bg-[#1E3426] rounded-lg transition-colors"
                          title="View Digital Udhaar Khata Ledger"
                        >
                          <BookOpen className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleOpenEdit(cust)}
                          className="p-1.5 text-sand-300 hover:text-white hover:bg-[#1E3426] rounded-lg transition-colors"
                          title="Edit Customer"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(cust)}
                          className="p-1.5 text-rose-400/70 hover:text-rose-400 hover:bg-rose-950/30 rounded-lg transition-colors"
                          title="Delete Customer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredCustomers.length === 0 && (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-sand-300/50">
                    No customers match your search criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: ADD / EDIT CUSTOMER */}
      <Modal
        isOpen={isAddModalOpen || isEditModalOpen}
        onClose={() => { setIsAddModalOpen(false); setIsEditModalOpen(false); }}
        title={isAddModalOpen ? "Register New Customer" : `Edit Customer: ${selectedCustomer?.name}`}
        subtitle="Manage contact information and store credit limits"
      >
        <form onSubmit={isAddModalOpen ? handleSaveAdd : handleSaveEdit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-sand-200 mb-1">Full Name *</label>
            <input
              type="text"
              required
              value={customerForm.name}
              onChange={e => setCustomerForm({ ...customerForm, name: e.target.value })}
              placeholder="e.g. Ramesh Chandra"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#18291E] border border-[#243D2D] text-sand-100 text-xs focus:outline-none focus:ring-2 focus:ring-forest-600/30"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-sand-200 mb-1">Mobile Phone *</label>
              <input
                type="tel"
                required
                value={customerForm.phone}
                onChange={e => setCustomerForm({ ...customerForm, phone: e.target.value })}
                placeholder="+91 98450 12345"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#18291E] border border-[#243D2D] text-sand-100 text-xs focus:outline-none focus:ring-2 focus:ring-forest-600/30"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-sand-200 mb-1">Email Address</label>
              <input
                type="email"
                value={customerForm.email}
                onChange={e => setCustomerForm({ ...customerForm, email: e.target.value })}
                placeholder="customer@gmail.com"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#18291E] border border-[#243D2D] text-sand-100 text-xs"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-sand-200 mb-1">Delivery / Residential Address</label>
            <input
              type="text"
              value={customerForm.address}
              onChange={e => setCustomerForm({ ...customerForm, address: e.target.value })}
              placeholder="Apartment, Street, Landmark, Pin code"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#18291E] border border-[#243D2D] text-sand-100 text-xs"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-sand-200 mb-1">Sanctioned Udhaar Limit (₹)</label>
            <input
              type="number"
              min="0"
              value={customerForm.credit_limit}
              onChange={e => setCustomerForm({ ...customerForm, credit_limit: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#18291E] border border-[#243D2D] text-sand-100 text-xs font-mono font-bold"
            />
          </div>

          <div className="pt-4 border-t border-[#243D2D] flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => { setIsAddModalOpen(false); setIsEditModalOpen(false); }}
              className="px-4 py-2 text-xs font-bold text-sand-300 hover:text-white hover:bg-[#18291E] rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold bg-forest-700 hover:bg-forest-600 text-sand-100 rounded-xl border border-forest-500/30"
            >
              {isAddModalOpen ? "Save Customer" : "Update Profile"}
            </button>
          </div>
        </form>
      </Modal>

      {/* MODAL: RECORD UDHAAR PAYMENT */}
      {selectedCustomer && (
        <Modal
          isOpen={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          title={`Record Udhaar Payment: ${selectedCustomer.name}`}
          subtitle={`Current Outstanding Balance: ${formatINR(selectedCustomer.outstanding_balance)}`}
        >
          <form onSubmit={handleRecordPayment} className="space-y-4">
            <div className="p-3 rounded-2xl bg-[#18291E] border border-[#243D2D] flex justify-between items-center text-xs">
              <span className="text-sand-300/70 font-semibold">Total Pending Due:</span>
              <span className="font-mono text-base font-black text-rose-400">{formatINR(selectedCustomer.outstanding_balance)}</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-sand-200 mb-1">Payment Amount Received (₹) *</label>
              <input
                type="number"
                required
                min="1"
                max={selectedCustomer.outstanding_balance}
                value={paymentForm.amount}
                onChange={e => setPaymentForm({ ...paymentForm, amount: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#18291E] border border-[#243D2D] text-sm font-mono font-bold text-sand-100"
              />
              <div className="flex space-x-2 mt-2">
                <button
                  type="button"
                  onClick={() => setPaymentForm({ ...paymentForm, amount: selectedCustomer.outstanding_balance })}
                  className="px-2.5 py-1 rounded-lg bg-[#243D2D] text-[11px] font-bold text-sand-200 hover:bg-[#2F4D3A] transition-colors"
                >
                  Pay Full Balance ({formatINR(selectedCustomer.outstanding_balance)})
                </button>
                {selectedCustomer.outstanding_balance > 1000 && (
                  <button
                    type="button"
                    onClick={() => setPaymentForm({ ...paymentForm, amount: Math.floor(selectedCustomer.outstanding_balance / 2) })}
                    className="px-2.5 py-1 rounded-lg bg-[#18291E] border border-[#243D2D] text-[11px] font-bold text-sand-300 hover:text-white"
                  >
                    50% Installment
                  </button>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-sand-200 mb-1">Payment Mode *</label>
              <select
                value={paymentForm.payment_mode}
                onChange={e => setPaymentForm({ ...paymentForm, payment_mode: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#18291E] border border-[#243D2D] text-sand-100 text-xs font-semibold cursor-pointer"
              >
                <option value="UPI">UPI (Google Pay / PhonePe / Paytm)</option>
                <option value="CASH">Cash Currency</option>
                <option value="BANK_TRANSFER">Direct Bank NEFT / IMPS</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-sand-200 mb-1">Notes / Transaction Reference</label>
              <input
                type="text"
                value={paymentForm.notes}
                onChange={e => setPaymentForm({ ...paymentForm, notes: e.target.value })}
                placeholder="e.g. GPay UPI Ref 921039"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#18291E] border border-[#243D2D] text-sand-100 text-xs"
              />
            </div>

            <div className="pt-4 border-t border-[#243D2D] flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setIsPaymentModalOpen(false)}
                className="px-4 py-2 text-xs font-bold text-sand-300 hover:text-white hover:bg-[#18291E] rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-bold bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl shadow-sm border border-emerald-500/30"
              >
                Confirm Payment & Update Ledger
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* MODAL: CUSTOMER UDHAAR LEDGER VIEW */}
      {selectedCustomer && (
        <Modal
          isOpen={isLedgerModalOpen}
          onClose={() => setIsLedgerModalOpen(false)}
          title={`Digital Udhaar Khata: ${selectedCustomer.name}`}
          subtitle={`Mobile: ${selectedCustomer.phone} | Sanctioned Limit: ${formatINR(selectedCustomer.credit_limit)}`}
          maxWidth="max-w-3xl"
        >
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-[#18291E] border border-[#243D2D] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <p className="text-xs text-sand-300/60 font-medium">Net Outstanding Balance:</p>
                <p className="text-2xl font-black font-mono text-rose-400">{formatINR(selectedCustomer.outstanding_balance)}</p>
              </div>
              <div className="text-left sm:text-right">
                <p className="text-xs text-sand-300/60 font-medium">Available Credit Room:</p>
                <p className="text-sm font-bold font-mono text-sand-100">
                  {formatINR(Math.max(0, selectedCustomer.credit_limit - selectedCustomer.outstanding_balance))}
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-[#243D2D] text-sand-300/60 uppercase font-semibold">
                    <th className="py-2.5 px-3">Date</th>
                    <th className="py-2.5 px-3">Transaction</th>
                    <th className="py-2.5 px-3">Mode / Invoice</th>
                    <th className="py-2.5 px-3 text-right">Debit (+) / Credit (-)</th>
                    <th className="py-2.5 px-3">Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#243D2D]">
                  {customerLedgerEntries.map(tx => {
                    const isCredit = tx.transaction_type === 'CREDIT';
                    return (
                      <tr key={tx.id} className="hover:bg-[#18291E]/60">
                        <td className="py-3 px-3 font-mono text-sand-300/60">{formatDateTime(tx.date)}</td>
                        <td className="py-3 px-3">
                          <Badge variant={isCredit ? 'danger' : 'success'}>
                            {isCredit ? 'UDHAAR GIVEN' : 'PAYMENT RECEIVED'}
                          </Badge>
                        </td>
                        <td className="py-3 px-3 font-mono text-sand-200">
                          {tx.reference_sale_id || tx.payment_mode || 'Cash'}
                        </td>
                        <td className={`py-3 px-3 text-right font-mono font-bold ${isCredit ? 'text-rose-400' : 'text-emerald-400'}`}>
                          {isCredit ? `+ ${formatINR(tx.amount)}` : `- ${formatINR(tx.amount)}`}
                        </td>
                        <td className="py-3 px-3 text-sand-300/80 max-w-xs truncate">{tx.notes}</td>
                      </tr>
                    );
                  })}

                  {customerLedgerEntries.length === 0 && (
                    <tr>
                      <td colSpan="5" className="py-8 text-center text-sand-300/50">
                        No previous ledger transactions recorded for this customer.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
