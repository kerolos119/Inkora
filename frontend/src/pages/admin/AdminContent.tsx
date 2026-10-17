import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X } from 'lucide-react';
import { Post } from '../../types/index.js';
import { realApi, uploadImage } from '../../services/realapi.js';
import { useToast } from '../../context/ToastContext.js';

const emptyForm = (): Partial<Post> => ({ title: '', content: '', coverImage: '' });

export const AdminContent: React.FC<{ kind: 'post' | 'news' }> = ({ kind }) => {
  const label = kind === 'post' ? 'Post' : 'News';
  const fn = kind === 'post'
    ? { list: realApi.getPosts, create: realApi.createPost, update: realApi.updatePost, remove: realApi.deletePost }
    : { list: realApi.getNews, create: realApi.createNews, update: realApi.updateNews, remove: realApi.deleteNews };

  const { showToast } = useToast();
  const [items, setItems] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<Post | null>(null);
  const [form, setForm] = useState<Partial<Post>>(emptyForm());

  useEffect(() => {
    setLoading(true);
    fn.list().then(setItems).catch(console.error).finally(() => setLoading(false));
  }, [kind]);

  const openAdd = () => { setEditing(null); setForm(emptyForm()); setIsModalOpen(true); };
  const openEdit = (p: Post) => { setEditing(p); setForm({ ...p }); setIsModalOpen(true); };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target;
    const file = input.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      showToast('Image must be under 5MB', 'error');
      input.value = '';
      return;
    }
    setUploading(true);
    try {
      const url = await uploadImage(file, kind);
      setForm((f) => ({ ...f, coverImage: url }));
      showToast('Image uploaded');
    } catch (err: any) {
      showToast(err?.message || 'Upload failed', 'error');
    } finally {
      setUploading(false);
      input.value = '';
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editing) {
        const updated = await fn.update(editing.id, form);
        setItems(items.map((x) => (x.id === updated.id ? updated : x)));
        showToast(`${label} updated`);
      } else {
        const created = await fn.create(form);
        setItems([created, ...items]);
        showToast(`${label} created`);
      }
      setIsModalOpen(false);
    } catch (err: any) {
      showToast(err?.message || 'Save failed', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm(`Delete this ${label.toLowerCase()}?`)) return;
    try {
      await fn.remove(id);
      setItems(items.filter((x) => x.id !== id));
      showToast(`${label} deleted`, 'info');
    } catch (err: any) {
      showToast(err?.message || 'Delete failed', 'error');
    }
  };

  const inputCls = 'w-full px-3 py-2 border border-[#E3D6BC] dark:border-[#4A3E2E] bg-transparent text-[#3B2B1E] dark:text-[#F3ECDD]';
  const labelCls = 'text-xs uppercase tracking-wider font-semibold text-[#3B2B1E] dark:text-[#F3ECDD] block mb-1';

  return (
    <div className="space-y-6">
      <div className="border-b border-[#E3D6BC] dark:border-[#4A3E2E] pb-4 flex items-end justify-between gap-4">
        <h1 className="font-editorial text-3xl sm:text-4xl text-[#3B2B1E] dark:text-[#F3ECDD]">
          {kind === 'post' ? 'Journal Posts' : 'News & Announcements'}
        </h1>
        <button
          onClick={openAdd}
          className="px-5 py-2.5 bg-[#8A6238] dark:bg-[#D9AE6B] text-[#FAF6EC] text-xs font-semibold uppercase tracking-wider font-mono flex items-center gap-2 btn-press"
        >
          <Plus className="w-4 h-4" /> New {label}
        </button>
      </div>

      <div className="border border-[#E3D6BC] dark:border-[#4A3E2E] bg-[#FFFFFF] dark:bg-[#2A231B] overflow-x-auto">
        <table className="w-full text-start text-xs">
          <thead>
            <tr className="border-b border-[#E3D6BC] dark:border-[#4A3E2E] text-[#65513F] dark:text-[#A99A82] uppercase tracking-wider font-mono">
              <th className="p-3">Cover</th>
              <th className="p-3">Title</th>
              <th className="p-3">Likes</th>
              <th className="p-3 text-end">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E3D6BC]/60 dark:divide-[#4A3E2E]/60">
            {loading && <tr><td className="p-3" colSpan={4}>Loading…</td></tr>}
            {!loading && items.length === 0 && <tr><td className="p-3" colSpan={4}>Nothing here yet.</td></tr>}
            {items.map((p) => (
              <tr key={p.id}>
                <td className="p-3">
                  <img src={p.coverImage} alt={p.title} className="w-14 h-10 object-cover border border-[#E3D6BC] dark:border-[#4A3E2E]" />
                </td>
                <td className="p-3 font-editorial text-base text-[#3B2B1E] dark:text-[#F3ECDD]">{p.title}</td>
                <td className="p-3 font-mono">{p.likesCount}</td>
                <td className="p-3 text-end">
                  <button onClick={() => openEdit(p)} className="p-1.5 text-[#65513F] hover:text-[#8A6238] btn-press" title="Edit"><Edit2 className="w-3.5 h-3.5" /></button>
                  <button onClick={() => handleDelete(p.id)} className="p-1.5 text-[#65513F] hover:text-[#8E1F1F] btn-press" title="Delete"><Trash2 className="w-3.5 h-3.5" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="fixed inset-0 bg-black/60" onClick={() => setIsModalOpen(false)} />
          <div className="relative w-full max-w-2xl bg-[#FFFFFF] dark:bg-[#2A231B] border border-[#E3D6BC] dark:border-[#4A3E2E] p-6 sm:p-8 space-y-6 z-10 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#E3D6BC] dark:border-[#4A3E2E] pb-3">
              <h3 className="font-editorial text-2xl text-[#3B2B1E] dark:text-[#F3ECDD]">
                {editing ? `Edit ${label}` : `New ${label}`}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-[#65513F] btn-press"><X className="w-5 h-5" /></button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs font-mono">
              <div>
                <label className={labelCls}>Title</label>
                <input type="text" required maxLength={500} value={form.title || ''}
                  onChange={(e) => setForm({ ...form, title: e.target.value })} className={inputCls} />
              </div>

              <div>
                <label className={labelCls}>Content</label>
                <textarea rows={8} required value={form.content || ''}
                  onChange={(e) => setForm({ ...form, content: e.target.value })} className={inputCls} />
              </div>

              <div>
                <label className={labelCls}>Cover Image</label>
                <div className="flex items-start gap-3">
                  {form.coverImage && (
                    <img src={form.coverImage} alt="Cover preview"
                      className="w-24 h-16 object-cover border border-[#E3D6BC] dark:border-[#4A3E2E]" />
                  )}
                  <div className="flex-1 space-y-2">
                    <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading}
                      className="w-full text-xs text-[#3B2B1E] dark:text-[#F3ECDD]" />
                    {uploading && <span className="text-xs text-[#8A6238]">Uploading…</span>}
                    <input type="url" placeholder="…or paste an image URL"
                      value={form.coverImage?.startsWith('data:') ? '' : form.coverImage || ''}
                      onChange={(e) => setForm({ ...form, coverImage: e.target.value })} className={inputCls} />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-[#E3D6BC] dark:border-[#4A3E2E] flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-[#E3D6BC] dark:border-[#4A3E2E] text-xs uppercase btn-press">Cancel</button>
                <button type="submit" disabled={uploading}
                  className="px-6 py-2 bg-[#8A6238] dark:bg-[#D9AE6B] text-[#FAF6EC] text-xs font-semibold uppercase tracking-wider font-mono btn-press disabled:opacity-50">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};