/**
 * VyaparMitra AI - Realistic Indian Retail Demo Dataset
 * Includes authentic grocery & FMCG items, suppliers, customers, and transactions.
 */

export const initialShop = {
  id: "shop-001",
  name: "Lakshmi Kirana & General Store",
  tagline: "Smart Business. Simple Growth.",
  business_type: "Kirana & Retail Superstore",
  owner_id: "user-owner-001",
  gstin: "29AABCU9603R1ZM",
  phone: "+91 98450 82134",
  email: "support@lakshmikirana.in",
  address: "Shop #14, Main Market Road, Indiranagar",
  city: "Bengaluru",
  state: "Karnataka",
  pincode: "560038",
  currency: "INR",
  currency_symbol: "₹",
  invoice_prefix: "VM-LK-",
  receipt_footer_note: "Thank you for shopping with us! Please check items before leaving.",
  subscription_plan_id: "plan-pro",
  subscription_status: "active"
};

export const initialEmployees = [
  {
    id: "user-owner-001",
    name: "Ramesh Kumar",
    email: "ramesh@lakshmikirana.in",
    phone: "+91 98450 82134",
    role: "Owner",
    status: "active",
    joined_at: "2024-01-15",
    permissions: ["all"]
  },
  {
    id: "user-mgr-002",
    name: "Priya Sharma",
    email: "priya@lakshmikirana.in",
    phone: "+91 98452 77190",
    role: "Manager",
    status: "active",
    joined_at: "2024-03-01",
    permissions: ["pos", "inventory", "customers", "suppliers", "reports"]
  },
  {
    id: "user-cashier-003",
    name: "Suresh Patel",
    email: "suresh@lakshmikirana.in",
    phone: "+91 98456 12345",
    role: "Cashier",
    status: "active",
    joined_at: "2024-06-10",
    permissions: ["pos", "invoices", "customers_read"]
  },
  {
    id: "user-inv-004",
    name: "Vikas Verma",
    email: "vikas@lakshmikirana.in",
    phone: "+91 98459 99882",
    role: "Inventory Manager",
    status: "active",
    joined_at: "2024-07-20",
    permissions: ["inventory", "suppliers", "purchases"]
  }
];

export const initialCategories = [
  { id: "cat-1", name: "Flours & Grains", description: "Atta, Rice, Pulses, Dals, Sooji", icon: "Wheat" },
  { id: "cat-2", name: "Edible Oils & Ghee", description: "Mustard oil, Sunflower oil, Desi Ghee", icon: "Droplets" },
  { id: "cat-3", name: "Spices & Condiments", description: "Whole and powdered spices, Salt, Sugar", icon: "Flame" },
  { id: "cat-4", name: "Beverages & Tea", description: "Premium Tea, Coffee, Health Drinks", icon: "Coffee" },
  { id: "cat-5", name: "Snacks & Biscuits", description: "Biscuits, Namkeen, Noodles, Chips", icon: "Cookie" },
  { id: "cat-6", name: "Household & Cleaning", description: "Detergent, Dishwash, Floor Cleaner", icon: "Sparkles" },
  { id: "cat-7", name: "Personal Care & Hygiene", description: "Soaps, Shampoos, Toothpaste, Sanitizers", icon: "HeartPulse" },
  { id: "cat-8", name: "Dairy & Breakfast", description: "Butter, Paneer, Cereals, Oats", icon: "Milk" }
];

