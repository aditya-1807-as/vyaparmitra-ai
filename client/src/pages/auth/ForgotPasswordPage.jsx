import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, Mail, ArrowRight, ArrowLeft, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 700);
  };

  return (
    <div className="min-h-screen bg-[#0C140E] text-[#F5EFE6] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[550px] h-[300px] bg-[#8B5CF6]/10 blur-[130px] rounded-full pointer-events-none" />

      {/* Back to Login Link */}
      <div className="absolute top-6 left-6 sm:top-8 sm:left-8">
        <Link
          to="/login"
          className="inline-flex items-center space-x-2 text-xs font-bold text-[#9EAEA3] hover:text-[#F5EFE6] bg-[#142319] hover:bg-[#1A2E21] border border-[#243D2D] py-2 px-3.5 rounded-xl transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Sign In</span>
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center space-x-2.5 group mb-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#1F3D2B] to-[#142319] border border-[#2F523B] flex items-center justify-center shadow-lg group-hover:border-[#8B5CF6] transition-all">
            <Sparkles className="w-6 h-6 text-[#8B5CF6] animate-pulse" />
          </div>
          <span className="text-2xl font-black text-[#F5EFE6] tracking-tight">
            Vyapar<span className="text-[#8B5CF6]">Mitra</span> AI
          </span>
        </Link>
        <h2 className="text-2xl font-black text-white tracking-tight">
          Password Recovery
        </h2>
        <p className="mt-1 text-xs text-[#9EAEA3]">
          Reset your credentials to regain access to your shop workspace
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#121F16] border border-[#243D2D] rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6"
        >
          {submitted ? (
            <div className="text-center space-y-4 py-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto shadow-lg">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-white">Reset Link Dispatched</h3>
              <p className="text-xs text-[#C5BBA4] leading-relaxed">
                If an account exists with <span className="text-white font-semibold font-mono">{email}</span>, we have sent password reset instructions and a secure one-time link.
              </p>
              <div className="p-3 rounded-xl bg-[#142319] border border-[#243D2D] text-[11px] text-[#9EAEA3]">
                💡 <span className="font-bold text-[#E8DCC4]">Prototype Note:</span> In this demonstration environment, default accounts use password <code className="text-[#8B5CF6] font-mono">password123</code> (or <code className="text-[#8B5CF6] font-mono">SuperAdmin@2026</code> for platform administrator).
              </div>
              <Link
                to="/login"
                className="inline-flex items-center justify-center w-full py-3 px-4 rounded-xl bg-[#8B5CF6] text-white font-bold text-xs shadow-purple-glow"
              >
                Return to Sign In
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#E8DCC4] mb-1.5">
                  Your Registered Email
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

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3 px-4 rounded-xl bg-[#8B5CF6] hover:bg-[#7C3AED] disabled:opacity-50 text-white font-bold text-sm shadow-purple-glow hover:shadow-lg transition-all flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Send Reset Instructions</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="pt-4 border-t border-[#1F3427] text-center text-xs text-[#9EAEA3]">
                <span>Remembered your password? </span>
                <Link to="/login" className="font-bold text-[#8B5CF6] hover:underline">
                  Sign in →
                </Link>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
}
