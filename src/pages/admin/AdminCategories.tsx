import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X } from 'lucide-react';
import { Category } from '../../types/index.js';
import { api } from '../../services/api.js';
import { useToast } from '../../context/ToastContext.js';

export const AdminCategories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCat, setEditingCat] = useState<Category | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const { showToast } = useToast();

  const loadCategories = () => {
    api.getCategories().then(setCategories).catch(console.error);
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const openAdd = () => {
    setEditingCat(null);
    setName('');
    setDescription('');
    setModalOpen(true);
  };

  const openEdit = (c: Category) => {
    setEditingCat(c);
    setName(c.name);
    setDescription(c.description);
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCat) {
        await api.updateCategory(editingCat.id, { name, description });
        showToast('Category updated');
      } else {
        await api.createCategory({ name, description });
        showToast('New discipline created');
      }
      setModalOpen(false);
      loadCategories();
    } catch (err: any) {
      showToast(err.message || 'Operation failed', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.deleteCategory(id);
      showToast('Category deleted', 'info');
      loadCategories();
    } catch (err: any) {
      showToast(err.message || 'Delete failed', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-[#DFD7C7] dark:border-[#242A38] pb-4 flex items-end justify-between">
        <div>
          <span className="text-[10px] uppercase font-mono tracking-widest text-[#16284F] dark:text-[#5A85C4] font-semibold">
            Taxonomy Architecture
          </span>
          <h1 className="font-editorial text-3xl sm:text-4xl text-[#0D1017] dark:text-[#EFECE6] mt-1">
            Book Disciplines & Categories
          </h1>
        </div>
        <button
          onClick={openAdd}
          className="px-4 py-2 bg-[#16284F] dark:bg-[#5A85C4] text-[#F7F4EB] text-xs font-semibold uppercase tracking-wider hover:bg-[#0E1A33] dark:hover:bg-[#729BD4] transition-colors flex items-center gap-1.5 font-mono btn-press shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>New Discipline</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((c) => (
          <div
            key={c.id}
            className="p-5 border border-[#DFD7C7] dark:border-[#242A38] bg-[#FFFFFF] dark:bg-[#131720] flex flex-col justify-between shadow-xs book-lift"
          >
            <div>
              <div className="flex items-center justify-between text-[11px] font-mono text-[#5A6273] dark:text-[#8F97A8] mb-2">
                <span>{c.slug}</span>
                <span>{c.bookCount} Editions</span>
              </div>
              <h3 className="font-editorial text-2xl text-[#0D1017] dark:text-[#EFECE6] mb-2">
                {c.name}
              </h3>
              <p className="text-xs text-[#5A6273] dark:text-[#8F97A8] leading-relaxed font-body-literary">
                {c.description}
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-4 mt-4 border-t border-[#DFD7C7]/60 dark:border-[#242A38]/60">
              <button
                onClick={() => openEdit(c)}
                className="p-1.5 text-[#5A6273] hover:text-[#16284F] dark:hover:text-[#5A85C4] transition-colors btn-press"
                title="Edit discipline"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => handleDelete(c.id)}
                className="p-1.5 text-[#5A6273] hover:text-[#8E1F1F] transition-colors btn-press"
                title="Delete discipline"
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
                {editingCat ? 'Edit Category' : 'Create Category'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="p-1 text-[#5A6273] hover:text-[#0D1017]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs font-mono">
              <div>
                <label className="text-[11px] uppercase tracking-wider font-semibold block mb-1 text-[#0D1017] dark:text-[#EFECE6]">
                  Discipline Title
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="e.g. Literary Fiction"
                  className="w-full px-3 py-2 border border-[#DFD7C7] dark:border-[#242A38] bg-transparent text-[#0D1017] dark:text-[#EFECE6]"
                />
              </div>

              <div>
                <label className="text-[11px] uppercase tracking-wider font-semibold block mb-1 text-[#0D1017] dark:text-[#EFECE6]">
                  Scope & Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
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
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
