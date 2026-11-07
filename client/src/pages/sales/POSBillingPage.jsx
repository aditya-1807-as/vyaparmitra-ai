import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Plus, 
  Minus, 
  Trash2, 
  CreditCard, 
  IndianRupee, 
  QrCode, 
  BookOpen, 
  UserPlus, 
  CheckCircle2, 
  ShoppingCart,
  Receipt,
  Layers,
  ArrowRight,
  Package,
  AlertCircle
} from 'lucide-react';
import { useStore } from '../../context/StoreContext.jsx';
import Modal from '../../components/ui/Modal.jsx';
import Badge from '../../components/ui/Badge.jsx';
import PrintableInvoiceModal from '../../components/invoices/PrintableInvoiceModal.jsx';
import { formatINR } from '../../utils/formatters.js';

export default function POSBillingPage() {
  const { products, categories, customers, addCustomer, completeSale, shop } = useStore();

  // Active POS cart
  const [cart, setCart] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  // Customer & Payment selection
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('UPI'); // 'CASH' | 'UPI' | 'CARD' | 'UDHAAR'
  const [discountAmount, setDiscountAmount] = useState(0);

  // Modals
  const [isNewCustomerModalOpen, setIsNewCustomerModalOpen] = useState(false);
  const [newCustomerForm, setNewCustomerForm] = useState({ name: '', phone: '', address: '', credit_limit: 10000 });
  const [completedInvoice, setCompletedInvoice] = useState(null);

  // Filtered Products for quick selection
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.barcode && p.barcode.includes(searchQuery));
      const matchCat = selectedCategory === 'ALL' || p.category_id === selectedCategory;
      return matchSearch && matchCat;
    });
  }, [products, searchQuery, selectedCategory]);

  // Selected customer object
  const selectedCustomer = customers.find(c => c.id === selectedCustomerId);

  // Cart operations
  const addToCart = (product) => {
    if (product.stock_quantity <= 0) {
      alert(`"${product.name}" is currently out of stock!`);
      return;
    }

    setCart(prev => {
      const existing = prev.find(item => item.product_id === product.id);
      if (existing) {
        if (existing.quantity >= product.stock_quantity) {
          alert(`Cannot add more than available stock (${product.stock_quantity} ${product.unit})`);
          return prev;
        }
        return prev.map(item => item.product_id === product.id
          ? { ...item, quantity: item.quantity + 1, total_price: (item.quantity + 1) * item.unit_price }
          : item
        );
      }
      return [...prev, {
        product_id: product.id,
        product_name: product.name,
        unit: product.unit,
        unit_price: product.selling_price,
        unit_cost: product.purchase_price,
        quantity: 1,
        total_price: product.selling_price,
        available_stock: product.stock_quantity
      }];
    });
  };

  const updateQuantity = (productId, delta) => {
    setCart(prev => {
      return prev.map(item => {
        if (item.product_id === productId) {
          const newQty = item.quantity + delta;
          if (newQty <= 0) return null;
          if (newQty > item.available_stock) {
            alert(`Maximum available stock reached (${item.available_stock})`);
            return item;
          }
          return { ...item, quantity: newQty, total_price: newQty * item.unit_price };
        }
        return item;
      }).filter(Boolean);
    });
  };

  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(item => item.product_id !== productId));
  };

  const clearCart = () => {
    setCart([]);
    setDiscountAmount(0);
    setSelectedCustomerId('');
  };

  // Calculations
  const subtotal = cart.reduce((sum, item) => sum + item.total_price, 0);
  const effectiveDiscount = Math.min(subtotal, Math.max(0, Number(discountAmount) || 0));
  const taxRate = 0.05; // 5% average grocery GST
  const taxAmount = Math.round((subtotal - effectiveDiscount) * taxRate * 100) / 100;
  const grandTotal = Math.max(0, Math.round((subtotal - effectiveDiscount + taxAmount) * 100) / 100);

  // Complete Sale Action
  const handleCompleteSale = () => {
    if (cart.length === 0) {
      alert('Cart is empty. Add products to complete billing.');
      return;
    }

    if (paymentMethod === 'UDHAAR' && !selectedCustomerId) {
      alert('Please select or add a Customer before approving an Udhaar (Credit) sale.');
      return;
    }

    // Check credit limit if Udhaar
    if (paymentMethod === 'UDHAAR' && selectedCustomer) {
      const remainingLimit = selectedCustomer.credit_limit - (selectedCustomer.outstanding_balance || 0);
      if (grandTotal > remainingLimit) {
        const proceed = window.confirm(
          `Warning: This bill of ${formatINR(grandTotal)} exceeds customer's remaining credit limit of ${formatINR(remainingLimit)}. Proceed anyway?`
        );
        if (!proceed) return;
      }
    }

    const salePayload = {
      customer_id: selectedCustomerId || null,
      customer_name: selectedCustomer ? selectedCustomer.name : 'Walk-in Retail Buyer',
      customer_phone: selectedCustomer ? selectedCustomer.phone : '',
      subtotal,
      discount_amount: effectiveDiscount,
      tax_amount: taxAmount,
      total_amount: grandTotal,
      payment_method: paymentMethod,
      items: cart
    };

    const newSale = completeSale(salePayload);
    setCompletedInvoice(newSale);
    clearCart();
  };

  const handleCreateCustomer = (e) => {
    e.preventDefault();
    if (!newCustomerForm.name || !newCustomerForm.phone) return;
    const created = addCustomer(newCustomerForm);
    setSelectedCustomerId(created.id);
    setIsNewCustomerModalOpen(false);
    setNewCustomerForm({ name: '', phone: '', address: '', credit_limit: 10000 });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-140px)]">
      {/* LEFT COLUMN: PRODUCT SELECTION & SEARCH (7 Columns) */}
      <div className="lg:col-span-7 flex flex-col space-y-4 overflow-hidden">
        {/* Search & Category Pills */}
        <div className="bg-[#142319] p-4 rounded-3xl border border-[#243D2D] shadow-card space-y-3 shrink-0">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-sand-300/50" />
            <input
              type="text"
              placeholder="Quick search products by name, barcode or SKU..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-[#18291E] border border-[#243D2D] rounded-2xl text-xs text-sand-100 placeholder:text-sand-300/40 focus:outline-none focus:ring-2 focus:ring-forest-600/30"
            />
          </div>

          {/* Category Filter Pills */}
          <div className="flex space-x-2 overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={() => setSelectedCategory('ALL')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                selectedCategory === 'ALL' 
                  ? 'bg-forest-700 text-sand-100 border border-forest-500/40 shadow-sm' 
                  : 'bg-[#18291E] text-sand-300 hover:bg-[#1E3426] border border-[#243D2D]'
              }`}
            >
              All Items ({products.length})
            </button>
            {categories.map(c => (
              <button
                key={c.id}
                onClick={() => setSelectedCategory(c.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                  selectedCategory === c.id 
                    ? 'bg-forest-700 text-sand-100 border border-forest-500/40 shadow-sm' 
                    : 'bg-[#18291E] text-sand-300 hover:bg-[#1E3426] border border-[#243D2D]'
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid / List */}
        <div className="flex-1 overflow-y-auto pr-1">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {filteredProducts.map(p => {
              const inCart = cart.find(i => i.product_id === p.id);
              const isOut = p.stock_quantity <= 0;

              return (
                <div
                  key={p.id}
                  onClick={() => !isOut && addToCart(p)}
                  className={`
                    p-3.5 rounded-2xl border transition-all text-left flex flex-col justify-between
                    ${isOut 
                      ? 'bg-[#142319]/40 border-[#243D2D]/40 opacity-50 cursor-not-allowed' 
                      : 'bg-[#142319] border-[#243D2D] shadow-card hover:border-forest-500/60 hover:bg-[#18291E] cursor-pointer hover:-translate-y-0.5'}
                  `}
                >
                  <div>
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] font-mono font-semibold text-sand-300/50 uppercase">{p.sku}</span>
                      {inCart && (
                        <span className="w-5 h-5 rounded-full bg-forest-700 text-sand-100 text-[10px] font-bold flex items-center justify-center border border-forest-500/40">
                          {inCart.quantity}
                        </span>
                      )}
                    </div>
                    <h4 className="text-xs font-bold text-sand-100 mt-1 line-clamp-2">{p.name}</h4>
                  </div>

                  <div className="mt-3 pt-2 border-t border-[#243D2D] flex justify-between items-baseline">
                    <span className="text-xs font-extrabold font-mono text-sand-100">{formatINR(p.selling_price)}</span>
                    <span className={`text-[10px] font-semibold ${isOut ? 'text-rose-400' : p.stock_quantity <= p.reorder_level ? 'text-amber-400' : 'text-sand-300/60'}`}>
                      {isOut ? 'Out of stock' : `${p.stock_quantity} ${p.unit}`}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredProducts.length === 0 && (
            <div className="h-64 flex flex-col items-center justify-center text-sand-300/50 text-xs">
              <Package className="w-8 h-8 mb-2 opacity-40 text-sand-300" />
              <span>No matching products found in store catalog</span>
            </div>
          )}
        </div>
      </div>

      {/* RIGHT COLUMN: ACTIVE CART & CHECKOUT TERMINAL (5 Columns) */}
      <div className="lg:col-span-5 bg-[#142319] rounded-3xl border border-[#243D2D] shadow-card p-5 flex flex-col justify-between overflow-hidden">
        {/* Cart Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#243D2D]">
          <div className="flex items-center space-x-2">
            <ShoppingCart className="w-5 h-5 text-sand-200" />
            <h3 className="text-base font-bold text-sand-100">Current Order</h3>
            <span className="px-2 py-0.5 rounded-full bg-[#18291E] text-sand-200 text-xs font-extrabold border border-[#243D2D]">
              {cart.reduce((sum, i) => sum + i.quantity, 0)} items
            </span>
          </div>
          {cart.length > 0 && (
            <button
              onClick={clearCart}
              className="text-xs font-semibold text-rose-400 hover:text-rose-300 transition-colors"
            >
              Clear Cart
            </button>
          )}
        </div>

        {/* Customer Assignment */}
        <div className="py-3 border-b border-[#243D2D] space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-bold text-sand-300/60 uppercase tracking-wider">Customer</label>
            <button
              onClick={() => setIsNewCustomerModalOpen(true)}
              className="text-[11px] font-bold text-sand-200 hover:text-white flex items-center transition-colors"
            >
              <UserPlus className="w-3 h-3 mr-1 text-electric-400" /> + New Customer
            </button>
          </div>
          <select
            value={selectedCustomerId}
            onChange={e => setSelectedCustomerId(e.target.value)}
            className="w-full px-3 py-2 bg-[#18291E] border border-[#243D2D] rounded-xl text-xs font-semibold text-sand-100 focus:outline-none cursor-pointer"
          >
            <option value="">Walk-in Retail Buyer (Cash / UPI / Card)</option>
            {customers.map(c => (
              <option key={c.id} value={c.id}>
                {c.name} — {c.phone} {c.outstanding_balance > 0 ? `(Due: ₹${c.outstanding_balance})` : ''}
              </option>
            ))}
          </select>
        </div>

        {/* Cart Item Rows */}
        <div className="flex-1 overflow-y-auto py-3 space-y-2.5 divide-y divide-[#243D2D]">
          {cart.map(item => (
            <div key={item.product_id} className="pt-2 flex items-center justify-between text-xs">
              <div className="truncate pr-2">
                <p className="font-bold text-sand-100 truncate">{item.product_name}</p>
                <p className="text-[11px] font-mono text-sand-300/60">
                  {formatINR(item.unit_price)} × {item.quantity} {item.unit}
                </p>
              </div>

              <div className="flex items-center space-x-3 shrink-0">
                <div className="flex items-center border border-[#243D2D] rounded-lg bg-[#18291E]">
                  <button
                    onClick={() => updateQuantity(item.product_id, -1)}
                    className="p-1 hover:bg-[#203628] text-sand-300 rounded-l-lg transition-colors"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="px-2 font-mono font-bold text-sand-100">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.product_id, 1)}
                    className="p-1 hover:bg-[#203628] text-sand-300 rounded-r-lg transition-colors"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>

                <span className="font-mono font-extrabold text-sand-100 w-16 text-right">
                  {formatINR(item.total_price)}
                </span>

                <button
                  onClick={() => removeFromCart(item.product_id)}
                  className="p-1 text-sand-300/50 hover:text-rose-400 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}

          {cart.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-sand-300/50 text-xs py-12">
              <ShoppingCart className="w-8 h-8 mb-2 opacity-40 text-sand-300" />
              <span>Cart is empty. Click items from catalog to start billing.</span>
            </div>
          )}
        </div>

        {/* Payment & Calculation Totals */}
        <div className="pt-3 border-t border-[#243D2D] space-y-3">
          {/* Payment Method Selector */}
          <div>
            <label className="text-[11px] font-bold text-sand-300/60 uppercase tracking-wider block mb-1.5">
              Payment Method
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { id: 'UPI', label: 'UPI / QR', icon: QrCode },
                { id: 'CASH', label: 'Cash', icon: IndianRupee },
                { id: 'CARD', label: 'Card', icon: CreditCard },
                { id: 'UDHAAR', label: 'Udhaar', icon: BookOpen }
              ].map(mode => {
                const Icon = mode.icon;
                const isSelected = paymentMethod === mode.id;
                return (
                  <button
                    key={mode.id}
                    onClick={() => setPaymentMethod(mode.id)}
                    className={`
                      py-2 px-1 rounded-xl text-xs font-bold flex flex-col items-center justify-center space-y-1 transition-all
                      ${isSelected 
                        ? (mode.id === 'UDHAAR' 
                            ? 'bg-rose-900/80 border border-rose-700 text-white shadow-sm' 
                            : 'bg-forest-700 text-sand-100 border border-forest-500/40 shadow-sm') 
                        : 'bg-[#18291E] border border-[#243D2D] text-sand-300 hover:bg-[#1E3426]'}
                    `}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-[11px]">{mode.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Pricing calculations */}
          <div className="space-y-1.5 text-xs text-sand-300/80 pt-1">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span className="font-mono font-semibold text-sand-100">{formatINR(subtotal)}</span>
            </div>

            <div className="flex justify-between items-center">
              <span>Discount (₹):</span>
              <input
                type="number"
                min="0"
                value={discountAmount}
                onChange={e => setDiscountAmount(e.target.value)}
                className="w-20 px-2 py-0.5 rounded-lg bg-[#18291E] border border-[#243D2D] text-sand-100 text-right font-mono text-xs focus:outline-none"
              />
            </div>

            <div className="flex justify-between">
              <span>GST Tax (5%):</span>
              <span className="font-mono font-semibold text-sand-100">{formatINR(taxAmount)}</span>
            </div>

            <div className="flex justify-between py-2 border-t border-[#243D2D] text-base font-black text-sand-100">
              <span>Grand Total:</span>
              <span className="font-mono text-lg text-sand-100">{formatINR(grandTotal)}</span>
            </div>
          </div>

          {/* Complete Button */}
          <button
            onClick={handleCompleteSale}
            disabled={cart.length === 0}
            className={`
              w-full py-3.5 rounded-2xl text-sm font-extrabold flex items-center justify-center space-x-2 transition-all shadow-md
              ${cart.length > 0
                ? (paymentMethod === 'UDHAAR' 
                    ? 'bg-rose-800 hover:bg-rose-700 text-white border border-rose-600/50' 
                    : 'bg-forest-700 hover:bg-forest-600 text-sand-100 border border-forest-500/40')
                : 'bg-[#18291E] text-sand-300/40 border border-[#243D2D] cursor-not-allowed'}
            `}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Complete Sale & Print Receipt ({formatINR(grandTotal)})</span>
          </button>
        </div>
      </div>

      {/* QUICK ADD CUSTOMER MODAL */}
      <Modal
        isOpen={isNewCustomerModalOpen}
        onClose={() => setIsNewCustomerModalOpen(false)}
        title="Add New Customer"
        subtitle="Customer details will be saved for instant billing and Udhaar tracking"
      >
        <form onSubmit={handleCreateCustomer} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-sand-200 mb-1">Customer Full Name *</label>
            <input
              type="text"
              required
              value={newCustomerForm.name}
              onChange={e => setNewCustomerForm({ ...newCustomerForm, name: e.target.value })}
              placeholder="e.g. Anand Sharma"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#18291E] border border-[#243D2D] text-sand-100 text-xs focus:outline-none focus:ring-2 focus:ring-forest-600/30"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-sand-200 mb-1">Mobile Phone *</label>
            <input
              type="tel"
              required
              value={newCustomerForm.phone}
              onChange={e => setNewCustomerForm({ ...newCustomerForm, phone: e.target.value })}
              placeholder="+91 98450 00000"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#18291E] border border-[#243D2D] text-sand-100 text-xs focus:outline-none focus:ring-2 focus:ring-forest-600/30"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-sand-200 mb-1">Delivery Address</label>
            <input
              type="text"
              value={newCustomerForm.address}
              onChange={e => setNewCustomerForm({ ...newCustomerForm, address: e.target.value })}
              placeholder="House/Apartment number, street name"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#18291E] border border-[#243D2D] text-sand-100 text-xs focus:outline-none focus:ring-2 focus:ring-forest-600/30"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-sand-200 mb-1">Credit Limit (₹)</label>
            <input
              type="number"
              value={newCustomerForm.credit_limit}
              onChange={e => setNewCustomerForm({ ...newCustomerForm, credit_limit: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#18291E] border border-[#243D2D] text-sand-100 text-xs font-mono"
            />
          </div>
          <div className="pt-4 border-t border-[#243D2D] flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setIsNewCustomerModalOpen(false)}
              className="px-4 py-2 text-xs font-bold text-sand-300 hover:text-white hover:bg-[#18291E] rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold bg-forest-700 hover:bg-forest-600 text-sand-100 rounded-xl border border-forest-500/30"
            >
              Save Customer
            </button>
          </div>
        </form>
      </Modal>

      {/* COMPLETED INVOICE MODAL */}
      {completedInvoice && (
        <PrintableInvoiceModal
          isOpen={!!completedInvoice}
          onClose={() => setCompletedInvoice(null)}
          invoice={completedInvoice}
        />
      )}
    </div>
  );
}
