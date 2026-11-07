import {
  initialShop,
  initialEmployees,
  initialCategories,
  initialProducts,
  initialSuppliers,
  initialCustomers,
  initialUdhaarTransactions,
  initialSales,
  initialPurchases,
  initialExpenses,
  initialStockMovements,
  initialPlatformShops
} from './initialData.js';
import { calculateGrossProfit, calculateNetProfit, calculateInventoryValuation } from '../utils/calculations.js';
import bcrypt from 'bcryptjs';

/**
 * Multi-Tenant In-Memory & Relational Data Store
 * Strictly isolates every business record by shop_id and user_id.
 * Includes Platform Control Plane & Super Admin capabilities.
 */
class MultiTenantDataStore {
  constructor() {
    this.reset();
  }

  reset() {
    this.users = [];
    this.shops = [];
    this.employees = [];
    this.categories = [];
    this.products = [];
    this.suppliers = [];
    this.customers = [];
    this.udhaarTransactions = [];
    this.sales = [];
    this.purchases = [];
    this.expenses = [];
    this.stockMovements = [];
    this.activityLogs = [];
    this.platformShops = JSON.parse(JSON.stringify(initialPlatformShops));

    this.platformSettings = {
      platformName: "VyaparMitra AI",
      platform_name: "VyaparMitra AI",
      tagline: "Smart Business. Simple Growth.",
      supportEmail: "support@vyaparmitra.ai",
      support_email: "support@vyaparmitra.ai",
      emergencyContact: "+91 800-VYAPAR-AI",
      support_phone: "+91 98450 82134",
      platformVersion: "2.4.0",
      maintenanceMode: false,
      maintenance_mode: false,
      allowNewRegistrations: true,
      allow_new_registrations: true,
      defaultTrialDays: 30,
      trial_days: 30,
      default_currency: "₹",
      gst_default_enabled: true,
      enforceTwoFactor: false,
      autoBackupIntervalHours: 6
    };

    this.subscriptionPlans = [
      {
        id: "plan-starter",
        name: "Starter Plan",
        price: 499,
        billingCycle: "Monthly",
        maxProducts: 250,
        maxEmployees: 2,
        features: ["POS Billing & Receipts", "Single Device Counter", "Customer Udhaar Khata", "Daily Sales Reports", "Email Support"],
        color: "sand"
      },
      {
        id: "plan-growth",
        name: "Growth Plan",
        price: 999,
        billingCycle: "Monthly",
        maxProducts: 1000,
        maxEmployees: 5,
        features: ["All Starter Features", "VyaparMitra AI Assistant", "Low Stock & Reorder Triggers", "Wholesale Supplier POs", "WhatsApp Bill Delivery", "Priority Support"],
        isPopular: true,
        color: "forest"
      },
      {
        id: "plan-pro",
        name: "Pro Enterprise",
        price: 1999,
        billingCycle: "Monthly",
        maxProducts: 5000,
        maxEmployees: 15,
        features: ["All Growth Features", "Advanced AI Financial Forecasts", "Multi-Counter POS", "Custom GST & Barcode Templates", "Export All Audit Logs", "Dedicated Account Manager"],
        color: "purple"
      },
      {
        id: "plan-custom",
        name: "Wholesale Enterprise",
        price: 3999,
        billingCycle: "Monthly",
        maxProducts: 25000,
        maxEmployees: 50,
        features: ["Multi-Store Chain Management", "Central Warehouse Sync", "Dedicated Database Instance", "Custom ERP Integration", "24/7 SLA Hotline"],
        color: "emerald"
      }
    ];

    // 1. Initialize Dedicated Platform Super Admin
    const superAdminUser = {
      id: "user-superadmin-001",
      email: "admin@vyaparmitra.ai",
      password_hash: bcrypt.hashSync("SuperAdmin@2026", 10),
      name: "Platform Super Administrator",
      phone: "+91 80000 99999",
      role: "super_admin",
      shop_id: "shop-platform",
      is_superadmin: true,
      status: "active",
      created_at: "2024-01-01T00:00:00.000Z",
      last_login_at: new Date().toISOString()
    };
    this.users.push(superAdminUser);

    const platformShop = {
      id: "shop-platform",
      name: "VyaparMitra Platform Control Plane",
      tagline: "Global Multi-Tenant Administration HQ",
      business_type: "SaaS Headquarters",
      owner_id: superAdminUser.id,
      gstin: "29AAAAA0000A1Z5",
      phone: "+91 80000 99999",
      email: "admin@vyaparmitra.ai",
      address: "Prestige Tech Park, Outer Ring Road",
      city: "Bengaluru",
      state: "Karnataka",
      pincode: "560103",
      currency: "INR",
      currency_symbol: "₹",
      invoice_prefix: "VM-HQ-",
      receipt_footer_note: "Official VyaparMitra AI Platform Administration",
      subscription_plan_id: "plan-custom",
      subscription_plan_name: "Internal Master",
      subscription_status: "active",
      status: "active",
      mrr: 0,
      created_at: "2024-01-01T00:00:00.000Z",
      last_active_at: new Date().toISOString()
    };
    this.shops.push(platformShop);

    // 2. Initialize User A (Ramesh Kumar - Lakshmi Kirana & General Store, Bengaluru)
    const userA = {
      id: "user-owner-001",
      email: "ramesh@lakshmikirana.in",
      password_hash: bcrypt.hashSync("password123", 10),
      name: "Ramesh Kumar",
      phone: "+91 98450 82134",
      role: "Owner",
      shop_id: "shop-001",
      is_superadmin: false,
      status: "active",
      created_at: "2024-01-15T00:00:00.000Z",
      last_login_at: "2026-11-06T14:20:00.000Z"
    };
    this.users.push(userA);

    const shopA = {
      ...initialShop,
      id: "shop-001",
      owner_id: userA.id,
      owner_name: userA.name,
      owner_email: userA.email,
      status: "active",
      subscription_plan_id: "plan-pro",
      subscription_plan_name: "Pro Enterprise",
      subscription_status: "active",
      mrr: 1999,
      created_at: "2024-01-15T00:00:00.000Z",
      last_active_at: "2026-11-06T14:20:00.000Z"
    };
    this.shops.push(shopA);

    // Seed User A's data
    initialEmployees.forEach(e => {
      this.employees.push({ ...e, shop_id: "shop-001", user_id: e.id });
    });
    initialCategories.forEach(c => {
      this.categories.push({ ...c, shop_id: "shop-001" });
    });
    initialProducts.forEach(p => {
      this.products.push({ ...p, shop_id: "shop-001", user_id: userA.id });
    });
    initialSuppliers.forEach(s => {
      this.suppliers.push({ ...s, shop_id: "shop-001", user_id: userA.id });
    });
    initialCustomers.forEach(c => {
      this.customers.push({ ...c, shop_id: "shop-001", user_id: userA.id });
    });
    initialUdhaarTransactions.forEach(u => {
      this.udhaarTransactions.push({ ...u, shop_id: "shop-001" });
    });
    initialSales.forEach(s => {
      this.sales.push({ ...s, shop_id: "shop-001", user_id: userA.id });
    });
    initialPurchases.forEach(p => {
      this.purchases.push({ ...p, shop_id: "shop-001", user_id: userA.id });
    });
    initialExpenses.forEach(e => {
      this.expenses.push({ ...e, shop_id: "shop-001", user_id: userA.id });
    });
    initialStockMovements.forEach(m => {
      this.stockMovements.push({ ...m, shop_id: "shop-001" });
    });

    // 3. Initialize User B (Anita Deshmukh - Anita Supermart & Provisions, Hyderabad)
    const userB = {
      id: "user-owner-002",
      email: "anita@anitaretail.in",
      password_hash: bcrypt.hashSync("password123", 10),
      name: "Anita Deshmukh",
      phone: "+91 98490 54321",
      role: "Owner",
      shop_id: "shop-002",
      is_superadmin: false,
      status: "active",
      created_at: "2024-03-20T00:00:00.000Z",
      last_login_at: "2026-11-06T15:30:00.000Z"
    };
    this.users.push(userB);

    const shopB = {
      id: "shop-002",
      name: "Anita Supermart & Provisions",
      tagline: "Quality Goods. Trusted Service.",
      business_type: "Supermarket & Daily Provisions",
      owner_id: userB.id,
      owner_name: userB.name,
      owner_email: userB.email,
      gstin: "36AABCA7766M1Z4",
      phone: "+91 98490 54321",
      email: "orders@anitaretail.in",
      address: "Plot 89, Banjara Hills Road #12",
      city: "Hyderabad",
      state: "Telangana",
      pincode: "500034",
      currency: "INR",
      currency_symbol: "₹",
      invoice_prefix: "ASP-HYD-",
      receipt_footer_note: "Thank you for shopping at Anita Supermart! Have a pleasant day.",
      status: "active",
      subscription_plan_id: "plan-growth",
      subscription_plan_name: "Growth Plan",
      subscription_status: "active",
      mrr: 999,
      created_at: "2024-03-20T00:00:00.000Z",
      last_active_at: "2026-11-06T15:30:00.000Z"
    };
    this.shops.push(shopB);

    this.employees.push({
      id: userB.id,
      shop_id: "shop-002",
      user_id: userB.id,
      name: userB.name,
      email: userB.email,
      phone: userB.phone,
      role: "Owner",
      status: "active",
      joined_at: "2024-03-20",
      permissions: ["all"]
    });

    this.seedWorkspaceDemoData(userB.id, "shop-002", shopB.name);

    // 4. Initialize Other Regional Demo Tenant Shops for Super Admin Management
    const extraShops = [
      {
        id: "shop-003",
        name: "Shree Ganesh Retail Mart",
        tagline: "Daily Essentials at Wholesale Prices",
        business_type: "Retail Grocery",
        owner_id: "user-owner-003",
        owner_name: "Suresh P. Kulkarni",
        owner_email: "suresh@ganeshretail.in",
        phone: "+91 98220 11445",
        email: "contact@ganeshretail.in",
        address: "Shop 4, Laxmi Road, Narayan Peth",
        city: "Pune",
        state: "Maharashtra",
        pincode: "411030",
        currency: "INR",
        currency_symbol: "₹",
        invoice_prefix: "SGM-PN-",
        receipt_footer_note: "Dhanyavad! Visit Shree Ganesh Mart Again.",
        status: "active",
        subscription_plan_id: "plan-starter",
        subscription_plan_name: "Starter Plan",
        subscription_status: "active",
        mrr: 499,
        created_at: "2024-05-10T00:00:00.000Z",
        last_active_at: "2026-11-05T18:10:00.000Z"
      },
      {
        id: "shop-004",
        name: "Royal Garments & Men's Wear",
        tagline: "Ethnic & Casual Fashion Hub",
        business_type: "Clothing & Apparel",
        owner_id: "user-owner-004",
        owner_name: "Vikram Rathore",
        owner_email: "vikram@royalgarments.in",
        phone: "+91 94140 22334",
        email: "sales@royalgarments.in",
        address: "B-12, Johari Bazar",
        city: "Jaipur",
        state: "Rajasthan",
        pincode: "302003",
        currency: "INR",
        currency_symbol: "₹",
        invoice_prefix: "RGM-JP-",
        receipt_footer_note: "No returns without bill within 7 days.",
        status: "active",
        subscription_plan_id: "plan-growth",
        subscription_plan_name: "Growth Plan",
        subscription_status: "active",
        mrr: 999,
        created_at: "2024-06-18T00:00:00.000Z",
        last_active_at: "2026-11-04T12:00:00.000Z"
      },
      {
        id: "shop-005",
        name: "Krishna Medical & General Store",
        tagline: "Healthcare & Daily Pharmacy",
        business_type: "Pharmacy & General",
        owner_id: "user-owner-005",
        owner_name: "Haresh Shah",
        owner_email: "haresh@krishnamedical.in",
        phone: "+91 98250 88776",
        email: "care@krishnamedical.in",
        address: "GF 2, Shivalik Plaza, CG Road",
        city: "Ahmedabad",
        state: "Gujarat",
        pincode: "380009",
        currency: "INR",
        currency_symbol: "₹",
        invoice_prefix: "KM-AH-",
        receipt_footer_note: "Medicines once sold cannot be returned without batch verification.",
        status: "suspended",
        suspended_at: "2026-10-15T11:00:00.000Z",
        suspension_reason: "Annual pharmacy regulatory compliance certificate verification pending.",
        subscription_plan_id: "plan-starter",
        subscription_plan_name: "Starter Plan",
        subscription_status: "past_due",
        mrr: 499,
        created_at: "2024-07-22T00:00:00.000Z",
        last_active_at: "2026-10-15T10:45:00.000Z"
      }
    ];

    extraShops.forEach(s => {
      this.shops.push(s);
      const user = {
        id: s.owner_id,
        email: s.owner_email,
        password_hash: bcrypt.hashSync("password123", 10),
        name: s.owner_name,
        phone: s.phone,
        role: "Owner",
        shop_id: s.id,
        is_superadmin: false,
        status: s.status === 'suspended' ? 'inactive' : 'active',
        created_at: s.created_at,
        last_login_at: s.last_active_at
      };
      this.users.push(user);
      this.seedWorkspaceDemoData(user.id, s.id, s.name);
    });

    // 5. Seed Initial Activity & Audit Logs
    this.activityLogs = [
      {
        id: "act-001",
        event_type: "SYSTEM_INITIALIZED",
        entity_type: "system",
        entity_id: "core-01",
        shop_id: null,
        actor_id: "user-superadmin-001",
        actor_email: "admin@vyaparmitra.ai",
        description: "VyaparMitra AI Multi-Tenant SaaS Engine initialized with secure data isolation.",
        created_at: "2024-01-01T00:00:00.000Z"
      },
      {
        id: "act-002",
        event_type: "SHOP_REGISTERED",
        entity_type: "shop",
        entity_id: "shop-001",
        shop_id: "shop-001",
        actor_id: "user-owner-001",
        actor_email: "ramesh@lakshmikirana.in",
        description: "Lakshmi Kirana & General Store registered in Bengaluru, Karnataka.",
        created_at: "2024-01-15T00:00:00.000Z"
      },
      {
        id: "act-003",
        event_type: "SUBSCRIPTION_ACTIVATED",
        entity_type: "subscription",
        entity_id: "sub-001",
        shop_id: "shop-001",
        actor_id: "user-superadmin-001",
        actor_email: "admin@vyaparmitra.ai",
        description: "Pro Enterprise Plan (₹1,999/mo) activated for Lakshmi Kirana.",
        created_at: "2024-01-15T01:00:00.000Z"
      },
      {
        id: "act-004",
        event_type: "SHOP_REGISTERED",
        entity_type: "shop",
        entity_id: "shop-002",
        shop_id: "shop-002",
        actor_id: "user-owner-002",
        actor_email: "anita@anitaretail.in",
        description: "Anita Supermart & Provisions registered in Hyderabad, Telangana.",
        created_at: "2024-03-20T00:00:00.000Z"
      },
      {
        id: "act-005",
        event_type: "SHOP_SUSPENDED",
        entity_type: "shop",
        entity_id: "shop-005",
        shop_id: "shop-005",
        actor_id: "user-superadmin-001",
        actor_email: "admin@vyaparmitra.ai",
        description: "Krishna Medical & General Store suspended due to pending regulatory compliance verification.",
        metadata: { reason: "Regulatory certificate verification pending" },
        created_at: "2026-10-15T11:00:00.000Z"
      },
      {
        id: "act-006",
        event_type: "BACKUP_COMPLETED",
        entity_type: "system",
        entity_id: "backup-v24",
        shop_id: null,
        actor_id: "system",
        actor_email: "system@vyaparmitra.ai",
        description: "Automated snapshot backup completed. 100% tenant data integrity verified.",
        created_at: new Date(Date.now() - 4 * 3600 * 1000).toISOString()
      }
    ];
  }