export const initialProducts = [
  {
    id: "prod-001",
    category_id: "cat-1",
    name: "India Gate Basmati Rice (Classic) 5kg",
    sku: "BGR-5KG-01",
    barcode: "8901262010112",
    unit: "bag",
    purchase_price: 480,
    selling_price: 590,
    stock_quantity: 42,
    reorder_level: 15,
    tax_rate: 5,
    hsn_code: "100630"
  },
  {
    id: "prod-002",
    category_id: "cat-1",
    name: "Aashirvaad Sharbati Whole Wheat Atta 10kg",
    sku: "AAS-WHT-10K",
    barcode: "8901030383786",
    unit: "bag",
    purchase_price: 420,
    selling_price: 495,
    stock_quantity: 35,
    reorder_level: 12,
    tax_rate: 5,
    hsn_code: "110100"
  },
  {
    id: "prod-003",
    category_id: "cat-1",
    name: "Tata Sampann Unpolished Toor Dal 1kg",
    sku: "TRD-1KG-03",
    barcode: "8904043900224",
    unit: "packet",
    purchase_price: 145,
    selling_price: 175,
    stock_quantity: 50,
    reorder_level: 20,
    tax_rate: 0,
    hsn_code: "071320"
  },
  {
    id: "prod-004",
    category_id: "cat-1",
    name: "Tata Sampann Moong Dal Dhuli 1kg",
    sku: "MNG-1KG-04",
    barcode: "8904043900331",
    unit: "packet",
    purchase_price: 130,
    selling_price: 158,
    stock_quantity: 8, // Low Stock Alert
    reorder_level: 15,
    tax_rate: 0,
    hsn_code: "071331"
  },
  {
    id: "prod-005",
    category_id: "cat-1",
    name: "Madhur Pure & Hygienic Sugar 1kg",
    sku: "SGR-1KG-05",
    barcode: "8906007280014",
    unit: "packet",
    purchase_price: 44,
    selling_price: 52,
    stock_quantity: 85,
    reorder_level: 30,
    tax_rate: 5,
    hsn_code: "170199"
  },
  {
    id: "prod-006",
    category_id: "cat-1",
    name: "Fortune Fine Sooji (Rava) 500g",
    sku: "FRT-SOJ-500",
    barcode: "8906007283411",
    unit: "packet",
    purchase_price: 28,
    selling_price: 36,
    stock_quantity: 26,
    reorder_level: 10,
    tax_rate: 0,
    hsn_code: "110319"
  },
  {
    id: "prod-007",
    category_id: "cat-2",
    name: "Fortune Sunlite Refined Sunflower Oil 1L",
    sku: "FRT-SFL-1L",
    barcode: "8906007280083",
    unit: "pouch",
    purchase_price: 118,
    selling_price: 138,
    stock_quantity: 60,
    reorder_level: 20,
    tax_rate: 5,
    hsn_code: "151219"
  },
  {
    id: "prod-008",
    category_id: "cat-2",
    name: "Saffola Gold Pro Healthy Lifestyle Oil 1L",
    sku: "SAF-GLD-1L",
    barcode: "8901088004518",
    unit: "pouch",
    purchase_price: 155,
    selling_price: 185,
    stock_quantity: 5, // Low stock
    reorder_level: 15,
    tax_rate: 5,
    hsn_code: "151790"
  },
  {
    id: "prod-009",
    category_id: "cat-2",
    name: "Dhara Kachi Ghani Mustard Oil 1L",
    sku: "DHR-MST-1L",
    barcode: "8901262020228",
    unit: "bottle",
    purchase_price: 142,
    selling_price: 168,
    stock_quantity: 38,
    reorder_level: 15,
    tax_rate: 5,
    hsn_code: "151491"
  },
  {
    id: "prod-010",
    category_id: "cat-2",
    name: "Amul Pure Cow Ghee Tin 1L",
    sku: "AML-GHE-1L",
    barcode: "8901262030335",
    unit: "tin",
    purchase_price: 575,
    selling_price: 660,
    stock_quantity: 18,
    reorder_level: 10,
    tax_rate: 12,
    hsn_code: "040590"
  },
  {
    id: "prod-011",
    category_id: "cat-3",
    name: "Tata Salt Vacuum Evaporated Iodized 1kg",
    sku: "TAT-SLT-1K",
    barcode: "8904043900019",
    unit: "packet",
    purchase_price: 22,
    selling_price: 28,
    stock_quantity: 110,
    reorder_level: 40,
    tax_rate: 0,
    hsn_code: "250100"
  },
  {
    id: "prod-012",
    category_id: "cat-3",
    name: "MDH Deggi Mirch Powder 100g",
    sku: "MDH-DGM-100",
    barcode: "8901262040442",
    unit: "box",
    purchase_price: 68,
    selling_price: 84,
    stock_quantity: 30,
    reorder_level: 12,
    tax_rate: 5,
    hsn_code: "090422"
  },
  {
    id: "prod-013",
    category_id: "cat-3",
    name: "Everest Turmeric (Haldi) Powder 100g",
    sku: "EVR-HLD-100",
    barcode: "8901262050559",
    unit: "box",
    purchase_price: 32,
    selling_price: 42,
    stock_quantity: 45,
    reorder_level: 15,
    tax_rate: 5,
    hsn_code: "091030"
  },
  {
    id: "prod-014",
    category_id: "cat-3",
    name: "Catch Coriander (Dhaniya) Powder 100g",
    sku: "CTC-COR-100",
    barcode: "8901262060666",
    unit: "box",
    purchase_price: 34,
    selling_price: 44,
    stock_quantity: 40,
    reorder_level: 15,
    tax_rate: 5,
    hsn_code: "090922"
  },
  {
    id: "prod-015",
    category_id: "cat-4",
    name: "Tata Tea Gold Leaf Tea 500g",
    sku: "TTG-500G-15",
    barcode: "8901030394850",
    unit: "packet",
    purchase_price: 280,
    selling_price: 340,
    stock_quantity: 24,
    reorder_level: 10,
    tax_rate: 5,
    hsn_code: "090240"
  },
  {
    id: "prod-016",
    category_id: "cat-4",
    name: "Brooke Bond Red Label Tea 250g",
    sku: "BBL-250G-16",
    barcode: "8901030384110",
    unit: "box",
    purchase_price: 125,
    selling_price: 155,
    stock_quantity: 6, // Low stock
    reorder_level: 12,
    tax_rate: 5,
    hsn_code: "090240"
  },
  {
    id: "prod-017",
    category_id: "cat-4",
    name: "Nescafe Classic Instant Coffee Jar 100g",
    sku: "NSC-CLS-100",
    barcode: "8901058852387",
    unit: "jar",
    purchase_price: 260,
    selling_price: 315,
    stock_quantity: 22,
    reorder_level: 8,
    tax_rate: 18,
    hsn_code: "210111"
  },
  {
    id: "prod-018",
    category_id: "cat-5",
    name: "Parle-G Gold Glucose Biscuits 250g",
    sku: "PRL-GLD-250",
    barcode: "8901719114704",
    unit: "packet",
    purchase_price: 24,
    selling_price: 30,
    stock_quantity: 75,
    reorder_level: 25,
    tax_rate: 18,
    hsn_code: "190531"
  },
  {
    id: "prod-019",
    category_id: "cat-5",
    name: "Britannia Good Day Cashew Cookies 200g",
    sku: "BRT-GDC-200",
    barcode: "8901063012431",
    unit: "packet",
    purchase_price: 38,
    selling_price: 50,
    stock_quantity: 48,
    reorder_level: 20,
    tax_rate: 18,
    hsn_code: "190531"
  },
  {
    id: "prod-020",
    category_id: "cat-5",
    name: "Haldiram Nagpur Aloo Bhujia 400g",
    sku: "HLD-BHJ-400",
    barcode: "8904004400763",
    unit: "packet",
    purchase_price: 95,
    selling_price: 120,
    stock_quantity: 32,
    reorder_level: 15,
    tax_rate: 12,
    hsn_code: "210690"
  },
  {
    id: "prod-021",
    category_id: "cat-5",
    name: "Maggi 2-Minute Masala Noodles 280g (Pack of 4)",
    sku: "MGG-4PK-280",
    barcode: "8901058862140",
    unit: "pack",
    purchase_price: 52,
    selling_price: 64,
    stock_quantity: 65,
    reorder_level: 20,
    tax_rate: 18,
    hsn_code: "190230"
  },
  {
    id: "prod-022",
    category_id: "cat-6",
    name: "Surf Excel Easy Wash Detergent Powder 1kg",
    sku: "SRF-EZW-1K",
    barcode: "8901030691232",
    unit: "pouch",
    purchase_price: 128,
    selling_price: 155,
    stock_quantity: 28,
    reorder_level: 12,
    tax_rate: 18,
    hsn_code: "340220"
  },
  {
    id: "prod-023",
    category_id: "cat-6",
    name: "Vim Dishwash Bar with Lemon 300g",
    sku: "VIM-BAR-300",
    barcode: "8901030722219",
    unit: "bar",
    purchase_price: 24,
    selling_price: 32,
    stock_quantity: 90,
    reorder_level: 30,
    tax_rate: 18,
    hsn_code: "340119"
  },
  {
    id: "prod-024",
    category_id: "cat-6",
    name: "Lizol Disinfectant Surface Cleaner Citrus 500ml",
    sku: "LZL-CTR-500",
    barcode: "8901396123456",
    unit: "bottle",
    purchase_price: 98,
    selling_price: 124,
    stock_quantity: 20,
    reorder_level: 8,
    tax_rate: 18,
    hsn_code: "380894"
  },
  {
    id: "prod-025",
    category_id: "cat-7",
    name: "Dettol Antiseptic Disinfectant Liquid 250ml",
    sku: "DTL-LIQ-250",
    barcode: "8901396345678",
    unit: "bottle",
    purchase_price: 140,
    selling_price: 168,
    stock_quantity: 19,
    reorder_level: 8,
    tax_rate: 12,
    hsn_code: "300490"
  },
  {
    id: "prod-026",
    category_id: "cat-7",
    name: "Dove Cream Beauty Bathing Soap Bar 100g (Buy 3 Get 1)",
    sku: "DOV-SOAP-4X",
    barcode: "8901030889912",
    unit: "pack",
    purchase_price: 185,
    selling_price: 230,
    stock_quantity: 14,
    reorder_level: 8,
    tax_rate: 18,
    hsn_code: "340111"
  },
  {
    id: "prod-027",
    category_id: "cat-7",
    name: "Colgate MaxFresh Red Gel Toothpaste 150g",
    sku: "CLG-MXF-150",
    barcode: "8901314512019",
    unit: "tube",
    purchase_price: 92,
    selling_price: 115,
    stock_quantity: 36,
    reorder_level: 15,
    tax_rate: 18,
    hsn_code: "330610"
  },
  {
    id: "prod-028",
    category_id: "cat-8",
    name: "Kellogg's Corn Flakes Original 475g",
    sku: "KLG-CRN-475",
    barcode: "8901499008212",
    unit: "box",
    purchase_price: 180,
    selling_price: 220,
    stock_quantity: 3, // Out of stock warning soon
    reorder_level: 10,
    tax_rate: 18,
    hsn_code: "190410"
  }
];

