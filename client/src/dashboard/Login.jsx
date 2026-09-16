import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Key, ArrowLeft, AlertCircle, Check, Copy, RefreshCw, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { getAuthStatus, setupTotp, loginWithTotp, regenerateQr, loginLocally } = useAuth();
  const navigate = useNavigate();

  const [loadingStatus, setLoadingStatus] = useState(true);
  const [isSetup, setIsSetup] = useState(false);
  const [qrCode, setQrCode] = useState('');
  const [secret, setSecret] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    fetchStatus();
  }, []);

  const fetchStatus = async () => {
    setLoadingStatus(true);
    setError('');
    setIsOffline(false);
    try {
      const data = await getAuthStatus();
      setIsSetup(data.isSetup);
      if (!data.isSetup) {
        setQrCode(data.qrCode);
        setSecret(data.secret);
      }
    } catch (err) {
      console.warn('Backend authentication service not reachable, offering local dashboard mode:', err.message);
      setIsOffline(true);
    } finally {
      setLoadingStatus(false);
    }
  };

  const handleEnterLocal = () => {
    loginLocally();
    navigate('/dashboard');
  };

  const handleRegenerate = async () => {
    setError('');
    try {
      const data = await regenerateQr();
      setQrCode(data.qrCode);
      setSecret(data.secret);
    } catch (err) {
      setError('Failed to regenerate QR code.');
    }
  };

  const handleCopySecret = () => {
    if (!secret) return;
    navigator.clipboard.writeText(secret);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!otp || otp.trim().length < 6) {
      setError('Please enter a valid 6-digit verification code.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      if (!isSetup) {
        await setupTotp(otp.trim());
      } else {
        await loginWithTotp(otp.trim());
      }
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Verification code failed. Please check your authenticator clock and try again.');
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
              You can access the dashboard to add and edit all sections (Hero, About, Education, Experience, Projects, Chronicles, Contact).
            </p>

            <button
              onClick={handleEnterLocal}
              className="w-full mt-4 py-3.5 rounded-full bg-white text-[#050508] font-mono text-xs font-semibold tracking-wider hover:bg-slate-200 transition-colors shadow-lg flex items-center justify-center gap-2"
            >
              <span>ENTER DASHBOARD</span>
              <ArrowLeft className="rotate-180" size={14} />
            </button>

            <div className="w-full pt-4 mt-2 border-t border-white/[0.06] flex items-center justify-between font-mono text-[11px] text-slate-500">
              <span>LOCAL PERSISTENCE: READY</span>
              <button onClick={fetchStatus} className="text-cyan-400 hover:underline flex items-center gap-1">
                <RefreshCw size={11} /> Retry API
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-emerald-400">
                {isSetup ? <Shield size={20} /> : <Key size={20} />}
              </div>
              <div>
                <h1 className="font-display text-xl sm:text-2xl font-bold text-white tracking-tight">
                  {isSetup ? 'Owner Security Portal' : 'Setup 2FA Authentication'}
                </h1>
                <span className="text-[11px] font-mono text-emerald-400">TOTP Authenticator</span>
              </div>
            </div>

            <p className="text-slate-300 text-xs sm:text-sm mb-6 leading-relaxed font-light">
              {isSetup
                ? 'Enter the live 6-digit code from Google Authenticator, Authy, or Apple Passwords to sign in.'
                : 'Scan the QR code below using any Authenticator app (Google Authenticator, Authy, Apple Passwords) to link your account.'}
            </p>

            <AnimatePresence mode="wait">
              {!isSetup && qrCode && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-6 flex flex-col items-center bg-white/[0.03] border border-white/10 rounded-2xl p-5"
                >
                  <div className="p-3 bg-white rounded-2xl shadow-xl border border-white/20 mb-4">
                    <img src={qrCode} alt="TOTP QR Code" className="w-44 h-44 object-contain" />
                  </div>

                  <div className="w-full text-center">
                    <p className="text-[11px] font-mono text-slate-400 mb-1.5 uppercase tracking-wider">
                      Or manually enter setup key
                    </p>
                    <div className="flex items-center justify-center gap-2">
                      <code className="px-3 py-1 bg-black/60 rounded-lg text-xs font-mono text-cyan-300 select-all border border-white/10">
                        {secret}
                      </code>
                      <button
                        type="button"
                        onClick={handleCopySecret}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
                        title="Copy Key"
                      >
                        {copied ? <Check className="text-emerald-400" size={14} /> : <Copy size={14} />}
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-2 uppercase tracking-wider">
                  6-Digit Verification Code
                </label>
                <input
                  type="text"
                  maxLength="6"
                  pattern="[0-9]*"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  placeholder="000000"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  className="w-full bg-white/[0.03] border border-white/[0.1] focus:border-cyan-400 rounded-xl px-4 py-3 text-center text-2xl font-mono tracking-[0.3em] text-white focus:outline-none transition-colors"
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
                {submitting ? 'VERIFYING…' : isSetup ? 'SIGN IN TO DASHBOARD' : 'ACTIVATE & CONTINUE'}
              </button>

              <div className="flex items-center justify-between pt-2 border-t border-white/[0.08] mt-3 font-mono text-xs text-slate-400">
                <button
                  type="button"
                  onClick={handleEnterLocal}
                  className="hover:text-white transition-colors"
                >
                  Bypass to Dashboard
                </button>
              </div>
            </form>
          </div>
        )}
      </motion.div>
    </div>
  );
}
