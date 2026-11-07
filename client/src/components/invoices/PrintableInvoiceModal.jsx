import React from 'react';
import Modal from '../ui/Modal.jsx';
import Badge from '../ui/Badge.jsx';
import { formatINR, formatDateTime } from '../../utils/formatters.js';
import { Printer, Download, Store, Phone, MapPin, Receipt, CheckCircle2, MessageCircle } from 'lucide-react';
import { useStore } from '../../context/StoreContext.jsx';

export default function PrintableInvoiceModal({ isOpen, onClose, invoice }) {
  const { shop } = useStore();

  if (!invoice) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleShareWhatsApp = () => {
    const rawPhone = (invoice.customer_phone || '').replace(/\D/g, '');
    const itemsSummary = (invoice.items || []).map(i => `• ${i.product_name} (${i.quantity}x) - ₹${i.total_price}`).join('\n');
    const msg = `*${shop.name}* - Bill Receipt\n\nInvoice #: ${invoice.invoice_number}\nDate: ${formatDateTime(invoice.sale_date)}\nCustomer: ${invoice.customer_name || 'Valued Customer'}\n\n*Items Purchased:*\n${itemsSummary}\n\n*Grand Total: ₹${invoice.total_amount}*\nPayment Status: ${invoice.payment_method} (${invoice.payment_status})\n\n${shop.receipt_footer_note}`;
    const url = rawPhone 
      ? `https://wa.me/${rawPhone.length === 10 ? '91' + rawPhone : rawPhone}?text=${encodeURIComponent(msg)}`
      : `https://wa.me/?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Tax Invoice Receipt" subtitle={`Invoice #${invoice.invoice_number}`} maxWidth="max-w-3xl">
      <div className="space-y-6">
        {/* Actions bar (hidden on print) */}
        <div className="flex items-center justify-between no-print bg-[#18291E] p-3 rounded-2xl border border-[#243D2D]">
          <div className="flex items-center space-x-2 text-xs text-sand-300 font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Ready for thermal receipt print & WhatsApp sharing</span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleShareWhatsApp}
              className="inline-flex items-center space-x-1.5 px-3.5 py-2 bg-emerald-700 text-white rounded-xl text-xs font-semibold hover:bg-emerald-600 transition-colors shadow-sm"
              title="Send bill directly to customer on WhatsApp"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp Bill</span>
            </button>
            <button
              onClick={handlePrint}
              className="inline-flex items-center space-x-1.5 px-4 py-2 bg-forest-700 hover:bg-forest-600 text-sand-100 rounded-xl text-xs font-bold transition-colors shadow-sm border border-forest-500/30"
            >
              <Printer className="w-4 h-4" />
              <span>Print Invoice</span>
            </button>
          </div>
        </div>

        {/* PRINTABLE INVOICE SHEET (Dark on screen, pure white on physical print) */}
        <div className="printable-area bg-[#142319] p-6 sm:p-8 rounded-2xl border border-[#243D2D] text-[#F5EFE6] print:bg-white print:text-black print:border-none print:p-0">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start pb-6 border-b border-[#243D2D] print:border-gray-300 gap-4">
            <div>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-[#1F3D2B] border border-forest-500/30 flex items-center justify-center text-sand-200 font-black text-sm print:border-black print:text-black">
                  VM
                </div>
                <h2 className="text-xl font-bold text-sand-100 print:text-black">{shop.name}</h2>
              </div>
              <p className="text-xs text-sand-300/70 print:text-gray-600 mt-1 italic">{shop.tagline}</p>
              <div className="mt-2 text-xs text-sand-300/80 print:text-gray-700 space-y-0.5">
                <p className="flex items-center"><MapPin className="w-3 h-3 mr-1 text-sand-300/50 print:text-gray-500" /> {shop.address}, {shop.city}, {shop.state} - {shop.pincode}</p>
                <p className="flex items-center"><Phone className="w-3 h-3 mr-1 text-sand-300/50 print:text-gray-500" /> Phone: {shop.phone}</p>
                <p className="font-semibold text-sand-200 print:text-gray-900">GSTIN: {shop.gstin}</p>
              </div>
            </div>

            <div className="sm:text-right">
              <span className="inline-block px-3 py-1 bg-[#18291E] text-sand-200 border border-[#243D2D] text-xs font-bold rounded-lg uppercase tracking-wider mb-2 print:border-gray-400 print:text-gray-800 print:bg-gray-100">
                ORIGINAL TAX INVOICE
              </span>
              <p className="text-sm font-bold text-sand-100 print:text-black">Invoice: {invoice.invoice_number}</p>
              <p className="text-xs text-sand-300/70 print:text-gray-600 mt-0.5">Date: {formatDateTime(invoice.sale_date)}</p>
              <p className="text-xs text-sand-300/70 print:text-gray-600">Cashier: {invoice.cashier_name || 'Staff'}</p>
              <div className="mt-2">
                <Badge variant={invoice.payment_method === 'UDHAAR' ? 'danger' : 'success'}>
                  {invoice.payment_method} PAYMENT
                </Badge>
              </div>
            </div>
          </div>

          {/* Billed To */}
          <div className="py-4 border-b border-[#243D2D] print:border-gray-300 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <p className="font-bold text-sand-300/60 print:text-gray-500 uppercase tracking-wider mb-1">Customer Details</p>
              <p className="text-sm font-bold text-sand-100 print:text-black">{invoice.customer_name || 'Walk-in Retail Buyer'}</p>
              {invoice.customer_phone && <p className="text-sand-300/70 print:text-gray-600">Mobile: {invoice.customer_phone}</p>}
            </div>
            <div className="sm:text-right">
              <p className="font-bold text-sand-300/60 print:text-gray-500 uppercase tracking-wider mb-1">Payment Status</p>
              <p className="text-sm font-bold text-emerald-400 print:text-emerald-700">{invoice.payment_status || 'PAID / COMPLETED'}</p>
              {invoice.payment_method === 'UDHAAR' && (
                <p className="text-rose-400 print:text-rose-600 font-medium">Added to Customer Udhaar Ledger</p>
              )}
            </div>
          </div>

          {/* Items Table */}
          <div className="py-4">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#243D2D] print:border-gray-300 text-sand-300/60 print:text-gray-600 uppercase font-semibold">
                  <th className="py-2.5">#</th>
                  <th className="py-2.5">Item Description</th>
                  <th className="py-2.5 text-center">Qty</th>
                  <th className="py-2.5 text-right">Unit Rate</th>
                  <th className="py-2.5 text-right">Amount (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#243D2D] print:divide-gray-200">
                {(invoice.items || []).map((item, idx) => (
                  <tr key={idx} className="hover:bg-[#18291E] print:hover:bg-transparent">
                    <td className="py-2.5 text-sand-300/50 print:text-gray-400 font-mono">{idx + 1}</td>
                    <td className="py-2.5 font-medium text-sand-100 print:text-black">{item.product_name}</td>
                    <td className="py-2.5 text-center font-mono font-semibold text-sand-200 print:text-black">{item.quantity}</td>
                    <td className="py-2.5 text-right font-mono text-sand-300/80 print:text-gray-700">{formatINR(item.unit_price)}</td>
                    <td className="py-2.5 text-right font-mono font-bold text-sand-100 print:text-black">{formatINR(item.total_price)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals & Calculations */}
          <div className="pt-4 border-t border-[#243D2D] print:border-gray-300 flex flex-col sm:flex-row justify-between items-start gap-4">
            <div className="max-w-xs text-xs text-sand-300/60 print:text-gray-500">
              <p className="font-semibold text-sand-200 print:text-gray-700 mb-1">Terms & Conditions:</p>
              <p>{shop.receipt_footer_note}</p>
              <div className="mt-4 pt-2 border-t border-[#243D2D] print:border-gray-200">
                <p className="font-mono text-[11px] text-sand-300/40 print:text-gray-400">Powered by VyaparMitra AI SaaS</p>
              </div>
            </div>

            <div className="w-full sm:w-64 space-y-1.5 text-xs text-sand-300/80 print:text-gray-700">
              <div className="flex justify-between py-1">
                <span>Subtotal:</span>
                <span className="font-mono font-medium text-sand-100 print:text-black">{formatINR(invoice.subtotal)}</span>
              </div>
              {invoice.discount_amount > 0 && (
                <div className="flex justify-between py-1 text-emerald-400 print:text-emerald-700 font-medium">
                  <span>Discount:</span>
                  <span className="font-mono">- {formatINR(invoice.discount_amount)}</span>
                </div>
              )}
              {invoice.tax_amount > 0 && (
                <div className="flex justify-between py-1">
                  <span>GST Tax (Included/Applicable):</span>
                  <span className="font-mono text-sand-100 print:text-black">{formatINR(invoice.tax_amount)}</span>
                </div>
              )}
              <div className="flex justify-between py-2.5 border-t-2 border-forest-600 print:border-black text-sm font-extrabold text-sand-100 print:text-black">
                <span>Grand Total:</span>
                <span className="font-mono text-sand-100 print:text-black">{formatINR(invoice.total_amount)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