export const initialSuppliers = [
  {
    id: "sup-001",
    name: "ITC Wholesale Super Distributors",
    contact_person: "Manoj Agarwal",
    phone: "+91 98440 12098",
    email: "manoj@itcwholesaleblr.com",
    address: "Plot 42, Peenya Industrial Area, Bengaluru",
    gstin: "29AAACI1681G1Z0",
    balance_due: 14200,
    lead_time_days: 2
  },
  {
    id: "sup-002",
    name: "Hindustan Unilever Depot - North Depot",
    contact_person: "Sanjay Hegde",
    phone: "+91 98441 55678",
    email: "orders@huldepot.co.in",
    address: "Warehouse 12, Yeshwantpur APMC Yard, Bengaluru",
    gstin: "29AAACH1245P1Z8",
    balance_due: 8500,
    lead_time_days: 3
  },
  {
    id: "sup-003",
    name: "Fortune Agro Traders Pvt Ltd",
    contact_person: "Vipul Patel",
    phone: "+91 98442 99012",
    email: "vipul@fortuneagro.in",
    address: "APMC Grain Market, Outer Ring Road, Bengaluru",
    gstin: "29AABCF3321N1ZM",
    balance_due: 22400,
    lead_time_days: 3
  },
  {
    id: "sup-004",
    name: "Tata Consumer Direct Logistics",
    contact_person: "Raveesh Sen",
    phone: "+91 98443 77432",
    email: "b2b@tataconsumerblr.in",
    address: "B-8, Whitefield Trade Park, Bengaluru",
    gstin: "29AAACT9876Q1Z4",
    balance_due: 0,
    lead_time_days: 2
  },
  {
    id: "sup-005",
    name: "Amul Federation & Dairy Wholesalers",
    contact_person: "Harish Gowda",
    phone: "+91 98444 33119",
    email: "dairyb2b@amulblr.com",
    address: "Dairy Circle, Bannerghatta Road, Bengaluru",
    gstin: "29AAACA5544K1ZF",
    balance_due: 6200,
    lead_time_days: 1
  }
];

export const initialCustomers = [
  {
    id: "cust-001",
    name: "Rajesh Mehta",
    phone: "+91 98450 11223",
    email: "rajesh.mehta@gmail.com",
    address: "Flat 204, Shanti Niketan Apts, Indiranagar",
    credit_limit: 15000,
    total_purchases: 34500,
    outstanding_balance: 4200,
    created_at: "2024-02-10"
  },
  {
    id: "cust-002",
    name: "Ananya Gupta",
    phone: "+91 98451 22334",
    email: "ananya.g@outlook.com",
    address: "House #58, 4th Cross, HAL 2nd Stage",
    credit_limit: 10000,
    total_purchases: 18200,
    outstanding_balance: 0,
    created_at: "2024-02-14"
  },
  {
    id: "cust-003",
    name: "Vikram Singh (Singh Caterers)",
    phone: "+91 98452 33445",
    email: "singh.caterers@gmail.com",
    address: "No. 88, 100 Feet Road, Indiranagar",
    credit_limit: 35000,
    total_purchases: 94000,
    outstanding_balance: 14800,
    created_at: "2024-02-20"
  },
  {
    id: "cust-004",
    name: "Sunita Devi",
    phone: "+91 98453 44556",
    email: "sunitadevi78@gmail.com",
    address: "Lane 3, BDA Colony, Domlur",
    credit_limit: 8000,
    total_purchases: 12400,
    outstanding_balance: 1850,
    created_at: "2024-03-01"
  },
  {
    id: "cust-005",
    name: "Mohammed Farooq",
    phone: "+91 98454 55667",
    email: "farooq.bengaluru@gmail.com",
    address: "A-12, Old Airport Road, Indiranagar",
    credit_limit: 12000,
    total_purchases: 26800,
    outstanding_balance: 3100,
    created_at: "2024-03-12"
  },
  {
    id: "cust-006",
    name: "Deepa Nair",
    phone: "+91 98455 66778",
    email: "deepa.nair@infosys.com",
    address: "Greenwood Villa #6, Cambridge Layout",
    credit_limit: 10000,
    total_purchases: 21500,
    outstanding_balance: 0,
    created_at: "2024-03-18"
  },
  {
    id: "cust-007",
    name: "Arvind Joshi",
    phone: "+91 98456 77889",
    email: "arvind.joshi@tcs.com",
    address: "Flat 4B, Silver Oak, Defence Colony",
    credit_limit: 12000,
    total_purchases: 15700,
    outstanding_balance: 2450,
    created_at: "2024-04-02"
  },
  {
    id: "cust-008",
    name: "Pooja Reddy",
    phone: "+91 98457 88990",
    email: "pooja.reddy@yahoo.com",
    address: "Villa 3, Palm Meadows Extension",
    credit_limit: 15000,
    total_purchases: 38900,
    outstanding_balance: 0,
    created_at: "2024-04-10"
  },
  {
    id: "cust-009",
    name: "Sandeep Kulkarni",
    phone: "+91 98458 99001",
    email: "kulkarni.sandeep@gmail.com",
    address: "24/1, 2nd Main, Kodihalli",
    credit_limit: 10000,
    total_purchases: 19400,
    outstanding_balance: 5200,
    created_at: "2024-04-25"
  },
  {
    id: "cust-010",
    name: "Meena Aggarwal",
    phone: "+91 98459 00112",
    email: "meena.aggarwal@hotmail.com",
    address: "House 102, 12th Main, Indiranagar",
    credit_limit: 10000,
    total_purchases: 16100,
    outstanding_balance: 1100,
    created_at: "2024-05-05"
  },
  {
    id: "cust-011",
    name: "Gurpreet Singh",
    phone: "+91 98460 11223",
    email: "gurpreet.s@wipro.com",
    address: "Flat 101, Sunshine Heights, Ulsoor",
    credit_limit: 12000,
    total_purchases: 14200,
    outstanding_balance: 0,
    created_at: "2024-05-18"
  },
  {
    id: "cust-012",
    name: "Kavita Chauhan",
    phone: "+91 98461 22334",
    email: "kavita.chauhan@gmail.com",
    address: "Block C-3, Brigade Horizon",
    credit_limit: 10000,
    total_purchases: 11800,
    outstanding_balance: 1950,
    created_at: "2024-06-01"
  },
  {
    id: "cust-013",
    name: "Manoj Tiwari",
    phone: "+91 98462 33445",
    email: "manojtiwari.blr@gmail.com",
    address: "Old Madras Road, Murphy Town",
    credit_limit: 8000,
    total_purchases: 8900,
    outstanding_balance: 0,
    created_at: "2024-06-15"
  },
  {
    id: "cust-014",
    name: "Alok Bansal",
    phone: "+91 98463 44556",
    email: "alokbansal1980@gmail.com",
    address: "No. 44, 6th Cross, Indiranagar",
    credit_limit: 15000,
    total_purchases: 27300,
    outstanding_balance: 3850,
    created_at: "2024-07-02"
  },
  {
    id: "cust-015",
    name: "Sneha Deshmukh",
    phone: "+91 98464 55667",
    email: "sneha.deshmukh@gmail.com",
    address: "Apartment 5A, Embassy Habitat",
    credit_limit: 10000,
    total_purchases: 13600,
    outstanding_balance: 0,
    created_at: "2024-07-19"
  }
];

