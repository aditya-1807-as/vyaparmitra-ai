/**
 * VyaparMitra AI - Core Business Logic & Financial Calculations (Client)
 */

export function calculateGrossProfit(netSales, cogs) {
  const profit = Number(netSales || 0) - Number(cogs || 0);
  const margin = netSales > 0 ? (profit / netSales) * 100 : 0;
  return {
    grossProfit: Math.round(profit * 100) / 100,
    grossMarginPercent: Math.round(margin * 10) / 10
  };
}

export function calculateNetProfit(grossProfit, operatingExpenses) {
  const net = Number(grossProfit || 0) - Number(operatingExpenses || 0);
  return Math.round(net * 100) / 100;
}

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

export function calculateReorderPoint(avgDailySales, leadTimeDays = 3, safetyStockRatio = 0.5) {
  const leadTimeDemand = Number(avgDailySales || 0) * Number(leadTimeDays);
  const safetyStock = leadTimeDemand * safetyStockRatio;
  return Math.ceil(leadTimeDemand + safetyStock);
}

export function calculateInventoryValuation(products) {
  if (!Array.isArray(products)) return 0;
  const total = products.reduce((sum, item) => {
    const qty = Math.max(0, Number(item.stock_quantity || 0));
    const cost = Number(item.purchase_price || 0);
    return sum + (qty * cost);
  }, 0);
  return Math.round(total * 100) / 100;
}

export function calculateInventoryRetailValue(products) {
  if (!Array.isArray(products)) return 0;
  const total = products.reduce((sum, item) => {
    const qty = Math.max(0, Number(item.stock_quantity || 0));
    const price = Number(item.selling_price || 0);
    return sum + (qty * price);
  }, 0);
  return Math.round(total * 100) / 100;
}

export function formatINR(amount, includeSymbol = true) {
  const num = Number(amount || 0);
  const formatted = num.toLocaleString('en-IN', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 0
  });
  return includeSymbol ? `₹${formatted}` : formatted;
}