  // --- ACTIVITY AUDIT LOGGING ---
  logActivity({ eventType, entityType, entityId, shopId, shop_id, actorId, actor_id, actorEmail, actor_email, description, metadata = {} }) {
    const logEntry = {
      id: `act-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      event_type: eventType,
      entity_type: entityType,
      entity_id: entityId,
      shop_id: shopId || shop_id || null,
      actor_id: actorId || actor_id || null,
      actor_email: actorEmail || actor_email || 'system@vyaparmitra.ai',
      description,
      metadata,
      created_at: new Date().toISOString()
    };
    this.activityLogs.unshift(logEntry);
    if (this.activityLogs.length > 500) this.activityLogs.pop();
    return logEntry;
  }

  // --- SEED SAMPLE DATA FOR NEWLY CREATED WORKSPACES ---
  seedWorkspaceDemoData(userId, shopId, shopName) {
    const cats = [
      { id: `cat-${shopId}-1`, shop_id: shopId, name: "Grocery Staples", description: "Flour, Rice & Pulses" },
      { id: `cat-${shopId}-2`, shop_id: shopId, name: "Edible Oils", description: "Refined & Mustard Cooking Oils" },
      { id: `cat-${shopId}-3`, shop_id: shopId, name: "Dairy & Beverages", description: "Milk, Ghee & Tea" }
    ];
    this.categories.push(...cats);

    const prods = [
      { id: `prod-${shopId}-01`, shop_id: shopId, user_id: userId, category_id: cats[0].id, name: "Aashirvaad Select Sharbati Atta 5kg", sku: `ATT-${shopId.slice(-4)}-01`, barcode: `890103001${Date.now().toString().slice(-4)}`, unit: "bag", purchase_price: 245, selling_price: 295, stock_quantity: 24, reorder_level: 10, tax_rate: 0 },
      { id: `prod-${shopId}-02`, shop_id: shopId, user_id: userId, category_id: cats[0].id, name: "Fortune Rozana Basmati Rice 5kg", sku: `RIC-${shopId.slice(-4)}-02`, barcode: `890600728${Date.now().toString().slice(-4)}`, unit: "bag", purchase_price: 360, selling_price: 435, stock_quantity: 18, reorder_level: 8, tax_rate: 0 },
      { id: `prod-${shopId}-03`, shop_id: shopId, user_id: userId, category_id: cats[0].id, name: "Tata Sampann Toor Dal 1kg", sku: `DAL-${shopId.slice(-4)}-03`, barcode: `890404390${Date.now().toString().slice(-4)}`, unit: "packet", purchase_price: 140, selling_price: 172, stock_quantity: 30, reorder_level: 12, tax_rate: 0 },
      { id: `prod-${shopId}-04`, shop_id: shopId, user_id: userId, category_id: cats[1].id, name: "Fortune Sunlite Refined Sunflower Oil 1L", sku: `OIL-${shopId.slice(-4)}-04`, barcode: `890200112${Date.now().toString().slice(-4)}`, unit: "bottle", purchase_price: 135, selling_price: 165, stock_quantity: 6, reorder_level: 10, tax_rate: 5 },
      { id: `prod-${shopId}-05`, shop_id: shopId, user_id: userId, category_id: cats[2].id, name: "Amul Pure Cow Ghee 1L Pouch", sku: `GHE-${shopId.slice(-4)}-05`, barcode: `890126201${Date.now().toString().slice(-4)}`, unit: "pouch", purchase_price: 540, selling_price: 630, stock_quantity: 15, reorder_level: 5, tax_rate: 12 },
      { id: `prod-${shopId}-06`, shop_id: shopId, user_id: userId, category_id: cats[2].id, name: "Red Label Strong CTC Tea 500g", sku: `TEA-${shopId.slice(-4)}-06`, barcode: `890103038${Date.now().toString().slice(-4)}`, unit: "box", purchase_price: 215, selling_price: 260, stock_quantity: 20, reorder_level: 8, tax_rate: 5 }
    ];
    this.products.push(...prods);

    const sups = [
      { id: `sup-${shopId}-1`, shop_id: shopId, user_id: userId, name: "Adani Wilmar & Fortune Depot", contact_person: "Kishore Kumar", phone: "+91 98480 11223", email: "wilmar@depot.in", address: "Wholesale APMC Complex", gstin: "36AAACF1023D1Z8", balance_due: 0, lead_time_days: 2 },
      { id: `sup-${shopId}-2`, shop_id: shopId, user_id: userId, name: "Amul Gujarat Co-op Agency", contact_person: "Dinesh Patel", phone: "+91 98481 22334", email: "agency@amuldist.in", address: "Station Road Goods Yard", gstin: "36AABCA1234F1Z1", balance_due: 4200, lead_time_days: 1 }
    ];
    this.suppliers.push(...sups);

    const custs = [
      { id: `cust-${shopId}-1`, shop_id: shopId, user_id: userId, name: "Srinivas Rao", phone: "+91 98492 11223", email: "srinivas@gmail.com", address: "Flat 204, Sai Residency", credit_limit: 15000, total_purchases: 8400, outstanding_balance: 1800 },
      { id: `cust-${shopId}-2`, shop_id: shopId, user_id: userId, name: "Radha Krishna", phone: "+91 98493 33445", email: "radha@gmail.com", address: "House 12, Main Bazar", credit_limit: 10000, total_purchases: 4500, outstanding_balance: 600 }
    ];
    this.customers.push(...custs);

    this.sales.push({
      id: `sale-${shopId}-1`,
      shop_id: shopId,
      user_id: userId,
      invoice_number: `INV-${shopId.slice(-4)}-001`,
      sale_date: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
      customer_id: custs[0].id,
      customer_name: custs[0].name,
      customer_phone: custs[0].phone,
      subtotal: 1065,
      discount_amount: 35,
      tax_amount: 30,
      total_amount: 1060,
      payment_method: "UPI",
      payment_status: "COMPLETED",
      cashier_name: "Store Staff",
      items: [
        { product_id: prods[0].id, product_name: prods[0].name, quantity: 2, unit_price: prods[0].selling_price, unit_cost: prods[0].purchase_price, total_price: 590 },
        { product_id: prods[2].id, product_name: prods[2].name, quantity: 2, unit_price: prods[2].selling_price, unit_cost: prods[2].purchase_price, total_price: 344 },
        { product_id: prods[3].id, product_name: prods[3].name, quantity: 1, unit_price: prods[3].selling_price, unit_cost: prods[3].purchase_price, total_price: 165 }
      ]
    });

    this.purchases.push({
      id: `po-${shopId}-1`,
      shop_id: shopId,
      user_id: userId,
      invoice_number: `PO-${shopId.slice(-4)}-101`,
      purchase_date: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
      supplier_id: sups[0].id,
      supplier_name: sups[0].name,
      subtotal: 12400,
      tax_amount: 620,
      total_amount: 13020,
      paid_amount: 13020,
      payment_status: "PAID",
      payment_method: "BANK_TRANSFER",
      items: [
        { product_id: prods[0].id, product_name: prods[0].name, quantity: 20, unit_cost: prods[0].purchase_price, total_cost: 4900 },
        { product_id: prods[1].id, product_name: prods[1].name, quantity: 15, unit_cost: prods[1].purchase_price, total_cost: 5400 }
      ]
    });

    this.expenses.push(
      { id: `exp-${shopId}-1`, shop_id: shopId, user_id: userId, title: "Store Premises Monthly Rent", category: "Rent", amount: 18000, date: new Date().toISOString().split('T')[0], payment_method: "BANK_TRANSFER", notes: "Monthly store lease" },
      { id: `exp-${shopId}-2`, shop_id: shopId, user_id: userId, title: "Commercial Power & Electricity", category: "Electricity", amount: 3200, date: new Date().toISOString().split('T')[0], payment_method: "UPI", notes: "Commercial power bill" }
    );
  }

  // --- USER & AUTHENTICATION METHODS ---
  getUserById(userId) {
    return this.users.find(u => u.id === userId) || null;
  }

  getUserByEmail(email) {
    return this.users.find(u => u.email.toLowerCase() === (email || '').toLowerCase()) || null;
  }

  resetSuperAdminCredentials(email = 'admin@vyaparmitra.ai', newPassword = 'SuperAdmin@2026') {
    let admin = this.getUserByEmail(email);
    const hash = bcrypt.hashSync(newPassword, 10);
    if (admin) {
      admin.password_hash = hash;
      admin.role = 'super_admin';
      admin.is_superadmin = true;
      admin.status = 'active';
      admin.last_login_at = new Date().toISOString();
    } else {
      admin = {
        id: 'user-superadmin-001',
        email: email.toLowerCase(),
        password_hash: hash,
        name: 'Platform Super Administrator',
        phone: '+91 80000 99999',
        role: 'super_admin',
        shop_id: 'shop-platform',
        is_superadmin: true,
        status: 'active',
        created_at: new Date().toISOString(),
        last_login_at: new Date().toISOString()
      };
      this.users.push(admin);
    }

    this.logActivity({
      eventType: 'SUPERADMIN_CREDENTIALS_RESET',
      entityType: 'user',
      entityId: admin.id,
      shop_id: 'shop-platform',
      actor_id: admin.id,
      actor_email: admin.email,
      description: `Platform Super Administrator credentials provisioned for ${admin.email}.`
    });

    return admin;
  }

  registerUser({ email, password, name, phone, shop_name, city, state }) {
    const existing = this.getUserByEmail(email);
    if (existing) {
      throw new Error('An account with this email address already exists.');
    }

    const userId = `user-${Date.now()}`;
    const shopId = `shop-${Date.now()}`;
    const hash = bcrypt.hashSync(password || 'password123', 10);

    // SECURITY: Public registration CANNOT grant Super Admin privilege
    const newUser = {
      id: userId,
      email: email.toLowerCase(),
      password_hash: hash,
      name: name || 'Store Owner',
      phone: phone || '',
      role: 'Owner',
      shop_id: shopId,
      is_superadmin: false,
      status: 'active',
      created_at: new Date().toISOString(),
      last_login_at: new Date().toISOString()
    };

    const newShop = {
      id: shopId,
      name: shop_name || `${newUser.name}'s Retail Store`,
      tagline: "Smart Business. Simple Growth.",
      business_type: "Kirana & Retail Store",
      owner_id: userId,
      owner_name: newUser.name,
      owner_email: newUser.email,
      gstin: "29AABCU0000X1Z1",
      phone: phone || '+91 90000 00000',
      email: email.toLowerCase(),
      address: "Main Market Street",
      city: city || "Bengaluru",
      state: state || "Karnataka",
      pincode: "560001",
      currency: "INR",
      currency_symbol: "₹",
      invoice_prefix: "INV-",
      receipt_footer_note: "Thank you for shopping with us! Visit again.",
      status: "active",
      subscription_plan_id: "plan-growth",
      subscription_plan_name: "Growth Plan",
      subscription_status: "active",
      mrr: 999,
      created_at: new Date().toISOString(),
      last_active_at: new Date().toISOString()
    };

    this.users.push(newUser);
    this.shops.push(newShop);
    this.employees.push({
      id: userId,
      shop_id: shopId,
      user_id: userId,
      name: newUser.name,
      email: newUser.email,
      phone: newUser.phone,
      role: 'Owner',
      status: 'active',
      joined_at: new Date().toISOString().split('T')[0],
      permissions: ['all']
    });

    // Seed isolated demo dataset
    this.seedWorkspaceDemoData(userId, shopId, newShop.name);

    // Log Activity
    this.logActivity({
      eventType: 'SHOP_REGISTERED',
      entityType: 'shop',
      entityId: shopId,
      shop_id: shopId,
      actor_id: userId,
      actor_email: newUser.email,
      description: `New retail shop "${newShop.name}" registered by ${newUser.name} (${city || 'India'})`
    });

    return { user: newUser, shop: newShop };
  }

