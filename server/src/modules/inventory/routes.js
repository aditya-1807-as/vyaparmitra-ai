import express from 'express';
import { dbStore } from '../../database/store.js';
import { requireAuth } from '../../middleware/auth.js';

const router = express.Router();

// Products (strictly isolated to req.shopId)
router.get('/products', requireAuth, (req, res) => {
  res.json(dbStore.getProducts(req.shopId));
});

router.post('/products', requireAuth, (req, res) => {
  const newProd = dbStore.createProduct(req.shopId, req.user.id, req.body);
  res.status(201).json(newProd);
});

router.put('/products/:id', requireAuth, (req, res) => {
  const updated = dbStore.updateProduct(req.shopId, req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ error: 'Product not found or access denied.' });
  }
  res.json(updated);
});

router.delete('/products/:id', requireAuth, (req, res) => {
  const success = dbStore.deleteProduct(req.shopId, req.params.id);
  if (!success) {
    return res.status(404).json({ error: 'Product not found or access denied.' });
  }
  res.json({ success: true });
});

// Categories
router.get('/categories', requireAuth, (req, res) => {
  res.json(dbStore.getCategories(req.shopId));
});

router.post('/categories', requireAuth, (req, res) => {
  const newCat = dbStore.createCategory(req.shopId, req.body);
  res.status(201).json(newCat);
});

// Stock Movements
router.get('/movements', requireAuth, (req, res) => {
  res.json(dbStore.getStockMovements(req.shopId));
});

export default router;
