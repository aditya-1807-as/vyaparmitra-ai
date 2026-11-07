import React, { useState, useMemo } from 'react';
import { 
  Receipt, 
  Search, 
  Filter, 
  Printer, 
  Download, 
  ArrowLeft,
  Calendar,
  CreditCard,
  ShoppingBag
} from 'lucide-react';
import { useStore } from '../../context/StoreContext.jsx';
import Badge from '../../components/ui/Badge.jsx';
import PrintableInvoiceModal from '../../components/invoices/PrintableInvoiceModal.jsx';
import { formatINR, formatDateTime, downloadCSV } from '../../utils/formatters.js';
import { useNavigate } from 'react-router-dom';

export default function InvoicesPage() {
  const { sales, shop } = useStore();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('ALL');
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  const filteredSales = useMemo(() => {
    return sales.filter(s => {
      const matchSearch = s.invoice_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (s.customer_phone && s.customer_phone.includes(searchQuery));
      const matchPayment = paymentFilter === 'ALL' || s.payment_method === paymentFilter;
      return matchSearch && matchPayment;
    });
  }, [sales, searchQuery, paymentFilter]);

  const handleExportCSV = () => {
    const rows = filteredSales.map(s => ({
      InvoiceNumber: s.invoice_number,
      Date: s.sale_date,
      Customer: s.customer_name,
      Phone: s.customer_phone,
      PaymentMethod: s.payment_method,
      Subtotal: s.subtotal,
      Discount: s.discount_amount,
      Tax: s.tax_amount,
      TotalAmount: s.total_amount,
      ItemsCount: (s.items || []).length
    }));
    downloadCSV('VyaparMitra_Sales_Invoices', rows);
  };

  const totalRevenue = filteredSales.reduce((sum, s) => sum + s.total_amount, 0);

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-sand-100 tracking-tight">Invoices & Sales History</h2>
          <p className="text-xs text-sand-300/70">Review, search, and reprint past customer sales transactions</p>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            onClick={() => navigate('/sales/pos')}
            className="px-4 py-2 rounded-xl bg-forest-700 hover:bg-forest-600 text-sand-100 text-xs font-bold transition-colors flex items-center space-x-1.5 shadow-sm border border-forest-500/30"
          >
            <ShoppingBag className="w-4 h-4 text-sand-200" />
            <span>Open POS Terminal</span>
          </button>
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 rounded-xl bg-[#142319] border border-[#243D2D] text-sand-200 text-xs font-semibold hover:bg-[#1A2E21] transition-colors flex items-center space-x-1.5 shadow-card"
          >
            <Download className="w-3.5 h-3.5 text-sand-300" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Filter and Metric Ribbons */}
      <div className="bg-[#142319] p-4 rounded-3xl border border-[#243D2D] shadow-card flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-sand-300/50" />
          <input
            type="text"
            placeholder="Search invoice number, customer name, mobile..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-[#18291E] border border-[#243D2D] rounded-xl text-xs text-sand-100 placeholder:text-sand-300/40 focus:outline-none focus:ring-2 focus:ring-forest-600/30"
          />
        </div>

        <div className="flex items-center space-x-3 w-full md:w-auto justify-between md:justify-end">
          <select
            value={paymentFilter}
            onChange={e => setPaymentFilter(e.target.value)}
            className="px-3 py-2 bg-[#18291E] border border-[#243D2D] rounded-xl text-xs font-semibold text-sand-200 focus:outline-none cursor-pointer"
          >
            <option value="ALL">All Payment Methods</option>
            <option value="UPI">UPI</option>
            <option value="CASH">Cash</option>
            <option value="CARD">Card</option>
            <option value="UDHAAR">Udhaar (Credit)</option>
          </select>

          <div className="text-right pl-3 border-l border-[#243D2D]">
            <p className="text-[10px] uppercase font-bold text-sand-300/60">Filtered Total</p>
            <p className="text-sm font-extrabold font-mono text-sand-100">{formatINR(totalRevenue)}</p>
          </div>
        </div>
      </div>

      {/* Invoices List Table */}
      <div className="bg-[#142319] rounded-3xl border border-[#243D2D] shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#243D2D] bg-[#18291E] text-sand-300/60 uppercase font-semibold">
                <th className="py-3 px-4">Invoice #</th>
                <th className="py-3 px-4">Date & Time</th>
                <th className="py-3 px-4">Customer Details</th>
                <th className="py-3 px-4 text-center">Items</th>
                <th className="py-3 px-4 text-center">Payment Mode</th>
                <th className="py-3 px-4 text-right">Subtotal</th>
                <th className="py-3 px-4 text-right">Grand Total</th>
                <th className="py-3 px-4 text-center">Print Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#243D2D]">
              {filteredSales.map((sale) => (
                <tr key={sale.id} className="hover:bg-[#1A2E21] transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-sand-200">
                    {sale.invoice_number}
                  </td>
                  <td className="py-3.5 px-4 text-sand-300/70 whitespace-nowrap">
                    {formatDateTime(sale.sale_date)}
                  </td>
                  <td className="py-3.5 px-4">
                    <p className="font-bold text-sand-100">{sale.customer_name}</p>
                    {sale.customer_phone && <p className="text-[10px] text-sand-300/50">{sale.customer_phone}</p>}
                  </td>
                  <td className="py-3.5 px-4 text-center font-mono text-sand-200">
                    {(sale.items || []).length} items
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <Badge variant={sale.payment_method === 'UDHAAR' ? 'danger' : 'success'}>
                      {sale.payment_method}
                    </Badge>
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono text-sand-300/70">
                    {formatINR(sale.subtotal)}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono font-extrabold text-sand-100">
                    {formatINR(sale.total_amount)}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <button
                      onClick={() => setSelectedInvoice(sale)}
                      className="p-1.5 text-sand-200 hover:text-white hover:bg-[#1E3426] rounded-lg transition-colors"
                      title="View & Print Original Tax Invoice"
                    >
                      <Printer className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}

              {filteredSales.length === 0 && (
                <tr>
                  <td colSpan="8" className="py-12 text-center text-sand-300/50">
                    No sales invoices match your query.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invoice Print Modal */}
      {selectedInvoice && (
        <PrintableInvoiceModal
          isOpen={!!selectedInvoice}
          onClose={() => setSelectedInvoice(null)}
          invoice={selectedInvoice}
        />
      )}
    </div>
  );
}