  getShop(shopId) {
    return this.shops.find(s => s.id === shopId) || null;
  }

  updateShop(shopId, updates) {
    const idx = this.shops.findIndex(s => s.id === shopId);
    if (idx === -1) return null;
    this.shops[idx] = { ...this.shops[idx], ...updates, last_active_at: new Date().toISOString() };
    return this.shops[idx];
  }

  // --- STRICTLY ISOLATED DATA ACCESS METHODS ---

  getDashboardStats(shopId) {
    const shopSales = this.sales.filter(s => s.shop_id === shopId);
    const shopProducts = this.products.filter(p => p.shop_id === shopId);
    const shopCustomers = this.customers.filter(c => c.shop_id === shopId);
    const shopExpenses = this.expenses.filter(e => e.shop_id === shopId);

    const totalSales = shopSales.reduce((sum, s) => sum + Number(s.total_amount || 0), 0);
    const totalOrders = shopSales.length;

    const totalCOGS = shopSales.reduce((sum, s) => {
      const cost = (s.items || []).reduce((acc, item) => acc + (Number(item.quantity) * Number(item.unit_cost || 0)), 0);
      return sum + cost;
    }, 0);

    const { grossProfit, grossMarginPercent } = calculateGrossProfit(totalSales, totalCOGS);
    const totalExpenses = shopExpenses.reduce((sum, e) => sum + Number(e.amount || 0), 0);
    const netProfit = calculateNetProfit(grossProfit, totalExpenses);

    const totalProducts = shopProducts.length;
    const lowStockItems = shopProducts.filter(p => p.stock_quantity <= p.reorder_level);
    const outstandingCredit = shopCustomers.reduce((sum, c) => sum + Number(c.outstanding_balance || 0), 0);
    const inventoryValuation = calculateInventoryValuation(shopProducts);

    return {
      totalSales,
      totalOrders,
      grossProfit,
      grossMarginPercent,
      totalExpenses,
      netProfit,
      totalProducts,
      lowStockCount: lowStockItems.length,
      lowStockItems,
      outstandingCredit,
      inventoryValuation,
      recentSales: shopSales.slice(0, 6),
      recentExpenses: shopExpenses.slice(0, 5)
    };
  }

