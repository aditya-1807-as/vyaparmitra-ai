-- ============================================================================
-- MIGRATION: 002_super_admin_and_platform.sql
-- Platform Control Plane, Super Admin Privileges, Shop Suspension & Audit Logs
-- ============================================================================

-- 1. Extend Users table for Platform Roles and Super Admin privileges
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_superadmin BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS status VARCHAR(30) DEFAULT 'active';
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMP WITH TIME ZONE;

-- 2. Extend Shops table with Suspension controls, subscription metadata and status
ALTER TABLE shops ADD COLUMN IF NOT EXISTS status VARCHAR(30) DEFAULT 'active';
ALTER TABLE shops ADD COLUMN IF NOT EXISTS suspended_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE shops ADD COLUMN IF NOT EXISTS suspension_reason TEXT;
ALTER TABLE shops ADD COLUMN IF NOT EXISTS subscription_plan_id VARCHAR(50) DEFAULT 'plan-growth';
ALTER TABLE shops ADD COLUMN IF NOT EXISTS subscription_status VARCHAR(30) DEFAULT 'active';
ALTER TABLE shops ADD COLUMN IF NOT EXISTS subscription_renewal_date DATE DEFAULT (CURRENT_DATE + INTERVAL '1 year');

-- 3. Activity and Administrative Audit Logs Table
CREATE TABLE IF NOT EXISTS activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_type VARCHAR(100) NOT NULL, -- 'SHOP_REGISTERED', 'SHOP_SUSPENDED', 'SHOP_ACTIVATED', 'USER_LOGIN', 'ADMIN_ACTION'
    entity_type VARCHAR(50) NOT NULL,  -- 'shop', 'user', 'system'
    entity_id VARCHAR(100) NOT NULL,
    shop_id VARCHAR(100),
    actor_id VARCHAR(100),
    actor_email VARCHAR(255),
    description TEXT NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    ip_address VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Subscription Plans Table
CREATE TABLE IF NOT EXISTS subscription_plans (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    price_inr NUMERIC(10,2) NOT NULL,
    billing_period VARCHAR(20) DEFAULT 'monthly',
    max_products INT DEFAULT 1000,
    max_employees INT DEFAULT 5,
    features JSONB DEFAULT '[]'::jsonb,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Indexes for fast aggregation and Super Admin queries
CREATE INDEX IF NOT EXISTS idx_activity_logs_created ON activity_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_activity_logs_event ON activity_logs(event_type);
CREATE INDEX IF NOT EXISTS idx_shops_status ON shops(status);
CREATE INDEX IF NOT EXISTS idx_users_superadmin ON users(is_superadmin);
