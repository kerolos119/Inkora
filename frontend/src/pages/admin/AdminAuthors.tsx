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
      <div className="border-b border-[#E3D6BC] dark:border-[#4A3E2E] pb-4 flex items-end justify-between">
        <div>
          <span className="text-xs uppercase font-mono tracking-widest text-[#8A6238] dark:text-[#D9AE6B] font-semibold">
            Literary Fellowship
          </span>
          <h1 className="font-editorial text-3xl sm:text-4xl text-[#3B2B1E] dark:text-[#F3ECDD] mt-1">
            Authors in Residence
          </h1>
        </div>
        <button
          onClick={openAdd}
          className="px-4 py-2 bg-[#8A6238] dark:bg-[#D9AE6B] text-[#FAF6EC] text-xs font-semibold uppercase tracking-wider hover:bg-[#6F4D2B] dark:hover:bg-[#CBA77B] transition-colors flex items-center gap-1.5 font-mono btn-press shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Register Author</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {authors.map((a) => (
          <div
            key={a.id}
            className="p-5 border border-[#E3D6BC] dark:border-[#4A3E2E] bg-[#FFFFFF] dark:bg-[#2A231B] flex flex-col justify-between shadow-xs book-lift"
          >
            <div>
              <div className="w-14 h-14 overflow-hidden mb-3 border border-[#E3D6BC] dark:border-[#4A3E2E] rounded-[1px]">
                <img src={a.photo} alt={a.name} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-300" />
              </div>
              <span className="text-xs font-mono uppercase text-[#8A6238] dark:text-[#D9AE6B] font-semibold">
                {a.nationality} · {a.booksCount} Works
              </span>
              <h3 className="font-editorial text-2xl text-[#3B2B1E] dark:text-[#F3ECDD] mt-0.5 mb-2">
                {a.name}
              </h3>
              <p className="text-xs text-[#7A6652] dark:text-[#A99A82] leading-relaxed line-clamp-3 mb-2 font-body-literary">
                {a.bio}
              </p>
              {a.notableWork && (
                <p className="text-[11px] text-[#3B2B1E] dark:text-[#F3ECDD] font-editorial italic">
                  “{a.notableWork}”
                </p>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 pt-4 mt-4 border-t border-[#E3D6BC]/60 dark:border-[#4A3E2E]/60">
              <button
                onClick={() => openEdit(a)}
                className="p-1.5 text-[#7A6652] hover:text-[#8A6238] dark:hover:text-[#D9AE6B] transition-colors btn-press"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => handleDelete(a.id)}
                className="p-1.5 text-[#7A6652] hover:text-[#8E1F1F] transition-colors btn-press"
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
          <div className="relative bg-[#FFFFFF] dark:bg-[#2A231B] border border-[#E3D6BC] dark:border-[#4A3E2E] p-6 max-w-md w-full space-y-4 z-10 animate-in fade-in shadow-xl">
            <div className="flex items-center justify-between border-b border-[#E3D6BC] dark:border-[#4A3E2E] pb-2">
              <h3 className="font-editorial text-2xl text-[#3B2B1E] dark:text-[#F3ECDD]">
                {editingAuthor ? 'Edit Author' : 'Inscribe Author'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="p-1 text-[#7A6652] hover:text-[#3B2B1E]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs font-mono">
              <div>
                <label className="text-[11px] uppercase tracking-wider font-semibold block mb-1 text-[#3B2B1E] dark:text-[#F3ECDD]">
                  Author Name
                </label>
                <input
                  type="text"
                  value={form.name || ''}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  placeholder="e.g. Elena Rostova"
                  className="w-full px-3 py-2 border border-[#E3D6BC] dark:border-[#4A3E2E] bg-transparent text-[#3B2B1E] dark:text-[#F3ECDD]"
                />
              </div>

              <div>
                <label className="text-[11px] uppercase tracking-wider font-semibold block mb-1 text-[#3B2B1E] dark:text-[#F3ECDD]">
                  Nationality / Origin
                </label>
                <input
                  type="text"
                  value={form.nationality || ''}
                  onChange={(e) => setForm({ ...form, nationality: e.target.value })}
                  placeholder="Austria / Spain"
                  className="w-full px-3 py-2 border border-[#E3D6BC] dark:border-[#4A3E2E] bg-transparent text-[#3B2B1E] dark:text-[#F3ECDD]"
                />
              </div>

              <div>
                <label className="text-[11px] uppercase tracking-wider font-semibold block mb-1 text-[#3B2B1E] dark:text-[#F3ECDD]">
                  Notable Masterwork
                </label>
                <input
                  type="text"
                  value={form.notableWork || ''}
                  onChange={(e) => setForm({ ...form, notableWork: e.target.value })}
                  placeholder="The Architecture of Solitude"
                  className="w-full px-3 py-2 border border-[#E3D6BC] dark:border-[#4A3E2E] bg-transparent text-[#3B2B1E] dark:text-[#F3ECDD]"
                />
              </div>

              <div>
                <label className="text-[11px] uppercase tracking-wider font-semibold block mb-1 text-[#3B2B1E] dark:text-[#F3ECDD]">
                  Biography & Literary Style
                </label>
                <textarea
                  value={form.bio || ''}
                  onChange={(e) => setForm({ ...form, bio: e.target.value })}
                  rows={3}
                  required
                  className="w-full px-3 py-2 border border-[#E3D6BC] dark:border-[#4A3E2E] bg-transparent text-[#3B2B1E] dark:text-[#F3ECDD]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-3 py-1.5 border border-[#E3D6BC] dark:border-[#4A3E2E] text-xs btn-press"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#8A6238] dark:bg-[#D9AE6B] text-[#FAF6EC] text-xs font-semibold uppercase tracking-wider font-mono btn-press"
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