  // Products
  getProducts(shopId) {
    return this.products.filter(p => p.shop_id === shopId);
  }

  getProduct(shopId, productId) {
    return this.products.find(p => p.id === productId && p.shop_id === shopId) || null;
  }

  createProduct(shopId, userId, data) {
    const newProd = {
      id: `prod-${Date.now()}`,
      shop_id: shopId,
      user_id: userId,
      stock_quantity: Number(data.stock_quantity || 0),
      purchase_price: Number(data.purchase_price || 0),
      selling_price: Number(data.selling_price || 0),
      reorder_level: Number(data.reorder_level || 10),
      tax_rate: Number(data.tax_rate || 5),
      ...data
    };
    this.products.unshift(newProd);

    this.stockMovements.unshift({
      id: `sm-${Date.now()}`,
      shop_id: shopId,
      product_id: newProd.id,
      movement_type: "INITIAL_STOCK",
      quantity: newProd.stock_quantity,
      previous_stock: 0,
      current_stock: newProd.stock_quantity,
      date: new Date().toISOString(),
      notes: "Product added to store catalog"
    });

    return newProd;
  }

  updateProduct(shopId, productId, data) {
    const idx = this.products.findIndex(p => p.id === productId && p.shop_id === shopId);
    if (idx === -1) return null;

    const old = this.products[idx];
    const updated = {
      ...old,
      ...data,
      stock_quantity: data.stock_quantity !== undefined ? Number(data.stock_quantity) : old.stock_quantity,
      purchase_price: data.purchase_price !== undefined ? Number(data.purchase_price) : old.purchase_price,
      selling_price: data.selling_price !== undefined ? Number(data.selling_price) : old.selling_price,
      reorder_level: data.reorder_level !== undefined ? Number(data.reorder_level) : old.reorder_level
    };

    if (data.stock_quantity !== undefined && Number(data.stock_quantity) !== old.stock_quantity) {
      this.stockMovements.unshift({
        id: `sm-${Date.now()}`,
        shop_id: shopId,
        product_id: productId,
        movement_type: "ADJUSTMENT",
        quantity: Math.abs(Number(data.stock_quantity) - old.stock_quantity),
        previous_stock: old.stock_quantity,
        current_stock: Number(data.stock_quantity),
        date: new Date().toISOString(),
        notes: "Manual inventory stock adjustment"
      });
    }

    this.products[idx] = updated;
    return updated;
  }

