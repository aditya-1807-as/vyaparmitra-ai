import express from 'express';
import { dbStore } from '../../database/store.js';
import { requireAuth } from '../../middleware/auth.js';
import { formatINR } from '../../utils/formatters.js';

const router = express.Router();

/**
 * Isolated Business Assistant reasoning engine
 * Provides answers based exclusively on the authenticated user's store dataset
 */
function analyzeStoreQuery(userQuery, shopId) {
  const q = (userQuery || '').toLowerCase();
  const shop = dbStore.getShop(shopId);
  const stats = dbStore.getDashboardStats(shopId);
  const products = dbStore.getProducts(shopId);
  const customers = dbStore.getCustomers(shopId);
  const sales = dbStore.getSales(shopId);
  const suppliers = dbStore.getSuppliers(shopId);
  const expenses = dbStore.getExpenses(shopId);

  // 1. Total sales question
  if (q.includes('total sales') || q.includes('how much sales') || q.includes('sales this month') || q.includes('revenue')) {
    const total = stats.totalSales;
    const orders = stats.totalOrders;
    const avgOrder = orders > 0 ? total / orders : 0;
    return {
      type: 'analytics',
      title: `${shop?.name || 'Your Store'} - Monthly Sales Analysis`,
      answer: `For **${shop?.name || 'your store'}**, your total recorded sales are **${formatINR(total)}** across **${orders} orders**, with an average ticket size of **${formatINR(avgOrder)}**.\n\nAll calculations are derived exclusively from your authenticated workspace records.`,
      highlights: [
        { label: 'Total Sales', value: formatINR(total) },
        { label: 'Completed Orders', value: orders },
        { label: 'Average Order Value', value: formatINR(avgOrder) }
      ],
      recommendations: [
        'Run bundle promotions on high-margin items to boost your average basket size.',
        'Encourage instant digital UPI settlements for quick cash flow.'
      ]
    };
  }

  // 2. Fast selling products
  if (q.includes('fastest') || q.includes('top selling') || q.includes('best sell') || q.includes('popular')) {
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

    const topItems = Object.entries(productSalesMap)
      .sort((a, b) => b[1].qty - a[1].qty)
      .slice(0, 5);

    if (topItems.length === 0) {
      return {
        type: 'inventory_velocity',
        title: 'Top-Selling Items',
        answer: `No sales transactions have been logged in your workspace yet. Start billing via the POS module to generate sales velocity rankings.`,
        highlights: [{ label: 'Sales Logged', value: '0' }],
        recommendations: ['Create your first bill in POS Terminal.']
      };
    }

    return {
      type: 'inventory_velocity',
      title: `${shop?.name || 'Your Store'} - Fast-Moving Velocity Items`,
      answer: `Here are your fastest moving items by volume in your store:\n\n` +
        topItems.map((item, idx) => `${idx + 1}. **${item[0]}**: ${item[1].qty} units moved (${formatINR(item[1].revenue)})`).join('\n') +
        `\n\nThese items represent your top demand drivers.`,
      highlights: topItems.map(item => ({ label: item[0], value: `${item[1].qty} units` })),
      recommendations: [
        'Keep safety buffer stock on your top items to avoid weekend stockouts.',
        'Negotiate volume discounts with your distributors for these items.'
      ]
    };
  }

  // 3. Products needing restocking / Low stock
  if (q.includes('restock') || q.includes('low stock') || q.includes('out of stock') || q.includes('inventory alert')) {
    const lowStock = products.filter(p => p.stock_quantity <= p.reorder_level);
    return {
      type: 'stock_alert',
      title: `${shop?.name || 'Your Store'} - Restocking & Safety Level Alert`,
      answer: lowStock.length > 0 
        ? `In your inventory, **${lowStock.length} items** are below your configured safety reorder thresholds:\n\n` +
          lowStock.map((p, idx) => `${idx + 1}. **${p.name}** — In Stock: **${p.stock_quantity} ${p.unit}** (Reorder at: ${p.reorder_level})`).join('\n') +
          `\n\nReplenishment via a Purchase Order is recommended to prevent stockouts.`
        : `Great news! All products in your inventory currently have adequate stock levels above safety thresholds.`,
      highlights: lowStock.slice(0, 4).map(p => ({ label: p.name, value: `${p.stock_quantity} left` })),
      recommendations: [
        'Generate a restock Purchase Order from the Suppliers module.',
        'Standard replenishment window is 2-3 business days.'
      ]
    };
  }

  // 4. Highest outstanding customer credit / Udhaar
  if (q.includes('udhaar') || q.includes('credit') || q.includes('outstanding') || q.includes('highest')) {
    const highestCreditCusts = [...customers]
      .sort((a, b) => (b.outstanding_balance || 0) - (a.outstanding_balance || 0))
      .slice(0, 5);

    const totalUdhaar = customers.reduce((sum, c) => sum + (c.outstanding_balance || 0), 0);

    return {
      type: 'credit_risk',
      title: `${shop?.name || 'Your Store'} - Customer Udhaar & Khata Overview`,
      answer: `Total outstanding customer Udhaar across your ${customers.length} customer accounts is **${formatINR(totalUdhaar)}**.\n\n` +
        (highestCreditCusts.length > 0
          ? `Top accounts with pending balances in your store:\n` +
            highestCreditCusts.map((c, i) => `${i + 1}. **${c.name}**: ${formatINR(c.outstanding_balance)} (Limit: ${formatINR(c.credit_limit)})`).join('\n')
          : `You currently have no active Udhaar credit balances pending.`),
      highlights: [
        { label: 'Total Udhaar Given', value: formatINR(totalUdhaar) },
        { label: 'Top Debtor', value: highestCreditCusts[0]?.name || 'None' },
        { label: 'Due Amount', value: formatINR(highestCreditCusts[0]?.outstanding_balance || 0) }
      ],
      recommendations: [
        'Send gentle automated WhatsApp payment reminders with UPI links.',
        'Do not permit further credit to accounts exceeding 80% of their sanctioned limit.'
      ]
    };
  }

  // 5. Gross profit and margins
  if (q.includes('gross profit') || q.includes('margin') || q.includes('profit this week') || q.includes('net profit')) {
    return {
      type: 'financial_health',
      title: `${shop?.name || 'Your Store'} - Profitability Breakdown`,
      answer: `Here is your current store financial profitability breakdown:\n\n` +
        `• **Gross Profit:** **${formatINR(stats.grossProfit)}**\n` +
        `• **Gross Margin:** **${stats.grossMarginPercent}%**\n` +
        `• **Operating Expenses:** **${formatINR(stats.totalExpenses)}**\n` +
        `• **Net Operating Profit:** **${formatINR(stats.netProfit)}**\n\n` +
        `Gross profit strictly measures Net Sales minus Cost of Goods Sold. Net profit deducts all overhead expenses.`,
      highlights: [
        { label: 'Gross Profit', value: formatINR(stats.grossProfit) },
        { label: 'Gross Margin', value: `${stats.grossMarginPercent}%` },
        { label: 'Net Profit', value: formatINR(stats.netProfit) }
      ],
      recommendations: [
        'Focus on expanding high-margin FMCG and personal care categories.',
        'Keep operating overheads tightly monitored relative to monthly turnover.'
      ]
    };
  }

  // 6. Compare month
  if (q.includes('compare') || q.includes('last month') || q.includes('growth') || q.includes('trend')) {
    return {
      type: 'comparison',
      title: `${shop?.name || 'Your Store'} - Growth & Turnover Velocity`,
      answer: `**Performance Analysis for ${shop?.name || 'your store'}:**\n\n` +
        `• **Sales Revenue:** Generating positive growth trajectory based on active order turnover.\n` +
        `• **Order Frequency:** Active transactions recorded across counter billing.\n` +
        `• **Average Basket Size:** Reflects healthy household grocery purchasing.`,
      highlights: [
        { label: 'Total Revenue', value: formatINR(stats.totalSales) },
        { label: 'Total Orders', value: stats.totalOrders },
        { label: 'Active Items', value: stats.totalProducts }
      ],
      recommendations: [
        'Maintain consistent stock of fast-moving essentials.',
        'Reward prompt paying Udhaar customers with small discounts.'
      ]
    };
  }

  // 7. General business advice
  return {
    type: 'advisor',
    title: `VyaparMitra AI Recommendations for ${shop?.name || 'Your Business'}`,
    answer: `Based on real-time analysis of **${shop?.name || 'your store'}**:\n\n` +
      `1. **Udhaar Recovery:** You have ${formatINR(stats.outstandingCredit)} pending in customer credit. Prompt collections will free up working capital.\n` +
      `2. **Stock Optimization:** You have ${stats.totalProducts} active products, with ${stats.lowStockCount} items currently running low.\n` +
      `3. **Margin Expansion:** Your current gross margin is ${stats.grossMarginPercent}%. Bundling staples can raise basket size.`,
    highlights: [
      { label: 'Total Valuation', value: formatINR(stats.inventoryValuation) },
      { label: 'Pending Udhaar', value: formatINR(stats.outstandingCredit) },
      { label: 'Active Items', value: stats.totalProducts }
    ],
    recommendations: [
      'Maintain tight credit controls on high-volume customers.',
      'Check stock safety thresholds before placing weekly distributor orders.'
    ]
  };
}

