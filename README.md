# VyaparMitra AI — Smart Business Management Platform for Small Shops

> **Tagline:** Smart Business. Simple Growth.  
> **Brand Identity:** Dark Theme SaaS with Forest Green (`#1F3D2B`, 60%), Sand Beige (`#E8DCC4`, 30%), and Electric Purple (`#8B5CF6`, 10%).  
> **Architecture:** Full-stack Multi-Tenant Cloud Architecture with User Data Isolation and Local Autonomous Persistence.

---

## 1. Overview & Architecture

**VyaparMitra AI** is a production-grade, full-stack SaaS platform designed for Indian Kirana stores, grocery supermarkets, FMCG retailers, and small shopkeepers. The platform unifies point-of-sale billing, inventory velocity tracking, customer Udhaar (digital Khata), wholesale purchase orders, and AI business intelligence into a cohesive dashboard.

### Core Architecture
- **Frontend (`/client`):** React 18, Vite, Tailwind CSS, Lucide React, Recharts, React Router DOM.
- **Backend (`/server`):** Node.js, Express.js REST API layer, JWT authentication, tenant-scoped controllers.
- **Database & Persistence (`/server/src/database`):**
  - PostgreSQL relational schema (`schema.sql` and `seed.sql`) with tenant isolation (`shop_id`).
  - Migration script: `001_user_data_isolation.sql` with composite tenant indexes and PostgreSQL Row-Level Security (RLS) policies.
  - Multi-tenant in-memory data store with atomic ownership verification and isolated collections per `shop_id`.
- **AI Engine (`/server/src/modules/ai`):** Google Gemini 1.5 Flash API integration with automatic fallback to a domain-specific analytical business reasoning engine operating strictly on the authenticated user's isolated workspace metrics.

---

## 2. Dark Theme SaaS Design System

The application is styled with a modern, high-contrast dark theme engineered for retail environments:
- **Main Background (`#0C140E`):** Deep charcoal with a subtle forest green undertone.
- **Sidebar & Primary Elements (`#0E1B13`, `#142319`):** Dark forest green container surfaces.
- **Card Surfaces (`#142319`, `#18291E`):** Lighter dark-green cards with subtle rounded borders (`#243D2D`).
- **Primary Action Buttons (`bg-forest-700`):** Rich Forest Green with `#F5EFE6` contrast text and `#2D4B38` borders.
- **Accent Elements & AI Assistant (`#8B5CF6`):** Electric Purple for AI insights, active tabs, and primary action glows.
- **Typography:** Sand Beige (`#E8DCC4`, `#F5EFE6`) for headings; muted beige/slate (`#9EAEA3`, `#94A3B8`) for secondary labels.
- **Print Optimization:** The on-screen invoice modal is styled in dark theme, while `@media print` automatically strips dark backgrounds, outputting high-contrast pure white for A4 and 58mm/80mm thermal receipt printers.

---

## 3. Strict User-Level Data Isolation (Multi-Tenancy)

Every registered user has an independent business workspace and dataset. Data belonging to User A is never exposed to User B:

### Verified Isolation Guarantees:
1. **Server-Derived Identity:** All API endpoints decode identity from verified JWT bearer tokens (`req.user.id`, `req.shopId`).
2. **Zero Trust for Frontend IDs:** Ownership checks are enforced on every read, write, update, and delete operation. Attempting to update or delete another user's product or customer returns `404 Not Found` or `403 Forbidden`.
3. **Isolated Demo Provisioning:** When a new user registers (`POST /api/auth/register`), an independent workspace is initialized with unique sample records without duplicating on subsequent logins.
4. **AI Assistant Scoping:** The AI business assistant calculates metrics and generates advice using *only* the authenticated user's records. Prompts and retrieval never include cross-tenant data.
5. **Client-Side Partitioning:** Frontend localStorage caching is partitioned by user ID (`vyaparmitra_workspace_${user.id}`), preventing cache bleed upon workspace switching.

### Pre-Seeded Demonstration Users:
- **User A (Ramesh Kumar):**
  - **Email:** `ramesh@lakshmikirana.in`
  - **Shop:** Lakshmi Kirana & General Store (Bengaluru, Karnataka)
  - **Data:** 28 FMCG products, 15 customers, 5 suppliers, 20 completed invoices, ₹38,500 pending Udhaar.
- **User B (Anita Deshmukh):**
  - **Email:** `anita@anitaretail.in`
  - **Shop:** Anita Supermart (Hyderabad, Telangana)
  - **Data:** 6 FMCG products, 2 customers, 2 suppliers, 1 sales invoice, ₹2,400 pending Udhaar.

Use the **"Switch Workspace"** button in the top navigation bar to test switching between User A, User B, or registering an entirely new user with independent demo data.

---

## 4. All 8 Business Modules Implemented

1. **Dashboard & Executive Overview:**
   - Real-time KPI cards: Total Sales, Total Orders, Gross Profit, Total Products, Low Stock Count, Outstanding Udhaar.
   - Interactive Recharts daily sales & profit trend area charts with dark theme glow.
   - Top velocity products by units and revenue.
   - Critical low-stock alerts and recent transactions table with one-click invoice view.
   - Date range selector (Today, 7 Days, 30 Days, This Month, All Time).

