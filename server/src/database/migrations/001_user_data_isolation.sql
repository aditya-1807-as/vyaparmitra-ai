-- ============================================================================
-- MIGRATION: 001_user_data_isolation.sql
-- Enforces User-Level Data Isolation & Tenant Boundaries
-- ============================================================================

-- 1. Ensure user_id column exists on all tenant-owned business tables
ALTER TABLE products ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES users(id) ON DELETE SET NULL;
ALTER TABLE sales ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES users(id) ON DELETE SET NULL;
ALTER TABLE customers ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES users(id) ON DELETE SET NULL;
ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES users(id) ON DELETE SET NULL;
ALTER TABLE purchases ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES users(id) ON DELETE SET NULL;
ALTER TABLE expenses ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES users(id) ON DELETE SET NULL;
ALTER TABLE categories ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES users(id) ON DELETE SET NULL;

-- 2. Create Composite Indexes for high-speed tenant-scoped lookups
CREATE INDEX IF NOT EXISTS idx_products_tenant ON products(shop_id, user_id);
CREATE INDEX IF NOT EXISTS idx_sales_tenant ON sales(shop_id, user_id, sale_date DESC);
CREATE INDEX IF NOT EXISTS idx_customers_tenant ON customers(shop_id, user_id);
CREATE INDEX IF NOT EXISTS idx_suppliers_tenant ON suppliers(shop_id, user_id);
CREATE INDEX IF NOT EXISTS idx_purchases_tenant ON purchases(shop_id, user_id, purchase_date DESC);
CREATE INDEX IF NOT EXISTS idx_expenses_tenant ON expenses(shop_id, user_id, expense_date DESC);
CREATE INDEX IF NOT EXISTS idx_stock_movements_tenant ON stock_movements(shop_id, product_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_udhaar_transactions_tenant ON customer_transactions(shop_id, customer_id, created_at DESC);

-- 3. Row-Level Security (RLS) Policy Blueprint for PostgreSQL
-- When using PostgreSQL with app tenant session variable: SET LOCAL app.current_shop_id = '<shop_id>'
/*
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
CREATE POLICY products_tenant_isolation_policy ON products
    FOR ALL
    USING (shop_id = current_setting('app.current_shop_id', true)::uuid);

ALTER TABLE sales ENABLE ROW LEVEL SECURITY;
CREATE POLICY sales_tenant_isolation_policy ON sales
    FOR ALL
    USING (shop_id = current_setting('app.current_shop_id', true)::uuid);

ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
CREATE POLICY customers_tenant_isolation_policy ON customers
    FOR ALL
    USING (shop_id = current_setting('app.current_shop_id', true)::uuid);
*/
