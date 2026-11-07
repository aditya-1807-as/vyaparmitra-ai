import express from 'express';
import { dbStore } from '../../database/store.js';
import { requireAuth } from '../../middleware/auth.js';

const router = express.Router();

router.get('/', requireAuth, (req, res) => {
  res.json(dbStore.getSuppliers(req.shopId));
});

router.post('/', requireAuth, (req, res) => {
  const newSup = dbStore.createSupplier(req.shopId, req.user.id, req.body);
  res.status(201).json(newSup);
});

router.put('/:id', requireAuth, (req, res) => {
  const updated = dbStore.updateSupplier(req.shopId, req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ error: 'Supplier not found or access denied.' });
  }
  res.json(updated);
});

router.delete('/:id', requireAuth, (req, res) => {
  const success = dbStore.deleteSupplier(req.shopId, req.params.id);
  if (!success) {
    return res.status(404).json({ error: 'Supplier not found or access denied.' });
  }
  res.json({ success: true });
});

export default router;
