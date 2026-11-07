import express from 'express';
import { dbStore } from '../../database/store.js';
import { requireAuth } from '../../middleware/auth.js';

const router = express.Router();

router.get('/', requireAuth, (req, res) => {
  res.json(dbStore.getExpenses(req.shopId));
});

router.post('/', requireAuth, (req, res) => {
  const newExp = dbStore.createExpense(req.shopId, req.user.id, req.body);
  res.status(201).json(newExp);
});

router.delete('/:id', requireAuth, (req, res) => {
  const success = dbStore.deleteExpense(req.shopId, req.params.id);
  if (!success) {
    return res.status(404).json({ error: 'Expense record not found or access denied.' });
  }
  res.json({ success: true });
});

export default router;
