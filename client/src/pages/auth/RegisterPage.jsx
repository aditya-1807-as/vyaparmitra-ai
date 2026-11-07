import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  User, 
  Store, 
  Mail, 
  Phone, 
  MapPin, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  AlertCircle, 
  CheckCircle2, 
  ShieldCheck,
  ArrowLeft
} from 'lucide-react';
import { useStore } from '../../context/StoreContext.jsx';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { registerNewUser } = useStore();

  const [formData, setFormData] = useState({
    name: '',
    shop_name: '',
    email: '',
    phone: '',
    city: '',
    state: '',
    password: '',
    confirm_password: '',
    agree_terms: false
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const calculatePasswordStrength = (pwd) => {
    if (!pwd) return { score: 0, text: 'Empty', color: 'bg-zinc-700' };
    let s = 0;
    if (pwd.length >= 8) s += 1;
    if (/[A-Z]/.test(pwd)) s += 1;
    if (/[0-9]/.test(pwd)) s += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) s += 1;

    if (s <= 1) return { score: 1, text: 'Weak', color: 'bg-rose-500' };
    if (s <= 3) return { score: 2, text: 'Medium', color: 'bg-amber-500' };
    return { score: 3, text: 'Strong', color: 'bg-emerald-500' };
  };

  const strength = calculatePasswordStrength(formData.password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (formData.password !== formData.confirm_password) {
      setErrorMessage('Passwords do not match. Please verify.');
      return;
    }

    if (formData.password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    if (!formData.agree_terms) {
      setErrorMessage('You must agree to the Terms of Service & Privacy Policy.');
      return;
    }

    setLoading(true);

    try {
      const res = await registerNewUser({
        name: formData.name.trim(),
        shop_name: formData.shop_name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        city: `${formData.city.trim()}, ${formData.state.trim()}`,
        password: formData.password
      });

      if (res.success) {
        navigate('/dashboard', { replace: true });
      } else {
        setErrorMessage(res.error || 'Registration failed.');
      }
    } catch (err) {
      setErrorMessage(err.message || 'Unable to complete registration.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0C140E] text-[#F5EFE6] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-[#8B5CF6]/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute top-10 left-10 w-80 h-80 bg-[#1F3D2B]/30 blur-[120px] rounded-full pointer-events-none" />

      {/* Back to Home Link */}
      <div className="absolute top-6 left-6 sm:top-8 sm:left-8">
        <Link
          to="/"
          className="inline-flex items-center space-x-2 text-xs font-bold text-[#9EAEA3] hover:text-[#F5EFE6] bg-[#142319] hover:bg-[#1A2E21] border border-[#243D2D] py-2 px-3.5 rounded-xl transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Homepage</span>
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-xl text-center">
        <Link to="/" className="inline-flex items-center space-x-2.5 group mb-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#1F3D2B] to-[#142319] border border-[#2F523B] flex items-center justify-center shadow-lg group-hover:border-[#8B5CF6] transition-all">
            <Sparkles className="w-6 h-6 text-[#8B5CF6] animate-pulse" />
          </div>
          <span className="text-2xl font-black text-[#F5EFE6] tracking-tight">
            Vyapar<span className="text-[#8B5CF6]">Mitra</span> AI
          </span>
        </Link>
        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Create Your Free Shop Account
        </h2>
        <p className="mt-1 text-xs text-[#9EAEA3]">
          Full 30-day Pro trial with automatic isolated cloud workspace provisioning
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl px-4 sm:px-0">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#121F16] border border-[#243D2D] rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6"
        >
          {/* Error Banner */}
          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="p-3.5 rounded-xl bg-rose-950/50 border border-rose-800/80 flex items-start space-x-2.5 text-xs text-rose-300"
            >
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div className="leading-relaxed">{errorMessage}</div>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Grid Row 1: Merchant Name & Shop Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#E8DCC4] mb-1.5">
                  Full Name (Shop Owner) *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#9EAEA3]">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Suresh Kumar"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#0E1711] border border-[#243D2D] text-sm text-[#F5EFE6] placeholder-[#6E7F74] focus:outline-none focus:border-[#8B5CF6] transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#E8DCC4] mb-1.5">
                  Retail Store / Business Name *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#9EAEA3]">
                    <Store className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={formData.shop_name}
                    onChange={(e) => setFormData({ ...formData, shop_name: e.target.value })}
                    placeholder="Shree Ganesh Kirana & Supermart"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#0E1711] border border-[#243D2D] text-sm text-[#F5EFE6] placeholder-[#6E7F74] focus:outline-none focus:border-[#8B5CF6] transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Grid Row 2: Email & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#E8DCC4] mb-1.5">
                  Business Email Address *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#9EAEA3]">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="suresh@ganeshkirana.com"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#0E1711] border border-[#243D2D] text-sm text-[#F5EFE6] placeholder-[#6E7F74] focus:outline-none focus:border-[#8B5CF6] transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#E8DCC4] mb-1.5">
                  Mobile Number (+91) *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#9EAEA3]">
                    <Phone className="w-4 h-4" />
                  </div>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98450 12345"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#0E1711] border border-[#243D2D] text-sm text-[#F5EFE6] placeholder-[#6E7F74] focus:outline-none focus:border-[#8B5CF6] transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Grid Row 3: City & State */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#E8DCC4] mb-1.5">
                  City / Town *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#9EAEA3]">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="Jaipur"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#0E1711] border border-[#243D2D] text-sm text-[#F5EFE6] placeholder-[#6E7F74] focus:outline-none focus:border-[#8B5CF6] transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#E8DCC4] mb-1.5">
                  State *
                </label>
                <input
                  type="text"
                  required
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  placeholder="Rajasthan"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0E1711] border border-[#243D2D] text-sm text-[#F5EFE6] placeholder-[#6E7F74] focus:outline-none focus:border-[#8B5CF6] transition-colors"
                />
              </div>
            </div>

            {/* Grid Row 4: Password & Confirm Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#E8DCC4] mb-1.5">
                  Create Password *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#9EAEA3]">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Min 6 characters"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[#0E1711] border border-[#243D2D] text-sm text-[#F5EFE6] placeholder-[#6E7F74] focus:outline-none focus:border-[#8B5CF6] transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#9EAEA3] hover:text-[#F5EFE6]"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Password Strength Indicator */}
                {formData.password && (
                  <div className="mt-1.5 flex items-center space-x-2">
                    <div className="flex-1 h-1.5 rounded-full bg-zinc-800 overflow-hidden flex">
                      <div className={`h-full transition-all ${strength.color} ${strength.score === 1 ? 'w-1/3' : strength.score === 2 ? 'w-2/3' : 'w-full'}`} />
                    </div>
                    <span className="text-[10px] font-mono text-[#9EAEA3]">{strength.text}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#E8DCC4] mb-1.5">
                  Confirm Password *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#9EAEA3]">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.confirm_password}
                    onChange={(e) => setFormData({ ...formData, confirm_password: e.target.value })}
                    placeholder="Re-enter password"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#0E1711] border border-[#243D2D] text-sm text-[#F5EFE6] placeholder-[#6E7F74] focus:outline-none focus:border-[#8B5CF6] transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Terms Checkbox */}
            <div className="pt-2">
              <label className="flex items-start space-x-2.5 text-xs text-[#9EAEA3] cursor-pointer">
                <input
                  type="checkbox"
                  required
                  checked={formData.agree_terms}
                  onChange={(e) => setFormData({ ...formData, agree_terms: e.target.checked })}
                  className="mt-0.5 w-4 h-4 rounded bg-[#0E1711] border-[#243D2D] text-[#8B5CF6] focus:ring-0 focus:ring-offset-0"
                />
                <span className="leading-relaxed">
                  I agree to the <span className="text-[#E8DCC4] font-semibold underline">Terms of Service</span> and acknowledge the strict <span className="text-[#8B5CF6] font-semibold underline">Multi-Tenant Data Isolation Policy</span>.
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 py-3.5 px-4 rounded-xl bg-[#8B5CF6] hover:bg-[#7C3AED] disabled:opacity-50 text-white font-bold text-sm shadow-purple-glow hover:shadow-lg transition-all flex items-center justify-center space-x-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Create Workspace & Start 30-Day Free Trial</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer Link */}
          <div className="pt-4 border-t border-[#1F3427] text-center text-xs text-[#9EAEA3]">
            <span>Already have an account? </span>
            <Link to="/login" className="font-bold text-[#8B5CF6] hover:underline">
              Sign in to store →
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
