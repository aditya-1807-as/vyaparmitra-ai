import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { dbStore } from '../../database/store.js';
import { requireAuth } from '../../middleware/auth.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'vyaparmitra_production_secret_key_2026_jwt';

// POST /api/auth/register
router.post('/register', (req, res) => {
  try {
    const { email, password, name, phone, shop_name, city, state } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
    }

    // Call store method (enforces role: 'Owner', is_superadmin: false)
    const { user, shop } = dbStore.registerUser({ email, password, name, phone, shop_name, city, state });

    const token = jwt.sign(
      { userId: user.id, shopId: shop.id, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'Account and business workspace registered successfully.',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        shop_id: user.shop_id,
        is_superadmin: Boolean(user.is_superadmin)
      },
      shop
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// POST /api/auth/login
router.post('/login', (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email address is required.' });
    }

    const user = dbStore.getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid email address or user not registered.' });
    }

    // Check account status
    if (user.status === 'deactivated' || user.status === 'inactive') {
      return res.status(403).json({ error: 'Your user account has been deactivated. Please contact support.' });
    }

    // Verify password strictly
    if (!password) {
      return res.status(400).json({ error: 'Password is required.' });
    }

    if (!bcrypt.compareSync(password, user.password_hash)) {
      return res.status(401).json({ error: 'Invalid email address or password.' });
    }

    const shop = dbStore.getShop(user.shop_id);

    // Enforce suspension check for normal shop users
    if (!user.is_superadmin && shop && shop.status === 'suspended') {
      return res.status(403).json({
        error: `Your shop workspace (${shop.name}) has been suspended by the platform administrator. Reason: ${shop.suspension_reason || 'Compliance review'}. Please contact support@vyaparmitra.ai`,
        is_suspended: true,
        suspension_reason: shop.suspension_reason
      });
    }

    user.last_login_at = new Date().toISOString();

    // Log login activity
    dbStore.logActivity({
      eventType: 'USER_LOGIN',
      entityType: 'user',
      entityId: user.id,
      shop_id: user.shop_id,
      actor_id: user.id,
      actor_email: user.email,
      description: `User "${user.name}" (${user.email}) logged in successfully as ${user.role}.`
    });

    const token = jwt.sign(
      { userId: user.id, shopId: user.shop_id, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful.',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        shop_id: user.shop_id,
        is_superadmin: Boolean(user.is_superadmin)
      },
      shop
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/auth/forgot-password
router.post('/forgot-password', (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email address is required.' });
  }

  const user = dbStore.getUserByEmail(email);
  if (!user) {
    // For security, don't disclose if account exists
    return res.json({
      message: 'If an account exists with this email address, password reset instructions have been dispatched.'
    });
  }

  // Log password reset attempt
  dbStore.logActivity({
    eventType: 'PASSWORD_RESET_REQUESTED',
    entityType: 'user',
    entityId: user.id,
    shop_id: user.shop_id,
    actor_id: user.id,
    actor_email: user.email,
    description: `Password reset instructions requested for ${user.email}.`
  });

  res.json({
    message: 'If an account exists with this email address, password reset instructions have been dispatched.',
    demo_note: 'In this local prototype environment, you can use the default password "password123" or reset directly via the platform Super Admin.'
  });
});

// POST /api/auth/logout
router.post('/logout', requireAuth, (req, res) => {
  dbStore.logActivity({
    eventType: 'USER_LOGOUT',
    entityType: 'user',
    entityId: req.user.id,
    shop_id: req.user.shop_id,
    actor_id: req.user.id,
    actor_email: req.user.email,
    description: `User "${req.user.name}" (${req.user.email}) logged out cleanly.`
  });
  res.json({ message: 'Session terminated successfully.' });
});

// POST /api/auth/provision-superadmin
// Secure initial provisioning / recovery endpoint
router.post('/provision-superadmin', (req, res) => {
  const { email, password, masterKey } = req.body;
  const configuredMasterKey = process.env.SETUP_KEY || 'vyaparmitra_superadmin_init_2026';

  if (!masterKey || masterKey !== configuredMasterKey) {
    return res.status(403).json({ error: 'Invalid master setup authorization key.' });
  }

  const adminEmail = (email || 'admin@vyaparmitra.ai').toLowerCase();
  const adminPassword = password || 'SuperAdmin@2026';

  const admin = dbStore.resetSuperAdminCredentials(adminEmail, adminPassword);
  res.json({
    message: 'Super Admin credentials provisioned successfully.',
    email: admin.email,
    role: admin.role,
    is_superadmin: admin.is_superadmin
  });
});

// GET /api/auth/me
router.get('/me', requireAuth, (req, res) => {
  const shop = dbStore.getShop(req.user.shop_id);
  res.json({
    user: {
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
      phone: req.user.phone,
      role: req.user.role,
      shop_id: req.user.shop_id,
      is_superadmin: Boolean(req.user.is_superadmin)
    },
    shop
  });
});

// GET /api/auth/demo-users
// Helper for evaluating user data isolation & role switching in tests
router.get('/demo-users', (req, res) => {
  const demoList = [
    {
      id: "user-superadmin-001",
      name: "Platform Super Administrator",
      email: "admin@vyaparmitra.ai",
      role: "super_admin",
      is_superadmin: true,
      shop_name: "VyaparMitra Control Plane"
    },
    ...dbStore.users.filter(u => !u.is_superadmin).map(u => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      is_superadmin: Boolean(u.is_superadmin),
      shop_id: u.shop_id,
      shop_name: dbStore.getShop(u.shop_id)?.name
    }))
  ];
  res.json(demoList);
});

export default router;
