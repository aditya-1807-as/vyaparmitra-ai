/**
 * VyaparMitra AI - Core Business Logic & Financial Calculations
 * Implements standard retail mathematical formulas conforming to Section 15
 */

/**
 * Gross Profit Calculation:
 * Gross Profit = Net Sales - Cost of Goods Sold (COGS)
 * Gross Profit Margin (%) = (Gross Profit / Net Sales) * 100
 */
export function calculateGrossProfit(netSales, cogs) {
  const profit = Number(netSales || 0) - Number(cogs || 0);
  const margin = netSales > 0 ? (profit / netSales) * 100 : 0;
  return {
    grossProfit: Math.round(profit * 100) / 100,
    grossMarginPercent: Math.round(margin * 10) / 10
  };
}

/**
 * Net Profit Calculation:
 * Net Profit = Gross Profit - Operating Expenses
 */
export function calculateNetProfit(grossProfit, operatingExpenses) {
  const net = Number(grossProfit || 0) - Number(operatingExpenses || 0);
  return Math.round(net * 100) / 100;
}

/**
 * Customer Outstanding Balance:
 * Customer Outstanding = Total Credit Charges (Udhaar Given) - Total Credit Payments Received
 */
export function calculateCustomerOutstanding(transactions) {
  if (!Array.isArray(transactions)) return 0;
  const balance = transactions.reduce((acc, tx) => {
    if (tx.type === 'CREDIT' || tx.transaction_type === 'CREDIT') {
      return acc + Number(tx.amount || 0);
    } else if (tx.type === 'PAYMENT' || tx.transaction_type === 'PAYMENT') {
      return acc - Number(tx.amount || 0);
    }
    return acc;
  }, 0);
  return Math.max(0, Math.round(balance * 100) / 100);
}

/**
 * Reorder Point:
 * Reorder Point = (Average Daily Sales × Supplier Lead Time in days) + Safety Stock
 */
export function calculateReorderPoint(avgDailySales, leadTimeDays = 3, safetyStockRatio = 0.5) {
  const leadTimeDemand = Number(avgDailySales || 0) * Number(leadTimeDays);
  const safetyStock = leadTimeDemand * safetyStockRatio;
  return Math.ceil(leadTimeDemand + safetyStock);
}

/**
 * Inventory Valuation:
 * Total Inventory Value = Sum of (Available Quantity × Unit Cost)
 */
export function calculateInventoryValuation(products) {
  if (!Array.isArray(products)) return 0;
  const total = products.reduce((sum, item) => {
    const qty = Math.max(0, Number(item.stock_quantity || 0));
    const cost = Number(item.purchase_price || 0);
    return sum + (qty * cost);
  }, 0);
  return Math.round(total * 100) / 100;
}

/**
 * Retail Selling Value of Inventory:
 * Total Retail Value = Sum of (Available Quantity × Selling Price)
 */
export function calculateInventoryRetailValue(products) {
  if (!Array.isArray(products)) return 0;
  const total = products.reduce((sum, item) => {
    const qty = Math.max(0, Number(item.stock_quantity || 0));
    const price = Number(item.selling_price || 0);
    return sum + (qty * price);
  }, 0);
  return Math.round(total * 100) / 100;
}

/**
 * Simple Moving Average for Demand Forecasting
 */
export function calculateMovingAverage(dataSeries, period = 7) {
  if (!Array.isArray(dataSeries) || dataSeries.length === 0) return [];
  const result = [];
  for (let i = 0; i < dataSeries.length; i++) {
    const start = Math.max(0, i - period + 1);
    const window = dataSeries.slice(start, i + 1);
    const avg = window.reduce((a, b) => a + b, 0) / window.length;
    result.push(Math.round(avg * 100) / 100);
  }
  return result;
}

/**
 * Indian Rupee (INR) Formatter
 * Formats numbers into Indian lakh/crore format (e.g. ₹1,25,000.00)
 */
export function formatINR(amount, includeSymbol = true) {
  const num = Number(amount || 0);
  const formatted = num.toLocaleString('en-IN', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 0
  });
  return includeSymbol ? `₹${formatted}` : formatted;
}

