import { dbStore } from '../database/store.js';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'vyaparmitra_production_secret_key_2026_jwt';

let pass = 0;
let fail = 0;

function assert(cond, msg) {
  if (cond) {
    console.log(`✓ PASS: ${msg}`);
    pass++;
  } else {
    console.error(`✗ FAIL: ${msg}`);
    fail++;
  }
}

console.log('===============================================================');
console.log('RUNNING E2E PLATFORM & SUPER ADMIN INTEGRATION SUITE');
console.log('===============================================================');

// Reset store
dbStore.reset();

// 1. Super Admin Credentials Check
const superAdmin = dbStore.getUserByEmail('admin@vyaparmitra.ai');
assert(superAdmin !== null, 'Super Admin account exists');
assert(superAdmin.role === 'super_admin', 'Super Admin has role super_admin');
assert(superAdmin.is_superadmin === true, 'Super Admin has is_superadmin true');

// 2. Shop Owner User A
const userA = dbStore.getUserByEmail('ramesh@lakshmikirana.in');
assert(userA !== null, 'User A (Ramesh) exists');
assert(userA.is_superadmin === false, 'User A is NOT superadmin');

// 3. Super Admin Dashboard Metrics
const dash = dbStore.getSuperAdminDashboard();
assert(dash.stats.totalShops >= 5, `Total shops in platform >= 5 (got ${dash.stats.totalShops})`);
assert(dash.stats.totalPlatformSales > 0, `Total GMV > 0 (got ₹${dash.stats.totalPlatformSales})`);
assert(dash.stats.platformMRR > 0, `Platform MRR > 0 (got ₹${dash.stats.platformMRR})`);
assert(dash.recentShops.length > 0, 'Recent shops list populated');

// 4. Shop Management & Detailed Inspection
const allShops = dbStore.getAllShopsDetailed();
assert(allShops.length >= 5, `Found ${allShops.length} shops in detailed list`);
const lakshmi = allShops.find(s => s.id === 'shop-001');
assert(lakshmi.product_count === 28, `Lakshmi Kirana has 28 products (got ${lakshmi.product_count})`);
assert(lakshmi.total_sales === 39845, `Lakshmi Kirana sales volume ₹39845 (got ${lakshmi.total_sales})`);

// 5. Shop Suspension & Restoration
const shopToSuspend = 'shop-002'; // Anita Retail
dbStore.setShopStatus(shopToSuspend, 'suspended', 'Tax audit verification hold', { id: superAdmin.id, email: superAdmin.email });
const suspendedShop = dbStore.getShop(shopToSuspend);
assert(suspendedShop.status === 'suspended', 'Shop-002 status is suspended');
assert(suspendedShop.suspension_reason === 'Tax audit verification hold', 'Suspension reason properly saved');

// Verify activity logged
const logs = dbStore.getActivityLogs({ shopId: shopToSuspend });
const suspLog = logs.find(l => l.event_type === 'SHOP_SUSPENDED');
assert(suspLog !== undefined, 'SHOP_SUSPENDED activity logged');
assert(suspLog.actor_email === 'admin@vyaparmitra.ai', 'Activity actor is admin@vyaparmitra.ai');

// Restore shop
dbStore.setShopStatus(shopToSuspend, 'active', '', { id: superAdmin.id, email: superAdmin.email });
assert(dbStore.getShop(shopToSuspend).status === 'active', 'Shop-002 restored to active');
assert(dbStore.getShop(shopToSuspend).suspension_reason === null, 'Suspension reason cleared');

// 6. Platform User Management
const allUsers = dbStore.getAllUsersDetailed();
assert(allUsers.length >= 6, `Found ${allUsers.length} platform users`);
const userToDeact = allUsers.find(u => u.email === 'anita@anitaretail.in');
dbStore.setUserStatus(userToDeact.id, 'deactivated', { id: superAdmin.id, email: superAdmin.email });
assert(dbStore.users.find(u => u.id === userToDeact.id).status === 'deactivated', 'User status set to deactivated');
dbStore.setUserStatus(userToDeact.id, 'active', { id: superAdmin.id, email: superAdmin.email });
assert(dbStore.users.find(u => u.id === userToDeact.id).status === 'active', 'User status restored to active');

// 7. Subscriptions Overview
const subOverview = dbStore.getSubscriptionsOverview();
assert(subOverview.plans.length === 4, `4 subscription tiers tracked (got ${subOverview.plans.length})`);
assert(subOverview.totalMRR > 0, `Total MRR calculated (₹${subOverview.totalMRR})`);

// 8. Platform Analytics Aggregation
const analytics = dbStore.getPlatformAnalytics();
assert(analytics.totalGMV > 0, `Analytics total GMV: ₹${analytics.totalGMV}`);
assert(analytics.totalInvoices > 0, `Analytics total invoices: ${analytics.totalInvoices}`);
assert(analytics.categoryBreakdown.length > 0, 'Analytics has category breakdown');

// 9. Platform Global Settings
const initialSettings = dbStore.getPlatformSettings();
assert(initialSettings.platform_name === 'VyaparMitra AI', 'Default platform name is VyaparMitra AI');
const updatedSettings = dbStore.updatePlatformSettings({ support_email: 'ops@vyaparmitra.ai' }, { id: superAdmin.id, email: superAdmin.email });
assert(updatedSettings.support_email === 'ops@vyaparmitra.ai', 'Platform settings successfully updated');
assert(dbStore.getPlatformSettings().support_email === 'ops@vyaparmitra.ai', 'Updated settings persist');

// 10. Security: Public Registration Privilege Escalation Check
const regAttempt = dbStore.registerUser({
  email: 'newshop@retail.in',
  password: 'password123',
  name: 'New Merchant',
  shop_name: 'New Kirana Store',
  role: 'super_admin'
});
assert(regAttempt.user.is_superadmin === false, 'New registration CANNOT set is_superadmin: true');
assert(regAttempt.user.role === 'Owner', 'New registration role forced to "Owner"');
assert(regAttempt.shop.status === 'active', 'New shop provisioned as active');

console.log('---------------------------------------------------------------');
console.log(`E2E Test Results: ${pass} passed, ${fail} failed.`);
console.log('===============================================================');

if (fail > 0) process.exit(1);
