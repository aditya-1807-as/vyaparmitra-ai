import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Package,
  ShoppingCart,
  Users,
  Truck,
  BarChart3,
  Building2,
  CheckCircle2,
  ChevronRight,
  TrendingUp,
  Receipt,
  Menu,
  X,
  Store,
  Layers,
  Clock,
  Smartphone,
  Database,
  Bot,
  HelpCircle,
  FileText,
  Mail,
  Phone,
  MapPin,
  Lock,
  ArrowUpRight,
  Percent,
  AlertTriangle
} from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [demoTab, setDemoTab] = useState('pos');
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);

  // 8 Product Modules
  const features = [
    {
      id: 'dashboard',
      icon: TrendingUp,
      title: 'Smart Dashboard',
      description: 'Real-time visibility into net sales, gross margins, cash in hand, and operating profits updated with every transaction.',
      badge: 'Live KPI'
    },
    {
      id: 'inventory',
      icon: Package,
      title: 'Inventory Management',
      description: 'Barcode scanning, multi-category catalogs, automated reorder thresholds, and zero-leakage stock movement tracking.',
      badge: 'Barcode Ready'
    },
    {
      id: 'pos',
      icon: ShoppingCart,
      title: 'Sales & Rapid POS Billing',
      description: 'Lightning-fast 5-second checkout, GST-compliant thermal & A4 invoice generation, split payments (Cash, UPI, Credit).',
      badge: 'Thermal / A4'
    },
    {
      id: 'udhaar',
      icon: Users,
      title: 'Customer & Udhaar Ledger',
      description: 'Digital khata book, customizable customer credit limits, payment history, and instant WhatsApp reminder receipts.',
      badge: 'Khata Book'
    },
    {
      id: 'suppliers',
      icon: Truck,
      title: 'Supplier & Purchase Orders',
      description: 'Track vendor invoices, PO lifecycles, payment due dates, and automated landed cost calculations.',
      badge: 'Vendor POs'
    },
    {
      id: 'ai',
      icon: Bot,
      title: 'AI Business Assistant',
      description: 'Ask questions in plain English: stockout predictions, dead-stock liquidation strategies, and margin optimization recommendations.',
      badge: 'AI Powered',
      highlight: true
    },
    {
      id: 'analytics',
      icon: BarChart3,
      title: 'Analytics & Reports',
      description: 'Visual P&L statements, monthly revenue trends, top-selling categories, and one-click GST tax liability exports.',
      badge: 'P&L Reports'
    },
    {
      id: 'multishop',
      icon: Building2,
      title: 'Multi-Shop Administration',
      description: 'Role-based access controls for Owners, Managers, and Cashiers, with audit logging and isolated workspace security.',
      badge: 'RBAC Security'
    }
  ];

  const steps = [
    {
      number: '01',
      title: 'Create Your Account',
      description: 'Register in 60 seconds with your shop name, contact info, and business location. Your private cloud workspace is instantly provisioned with zero setup fees.',
      tag: 'Instant Setup'
    },
    {
      number: '02',
      title: 'Manage Your Business',
      description: 'Easily add items or scan barcodes, ring up sales at the counter, maintain your customer Udhaar ledger, and log supplier purchase invoices.',
      tag: 'Everyday Operations'
    },
    {
      number: '03',
      title: 'Grow with AI Insights',
      description: 'Unlock AI-driven replenishment alerts, real gross margin visibility, and automated cash flow forecasting designed to maximize profit.',
      tag: 'Smart Expansion'
    }
  ];

  const benefits = [
    {
      icon: Layers,
      title: 'All-In-One Unified Hub',
      text: 'Replace 4 disjointed paper notebooks and disconnected apps with one synchronized retail platform.'
    },
    {
      icon: TrendingUp,
      title: 'Real-Time Business Visibility',
      text: 'Know your exact daily profit, inventory value, and pending dues anytime from anywhere.'
    },
    {
      icon: Package,
      title: 'Zero Stockout Guarantee',
      text: 'Smart reorder intelligence warns you before staple items run out, avoiding lost customer sales.'
    },
    {
      icon: Receipt,
      title: '100% Udhaar Recovery',
      text: 'Organized digital khata with automated WhatsApp payment links speeds up customer debt collection.'
    },
    {
      icon: Sparkles,
      title: 'AI Copilot in Plain Language',
      text: 'No complicated accounting jargon. Ask what sold best this week and get instant plain-English answers.'
    },
    {
      icon: Lock,
      title: 'Bank-Grade Data Isolation',
      text: 'Every shop runs on an independent tenant container. Your sales and pricing are 100% private and protected.'
    },
    {
      icon: Smartphone,
      title: 'Cross-Device Convenience',
      text: 'Use your desktop laptop, shop tablet, or counter smartphone with smooth responsive dark-mode performance.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#0C140E] text-[#F5EFE6] selection:bg-[#8B5CF6] selection:text-white font-sans antialiased">
      {/* Sticky Top Navigation */}
      <nav className="sticky top-0 z-50 bg-[#0C140E]/90 backdrop-blur-md border-b border-[#1F3427]/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1F3D2B] to-[#142319] border border-[#2F523B] flex items-center justify-center shadow-lg group-hover:border-[#8B5CF6] transition-all">
              <Sparkles className="w-5 h-5 text-[#8B5CF6] animate-pulse" />
            </div>
            <div>
              <span className="text-xl font-black text-[#F5EFE6] tracking-tight flex items-center gap-1.5">
                Vyapar<span className="text-[#8B5CF6]">Mitra</span>
                <span className="text-[10px] font-black uppercase px-1.5 py-0.5 rounded bg-[#8B5CF6]/20 text-[#8B5CF6] border border-[#8B5CF6]/40 tracking-wider">
                  AI
                </span>
              </span>
              <p className="text-[10px] text-[#9EAEA3] font-medium tracking-wide">Smart Retail Platform</p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-8 text-sm font-semibold text-[#C5BBA4]">
            <a href="#features" className="hover:text-[#F5EFE6] transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-[#F5EFE6] transition-colors">How It Works</a>
            <a href="#benefits" className="hover:text-[#F5EFE6] transition-colors">Benefits</a>
            <a href="#demo" className="hover:text-[#F5EFE6] transition-colors">Live Preview</a>
            <a href="#contact" className="hover:text-[#F5EFE6] transition-colors">Contact</a>
          </div>

          {/* Desktop Auth CTAs */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              to="/login"
              className="py-2.5 px-5 rounded-xl text-sm font-bold text-[#E8DCC4] hover:text-white bg-[#142319] hover:bg-[#1A2E21] border border-[#243D2D] transition-all"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="py-2.5 px-5 rounded-xl text-sm font-bold text-white bg-[#8B5CF6] hover:bg-[#7C3AED] shadow-purple-glow hover:shadow-lg transition-all flex items-center space-x-1.5"
            >
              <span>Get Started Free</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Mobile Menu Trigger */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#E8DCC4] hover:bg-[#142319] rounded-xl transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-[#0F1A13] border-b border-[#1F3427] px-6 py-5 space-y-4"
            >
              <div className="flex flex-col space-y-3 text-sm font-semibold text-[#C5BBA4]">
                <a
                  href="#features"
                  onClick={() => setMobileMenuOpen(false)}
                  className="hover:text-[#F5EFE6] py-1"
                >
                  Features
                </a>
                <a
                  href="#how-it-works"
                  onClick={() => setMobileMenuOpen(false)}
                  className="hover:text-[#F5EFE6] py-1"
                >
                  How It Works
                </a>
                <a
                  href="#benefits"
                  onClick={() => setMobileMenuOpen(false)}
                  className="hover:text-[#F5EFE6] py-1"
                >
                  Benefits
                </a>
                <a
                  href="#demo"
                  onClick={() => setMobileMenuOpen(false)}
                  className="hover:text-[#F5EFE6] py-1"
                >
                  Live Preview
                </a>
                <a
                  href="#contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="hover:text-[#F5EFE6] py-1"
                >
                  Contact
                </a>
              </div>
              <div className="pt-4 border-t border-[#1F3427] flex flex-col space-y-3">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-xl font-bold text-sm bg-[#142319] text-[#E8DCC4] border border-[#243D2D]"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-xl font-bold text-sm bg-[#8B5CF6] text-white shadow-purple-glow"
                >
                  Get Started Free
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28">
        {/* Subtle Background Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-[#8B5CF6]/10 blur-[130px] rounded-full pointer-events-none" />
        <div className="absolute top-10 left-10 w-72 h-72 bg-[#1F3D2B]/30 blur-[100px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Column: Value Proposition & CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-6 space-y-6 text-center lg:text-left"
            >
              {/* Badge */}
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#142319] border border-[#2A4D37] text-xs font-bold text-[#E8DCC4] shadow-sm">
                <span className="w-2 h-2 rounded-full bg-[#8B5CF6] animate-ping" />
                <span>Smart Retail Platform for Modern Indian Merchants</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#F5EFE6] tracking-tight leading-[1.12]">
                Your Business. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E8DCC4] via-[#F5EFE6] to-[#8B5CF6]">
                  Smarter. Every Day.
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-base sm:text-lg text-[#9EAEA3] font-medium leading-relaxed max-w-xl mx-auto lg:mx-0">
                Manage your inventory, sales, customers, suppliers and business insights from one intelligent platform built for modern Indian retailers.
              </p>

              {/* CTAs */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Link
                  to="/register"
                  className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-extrabold text-base shadow-purple-glow hover:shadow-xl transition-all flex items-center justify-center space-x-2"
                >
                  <span>Get Started Free</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  to="/login"
                  className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-[#1F3D2B] hover:bg-[#2A4D37] text-[#E8DCC4] hover:text-white font-bold text-base border border-[#2F523B] transition-all flex items-center justify-center space-x-2"
                >
                  <Store className="w-5 h-5 text-[#8B5CF6]" />
                  <span>Login to Dashboard</span>
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-[#9EAEA3]">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-[#8B5CF6]" />
                  <span>No Credit Card Required</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-[#8B5CF6]" />
                  <span>Free 30-Day Pro Trial</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-[#8B5CF6]" />
                  <span>Bank-Grade Isolation</span>
                </div>
              </div>
            </motion.div>

            {/* Right Column: Interactive Animated Dashboard Preview */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="lg:col-span-6 relative"
            >
              {/* Outer Glow & Mockup Frame */}
              <div className="relative rounded-3xl bg-gradient-to-b from-[#1F3D2B] to-[#121E16] p-1.5 shadow-2xl border border-[#2A4D37]">
                <div className="rounded-[22px] bg-[#0E1711] overflow-hidden border border-[#1F3427] p-5 space-y-4">
                  {/* Mockup Header */}
                  <div className="flex items-center justify-between pb-3 border-b border-[#1F3427]">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                      <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                      <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                      <span className="text-xs font-bold text-[#9EAEA3] ml-2">Lakshmi Kirana Store • Live Feed</span>
                    </div>
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Synchronized
                    </span>
                  </div>

                  {/* Top Stats Grid */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3.5 rounded-2xl bg-[#142319] border border-[#243D2D]">
                      <p className="text-[11px] font-semibold text-[#9EAEA3]">Today's Sales</p>
                      <p className="text-2xl font-black text-[#F5EFE6] mt-0.5">₹24,850</p>
                      <p className="text-[10px] font-bold text-emerald-400 mt-1 flex items-center">
                        <TrendingUp className="w-3 h-3 mr-1 inline" /> +18.4% vs yesterday
                      </p>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-[#142319] border border-[#243D2D]">
                      <p className="text-[11px] font-semibold text-[#9EAEA3]">Customer Udhaar</p>
                      <p className="text-2xl font-black text-[#E8DCC4] mt-0.5">₹12,400</p>
                      <p className="text-[10px] font-bold text-[#8B5CF6] mt-1 flex items-center">
                        <Users className="w-3 h-3 mr-1 inline" /> 98.2% recovery rate
                      </p>
                    </div>
                  </div>

                  {/* Live Visual Chart Preview */}
                  <div className="p-3.5 rounded-2xl bg-[#142319] border border-[#243D2D] space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-[#F5EFE6]">Daily Revenue Velocity</span>
                      <span className="text-[11px] font-mono text-[#8B5CF6]">7-Day Peak: ₹38,900</span>
                    </div>
                    {/* SVG Curve */}
                    <div className="h-20 w-full flex items-end">
                      <svg className="w-full h-full overflow-visible" viewBox="0 0 300 80">
                        <defs>
                          <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.4" />
                            <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.0" />
                          </linearGradient>
                        </defs>
                        <path
                          d="M0,65 Q40,55 75,45 T150,50 T225,20 T300,30 L300,80 L0,80 Z"
                          fill="url(#chartGradient)"
                        />
                        <path
                          d="M0,65 Q40,55 75,45 T150,50 T225,20 T300,30"
                          fill="none"
                          stroke="#8B5CF6"
                          strokeWidth="2.5"
                        />
                        <circle cx="225" cy="20" r="4" fill="#8B5CF6" stroke="#FFFFFF" strokeWidth="2" />
                      </svg>
                    </div>
                  </div>

                  {/* AI Assistant Insight Highlight Card */}
                  <div className="p-3 rounded-2xl bg-gradient-to-r from-[#8B5CF6]/15 to-[#1F3D2B]/50 border border-[#8B5CF6]/30 flex items-start space-x-3">
                    <div className="w-8 h-8 rounded-xl bg-[#8B5CF6] text-white flex items-center justify-center shrink-0 shadow-purple-glow">
                      <Bot className="w-4 h-4" />
                    </div>
                    <div className="text-xs">
                      <p className="font-bold text-white flex items-center gap-1.5">
                        VyaparMitra AI Insight
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#8B5CF6]/40 text-white font-mono">LIVE</span>
                      </p>
                      <p className="text-[#E8DCC4] text-[11px] mt-0.5">
                        "Reorder Ashirvaad Shudh Chakki Atta 5kg: Current stock (4 bags) will deplete by tomorrow evening based on current sales velocity."
                      </p>
                    </div>
                  </div>
                </div>

                {/* Floating Metric Pill 1 */}
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
                  className="hidden sm:flex absolute -bottom-5 -left-6 bg-[#142319] border border-[#2F523B] rounded-2xl p-3 shadow-2xl items-center space-x-3"
                >
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <ShoppingCart className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] text-[#9EAEA3] font-semibold">Average POS Speed</p>
                    <p className="text-xs font-black text-white">4.8 seconds / bill</p>
                  </div>
                </motion.div>

                {/* Floating Metric Pill 2 */}
                <motion.div
                  animate={{ y: [0, 6, 0] }}
                  transition={{ repeat: Infinity, duration: 4.5, ease: 'easeInOut' }}
                  className="hidden sm:flex absolute -top-5 -right-5 bg-[#142319] border border-[#8B5CF6]/40 rounded-2xl p-3 shadow-2xl items-center space-x-3"
                >
                  <div className="w-9 h-9 rounded-xl bg-[#8B5CF6]/20 text-[#8B5CF6] flex items-center justify-center">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] text-[#9EAEA3] font-semibold">Gross Margin</p>
                    <p className="text-xs font-black text-white">28.4% Net Profit</p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 8 PRODUCT MODULES / FEATURES SECTION */}
      <section id="features" className="py-20 bg-[#0A120C] border-y border-[#1F3427]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#8B5CF6]">
              Complete Retail Ecosystem
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#F5EFE6] tracking-tight">
              All 8 Core Business Modules. One Intelligent App.
            </h2>
            <p className="text-base text-[#9EAEA3]">
              From daily Kirana cash registers to multi-department retail inventory, VyaparMitra AI covers every workflow without unnecessary complexity.
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feat) => {
              const Icon = feat.icon;
              return (
                <div
                  key={feat.id}
                  className={`relative p-6 rounded-3xl transition-all duration-300 flex flex-col justify-between group ${
                    feat.highlight
                      ? 'bg-gradient-to-b from-[#18291F] to-[#111C14] border-2 border-[#8B5CF6]/60 shadow-purple-glow hover:-translate-y-1'
                      : 'bg-[#121F16] border border-[#1F3427] hover:border-[#8B5CF6]/50 hover:bg-[#15251B] hover:-translate-y-1 shadow-lg'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-105 ${
                        feat.highlight ? 'bg-[#8B5CF6] text-white shadow-purple-glow' : 'bg-[#1F3D2B] text-[#E8DCC4] border border-[#2F523B]'
                      }`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-[#1F3D2B]/80 text-[#E8DCC4] border border-[#2F523B]">
                        {feat.badge}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-[#F5EFE6] group-hover:text-white transition-colors">
                      {feat.title}
                    </h3>
                    <p className="mt-2 text-xs text-[#9EAEA3] leading-relaxed">
                      {feat.description}
                    </p>
                  </div>

                  <div className="mt-5 pt-4 border-t border-[#1F3427]/60 flex items-center text-xs font-bold text-[#8B5CF6] group-hover:translate-x-1 transition-transform">
                    <span>Explore module</span>
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section id="how-it-works" className="py-20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#8B5CF6]">
              Simple 3-Step Onboarding
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#F5EFE6] tracking-tight">
              Up and Running in 3 Easy Steps
            </h2>
            <p className="text-base text-[#9EAEA3]">
              No complicated accounting courses or technical onboarding required. If you can use a smartphone, you can master VyaparMitra AI.
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {steps.map((st, idx) => (
              <div
                key={st.number}
                className="relative p-7 rounded-3xl bg-[#142319] border border-[#243D2D] hover:border-[#8B5CF6]/60 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-4xl font-black text-[#8B5CF6]/50 font-mono">
                      {st.number}
                    </span>
                    <span className="text-[10px] font-bold uppercase px-2.5 py-1 rounded-full bg-[#1F3D2B] text-[#E8DCC4] border border-[#2F523B]">
                      {st.tag}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-[#F5EFE6]">{st.title}</h3>
                  <p className="mt-3 text-sm text-[#9EAEA3] leading-relaxed">
                    {st.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-[#1F3427]">
                  <div className="flex items-center text-xs font-semibold text-[#E8DCC4]">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 mr-2" />
                    <span>Included in 30-day trial</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BENEFITS SECTION */}
      <section id="benefits" className="py-20 bg-[#09110B] border-y border-[#1F3427]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#8B5CF6]">
              Merchant Advantages
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#F5EFE6] tracking-tight">
              Engineered Exclusively for Indian Retailers
            </h2>
            <p className="text-base text-[#9EAEA3]">
              Generic Western POS systems fail in Indian retail shops. Here is why Kiranas and retail marts choose VyaparMitra AI:
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((b, i) => {
              const Icon = b.icon;
              return (
                <div
                  key={i}
                  className="p-6 rounded-2xl bg-[#122016] border border-[#1F3427] hover:border-[#2F523B] transition-all"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#1F3D2B] text-[#8B5CF6] flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-[#F5EFE6]">{b.title}</h3>
                  <p className="mt-2 text-xs text-[#9EAEA3] leading-relaxed">{b.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* INTERACTIVE LIVE PROTOTYPE PREVIEW */}
      <section id="demo" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#8B5CF6]">
              Live Interactive Prototype
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#F5EFE6] tracking-tight">
              Test-Drive VyaparMitra AI Right Now
            </h2>
            <p className="text-base text-[#9EAEA3]">
              Switch tabs below to inspect how POS checkout, the customer Udhaar ledger, and the AI business assistant work inside the app.
            </p>
          </div>

          {/* Interactive Tabs */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
            {[
              { id: 'pos', label: '1. Fast POS Billing', icon: ShoppingCart },
              { id: 'udhaar', label: '2. Customer Udhaar Ledger', icon: Users },
              { id: 'ai', label: '3. AI Assistant Query', icon: Bot },
              { id: 'profit', label: '4. Gross & Net Profit P&L', icon: TrendingUp }
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = demoTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setDemoTab(tab.id)}
                  className={`flex items-center space-x-2 px-5 py-3 rounded-2xl font-bold text-xs transition-all ${
                    isActive
                      ? 'bg-[#8B5CF6] text-white shadow-purple-glow'
                      : 'bg-[#142319] text-[#9EAEA3] hover:text-[#F5EFE6] border border-[#243D2D]'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Tab Screen Content Mockup */}
          <div className="mt-8 rounded-3xl bg-[#121F16] border border-[#243D2D] p-6 lg:p-8 shadow-2xl">
            {demoTab === 'pos' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#1F3427] gap-3">
                  <div>
                    <h4 className="text-lg font-bold text-[#F5EFE6]">Active POS Counter • Order #VM-2026-881</h4>
                    <p className="text-xs text-[#9EAEA3]">Customer: Walk-in Retail Customer • Cashier: Rahul Sharma</p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 font-mono text-xs border border-emerald-500/30 w-fit">
                    Scan or Type SKU
                  </span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Cart Table Mock */}
                  <div className="lg:col-span-2 space-y-3">
                    <div className="rounded-2xl bg-[#0E1711] border border-[#1F3427] overflow-hidden">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-[#142319] text-[#9EAEA3] font-bold border-b border-[#1F3427]">
                          <tr>
                            <th className="p-3">Item Name</th>
                            <th className="p-3 text-center">Qty</th>
                            <th className="p-3 text-right">Unit Price</th>
                            <th className="p-3 text-right">Total</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#1F3427] text-[#E8DCC4]">
                          <tr>
                            <td className="p-3 font-semibold text-white">Ashirvaad Shudh Chakki Atta 5kg</td>
                            <td className="p-3 text-center font-mono">2</td>
                            <td className="p-3 text-right font-mono">₹245.00</td>
                            <td className="p-3 text-right font-mono font-bold text-white">₹490.00</td>
                          </tr>
                          <tr>
                            <td className="p-3 font-semibold text-white">Tata Salt 1kg Pouch</td>
                            <td className="p-3 text-center font-mono">3</td>
                            <td className="p-3 text-right font-mono">₹28.00</td>
                            <td className="p-3 text-right font-mono font-bold text-white">₹84.00</td>
                          </tr>
                          <tr>
                            <td className="p-3 font-semibold text-white">Amul Taaza Milk 500ml</td>
                            <td className="p-3 text-center font-mono">4</td>
                            <td className="p-3 text-right font-mono">₹27.00</td>
                            <td className="p-3 text-right font-mono font-bold text-white">₹108.00</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Payment Summary */}
                  <div className="rounded-2xl bg-[#142319] border border-[#243D2D] p-5 space-y-4">
                    <p className="text-xs font-bold text-[#9EAEA3] uppercase">Checkout Summary</p>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between text-[#9EAEA3]">
                        <span>Subtotal (3 items)</span>
                        <span className="font-mono">₹682.00</span>
                      </div>
                      <div className="flex justify-between text-[#9EAEA3]">
                        <span>GST (5% & 12%)</span>
                        <span className="font-mono">₹26.40</span>
                      </div>
                      <div className="flex justify-between text-base font-black text-white pt-2 border-t border-[#1F3427]">
                        <span>Total Payable</span>
                        <span className="font-mono text-[#8B5CF6]">₹708.40</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 pt-2">
                      <button className="py-2.5 rounded-xl bg-emerald-600/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold hover:bg-emerald-600/30">
                        Cash
                      </button>
                      <button className="py-2.5 rounded-xl bg-[#8B5CF6]/20 text-[#8B5CF6] border border-[#8B5CF6]/40 text-xs font-bold hover:bg-[#8B5CF6]/30">
                        UPI QR
                      </button>
                      <button className="py-2.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold hover:bg-amber-500/30">
                        Udhaar
                      </button>
                    </div>

                    <Link
                      to="/sales/pos"
                      className="w-full py-3 rounded-xl bg-[#8B5CF6] text-white font-bold text-xs shadow-purple-glow flex items-center justify-center space-x-1.5"
                    >
                      <span>Open Real POS Console</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {demoTab === 'udhaar' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#1F3427] gap-3">
                  <div>
                    <h4 className="text-lg font-bold text-[#F5EFE6]">Digital Khata & Udhaar Ledger</h4>
                    <p className="text-xs text-[#9EAEA3]">Automated customer balance tracking and one-tap WhatsApp payment reminders</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-[#9EAEA3]">Total Store Credit Out</p>
                    <p className="text-xl font-black text-rose-400 font-mono">₹38,500</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { name: 'Suresh Patel', phone: '+91 98451 10022', due: '₹4,200', status: 'Due Today', risk: 'Low' },
                    { name: 'Dr. Mohan Rao', phone: '+91 94480 33411', due: '₹1,850', status: 'Normal', risk: 'Low' },
                    { name: 'Kavita Verma', phone: '+91 97412 88900', due: '₹8,500', status: 'Over Limit', risk: 'High' }
                  ].map((cust, i) => (
                    <div key={i} className="p-4 rounded-2xl bg-[#142319] border border-[#243D2D] space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-bold text-white text-sm">{cust.name}</p>
                          <p className="text-[11px] font-mono text-[#9EAEA3]">{cust.phone}</p>
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          cust.risk === 'High' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' : 'bg-emerald-500/20 text-emerald-300'
                        }`}>
                          {cust.status}
                        </span>
                      </div>
                      <div className="pt-2 border-t border-[#1F3427] flex justify-between items-center text-xs">
                        <span className="text-[#9EAEA3]">Outstanding:</span>
                        <span className="font-mono font-bold text-rose-300 text-sm">{cust.due}</span>
                      </div>
                      <button className="w-full py-2 rounded-xl bg-emerald-600/15 hover:bg-emerald-600/25 text-emerald-300 border border-emerald-500/30 text-xs font-bold transition-colors">
                        Send WhatsApp Reminder
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {demoTab === 'ai' && (
              <div className="space-y-6">
                <div className="flex items-center space-x-3 pb-4 border-b border-[#1F3427]">
                  <div className="w-10 h-10 rounded-xl bg-[#8B5CF6] text-white flex items-center justify-center shadow-purple-glow">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-[#F5EFE6]">VyaparMitra AI Natural Language Engine</h4>
                    <p className="text-xs text-[#9EAEA3]">Ask business questions in plain English without consulting an accountant</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-[#0E1711] border border-[#1F3427] text-xs space-y-2">
                    <p className="font-bold text-[#8B5CF6] flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 inline" /> Merchant Query:
                    </p>
                    <p className="text-[#F5EFE6] font-medium text-sm italic">
                      "Which grocery categories yielded the highest gross profit margin over the last 30 days?"
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-gradient-to-r from-[#8B5CF6]/15 to-[#1F3D2B]/40 border border-[#8B5CF6]/40 text-xs space-y-3">
                    <p className="font-bold text-white flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-[#8B5CF6]" /> AI Strategic Response:
                    </p>
                    <p className="text-[#E8DCC4] leading-relaxed">
                      "Based on 142 completed sales invoices this month:
                      <br /><br />
                      <strong>1. Spices & Condiments:</strong> 36.2% Gross Margin (₹8,420 net profit)
                      <br />
                      <strong>2. Packaged Snacks:</strong> 29.8% Gross Margin (₹12,150 net profit)
                      <br />
                      <strong>3. Dairy & Milk:</strong> 11.4% Gross Margin (high velocity, lower unit margin)
                      <br /><br />
                      <span className="text-[#8B5CF6] font-bold">Actionable Recommendation:</span> Bundle high-margin branded spices with staple atta bags at the counter checkout to elevate average basket margin by 4.2%."
                    </p>
                  </div>
                </div>
              </div>
            )}

            {demoTab === 'profit' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#1F3427] gap-3">
                  <div>
                    <h4 className="text-lg font-bold text-[#F5EFE6]">Financial Health & Accurate P&L Statement</h4>
                    <p className="text-xs text-[#9EAEA3]">Mathematically verified: Net Sales - COGS = Gross Profit; Gross Profit - Expenses = Net Profit</p>
                  </div>
                  <span className="text-xs font-mono text-emerald-400 font-bold px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 w-fit">
                    Audited Calculations
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div className="p-4 rounded-2xl bg-[#0E1711] border border-[#1F3427]">
                    <p className="text-[11px] text-[#9EAEA3]">Total Revenue (A)</p>
                    <p className="text-xl font-black text-white font-mono mt-1">₹39,845</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-[#0E1711] border border-[#1F3427]">
                    <p className="text-[11px] text-[#9EAEA3]">Cost of Goods Sold (B)</p>
                    <p className="text-xl font-black text-amber-300 font-mono mt-1">₹28,520</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-[#0E1711] border border-[#1F3427]">
                    <p className="text-[11px] text-[#9EAEA3]">Gross Profit (A - B)</p>
                    <p className="text-xl font-black text-emerald-400 font-mono mt-1">₹11,325</p>
                    <p className="text-[10px] text-emerald-300 font-bold mt-1">28.4% Margin</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-[#142319] to-[#1F3D2B] border border-[#8B5CF6]/40">
                    <p className="text-[11px] text-[#E8DCC4]">Net Profit</p>
                    <p className="text-xl font-black text-[#8B5CF6] font-mono mt-1">₹8,125</p>
                    <p className="text-[10px] text-[#E8DCC4] mt-1">After ₹3,200 OPEX</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* FINAL HIGH-IMPACT CTA SECTION */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#1F3D2B] via-[#142319] to-[#0A120C] border-y border-[#2F523B]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[300px] bg-[#8B5CF6]/15 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-6">
          <span className="text-xs font-bold uppercase tracking-wider text-[#8B5CF6] px-3.5 py-1.5 rounded-full bg-[#142319] border border-[#2A4D37]">
            Get Started In Under 60 Seconds
          </span>

          <h2 className="text-3xl sm:text-5xl font-black text-[#F5EFE6] tracking-tight">
            Transform Your Retail Business Today
          </h2>

          <p className="text-base sm:text-lg text-[#9EAEA3] max-w-2xl mx-auto font-medium">
            Join thousands of smart Kirana owners and retailers who eliminated stock loss, recovered pending Udhaar, and made their shops more profitable.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-extrabold text-base shadow-purple-glow hover:shadow-2xl transition-all flex items-center justify-center space-x-2"
            >
              <span>Create Free Shop Account</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/login"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-[#142319] hover:bg-[#1A2E21] text-[#E8DCC4] font-bold text-base border border-[#243D2D] transition-all"
            >
              Sign In to Existing Shop
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer id="contact" className="bg-[#080E09] border-t border-[#1F3427] text-xs text-[#9EAEA3] py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {/* Col 1: Brand Info */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#1F3D2B] border border-[#2F523B] flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-[#8B5CF6]" />
                </div>
                <span className="text-lg font-black text-white">
                  Vyapar<span className="text-[#8B5CF6]">Mitra</span> AI
                </span>
              </div>
              <p className="text-xs leading-relaxed max-w-sm text-[#9EAEA3]">
                The smart retail operating system empowering Kiranas, supermarkets, apparel, and hardware stores across India with modern inventory, fast billing, and AI business intelligence.
              </p>
              <div className="flex items-center space-x-3 text-[11px] text-[#C5BBA4]">
                <ShieldCheck className="w-4 h-4 text-[#8B5CF6]" />
                <span>Multi-tenant data isolation • SSL encrypted</span>
              </div>
            </div>

            {/* Col 2: Product Modules */}
            <div className="space-y-3">
              <p className="font-bold text-white uppercase tracking-wider text-[11px]">Product Modules</p>
              <ul className="space-y-2">
                <li><Link to="/dashboard" className="hover:text-white transition-colors">Smart Dashboard</Link></li>
                <li><Link to="/inventory" className="hover:text-white transition-colors">Barcode Inventory</Link></li>
                <li><Link to="/sales/pos" className="hover:text-white transition-colors">Point of Sale (POS)</Link></li>
                <li><Link to="/customers" className="hover:text-white transition-colors">Customer Khata</Link></li>
                <li><Link to="/suppliers" className="hover:text-white transition-colors">Supplier Orders</Link></li>
                <li><Link to="/ai-assistant" className="hover:text-white transition-colors">AI Copilot</Link></li>
              </ul>
            </div>

            {/* Col 3: Company & Platform */}
            <div className="space-y-3">
              <p className="font-bold text-white uppercase tracking-wider text-[11px]">Platform</p>
              <ul className="space-y-2">
                <li><a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a></li>
                <li><a href="#benefits" className="hover:text-white transition-colors">Why VyaparMitra</a></li>
                <li><Link to="/login" className="hover:text-white transition-colors">Sign In Portal</Link></li>
                <li><Link to="/register" className="hover:text-white transition-colors">Shop Registration</Link></li>
                <li>
                  <Link to="/super-admin/dashboard" className="text-[#8B5CF6] hover:underline flex items-center gap-1 font-semibold">
                    Super Admin Portal
                    <ArrowUpRight className="w-3 h-3" />
                  </Link>
                </li>
              </ul>
            </div>

            {/* Col 4: Contact & Support */}
            <div className="space-y-3">
              <p className="font-bold text-white uppercase tracking-wider text-[11px]">Contact & Support</p>
              <ul className="space-y-2.5">
                <li className="flex items-center space-x-2">
                  <Mail className="w-3.5 h-3.5 text-[#8B5CF6]" />
                  <span>support@vyaparmitra.ai</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Phone className="w-3.5 h-3.5 text-[#8B5CF6]" />
                  <span>+91 98450 82134</span>
                </li>
                <li className="flex items-start space-x-2">
                  <MapPin className="w-3.5 h-3.5 text-[#8B5CF6] shrink-0 mt-0.5" />
                  <span>HSR Layout, Sector 4, Bengaluru, Karnataka 560102</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar with Terms & Privacy Modals Trigger */}
          <div className="mt-12 pt-6 border-t border-[#1F3427] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
            <p>© 2026 VyaparMitra AI Inc. All rights reserved. Crafted for Indian Retailers.</p>
            <div className="flex items-center space-x-6">
              <button
                onClick={() => setShowTermsModal(true)}
                className="hover:text-white hover:underline transition-colors"
              >
                Terms of Service
              </button>
              <button
                onClick={() => setShowPrivacyModal(true)}
                className="hover:text-white hover:underline transition-colors"
              >
                Privacy Policy
              </button>
              <button
                onClick={() => setShowPrivacyModal(true)}
                className="hover:text-white hover:underline transition-colors"
              >
                Security & Isolation
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* TERMS OF SERVICE MODAL */}
      <AnimatePresence>
        {showTermsModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-2xl w-full bg-[#142319] border border-[#2A4D37] rounded-3xl p-6 sm:p-8 shadow-2xl max-h-[85vh] overflow-y-auto space-y-4"
            >
              <div className="flex items-center justify-between pb-4 border-b border-[#1F3427]">
                <div className="flex items-center space-x-2.5">
                  <FileText className="w-5 h-5 text-[#8B5CF6]" />
                  <h3 className="text-lg font-bold text-white">Terms of Service — VyaparMitra AI</h3>
                </div>
                <button
                  onClick={() => setShowTermsModal(false)}
                  className="p-1 rounded-xl text-[#9EAEA3] hover:text-white hover:bg-[#1F3D2B]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="text-xs text-[#C5BBA4] space-y-3 leading-relaxed">
                <p className="font-bold text-white">1. Acceptance of Terms</p>
                <p>By creating an account or accessing the VyaparMitra AI platform, you agree to be bound by these Terms of Service. If you are entering into this agreement on behalf of a retail store or business entity, you represent that you have the authority to bind such entity.</p>

                <p className="font-bold text-white">2. Business Workspace Isolation & Data Ownership</p>
                <p>Every registered user receives a distinct tenant workspace. All product catalogs, inventory levels, sales transactions, customer Udhaar records, and supplier invoices remain 100% your proprietary commercial property. VyaparMitra AI does not sell, monetize, or disclose your store figures to third parties.</p>

                <p className="font-bold text-white">3. Merchant Responsibilities</p>
                <p>You are responsible for maintaining the confidentiality of your login credentials and for ensuring GST invoice accuracy as required under applicable Indian tax regulations.</p>

                <p className="font-bold text-white">4. Subscription & Billing</p>
                <p>VyaparMitra AI offers a 30-day trial without obligation. Paid plans (Starter, Growth, Pro) are billed monthly or annually as selected by the shop owner.</p>
              </div>

              <div className="pt-4 border-t border-[#1F3427] flex justify-end">
                <button
                  onClick={() => setShowTermsModal(false)}
                  className="px-5 py-2.5 rounded-xl bg-[#8B5CF6] text-white font-bold text-xs"
                >
                  Understood & Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* PRIVACY POLICY MODAL */}
      <AnimatePresence>
        {showPrivacyModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-2xl w-full bg-[#142319] border border-[#2A4D37] rounded-3xl p-6 sm:p-8 shadow-2xl max-h-[85vh] overflow-y-auto space-y-4"
            >
              <div className="flex items-center justify-between pb-4 border-b border-[#1F3427]">
                <div className="flex items-center space-x-2.5">
                  <Lock className="w-5 h-5 text-[#8B5CF6]" />
                  <h3 className="text-lg font-bold text-white">Privacy & Multi-Tenant Isolation Policy</h3>
                </div>
                <button
                  onClick={() => setShowPrivacyModal(false)}
                  className="p-1 rounded-xl text-[#9EAEA3] hover:text-white hover:bg-[#1F3D2B]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="text-xs text-[#C5BBA4] space-y-3 leading-relaxed">
                <p className="font-bold text-white">1. Cryptographic Tenant Boundaries</p>
                <p>VyaparMitra AI utilizes server-side cryptographic JWT token identification. Every database query, report generation, and invoice print operation is validated against the authenticated user's workspace shop ID. User A cannot access User B's records under any circumstance.</p>

                <p className="font-bold text-white">2. Customer Khata & Contact Privacy</p>
                <p>Phone numbers and debt balances recorded in your Udhaar ledger are accessible only by your shop staff. WhatsApp reminders are initiated client-side or through authorized business APIs with zero cross-merchant leakage.</p>

                <p className="font-bold text-white">3. Data Security & Storage</p>
                <p>All platform communication is encrypted using TLS 1.3. Periodic automated cloud snapshots protect your business against data loss.</p>
              </div>

              <div className="pt-4 border-t border-[#1F3427] flex justify-end">
                <button
                  onClick={() => setShowPrivacyModal(false)}
                  className="px-5 py-2.5 rounded-xl bg-[#8B5CF6] text-white font-bold text-xs"
                >
                  Close Privacy Policy
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
