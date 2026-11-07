-- ============================================================================
-- VYAPARMITRA AI - POSTGRESQL SEED SCRIPT
-- Populates the database with realistic Indian retail demo store data
-- ============================================================================

-- 1. SUBSCRIPTION PLANS
INSERT INTO subscription_plans (id, name, price_inr, billing_period, max_shops, max_employees, max_products)
VALUES
('plan-starter', 'Starter Plan', 499.00, 'monthly', 1, 2, 200),
('plan-growth', 'Growth Plan', 999.00, 'monthly', 1, 5, 1000),
('plan-pro', 'Pro Enterprise', 1999.00, 'monthly', 3, 15, 5000)
ON CONFLICT (id) DO NOTHING;

-- 2. USERS
INSERT INTO users (id, email, password_hash, full_name, phone, is_superadmin)
VALUES
('a0000000-0000-0000-0000-000000000001', 'ramesh@lakshmikirana.in', '$2a$10$demoHashForOwner123456789012345678', 'Ramesh Kumar', '+91 98450 82134', true),
('a0000000-0000-0000-0000-000000000002', 'priya@lakshmikirana.in', '$2a$10$demoHashForManager123456789012345', 'Priya Sharma', '+91 98452 77190', false),
('a0000000-0000-0000-0000-000000000003', 'suresh@lakshmikirana.in', '$2a$10$demoHashForCashier123456789012345', 'Suresh Patel', '+91 98456 12345', false),
('a0000000-0000-0000-0000-000000000004', 'vikas@lakshmikirana.in', '$2a$10$demoHashForInventory1234567890123', 'Vikas Verma', '+91 98459 99882', false)
ON CONFLICT (email) DO NOTHING;

