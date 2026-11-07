import express from 'express';
import { dbStore } from '../../database/store.js';
import { requireAuth, requireSuperAdmin } from '../../middleware/auth.js';

const router = express.Router();

// Employees (isolated to req.shopId)
router.get('/employees', requireAuth, (req, res) => {
  res.json(dbStore.getEmployees(req.shopId));
});

router.post('/employees', requireAuth, (req, res) => {
  const newEmp = dbStore.createEmployee(req.shopId, req.body);
  res.status(201).json(newEmp);
});

router.put('/employees/:id', requireAuth, (req, res) => {
  const updated = dbStore.updateEmployee(req.shopId, req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ error: 'Employee not found or access denied.' });
  }
  res.json(updated);
});

router.delete('/employees/:id', requireAuth, (req, res) => {
  const emp = dbStore.getEmployees(req.shopId).find(e => e.id === req.params.id);
  if (emp && emp.role === 'Owner') {
    return res.status(400).json({ error: 'The Store Owner account cannot be deleted.' });
  }

  const success = dbStore.deleteEmployee(req.shopId, req.params.id);
  if (!success) {
    return res.status(404).json({ error: 'Employee not found or access denied.' });
  }
  res.json({ success: true });
});

// Shop Settings (isolated to req.shopId)
router.get('/shop', requireAuth, (req, res) => {
  const shop = dbStore.getShop(req.shopId);
  if (!shop) {
    return res.status(404).json({ error: 'Shop not found' });
  }
  res.json(shop);
});

router.put('/shop', requireAuth, (req, res) => {
  const updated = dbStore.updateShop(req.shopId, req.body);
  if (!updated) {
    return res.status(404).json({ error: 'Shop not found' });
  }
  res.json(updated);
});

// Super Admin Platform View (strictly requires superadmin privileges)
router.get('/platform', requireAuth, requireSuperAdmin, (req, res) => {
  const totalMrr = dbStore.platformShops.reduce((sum, s) => sum + s.mrr, 0);
  res.json({
    totalShops: dbStore.platformShops.length,
    activeSubscriptions: dbStore.platformShops.filter(s => s.status === 'Active').length,
    totalMrr,
    shops: dbStore.platformShops,
    plans: [
      { id: 'starter', name: 'Starter Plan', price: 499, shops: 1, employees: 2, products: 200 },
      { id: 'growth', name: 'Growth Plan', price: 999, shops: 1, employees: 5, products: 1000 },
      { id: 'pro', name: 'Pro Enterprise', price: 1999, shops: 3, employees: 15, products: 5000 }
    ]
  });
});

export default router;