export const initialUdhaarTransactions = [
  {
    id: "udhaar-tx-001",
    customer_id: "cust-001",
    transaction_type: "CREDIT",
    amount: 5200,
    date: "2026-10-25T11:30:00.000Z",
    reference_sale_id: "inv-101",
    notes: "Monthly grocery supplies on credit"
  },
  {
    id: "udhaar-tx-002",
    customer_id: "cust-001",
    transaction_type: "PAYMENT",
    amount: 1000,
    payment_mode: "UPI",
    date: "2026-11-01T15:00:00.000Z",
    notes: "Partial payment via GPay"
  },
  {
    id: "udhaar-tx-003",
    customer_id: "cust-003",
    transaction_type: "CREDIT",
    amount: 24800,
    date: "2026-10-20T17:45:00.000Z",
    reference_sale_id: "inv-088",
    notes: "Catering bulk order raw materials"
  },
  {
    id: "udhaar-tx-004",
    customer_id: "cust-003",
    transaction_type: "PAYMENT",
    amount: 10000,
    payment_mode: "BANK_TRANSFER",
    date: "2026-10-29T10:15:00.000Z",
    notes: "NEFT installment payment received"
  },
  {
    id: "udhaar-tx-005",
    customer_id: "cust-004",
    transaction_type: "CREDIT",
    amount: 2850,
    date: "2026-10-28T18:20:00.000Z",
    reference_sale_id: "inv-112",
    notes: "Household provisions"
  },
  {
    id: "udhaar-tx-006",
    customer_id: "cust-004",
    transaction_type: "PAYMENT",
    amount: 1000,
    payment_mode: "CASH",
    date: "2026-11-04T12:00:00.000Z",
    notes: "Cash partial settlement"
  },
  {
    id: "udhaar-tx-007",
    customer_id: "cust-005",
    transaction_type: "CREDIT",
    amount: 3100,
    date: "2026-11-02T19:10:00.000Z",
    reference_sale_id: "inv-124",
    notes: "Monthly staples (oil, atta, pulses)"
  },
  {
    id: "udhaar-tx-008",
    customer_id: "cust-007",
    transaction_type: "CREDIT",
    amount: 2450,
    date: "2026-11-03T16:40:00.000Z",
    reference_sale_id: "inv-128",
    notes: "Groceries on tab"
  },
  {
    id: "udhaar-tx-009",
    customer_id: "cust-009",
    transaction_type: "CREDIT",
    amount: 5200,
    date: "2026-10-27T14:15:00.000Z",
    reference_sale_id: "inv-109",
    notes: "Diwali festival purchase provisions"
  },
  {
    id: "udhaar-tx-010",
    customer_id: "cust-010",
    transaction_type: "CREDIT",
    amount: 1100,
    date: "2026-11-05T18:50:00.000Z",
    reference_sale_id: "inv-135",
    notes: "Evening dairy & tea purchase"
  },
  {
    id: "udhaar-tx-011",
    customer_id: "cust-012",
    transaction_type: "CREDIT",
    amount: 1950,
    date: "2026-11-01T11:20:00.000Z",
    reference_sale_id: "inv-119",
    notes: "Personal care & detergent supplies"
  },
  {
    id: "udhaar-tx-012",
    customer_id: "cust-014",
    transaction_type: "CREDIT",
    amount: 3850,
    date: "2026-11-04T20:10:00.000Z",
    reference_sale_id: "inv-131",
    notes: "Fortnightly rations"
  }
];

