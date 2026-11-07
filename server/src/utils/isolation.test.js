/**
 * VyaparMitra AI - User-Level Data Isolation & Security Verification Suite
 * Tests multi-tenant boundaries between User A (Ramesh) and User B (Anita)
 */
import jwt from 'jsonwebtoken';
import { dbStore } from '../database/store.js';

const JWT_SECRET = process.env.JWT_SECRET || 'vyaparmitra_production_secret_key_2026_jwt';

function runIsolationTests() {
  console.log('===============================================================');
  console.log('RUNNING MULTI-USER DATA ISOLATION & SECURITY TEST SUITE');
  console.log('===============================================================');

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`✓ PASS: ${message}`);
      passed++;
    } else {
      console.error(`✗ FAIL: ${message}`);
      failed++;
    }
  }

  // 1. Verify User A and User B existence
  const userA = dbStore.getUserByEmail('ramesh@lakshmikirana.in');
  const userB = dbStore.getUserByEmail('anita@anitaretail.in');

  assert(userA !== null && userB !== null, 'Both User A (Ramesh) and User B (Anita) exist in store');
  assert(userA.shop_id !== userB.shop_id, `User A (Shop: ${userA.shop_id}) and User B (Shop: ${userB.shop_id}) have distinct shop workspaces`);

  // 2. Test Product Isolation
  const productsA = dbStore.getProducts(userA.shop_id);
  const productsB = dbStore.getProducts(userB.shop_id);

  assert(productsA.length > 0 && productsB.length > 0, `User A has ${productsA.length} products, User B has ${productsB.length} products`);

  const crossContaminationA = productsA.some(p => p.shop_id === userB.shop_id);
  const crossContaminationB = productsB.some(p => p.shop_id === userA.shop_id);
  assert(!crossContaminationA && !crossContaminationB, 'Zero cross-contamination in product catalogs between User A and User B');

  // 3. Test Customer & Udhaar Isolation
  const customersA = dbStore.getCustomers(userA.shop_id);
  const customersB = dbStore.getCustomers(userB.shop_id);
  assert(customersA.length > 0 && customersB.length > 0, `User A has ${customersA.length} customers, User B has ${customersB.length} customers`);
  assert(customersA.every(c => c.shop_id === userA.shop_id), 'All User A customers belong strictly to User A shop');
  assert(customersB.every(c => c.shop_id === userB.shop_id), 'All User B customers belong strictly to User B shop');

  // 4. Test Cross-Tenant Unauthorized Modification
  const sampleProductB = productsB[0];
  // Attempt to update User B's product using User A's shop_id
  const unauthorizedUpdate = dbStore.updateProduct(userA.shop_id, sampleProductB.id, { selling_price: 99999 });
  assert(unauthorizedUpdate === null, 'User A cannot update User B product (returned null / access denied)');

  // Attempt to delete User B's product using User A's shop_id
  const unauthorizedDelete = dbStore.deleteProduct(userA.shop_id, sampleProductB.id);
  assert(unauthorizedDelete === false, 'User A cannot delete User B product (returned false / access denied)');

  // 5. Test Sales & POS Isolation
  const salesA = dbStore.getSales(userA.shop_id);
  const salesB = dbStore.getSales(userB.shop_id);
  assert(salesA.every(s => s.shop_id === userA.shop_id), 'All User A sales belong strictly to User A shop');
  assert(salesB.every(s => s.shop_id === userB.shop_id), 'All User B sales belong strictly to User B shop');

  // 6. Test Dashboard KPI Isolation
  const statsA = dbStore.getDashboardStats(userA.shop_id);
  const statsB = dbStore.getDashboardStats(userB.shop_id);

  assert(statsA.totalSales !== statsB.totalSales, `User A sales (₹${statsA.totalSales}) and User B sales (₹${statsB.totalSales}) are independently calculated`);
  assert(statsA.totalOrders !== statsB.totalOrders, `User A orders (${statsA.totalOrders}) and User B orders (${statsB.totalOrders}) are independent`);
  assert(statsA.outstandingCredit !== statsB.outstandingCredit, `User A Udhaar (₹${statsA.outstandingCredit}) and User B Udhaar (₹${statsB.outstandingCredit}) are independent`);

  // 7. Test Dynamic User C Registration Isolation
  const regResult = dbStore.registerUser({
    email: 'testuser_c@retailtest.in',
    password: 'password123',
    name: 'Vikram Joshi',
    phone: '+91 91111 22222',
    shop_name: 'Joshi Kirana Mart'
  });

  const userC = regResult.user;
  const shopC = regResult.shop;

  assert(userC.id !== userA.id && userC.id !== userB.id, 'User C has a unique User ID');
  assert(shopC.id !== userA.shop_id && shopC.id !== userB.shop_id, 'User C has an independent Shop ID');

  const productsC = dbStore.getProducts(shopC.id);
  assert(productsC.length > 0, `User C was provisioned with independent sample data (${productsC.length} items)`);
  assert(productsC.every(p => p.shop_id === shopC.id), 'All User C items belong strictly to User C shop');

  // Verify User C cannot see User A or User B records
  assert(!productsC.some(p => p.shop_id === userA.shop_id || p.shop_id === userB.shop_id), 'User C has zero access to User A or User B items');

  console.log(`\nIsolation Test Suite Results: ${passed} passed, ${failed} failed.`);
  if (failed > 0) process.exit(1);
}

runIsolationTests();
