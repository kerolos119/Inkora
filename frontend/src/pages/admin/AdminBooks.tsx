import { t } from '../../i18n';
import React, { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  X,
  Check,
  AlertCircle,
  Eye,
} from 'lucide-react';
import { Book, Category, Author } from '../../types/index.js';
import { api } from '../../services/api.js';
import { useToast } from '../../context/ToastContext.js';

export const AdminBooks: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form State
  const [form, setForm] = useState<Partial<Book>>({
    bookTitle: '',
    authorName: '',
    authorId: '',
    bookDescription: '',
    numberOfPages: 300,
    bookSize: '140 × 210 mm',
    coverType: 'Clothbound',
    paperType: 'Munken Premium Cream 115gsm',
    publicationYear: '2024-06-01',
    language: 'English',
    isbn: '978-0-12-345678-9',
    price: 32.00,
    discount: 0,
    stock: 20,
    publisher: 'Inkora Editions',
    coverImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
    categoryId: [],
  });

  const { showToast } = useToast();

  const loadData = () => {
    setLoading(true);
    Promise.all([api.getBooks(), api.getCategories(), api.getAuthors()])
      .then(([b, c, a]) => {
        setBooks(b);
        setCategories(c);
        setAuthors(a);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const openAddModal = () => {
    setEditingBook(null);
    setForm({
      bookTitle: '',
      authorName: authors[0]?.name || 'Elena Rostova',
      authorId: authors[0]?.id || 'aut-1',
      bookDescription: '',
      numberOfPages: 320,
      bookSize: '140 × 210 mm',
      coverType: 'Clothbound',
      paperType: 'Munken Premium Cream 115gsm',
      publicationYear: '2024-06-15',
      language: 'English',
      isbn: `978-1-98-${Math.floor(100000 + Math.random() * 900000)}-1`,
      price: 29.50,
      discount: 0,
      stock: 25,
      publisher: 'Inkora Editions',
      coverImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
      categoryId: [categories[0]?.id || 'cat-1'],
    });
    setIsModalOpen(true);
  };

  const openEditModal = (b: Book) => {
    setEditingBook(b);
    setForm({ ...b });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingBook) {
        const updated = await api.updateBook(editingBook.id, form);
        setBooks(books.map((b) => (b.id === updated.id ? updated : b)));
        showToast(`Edition "${updated.bookTitle}" updated successfully`);
      } else {
        const created = await api.createBook(form);
        setBooks([created, ...books]);
        showToast(`New volume "${created.bookTitle}" registered into catalog`);
      }
      setIsModalOpen(false);
    } catch (err: any) {
      console.error('Save book failed:', err)
      showToast(err?.message || t('admin.saveFail'), 'error');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.deleteBook(id);
      setBooks(books.filter((b) => b.id !== id));
      setDeleteConfirmId(null);
      showToast('Book removed from registry', 'info');
    } catch (err: any) {
      showToast(t('admin.deleteFail'), 'error');
    }
  };

  const handleInlineStockUpdate = async (b: Book, newStock: number) => {
    try {
      const updated = await api.updateBook(b.id, { stock: Math.max(0, newStock) });
      setBooks(books.map((x) => (x.id === updated.id ? updated : x)));
      showToast(`Stock updated to ${updated.stock}`);
    } catch {
      showToast('Error updating stock', 'error');
    }
  };

  const filteredBooks = books.filter(
    (b) =>
      b.bookTitle.toLowerCase().includes(search.toLowerCase()) ||
      b.authorName.toLowerCase().includes(search.toLowerCase()) ||
      b.isbn.includes(search)
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-[#E3D6BC] dark:border-[#4A3E2E] pb-4 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-xs uppercase font-mono tracking-widest text-[#8A6238] dark:text-[#D9AE6B] font-semibold">
            Catalog Governance
          </span>
          <h1 className="font-editorial text-3xl sm:text-4xl text-[#3B2B1E] dark:text-[#F3ECDD] mt-1">
            Book Inscriptions & Inventory
          </h1>
        </div>

        <button
          onClick={openAddModal}
          className="px-5 py-2.5 bg-[#8A6238] dark:bg-[#D9AE6B] text-[#FAF6EC] text-xs font-semibold uppercase tracking-wider hover:bg-[#6F4D2B] dark:hover:bg-[#CBA77B] transition-colors flex items-center gap-2 cursor-pointer shadow-xs font-mono btn-press"
        >
          <Plus className="w-4 h-4" />
          <span>Inscribe New Edition</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="flex border border-[#E3D6BC] dark:border-[#4A3E2E] bg-[#FFFFFF] dark:bg-[#2A231B] max-w-md shadow-xs">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter by title, author, or ISBN..."
          className="w-full px-3 py-2 text-xs bg-transparent text-[#3B2B1E] dark:text-[#F3ECDD] focus:outline-hidden font-mono"
        />
        <div className="px-3 py-2 text-[#7A6652] dark:text-[#A99A82]">
          <Search className="w-3.5 h-3.5" />
        </div>
      </div>

      {/* Books Table */}
      <div className="border border-[#E3D6BC] dark:border-[#4A3E2E] bg-[#FFFFFF] dark:bg-[#2A231B] overflow-x-auto shadow-xs">
        <table className="w-full text-start text-xs">
          <thead>
            <tr className="border-b border-[#E3D6BC] dark:border-[#4A3E2E] text-[#7A6652] dark:text-[#A99A82] uppercase tracking-wider font-mono text-xs">
              <th className="p-3">Cover</th>
              <th className="p-3">Title & ISBN</th>
              <th className="p-3">Author</th>
              <th className="p-3">Binding</th>
              <th className="p-3">Price</th>
              <th className="p-3">Inventory</th>
              <th className="p-3 text-end">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E3D6BC]/60 dark:divide-[#4A3E2E]/60">
            {filteredBooks.map((b) => (
              <tr key={b.id} className="hover:bg-[#F1E9D6]/40 dark:hover:bg-[#2F261B]/40 transition-colors">
                <td className="p-3">
                  <img
                    src={b.coverImage}
                    alt={b.bookTitle}
                    className="w-10 h-14 object-cover border border-[#E3D6BC] dark:border-[#4A3E2E] rounded-[1px]"
                  />
                </td>
                <td className="p-3">
                  <span className="font-editorial text-base font-semibold text-[#3B2B1E] dark:text-[#F3ECDD] block">
                    {b.bookTitle}
                  </span>
                  <span className="font-mono text-xs text-[#7A6652] dark:text-[#A99A82]">
                    ISBN: {b.isbn}
                  </span>
                </td>
                <td className="p-3 text-[#3B2B1E] dark:text-[#F3ECDD] font-medium">{b.authorName}</td>
                <td className="p-3">
                  <span className="font-mono uppercase text-xs text-[#8A6238] dark:text-[#D9AE6B] font-semibold">
                    {b.coverType}
                  </span>
                </td>
                <td className="p-3 font-semibold text-[#3B2B1E] dark:text-[#F3ECDD] font-mono">
                  ${b.price.toFixed(2)}
                  {b.discount ? (
                    <span className="text-xs text-[#2A674A] ms-1">(-{b.discount}%)</span>
                  ) : null}
                </td>
                <td className="p-3">
                  <div className="flex items-center gap-1.5 font-mono">
                    <span
                      className={`font-semibold ${
                        b.stock <= 5 ? 'text-[#8E1F1F]' : 'text-[#3B2B1E] dark:text-[#F3ECDD]'
                      }`}
                    >
                      {b.stock}
                    </span>
                    <button
                      onClick={() => handleInlineStockUpdate(b, b.stock + 5)}
                      className="text-xs px-1.5 py-0.5 border border-[#E3D6BC] dark:border-[#4A3E2E] hover:bg-[#8A6238] dark:hover:bg-[#D9AE6B] hover:text-[#FAF6EC] transition-colors btn-press"
                      title="Quick +5 stock"
                    >
                      +5
                    </button>
                  </div>
                </td>
                <td className="p-3 text-end">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => openEditModal(b)}
                      className="p-1.5 text-[#7A6652] hover:text-[#8A6238] dark:hover:text-[#D9AE6B] transition-colors btn-press"
                      title="Edit book"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeleteConfirmId(b.id)}
                      className="p-1.5 text-[#7A6652] hover:text-[#8E1F1F] transition-colors btn-press"
                      title="Delete book"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setIsModalOpen(false)} />
          <div className="relative w-full max-w-2xl bg-[#FFFFFF] dark:bg-[#2A231B] border border-[#E3D6BC] dark:border-[#4A3E2E] shadow-2xl p-6 sm:p-8 space-y-6 z-10 animate-in fade-in max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#E3D6BC] dark:border-[#4A3E2E] pb-3">
              <h3 className="font-editorial text-2xl text-[#3B2B1E] dark:text-[#F3ECDD]">
                {editingBook ? 'Edit Book Edition' : 'Inscribe New Edition'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-[#7A6652] hover:text-[#3B2B1E] btn-press">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs font-mono">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] uppercase tracking-wider font-semibold text-[#3B2B1E] dark:text-[#F3ECDD] block mb-1">
                    Book Title
                  </label>
                  <input
                    type="text"
                    value={form.bookTitle || ''}
                    onChange={(e) => setForm({ ...form, bookTitle: e.target.value })}
                    required
                    placeholder="e.g. The Architecture of Solitude"
                    className="w-full px-3 py-2 border border-[#E3D6BC] dark:border-[#4A3E2E] bg-transparent text-[#3B2B1E] dark:text-[#F3ECDD]"
                  />
                </div>

                <div>
                  <label className="text-[11px] uppercase tracking-wider font-semibold text-[#3B2B1E] dark:text-[#F3ECDD] block mb-1">
                    Author
                  </label>
                  <input
                    type="text"
                    value={form.authorName || ''}
                    onChange={(e) => setForm({ ...form, authorName: e.target.value })}
                    required
                    placeholder="Author name"
                    className="w-full px-3 py-2 border border-[#E3D6BC] dark:border-[#4A3E2E] bg-transparent text-[#3B2B1E] dark:text-[#F3ECDD]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] uppercase tracking-wider font-semibold text-[#3B2B1E] dark:text-[#F3ECDD] block mb-1">
                  Description & Critical Notes
                </label>
                <textarea
                  value={form.bookDescription || ''}
                  onChange={(e) => setForm({ ...form, bookDescription: e.target.value })}
                  rows={3}
                  required
                  className="w-full px-3 py-2 border border-[#E3D6BC] dark:border-[#4A3E2E] bg-transparent text-[#3B2B1E] dark:text-[#F3ECDD]"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-[11px] uppercase tracking-wider font-semibold text-[#3B2B1E] dark:text-[#F3ECDD] block mb-1">
                    Price ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={form.price || 0}
                    onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) })}
                    required
                    className="w-full px-3 py-2 border border-[#E3D6BC] dark:border-[#4A3E2E] bg-transparent text-[#3B2B1E] dark:text-[#F3ECDD]"
                  />
                </div>

                <div>
                  <label className="text-[11px] uppercase tracking-wider font-semibold text-[#3B2B1E] dark:text-[#F3ECDD] block mb-1">
                    Discount (%)
                  </label>
                  <input
                    type="number"
                    value={form.discount || 0}
                    onChange={(e) => setForm({ ...form, discount: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-[#E3D6BC] dark:border-[#4A3E2E] bg-transparent text-[#3B2B1E] dark:text-[#F3ECDD]"
                  />
                </div>

                <div>
                  <label className="text-[11px] uppercase tracking-wider font-semibold text-[#3B2B1E] dark:text-[#F3ECDD] block mb-1">
                    Stock Quantity
                  </label>
                  <input
                    type="number"
                    value={form.stock || 0}
                    onChange={(e) => setForm({ ...form, stock: parseInt(e.target.value) })}
                    required
                    className="w-full px-3 py-2 border border-[#E3D6BC] dark:border-[#4A3E2E] bg-transparent text-[#3B2B1E] dark:text-[#F3ECDD]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-[11px] uppercase tracking-wider font-semibold text-[#3B2B1E] dark:text-[#F3ECDD] block mb-1">
                    Binding Style
                  </label>
                  <select
                    value={form.coverType}
                    onChange={(e) => setForm({ ...form, coverType: e.target.value as any })}
                    className="w-full px-3 py-2 border border-[#E3D6BC] dark:border-[#4A3E2E] bg-[#FAF6EC] dark:bg-[#2A231B] text-[#3B2B1E] dark:text-[#F3ECDD]"
                  >
                    <option value="Clothbound">Clothbound</option>
                    <option value="Hardcover">Hardcover</option>
                    <option value="Paperback">Paperback</option>
                    <option value="Special Edition">Special Edition</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] uppercase tracking-wider font-semibold text-[#3B2B1E] dark:text-[#F3ECDD] block mb-1">
                    ISBN
                  </label>
                  <input
                    type="text"
                    value={form.isbn || ''}
                    onChange={(e) => setForm({ ...form, isbn: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-[#E3D6BC] dark:border-[#4A3E2E] bg-transparent font-mono text-[#3B2B1E] dark:text-[#F3ECDD]"
                  />
                </div>

                <div>
                  <label className="text-[11px] uppercase tracking-wider font-semibold text-[#3B2B1E] dark:text-[#F3ECDD] block mb-1">
                    Pages
                  </label>
                  <input
                    type="number"
                    value={form.numberOfPages || 300}
                    onChange={(e) => setForm({ ...form, numberOfPages: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-[#E3D6BC] dark:border-[#4A3E2E] bg-transparent text-[#3B2B1E] dark:text-[#F3ECDD]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] uppercase tracking-wider font-semibold text-[#3B2B1E] dark:text-[#F3ECDD] block mb-1">
                  Cover Image URL
                </label>
                <input
                  type="url"
                  value={form.coverImage || ''}
                  onChange={(e) => setForm({ ...form, coverImage: e.target.value })}
                  placeholder="https://..."
                  required
                  className="w-full px-3 py-2 border border-[#E3D6BC] dark:border-[#4A3E2E] bg-transparent text-[#3B2B1E] dark:text-[#F3ECDD]"
                />
              </div>

              <div className="pt-4 border-t border-[#E3D6BC] dark:border-[#4A3E2E] flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-[#E3D6BC] dark:border-[#4A3E2E] text-xs uppercase btn-press"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#8A6238] dark:bg-[#D9AE6B] text-[#FAF6EC] text-xs font-semibold uppercase tracking-wider hover:bg-[#6F4D2B] dark:hover:bg-[#CBA77B] font-mono btn-press"
                >
                  Save Inscription
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60" onClick={() => setDeleteConfirmId(null)} />
          <div className="relative bg-[#FFFFFF] dark:bg-[#2A231B] border border-[#8E1F1F]/40 p-6 max-w-sm w-full space-y-4 z-10 animate-in fade-in shadow-xl">
            <h4 className="font-editorial text-xl text-[#8E1F1F] dark:text-[#E25858]">{t('admin.deleteTitle')}</h4>
            <p className="text-xs text-[#7A6652] dark:text-[#A99A82] font-body-literary">
              {t('admin.deleteBody')}
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-3 py-1.5 border border-[#E3D6BC] dark:border-[#4A3E2E] text-xs font-mono btn-press"
              >
                {t('admin.keep')}
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-4 py-1.5 bg-[#8E1F1F] text-[#FAF6EC] text-xs font-semibold font-mono btn-press"
              >
                {t('admin.delete')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