  deleteProduct(shopId, productId) {
    const idx = this.products.findIndex(p => p.id === productId && p.shop_id === shopId);
    if (idx === -1) return false;
    this.products.splice(idx, 1);
    return true;
  }

  // Categories
  getCategories(shopId) {
    return this.categories.filter(c => c.shop_id === shopId);
  }

  createCategory(shopId, data) {
    const newCat = {
      id: `cat-${Date.now()}`,
      shop_id: shopId,
      ...data
    };
    this.categories.push(newCat);
    return newCat;
  }

  // Stock Movements
  getStockMovements(shopId) {
    return this.stockMovements.filter(m => m.shop_id === shopId);
  }

  // Sales
  getSales(shopId) {
    return this.sales.filter(s => s.shop_id === shopId);
  }

  getSale(shopId, saleId) {
    return this.sales.find(s => s.id === saleId && s.shop_id === shopId) || null;
  }

  createSale(shopId, userId, data) {
    const shop = this.getShop(shopId);
    const saleItems = data.items || [];

    const newSale = {
      id: `sale-${Date.now()}`,
      shop_id: shopId,
      user_id: userId,
      invoice_number: `${shop?.invoice_prefix || 'INV-'}${Date.now().toString().slice(-6)}`,
      sale_date: new Date().toISOString(),
      customer_id: data.customer_id || null,
      customer_name: data.customer_name || 'Walk-in Retail Buyer',
      customer_phone: data.customer_phone || '',
      subtotal: Number(data.subtotal || 0),
      discount_amount: Number(data.discount_amount || 0),
      tax_amount: Number(data.tax_amount || 0),
      total_amount: Number(data.total_amount || 0),
      payment_method: data.payment_method || 'CASH',
      payment_status: 'COMPLETED',
      cashier_name: data.cashier_name || 'Store Cashier',
      items: saleItems
    };

    saleItems.forEach(item => {
      const prod = this.getProduct(shopId, item.product_id);
      if (prod) {
        const prev = prod.stock_quantity;
        prod.stock_quantity = Math.max(0, prod.stock_quantity - Number(item.quantity));
        this.stockMovements.unshift({
          id: `sm-${Date.now()}-${item.product_id}`,
          shop_id: shopId,
          product_id: item.product_id,
          movement_type: "SALE",
          quantity: Number(item.quantity),
          previous_stock: prev,
          current_stock: prod.stock_quantity,
          date: new Date().toISOString(),
          notes: `POS invoice #${newSale.invoice_number}`
        });
      }
    });

    if (newSale.customer_id) {
      const cust = this.getCustomer(shopId, newSale.customer_id);
      if (cust) {
        cust.total_purchases = (cust.total_purchases || 0) + newSale.total_amount;
        if (newSale.payment_method === 'UDHAAR') {
          cust.outstanding_balance = (cust.outstanding_balance || 0) + newSale.total_amount;
          this.udhaarTransactions.unshift({
            id: `tx-${Date.now()}`,
            shop_id: shopId,
            customer_id: cust.id,
            date: new Date().toISOString(),
            transaction_type: "CREDIT",
            amount: newSale.total_amount,
            reference_sale_id: newSale.invoice_number,
            notes: "Udhaar counter sale"
          });
        }
      }
    }

    this.sales.unshift(newSale);
    return newSale;
  }

  // Customers
  getCustomers(shopId) {
    return this.customers.filter(c => c.shop_id === shopId);
  }

  getCustomer(shopId, customerId) {
    return this.customers.find(c => c.id === customerId && c.shop_id === shopId) || null;
  }

  createCustomer(shopId, userId, data) {
    const newCust = {
      id: `cust-${Date.now()}`,
      shop_id: shopId,
      user_id: userId,
      credit_limit: Number(data.credit_limit || 10000),
      total_purchases: 0,
      outstanding_balance: 0,
      ...data
    };
    this.customers.unshift(newCust);
    return newCust;
  }

