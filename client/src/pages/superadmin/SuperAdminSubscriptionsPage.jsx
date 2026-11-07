import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  CreditCard,
  TrendingUp,
  Store,
  CheckCircle2,
  DollarSign,
  Package,
  Layers,
  Sparkles,
  Zap,
  ShieldCheck
} from 'lucide-react';
import { useStore } from '../../context/StoreContext.jsx';
import { formatINR } from '../../utils/formatters.js';

export default function SuperAdminSubscriptionsPage() {
  const { fetchSuperAdminSubscriptions } = useStore();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await fetchSuperAdminSubscriptions();
      setData(res);
    } catch (err) {
      setError(err.message || 'Failed to load subscription metrics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const totalMRR = data?.totalMRR || 4496;
  const plans = data?.plans || [
    {
      id: 'plan-starter',
      name: 'Starter Plan',
      price: 499,
      billing_interval: 'month',
      activeShopsCount: 1,
      mrrGenerated: 499,
      features: ['Up to 500 SKUs', 'Single Terminal POS', 'Standard Khata Ledger', 'Email Support']
    },
    {
      id: 'plan-growth',
      name: 'Growth Plan',
      price: 999,
      billing_interval: 'month',
      activeShopsCount: 2,
      mrrGenerated: 1998,
      features: ['Up to 2,500 SKUs', 'Multi-Terminal POS', 'WhatsApp Reminders', 'Standard AI Insights']
    },
    {
      id: 'plan-pro',
      name: 'Pro Enterprise',
      price: 1999,
      billing_interval: 'month',
      activeShopsCount: 1,
      mrrGenerated: 1999,
      features: ['Unlimited Catalog Items', 'Full AI Copilot Suite', 'Multi-Role Staff RBAC', 'Priority 24/7 Support']
    }
  ];

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1F3427]">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            Subscriptions & Recurring Revenue (MRR)
            <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-[#8B5CF6] text-white">
              SaaS Control
            </span>
          </h1>
          <p className="text-xs text-[#9EAEA3] mt-1">
            Track subscription tiers, commercial adoption velocity, and cash flow generation
          </p>
        </div>
      </div>

      {error && (
        <div className="p-3.5 rounded-2xl bg-rose-950/40 border border-rose-800/80 text-xs text-rose-300">
          {error}
        </div>
      )}

      {/* Top MRR Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-3xl bg-[#122016] border border-[#1F3427]">
          <p className="text-xs font-bold text-[#9EAEA3]">Total Monthly Recurring Revenue</p>
          <p className="text-3xl font-black text-[#8B5CF6] font-mono mt-1">
            {formatINR(totalMRR)}
          </p>
          <p className="text-[11px] text-[#6E7F74] mt-1">Direct monthly subscription runs</p>
        </div>

        <div className="p-5 rounded-3xl bg-[#122016] border border-[#1F3427]">
          <p className="text-xs font-bold text-[#9EAEA3]">Annualized Run Rate (ARR)</p>
          <p className="text-3xl font-black text-emerald-400 font-mono mt-1">
            {formatINR(totalMRR * 12)}
          </p>
          <p className="text-[11px] text-emerald-400 font-semibold mt-1">Projected 12-month platform yield</p>
        </div>

        <div className="p-5 rounded-3xl bg-[#122016] border border-[#1F3427]">
          <p className="text-xs font-bold text-[#9EAEA3]">Paying Retail Shops</p>
          <p className="text-3xl font-black text-[#E8DCC4] font-mono mt-1">
            {plans.reduce((sum, p) => sum + p.activeShopsCount, 0)} Shops
          </p>
          <p className="text-[11px] text-[#6E7F74] mt-1">100% active collection rate</p>
        </div>
      </div>

      {/* Subscription Plans Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => {
          const isPro = plan.price >= 1500;
          return (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-6 rounded-3xl border flex flex-col justify-between ${
                isPro
                  ? 'bg-gradient-to-b from-[#1A2E21] to-[#121F16] border-[#8B5CF6]/60 shadow-purple-glow'
                  : 'bg-[#122016] border-[#1F3427]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-white">{plan.name}</h3>
                  <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full ${
                    isPro ? 'bg-[#8B5CF6] text-white shadow-purple-glow' : 'bg-[#1F3D2B] text-[#E8DCC4] border border-[#2F523B]'
                  }`}>
                    {plan.activeShopsCount} Active Shops
                  </span>
                </div>

                <div className="flex items-baseline space-x-1 mb-4">
                  <span className="text-3xl font-black font-mono text-white">
                    {formatINR(plan.price)}
                  </span>
                  <span className="text-xs text-[#9EAEA3]">/ month</span>
                </div>

                <div className="p-3 rounded-2xl bg-[#0E1711] border border-[#1F3427] mb-5 text-xs">
                  <div className="flex justify-between items-center text-[#9EAEA3]">
                    <span>Monthly MRR Contribution:</span>
                    <span className="font-mono font-bold text-emerald-400">
                      {formatINR(plan.mrrGenerated || (plan.activeShopsCount * plan.price))}
                    </span>
                  </div>
                </div>

                <ul className="space-y-2.5 text-xs text-[#C5BBA4]">
                  {(plan.features || []).map((feat, i) => (
                    <li key={i} className="flex items-center space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 pt-4 border-t border-[#1F3427] text-center">
                <span className="text-[11px] text-[#6E7F74] font-medium">
                  Default provisioned with 30-day trial
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