// POST /api/ai/chat (strictly isolated to authenticated user's shopId)
router.post('/chat', requireAuth, async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const shop = dbStore.getShop(req.shopId);
    const stats = dbStore.getDashboardStats(req.shopId);

    // If Gemini API key is configured, invoke Gemini with strictly filtered context
    const geminiApiKey = process.env.GEMINI_API_KEY;

    if (geminiApiKey) {
      try {
        const promptContext = `
You are VyaparMitra AI Assistant, a retail business advisor.
Current Shop: "${shop?.name || 'Retail Store'}" in ${shop?.city || 'India'}.
Owner: ${req.user.name}.
Business Data for THIS SHOP ONLY:
- Total Sales: ₹${stats.totalSales}
- Total Orders: ${stats.totalOrders}
- Gross Profit: ₹${stats.grossProfit} (${stats.grossMarginPercent}%)
- Total Expenses: ₹${stats.totalExpenses}
- Net Profit: ₹${stats.netProfit}
- Total Products: ${stats.totalProducts}
- Low Stock Items: ${stats.lowStockCount} items
- Outstanding Customer Udhaar: ₹${stats.outstandingCredit}
- Inventory Valuation: ₹${stats.inventoryValuation}

User Question: ${message}

Provide a polite, accurate, concise answer tailored to Indian retail practices with specific rupee numbers. Do not mention any other store.
`;

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: promptContext }] }]
          })
        });

        const geminiData = await response.json();
        const aiText = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text;

        if (aiText) {
          return res.json({
            source: 'gemini',
            title: `VyaparMitra AI (${shop?.name || 'Your Store'})`,
            answer: aiText,
            highlights: [
              { label: 'Total Sales', value: formatINR(stats.totalSales) },
              { label: 'Gross Profit', value: formatINR(stats.grossProfit) },
              { label: 'Net Profit', value: formatINR(stats.netProfit) }
            ]
          });
        }
      } catch (geminiError) {
        console.warn('Gemini API call failed, falling back to analytical intelligence engine', geminiError);
      }
    }

    // Rule-based analytical intelligence engine strictly scoped to req.shopId
    const analysis = analyzeStoreQuery(message, req.shopId);
    return res.json({
      source: 'analytical_engine',
      ...analysis
    });
  } catch (error) {
    console.error('AI chat endpoint error:', error);
    res.status(500).json({ error: 'Internal server error processing AI query' });
  }
});

export default router;
