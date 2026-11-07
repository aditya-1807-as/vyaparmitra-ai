/**
 * Super Admin & Platform Access Control Automated Test Suite
 * Tests role-based authorization, suspension enforcement, and platform aggregates.
 */

import { dbStore } from '../database/store.js';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'vyaparmitra_production_secret_key_2026_jwt';

let passCount = 0;
let failCount = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`✓ PASS: ${message}`);
    passCount++;
  } else {
    console.error(`✗ FAIL: ${message}`);
    failCount++;
  }
}

console.log('===============================================================');
console.log('RUNNING SUPER ADMIN & ACCESS CONTROL TEST SUITE');
console.log('===============================================================');

// Reset store
dbStore.reset();

// 1. Verify Super Admin account exists
const superAdmin = dbStore.getUserByEmail('admin@vyaparmitra.ai');
assert(superAdmin !== null, 'Super Admin account (admin@vyaparmitra.ai) is provisioned');
assert(superAdmin?.role === 'super_admin', 'Super Admin has role "super_admin"');
assert(superAdmin?.is_superadmin === true, 'Super Admin has is_superadmin: true');

// 2. Verify Normal Shop Owners do NOT have Super Admin privileges
const userA = dbStore.getUserByEmail('ramesh@lakshmikirana.in');
const userB = dbStore.getUserByEmail('anita@anitaretail.in');
assert(userA?.is_superadmin === false, 'User A (Ramesh) does NOT have superadmin privileges');
assert(userB?.is_superadmin === false, 'User B (Anita) does NOT have superadmin privileges');

// 3. Test Dashboard Aggregates
const dash = dbStore.getSuperAdminDashboard();
assert(dash.stats.totalShops >= 5, `Super Admin dashboard aggregates total shops (${dash.stats.totalShops} >= 5)`);
assert(dash.stats.totalPlatformSales > 0, `Total platform sales aggregated across shops (${dash.stats.totalPlatformSales} > 0)`);
assert(dash.stats.platformMRR > 0, `Platform MRR calculated accurately (₹${dash.stats.platformMRR})`);

// 4. Test Shop Suspension Workflow
const anitaShop = dbStore.getShop('shop-002');
assert(anitaShop.status === 'active', 'Shop 002 (Anita) is initially active');

// Admin suspends Shop 002
dbStore.setShopStatus('shop-002', 'suspended', 'Audit compliance review');
assert(dbStore.getShop('shop-002').status === 'suspended', 'Shop 002 status is now "suspended"');
assert(dbStore.getShop('shop-002').suspension_reason === 'Audit compliance review', 'Suspension reason is recorded');

// Verify Shop 001 (Ramesh) remains unaffected
assert(dbStore.getShop('shop-001').status === 'active', 'Shop 001 (Ramesh) remains active and unaffected');

// 5. Test Audit Log
const logs = dbStore.getActivityLogs();
const suspensionLog = logs.find(l => l.event_type === 'SHOP_SUSPENDED' && l.shop_id === 'shop-002');
assert(suspensionLog !== undefined, 'Administrative suspension was logged in audit log');
assert(suspensionLog?.metadata?.reason === 'Audit compliance review', 'Audit log captured suspension reason');

// 6. Test Shop Restoration
dbStore.setShopStatus('shop-002', 'active');
assert(dbStore.getShop('shop-002').status === 'active', 'Shop 002 successfully restored to "active"');
assert(dbStore.getShop('shop-002').suspended_at === null, 'Suspended timestamp cleared on restoration');

// 7. Verify Public Registration cannot escalate privileges
const registered = dbStore.registerUser({
  email: 'malicious@attempt.com',
  password: 'password123',
  name: 'Attacker',
  shop_name: 'Attacker Shop',
  role: 'super_admin' // Attempting to escalate
});
assert(registered.user.is_superadmin === false, 'New registration CANNOT set is_superadmin: true');
assert(registered.user.role === 'Owner', 'New registration role forced to "Owner" (privilege escalation blocked)');

console.log('---------------------------------------------------------------');
console.log(`Super Admin Test Suite Results: ${passCount} passed, ${failCount} failed.`);
console.log('===============================================================');

if (failCount > 0) {
  process.exit(1);
}
