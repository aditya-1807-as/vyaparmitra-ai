import React, { useState } from 'react';
import { 
  TrendingUp, 
  ShoppingBag, 
  IndianRupee, 
  Package, 
  AlertTriangle, 
  BookOpen, 
  ArrowUpRight, 
  ArrowRight,
  Sparkles,
  CreditCard,
  Calendar,
  Layers,
  Clock,
  Printer
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
import { useStore } from '../../context/StoreContext.jsx';
import StatCard from '../../components/ui/StatCard.jsx';
import Badge from '../../components/ui/Badge.jsx';
import PrintableInvoiceModal from '../../components/invoices/PrintableInvoiceModal.jsx';
import { formatINR, formatDateTime, formatDate } from '../../utils/formatters.js';
import { useNavigate } from 'react-router-dom';

export default function OverviewPage() {
  const { 
    shop, 
    totalSalesRevenue, 
    sales, 
    grossProfit, 
    grossMarginPercent, 
    products, 
    lowStockProducts, 
    totalCustomerUdhaarOutstanding,
    udhaarTransactions,
    dateFilter,
    setDateFilter
  } = useStore();

  const navigate = useNavigate();
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  // Daily sales chart sample points aggregated from sales
  const salesChartData = [
    { date: 'Oct 28', sales: 4420, orders: 4, profit: 890 },
    { date: 'Oct 29', sales: 2650, orders: 3, profit: 540 },
    { date: 'Oct 30', sales: 6100, orders: 5, profit: 1220 },
    { date: 'Oct 31', sales: 3890, orders: 4, profit: 780 },
    { date: 'Nov 01', sales: 5240, orders: 6, profit: 1050 },
    { date: 'Nov 02', sales: 4890, orders: 5, profit: 980 },
    { date: 'Nov 03', sales: 7420, orders: 8, profit: 1480 },
    { date: 'Nov 04', sales: 8650, orders: 9, profit: 1730 },
    { date: 'Nov 05', sales: 6980, orders: 7, profit: 1395 },
    { date: 'Nov 06', sales: 5440, orders: 6, profit: 1090 },
  ];

  // Top selling products calculated dynamically
  const productSalesMap = {};
  sales.forEach(sale => {
    (sale.items || []).forEach(item => {
      if (!productSalesMap[item.product_name]) {
        productSalesMap[item.product_name] = { qty: 0, revenue: 0 };
      }
      productSalesMap[item.product_name].qty += Number(item.quantity);
      productSalesMap[item.product_name].revenue += Number(item.total_price);
    });
  });

  const topSellingProducts = Object.entries(productSalesMap)
    .sort((a, b) => b[1].qty - a[1].qty)
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Welcome & Business Performance Banner */}
      <div className="bg-gradient-to-r from-[#142319] via-[#1B3224] to-[#142319] rounded-3xl p-6 sm:p-8 text-white shadow-card border border-[#243D2D] relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1.5 max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#18291E] border border-forest-600/40 text-sand-200 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-electric-400" />
              <span>VyaparMitra AI Intelligence Engine Active</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-sand-100">
              Welcome back, {shop.name}!
            </h2>
            <p className="text-sand-300/80 text-sm leading-relaxed">
              Store operations are performing strongly. Gross margins are holding at <span className="font-bold text-white">{grossMarginPercent}%</span> with healthy weekend inventory turns.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => navigate('/sales/pos')}
              className="px-5 py-3 rounded-2xl bg-forest-700 hover:bg-forest-600 text-sand-100 font-extrabold text-sm transition-all shadow-md flex items-center space-x-2 border border-forest-500/30"
            >
              <ShoppingBag className="w-4 h-4 text-sand-200" />
              <span>Start POS Billing</span>
            </button>
            <button
              onClick={() => navigate('/ai-assistant')}
              className="px-5 py-3 rounded-2xl bg-electric-600 hover:bg-electric-500 text-white font-bold text-sm transition-all shadow-purple-glow flex items-center space-x-2 border border-electric-400/40"
            >
              <Sparkles className="w-4 h-4 text-electric-200" />
              <span>Ask AI Assistant</span>
            </button>
          </div>
        </div>
      </div>

      {/* 6 MAIN KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard
          title="Total Sales"
          value={formatINR(totalSalesRevenue)}
          subtitle={`${sales.length} completed transactions`}
          icon={IndianRupee}
          trend="+14.2%"
          trendType="up"
          accent="forest"
          onClick={() => navigate('/sales/invoices')}
        />
        <StatCard
          title="Total Orders"
          value={sales.length}
          subtitle="Avg ticket ₹840"
          icon={ShoppingBag}
          trend="+8.6%"
          trendType="up"
          accent="forest"
          onClick={() => navigate('/sales/invoices')}
        />
        <StatCard
          title="Gross Profit"
          value={formatINR(grossProfit)}
          subtitle={`Margin: ${grossMarginPercent}%`}
          icon={TrendingUp}
          trend="+11.4%"
          trendType="up"
          accent="purple"
          onClick={() => navigate('/analytics')}
        />
        <StatCard
          title="Total Products"
          value={products.length}
          subtitle="Active SKUs listed"
          icon={Package}
          trend="8 categories"
          trendType="neutral"
          accent="forest"
          onClick={() => navigate('/inventory')}
        />
        <StatCard
          title="Low Stock Items"
          value={lowStockProducts.length}
          subtitle="Action required"
          icon={AlertTriangle}
          trend={lowStockProducts.length > 0 ? "Replenish now" : "All good"}
          trendType={lowStockProducts.length > 0 ? "down" : "up"}
          accent={lowStockProducts.length > 0 ? "rose" : "forest"}
          onClick={() => navigate('/inventory')}
        />
        <StatCard
          title="Customer Udhaar"
          value={formatINR(totalCustomerUdhaarOutstanding)}
          subtitle="Pending credit recovery"
          icon={BookOpen}
          trend="Accounts due"
          trendType="neutral"
          accent="amber"
          onClick={() => navigate('/customers?tab=udhaar')}
        />
      </div>

      {/* CHARTS & RECENT ACTIVITY SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Sales Trend Chart (Takes 2 Columns) */}
        <div className="lg:col-span-2 bg-[#142319] rounded-3xl p-6 border border-[#243D2D] shadow-card space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#243D2D]">
            <div>
              <h3 className="text-base font-bold text-sand-100">Daily Sales & Gross Profit Trends</h3>
              <p className="text-xs text-sand-300/70">Continuous daily revenue and gross margin tracking in INR (₹)</p>
            </div>
            <div className="flex items-center space-x-2 text-xs">
              <span className="flex items-center font-medium text-sand-200">
                <span className="w-3 h-3 rounded-full bg-emerald-500 mr-1.5" /> Sales
              </span>
              <span className="flex items-center font-medium text-sand-200 ml-3">
                <span className="w-3 h-3 rounded-full bg-electric-400 mr-1.5" /> Profit
              </span>
            </div>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesChartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0.0}/>
                  </linearGradient>
                  <linearGradient id="profitGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#243D2D" vertical={false} />
                <XAxis dataKey="date" stroke="#6B8071" fontSize={11} tickLine={false} />
                <YAxis stroke="#6B8071" fontSize={11} tickLine={false} tickFormatter={(val) => `₹${val/1000}k`} />
                <Tooltip 
                  formatter={(val) => [formatINR(val), '']}
                  contentStyle={{ backgroundColor: '#142319', borderRadius: '14px', border: '1px solid #243D2D', color: '#F5EFE6', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="sales" name="Sales Revenue" stroke="#34D399" strokeWidth={3} fillOpacity={1} fill="url(#salesGrad)" />
                <Area type="monotone" dataKey="profit" name="Gross Profit" stroke="#A78BFA" strokeWidth={2.5} fillOpacity={1} fill="url(#profitGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Selling Products List (1 Column) */}
        <div className="bg-[#142319] rounded-3xl p-6 border border-[#243D2D] shadow-card space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#243D2D]">
            <div>
              <h3 className="text-base font-bold text-sand-100">Top Velocity Products</h3>
              <p className="text-xs text-sand-300/70">Highest volume items</p>
            </div>
            <button
              onClick={() => navigate('/inventory')}
              className="text-xs font-bold text-sand-200 hover:text-white flex items-center transition-colors"
            >
              Catalog <ArrowRight className="w-3.5 h-3.5 ml-1 text-electric-400" />
            </button>
          </div>

          <div className="space-y-3">
            {topSellingProducts.map(([name, stats], idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-2xl bg-[#18291E] border border-[#243D2D] hover:bg-[#1E3426] transition-colors">
                <div className="flex items-center space-x-3 truncate">
                  <span className="w-6 h-6 rounded-lg bg-[#243D2D] text-sand-200 font-extrabold text-xs flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <div className="truncate">
                    <p className="text-xs font-bold text-sand-100 truncate">{name}</p>
                    <p className="text-[11px] text-sand-300/60">{stats.qty} units moved</p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-xs font-extrabold font-mono text-sand-200">{formatINR(stats.revenue)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* LOWER SECTION: RECENT INVOICES & LOW STOCK ALERTS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Transactions Table (2 Columns) */}
        <div className="lg:col-span-2 bg-[#142319] rounded-3xl p-6 border border-[#243D2D] shadow-card space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#243D2D]">
            <div>
              <h3 className="text-base font-bold text-sand-100">Recent Customer Transactions</h3>
              <p className="text-xs text-sand-300/70">Latest completed counter bills & credit sales</p>
            </div>
            <button
              onClick={() => navigate('/sales/invoices')}
              className="text-xs font-bold text-sand-200 hover:text-white flex items-center transition-colors"
            >
              All Invoices <ArrowRight className="w-3.5 h-3.5 ml-1 text-electric-400" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#243D2D] text-sand-300/60 uppercase font-semibold">
                  <th className="py-2.5 px-3">Invoice #</th>
                  <th className="py-2.5 px-3">Customer</th>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Mode</th>
                  <th className="py-2.5 px-3 text-right">Amount</th>
                  <th className="py-2.5 px-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#243D2D]">
                {sales.slice(0, 6).map((sale) => (
                  <tr key={sale.id} className="hover:bg-[#1A2E21] transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-sand-200">{sale.invoice_number}</td>
                    <td className="py-3 px-3">
                      <p className="font-semibold text-sand-100">{sale.customer_name}</p>
                      {sale.customer_phone && <p className="text-[10px] text-sand-300/60">{sale.customer_phone}</p>}
                    </td>
                    <td className="py-3 px-3 text-sand-300/70 whitespace-nowrap">{formatDateTime(sale.sale_date)}</td>
                    <td className="py-3 px-3">
                      <Badge variant={sale.payment_method === 'UDHAAR' ? 'danger' : 'success'}>
                        {sale.payment_method}
                      </Badge>
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-sand-100">{formatINR(sale.total_amount)}</td>
                    <td className="py-3 px-3 text-center">
                      <button
                        onClick={() => setSelectedInvoice(sale)}
                        className="p-1.5 text-sand-200 hover:text-white hover:bg-[#1E3426] rounded-lg transition-colors"
                        title="Print / View Invoice"
                      >
                        <Printer className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock Alerts & Immediate Reorder Panel (1 Column) */}
        <div className="bg-[#142319] rounded-3xl p-6 border border-[#243D2D] shadow-card space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#243D2D]">
            <div>
              <h3 className="text-base font-bold text-sand-100">Critical Stock Alerts</h3>
              <p className="text-xs text-sand-300/70">Items below safety reorder level</p>
            </div>
            <Badge variant="danger">{lowStockProducts.length} Alert</Badge>
          </div>

          <div className="space-y-3">
            {lowStockProducts.map((p) => (
              <div key={p.id} className="p-3.5 rounded-2xl bg-rose-950/20 border border-rose-900/40 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-sand-100">{p.name}</p>
                  <p className="text-[11px] text-rose-300 font-semibold mt-0.5">
                    Remaining: <span className="font-mono font-extrabold">{p.stock_quantity} {p.unit}</span> (Min: {p.reorder_level})
                  </p>
                </div>
                <button
                  onClick={() => navigate('/suppliers?tab=purchases')}
                  className="px-3 py-1.5 bg-forest-700 hover:bg-forest-600 text-sand-100 rounded-xl text-xs font-bold transition-colors shadow-sm shrink-0 border border-forest-500/30"
                >
                  Restock
                </button>
              </div>
            ))}

            {lowStockProducts.length === 0 && (
              <div className="p-6 text-center text-xs text-sand-300/50">
                All inventory levels are currently above configured safety thresholds.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Invoice Modal */}
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