  updateCustomer(shopId, customerId, data) {
    const idx = this.customers.findIndex(c => c.id === customerId && c.shop_id === shopId);
    if (idx === -1) return null;
    this.customers[idx] = {
      ...this.customers[idx],
      ...data,
      credit_limit: data.credit_limit !== undefined ? Number(data.credit_limit) : this.customers[idx].credit_limit
    };
    return this.customers[idx];
  }

  deleteCustomer(shopId, customerId) {
    const idx = this.customers.findIndex(c => c.id === customerId && c.shop_id === shopId);
    if (idx === -1) return false;
    this.customers.splice(idx, 1);
    return true;
  }

  // Udhaar Transactions
  getUdhaarTransactions(shopId) {
    return this.udhaarTransactions.filter(u => u.shop_id === shopId);
  }

  recordUdhaarPayment(shopId, customerId, amount, paymentMode = 'UPI', notes = '') {
    const cust = this.getCustomer(shopId, customerId);
    if (!cust) return null;

    const amt = Number(amount || 0);
    cust.outstanding_balance = Math.max(0, cust.outstanding_balance - amt);

    const tx = {
      id: `tx-${Date.now()}`,
      shop_id: shopId,
      customer_id: customerId,
      date: new Date().toISOString(),
      transaction_type: "PAYMENT",
      amount: amt,
      payment_mode: paymentMode,
      notes: notes || `Received via ${paymentMode}`
    };

    this.udhaarTransactions.unshift(tx);
    return { customer: cust, transaction: tx };
  }

  // Suppliers
  getSuppliers(shopId) {
    return this.suppliers.filter(s => s.shop_id === shopId);
  }

  getSupplier(shopId, supplierId) {
    return this.suppliers.find(s => s.id === supplierId && s.shop_id === shopId) || null;
  }

  createSupplier(shopId, userId, data) {
    const newSup = {
      id: `sup-${Date.now()}`,
      shop_id: shopId,
      user_id: userId,
      balance_due: 0,
      lead_time_days: Number(data.lead_time_days || 3),
      ...data
    };
    this.suppliers.unshift(newSup);
    return newSup;
  }

  updateSupplier(shopId, supplierId, data) {
    const idx = this.suppliers.findIndex(s => s.id === supplierId && s.shop_id === shopId);
    if (idx === -1) return null;
    this.suppliers[idx] = { ...this.suppliers[idx], ...data };
    return this.suppliers[idx];
  }

  deleteSupplier(shopId, supplierId) {
    const idx = this.suppliers.findIndex(s => s.id === supplierId && s.shop_id === shopId);
    if (idx === -1) return false;
    this.suppliers.splice(idx, 1);
    return true;
  }

  // Purchases
  getPurchases(shopId) {
    return this.purchases.filter(p => p.shop_id === shopId);
  }

  createPurchase(shopId, userId, data) {
    const items = data.items || [];
    const totalAmount = Number(data.total_amount || 0);
    const paidAmount = Number(data.paid_amount || 0);

    const newPO = {
      id: `po-${Date.now()}`,
      shop_id: shopId,
      user_id: userId,
      invoice_number: data.invoice_number || `PO-${Date.now().toString().slice(-6)}`,
      purchase_date: new Date().toISOString(),
      supplier_id: data.supplier_id,
      supplier_name: data.supplier_name,
      subtotal: Number(data.subtotal || 0),
      tax_amount: Number(data.tax_amount || 0),
      total_amount: totalAmount,
      paid_amount: paidAmount,
      payment_status: paidAmount >= totalAmount ? 'PAID' : (paidAmount > 0 ? 'PARTIAL' : 'PENDING'),
      payment_method: data.payment_method || 'BANK_TRANSFER',
      items
    };

    items.forEach(item => {
      const prod = this.getProduct(shopId, item.product_id);
      if (prod) {
        const prev = prod.stock_quantity;
        prod.stock_quantity += Number(item.quantity);
        if (item.unit_cost) prod.purchase_price = Number(item.unit_cost);

        this.stockMovements.unshift({
          id: `sm-${Date.now()}-${item.product_id}`,
          shop_id: shopId,
          product_id: item.product_id,
          movement_type: "PURCHASE",
          quantity: Number(item.quantity),
          previous_stock: prev,
          current_stock: prod.stock_quantity,
          date: new Date().toISOString(),
          notes: `Restock via PO #${newPO.invoice_number}`
        });
      }
    });

    const sup = this.getSupplier(shopId, newPO.supplier_id);
    if (sup && paidAmount < totalAmount) {
      sup.balance_due = (sup.balance_due || 0) + (totalAmount - paidAmount);
    }

    this.purchases.unshift(newPO);
    return newPO;
  }

  // Expenses
  getExpenses(shopId) {
    return this.expenses.filter(e => e.shop_id === shopId);
  }

  createExpense(shopId, userId, data) {
    const newExp = {
      id: `exp-${Date.now()}`,
      shop_id: shopId,
      user_id: userId,
      date: new Date().toISOString().split('T')[0],
      amount: Number(data.amount || 0),
      ...data
    };
    this.expenses.unshift(newExp);
    return newExp;
  }

  deleteExpense(shopId, expenseId) {
    const idx = this.expenses.findIndex(e => e.id === expenseId && e.shop_id === shopId);
    if (idx === -1) return false;
    this.expenses.splice(idx, 1);
    return true;
  }

  // Employees
  getEmployees(shopId) {
    return this.employees.filter(e => e.shop_id === shopId);
  }

  createEmployee(shopId, data) {
    const newEmp = {
      id: `user-${Date.now()}`,
      shop_id: shopId,
      joined_at: new Date().toISOString().split('T')[0],
      status: 'active',
      permissions: ['pos', 'inventory'],
      ...data
    };
    this.employees.push(newEmp);
    return newEmp;
  }

  updateEmployee(shopId, employeeId, data) {
    const idx = this.employees.findIndex(e => e.id === employeeId && e.shop_id === shopId);
    if (idx === -1) return null;
    this.employees[idx] = { ...this.employees[idx], ...data };
    return this.employees[idx];
  }

  deleteEmployee(shopId, employeeId) {
    const idx = this.employees.findIndex(e => e.id === employeeId && e.shop_id === shopId);
    if (idx === -1) return false;
    this.employees.splice(idx, 1);
    return true;
  }

  // ============================================================================
  // --- SUPER ADMIN PLATFORM CONTROL PLANE AGGREGATE METHODS ---
  // ============================================================================

