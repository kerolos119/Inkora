import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X } from 'lucide-react';
import { Author } from '../../types/index.js';
import { api } from '../../services/api.js';
import { useToast } from '../../context/ToastContext.js';

export const AdminAuthors: React.FC = () => {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingAuthor, setEditingAuthor] = useState<Author | null>(null);
  const [form, setForm] = useState<Partial<Author>>({
    name: '',
    bio: '',
    nationality: '',
    notableWork: '',
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  });

  const { showToast } = useToast();

  const loadAuthors = () => {
    api.getAuthors().then(setAuthors).catch(console.error);
  };

  useEffect(() => {
    loadAuthors();
  }, []);

  const openAdd = () => {
    setEditingAuthor(null);
    setForm({
      name: '',
      bio: '',
      nationality: 'International',
      notableWork: '',
      photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    });
    setModalOpen(true);
  };

  const openEdit = (a: Author) => {
    setEditingAuthor(a);
    setForm({ ...a });
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingAuthor) {
        await api.updateAuthor(editingAuthor.id, form);
        showToast('Author details updated');
      } else {
        await api.createAuthor(form);
        showToast('New author inscribed');
      }
      setModalOpen(false);
      loadAuthors();
    } catch (err: any) {
      showToast(err.message || 'Operation failed', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.deleteAuthor(id);
      showToast('Author removed', 'info');
      loadAuthors();
    } catch (err: any) {
      showToast(err.message || 'Delete failed', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-[#DFD7C7] dark:border-[#242A38] pb-4 flex items-end justify-between">
        <div>
          <span className="text-[10px] uppercase font-mono tracking-widest text-[#16284F] dark:text-[#5A85C4] font-semibold">
            Literary Fellowship
          </span>
          <h1 className="font-editorial text-3xl sm:text-4xl text-[#0D1017] dark:text-[#EFECE6] mt-1">
            Authors in Residence
          </h1>
        </div>
        <button
          onClick={openAdd}
          className="px-4 py-2 bg-[#16284F] dark:bg-[#5A85C4] text-[#F7F4EB] text-xs font-semibold uppercase tracking-wider hover:bg-[#0E1A33] dark:hover:bg-[#729BD4] transition-colors flex items-center gap-1.5 font-mono btn-press shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Register Author</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {authors.map((a) => (
          <div
            key={a.id}
            className="p-5 border border-[#DFD7C7] dark:border-[#242A38] bg-[#FFFFFF] dark:bg-[#131720] flex flex-col justify-between shadow-xs book-lift"
          >
            <div>
              <div className="w-14 h-14 overflow-hidden mb-3 border border-[#DFD7C7] dark:border-[#242A38] rounded-[1px]">
                <img src={a.photo} alt={a.name} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-300" />
              </div>
              <span className="text-[10px] font-mono uppercase text-[#16284F] dark:text-[#5A85C4] font-semibold">
                {a.nationality} · {a.booksCount} Works
              </span>
              <h3 className="font-editorial text-2xl text-[#0D1017] dark:text-[#EFECE6] mt-0.5 mb-2">
                {a.name}
              </h3>
              <p className="text-xs text-[#5A6273] dark:text-[#8F97A8] leading-relaxed line-clamp-3 mb-2 font-body-literary">
                {a.bio}
              </p>
              {a.notableWork && (
                <p className="text-[11px] text-[#0D1017] dark:text-[#EFECE6] font-editorial italic">
                  “{a.notableWork}”
                </p>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 pt-4 mt-4 border-t border-[#DFD7C7]/60 dark:border-[#242A38]/60">
              <button
                onClick={() => openEdit(a)}
                className="p-1.5 text-[#5A6273] hover:text-[#16284F] dark:hover:text-[#5A85C4] transition-colors btn-press"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => handleDelete(a.id)}
                className="p-1.5 text-[#5A6273] hover:text-[#8E1F1F] transition-colors btn-press"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setModalOpen(false)} />
          <div className="relative bg-[#FFFFFF] dark:bg-[#131720] border border-[#DFD7C7] dark:border-[#242A38] p-6 max-w-md w-full space-y-4 z-10 animate-in fade-in shadow-xl">
            <div className="flex items-center justify-between border-b border-[#DFD7C7] dark:border-[#242A38] pb-2">
              <h3 className="font-editorial text-2xl text-[#0D1017] dark:text-[#EFECE6]">
                {editingAuthor ? 'Edit Author' : 'Inscribe Author'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="p-1 text-[#5A6273] hover:text-[#0D1017]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs font-mono">
              <div>
                <label className="text-[11px] uppercase tracking-wider font-semibold block mb-1 text-[#0D1017] dark:text-[#EFECE6]">
                  Author Name
                </label>
                <input
                  type="text"
                  value={form.name || ''}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  placeholder="e.g. Elena Rostova"
                  className="w-full px-3 py-2 border border-[#DFD7C7] dark:border-[#242A38] bg-transparent text-[#0D1017] dark:text-[#EFECE6]"
                />
              </div>

              <div>
                <label className="text-[11px] uppercase tracking-wider font-semibold block mb-1 text-[#0D1017] dark:text-[#EFECE6]">
                  Nationality / Origin
                </label>
                <input
                  type="text"
                  value={form.nationality || ''}
                  onChange={(e) => setForm({ ...form, nationality: e.target.value })}
                  placeholder="Austria / Spain"
                  className="w-full px-3 py-2 border border-[#DFD7C7] dark:border-[#242A38] bg-transparent text-[#0D1017] dark:text-[#EFECE6]"
                />
              </div>

              <div>
                <label className="text-[11px] uppercase tracking-wider font-semibold block mb-1 text-[#0D1017] dark:text-[#EFECE6]">
                  Notable Masterwork
                </label>
                <input
                  type="text"
                  value={form.notableWork || ''}
                  onChange={(e) => setForm({ ...form, notableWork: e.target.value })}
                  placeholder="The Architecture of Solitude"
                  className="w-full px-3 py-2 border border-[#DFD7C7] dark:border-[#242A38] bg-transparent text-[#0D1017] dark:text-[#EFECE6]"
                />
              </div>

              <div>
                <label className="text-[11px] uppercase tracking-wider font-semibold block mb-1 text-[#0D1017] dark:text-[#EFECE6]">
                  Biography & Literary Style
                </label>
                <textarea
                  value={form.bio || ''}
                  onChange={(e) => setForm({ ...form, bio: e.target.value })}
                  rows={3}
                  required
                  className="w-full px-3 py-2 border border-[#DFD7C7] dark:border-[#242A38] bg-transparent text-[#0D1017] dark:text-[#EFECE6]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-3 py-1.5 border border-[#DFD7C7] dark:border-[#242A38] text-xs btn-press"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#16284F] dark:bg-[#5A85C4] text-[#F7F4EB] text-xs font-semibold uppercase tracking-wider font-mono btn-press"
                >
                  Save Author
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