export const initialSales = [
  {
    id: "sale-001",
    invoice_number: "VM-LK-2026-101",
    sale_date: "2026-11-06T14:20:00.000Z",
    customer_id: "cust-001",
    customer_name: "Rajesh Mehta",
    customer_phone: "+91 98450 11223",
    subtotal: 1675,
    discount_amount: 50,
    tax_amount: 45,
    total_amount: 1670,
    payment_method: "UPI",
    payment_status: "COMPLETED",
    cashier_name: "Suresh Patel",
    items: [
      { product_id: "prod-001", product_name: "India Gate Basmati Rice 5kg", quantity: 1, unit_price: 590, unit_cost: 480, total_price: 590 },
      { product_id: "prod-002", product_name: "Aashirvaad Sharbati Atta 10kg", quantity: 1, unit_price: 495, unit_cost: 420, total_price: 495 },
      { product_id: "prod-007", product_name: "Fortune Sunflower Oil 1L", quantity: 2, unit_price: 138, unit_cost: 118, total_price: 276 },
      { product_id: "prod-015", product_name: "Tata Tea Gold Leaf Tea 500g", quantity: 1, unit_price: 340, unit_cost: 280, total_price: 340 }
    ]
  },
  {
    id: "sale-002",
    invoice_number: "VM-LK-2026-102",
    sale_date: "2026-11-06T12:45:00.000Z",
    customer_id: "cust-002",
    customer_name: "Ananya Gupta",
    customer_phone: "+91 98451 22334",
    subtotal: 825,
    discount_amount: 25,
    tax_amount: 30,
    total_amount: 830,
    payment_method: "CASH",
    payment_status: "COMPLETED",
    cashier_name: "Suresh Patel",
    items: [
      { product_id: "prod-010", product_name: "Amul Pure Cow Ghee Tin 1L", quantity: 1, unit_price: 660, unit_cost: 575, total_price: 660 },
      { product_id: "prod-021", product_name: "Maggi Masala Noodles 280g", quantity: 2, unit_price: 64, unit_cost: 52, total_price: 128 },
      { product_id: "prod-018", product_name: "Parle-G Gold Biscuits 250g", quantity: 1, unit_price: 30, unit_cost: 24, total_price: 30 }
    ]
  },
  {
    id: "sale-003",
    invoice_number: "VM-LK-2026-103",
    sale_date: "2026-11-06T10:15:00.000Z",
    customer_id: "cust-005",
    customer_name: "Mohammed Farooq",
    customer_phone: "+91 98454 55667",
    subtotal: 1420,
    discount_amount: 40,
    tax_amount: 40,
    total_amount: 1420,
    payment_method: "UDHAAR",
    payment_status: "COMPLETED",
    cashier_name: "Priya Sharma",
    items: [
      { product_id: "prod-003", product_name: "Tata Sampann Toor Dal 1kg", quantity: 2, unit_price: 175, unit_cost: 145, total_price: 350 },
      { product_id: "prod-009", product_name: "Dhara Mustard Oil 1L", quantity: 2, unit_price: 168, unit_cost: 142, total_price: 336 },
      { product_id: "prod-005", product_name: "Madhur Pure Sugar 1kg", quantity: 4, unit_price: 52, unit_cost: 44, total_price: 208 },
      { product_id: "prod-022", product_name: "Surf Excel Detergent 1kg", quantity: 2, unit_price: 155, unit_cost: 128, total_price: 310 }
    ]
  },
  {
    id: "sale-004",
    invoice_number: "VM-LK-2026-104",
    sale_date: "2026-11-05T19:30:00.000Z",
    customer_id: "cust-008",
    customer_name: "Pooja Reddy",
    customer_phone: "+91 98457 88990",
    subtotal: 2190,
    discount_amount: 70,
    tax_amount: 80,
    total_amount: 2200,
    payment_method: "UPI",
    payment_status: "COMPLETED",
    cashier_name: "Suresh Patel",
    items: [
      { product_id: "prod-017", product_name: "Nescafe Classic Coffee 100g", quantity: 2, unit_price: 315, unit_cost: 260, total_price: 630 },
      { product_id: "prod-026", product_name: "Dove Soap Bar Pack", quantity: 2, unit_price: 230, unit_cost: 185, total_price: 460 },
      { product_id: "prod-025", product_name: "Dettol Antiseptic 250ml", quantity: 2, unit_price: 168, unit_cost: 140, total_price: 336 },
      { product_id: "prod-028", product_name: "Kellogg's Corn Flakes 475g", quantity: 2, unit_price: 220, unit_cost: 180, total_price: 440 }
    ]
  },
  {
    id: "sale-005",
    invoice_number: "VM-LK-2026-105",
    sale_date: "2026-11-05T16:10:00.000Z",
    customer_id: "cust-006",
    customer_name: "Deepa Nair",
    customer_phone: "+91 98455 66778",
    subtotal: 980,
    discount_amount: 30,
    tax_amount: 25,
    total_amount: 975,
    payment_method: "CARD",
    payment_status: "COMPLETED",
    cashier_name: "Priya Sharma",
    items: [
      { product_id: "prod-008", product_name: "Saffola Gold Oil 1L", quantity: 2, unit_price: 185, unit_cost: 155, total_price: 370 },
      { product_id: "prod-020", product_name: "Haldiram Aloo Bhujia 400g", quantity: 2, unit_price: 120, unit_cost: 95, total_price: 240 },
      { product_id: "prod-019", product_name: "Britannia Good Day 200g", quantity: 4, unit_price: 50, unit_cost: 38, total_price: 200 }
    ]
  },
  {
    id: "sale-006",
    invoice_number: "VM-LK-2026-106",
    sale_date: "2026-11-05T11:20:00.000Z",
    customer_id: "cust-011",
    customer_name: "Gurpreet Singh",
    customer_phone: "+91 98460 11223",
    subtotal: 1350,
    discount_amount: 50,
    tax_amount: 30,
    total_amount: 1330,
    payment_method: "UPI",
    payment_status: "COMPLETED",
    cashier_name: "Suresh Patel",
    items: [
      { product_id: "prod-001", product_name: "India Gate Basmati Rice 5kg", quantity: 1, unit_price: 590, unit_cost: 480, total_price: 590 },
      { product_id: "prod-002", product_name: "Aashirvaad Sharbati Atta 10kg", quantity: 1, unit_price: 495, unit_cost: 420, total_price: 495 },
      { product_id: "prod-011", product_name: "Tata Salt 1kg", quantity: 3, unit_price: 28, unit_cost: 22, total_price: 84 }
    ]
  },
  {
    id: "sale-007",
    invoice_number: "VM-LK-2026-107",
    sale_date: "2026-11-04T18:40:00.000Z",
    customer_id: "cust-003",
    customer_name: "Vikram Singh (Singh Caterers)",
    customer_phone: "+91 98452 33445",
    subtotal: 6850,
    discount_amount: 250,
    tax_amount: 150,
    total_amount: 6750,
    payment_method: "UDHAAR",
    payment_status: "COMPLETED",
    cashier_name: "Ramesh Kumar",
    items: [
      { product_id: "prod-001", product_name: "India Gate Basmati Rice 5kg", quantity: 6, unit_price: 590, unit_cost: 480, total_price: 3540 },
      { product_id: "prod-010", product_name: "Amul Pure Cow Ghee 1L", quantity: 3, unit_price: 660, unit_cost: 575, total_price: 1980 },
      { product_id: "prod-007", product_name: "Fortune Sunflower Oil 1L", quantity: 8, unit_price: 138, unit_cost: 118, total_price: 1104 }
    ]
  },
  {
    id: "sale-008",
    invoice_number: "VM-LK-2026-108",
    sale_date: "2026-11-04T14:10:00.000Z",
    customer_id: "cust-014",
    customer_name: "Alok Bansal",
    customer_phone: "+91 98463 44556",
    subtotal: 1220,
    discount_amount: 40,
    tax_amount: 35,
    total_amount: 1215,
    payment_method: "CASH",
    payment_status: "COMPLETED",
    cashier_name: "Suresh Patel",
    items: [
      { product_id: "prod-016", product_name: "Brooke Bond Red Label Tea 250g", quantity: 2, unit_price: 155, unit_cost: 125, total_price: 310 },
      { product_id: "prod-004", product_name: "Tata Sampann Moong Dal 1kg", quantity: 2, unit_price: 158, unit_cost: 130, total_price: 316 },
      { product_id: "prod-027", product_name: "Colgate MaxFresh Toothpaste 150g", quantity: 2, unit_price: 115, unit_cost: 92, total_price: 230 }
    ]
  },
  {
    id: "sale-009",
    invoice_number: "VM-LK-2026-109",
    sale_date: "2026-11-03T17:15:00.000Z",
    customer_id: "cust-007",
    customer_name: "Arvind Joshi",
    customer_phone: "+91 98456 77889",
    subtotal: 1540,
    discount_amount: 50,
    tax_amount: 40,
    total_amount: 1530,
    payment_method: "UPI",
    payment_status: "COMPLETED",
    cashier_name: "Suresh Patel",
    items: [
      { product_id: "prod-002", product_name: "Aashirvaad Sharbati Atta 10kg", quantity: 1, unit_price: 495, unit_cost: 420, total_price: 495 },
      { product_id: "prod-015", product_name: "Tata Tea Gold 500g", quantity: 1, unit_price: 340, unit_cost: 280, total_price: 340 },
      { product_id: "prod-024", product_name: "Lizol Surface Cleaner 500ml", quantity: 2, unit_price: 124, unit_cost: 98, total_price: 248 }
    ]
  },
  {
    id: "sale-010",
    invoice_number: "VM-LK-2026-103B",
    sale_date: "2026-11-03T11:50:00.000Z",
    customer_id: "cust-009",
    customer_name: "Sandeep Kulkarni",
    customer_phone: "+91 98458 99001",
    subtotal: 2120,
    discount_amount: 70,
    tax_amount: 55,
    total_amount: 2105,
    payment_method: "UDHAAR",
    payment_status: "COMPLETED",
    cashier_name: "Priya Sharma",
    items: [
      { product_id: "prod-010", product_name: "Amul Pure Cow Ghee 1L", quantity: 2, unit_price: 660, unit_cost: 575, total_price: 1320 },
      { product_id: "prod-005", product_name: "Madhur Pure Sugar 1kg", quantity: 3, unit_price: 52, unit_cost: 44, total_price: 156 },
      { product_id: "prod-012", product_name: "MDH Deggi Mirch 100g", quantity: 2, unit_price: 84, unit_cost: 68, total_price: 168 }
    ]
  },
  {
    id: "sale-011",
    invoice_number: "VM-LK-2026-111",
    sale_date: "2026-11-02T19:05:00.000Z",
    customer_id: "cust-015",
    customer_name: "Sneha Deshmukh",
    customer_phone: "+91 98464 55667",
    subtotal: 780,
    discount_amount: 20,
    tax_amount: 20,
    total_amount: 780,
    payment_method: "UPI",
    payment_status: "COMPLETED",
    cashier_name: "Suresh Patel",
    items: [
      { product_id: "prod-017", product_name: "Nescafe Classic Coffee 100g", quantity: 1, unit_price: 315, unit_cost: 260, total_price: 315 },
      { product_id: "prod-019", product_name: "Britannia Good Day 200g", quantity: 2, unit_price: 50, unit_cost: 38, total_price: 100 },
      { product_id: "prod-023", product_name: "Vim Dishwash Bar 300g", quantity: 3, unit_price: 32, unit_cost: 24, total_price: 96 }
    ]
  },
  {
    id: "sale-012",
    invoice_number: "VM-LK-2026-112",
    sale_date: "2026-11-02T14:40:00.000Z",
    customer_id: "cust-004",
    customer_name: "Sunita Devi",
    customer_phone: "+91 98453 44556",
    subtotal: 1850,
    discount_amount: 50,
    tax_amount: 50,
    total_amount: 1850,
    payment_method: "UDHAAR",
    payment_status: "COMPLETED",
    cashier_name: "Priya Sharma",
    items: [
      { product_id: "prod-002", product_name: "Aashirvaad Sharbati Atta 10kg", quantity: 2, unit_price: 495, unit_cost: 420, total_price: 990 },
      { product_id: "prod-007", product_name: "Fortune Sunflower Oil 1L", quantity: 3, unit_price: 138, unit_cost: 118, total_price: 414 },
      { product_id: "prod-011", product_name: "Tata Salt 1kg", quantity: 2, unit_price: 28, unit_cost: 22, total_price: 56 }
    ]
  },
  {
    id: "sale-013",
    invoice_number: "VM-LK-2026-113",
    sale_date: "2026-11-01T16:50:00.000Z",
    customer_id: "cust-012",
    customer_name: "Kavita Chauhan",
    customer_phone: "+91 98461 22334",
    subtotal: 1950,
    discount_amount: 50,
    tax_amount: 60,
    total_amount: 1960,
    payment_method: "CASH",
    payment_status: "COMPLETED",
    cashier_name: "Suresh Patel",
    items: [
      { product_id: "prod-026", product_name: "Dove Soap Bar Pack", quantity: 3, unit_price: 230, unit_cost: 185, total_price: 690 },
      { product_id: "prod-022", product_name: "Surf Excel Detergent 1kg", quantity: 3, unit_price: 155, unit_cost: 128, total_price: 465 },
      { product_id: "prod-025", product_name: "Dettol Antiseptic 250ml", quantity: 2, unit_price: 168, unit_cost: 140, total_price: 336 }
    ]
  },
  {
    id: "sale-014",
    invoice_number: "VM-LK-2026-114",
    sale_date: "2026-11-01T11:15:00.000Z",
    customer_id: "cust-010",
    customer_name: "Meena Aggarwal",
    customer_phone: "+91 98459 00112",
    subtotal: 1120,
    discount_amount: 30,
    tax_amount: 25,
    total_amount: 1115,
    payment_method: "UPI",
    payment_status: "COMPLETED",
    cashier_name: "Suresh Patel",
    items: [
      { product_id: "prod-015", product_name: "Tata Tea Gold 500g", quantity: 2, unit_price: 340, unit_cost: 280, total_price: 680 },
      { product_id: "prod-006", product_name: "Fortune Sooji 500g", quantity: 2, unit_price: 36, unit_cost: 28, total_price: 72 },
      { product_id: "prod-021", product_name: "Maggi Masala Noodles 280g", quantity: 3, unit_price: 64, unit_cost: 52, total_price: 192 }
    ]
  },
  {
    id: "sale-015",
    invoice_number: "VM-LK-2026-115",
    sale_date: "2026-10-31T18:00:00.000Z",
    customer_id: "cust-001",
    customer_name: "Rajesh Mehta",
    customer_phone: "+91 98450 11223",
    subtotal: 2650,
    discount_amount: 80,
    tax_amount: 70,
    total_amount: 2640,
    payment_method: "CARD",
    payment_status: "COMPLETED",
    cashier_name: "Priya Sharma",
    items: [
      { product_id: "prod-001", product_name: "India Gate Basmati Rice 5kg", quantity: 2, unit_price: 590, unit_cost: 480, total_price: 1180 },
      { product_id: "prod-010", product_name: "Amul Pure Cow Ghee 1L", quantity: 1, unit_price: 660, unit_cost: 575, total_price: 660 },
      { product_id: "prod-003", product_name: "Tata Sampann Toor Dal 1kg", quantity: 2, unit_price: 175, unit_cost: 145, total_price: 350 }
    ]
  },
  {
    id: "sale-016",
    invoice_number: "VM-LK-2026-116",
    sale_date: "2026-10-30T17:20:00.000Z",
    customer_id: "cust-003",
    customer_name: "Vikram Singh (Singh Caterers)",
    customer_phone: "+91 98452 33445",
    subtotal: 5400,
    discount_amount: 200,
    tax_amount: 120,
    total_amount: 5320,
    payment_method: "UDHAAR",
    payment_status: "COMPLETED",
    cashier_name: "Ramesh Kumar",
    items: [
      { product_id: "prod-002", product_name: "Aashirvaad Sharbati Atta 10kg", quantity: 6, unit_price: 495, unit_cost: 420, total_price: 2970 },
      { product_id: "prod-005", product_name: "Madhur Pure Sugar 1kg", quantity: 12, unit_price: 52, unit_cost: 44, total_price: 624 },
      { product_id: "prod-007", product_name: "Fortune Sunflower Oil 1L", quantity: 6, unit_price: 138, unit_cost: 118, total_price: 828 }
    ]
  },
  {
    id: "sale-017",
    invoice_number: "VM-LK-2026-117",
    sale_date: "2026-10-29T15:10:00.000Z",
    customer_id: "cust-013",
    customer_name: "Manoj Tiwari",
    customer_phone: "+91 98462 33445",
    subtotal: 620,
    discount_amount: 20,
    tax_amount: 15,
    total_amount: 615,
    payment_method: "CASH",
    payment_status: "COMPLETED",
    cashier_name: "Suresh Patel",
    items: [
      { product_id: "prod-018", product_name: "Parle-G Gold Biscuits 250g", quantity: 3, unit_price: 30, unit_cost: 24, total_price: 90 },
      { product_id: "prod-020", product_name: "Haldiram Aloo Bhujia 400g", quantity: 2, unit_price: 120, unit_cost: 95, total_price: 240 },
      { product_id: "prod-021", product_name: "Maggi Masala Noodles 280g", quantity: 3, unit_price: 64, unit_cost: 52, total_price: 192 }
    ]
  },
  {
    id: "sale-018",
    invoice_number: "VM-LK-2026-118",
    sale_date: "2026-10-28T19:35:00.000Z",
    customer_id: "cust-002",
    customer_name: "Ananya Gupta",
    customer_phone: "+91 98451 22334",
    subtotal: 1640,
    discount_amount: 40,
    tax_amount: 50,
    total_amount: 1650,
    payment_method: "UPI",
    payment_status: "COMPLETED",
    cashier_name: "Suresh Patel",
    items: [
      { product_id: "prod-008", product_name: "Saffola Gold Oil 1L", quantity: 3, unit_price: 185, unit_cost: 155, total_price: 555 },
      { product_id: "prod-017", product_name: "Nescafe Classic Coffee 100g", quantity: 1, unit_price: 315, unit_cost: 260, total_price: 315 },
      { product_id: "prod-028", product_name: "Kellogg's Corn Flakes 475g", quantity: 2, unit_price: 220, unit_cost: 180, total_price: 440 }
    ]
  },
  {
    id: "sale-019",
    invoice_number: "VM-LK-2026-119",
    sale_date: "2026-10-27T12:00:00.000Z",
    customer_id: "cust-006",
    customer_name: "Deepa Nair",
    customer_phone: "+91 98455 66778",
    subtotal: 1420,
    discount_amount: 30,
    tax_amount: 40,
    total_amount: 1430,
    payment_method: "UPI",
    payment_status: "COMPLETED",
    cashier_name: "Priya Sharma",
    items: [
      { product_id: "prod-001", product_name: "India Gate Basmati Rice 5kg", quantity: 1, unit_price: 590, unit_cost: 480, total_price: 590 },
      { product_id: "prod-003", product_name: "Tata Sampann Toor Dal 1kg", quantity: 2, unit_price: 175, unit_cost: 145, total_price: 350 },
      { product_id: "prod-015", product_name: "Tata Tea Gold 500g", quantity: 1, unit_price: 340, unit_cost: 280, total_price: 340 }
    ]
  },
  {
    id: "sale-020",
    invoice_number: "VM-LK-2026-120",
    sale_date: "2026-10-26T16:30:00.000Z",
    customer_id: "cust-008",
    customer_name: "Pooja Reddy",
    customer_phone: "+91 98457 88990",
    subtotal: 2450,
    discount_amount: 60,
    tax_amount: 70,
    total_amount: 2460,
    payment_method: "CARD",
    payment_status: "COMPLETED",
    cashier_name: "Suresh Patel",
    items: [
      { product_id: "prod-010", product_name: "Amul Pure Cow Ghee 1L", quantity: 2, unit_price: 660, unit_cost: 575, total_price: 1320 },
      { product_id: "prod-026", product_name: "Dove Soap Bar Pack", quantity: 2, unit_price: 230, unit_cost: 185, total_price: 460 },
      { product_id: "prod-024", product_name: "Lizol Surface Cleaner 500ml", quantity: 2, unit_price: 124, unit_cost: 98, total_price: 248 }
    ]
  }
];

