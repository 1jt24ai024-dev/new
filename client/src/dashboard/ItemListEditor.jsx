import React, { useState } from 'react';
import api from '../api/axios';
import ImageUploader from './ImageUploader';
import { TextField, TextArea, SaveButton } from './FieldInput';
import { Plus, Edit3, Trash2 } from 'lucide-react';

/*
Generic CRUD editor for array-based sections: education, experience,
certifications, projects, chronicles.
*/
export default function ItemListEditor({ section, title, items = [], fields, onChange }) {
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);

  const blankItem = () => Object.fromEntries(fields.map((f) => [f.name, f.type === 'tags' || f.type === 'images' ? [] : '']));

  const openNew = () => setEditing(blankItem());
  const openEdit = (item) => setEditing({ ...item });

  const setField = (name, value) => setEditing((prev) => ({ ...prev, [name]: value }));

  const save = async () => {
    setSaving(true);
    try {
      const payload = { ...editing };
      fields.forEach((f) => {
        if (f.type === 'tags' && typeof payload[f.name] === 'string') {
          payload[f.name] = payload[f.name].split(',').map((t) => t.trim()).filter(Boolean);
        }
      });
      try {
        let res;
        if (payload._id && !String(payload._id).startsWith('local-')) {
          res = await api.put(`/items/${section}/${payload._id}`, payload);
        } else {
          res = await api.post(`/items/${section}`, payload);
        }
        onChange(res.data[section].items);
      } catch (err) {
        console.warn(`API call for ${section} failed, saving locally:`, err);
        let nextItems = [...items];
        if (payload._id) {
          nextItems = nextItems.map((it) => (it._id === payload._id ? payload : it));
        } else {
          payload._id = 'local-' + Date.now();
          nextItems.push(payload);
        }
        onChange(nextItems);
      }
      setEditing(null);
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id) => {
    if (!confirm('Delete this entry?')) return;
    try {
      const res = await api.delete(`/items/${section}/${id}`);
      onChange(res.data[section].items);
    } catch (err) {
      console.warn(`API delete for ${section} failed, removing locally:`, err);
      const nextItems = items.filter((it) => it._id !== id);
      onChange(nextItems);
    }
  };

  return (
    <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-white/[0.08]">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/[0.06]">
        <h3 className="font-display text-lg font-semibold text-white tracking-tight">{title}</h3>
        <button
          onClick={openNew}
          className="inline-flex items-center gap-1.5 text-xs font-mono tracking-wider px-3.5 py-2 rounded-xl bg-white text-[#050508] font-semibold hover:bg-slate-200 transition-colors"
        >
          <Plus size={13} />
          <span>ADD NEW</span>
        </button>
      </div>

      <div className="flex flex-col gap-3">
        {items.map((item) => (
          <div
            key={item._id}
            className="flex items-center justify-between border border-white/[0.06] bg-white/[0.02] rounded-xl px-4 py-3.5 hover:border-white/[0.15] transition-colors"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              {(item.image || item.logo || item.images?.[0]) && (
                <img
                  src={item.image || item.logo || item.images[0]}
                  alt=""
                  className="w-10 h-10 rounded-lg object-cover border border-white/10 flex-shrink-0"
                />
              )}
              <span className="text-sm font-medium text-slate-200 truncate">
                {item.title || item.degree || item.role || 'Untitled'}
              </span>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => openEdit(item)}
                className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
              >
                <Edit3 size={13} />
                <span>Edit</span>
              </button>
              <button
                onClick={() => remove(item._id)}
                className="text-xs font-mono text-rose-400 hover:text-rose-300 flex items-center gap-1 transition-colors"
              >
                <Trash2 size={13} />
                <span>Delete</span>
              </button>
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <p className="text-slate-500 font-mono text-xs py-4 text-center">No entries created yet.</p>
        )}
      </div>

      {editing && (
        <div className="mt-8 border-t border-white/[0.08] pt-6 flex flex-col gap-5">
          <div className="flex items-center justify-between mb-1">
            <span className="font-mono text-xs text-emerald-400 uppercase tracking-wider">
              {editing._id ? 'Editing Entry' : 'Creating New Entry'}
            </span>
          </div>

          {fields.map((f) => {
            if (f.type === 'image' || f.type === 'images') {
              return (
                <ImageUploader
                  key={f.name}
                  label={f.label}
                  value={editing[f.name]}
                  multiple={f.type === 'images'}
                  onUploaded={(url) => setField(f.name, url)}
                />
              );
            }
            if (f.type === 'textarea') {
              return (
                <TextArea
                  key={f.name}
                  label={f.label}
                  rows={4}
                  value={editing[f.name] || ''}
                  onChange={(e) => setField(f.name, e.target.value)}
                />
              );
            }
            if (f.type === 'tags') {
              return (
                <TextField
                  key={f.name}
                  label={f.label}
                  value={Array.isArray(editing[f.name]) ? editing[f.name].join(', ') : editing[f.name] || ''}
                  onChange={(e) => setField(f.name, e.target.value)}
                />
              );
            }
            return (
              <TextField
                key={f.name}
                label={f.label}
                value={editing[f.name] || ''}
                onChange={(e) => setField(f.name, e.target.value)}
              />
            );
          })}
          <div className="flex items-center gap-3 pt-2">
            <SaveButton onClick={save} disabled={saving}>
              {saving ? 'SAVING…' : 'SAVE ENTRY'}
            </SaveButton>
            <button
              onClick={() => setEditing(null)}
              className="px-5 py-2.5 rounded-full border border-white/[0.1] text-xs font-mono text-slate-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