-- 3. SHOP
INSERT INTO shops (id, owner_id, name, tagline, business_type, gstin, phone, email, address, city, state, pincode, subscription_plan_id)
VALUES
('b0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'Lakshmi Kirana & General Store', 'Smart Business. Simple Growth.', 'Kirana & Retail Superstore', '29AABCU9603R1ZM', '+91 98450 82134', 'support@lakshmikirana.in', 'Shop #14, Main Market Road, Indiranagar', 'Bengaluru', 'Karnataka', '560038', 'plan-pro')
ON CONFLICT (id) DO NOTHING;

-- 4. ROLES & SHOP MEMBERS
INSERT INTO roles (id, name, description)
VALUES
('Owner', 'Shop Owner', 'Full unrestricted ownership privileges'),
('Manager', 'Store Manager', 'Operational oversight, purchases, catalog & analytics'),
('Cashier', 'POS Cashier', 'Point of sale counter billing and receipt generation'),
('Inventory Manager', 'Inventory Specialist', 'Stock replenishment, audit movements, and suppliers')
ON CONFLICT (id) DO NOTHING;

INSERT INTO shop_members (shop_id, user_id, role_id)
VALUES
('b0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'Owner'),
('b0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000002', 'Manager'),
('b0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000003', 'Cashier'),
('b0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000004', 'Inventory Manager')
ON CONFLICT (shop_id, user_id) DO NOTHING;

-- 5. CATEGORIES
INSERT INTO categories (id, shop_id, name, description)
VALUES
('c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'Flours & Grains', 'Atta, Basmati Rice, Dals, Pulses, Sooji'),
('c0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000001', 'Edible Oils & Ghee', 'Mustard oil, Sunflower oil, Desi Ghee'),
('c0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000001', 'Spices & Condiments', 'Whole and powdered spices, Salt, Sugar'),
('c0000000-0000-0000-0000-000000000004', 'b0000000-0000-0000-0000-000000000001', 'Beverages & Tea', 'Premium Tea, Coffee, Health Drinks'),
('c0000000-0000-0000-0000-000000000005', 'b0000000-0000-0000-0000-000000000001', 'Snacks & Biscuits', 'Biscuits, Namkeen, Noodles, Chips'),
('c0000000-0000-0000-0000-000000000006', 'b0000000-0000-0000-0000-000000000001', 'Household & Cleaning', 'Detergent, Dishwash, Floor Cleaner'),
('c0000000-0000-0000-0000-000000000007', 'b0000000-0000-0000-0000-000000000001', 'Personal Care & Hygiene', 'Soaps, Shampoos, Toothpaste, Sanitizers'),
('c0000000-0000-0000-0000-000000000008', 'b0000000-0000-0000-0000-000000000001', 'Dairy & Breakfast', 'Butter, Paneer, Cereals, Oats')
ON CONFLICT (id) DO NOTHING;

-- 6. PRODUCTS
INSERT INTO products (id, shop_id, category_id, name, sku, barcode, unit, purchase_price, selling_price, stock_quantity, reorder_level)
VALUES
('d0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000001', 'India Gate Basmati Rice 5kg', 'BGR-5KG-01', '8901262010112', 'bag', 480.00, 590.00, 42.00, 15.00),
('d0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000001', 'Aashirvaad Sharbati Atta 10kg', 'AAS-WHT-10K', '8901030383786', 'bag', 420.00, 495.00, 35.00, 12.00),
('d0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000001', 'Tata Sampann Toor Dal 1kg', 'TRD-1KG-03', '8904043900224', 'packet', 145.00, 175.00, 50.00, 20.00),
('d0000000-0000-0000-0000-000000000004', 'b0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000001', 'Tata Sampann Moong Dal 1kg', 'MNG-1KG-04', '8904043900331', 'packet', 130.00, 158.00, 8.00, 15.00),
('d0000000-0000-0000-0000-000000000005', 'b0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000001', 'Madhur Pure Sugar 1kg', 'SGR-1KG-05', '8906007280014', 'packet', 44.00, 52.00, 85.00, 30.00),
('d0000000-0000-0000-0000-000000000006', 'b0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000002', 'Fortune Sunflower Oil 1L', 'FRT-SFL-1L', '8906007280083', 'pouch', 118.00, 138.00, 60.00, 20.00),
('d0000000-0000-0000-0000-000000000007', 'b0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000002', 'Amul Pure Cow Ghee 1L', 'AML-GHE-1L', '8901262030335', 'tin', 575.00, 660.00, 18.00, 10.00),
('d0000000-0000-0000-0000-000000000008', 'b0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000004', 'Tata Tea Gold 500g', 'TTG-500G-15', '8901030394850', 'packet', 280.00, 340.00, 24.00, 10.00)
ON CONFLICT (id) DO NOTHING;

-- 7. CUSTOMERS
INSERT INTO customers (id, shop_id, name, phone, address, credit_limit)
VALUES
('e0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'Rajesh Mehta', '+91 98450 11223', 'Flat 204, Shanti Niketan Apts, Indiranagar', 15000.00),
('e0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000001', 'Ananya Gupta', '+91 98451 22334', 'House #58, 4th Cross, HAL 2nd Stage', 10000.00),
('e0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000001', 'Vikram Singh (Singh Caterers)', '+91 98452 33445', 'No. 88, 100 Feet Road, Indiranagar', 35000.00)
ON CONFLICT (id) DO NOTHING;

-- 8. SUPPLIERS
INSERT INTO suppliers (id, shop_id, name, contact_person, phone, email, address, gstin)
VALUES
('f0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'ITC Wholesale Super Distributors', 'Manoj Agarwal', '+91 98440 12098', 'manoj@itcwholesaleblr.com', 'Plot 42, Peenya Industrial Area, Bengaluru', '29AAACI1681G1Z0'),
('f0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000001', 'Hindustan Unilever Depot - North Depot', 'Sanjay Hegde', '+91 98441 55678', 'orders@huldepot.co.in', 'Warehouse 12, Yeshwantpur APMC Yard, Bengaluru', '29AAACH1245P1Z8')
ON CONFLICT (id) DO NOTHING;

