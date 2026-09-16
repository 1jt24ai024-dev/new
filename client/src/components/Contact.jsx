import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import api from '../api/axios';
import { formatExternalUrl } from '../utils/url';
import GradientWaves from './GradientWaves';

export default function Contact({ data = {}, heroSocials = [] }) {
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('idle'); // 'idle' | 'sending' | 'sent' | 'error'

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setStatus('sending');
    try {
      await api.post('/messages', form);
      setStatus('sent');
      setForm({ name: '', email: '', message: '' });
      setTimeout(() => setStatus('idle'), 5000);
    } catch {
      setStatus('error');
    }
  };

  // Social links from Dashboard: use data.socials or heroSocials as added in dashboard
  const socials = (data.socials && data.socials.length > 0) ? data.socials : (heroSocials || []);
  const hasImage = Boolean(data.image);

  return (
    <section id="contact" className="contact-arrival relative min-h-[600px] overflow-hidden pt-28 sm:pt-36 pb-16 sm:pb-20 px-5 sm:px-8 border-t border-white/[0.04]">
      <div className="absolute inset-0" aria-hidden="true">
        <GradientWaves
          horizonColor="#5227FF"
          waveColor="#FF9FFC"
          crestColor="#FFFFFF"
          speed={0.4}
          amplitude={2.5}
          waveScale={0.6}
          waveRatio={0.9}
          swell={35}
          turbulence={20}
          tilt={1.11}
          zoom={1.0}
          height={5.5}
          fogDepth={15}
          detail="medium"
          brightness={1.0}
          opacity={1.0}
          mouseInteraction={true}
          parallaxStrength={0.5}
          grain={true}
          grainIntensity={0.05}
        />
      </div>
      <div className="pointer-events-none absolute inset-0 z-[1] bg-[#050508]/35" aria-hidden="true" />
      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="section-heading mb-14 sm:mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="font-mono text-xs sm:text-sm tracking-[0.25em] text-slate-400 uppercase"
          >
            SCENE 07 · ENDING
          </motion.h2>
        </div>

        {/* Finale: Grid with image if present, or typography */}
        <div className={hasImage ? "grid lg:grid-cols-12 gap-12 lg:gap-16 items-center mb-16 sm:mb-24" : "mb-16 sm:mb-24"}>
          <div className={hasImage ? "lg:col-span-7" : "max-w-5xl"}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className={`font-display font-bold tracking-tight text-white leading-[1.05] ${
                hasImage ? "text-4xl sm:text-5xl lg:text-7xl" : "text-4xl sm:text-6xl md:text-7xl lg:text-8xl"
              }`}
            >
              <div>{data.heading || "LET'S BUILD SOMETHING INTERESTING."}</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="mt-10 flex flex-wrap items-center gap-6"
            >
              <button
                onClick={() => setFormOpen(!formOpen)}
                className="contact-cta group px-8 py-4 rounded-full bg-white text-[#050508] font-mono text-xs sm:text-sm font-semibold tracking-wider flex items-center gap-2 hover:bg-slate-200 hover:shadow-[0_0_25px_rgba(255,255,255,0.25)] transition-all active:scale-[0.98]"
              >
                <span>GET IN TOUCH</span>
                <ArrowUpRight
                  size={16}
                  className="transition-transform duration-300 group-hover:translate-x-1.5 group-hover:-translate-y-1.5"
                />
              </button>

              {data.email && (
                <a
                  href={`mailto:${data.email}`}
                  data-cursor="open"
                  className="font-mono text-xs sm:text-sm text-slate-400 hover:text-white px-4 py-2 rounded-full border border-white/[0.08] hover:border-white/30 bg-white/[0.02] hover:bg-white/[0.06] transition-all"
                >
                  {data.email}
                </a>
              )}
            </motion.div>

            <motion.figure
              initial={{ opacity: 0, y: 18, scale: .96 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="contact-connect-illustration"
              aria-label="Developer illustration"
            >
              <img
                src="/doodle-color-680-avatar-man-it-developer-hover-pinch.gif"
                alt="Animated developer illustration"
              />
              <figcaption>READY TO BUILD // LET'S CONNECT</figcaption>
            </motion.figure>
          </div>

          {/* Optional Contact Image Column */}
          {hasImage && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="lg:col-span-5 flex justify-center group"
            >
              <motion.div
                whileHover={{ y: -6, scale: 1.02 }}
                transition={{ duration: 0.4 }}
                className="image-surface w-full max-w-lg aspect-[4/3] rounded-2xl overflow-hidden shadow-xl hover:shadow-[0_20px_50px_rgba(0,0,0,0.6)] transition-all duration-500"
              >
                <div className="w-full h-full rounded-xl overflow-hidden">
                  <img src={data.image} alt="Contact" className="w-full h-full object-cover grayscale-[15%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" />
                </div>
              </motion.div>
            </motion.div>
          )}
        </div>

        {/* Message Form */}
        <AnimatePresence>
          {formOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden mb-20 max-w-2xl"
            >
              <form
                onSubmit={handleSubmit}
                className="glass-panel p-8 sm:p-10 rounded-2xl border border-white/[0.1] hover:border-white/[0.2] transition-colors duration-300 flex flex-col gap-6 shadow-2xl"
              >
                <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
                  <span className="font-mono text-xs tracking-widest text-emerald-400 uppercase">
                    DIRECT DISPATCH // INBOX
                  </span>
                  <span className="font-mono text-[11px] text-slate-500">256-BIT ENCRYPTION</span>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="font-mono text-xs text-slate-400">NAME</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Your Name"
                    className="bg-white/[0.03] border border-white/[0.08] focus:border-cyan-400 focus:bg-white/[0.05] rounded-lg px-4 py-3 text-sm text-white focus:outline-none transition-all duration-200"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="font-mono text-xs text-slate-400">EMAIL</label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="your@email.com"
                    className="bg-white/[0.03] border border-white/[0.08] focus:border-cyan-400 focus:bg-white/[0.05] rounded-lg px-4 py-3 text-sm text-white focus:outline-none transition-all duration-200"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="font-mono text-xs text-slate-400">MESSAGE</label>
                  <textarea
                    required
                    rows={4}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Briefly describe your project or inquiry..."
                    className="bg-white/[0.03] border border-white/[0.08] focus:border-cyan-400 focus:bg-white/[0.05] rounded-lg px-4 py-3 text-sm text-white focus:outline-none transition-all duration-200 resize-none"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <button
                    type="submit"
                    disabled={status === 'sending'}
                    className="px-6 py-3 rounded-full bg-white text-[#050508] font-mono text-xs font-semibold tracking-wider flex items-center gap-2 hover:bg-slate-200 hover:shadow-[0_0_20px_rgba(255,255,255,0.25)] transition-all disabled:opacity-50 active:scale-[0.98]"
                  >
                    <Send size={14} />
                    <span>{status === 'sending' ? 'TRANSMITTING...' : 'SEND MESSAGE'}</span>
                  </button>

                  {status === 'sent' && (
                    <span className="flex items-center gap-1.5 font-mono text-xs text-emerald-400">
                      <CheckCircle2 size={14} />
                      <span>Transmitted successfully.</span>
                    </span>
                  )}
                  {status === 'error' && (
                    <span className="flex items-center gap-1.5 font-mono text-xs text-rose-400">
                      <AlertCircle size={14} />
                      <span>Transmission failed. Please try again.</span>
                    </span>
                  )}
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dynamic Social Links from Dashboard */}
        {socials.length > 0 && (
          <div className="contact-social-row border-t border-white/[0.08] pt-12 grid sm:grid-cols-2 md:grid-cols-4 gap-6">
            {socials.map((social, idx) => (
              <React.Fragment key={idx}>
                <a
                  href={formatExternalUrl(social.url)}
                  target="_blank"
                  rel="noreferrer"
                  data-cursor="open"
                  className="group flex items-center justify-between py-4 px-3 rounded-xl border-b border-white/[0.06] hover:border-emerald-400/40 hover:bg-white/[0.02] transition-all duration-300"
                >
                  <span className="font-mono text-xs tracking-wider text-slate-300 group-hover:text-emerald-300 uppercase transition-colors">
                    {social.platform}
                  </span>
                  <ArrowUpRight
                    size={14}
                    className="text-slate-500 group-hover:text-emerald-400 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
                  />
                </a>
              </React.Fragment>
            ))}
          </div>
        )}

        {/* Minimal Footer */}
        <footer className="mt-28 pt-10 border-t border-white/[0.04] flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="text-slate-300 font-semibold uppercase">{data.name || 'NS SIDDARTH'}</span>
          </div>

          <div className="flex items-center gap-4">
            {socials.map((s, idx) => (
              <React.Fragment key={idx}>
                <a href={formatExternalUrl(s.url)} target="_blank" rel="noreferrer" className="hover:text-slate-200 transition-colors">
                  {s.platform}
                </a>
                <span>·</span>
              </React.Fragment>
            ))}
            <span>© {new Date().getFullYear()}</span>
          </div>
        </footer>
      </div>
    </section>
  );
}
