import React, { useState } from 'react';
import api from '../api/axios';
import { UploadCloud, Image as ImageIcon, Loader2 } from 'lucide-react';

// Reusable image upload control used everywhere in the dashboard.
// Uploads to Cloudinary via the backend and returns the resulting URL through onUploaded.
export default function ImageUploader({ label, value, onUploaded, uploadType, maxSizeMb = 8, multiple = false }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const previewValue = Array.isArray(value) ? value[0] : value;

  const handleFile = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    const oversizedFile = files.find((file) => file.size > maxSizeMb * 1024 * 1024);
    if (oversizedFile) {
      setError(`Image must be ${maxSizeMb} MB or smaller`);
      e.target.value = '';
      return;
    }
    setUploading(true);
    setError('');
    try {
      if (localStorage.getItem('portfolio_admin_token') === 'local_admin_session') {
        const localImages = await Promise.all(files.map((file) => new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        })));
        onUploaded(multiple ? localImages : localImages[0]);
        return;
      }

      const uploadedImages = await Promise.all(files.map(async (file) => {
        const formData = new FormData();
        formData.append('image', file);
        const uploadUrl = uploadType ? `/upload?type=${encodeURIComponent(uploadType)}` : '/upload';
        const res = await api.post(uploadUrl, formData, {
          timeout: 60000, // 60s — image uploads to Cloudinary can take a while
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        return res.data.url;
      }));
      onUploaded(multiple ? uploadedImages : uploadedImages[0]);
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
        {previewValue ? (
          <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-white/[0.1] bg-black/40 flex-shrink-0">
            <img src={previewValue} alt="" className="w-full h-full object-cover" />
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
              <span>{value ? (multiple ? 'REPLACE IMAGES' : 'REPLACE IMAGE') : (multiple ? 'UPLOAD IMAGES' : 'UPLOAD IMAGE')}</span>
            </>
          )}
          <input type="file" accept="image/*" multiple={multiple} className="hidden" onChange={handleFile} disabled={uploading} />
        </label>
      </div>
      {error && <p className="text-rose-400 font-mono text-xs mt-2">{error}</p>}
    </div>
  );
}
