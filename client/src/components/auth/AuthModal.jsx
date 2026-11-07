import React, { useState } from 'react';
import Modal from '../ui/Modal.jsx';
import { useStore } from '../../context/StoreContext.jsx';
import { Users, UserPlus, LogIn, Store, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';

export default function AuthModal({ isOpen, onClose }) {
  const { currentUser, switchUser, registerNewUser, loginUser, demoAccounts } = useStore();
  const [activeTab, setActiveTab] = useState('switch'); // 'switch' | 'register' | 'login'

  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    shop_name: '',
    city: 'Mumbai',
    state: 'Maharashtra'
  });
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleQuickSwitch = async (email) => {
    setLoading(true);
    setErrorMsg('');
    const success = await switchUser(email);
    setLoading(false);
    if (success) {
      onClose();
    } else {
      setErrorMsg('Failed to switch workspace.');
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    const result = await loginUser(loginForm.email, loginForm.password);
    setLoading(false);
    if (result.success) {
      onClose();
    } else {
      setErrorMsg(result.error || 'Login failed.');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    const result = await registerNewUser(registerForm);
    setLoading(false);
    if (result.success) {
      onClose();
    } else {
      setErrorMsg(result.error || 'Registration failed.');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="User Accounts & Workspaces"
      subtitle="Strict user-level data isolation. Every user has an independent business dataset."
      maxWidth="max-w-xl"
    >
      <div className="space-y-5">
        {/* Navigation Tabs */}
        <div className="flex border-b border-[#243D2D] space-x-4 text-xs font-bold">
          <button
            onClick={() => { setActiveTab('switch'); setErrorMsg(''); }}
            className={`pb-2.5 transition-colors flex items-center space-x-1.5 ${activeTab === 'switch' ? 'text-[#8B5CF6] border-b-2 border-[#8B5CF6]' : 'text-[#9EAEA3] hover:text-[#F5EFE6]'}`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Switch User (A / B)</span>
          </button>
          <button
            onClick={() => { setActiveTab('register'); setErrorMsg(''); }}
            className={`pb-2.5 transition-colors flex items-center space-x-1.5 ${activeTab === 'register' ? 'text-[#8B5CF6] border-b-2 border-[#8B5CF6]' : 'text-[#9EAEA3] hover:text-[#F5EFE6]'}`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Register New User</span>
          </button>
          <button
            onClick={() => { setActiveTab('login'); setErrorMsg(''); }}
            className={`pb-2.5 transition-colors flex items-center space-x-1.5 ${activeTab === 'login' ? 'text-[#8B5CF6] border-b-2 border-[#8B5CF6]' : 'text-[#9EAEA3] hover:text-[#F5EFE6]'}`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Existing Login</span>
          </button>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800/60 text-xs text-rose-300">
            {errorMsg}
          </div>
        )}

        {/* TAB 1: QUICK SWITCH (USER A VS USER B) */}
        {activeTab === 'switch' && (
          <div className="space-y-3">
            <p className="text-xs text-[#9EAEA3]">
              Select a pre-seeded account to test complete multi-tenant dataset isolation:
            </p>

            <div className="space-y-2.5">
              {demoAccounts.map((acc, idx) => {
                const isActive = currentUser.email.toLowerCase() === acc.email.toLowerCase();
                return (
                  <div
                    key={idx}
                    onClick={() => !isActive && !loading && handleQuickSwitch(acc.email)}
                    className={`
                      p-4 rounded-2xl border transition-all text-left flex items-center justify-between
                      ${isActive 
                        ? 'bg-[#18291E] border-[#8B5CF6] shadow-purple-glow/10 cursor-default' 
                        : 'bg-[#142319] border-[#243D2D] hover:border-[#2D4B38] hover:bg-[#18291E] cursor-pointer'}
                    `}
                  >
                    <div className="flex items-center space-x-3.5 truncate">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-extrabold text-xs shrink-0 ${
                        isActive ? 'bg-[#8B5CF6] text-white shadow-purple-glow' : 'bg-[#0E1B13] text-[#E8DCC4] border border-[#243D2D]'
                      }`}>
                        {acc.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="truncate">
                        <div className="flex items-center space-x-2">
                          <p className="text-sm font-bold text-[#F5EFE6]">{acc.name}</p>
                          {isActive && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-[#8B5CF6] text-white uppercase tracking-wider">
                              Active Workspace
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-[#E8DCC4] font-medium flex items-center mt-0.5">
                          <Store className="w-3.5 h-3.5 mr-1 text-[#8B5CF6]" /> {acc.shop_name}
                        </p>
                        <p className="text-[11px] text-[#9EAEA3]">{acc.email} • {acc.location}</p>
                      </div>
                    </div>

                    {!isActive && (
                      <button
                        type="button"
                        disabled={loading}
                        className="px-3.5 py-1.5 rounded-xl bg-[#1F3D2B] hover:bg-[#28523A] text-[#F5EFE6] text-xs font-bold transition-colors flex items-center space-x-1 shrink-0"
                      >
                        <span>Switch</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: REGISTER NEW USER & STORE */}
        {activeTab === 'register' && (
          <form onSubmit={handleRegister} className="space-y-3.5 text-xs">
            <p className="text-[#9EAEA3]">
              Register a brand new user to automatically provision an independent, dedicated business workspace:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-[#E8DCC4] mb-1">Your Full Name *</label>
                <input
                  type="text"
                  required
                  value={registerForm.name}
                  onChange={e => setRegisterForm({ ...registerForm, name: e.target.value })}
                  placeholder="e.g. Vikram Sharma"
                  className="w-full px-3 py-2 rounded-xl bg-[#18291E] border border-[#243D2D] text-[#F5EFE6] focus:outline-none focus:border-[#8B5CF6]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#E8DCC4] mb-1">Shop / Store Name *</label>
                <input
                  type="text"
                  required
                  value={registerForm.shop_name}
                  onChange={e => setRegisterForm({ ...registerForm, shop_name: e.target.value })}
                  placeholder="e.g. Sharma Kirana Store"
                  className="w-full px-3 py-2 rounded-xl bg-[#18291E] border border-[#243D2D] text-[#F5EFE6] focus:outline-none focus:border-[#8B5CF6]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#E8DCC4] mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={registerForm.email}
                  onChange={e => setRegisterForm({ ...registerForm, email: e.target.value })}
                  placeholder="vikram@sharmaretail.in"
                  className="w-full px-3 py-2 rounded-xl bg-[#18291E] border border-[#243D2D] text-[#F5EFE6] focus:outline-none focus:border-[#8B5CF6]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#E8DCC4] mb-1">Password *</label>
                <input
                  type="password"
                  required
                  value={registerForm.password}
                  onChange={e => setRegisterForm({ ...registerForm, password: e.target.value })}
                  placeholder="Create password"
                  className="w-full px-3 py-2 rounded-xl bg-[#18291E] border border-[#243D2D] text-[#F5EFE6] focus:outline-none focus:border-[#8B5CF6]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#E8DCC4] mb-1">City</label>
                <input
                  type="text"
                  value={registerForm.city}
                  onChange={e => setRegisterForm({ ...registerForm, city: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#18291E] border border-[#243D2D] text-[#F5EFE6] focus:outline-none focus:border-[#8B5CF6]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#E8DCC4] mb-1">State</label>
                <input
                  type="text"
                  value={registerForm.state}
                  onChange={e => setRegisterForm({ ...registerForm, state: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#18291E] border border-[#243D2D] text-[#F5EFE6] focus:outline-none focus:border-[#8B5CF6]"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-[#243D2D] flex justify-end space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-bold text-[#9EAEA3] hover:bg-[#18291E]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-[#8B5CF6] hover:bg-[#7C3AED] text-white shadow-purple-glow"
              >
                {loading ? 'Registering...' : 'Create Isolated Workspace'}
              </button>
            </div>
          </form>
        )}

        {/* TAB 3: EXISTING USER LOGIN */}
        {activeTab === 'login' && (
          <form onSubmit={handleLogin} className="space-y-3.5 text-xs">
            <div>
              <label className="block font-bold text-[#E8DCC4] mb-1">Email Address *</label>
              <input
                type="email"
                required
                value={loginForm.email}
                onChange={e => setLoginForm({ ...loginForm, email: e.target.value })}
                placeholder="name@store.in"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#18291E] border border-[#243D2D] text-[#F5EFE6] focus:outline-none focus:border-[#8B5CF6]"
              />
            </div>

            <div>
              <label className="block font-bold text-[#E8DCC4] mb-1">Password</label>
              <input
                type="password"
                value={loginForm.password}
                onChange={e => setLoginForm({ ...loginForm, password: e.target.value })}
                placeholder="Enter password"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#18291E] border border-[#243D2D] text-[#F5EFE6] focus:outline-none focus:border-[#8B5CF6]"
              />
            </div>

            <div className="pt-3 border-t border-[#243D2D] flex justify-end space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-bold text-[#9EAEA3] hover:bg-[#18291E]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-[#1F3D2B] hover:bg-[#28523A] text-white"
              >
                {loading ? 'Logging in...' : 'Sign In to Workspace'}
              </button>
            </div>
          </form>
        )}
      </div>
    </Modal>
  );
}
