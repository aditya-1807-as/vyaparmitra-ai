import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Download, 
  Printer, 
  Calendar, 
  IndianRupee, 
  ShoppingBag, 
  Package, 
  BookOpen, 
  Truck, 
  Layers,
  PieChart as PieIcon,
  Filter
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { useStore } from '../../context/StoreContext.jsx';
import Badge from '../../components/ui/Badge.jsx';
import { formatINR, downloadCSV } from '../../utils/formatters.js';

export default function AnalyticsReportsPage() {
  const { 
    sales, 
    purchases, 
    products, 
    categories, 
    customers, 
    suppliers, 
    expenses, 
    totalSalesRevenue, 
    grossProfit, 
    grossMarginPercent, 
    totalOperatingExpenses, 
    netProfit, 
    totalInventoryValuation, 
    totalCustomerUdhaarOutstanding,
    totalSupplierDue
  } = useStore();

  const [activeReport, setActiveReport] = useState('sales'); // 'sales' | 'purchases' | 'gross_profit' | 'inventory' | 'product_perf' | 'customer_credit' | 'supplier_due' | 'expenses'
  const [reportTimeframe, setReportTimeframe] = useState('30days');

  // Chart Colors matching Forest Green, Sand, and Electric Purple on Dark
  const COLORS = ['#10B981', '#8B5CF6', '#F59E0B', '#3B82F6', '#06B6D4', '#EC4899', '#E8DCC4', '#94A3B8'];

  // 1. Sales Trend Data
  const salesDailyData = [
    { date: 'Day 1-5', sales: 18500, orders: 22, profit: 3700 },
    { date: 'Day 6-10', sales: 24200, orders: 28, profit: 4840 },
    { date: 'Day 11-15', sales: 21800, orders: 25, profit: 4360 },
    { date: 'Day 16-20', sales: 29500, orders: 34, profit: 5900 },
    { date: 'Day 21-25', sales: 32400, orders: 38, profit: 6480 },
    { date: 'Day 26-30', sales: 27900, orders: 31, profit: 5580 },
  ];

  // 2. Category Revenue Share
  const categorySalesMap = {};
  sales.forEach(sale => {
    (sale.items || []).forEach(item => {
      const prod = products.find(p => p.id === item.product_id);
      const cat = categories.find(c => c.id === prod?.category_id);
      const catName = cat ? cat.name : 'Other Groceries';
      categorySalesMap[catName] = (categorySalesMap[catName] || 0) + Number(item.total_price);
    });
  });

  const categoryPieData = Object.entries(categorySalesMap).map(([name, value]) => ({
    name,
    value
  }));

  // 3. Payment Method Distribution
  const paymentMethodMap = {};
  sales.forEach(s => {
    paymentMethodMap[s.payment_method] = (paymentMethodMap[s.payment_method] || 0) + Number(s.total_amount);
  });
  const paymentPieData = Object.entries(paymentMethodMap).map(([name, value]) => ({
    name,
    value
  }));

  // 4. Expense Breakdown
  const expenseMap = {};
  expenses.forEach(e => {
    expenseMap[e.category] = (expenseMap[e.category] || 0) + Number(e.amount);
  });
  const expenseBarData = Object.entries(expenseMap).map(([category, amount]) => ({
    category,
    amount
  }));

  // Report Switching Definitions
  const reportsList = [
    { id: 'sales', name: '1. Sales Report', icon: ShoppingBag },
    { id: 'purchases', name: '2. Purchase Report', icon: Truck },
    { id: 'gross_profit', name: '3. Gross vs Net Profit', icon: TrendingUp },
    { id: 'inventory', name: '4. Inventory Valuation', icon: Package },
    { id: 'product_perf', name: '5. Product Performance', icon: BarChart3 },
    { id: 'customer_credit', name: '6. Customer Credit (Udhaar)', icon: BookOpen },
    { id: 'supplier_due', name: '7. Supplier Outstanding', icon: IndianRupee },
    { id: 'expenses', name: '8. Expense Report', icon: Layers }
  ];

  // CSV Export for active report
  const handleExportCSV = () => {
    let rows = [];
    let filename = `VyaparMitra_${activeReport}_Report`;

    if (activeReport === 'sales') {
      rows = sales.map(s => ({
        Invoice: s.invoice_number,
        Date: s.sale_date,
        Customer: s.customer_name,
        Total: s.total_amount,
        Method: s.payment_method
      }));
    } else if (activeReport === 'purchases') {
      rows = purchases.map(p => ({
        Invoice: p.invoice_number,
        Supplier: p.supplier_name,
        Date: p.purchase_date,
        Total: p.total_amount,
        Paid: p.paid_amount,
        Status: p.payment_status
      }));
    } else if (activeReport === 'gross_profit') {
      rows = [
        { Metric: 'Total Gross Sales', Value: totalSalesRevenue },
        { Metric: 'Cost of Goods Sold (COGS)', Value: totalSalesRevenue - grossProfit },
        { Metric: 'Gross Profit', Value: grossProfit },
        { Metric: 'Gross Margin %', Value: `${grossMarginPercent}%` },
        { Metric: 'Operating Expenses', Value: totalOperatingExpenses },
        { Metric: 'Net Profit', Value: netProfit }
      ];
    } else if (activeReport === 'inventory') {
      rows = products.map(p => ({
        Name: p.name,
        SKU: p.sku,
        Stock: p.stock_quantity,
        Cost: p.purchase_price,
        Valuation: p.stock_quantity * p.purchase_price
      }));
    } else if (activeReport === 'customer_credit') {
      rows = customers.map(c => ({
        Name: c.name,
        Phone: c.phone,
        OutstandingBalance: c.outstanding_balance,
        CreditLimit: c.credit_limit
      }));
    } else if (activeReport === 'expenses') {
      rows = expenses.map(e => ({
        Title: e.title,
        Category: e.category,
        Amount: e.amount,
        Date: e.date,
        Method: e.payment_method
      }));
    } else {
      rows = suppliers.map(s => ({
        Name: s.name,
        Phone: s.phone,
        BalanceDue: s.balance_due
      }));
    }

    downloadCSV(filename, rows);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
        <div>
          <h2 className="text-2xl font-extrabold text-sand-100 tracking-tight">Business Analytics & Financial Reports</h2>
          <p className="text-xs text-sand-300/70">Comprehensive retail intelligence, profit audits, category shares, and tax breakdowns</p>
        </div>

        <div className="flex items-center space-x-2.5">
          <select
            value={reportTimeframe}
            onChange={e => setReportTimeframe(e.target.value)}
            className="px-3 py-2 bg-[#142319] border border-[#243D2D] rounded-xl text-xs font-semibold text-sand-200 focus:outline-none cursor-pointer shadow-card"
          >
            <option value="today">Today</option>
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="month">Current Month</option>
            <option value="year">Full Fiscal Year</option>
          </select>

          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 rounded-xl bg-[#142319] border border-[#243D2D] text-sand-200 text-xs font-semibold hover:bg-[#1A2E21] transition-colors flex items-center space-x-1.5 shadow-card"
          >
            <Download className="w-3.5 h-3.5 text-sand-300" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-3.5 py-2 rounded-xl bg-forest-700 hover:bg-forest-600 text-sand-100 text-xs font-bold transition-colors flex items-center space-x-1.5 shadow-sm border border-forest-500/30"
          >
            <Printer className="w-3.5 h-3.5 text-sand-200" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* 8 REPORT BUTTONS TABS */}
      <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-none no-print">
        {reportsList.map(rep => {
          const Icon = rep.icon;
          const isActive = activeReport === rep.id;
          return (
            <button
              key={rep.id}
              onClick={() => setActiveReport(rep.id)}
              className={`
                px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap flex items-center space-x-2 transition-all shadow-card
                ${isActive 
                  ? 'bg-forest-700 text-sand-100 border border-forest-500/40 shadow-md' 
                  : 'bg-[#142319] border border-[#243D2D] text-sand-300 hover:bg-[#18291E]'}
              `}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{rep.name}</span>
            </button>
          );
        })}
      </div>

      {/* PRINTABLE REPORT SHEET CONTAINER */}
      <div className="printable-area space-y-6">
        {/* REPORT 1: SALES REPORT */}
        {activeReport === 'sales' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-[#142319] p-5 rounded-2xl border border-[#243D2D] shadow-card">
                <p className="text-[11px] font-bold text-sand-300/60 uppercase">Gross Sales Revenue</p>
                <p className="text-2xl font-black text-sand-100 font-mono mt-1">{formatINR(totalSalesRevenue)}</p>
              </div>
              <div className="bg-[#142319] p-5 rounded-2xl border border-[#243D2D] shadow-card">
                <p className="text-[11px] font-bold text-sand-300/60 uppercase">Total Orders Completed</p>
                <p className="text-2xl font-black text-sand-100 mt-1">{sales.length} Bills</p>
              </div>
              <div className="bg-[#142319] p-5 rounded-2xl border border-[#243D2D] shadow-card">
                <p className="text-[11px] font-bold text-sand-300/60 uppercase">Average Ticket Value</p>
                <p className="text-2xl font-black text-sand-100 font-mono mt-1">
                  {formatINR(sales.length > 0 ? totalSalesRevenue / sales.length : 0)}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Sales by Category Pie */}
              <div className="bg-[#142319] p-6 rounded-3xl border border-[#243D2D] shadow-card space-y-3">
                <h4 className="text-sm font-bold text-sand-100">Sales Volume by Product Category</h4>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryPieData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                        labelLine={false}
                      >
                        {categoryPieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={val => formatINR(val)}
                        contentStyle={{ backgroundColor: '#142319', borderRadius: '12px', border: '1px solid #243D2D', color: '#F5EFE6', fontSize: '12px' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Payment Methods Breakdown */}
              <div className="bg-[#142319] p-6 rounded-3xl border border-[#243D2D] shadow-card space-y-3">
                <h4 className="text-sm font-bold text-sand-100">Payment Mode Distribution</h4>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={paymentPieData} margin={{ top: 20, right: 20, left: 0, bottom: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#243D2D" />
                      <XAxis dataKey="name" fontSize={11} stroke="#6B8071" />
                      <YAxis fontSize={11} stroke="#6B8071" tickFormatter={v => `₹${v/1000}k`} />
                      <Tooltip 
                        formatter={val => formatINR(val)}
                        contentStyle={{ backgroundColor: '#142319', borderRadius: '12px', border: '1px solid #243D2D', color: '#F5EFE6', fontSize: '12px' }}
                      />
                      <Bar dataKey="value" fill="#34D399" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* REPORT 3: GROSS PROFIT VS NET PROFIT */}
        {activeReport === 'gross_profit' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-[#142319] to-[#1B3224] p-6 rounded-3xl text-white shadow-card border border-[#243D2D]">
              <h3 className="text-lg font-bold text-sand-100">Standard Retail P&L Financial Statement</h3>
              <p className="text-xs text-sand-300/80 mt-1">
                Net Sales - Cost of Goods Sold = Gross Profit | Gross Profit - Operating Expenses = Net Profit
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
                <div className="p-4 rounded-2xl bg-[#18291E] border border-[#243D2D]">
                  <p className="text-[11px] uppercase font-bold text-sand-300/70">Net Sales Turnover</p>
                  <p className="text-2xl font-black font-mono mt-1 text-white">{formatINR(totalSalesRevenue)}</p>
                </div>
                <div className="p-4 rounded-2xl bg-[#18291E] border border-[#243D2D]">
                  <p className="text-[11px] uppercase font-bold text-sand-300/70">Gross Profit (Pre-Expenses)</p>
                  <p className="text-2xl font-black font-mono mt-1 text-sand-200">{formatINR(grossProfit)}</p>
                  <p className="text-[11px] text-emerald-400 mt-1 font-semibold">{grossMarginPercent}% Gross Margin</p>
                </div>
                <div className="p-4 rounded-2xl bg-electric-950/30 border border-electric-500/40">
                  <p className="text-[11px] uppercase font-bold text-electric-300">Net Clean Operating Profit</p>
                  <p className="text-2xl font-black font-mono mt-1 text-white">{formatINR(netProfit)}</p>
                  <p className="text-[11px] text-electric-300/80 mt-1 font-semibold">After all overhead bills & rent</p>
                </div>
              </div>
            </div>

            {/* Itemized P&L Table */}
            <div className="bg-[#142319] rounded-3xl border border-[#243D2D] shadow-card overflow-hidden">
              <div className="p-4 bg-[#18291E] border-b border-[#243D2D]">
                <h4 className="text-xs font-bold text-sand-200 uppercase tracking-wider">Itemized Retail P&L Schedule</h4>
              </div>
              <table className="w-full text-left text-xs">
                <tbody className="divide-y divide-[#243D2D]">
                  <tr className="hover:bg-[#1A2E21]">
                    <td className="py-3 px-5 font-bold text-sand-100">1. Gross Retail Sales Revenue</td>
                    <td className="py-3 px-5 text-right font-mono font-bold text-sand-100">{formatINR(totalSalesRevenue)}</td>
                  </tr>
                  <tr className="hover:bg-[#1A2E21] text-sand-300/70">
                    <td className="py-3 px-5 pl-10">Less: Cost of Goods Sold (Supplier Wholesale Acquisition)</td>
                    <td className="py-3 px-5 text-right font-mono text-rose-400">- {formatINR(totalSalesRevenue - grossProfit)}</td>
                  </tr>
                  <tr className="bg-[#18291E] font-bold text-sand-100">
                    <td className="py-3.5 px-5">GROSS TRADING PROFIT</td>
                    <td className="py-3.5 px-5 text-right font-mono text-base font-black text-sand-100">{formatINR(grossProfit)}</td>
                  </tr>
                  <tr className="hover:bg-[#1A2E21] text-sand-300/70">
                    <td className="py-3 px-5 pl-10">Less: Commercial Store Rent (Indiranagar Market)</td>
                    <td className="py-3 px-5 text-right font-mono text-sand-300/80">- ₹28,000</td>
                  </tr>
                  <tr className="hover:bg-[#1A2E21] text-sand-300/70">
                    <td className="py-3 px-5 pl-10">Less: Employee Staff & Cashier Salaries</td>
                    <td className="py-3 px-5 text-right font-mono text-sand-300/80">- ₹22,000</td>
                  </tr>
                  <tr className="hover:bg-[#1A2E21] text-sand-300/70">
                    <td className="py-3 px-5 pl-10">Less: Commercial BESCOM Electricity & Power</td>
                    <td className="py-3 px-5 text-right font-mono text-sand-300/80">- ₹4,850</td>
                  </tr>
                  <tr className="hover:bg-[#1A2E21] text-sand-300/70">
                    <td className="py-3 px-5 pl-10">Less: Tempo Freight & Maintenance Logistics</td>
                    <td className="py-3 px-5 text-right font-mono text-sand-300/80">- ₹6,200</td>
                  </tr>
                  <tr className="bg-[#1F3D2B]/80 font-black text-white border-t-2 border-forest-500">
                    <td className="py-4 px-5 text-sm">FINAL NET OPERATING PROFIT</td>
                    <td className="py-4 px-5 text-right font-mono text-lg font-black text-white">{formatINR(netProfit)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* REPORT 4: INVENTORY VALUATION */}
        {activeReport === 'inventory' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-[#142319] p-5 rounded-2xl border border-[#243D2D] shadow-card">
                <p className="text-[11px] font-bold text-sand-300/60 uppercase">Total Inventory Value (Wholesale Cost)</p>
                <p className="text-2xl font-black text-sand-100 font-mono mt-1">{formatINR(totalInventoryValuation)}</p>
                <p className="text-xs text-sand-300/70 mt-1">Capital invested in physical warehouse & shelf stock</p>
              </div>
              <div className="bg-[#142319] p-5 rounded-2xl border border-[#243D2D] shadow-card">
                <p className="text-[11px] font-bold text-sand-300/60 uppercase">Estimated Retail Sales Realization</p>
                <p className="text-2xl font-black text-sand-200 font-mono mt-1">
                  {formatINR(products.reduce((sum, p) => sum + (p.stock_quantity * p.selling_price), 0))}
                </p>
                <p className="text-xs text-sand-300/70 mt-1">Gross potential value at retail selling rates</p>
              </div>
            </div>

            <div className="bg-[#142319] rounded-3xl border border-[#243D2D] shadow-card overflow-hidden">
              <div className="p-4 bg-[#18291E] border-b border-[#243D2D]">
                <h4 className="text-xs font-bold text-sand-200 uppercase tracking-wider">Product Inventory Valuation Breakdown</h4>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-[#243D2D] text-sand-300/60 uppercase font-semibold">
                      <th className="py-3 px-4">Product Name</th>
                      <th className="py-3 px-4">SKU</th>
                      <th className="py-3 px-4 text-center">Available Stock</th>
                      <th className="py-3 px-4 text-right">Unit Cost</th>
                      <th className="py-3 px-4 text-right">Unit Retail</th>
                      <th className="py-3 px-4 text-right">Total Cost Value</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#243D2D]">
                    {products.slice(0, 12).map(p => (
                      <tr key={p.id} className="hover:bg-[#1A2E21]">
                        <td className="py-3 px-4 font-bold text-sand-100">{p.name}</td>
                        <td className="py-3 px-4 font-mono text-sand-300/60">{p.sku}</td>
                        <td className="py-3 px-4 text-center font-mono font-bold text-sand-100">{p.stock_quantity} {p.unit}</td>
                        <td className="py-3 px-4 text-right font-mono text-sand-300/70">{formatINR(p.purchase_price)}</td>
                        <td className="py-3 px-4 text-right font-mono text-sand-200">{formatINR(p.selling_price)}</td>
                        <td className="py-3 px-4 text-right font-mono font-extrabold text-sand-100">{formatINR(p.stock_quantity * p.purchase_price)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* REPORT 6: CUSTOMER UDHAAR CREDIT REPORT */}
        {activeReport === 'customer_credit' && (
          <div className="space-y-6">
            <div className="bg-[#142319] p-5 rounded-3xl border border-[#243D2D] shadow-card flex justify-between items-center">
              <div>
                <h3 className="text-base font-bold text-sand-100">Customer Credit & Udhaar Risk Audit</h3>
                <p className="text-xs text-sand-300/70">Aging and exposure analysis across customer retail accounts</p>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-sand-300/60 font-bold uppercase">Total Store Credit Given</span>
                <p className="text-xl font-extrabold text-rose-400 font-mono">{formatINR(totalCustomerUdhaarOutstanding)}</p>
              </div>
            </div>

            <div className="bg-[#142319] rounded-3xl border border-[#243D2D] shadow-card overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#243D2D] bg-[#18291E] text-sand-300/60 uppercase font-semibold">
                    <th className="py-3 px-4">Customer</th>
                    <th className="py-3 px-4">Mobile</th>
                    <th className="py-3 px-4 text-right">Sanctioned Limit</th>
                    <th className="py-3 px-4 text-right">Outstanding Due</th>
                    <th className="py-3 px-4 text-center">Credit Utilization</th>
                    <th className="py-3 px-4 text-center">Risk Tier</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#243D2D]">
                  {customers.filter(c => c.outstanding_balance > 0).map(c => {
                    const utilPercent = Math.round((c.outstanding_balance / (c.credit_limit || 1)) * 100);
                    return (
                      <tr key={c.id} className="hover:bg-[#1A2E21]">
                        <td className="py-3 px-4 font-bold text-sand-100">{c.name}</td>
                        <td className="py-3 px-4 font-mono text-sand-300/60">{c.phone}</td>
                        <td className="py-3 px-4 text-right font-mono text-sand-300/80">{formatINR(c.credit_limit)}</td>
                        <td className="py-3 px-4 text-right font-mono font-extrabold text-rose-400">{formatINR(c.outstanding_balance)}</td>
                        <td className="py-3 px-4 text-center font-mono text-sand-200">{utilPercent}%</td>
                        <td className="py-3 px-4 text-center">
                          {utilPercent > 70 ? (
                            <Badge variant="danger">High Exposure</Badge>
                          ) : (
                            <Badge variant="warning">Normal</Badge>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* DEFAULT / OTHER REPORTS (Purchases, Expenses, Supplier Dues, Product Perf) */}
        {(activeReport === 'purchases' || activeReport === 'product_perf' || activeReport === 'supplier_due' || activeReport === 'expenses') && (
          <div className="bg-[#142319] rounded-3xl border border-[#243D2D] shadow-card p-6 space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-[#243D2D]">
              <div>
                <h3 className="text-base font-bold text-sand-100 capitalize">{activeReport.replace('_', ' ')} Statement</h3>
                <p className="text-xs text-sand-300/70">Live transaction records matching selected fiscal date filters</p>
              </div>
              <span className="text-xs font-mono font-bold text-sand-200">Period: {reportTimeframe}</span>
            </div>

            {activeReport === 'expenses' && (
              <div className="space-y-4">
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={expenseBarData} margin={{ top: 20, right: 20, left: 10, bottom: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#243D2D" />
                      <XAxis dataKey="category" fontSize={11} stroke="#6B8071" />
                      <YAxis fontSize={11} stroke="#6B8071" tickFormatter={v => `₹${v/1000}k`} />
                      <Tooltip 
                        formatter={val => formatINR(val)}
                        contentStyle={{ backgroundColor: '#142319', borderRadius: '12px', border: '1px solid #243D2D', color: '#F5EFE6', fontSize: '12px' }}
                      />
                      <Bar dataKey="amount" fill="#A78BFA" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="divide-y divide-[#243D2D] text-xs">
                  {expenses.map(e => (
                    <div key={e.id} className="py-3 flex justify-between items-center hover:bg-[#1A2E21] px-2 rounded-xl transition-colors">
                      <div>
                        <p className="font-bold text-sand-100">{e.title}</p>
                        <p className="text-[11px] text-sand-300/60">{e.category} • {e.date} • Mode: {e.payment_method}</p>
                      </div>
                      <span className="font-mono font-extrabold text-sand-100">{formatINR(e.amount)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeReport === 'purchases' && (
              <div className="divide-y divide-[#243D2D] text-xs">
                {purchases.map(p => (
                  <div key={p.id} className="py-3 flex justify-between items-center hover:bg-[#1A2E21] px-2 rounded-xl transition-colors">
                    <div>
                      <p className="font-bold text-sand-100">{p.supplier_name}</p>
                      <p className="text-[11px] text-sand-300/60 font-mono">Invoice: {p.invoice_number} • Date: {p.purchase_date.split('T')[0]}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-mono font-extrabold text-sand-100">{formatINR(p.total_amount)}</p>
                      <p className="text-[10px] text-emerald-400 font-semibold">Paid: {formatINR(p.paid_amount)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeReport === 'supplier_due' && (
              <div className="divide-y divide-[#243D2D] text-xs">
                {suppliers.map(s => (
                  <div key={s.id} className="py-3 flex justify-between items-center hover:bg-[#1A2E21] px-2 rounded-xl transition-colors">
                    <div>
                      <p className="font-bold text-sand-100">{s.name}</p>
                      <p className="text-[11px] text-sand-300/60">Phone: {s.phone} • Lead Time: {s.lead_time_days} days</p>
                    </div>
                    <div className="text-right">
                      <p className={`font-mono font-extrabold ${s.balance_due > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                        {formatINR(s.balance_due)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
