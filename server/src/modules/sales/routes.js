import express from 'express';
import { dbStore } from '../../database/store.js';
import { requireAuth } from '../../middleware/auth.js';

const router = express.Router();

router.get('/', requireAuth, (req, res) => {
  res.json(dbStore.getSales(req.shopId));
});

router.post('/', requireAuth, (req, res) => {
  try {
    const newSale = dbStore.createSale(req.shopId, req.user.id, req.body);
    res.status(201).json(newSale);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