  getSuperAdminDashboard() {
    // Exclude platform control plane shop from tenant metrics
    const tenantShops = this.shops.filter(s => s.id !== 'shop-platform');
    const totalShops = tenantShops.length;
    const activeShops = tenantShops.filter(s => s.status === 'active').length;
    const inactiveShops = tenantShops.filter(s => s.status === 'inactive').length;
    const suspendedShops = tenantShops.filter(s => s.status === 'suspended').length;

    const tenantUsers = this.users.filter(u => u.role !== 'super_admin');
    const totalUsers = tenantUsers.length;
    const activeUsers = tenantUsers.filter(u => u.status === 'active').length;

    // Platform-wide GMV sales volume and invoice counts
    const tenantSales = this.sales.filter(s => s.shop_id !== 'shop-platform');
    const totalPlatformSales = tenantSales.reduce((sum, s) => sum + Number(s.total_amount || 0), 0);
    const totalInvoicesGenerated = tenantSales.length;

    // Platform MRR (Monthly Recurring Revenue)
    const platformMRR = tenantShops
      .filter(s => s.status === 'active')
      .reduce((sum, s) => sum + Number(s.mrr || 999), 0);

    // Platform Growth Chart Data (last 6 months)
    const growthTrend = [
      { month: 'Jun', shops: Math.max(1, totalShops - 4), users: Math.max(2, totalUsers - 6), salesVolume: Math.round(totalPlatformSales * 0.45) },
      { month: 'Jul', shops: Math.max(2, totalShops - 3), users: Math.max(3, totalUsers - 4), salesVolume: Math.round(totalPlatformSales * 0.62) },
      { month: 'Aug', shops: Math.max(3, totalShops - 2), users: Math.max(4, totalUsers - 3), salesVolume: Math.round(totalPlatformSales * 0.78) },
      { month: 'Sep', shops: Math.max(4, totalShops - 1), users: Math.max(5, totalUsers - 2), salesVolume: Math.round(totalPlatformSales * 0.88) },
      { month: 'Oct', shops: totalShops, users: totalUsers - 1, salesVolume: Math.round(totalPlatformSales * 0.94) },
      { month: 'Nov', shops: totalShops, users: totalUsers, salesVolume: totalPlatformSales }
    ];

    return {
      stats: {
        totalShops,
        activeShops,
        inactiveShops,
        suspendedShops,
        totalUsers,
        activeUsers,
        totalPlatformSales,
        totalInvoicesGenerated,
        platformMRR,
        avgLTV: 14990,
        platformUptime: "99.98%"
      },
      growthTrend,
      recentRegistrations: tenantShops.slice(-5).reverse().map(s => ({
        id: s.id,
        name: s.name,
        owner_name: s.owner_name,
        owner_email: s.owner_email,
        city: s.city,
        state: s.state,
        status: s.status,
        plan: s.subscription_plan_name || 'Growth Plan',
        subscription_plan_name: s.subscription_plan_name || 'Growth Plan',
        business_type: s.business_type || 'Kirana & Retail Store',
        created_at: s.created_at
      })),
      recentShops: tenantShops.slice(-5).reverse().map(s => ({
        id: s.id,
        name: s.name,
        owner_name: s.owner_name,
        owner_email: s.owner_email,
        city: s.city,
        state: s.state,
        status: s.status,
        plan: s.subscription_plan_name || 'Growth Plan',
        subscription_plan_name: s.subscription_plan_name || 'Growth Plan',
        business_type: s.business_type || 'Kirana & Retail Store',
        created_at: s.created_at
      })),
      recentActivity: this.activityLogs.slice(0, 8),
      systemHealth: {
        status: "Operational",
        uptime: "99.98%",
        databaseLatency: "24ms",
        apiResponseTime: "48ms",
        activeConnections: 24,
        lastBackup: new Date(Date.now() - 3 * 3600 * 1000).toISOString()
      }
    };
  }

  getAllShopsDetailed({ search = '', status = 'ALL', plan = 'ALL' } = {}) {
    const tenantShops = this.shops.filter(s => s.id !== 'shop-platform');

    let result = tenantShops.map(s => {
      const shopProducts = this.products.filter(p => p.shop_id === s.id);
      const shopSales = this.sales.filter(sl => sl.shop_id === s.id);
      const shopUsers = this.users.filter(u => u.shop_id === s.id);
      const totalRevenue = shopSales.reduce((sum, sl) => sum + Number(sl.total_amount || 0), 0);

      return {
        id: s.id,
        name: s.name,
        business_type: s.business_type,
        owner_name: s.owner_name || 'Store Owner',
        owner_email: s.owner_email || s.email,
        phone: s.phone,
        city: s.city,
        state: s.state,
        status: s.status || 'active',
        suspended_at: s.suspended_at || null,
        suspension_reason: s.suspension_reason || null,
        plan_id: s.subscription_plan_id || 'plan-growth',
        plan_name: s.subscription_plan_name || 'Growth Plan',
        subscription_status: s.subscription_status || 'active',
        mrr: Number(s.mrr || 999),
        users_count: Math.max(1, shopUsers.length),
        products_count: shopProducts.length,
        product_count: shopProducts.length,
        invoices_count: shopSales.length,
        total_sales_volume: totalRevenue,
        total_sales: totalRevenue,
        created_at: s.created_at,
        last_active_at: s.last_active_at || s.created_at
      };
    });

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(s =>
        s.name.toLowerCase().includes(q) ||
        s.owner_name.toLowerCase().includes(q) ||
        s.owner_email.toLowerCase().includes(q) ||
        s.city.toLowerCase().includes(q)
      );
    }

    if (status !== 'ALL') {
      result = result.filter(s => s.status.toLowerCase() === status.toLowerCase());
    }

    if (plan !== 'ALL') {
      result = result.filter(s => s.plan_id === plan || s.plan_name.toLowerCase().includes(plan.toLowerCase()));
    }

