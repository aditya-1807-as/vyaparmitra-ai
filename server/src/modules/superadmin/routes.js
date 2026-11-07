import express from 'express';
import { dbStore } from '../../database/store.js';
import { requireAuth, requireSuperAdmin } from '../../middleware/auth.js';

const router = express.Router();

// Enforce both Authentication AND Super Admin authorization across all routes
router.use(requireAuth, requireSuperAdmin);

// 1. Super Admin Dashboard Aggregates
router.get('/dashboard', (req, res) => {
  try {
    const data = dbStore.getSuperAdminDashboard();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 2. Shops Management
router.get('/shops', (req, res) => {
  try {
    const { search, status, plan } = req.query;
    const shops = dbStore.getAllShopsDetailed({ search, status, plan });
    res.json({ shops, total: shops.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/shops/:id', (req, res) => {
  try {
    const details = dbStore.getShopDetails(req.params.id);
    if (!details) {
      return res.status(404).json({ error: 'Shop not found' });
    }
    res.json(details);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.patch('/shops/:id/status', (req, res) => {
  try {
    const { status, reason } = req.body;
    if (!status || !['active', 'inactive', 'suspended'].includes(status)) {
      return res.status(400).json({ error: 'Valid status is required (active, inactive, suspended)' });
    }

    const updated = dbStore.setShopStatus(req.params.id, status, reason, {
      id: req.user.id,
      email: req.user.email
    });

    if (!updated) {
      return res.status(404).json({ error: 'Shop not found' });
    }

    res.json({
      message: `Shop "${updated.name}" status updated to ${status}.`,
      shop: updated
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 3. User Management
router.get('/users', (req, res) => {
  try {
    const { search, role, status } = req.query;
    const users = dbStore.getAllUsersDetailed({ search, role, status });
    res.json({ users, total: users.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.patch('/users/:id/status', (req, res) => {
  try {
    const { status } = req.body;
    if (!status || !['active', 'inactive'].includes(status)) {
      return res.status(400).json({ error: 'Valid status is required (active, inactive)' });
    }

    const updated = dbStore.setUserStatus(req.params.id, status, {
      id: req.user.id,
      email: req.user.email
    });

    if (!updated) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      message: `User "${updated.name}" status updated to ${status}.`,
      user: updated
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 4. Subscription Management
router.get('/subscriptions', (req, res) => {
  try {
    const data = dbStore.getSubscriptionsOverview();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 5. Platform Analytics
router.get('/analytics', (req, res) => {
  try {
    const data = dbStore.getPlatformAnalytics();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 6. Activity & Audit Logs
router.get('/activity', (req, res) => {
  try {
    const limit = Number(req.query.limit || 100);
    const filter = req.query.filter || 'ALL';
    const logs = dbStore.getActivityLogs(limit, filter);
    res.json(logs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 7. Platform Settings
router.get('/settings', (req, res) => {
  try {
    res.json(dbStore.getPlatformSettings());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/settings', (req, res) => {
  try {
    const updated = dbStore.updatePlatformSettings(req.body, {
      id: req.user.id,
      email: req.user.email
    });
    res.json({
      message: 'Platform configuration updated successfully.',
      settings: updated
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