export const initialPurchases = [
  {
    id: "po-001",
    supplier_id: "sup-001",
    supplier_name: "ITC Wholesale Super Distributors",
    invoice_number: "ITC-BLR-89211",
    purchase_date: "2026-11-04T10:00:00.000Z",
    subtotal: 18500,
    tax_amount: 925,
    total_amount: 19425,
    paid_amount: 19425,
    payment_status: "PAID",
    payment_method: "BANK_TRANSFER",
    items: [
      { product_id: "prod-002", product_name: "Aashirvaad Sharbati Atta 10kg", quantity: 30, unit_cost: 420, total_cost: 12600 },
      { product_id: "prod-018", product_name: "Parle-G Gold Biscuits 250g", quantity: 50, unit_cost: 24, total_cost: 1200 },
      { product_id: "prod-021", product_name: "Maggi Masala Noodles 280g", quantity: 50, unit_cost: 52, total_cost: 2600 }
    ]
  },
  {
    id: "po-002",
    supplier_id: "sup-002",
    supplier_name: "Hindustan Unilever Depot - North Depot",
    invoice_number: "HUL-INV-44120",
    purchase_date: "2026-11-02T11:30:00.000Z",
    subtotal: 22800,
    tax_amount: 4104,
    total_amount: 26904,
    paid_amount: 18404,
    payment_status: "PARTIAL",
    payment_method: "BANK_TRANSFER",
    items: [
      { product_id: "prod-022", product_name: "Surf Excel Detergent 1kg", quantity: 40, unit_cost: 128, total_cost: 5120 },
      { product_id: "prod-023", product_name: "Vim Dishwash Bar 300g", quantity: 100, unit_cost: 24, total_cost: 2400 },
      { product_id: "prod-026", product_name: "Dove Soap Bar Pack", quantity: 30, unit_cost: 185, total_cost: 5550 },
      { product_id: "prod-016", product_name: "Brooke Bond Red Label Tea 250g", quantity: 40, unit_cost: 125, total_cost: 5000 }
    ]
  },
  {
    id: "po-003",
    supplier_id: "sup-003",
    supplier_name: "Fortune Agro Traders Pvt Ltd",
    invoice_number: "FAT-PO-7711",
    purchase_date: "2026-10-28T09:15:00.000Z",
    subtotal: 31200,
    tax_amount: 1560,
    total_amount: 32760,
    paid_amount: 10360,
    payment_status: "PARTIAL",
    payment_method: "BANK_TRANSFER",
    items: [
      { product_id: "prod-007", product_name: "Fortune Sunflower Oil 1L", quantity: 100, unit_cost: 118, total_cost: 11800 },
      { product_id: "prod-001", product_name: "India Gate Basmati Rice 5kg", quantity: 30, unit_cost: 480, total_cost: 14400 }
    ]
  },
  {
    id: "po-004",
    supplier_id: "sup-005",
    supplier_name: "Amul Federation & Dairy Wholesalers",
    invoice_number: "AML-BLR-10992",
    purchase_date: "2026-10-25T14:00:00.000Z",
    subtotal: 28750,
    tax_amount: 3450,
    total_amount: 32200,
    paid_amount: 26000,
    payment_status: "PARTIAL",
    payment_method: "UPI",
    items: [
      { product_id: "prod-010", product_name: "Amul Pure Cow Ghee Tin 1L", quantity: 50, unit_cost: 575, total_cost: 28750 }
    ]
  },
  {
    id: "po-005",
    supplier_id: "sup-004",
    supplier_name: "Tata Consumer Direct Logistics",
    invoice_number: "TAT-DIR-99321",
    purchase_date: "2026-10-22T16:20:00.000Z",
    subtotal: 16800,
    tax_amount: 840,
    total_amount: 17640,
    paid_amount: 17640,
    payment_status: "PAID",
    payment_method: "BANK_TRANSFER",
    items: [
      { product_id: "prod-015", product_name: "Tata Tea Gold Leaf Tea 500g", quantity: 40, unit_cost: 280, total_cost: 11200 },
      { product_id: "prod-011", product_name: "Tata Salt 1kg", quantity: 150, unit_cost: 22, total_cost: 3300 }
    ]
  }
];