2. **Smart Inventory Management:**
   - Product catalog with live search (Name, SKU, Barcode), category filters, and stock level filters (In Stock, Low Stock, Out of Stock).
   - Add/Edit/Delete products with instant reorder point alerts and safety stock triggers.
   - Product detail inspection modal showing margin calculations and supplier lead time formulas.
   - Categories management with per-category valuation and product counts.
   - Immutable stock movements audit trail (Purchases, POS Sales, Adjustments).

3. **Point of Sale (POS) & Counter Billing:**
   - High-speed retail POS checkout terminal with barcode and SKU search.
   - Real-time cart calculations: automatic subtotal, customizable discount (₹), GST tax, and grand total.
   - Multi-mode tender support: **UPI / QR**, **Cash**, **Card**, and **Udhaar (Credit)**.
   - Instant printable original tax invoice with shop details, customer info, itemized table, and WhatsApp sharing.
   - Complete sales history view with printable receipts and real CSV export.

4. **Customer & Digital Udhaar Ledger:**
   - Customer directory with lifetime purchase totals, phone directory, and credit limits.
   - Customer Udhaar Khata ledger displaying previous balance, debits, credits, and running balance.
   - "Record Payment" workflow with partial/full settlement support and immediate balance adjustment.

5. **Suppliers & Purchase Management:**
   - Wholesaler and distributor directory (ITC, HUL, Fortune Agro, Tata Consumer, Amul).
   - Stock replenishment purchase order (PO) workflow: select vendor, add restock items, record payment status.
   - Automatic inventory incrementation on purchase completion and supplier balance due tracking.

6. **VyaparMitra AI Assistant (Signature Electric Purple Feature):**
   - Conversational retail business advisor styled with `#8B5CF6`.
   - Pre-configured prompt shortcuts for small retailers:
     - *"What were my total sales this month?"*
     - *"Which products are selling the fastest?"*
     - *"Which products need restocking?"*
     - *"Who are my customers with the highest outstanding credit?"*
     - *"What is my gross profit this week?"*
     - *"Compare this month's sales with last month."*
     - *"Suggest ways to improve business performance."*
   - Analyzes real live data and generates metric highlight cards and actionable business advice.

7. **Business Analytics & Financial Reports:**
   - 8 specialized financial and operational reports:
     1. Sales Report
     2. Purchase Report
     3. Gross vs Net Profit Statement (clearly distinguishing Gross Profit = Net Sales - COGS from Net Profit = Gross Profit - Operating Expenses)
     4. Inventory Valuation (Wholesale cost vs Retail potential)
     5. Product Performance & Turnover
     6. Customer Credit & Udhaar Risk Audit
     7. Supplier Outstanding Payables
     8. Operating Expense Breakdown
   - Interactive Bar and Pie charts, printable report layouts, and CSV downloads.

8. **Administration & Multi-Tenant Platform Super Admin:**
   - Store settings: Name, Address, GSTIN, Receipt footer notes, and Invoice prefix.
   - Staff member management with Role-Based Access Control (RBAC): Owner, Manager, Cashier, Inventory Manager.
   - Interactive RBAC matrix table displaying exact permissions per role.
   - Platform Super Admin view for SaaS platform administrators displaying total registered shops across India, subscription plans, and platform MRR.

---

## 5. Financial Logic & Mathematical Formulas

- **Gross Profit:** `Gross Profit = Net Sales - Cost of Goods Sold (COGS)`
- **Gross Profit Margin:** `Gross Margin (%) = (Gross Profit / Net Sales) × 100`
- **Net Operating Profit:** `Net Profit = Gross Profit - Operating Expenses`
- **Customer Outstanding Udhaar:** `Total Credit Charges - Total Credit Payments Received`
- **Reorder Point:** `Reorder Point = (Average Daily Sales × Supplier Lead Time) + Safety Stock Buffer`
- **Inventory Valuation:** `Total Inventory Value = Sum of (Available Quantity × Unit Wholesale Cost)`

---

## 6. Automated Verification Test Suites

### Multi-Tenant Isolation Test Suite (`server/src/utils/isolation.test.js`)
Executes 19 assertions verifying complete separation between User A, User B, and newly registered User C:
```bash
node server/src/utils/isolation.test.js
```
*Result: 19 passed, 0 failed.*

### Mathematical Calculations Test Suite (`server/src/utils/calculations.test.js`)
Executes 7 financial calculation assertions verifying COGS, Gross Profit, Net Profit, Udhaar reconciliations, and INR formatting:
```bash
node server/src/utils/calculations.test.js
```
*Result: 7 passed, 0 failed.*

---

## 7. Getting Started Locally

### Prerequisites
- Node.js (v18+, v20+, or v24+)
- npm (v9+)

### Installation
Run the following in the project root:
```bash
npm install
cd server && npm install
cd ../client && npm install
cd ..
```

### Running the Full Application
Start both backend API server and frontend client concurrently:
```bash
npm start
# OR: npm run dev
```

- **Frontend Client:** http://localhost:5173
- **Backend API Server:** http://localhost:5000
- **API Health Check:** http://localhost:5000/api/health
