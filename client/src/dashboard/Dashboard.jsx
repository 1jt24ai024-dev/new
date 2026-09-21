import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import ImageUploader from './ImageUploader';
import { TextField, TextArea, SaveButton } from './FieldInput';
import SocialsEditor from './SocialsEditor';
import VisibilityToggle from './VisibilityToggle';
import ItemListEditor from './ItemListEditor';
import Messages from './Messages';
import {
  Sparkles,
  User,
  GraduationCap,
  Briefcase,
  Award,
  FolderGit2,
  BookOpen,
  Images,
  PanelTop,
  Mail,
  MessageSquare,
  LogOut,
  ExternalLink,
  CheckCircle2,
} from 'lucide-react';

const TABS = [
  { id: 'Hero', label: 'Hero', icon: Sparkles },
  { id: 'About', label: 'About', icon: User },
  { id: 'Education', label: 'Education', icon: GraduationCap },
  { id: 'Experience', label: 'Experience', icon: Briefcase },
  { id: 'Certifications', label: 'Certifications', icon: Award },
  { id: 'Projects', label: 'Projects', icon: FolderGit2 },
  { id: 'Chronicles', label: 'Chronicles', icon: BookOpen },
  { id: 'Grid Motion', label: 'Grid Motion', icon: Images },
  { id: 'Banner', label: 'Banner', icon: PanelTop },
  { id: 'Contact', label: 'Contact', icon: Mail },
  { id: 'Messages', label: 'Messages', icon: MessageSquare },
];

