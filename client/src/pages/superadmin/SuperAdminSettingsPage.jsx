import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Settings,
  ShieldCheck,
  Save,
  CheckCircle2,
  AlertTriangle,
  Server,
  Mail,
  Phone,
  Clock,
  Layers,
  X
} from 'lucide-react';
import { useStore } from '../../context/StoreContext.jsx';

export default function SuperAdminSettingsPage() {
  const { fetchPlatformSettings, updatePlatformSettings } = useStore();

  const [settings, setSettings] = useState({
    platform_name: 'VyaparMitra AI',
    support_email: 'support@vyaparmitra.ai',
    support_phone: '+91 98450 82134',
    maintenance_mode: false,
    allow_new_registrations: true,
    trial_days: 30,
    default_currency: '₹',
    gst_default_enabled: true
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await fetchPlatformSettings();
        if (data) setSettings(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      const updated = await updatePlatformSettings(settings);
      setSettings(updated);
      setSuccessMsg('Platform configuration updated and broadcast across all cluster nodes.');
    } catch (err) {
      setErrorMsg(err.message || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1F3427]">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            Platform Global Configurations
            <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-[#1F3D2B] text-[#E8DCC4] border border-[#2F523B]">
              Master Controls
            </span>
          </h1>
          <p className="text-xs text-[#9EAEA3] mt-1">
            Configure system-wide parameters, maintenance switches, and onboarding policies
          </p>
        </div>
      </div>

      {successMsg && (
        <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-800/80 text-xs text-emerald-300 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{successMsg}</span>
          </div>
          <button onClick={() => setSuccessMsg('')} className="text-emerald-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {errorMsg && (
        <div className="p-3.5 rounded-2xl bg-rose-950/40 border border-rose-800/80 text-xs text-rose-300 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
          <button onClick={() => setErrorMsg('')} className="text-rose-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
        {/* Card 1: Core Identity & Contact */}
        <div className="p-6 rounded-3xl bg-[#122016] border border-[#1F3427] space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 pb-2 border-b border-[#1F3427]">
            <Server className="w-4 h-4 text-[#8B5CF6]" />
            <span>Brand Identity & Merchant Support</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#E8DCC4] mb-1.5">
                Platform Name
              </label>
              <input
                type="text"
                value={settings.platform_name}
                onChange={(e) => setSettings({ ...settings, platform_name: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0E1711] border border-[#243D2D] text-xs text-white focus:outline-none focus:border-[#8B5CF6]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#E8DCC4] mb-1.5">
                Support Email
              </label>
              <input
                type="email"
                value={settings.support_email}
                onChange={(e) => setSettings({ ...settings, support_email: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0E1711] border border-[#243D2D] text-xs text-white focus:outline-none focus:border-[#8B5CF6]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#E8DCC4] mb-1.5">
                Emergency Helpline Phone
              </label>
              <input
                type="text"
                value={settings.support_phone}
                onChange={(e) => setSettings({ ...settings, support_phone: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0E1711] border border-[#243D2D] text-xs text-white focus:outline-none focus:border-[#8B5CF6]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#E8DCC4] mb-1.5">
                Default Pro Trial Duration (Days)
              </label>
              <input
                type="number"
                min="7"
                max="90"
                value={settings.trial_days}
                onChange={(e) => setSettings({ ...settings, trial_days: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0E1711] border border-[#243D2D] text-xs text-white focus:outline-none focus:border-[#8B5CF6]"
              />
            </div>
          </div>
        </div>

        {/* Card 2: Platform Controls & Switches */}
        <div className="p-6 rounded-3xl bg-[#122016] border border-[#1F3427] space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 pb-2 border-b border-[#1F3427]">
            <ShieldCheck className="w-4 h-4 text-[#8B5CF6]" />
            <span>Platform Operation Switches</span>
          </h3>

          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-[#0E1711] border border-[#1F3427] flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-white">Platform Maintenance Mode</p>
                <p className="text-[11px] text-[#9EAEA3]">
                  When active, non-admin merchants see a scheduled maintenance notice.
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.maintenance_mode}
                  onChange={(e) => setSettings({ ...settings, maintenance_mode: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-600" />
              </label>
            </div>

            <div className="p-4 rounded-2xl bg-[#0E1711] border border-[#1F3427] flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-white">Allow Public Self-Serve Registrations</p>
                <p className="text-[11px] text-[#9EAEA3]">
                  Allow new retail shop owners to register without admin invitation.
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.allow_new_registrations}
                  onChange={(e) => setSettings({ ...settings, allow_new_registrations: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600" />
              </label>
            </div>

            <div className="p-4 rounded-2xl bg-[#0E1711] border border-[#1F3427] flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-white">Default GST Invoicing Configuration</p>
                <p className="text-[11px] text-[#9EAEA3]">
                  Automatically configure CGST/SGST tax slabs for new workspaces.
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.gst_default_enabled}
                  onChange={(e) => setSettings({ ...settings, gst_default_enabled: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#8B5CF6]" />
              </label>
            </div>
          </div>
        </div>

        {/* Save Action */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 rounded-2xl bg-[#8B5CF6] hover:bg-[#7C3AED] text-white text-xs font-bold shadow-purple-glow hover:shadow-lg transition-all flex items-center space-x-2"
          >
            {saving ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Platform Configurations</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
