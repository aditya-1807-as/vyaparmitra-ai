import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  AlertCircle, 
  ShieldCheck, 
  Store, 
  CheckCircle2,
  ArrowLeft
} from 'lucide-react';
import { useStore, DEMO_ACCOUNTS } from '../../context/StoreContext.jsx';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { loginUser } = useStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const from = location.state?.from?.pathname || null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMessage('Please provide both your registered email and password.');
      return;
    }

    setLoading(true);
    setErrorMessage('');

    try {
      const res = await loginUser(email.trim(), password);
      if (res.success) {
        if (res.isSuperAdmin) {
          navigate(from && from.startsWith('/super-admin') ? from : '/super-admin/dashboard', { replace: true });
        } else {
          navigate(from && !from.startsWith('/super-admin') ? from : '/dashboard', { replace: true });
        }
      } else {
        setErrorMessage(res.error || 'Authentication failed. Please verify credentials.');
      }
    } catch (err) {
      setErrorMessage(err.message || 'Unable to connect to the authentication service.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFill = (acc) => {
    setEmail(acc.email);
    if (acc.role === 'super_admin' || acc.is_superadmin) {
      setPassword('SuperAdmin@2026');
    } else {
      setPassword('password123');
    }
    setErrorMessage('');
  };

  return (
    <div className="min-h-screen bg-[#0C140E] text-[#F5EFE6] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-[#8B5CF6]/10 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-[#1F3D2B]/30 blur-[110px] rounded-full pointer-events-none" />

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

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        {/* Brand Logo */}
        <Link to="/" className="inline-flex items-center space-x-2.5 group mb-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#1F3D2B] to-[#142319] border border-[#2F523B] flex items-center justify-center shadow-lg group-hover:border-[#8B5CF6] transition-all">
            <Sparkles className="w-6 h-6 text-[#8B5CF6] animate-pulse" />
          </div>
          <span className="text-2xl font-black text-[#F5EFE6] tracking-tight">
            Vyapar<span className="text-[#8B5CF6]">Mitra</span> AI
          </span>
        </Link>
        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Sign In to Your Workspace
        </h2>
        <p className="mt-2 text-xs text-[#9EAEA3]">
          Access your isolated retail store dashboard or platform control plane
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#121F16] border border-[#243D2D] rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6"
        >
          {/* Quick Demo Persona Switcher */}
          <div className="space-y-2">
            <p className="text-[11px] font-bold uppercase tracking-wider text-[#9EAEA3] flex items-center justify-between">
              <span>Quick 1-Click Demo Personas</span>
              <span className="text-[10px] text-[#8B5CF6] font-mono">Instant Fill</span>
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {DEMO_ACCOUNTS.map((acc, idx) => {
                const isSelected = email === acc.email;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleQuickFill(acc)}
                    className={`p-2.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'bg-[#8B5CF6]/20 border-[#8B5CF6] text-white shadow-purple-glow'
                        : 'bg-[#16271C] border-[#243D2D] text-[#C5BBA4] hover:bg-[#1A2E21] hover:text-white'
                    }`}
                  >
                    <span className="text-[9px] font-black uppercase text-[#8B5CF6] tracking-wider">
                      {acc.tag || (acc.role === 'super_admin' ? 'ADMIN' : 'SHOP')}
                    </span>
                    <span className="text-[11px] font-bold truncate mt-1">
                      {acc.name.split(' ')[0]}
                    </span>
                    <span className="text-[9px] text-[#9EAEA3] truncate">
                      {acc.shop_name?.slice(0, 14)}...
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-[#1F3427] w-full" />
            <span className="bg-[#121F16] px-3 text-[10px] uppercase font-bold text-[#6E7F74] tracking-wider absolute">
              Or Use Your Credentials
            </span>
          </div>

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

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#E8DCC4] mb-1.5">
                Business Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#9EAEA3]">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ramesh@lakshmikirana.in"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#0E1711] border border-[#243D2D] text-sm text-[#F5EFE6] placeholder-[#6E7F74] focus:outline-none focus:border-[#8B5CF6] transition-colors"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-[#E8DCC4]">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-[11px] font-bold text-[#8B5CF6] hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#9EAEA3]">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
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
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center space-x-2 text-xs text-[#9EAEA3] cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded bg-[#0E1711] border-[#243D2D] text-[#8B5CF6] focus:ring-0 focus:ring-offset-0"
                />
                <span>Remember this workstation</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 px-4 rounded-xl bg-[#8B5CF6] hover:bg-[#7C3AED] disabled:opacity-50 text-white font-bold text-sm shadow-purple-glow hover:shadow-lg transition-all flex items-center justify-center space-x-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer inside Card */}
          <div className="pt-4 border-t border-[#1F3427] text-center text-xs text-[#9EAEA3]">
            <span>Don't have a shop account yet? </span>
            <Link to="/register" className="font-bold text-[#8B5CF6] hover:underline">
              Create free shop →
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