export const initialExpenses = [
  { id: "exp-001", title: "Monthly Shop Rent (Indiranagar)", category: "Rent", amount: 28000, date: "2026-11-01", payment_method: "BANK_TRANSFER", notes: "Paid to landlord Mr. Venkatesh" },
  { id: "exp-002", title: "Commercial Electricity Bill (BESCOM)", category: "Electricity", amount: 4850, date: "2026-11-03", payment_method: "UPI", notes: "Online payment Bescom Consumer ID 109283" },
  { id: "exp-003", title: "Staff Helper Monthly Salaries", category: "Salary", amount: 22000, date: "2026-11-02", payment_method: "BANK_TRANSFER", notes: "Suresh (Cashier) & Helper boys" },
  { id: "exp-004", title: "Store Goods Transport & Tempo Logistics", category: "Transport", amount: 3200, date: "2026-10-29", payment_method: "CASH", notes: "APMC yard to store delivery auto freight" },
  { id: "exp-005", title: "Shop Pest Control & Deep Sanitation", category: "Maintenance", amount: 1800, date: "2026-10-24", payment_method: "UPI", notes: "Quarterly pest control service" },
  { id: "exp-006", title: "POS Thermal Paper Rolls & Stationeries", category: "Miscellaneous", amount: 1200, date: "2026-10-18", payment_method: "CASH", notes: "Billing printer rolls pack of 50" }
];

