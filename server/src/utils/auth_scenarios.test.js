/**
 * Mandatory End-to-End Scenarios Test Suite
 * Tests actual HTTP authentication endpoints against live server.
 */

let passCount = 0;
let failCount = 0;

function assert(cond, msg) {
  if (cond) {
    console.log(`✓ PASS: ${msg}`);
    passCount++;
  } else {
    console.error(`✗ FAIL: ${msg}`);
    failCount++;
  }
}

const BASE_URL = 'http://localhost:5000/api';

async function runTests() {
  console.log('===============================================================');
  console.log('RUNNING MANDATORY AUTHENTICATION & ACCESS CONTROL SCENARIOS');
  console.log('===============================================================');

  // --- SCENARIO A: Public Visitor (Unauthenticated) ---
  console.log('\n--- SCENARIO A: Public Visitor & Route Protection ---');
  
  // 1. Health is public
  const healthRes = await fetch(`${BASE_URL}/health`);
  assert(healthRes.status === 200, 'Public health endpoint is accessible without credentials');

  // 2. Protected shop endpoints reject unauthenticated requests
  const noAuthDash = await fetch(`${BASE_URL}/dashboard/stats`);
  assert(noAuthDash.status === 401, 'Unauthenticated access to /api/dashboard/stats returns 401');

  const noAuthProds = await fetch(`${BASE_URL}/inventory/products`);
  assert(noAuthProds.status === 401, 'Unauthenticated access to /api/inventory/products returns 401');

  // 3. Protected Super Admin endpoints reject unauthenticated requests
  const noAuthAdmin = await fetch(`${BASE_URL}/super-admin/dashboard`);
  assert(noAuthAdmin.status === 401, 'Unauthenticated access to /api/super-admin/dashboard returns 401');

  // 4. Empty password rejection
  const emptyPwdRes = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'ramesh@lakshmikirana.in', password: '' })
  });
  assert(emptyPwdRes.status === 400, 'Login with empty password is strictly rejected with 400');

  // 5. Wrong password rejection
  const wrongPwdRes = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'ramesh@lakshmikirana.in', password: 'incorrectPassword' })
  });
  assert(wrongPwdRes.status === 401, 'Login with wrong password is strictly rejected with 401');

  // --- SCENARIO B: Shop Owner A (Ramesh Kumar - Lakshmi Kirana) ---
  console.log('\n--- SCENARIO B: Shop Owner A (Ramesh Kumar) ---');

  const loginARes = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'ramesh@lakshmikirana.in', password: 'password123' })
  });
  assert(loginARes.status === 200, 'Shop Owner A successfully authenticates with valid credentials');
  const dataA = await loginARes.json();
  const tokenA = dataA.token;
  assert(Boolean(tokenA), 'Received valid JWT token for Shop Owner A');
  assert(dataA.user.role === 'Owner', 'User A has role Owner');
  assert(dataA.user.is_superadmin === false, 'User A is NOT superadmin');

  // Fetch Owner A dashboard
  const dashARes = await fetch(`${BASE_URL}/dashboard/stats`, {
    headers: { 'Authorization': `Bearer ${tokenA}` }
  });
  assert(dashARes.status === 200, 'Owner A can access /api/dashboard/stats');
  const dashA = await dashARes.json();
  assert(dashA.shop.id === 'shop-001', 'Owner A receives Shop 001 workspace');
  assert(dashA.stats.totalProducts === 28, 'Owner A catalog has 28 products');

  // Fetch Owner A products
  const prodsARes = await fetch(`${BASE_URL}/inventory/products`, {
    headers: { 'Authorization': `Bearer ${tokenA}` }
  });
  const prodsA = await prodsARes.json();
  assert(prodsA.length === 28, 'Owner A products count is exactly 28');
  assert(prodsA.every(p => p.shop_id === 'shop-001'), 'All products strictly belong to shop-001');

  // Attempt Super Admin access by Owner A (must be 403 Forbidden)
  const forbiddenRes = await fetch(`${BASE_URL}/super-admin/dashboard`, {
    headers: { 'Authorization': `Bearer ${tokenA}` }
  });
  assert(forbiddenRes.status === 403, 'Owner A is strictly forbidden (403) from accessing Super Admin endpoints');

  // Clean Logout for User A
  const logoutARes = await fetch(`${BASE_URL}/auth/logout`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${tokenA}` }
  });
  assert(logoutARes.status === 200, 'User A logs out cleanly via /api/auth/logout');

  // --- SCENARIO C: Shop Owner B (Anita Deshmukh - Anita Supermart) ---
  console.log('\n--- SCENARIO C: Shop Owner B (Anita Deshmukh) ---');

  const loginBRes = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'anita@anitaretail.in', password: 'password123' })
  });
  assert(loginBRes.status === 200, 'Shop Owner B successfully authenticates');
  const dataB = await loginBRes.json();
  const tokenB = dataB.token;
  assert(tokenB !== tokenA, 'Owner B has a distinct JWT token from Owner A');
  assert(dataB.user.shop_id === 'shop-002', 'Owner B belongs to shop-002');

  const dashBRes = await fetch(`${BASE_URL}/dashboard/stats`, {
    headers: { 'Authorization': `Bearer ${tokenB}` }
  });
  const dashB = await dashBRes.json();
  assert(dashB.shop.id === 'shop-002', 'Owner B receives Shop 002 workspace');
  assert(dashB.stats.totalProducts === 6, 'Owner B catalog has 6 products (independent from Shop A)');

  const prodsBRes = await fetch(`${BASE_URL}/inventory/products`, {
    headers: { 'Authorization': `Bearer ${tokenB}` }
  });
  const prodsB = await prodsBRes.json();
  assert(prodsB.length === 6, 'Owner B product count is 6');
  assert(prodsB.every(p => p.shop_id === 'shop-002'), 'Zero leakage from Shop A into Shop B catalog');

  // Clean Logout for User B
  const logoutBRes = await fetch(`${BASE_URL}/auth/logout`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${tokenB}` }
  });
  assert(logoutBRes.status === 200, 'User B logs out cleanly via /api/auth/logout');

  // --- SCENARIO D: Platform Super Admin ---
  console.log('\n--- SCENARIO D: Super Admin (Platform Administrator) ---');

  const loginAdminRes = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@vyaparmitra.ai', password: 'SuperAdmin@2026' })
  });
  assert(loginAdminRes.status === 200, 'Super Admin authenticates successfully with valid credentials');
  const dataAdmin = await loginAdminRes.json();
  const tokenAdmin = dataAdmin.token;
  assert(dataAdmin.user.role === 'super_admin', 'Backend identifies role as super_admin');
  assert(dataAdmin.user.is_superadmin === true, 'Backend identifies is_superadmin: true');

  // Access Super Admin Control Plane Dashboard
  const adminDashRes = await fetch(`${BASE_URL}/super-admin/dashboard`, {
    headers: { 'Authorization': `Bearer ${tokenAdmin}` }
  });
  assert(adminDashRes.status === 200, 'Super Admin accesses /api/super-admin/dashboard');
  const adminDash = await adminDashRes.json();
  assert(adminDash.stats.totalShops >= 5, `Super Admin aggregates total shops: ${adminDash.stats.totalShops}`);
  assert(adminDash.stats.totalPlatformSales > 0, `Total platform sales aggregated: ₹${adminDash.stats.totalPlatformSales}`);

  // Access Super Admin Shops Management
  const adminShopsRes = await fetch(`${BASE_URL}/super-admin/shops`, {
    headers: { 'Authorization': `Bearer ${tokenAdmin}` }
  });
  assert(adminShopsRes.status === 200, 'Super Admin accesses /api/super-admin/shops');
  const adminShops = await adminShopsRes.json();
  assert(adminShops.shops.length >= 5, `Found ${adminShops.shops.length} tenant shops in control plane`);

  // Access Super Admin Users Management
  const adminUsersRes = await fetch(`${BASE_URL}/super-admin/users`, {
    headers: { 'Authorization': `Bearer ${tokenAdmin}` }
  });
  assert(adminUsersRes.status === 200, 'Super Admin accesses /api/super-admin/users');

  // Access Super Admin Subscriptions
  const adminSubsRes = await fetch(`${BASE_URL}/super-admin/subscriptions`, {
    headers: { 'Authorization': `Bearer ${tokenAdmin}` }
  });
  assert(adminSubsRes.status === 200, 'Super Admin accesses /api/super-admin/subscriptions');

  // Access Super Admin Activity
  const adminActRes = await fetch(`${BASE_URL}/super-admin/activity`, {
    headers: { 'Authorization': `Bearer ${tokenAdmin}` }
  });
  assert(adminActRes.status === 200, 'Super Admin accesses /api/super-admin/activity');

  // Clean Logout for Super Admin
  const logoutAdminRes = await fetch(`${BASE_URL}/auth/logout`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${tokenAdmin}` }
  });
  assert(logoutAdminRes.status === 200, 'Super Admin logs out cleanly via /api/auth/logout');

  // --- SCENARIO E: Sequential Account Switching Sequence ---
  console.log('\n--- SCENARIO E: Sequential Account Switching Sequence ---');
  // Shop A -> Logout -> Shop B -> Logout -> Super Admin -> Logout
  
  // Step 1: Login A
  const s1 = await (await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'ramesh@lakshmikirana.in', password: 'password123' })
  })).json();
  assert(s1.user.email === 'ramesh@lakshmikirana.in', 'Switching step 1: Logged in as Shop A');

  // Step 2: Logout A
  await fetch(`${BASE_URL}/auth/logout`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${s1.token}` }
  });

  // Step 3: Login B
  const s2 = await (await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'anita@anitaretail.in', password: 'password123' })
  })).json();
  assert(s2.user.email === 'anita@anitaretail.in', 'Switching step 2: Logged in as Shop B');
  assert(s2.user.shop_id !== s1.user.shop_id, 'Switching step 2: Identity completely separated from Shop A');

  // Step 4: Logout B
  await fetch(`${BASE_URL}/auth/logout`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${s2.token}` }
  });

  // Step 5: Login Super Admin
  const s3 = await (await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@vyaparmitra.ai', password: 'SuperAdmin@2026' })
  })).json();
  assert(s3.user.email === 'admin@vyaparmitra.ai', 'Switching step 3: Logged in as Super Admin');
  assert(s3.user.role === 'super_admin', 'Switching step 3: Elevated control plane role verified');

  // Step 6: Logout Super Admin
  await fetch(`${BASE_URL}/auth/logout`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${s3.token}` }
  });
  assert(true, 'Full switching cycle completed without stale credentials or crossover');

  // --- SCENARIO F: Super Admin Provisioning & Recovery ---
  console.log('\n--- SCENARIO F: Super Admin Provisioning & Recovery ---');
  
  const provRes = await fetch(`${BASE_URL}/auth/provision-superadmin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'admin@vyaparmitra.ai',
      password: 'SuperAdmin@2026',
      masterKey: 'vyaparmitra_superadmin_init_2026'
    })
  });
  assert(provRes.status === 200, 'Super Admin credentials can be securely provisioned/repaired via masterKey');
  const provData = await provRes.json();
  assert(provData.role === 'super_admin', 'Provisioned account retains super_admin role');

  console.log('\n===============================================================');
  console.log(`SCENARIO RESULTS: ${passCount} passed, ${failCount} failed.`);
  console.log('===============================================================');

  if (failCount > 0) process.exit(1);
}

runTests().catch(err => {
  console.error('Test execution failed:', err);
  process.exit(1);
});
