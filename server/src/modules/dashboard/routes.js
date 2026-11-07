import express from 'express';
import { dbStore } from '../../database/store.js';
import { requireAuth } from '../../middleware/auth.js';

const router = express.Router();

router.get('/stats', requireAuth, (req, res) => {
  try {
    const shop = dbStore.getShop(req.shopId);
    const stats = dbStore.getDashboardStats(req.shopId);
    res.json({
      shop,
      stats
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