export default function Dashboard() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [content, setContent] = useState(null);
  const [tab, setTab] = useState('Hero');
  const [saving, setSaving] = useState(false);
  const [savedFlash, setSavedFlash] = useState(false);

  const load = async () => {
    try {
      const res = await api.get('/content');
      if (res.data) {
        setContent(res.data);
        try {
          localStorage.setItem('portfolio_content', JSON.stringify(res.data));
        } catch {}
      }
    } catch (err) {
      console.warn('API get /content failed, loading from local cache:', err.message);
      try {
        const cached = localStorage.getItem('portfolio_content');
        if (cached) {
          setContent(JSON.parse(cached));
          return;
        }
      } catch {}
      setContent({
        hero: { name: '', tagline: '', image: '', socials: [] },
        about: { heading: '', bio: '', image: '', resumeUrl: '' },
        education: { visible: true, items: [] },
        experience: { visible: true, items: [] },
        certifications: { visible: true, items: [] },
        projects: { visible: true, items: [] },
        chronicles: { visible: true, items: [] },
        gridMotion: { visible: true, items: [] },
        banner: { heading: '', text: '', image: '' },
        contact: { heading: '', email: '', phone: '', image: '', socials: [] },
      });
    }
  };

  useEffect(() => { load(); }, []);

  const flashSaved = () => {
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 2000);
  };

  const saveSection = async (section, data) => {
    setSaving(true);
    try {
      let updated;
      try {
        const res = await api.patch(`/content/${section}`, data);
        updated = res.data;
      } catch (err) {
        console.warn(`API patch /content/${section} failed, saving locally:`, err.message);
        updated = { ...content, [section]: { ...content[section], ...data } };
      }
      setContent(updated);
      try {
        localStorage.setItem('portfolio_content', JSON.stringify(updated));
      } catch {}
      flashSaved();
    } finally {
      setSaving(false);
    }
  };

  if (!content) {
    return (
      <div className="min-h-screen bg-[#050508] flex items-center justify-center font-mono text-xs text-slate-400">
        INITIALIZING CMS DATA…
      </div>
    );
  }

  const doLogout = () => {
    logout();
    navigate('/dashboard/login');
  };

  return (
    <div className="min-h-screen bg-[#050508] text-slate-100 flex">
      {/* Sidebar */}
      <aside className="w-64 shrink-0 border-r border-white/[0.08] p-6 hidden md:flex flex-col bg-[#07080f]/80 backdrop-blur-xl">
        <div className="mb-8">
          <span className="font-mono text-[10px] tracking-widest text-emerald-400 uppercase block mb-1">
            CONTROL CENTER
          </span>
          <h2 className="font-display text-base font-bold tracking-tight text-white">
            NS SIDDARTH CMS
          </h2>
        </div>

        <nav className="flex flex-col gap-1.5">
          {TABS.map((t) => {
            const Icon = t.icon;
            const isActive = tab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`text-left text-xs font-mono tracking-wider px-3.5 py-2.5 rounded-xl transition-all flex items-center gap-2.5 ${
                  isActive
                    ? 'bg-white text-[#050508] font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                <Icon size={14} className={isActive ? 'text-[#050508]' : 'text-slate-500'} />
                <span>{t.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="mt-auto flex flex-col gap-3 pt-6 border-t border-white/[0.06]">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 font-mono text-xs text-slate-400 hover:text-white transition-colors"
          >
            <span>View live site</span>
            <ExternalLink size={12} />
          </a>
          <button
            onClick={doLogout}
            className="flex items-center gap-1.5 font-mono text-xs text-rose-400 hover:text-rose-300 transition-colors"
          >
            <LogOut size={12} />
            <span>Log out</span>
          </button>
        </div>
      </aside>

      {/* Mobile tab bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#07080f]/95 backdrop-blur-xl border-t border-white/[0.08] p-2 flex gap-2 overflow-x-auto">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`text-xs font-mono px-3.5 py-2 rounded-xl whitespace-nowrap ${
              tab === t.id ? 'bg-white text-[#050508] font-semibold' : 'text-slate-400'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Main panel */}
      <main className="flex-1 p-6 sm:p-10 pb-28 md:pb-12 max-w-4xl">
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/[0.06]">
          <div>
            <span className="font-mono text-[10px] text-slate-500 uppercase tracking-widest block mb-1">
              SECTION EDITOR
            </span>
            <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-white">
              {tab}
            </h1>
          </div>

          {savedFlash && (
            <span className="inline-flex items-center gap-1.5 font-mono text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full">
              <CheckCircle2 size={13} />
              <span>Saved — live instantly</span>
            </span>
          )}
        </div>

        {tab === 'Hero' && (
          <HeroForm data={content.hero} onSave={(d) => saveSection('hero', d)} saving={saving} />
        )}
        {tab === 'About' && (
          <AboutForm data={content.about} onSave={(d) => saveSection('about', d)} saving={saving} />
        )}
        {tab === 'Education' && (
          <>
            <VisibilityToggle section="education" visible={content.education?.visible} onChanged={setContent} />
            <div className="mt-6">
              <ItemListEditor
                section="education"
                title="Education Entries"
                items={content.education?.items || []}
                onChange={(items) => {
                  const next = { ...content, education: { ...content.education, items } };
                  setContent(next);
                  try { localStorage.setItem('portfolio_content', JSON.stringify(next)); } catch {}
                }}
                fields={[
                  { name: 'degree', label: 'Degree / Program', type: 'text' },
                  { name: 'institution', label: 'Institution / School', type: 'text' },
                  { name: 'year', label: 'Year / Duration', type: 'text' },
                  { name: 'logo', label: 'Institution Logo (Optional)', type: 'image' },
                  { name: 'description', label: 'Description', type: 'textarea' },
                ]}
              />
            </div>
          </>
        )}
        {tab === 'Experience' && (
          <>
            <VisibilityToggle section="experience" visible={content.experience?.visible} onChanged={setContent} />
            <div className="mt-6">
              <ItemListEditor
                section="experience"
                title="Work Experience Entries"
                items={content.experience?.items || []}
                onChange={(items) => {
                  const next = { ...content, experience: { ...content.experience, items } };
                  setContent(next);
                  try { localStorage.setItem('portfolio_content', JSON.stringify(next)); } catch {}
                }}
                fields={[
                  { name: 'role', label: 'Role / Title', type: 'text' },
                  { name: 'company', label: 'Company / Organization', type: 'text' },
                  { name: 'duration', label: 'Duration / Period', type: 'text' },
                  { name: 'logo', label: 'Company Logo (Optional)', type: 'image' },
                  { name: 'description', label: 'Contribution & Impact Description', type: 'textarea' },
                ]}
              />
            </div>
          </>
        )}
        {tab === 'Certifications' && (
          <>
            <VisibilityToggle section="certifications" visible={content.certifications?.visible} onChanged={setContent} />
            <div className="mt-6">
              <ItemListEditor
                section="certifications"
                title="Certifications & Accreditations"
                items={content.certifications?.items || []}
                onChange={(items) => {
                  const next = { ...content, certifications: { ...content.certifications, items } };
                  setContent(next);
                  try { localStorage.setItem('portfolio_content', JSON.stringify(next)); } catch {}
                }}
                fields={[
                  { name: 'title', label: 'Certificate Title', type: 'text' },
                  { name: 'issuer', label: 'Issuing Organization', type: 'text' },
                  { name: 'date', label: 'Date', type: 'text' },
                  { name: 'image', label: 'Certificate Image', type: 'image' },
                ]}
              />
            </div>
          </>
        )}
        {tab === 'Projects' && (
          <>
            <VisibilityToggle section="projects" visible={content.projects?.visible} onChanged={setContent} />
            <div className="mt-6">
              <ItemListEditor
                section="projects"
                title="Projects"
                items={content.projects?.items || []}
                onChange={(items) => {
                  const next = { ...content, projects: { ...content.projects, items } };
                  setContent(next);
                  try { localStorage.setItem('portfolio_content', JSON.stringify(next)); } catch {}
                }}
                fields={[
                  { name: 'title', label: 'Project Title', type: 'text' },
                  { name: 'shortDescription', label: 'Short Tagline / Overview', type: 'textarea' },
                  { name: 'details', label: 'Case Study Narrative / Approach', type: 'textarea' },
                  { name: 'techStack', label: 'Tech Stack (comma separated)', type: 'tags' },
                  { name: 'image', label: 'Cover Image', type: 'image' },
                  { name: 'githubUrl', label: 'GitHub URL', type: 'text' },
                  { name: 'liveUrl', label: 'Live Demo URL', type: 'text' },
                ]}
              />
            </div>
          </>
        )}
        {tab === 'Chronicles' && (
          <>
            <VisibilityToggle section="chronicles" visible={content.chronicles?.visible} onChanged={setContent} />
            <div className="mt-6">
              <ItemListEditor
                section="chronicles"
                title="Chronicles & Research Notes"
                items={content.chronicles?.items || []}
                onChange={(items) => {
                  const next = { ...content, chronicles: { ...content.chronicles, items } };
                  setContent(next);
                  try { localStorage.setItem('portfolio_content', JSON.stringify(next)); } catch {}
                }}
                fields={[
                  { name: 'title', label: 'Note / Chronicle Title', type: 'text' },
                  { name: 'date', label: 'Date / Period', type: 'text' },
                  { name: 'location', label: 'Domain Category (e.g. SYSTEMS ARCHITECTURE)', type: 'text' },
                  { name: 'description', label: 'Synthesis / Detailed Note', type: 'textarea' },
                  { name: 'images', label: 'Event Images (Optional)', type: 'images' },
                ]}
              />
            </div>
          </>
        )}
        {tab === 'Grid Motion' && (
          <>
            <VisibilityToggle section="gridMotion" visible={content.gridMotion?.visible} onChanged={setContent} />
            <div className="mt-6">
              <p className="mb-4 rounded-xl border border-cyan-300/10 bg-cyan-300/[0.04] px-4 py-3 font-mono text-[11px] leading-relaxed tracking-wide text-slate-400">
                Add 6+ distinct images for the best moving-grid composition. Project, chronicle, and gallery images also feed the visual archive automatically.
              </p>
              <ItemListEditor
                section="gridMotion"
                title="Grid Motion Images"
                items={content.gridMotion?.items || []}
                onChange={(items) => {
                  const next = { ...content, gridMotion: { ...content.gridMotion, items } };
                  setContent(next);
                  try { localStorage.setItem('portfolio_content', JSON.stringify(next)); } catch {}
                }}
                fields={[
                  { name: 'title', label: 'Image Label (Optional)', type: 'text' },
                  { name: 'image', label: 'Grid Image', type: 'image' },
                ]}
              />
            </div>
          </>
        )}
        {tab === 'Banner' && (
          <BannerForm data={content.banner} onSave={(d) => saveSection('banner', d)} saving={saving} />
        )}
        {tab === 'Contact' && (
          <ContactForm data={content.contact} onSave={(d) => saveSection('contact', d)} saving={saving} />
        )}
        {tab === 'Messages' && <Messages />}
      </main>
    </div>
  );
}

function HeroForm({ data, onSave, saving }) {
  const [form, setForm] = useState(data || {});
  useEffect(() => setForm(data || {}), [data]);
  return (
    <div className="glass-panel rounded-2xl p-6 sm:p-8 flex flex-col gap-5 max-w-xl border border-white/[0.08]">
      <ImageUploader label="Hero Image / Visual" value={form.image} onUploaded={(url) => setForm({ ...form, image: url })} />
      <TextField label="Name" value={form.name || ''} onChange={(e) => setForm({ ...form, name: e.target.value })} />
      <TextField label="Tagline" value={form.tagline || ''} onChange={(e) => setForm({ ...form, tagline: e.target.value })} />
      <SocialsEditor socials={form.socials || []} onChange={(socials) => setForm({ ...form, socials })} />
      <div className="pt-2">
        <SaveButton onClick={() => onSave(form)} disabled={saving}>
          {saving ? 'SAVING…' : 'SAVE HERO'}
        </SaveButton>
      </div>
    </div>
  );
}

function AboutForm({ data, onSave, saving }) {
  const [form, setForm] = useState(data || {});
  useEffect(() => setForm(data || {}), [data]);
  return (
    <div className="glass-panel rounded-2xl p-6 sm:p-8 flex flex-col gap-5 max-w-xl border border-white/[0.08]">
      <ImageUploader label="About Photo / Visual" value={form.image} onUploaded={(url) => setForm({ ...form, image: url })} />
      <TextField label="Headline" value={form.heading || ''} onChange={(e) => setForm({ ...form, heading: e.target.value })} />
      <TextArea label="Bio / Narrative" rows={6} value={form.bio || ''} onChange={(e) => setForm({ ...form, bio: e.target.value })} />
      <TextField label="Resume URL (optional)" value={form.resumeUrl || ''} onChange={(e) => setForm({ ...form, resumeUrl: e.target.value })} />
      <div className="pt-2">
        <SaveButton onClick={() => onSave(form)} disabled={saving}>
          {saving ? 'SAVING…' : 'SAVE ABOUT'}
        </SaveButton>
      </div>
    </div>
  );
}

function ContactForm({ data, onSave, saving }) {
  const [form, setForm] = useState(data || {});
  useEffect(() => setForm(data || {}), [data]);
  return (
    <div className="glass-panel rounded-2xl p-6 sm:p-8 flex flex-col gap-5 max-w-xl border border-white/[0.08]">
      <ImageUploader label="Contact Visual (optional)" value={form.image} onUploaded={(url) => setForm({ ...form, image: url })} />
      <TextField label="Heading" value={form.heading || ''} onChange={(e) => setForm({ ...form, heading: e.target.value })} />
      <TextField label="Email" value={form.email || ''} onChange={(e) => setForm({ ...form, email: e.target.value })} />
      <TextField label="Phone (optional)" value={form.phone || ''} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
      <SocialsEditor socials={form.socials || []} onChange={(socials) => setForm({ ...form, socials })} />
      <div className="pt-2">
        <SaveButton onClick={() => onSave(form)} disabled={saving}>
          {saving ? 'SAVING…' : 'SAVE CONTACT'}
        </SaveButton>
      </div>
    </div>
  );
}

function BannerForm({ data, onSave, saving }) {
  const [form, setForm] = useState(data || {});
  useEffect(() => setForm(data || {}), [data]);
  return (
    <div className="glass-panel rounded-2xl p-6 sm:p-8 flex flex-col gap-5 max-w-xl border border-white/[0.08]">
      <ImageUploader label="Banner Image (optional)" value={form.image} uploadType="banner" maxSizeMb={20} onUploaded={(url) => setForm({ ...form, image: url })} />
      <TextField label="Heading" value={form.heading || ''} onChange={(e) => setForm({ ...form, heading: e.target.value })} />
      <TextArea label="Supporting Text (optional)" rows={4} value={form.text || ''} onChange={(e) => setForm({ ...form, text: e.target.value })} />
      <div className="pt-2">
        <SaveButton onClick={() => onSave(form)} disabled={saving}>
          {saving ? 'SAVING…' : 'SAVE BANNER'}
        </SaveButton>
      </div>
    </div>
  );
}
