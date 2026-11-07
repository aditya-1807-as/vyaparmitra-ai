import express from 'express';
import { dbStore } from '../../database/store.js';
import { requireAuth } from '../../middleware/auth.js';
import { calculateGrossProfit, calculateNetProfit, calculateInventoryValuation } from '../../utils/calculations.js';

const router = express.Router();

router.get('/reports', requireAuth, (req, res) => {
  try {
    const shopSales = dbStore.getSales(req.shopId);
    const shopPurchases = dbStore.getPurchases(req.shopId);
    const shopExpenses = dbStore.getExpenses(req.shopId);
    const shopProducts = dbStore.getProducts(req.shopId);
    const shopCustomers = dbStore.getCustomers(req.shopId);
    const shopSuppliers = dbStore.getSuppliers(req.shopId);
    const shopCategories = dbStore.getCategories(req.shopId);

    const totalSales = shopSales.reduce((sum, s) => sum + Number(s.total_amount || 0), 0);
    const totalPurchases = shopPurchases.reduce((sum, p) => sum + Number(p.total_amount || 0), 0);
    const totalExpenses = shopExpenses.reduce((sum, e) => sum + Number(e.amount || 0), 0);

    const totalCOGS = shopSales.reduce((sum, s) => {
      const saleCost = (s.items || []).reduce((iSum, i) => iSum + (Number(i.quantity || 0) * Number(i.unit_cost || 0)), 0);
      return sum + saleCost;
    }, 0);

    const { grossProfit, grossMarginPercent } = calculateGrossProfit(totalSales, totalCOGS);
    const netProfit = calculateNetProfit(grossProfit, totalExpenses);

    const inventoryValuation = calculateInventoryValuation(shopProducts);

    // Sales by category
    const categorySales = {};
    shopSales.forEach(sale => {
      (sale.items || []).forEach(item => {
        const prod = shopProducts.find(p => p.id === item.product_id);
        const cat = shopCategories.find(c => c.id === prod?.category_id);
        const catName = cat ? cat.name : 'General Goods';
        categorySales[catName] = (categorySales[catName] || 0) + Number(item.total_price);
      });
    });

    // Payment method distribution
    const paymentMethods = {};
    shopSales.forEach(s => {
      paymentMethods[s.payment_method] = (paymentMethods[s.payment_method] || 0) + Number(s.total_amount);
    });

    res.json({
      summary: {
        totalSales,
        totalPurchases,
        totalExpenses,
        grossProfit,
        grossMarginPercent,
        netProfit,
        inventoryValuation,
        totalCustomers: shopCustomers.length,
        totalSuppliers: shopSuppliers.length
      },
      categorySales,
      paymentMethods,
      sales: shopSales,
      purchases: shopPurchases,
      expenses: shopExpenses,
      products: shopProducts,
      customers: shopCustomers,
      suppliers: shopSuppliers
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
