import React, { useState } from 'react';
import api from '../api/axios';
import { UploadCloud, Image as ImageIcon, Loader2 } from 'lucide-react';

// Reusable image upload control used everywhere in the dashboard.
// Uploads to Cloudinary via the backend and returns the resulting URL through onUploaded.
export default function ImageUploader({ label, value, onUploaded }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    setError('');
    try {
      if (localStorage.getItem('portfolio_admin_token') === 'local_admin_session') {
        const reader = new FileReader();
        reader.onload = () => onUploaded(reader.result);
        reader.onerror = () => setError('Could not read image locally');
        reader.readAsDataURL(file);
        return;
      }

      const formData = new FormData();
      formData.append('image', file);
      const res = await api.post('/upload', formData, {
        timeout: 60000, // 60s — image uploads to Cloudinary can take a while
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      onUploaded(res.data.url);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      {label && <label className="text-xs font-mono text-slate-400 block mb-2 uppercase tracking-wider">{label}</label>}
      <div className="flex items-center gap-4">
        {value ? (
          <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-white/[0.1] bg-black/40 flex-shrink-0">
            <img src={value} alt="" className="w-full h-full object-cover" />
          </div>
        ) : (
          <div className="w-16 h-16 rounded-xl border border-dashed border-white/[0.1] bg-white/[0.02] flex items-center justify-center text-slate-500 flex-shrink-0">
            <ImageIcon size={22} className="opacity-40" />
          </div>
        )}

        <label className="cursor-pointer inline-flex items-center gap-2 text-xs font-mono tracking-wider px-4 py-2.5 rounded-xl border border-white/[0.1] bg-white/[0.04] text-slate-200 hover:bg-white/[0.08] hover:border-white/[0.2] transition-colors">
          {uploading ? (
            <>
              <Loader2 size={14} className="animate-spin text-cyan-400" />
              <span>UPLOADING…</span>
            </>
          ) : (
            <>
              <UploadCloud size={14} className="text-cyan-400" />
              <span>{value ? 'REPLACE IMAGE' : 'UPLOAD IMAGE'}</span>
            </>
          )}
          <input type="file" accept="image/*" className="hidden" onChange={handleFile} disabled={uploading} />
        </label>
      </div>
      {error && <p className="text-rose-400 font-mono text-xs mt-2">{error}</p>}
    </div>
  );
}