    return result;
  }

  getShopDetails(shopId) {
    const shop = this.getShop(shopId);
    if (!shop) return null;

    const shopProducts = this.products.filter(p => p.shop_id === shopId);
    const shopSales = this.sales.filter(s => s.shop_id === shopId);
    const shopCustomers = this.customers.filter(c => c.shop_id === shopId);
    const shopUsers = this.users.filter(u => u.shop_id === shopId);
    const shopLogs = this.activityLogs.filter(a => a.shop_id === shopId);

    const totalRevenue = shopSales.reduce((sum, s) => sum + Number(s.total_amount || 0), 0);
    const totalUdhaar = shopCustomers.reduce((sum, c) => sum + Number(c.outstanding_balance || 0), 0);
    const inventoryValuation = calculateInventoryValuation(shopProducts);

    return {
      shop,
      owner: this.users.find(u => u.id === shop.owner_id) || null,
      users: shopUsers.map(u => ({ id: u.id, name: u.name, email: u.email, role: u.role, status: u.status })),
      stats: {
        productsCount: shopProducts.length,
        invoicesCount: shopSales.length,
        totalRevenue,
        totalUdhaar,
        inventoryValuation,
        customersCount: shopCustomers.length
      },
      recentSales: shopSales.slice(0, 5),
      activityLogs: shopLogs.slice(0, 10)
    };
  }

  setShopStatus(shopId, status, reason = '', actor = { id: 'admin', email: 'admin@vyaparmitra.ai' }) {
    const shop = this.getShop(shopId);
    if (!shop) return null;

    const oldStatus = shop.status;
    shop.status = status;

    if (status === 'suspended') {
      shop.suspended_at = new Date().toISOString();
      shop.suspension_reason = reason || 'Administrative suspension review';
    } else if (status === 'active') {
      shop.suspended_at = null;
      shop.suspension_reason = null;
    }

    this.logActivity({
      eventType: status === 'suspended' ? 'SHOP_SUSPENDED' : (status === 'active' ? 'SHOP_ACTIVATED' : 'SHOP_DEACTIVATED'),
      entityType: 'shop',
      entityId: shopId,
      shop_id: shopId,
      actor_id: actor.id,
      actor_email: actor.email,
      description: `Shop "${shop.name}" status changed from ${oldStatus} to ${status}.${reason ? ` Reason: ${reason}` : ''}`,
      metadata: { previousStatus: oldStatus, newStatus: status, reason }
    });

    return shop;
  }

  getAllUsersDetailed({ search = '', role = 'ALL', status = 'ALL' } = {}) {
    let result = this.users.map(u => {
      const shop = this.getShop(u.shop_id);
      return {
        id: u.id,
        name: u.name,
        email: u.email,
        phone: u.phone,
        role: u.role,
        is_superadmin: Boolean(u.is_superadmin),
        status: u.status || 'active',
        shop_id: u.shop_id,
        shop_name: shop ? shop.name : (u.is_superadmin ? 'Platform Operations' : 'Unassigned'),
        created_at: u.created_at,
        last_login_at: u.last_login_at || u.created_at
      };
    });

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(u =>
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        (u.phone && u.phone.includes(q)) ||
        u.shop_name.toLowerCase().includes(q)
      );
    }

    if (role !== 'ALL') {
      result = result.filter(u => u.role.toLowerCase() === role.toLowerCase());
    }

    if (status !== 'ALL') {
      result = result.filter(u => u.status.toLowerCase() === status.toLowerCase());
    }

    return result;
  }

  setUserStatus(userId, status, actor = { id: 'admin', email: 'admin@vyaparmitra.ai' }) {
    const user = this.getUserById(userId);
    if (!user) return null;

    if (user.role === 'super_admin') {
      throw new Error('Platform Super Admin status cannot be altered.');
    }

    const oldStatus = user.status;
    user.status = status;

    this.logActivity({
      eventType: status === 'active' ? 'USER_ACTIVATED' : 'USER_DEACTIVATED',
      entityType: 'user',
      entityId: userId,
      shop_id: user.shop_id,
      actor_id: actor.id,
      actor_email: actor.email,
      description: `User "${user.name}" (${user.email}) status changed from ${oldStatus} to ${status}.`,
      metadata: { previousStatus: oldStatus, newStatus: status }
    });

    return user;
  }

  getSubscriptionsOverview() {
    const tenantShops = this.shops.filter(s => s.id !== 'shop-platform');
    const plansSummary = this.subscriptionPlans.map(plan => {
      const matchingShops = tenantShops.filter(s => s.subscription_plan_id === plan.id || s.subscription_plan_name?.toLowerCase().includes(plan.name.toLowerCase().split(' ')[0]));
      const activeCount = matchingShops.filter(s => s.status === 'active').length;
      const mrrGenerated = activeCount * plan.price;

      return {
        ...plan,
        shopsCount: matchingShops.length,
        activeCount,
        mrrGenerated,
        shopsList: matchingShops.map(s => ({ id: s.id, name: s.name, city: s.city, status: s.status, renewal: "2027-01-15" }))
      };
    });

    const totalMRR = plansSummary.reduce((sum, p) => sum + p.mrrGenerated, 0);

    return {
      plans: plansSummary,
      totalMRR,
      totalActiveSubscriptions: tenantShops.filter(s => s.status === 'active').length,
      expiredCount: tenantShops.filter(s => s.status === 'suspended').length
    };
  }

  getPlatformAnalytics() {
    const tenantSales = this.sales.filter(s => s.shop_id !== 'shop-platform');
    const tenantShops = this.shops.filter(s => s.id !== 'shop-platform');
    const tenantUsers = this.users.filter(u => u.role !== 'super_admin');

    // Registration timeline
    const monthlyRegistrations = [
      { month: 'Jun', count: 1 },
      { month: 'Jul', count: 1 },
      { month: 'Aug', count: 0 },
      { month: 'Sep', count: 1 },
      { month: 'Oct', count: 1 },
      { month: 'Nov', count: tenantShops.length - 4 > 0 ? tenantShops.length - 4 : 1 }
    ];

    // Platform invoice & GMV volume distribution
    const salesTimeline = [
      { day: 'Nov 01', volume: 6450, invoices: 8 },
      { day: 'Nov 02', volume: 7890, invoices: 9 },
      { day: 'Nov 03', volume: 9420, invoices: 12 },
      { day: 'Nov 04', volume: 11650, invoices: 14 },
      { day: 'Nov 05', volume: 8980, invoices: 11 },
      { day: 'Nov 06', volume: 12540, invoices: 16 }
    ];

    // Module usage distribution
    const moduleUsage = [
      { module: 'POS Billing', percentage: 42, activeUsers: 18 },
      { module: 'Inventory Management', percentage: 24, activeUsers: 14 },
      { module: 'Udhaar Khata Ledger', percentage: 16, activeUsers: 12 },
      { module: 'AI Assistant', percentage: 11, activeUsers: 9 },
      { module: 'Suppliers & POs', percentage: 7, activeUsers: 6 }
    ];

    // Category sales distribution
    const totalGMV = tenantSales.reduce((sum, s) => sum + Number(s.total_amount || 0), 0);
    const categoryBreakdown = [
      { name: 'Groceries & Staples', share: 42, gmv: Math.round(totalGMV * 0.42) },
      { name: 'Dairy & Beverages', share: 26, gmv: Math.round(totalGMV * 0.26) },
      { name: 'Packaged Foods & Snacks', share: 18, gmv: Math.round(totalGMV * 0.18) },
      { name: 'Personal & Home Care', share: 14, gmv: Math.round(totalGMV * 0.14) }
    ];

    return {
      monthlyRegistrations,
      salesTimeline,
      moduleUsage,
      categoryBreakdown,
      totalShops: tenantShops.length,
      totalUsers: tenantUsers.length,
      totalInvoices: tenantSales.length,
      totalGMV
    };
  }

  getActivityLogs(arg1 = 100, arg2 = 'ALL') {
    let limit = 100;
    let filterType = 'ALL';
    let shopId = null;

    if (typeof arg1 === 'object' && arg1 !== null) {
      limit = Number(arg1.limit || 100);
      filterType = arg1.eventType || arg1.filterType || 'ALL';
      shopId = arg1.shopId || arg1.shop_id || null;
    } else {
      limit = Number(arg1 || 100);
      filterType = arg2 || 'ALL';
    }

    let logs = this.activityLogs;
    if (filterType && filterType !== 'ALL') {
      logs = logs.filter(l => l.event_type === filterType);
    }
    if (shopId) {
      logs = logs.filter(l => l.shop_id === shopId);
    }
    return logs.slice(0, limit);
  }

  getPlatformSettings() {
    return this.platformSettings;
  }

  updatePlatformSettings(updates, actor = { id: 'admin', email: 'admin@vyaparmitra.ai' }) {
    this.platformSettings = { ...this.platformSettings, ...updates };
    this.logActivity({
      eventType: 'PLATFORM_SETTINGS_UPDATED',
      entityType: 'system',
      entityId: 'settings',
      shop_id: null,
      actor_id: actor.id,
      actor_email: actor.email,
      description: `Platform global configuration settings updated by ${actor.email}.`,
      metadata: updates
    });
    return this.platformSettings;
  }
}

export const dbStore = new MultiTenantDataStore();
