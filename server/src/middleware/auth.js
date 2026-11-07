import jwt from 'jsonwebtoken';
import { dbStore } from '../database/store.js';

const JWT_SECRET = process.env.JWT_SECRET || 'vyaparmitra_production_secret_key_2026_jwt';

/**
 * Authentication & Tenant Isolation Middleware
 * Verifies JWT token, extracts user identity, and strictly binds req.user and req.shopId.
 * Enforces user activation and shop suspension checks.
 */
export const requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required. No token provided.' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = dbStore.getUserById(decoded.userId);

    if (!user) {
      return res.status(401).json({ error: 'User account not found or has been revoked.' });
    }

    // Check if user account is deactivated
    if (user.status === 'deactivated' || user.status === 'inactive') {
      return res.status(403).json({ error: 'Your user account has been deactivated. Please contact your store administrator.' });
    }

    // Check if user's shop is suspended (Super Admins are exempt)
    if (!user.is_superadmin && user.shop_id) {
      const shop = dbStore.getShop(user.shop_id);
      if (shop && shop.status === 'suspended') {
        return res.status(403).json({
          error: `Your shop workspace (${shop.name}) has been suspended by the platform administrator. Reason: ${shop.suspension_reason || 'Compliance review'}. Please contact support@vyaparmitra.ai`,
          is_suspended: true,
          suspension_reason: shop.suspension_reason
        });
      }
    }

    // Attach verified user and strictly isolated shopId
    req.user = user;
    req.shopId = user.shop_id;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired authentication token.' });
  }
};

/**
 * Super Admin authorization guard
 * Strictly restricts control-plane operations to platform owners
 */
export const requireSuperAdmin = (req, res, next) => {
  if (!req.user || (!req.user.is_superadmin && req.user.role !== 'super_admin')) {
    return res.status(403).json({ error: 'Access denied. Platform Super Admin privileges required.' });
  }
  next();
};
