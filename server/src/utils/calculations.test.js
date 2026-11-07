/**
 * VyaparMitra AI - Financial Calculations Test Suite
 */
import { 
  calculateGrossProfit, 
  calculateNetProfit, 
  calculateCustomerOutstanding, 
  calculateReorderPoint, 
  calculateInventoryValuation,
  formatINR 
} from './calculations.js';

function runTests() {
  console.log('--- Running VyaparMitra AI Mathematical Test Suite ---');
  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`✓ PASS: ${message}`);
      passed++;
    } else {
      console.error(`✗ FAIL: ${message}`);
      failed++;
    }
  }

  // 1. Gross Profit & Margin Test
  const gpResult = calculateGrossProfit(10000, 7000);
  assert(gpResult.grossProfit === 3000, 'Gross profit should equal Net Sales - COGS (10000 - 7000 = 3000)');
  assert(gpResult.grossMarginPercent === 30, 'Gross margin should equal 30%');

  // 2. Net Profit Test
  const np = calculateNetProfit(3000, 1200);
  assert(np === 1800, 'Net profit should equal Gross Profit - Operating Expenses (3000 - 1200 = 1800)');

  // 3. Customer Outstanding Ledger Test
  const transactions = [
    { type: 'CREDIT', amount: 5000 },
    { type: 'CREDIT', amount: 2500 },
    { type: 'PAYMENT', amount: 3000 }
  ];
  const outstanding = calculateCustomerOutstanding(transactions);
  assert(outstanding === 4500, 'Customer outstanding should equal 5000 + 2500 - 3000 = 4500');

  // 4. Reorder Point Formula Test
  // Reorder Point = (Avg Daily Sales × Lead Time) + Safety Stock
  // (5 × 3) + 7.5 = 22.5 => 23
  const rop = calculateReorderPoint(5, 3, 0.5);
  assert(rop === 23, 'Reorder point with 5 daily sales, 3 lead days, 50% safety stock should be 23');

  // 5. Inventory Valuation Test
  const products = [
    { stock_quantity: 10, purchase_price: 150 },
    { stock_quantity: 20, purchase_price: 200 },
    { stock_quantity: -2, purchase_price: 50 } // negative stock clamped to 0
  ];
  const val = calculateInventoryValuation(products);
  assert(val === 5500, 'Inventory valuation should sum non-negative stock × unit cost: (10×150) + (20×200) = 5500');

  // 6. INR Formatter Test
  const inr = formatINR(125000);
  assert(inr === '₹1,25,000', `INR formatting should correctly format 125000 to ₹1,25,000 (got ${inr})`);

  console.log(`\nTest Results: ${passed} passed, ${failed} failed.`);
  if (failed > 0) process.exit(1);
}

runTests();
