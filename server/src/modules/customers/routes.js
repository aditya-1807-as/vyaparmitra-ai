import express from 'express';
import { dbStore } from '../../database/store.js';
import { requireAuth } from '../../middleware/auth.js';

const router = express.Router();

router.get('/', requireAuth, (req, res) => {
  res.json(dbStore.getCustomers(req.shopId));
});

router.post('/', requireAuth, (req, res) => {
  const newCust = dbStore.createCustomer(req.shopId, req.user.id, req.body);
  res.status(201).json(newCust);
});

router.put('/:id', requireAuth, (req, res) => {
  const updated = dbStore.updateCustomer(req.shopId, req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ error: 'Customer not found or access denied.' });
  }
  res.json(updated);
});

router.delete('/:id', requireAuth, (req, res) => {
  const cust = dbStore.getCustomer(req.shopId, req.params.id);
  if (!cust) {
    return res.status(404).json({ error: 'Customer not found or access denied.' });
  }
  if (cust.outstanding_balance > 0) {
    return res.status(400).json({ error: `Cannot delete customer while there is an active outstanding balance of ₹${cust.outstanding_balance}.` });
  }

  const success = dbStore.deleteCustomer(req.shopId, req.params.id);
  res.json({ success });
});

// Udhaar Ledger
router.get('/ledger', requireAuth, (req, res) => {
  res.json(dbStore.getUdhaarTransactions(req.shopId));
});

router.post('/record-payment', requireAuth, (req, res) => {
  const { customer_id, amount, payment_mode, notes } = req.body;
  const result = dbStore.recordUdhaarPayment(req.shopId, customer_id, amount, payment_mode, notes);
  if (!result) {
    return res.status(400).json({ error: 'Invalid payment or customer not found in your store.' });
  }
  res.status(201).json({ success: true, ...result });
});

export default router;