export const initialStockMovements = [
  { id: "sm-01", product_id: "prod-001", movement_type: "PURCHASE", quantity: 30, previous_stock: 12, current_stock: 42, notes: "Purchase order FAT-PO-7711", date: "2026-10-28T10:00:00.000Z" },
  { id: "sm-02", product_id: "prod-002", movement_type: "PURCHASE", quantity: 30, previous_stock: 11, current_stock: 41, notes: "Purchase order ITC-BLR-89211", date: "2026-11-04T10:30:00.000Z" },
  { id: "sm-03", product_id: "prod-002", movement_type: "SALE", quantity: 6, previous_stock: 41, current_stock: 35, notes: "POS Invoices", date: "2026-11-06T14:20:00.000Z" },
  { id: "sm-04", product_id: "prod-010", movement_type: "PURCHASE", quantity: 50, previous_stock: 5, current_stock: 55, notes: "Amul dairy delivery", date: "2026-10-25T14:30:00.000Z" },
  { id: "sm-05", product_id: "prod-010", movement_type: "SALE", quantity: 37, previous_stock: 55, current_stock: 18, notes: "Diwali catering sales", date: "2026-11-06T12:45:00.000Z" }
];

export const initialPlatformShops = [
  { id: "shop-001", name: "Lakshmi Kirana & General Store", city: "Bengaluru", state: "Karnataka", plan: "Pro Plan", status: "Active", mrr: 1999, joined: "2024-01-15" },
  { id: "shop-002", name: "Balaji Supermarket & Provisions", city: "Hyderabad", state: "Telangana", plan: "Growth Plan", status: "Active", mrr: 999, joined: "2024-03-20" },
  { id: "shop-003", name: "Shree Ganesh Retail Mart", city: "Pune", state: "Maharashtra", plan: "Starter Plan", status: "Active", mrr: 499, joined: "2024-05-10" },
  { id: "shop-004", name: "Royal Garments & Men's Wear", city: "Jaipur", state: "Rajasthan", plan: "Growth Plan", status: "Active", mrr: 999, joined: "2024-06-18" },
  { id: "shop-005", name: "Krishna Medical & General Store", city: "Ahmedabad", state: "Gujarat", plan: "Pro Plan", status: "Active", mrr: 1999, joined: "2024-07-22" }
];

