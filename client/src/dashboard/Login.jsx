import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, ArrowLeft, AlertCircle, RefreshCw, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { getAuthStatus, loginWithPassword, loginLocally } = useAuth();
  const navigate = useNavigate();

  const [loadingStatus, setLoadingStatus] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    fetchStatus();
  }, []);

  const fetchStatus = async () => {
    setLoadingStatus(true);
    setError('');
    setIsOffline(false);
    try {
      await getAuthStatus();
    } catch (err) {
      console.warn('Backend authentication service not reachable, offering local dashboard mode:', err.message);
      setIsOffline(true);
    } finally {
      setLoadingStatus(false);
    }
  };

  const handleEnterLocal = () => {
    // If backend is down, local login requires password matching our expected local bypass
    // But since the user wants standard password logic, we will enforce it
    if (password === 'siddarth@6596A') {
      loginLocally();
      navigate('/dashboard');
    } else {
      setError('Invalid local admin password');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      await loginWithPassword(email.trim(), password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed. Check your credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050508] flex items-center justify-center p-6 relative overflow-hidden text-slate-100">
      <Link
        to="/"
        className="absolute top-8 left-8 flex items-center gap-2 font-mono text-xs text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft size={16} />
        <span>BACK TO PORTFOLIO</span>
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md glass-panel p-8 sm:p-10 rounded-3xl border border-white/[0.1] shadow-2xl relative z-10"
      >
        {loadingStatus ? (
          <div className="py-12 flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 rounded-full border-2 border-transparent border-t-cyan-400 border-r-emerald-400 animate-spin" />
            <span className="font-mono text-xs text-slate-400">CONNECTING SECURE SERVICE…</span>
          </div>
        ) : isOffline ? (
          <div className="flex flex-col items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-cyan-400 mb-2">
              <Lock size={22} />
            </div>

            <h1 className="font-display text-2xl font-bold text-white tracking-tight">
              Owner CMS Dashboard
            </h1>

            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed font-light">
              Enter offline admin password to access local persistence mode.
            </p>

            <form onSubmit={(e) => { e.preventDefault(); handleEnterLocal(); }} className="w-full flex flex-col gap-4 mt-2">
              <div>
                <input
                  type="password"
                  placeholder="Local Admin Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/[0.03] border border-white/[0.1] focus:border-cyan-400 rounded-xl px-4 py-3 text-sm font-mono text-white focus:outline-none transition-colors"
                  required
                />
              </div>

              {error && (
                <div className="flex items-center gap-2 text-rose-400 text-xs font-mono bg-rose-500/10 border border-rose-500/20 p-3 rounded-xl">
                  <AlertCircle size={14} className="shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3.5 rounded-full bg-white text-[#050508] font-mono text-xs font-semibold tracking-wider hover:bg-slate-200 transition-colors shadow-lg flex items-center justify-center gap-2"
              >
                <span>ENTER DASHBOARD</span>
                <ArrowLeft className="rotate-180" size={14} />
              </button>
            </form>

            <div className="w-full pt-4 mt-2 border-t border-white/[0.06] flex items-center justify-between font-mono text-[11px] text-slate-500">
              <span>LOCAL PERSISTENCE: READY</span>
              <button onClick={fetchStatus} className="text-cyan-400 hover:underline flex items-center gap-1">
                <RefreshCw size={11} /> Retry API
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-11 h-11 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-emerald-400">
                <Shield size={20} />
              </div>
              <div>
                <h1 className="font-display text-xl sm:text-2xl font-bold text-white tracking-tight">
                  Owner Security Portal
                </h1>
                <span className="text-[11px] font-mono text-emerald-400">Restricted Access</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-2 uppercase tracking-wider">
                  Admin Email
                </label>
                <input
                  type="email"
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/[0.03] border border-white/[0.1] focus:border-cyan-400 rounded-xl px-4 py-3 text-sm font-mono text-white focus:outline-none transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-2 uppercase tracking-wider">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/[0.03] border border-white/[0.1] focus:border-cyan-400 rounded-xl px-4 py-3 text-sm font-mono text-white focus:outline-none transition-colors"
                  required
                />
              </div>

              {error && (
                <div className="flex items-center gap-2 text-rose-400 text-xs font-mono bg-rose-500/10 border border-rose-500/20 p-3 rounded-xl">
                  <AlertCircle size={14} className="shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 rounded-full bg-white text-[#050508] font-mono text-xs font-semibold tracking-wider hover:bg-slate-200 transition-colors shadow-lg disabled:opacity-50 mt-2"
              >
                {submitting ? 'VERIFYING…' : 'SIGN IN TO DASHBOARD'}
              </button>
            </form>
          </div>
        )}
      </motion.div>
    </div>
  );
}
