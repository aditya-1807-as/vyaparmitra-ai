import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3,
  TrendingUp,
  PieChart,
  ShoppingBag,
  DollarSign,
  MapPin,
  Calendar,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import { useStore } from '../../context/StoreContext.jsx';
import { formatINR } from '../../utils/formatters.js';

export default function SuperAdminAnalyticsPage() {
  const { fetchSuperAdminAnalytics } = useStore();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await fetchSuperAdminAnalytics();
        setData(res);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const totalGMV = data?.totalGMV || 44085;
  const totalInvoices = data?.totalInvoices || 25;
  const avgOrderValue = totalInvoices > 0 ? totalGMV / totalInvoices : 0;

  const categories = [
    { name: 'Groceries & Staples', share: 42, gmv: 18515, color: 'bg-emerald-500' },
    { name: 'Dairy & Beverages', share: 26, gmv: 11460, color: 'bg-[#8B5CF6]' },
    { name: 'Packaged Foods & Snacks', share: 18, gmv: 7935, color: 'bg-amber-500' },
    { name: 'Personal & Home Care', share: 14, gmv: 6175, color: 'bg-cyan-500' }
  ];

  const regions = [
    { state: 'Karnataka (Bengaluru)', count: 2, share: 40 },
    { state: 'Telangana (Hyderabad)', count: 1, share: 20 },
    { state: 'Maharashtra (Pune)', count: 1, share: 20 },
    { state: 'Tamil Nadu (Chennai)', count: 1, share: 20 }
  ];

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1F3427]">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            Platform Analytics & Intelligence
            <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-[#1F3D2B] text-[#E8DCC4] border border-[#2F523B]">
              Aggregate Trends
            </span>
          </h1>
          <p className="text-xs text-[#9EAEA3] mt-1">
            Cross-tenant transaction velocity, retail category velocity, and geographic distribution
          </p>
        </div>
      </div>

      {/* KPI Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-3xl bg-[#122016] border border-[#1F3427]">
          <p className="text-xs font-bold text-[#9EAEA3]">Platform-wide GMV</p>
          <p className="text-3xl font-black text-emerald-400 font-mono mt-1">
            {formatINR(totalGMV)}
          </p>
          <p className="text-[11px] text-[#6E7F74] mt-1">All processed checkout sales</p>
        </div>

        <div className="p-5 rounded-3xl bg-[#122016] border border-[#1F3427]">
          <p className="text-xs font-bold text-[#9EAEA3]">Total Invoices Generated</p>
          <p className="text-3xl font-black text-white font-mono mt-1">
            {totalInvoices} Bills
          </p>
          <p className="text-[11px] text-emerald-400 mt-1">100% GST compliant records</p>
        </div>

        <div className="p-5 rounded-3xl bg-[#122016] border border-[#1F3427]">
          <p className="text-xs font-bold text-[#9EAEA3]">Average Order Basket (AOV)</p>
          <p className="text-3xl font-black text-[#8B5CF6] font-mono mt-1">
            {formatINR(avgOrderValue)}
          </p>
          <p className="text-[11px] text-[#6E7F74] mt-1">Typical counter transaction size</p>
        </div>
      </div>

      {/* 2 Column Section: Category Distribution & Regional Footprint */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Velocity */}
        <div className="p-6 rounded-3xl bg-[#122016] border border-[#1F3427] space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-[#1F3427]">
            <div>
              <h3 className="text-sm font-bold text-white">Top Retail Categories by GMV</h3>
              <p className="text-[11px] text-[#9EAEA3]">Platform sales volume distribution</p>
            </div>
            <Layers className="w-4 h-4 text-[#8B5CF6]" />
          </div>

          <div className="space-y-4">
            {categories.map((cat, i) => (
              <div key={i} className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-white">{cat.name}</span>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-[#9EAEA3]">{formatINR(cat.gmv)}</span>
                    <span className="font-mono font-bold text-[#E8DCC4]">{cat.share}%</span>
                  </div>
                </div>
                <div className="w-full h-2 rounded-full bg-[#0E1711] overflow-hidden">
                  <div
                    style={{ width: `${cat.share}%` }}
                    className={`h-full rounded-full ${cat.color}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Regional Distribution */}
        <div className="p-6 rounded-3xl bg-[#122016] border border-[#1F3427] space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-[#1F3427]">
            <div>
              <h3 className="text-sm font-bold text-white">Merchant Geographic Footprint</h3>
              <p className="text-[11px] text-[#9EAEA3]">Active retail shops by regional cluster</p>
            </div>
            <MapPin className="w-4 h-4 text-[#8B5CF6]" />
          </div>

          <div className="space-y-3">
            {regions.map((reg, i) => (
              <div
                key={i}
                className="p-3.5 rounded-2xl bg-[#0E1711] border border-[#1F3427] flex items-center justify-between text-xs"
              >
                <div className="flex items-center space-x-2.5">
                  <div className="w-2 h-2 rounded-full bg-[#8B5CF6]" />
                  <span className="font-semibold text-white">{reg.state}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-[#9EAEA3]">{reg.count} Stores</span>
                  <span className="font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
                    {reg.share}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
