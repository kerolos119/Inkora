import { t } from '../i18n';
import React, { useState, useEffect } from 'react';
import {
  Search,
  Grid,
  List,
  X,
  Filter,
  RotateCcw,
} from 'lucide-react';
import { Book, Category, Author } from '../types/index.js';
import { api } from '../services/api.js';
import { BookCard } from '../components/books/BookCard.js';

interface CatalogPageProps {
  onNavigate: (page: string) => void;
  onQuickView: (book: Book) => void;
  initialCategory?: string;
  searchQuery?: string;
}

export const CatalogPage: React.FC<CatalogPageProps> = ({
  onNavigate,
  onQuickView,
  initialCategory,
  searchQuery = '',
}) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [query, setQuery] = useState(searchQuery);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || 'all');
  const [selectedAuthor, setSelectedAuthor] = useState<string>('all');
  const [selectedCoverType, setSelectedCoverType] = useState<string>('all');
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(100);
  const [availability, setAvailability] = useState<'all' | 'in_stock'>('all');
  const [sortBy, setSortBy] = useState<string>('featured');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Mobile Filter Drawer
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    Promise.all([api.getCategories(), api.getAuthors()])
      .then(([c, a]) => {
        setCategories(c);
        setAuthors(a);
      })
      .catch(console.error);
  }, []);

  const fetchFilteredBooks = () => {
    setLoading(true);
    api
      .searchBooks({
        query,
        categoryId: selectedCategory,
        authorId: selectedAuthor,
        coverType: selectedCoverType,
        minPrice,
        maxPrice,
        availability,
        sortBy,
      })
      .then((res) => {
        setBooks(res);
        setCurrentPage(1);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchFilteredBooks();
  }, [selectedCategory, selectedAuthor, selectedCoverType, availability, sortBy]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchFilteredBooks();
  };

  const handleResetFilters = () => {
    setQuery('');
    setSelectedCategory('all');
    setSelectedAuthor('all');
    setSelectedCoverType('all');
    setMinPrice(0);
    setMaxPrice(100);
    setAvailability('all');
    setSortBy('featured');
  };

  // Pagination slicing
  const totalPages = Math.ceil(books.length / itemsPerPage);
  const paginatedBooks = books.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const activeFiltersCount =
    (selectedCategory !== 'all' ? 1 : 0) +
    (selectedAuthor !== 'all' ? 1 : 0) +
    (selectedCoverType !== 'all' ? 1 : 0) +
    (availability !== 'all' ? 1 : 0) +
    (query ? 1 : 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-ink-fade">
      {/* Editorial Header */}
      <div className="border-b border-[#E3D6BC] dark:border-[#4A3E2E] pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-xs tracking-[0.25em] uppercase text-[#8A6238] dark:text-[#D2A560] font-semibold font-mono">
            {t('x.d0f53a')}
          </span>
          <h1 className="font-editorial text-4xl sm:text-5xl text-[#3B2B1E] dark:text-[#F3ECDD] mt-1">
            {t('x.057186')}
          </h1>
          <p className="text-xs text-[#7A6652] dark:text-[#A99A82] mt-1 max-w-xl font-body-literary">
            {t('x.19380d')}
          </p>
        </div>

        {/* View Toggle & Results Count */}
        <div className="flex items-center gap-4 text-xs font-mono">
          <span className="text-[#7A6652] dark:text-[#A99A82]">
            {books.length} {books.length === 1 ? 'Volume' : 'Volumes'} Found
          </span>

          <div className="flex items-center border border-[#E3D6BC] dark:border-[#4A3E2E] rounded-[2px] overflow-hidden">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 transition-colors btn-press ${
                viewMode === 'grid'
                  ? 'bg-[#3B2B1E] text-[#FAF6EC] dark:bg-[#D2A560] dark:text-[#FFFFFF]'
                  : 'text-[#7A6652] hover:text-[#3B2B1E] dark:text-[#A99A82]'
              }`}
              title={t('x.602bf1')}
            >
              <Grid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 transition-colors btn-press ${
                viewMode === 'list'
                  ? 'bg-[#3B2B1E] text-[#FAF6EC] dark:bg-[#D2A560] dark:text-[#FFFFFF]'
                  : 'text-[#7A6652] hover:text-[#3B2B1E] dark:text-[#A99A82]'
              }`}
              title={t('x.fb1bde')}
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Search, Sort & Mobile Filter Toggle */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="flex-1 max-w-md flex border border-[#E3D6BC] dark:border-[#4A3E2E] bg-[#FFFFFF] dark:bg-[#2A231B] rounded-[2px] shadow-2xs">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('x.f4e52c')}
            className="w-full px-3 py-2 text-xs bg-transparent text-[#3B2B1E] dark:text-[#F3ECDD] focus:outline-hidden"
          />
          <button
            type="submit"
            className="px-3.5 py-2 bg-[#3B2B1E] dark:bg-[#8A6238] text-[#FAF6EC] hover:bg-[#8A6238] dark:hover:bg-[#604626] transition-colors btn-press"
          >
            <Search className="w-3.5 h-3.5" />
          </button>
        </form>

        <div className="flex items-center gap-3 font-mono">
          {/* Mobile Filter Button */}
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="lg:hidden flex items-center gap-2 px-3 py-2 border border-[#E3D6BC] dark:border-[#4A3E2E] text-xs font-semibold text-[#3B2B1E] dark:text-[#F3ECDD] rounded-[2px] btn-press"
          >
            <Filter className="w-3.5 h-3.5 text-[#8A6238] dark:text-[#D2A560]" />
            <span>Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}</span>
          </button>

          {/* Sort Selector */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-[#7A6652] dark:text-[#A99A82] hidden sm:inline">{t('x.8b335a')}</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-[#E3D6BC] dark:border-[#4A3E2E] bg-[#FFFFFF] dark:bg-[#2A231B] text-xs text-[#3B2B1E] dark:text-[#F3ECDD] focus:outline-hidden rounded-[2px]"
            >
              <option value="featured">{t('x.4108c8')}</option>
              <option value="newest">{t('x.cd642e')}</option>
              <option value="rating">{t('x.ddb057')}</option>
              <option value="price_asc">{t('x.ed3d3a')}</option>
              <option value="price_desc">{t('x.c60097')}</option>
              <option value="title">{t('x.23c009')}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Active Filter Chips */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs font-mono">
          <span className="text-[#7A6652] dark:text-[#A99A82] text-[11px] uppercase tracking-wider">
            {t('x.051efa')}
          </span>

          {selectedCategory !== 'all' && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#F6EBD3] dark:bg-[#33281A] text-[#8A6238] dark:text-[#D2A560] border border-[#8A6238]/30 dark:border-[#D2A560]/30 rounded-[2px]">
              {categories.find((c) => c.id === selectedCategory)?.name || 'Category'}
              <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedCategory('all')} />
            </span>
          )}

          {selectedAuthor !== 'all' && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#F6EBD3] dark:bg-[#33281A] text-[#8A6238] dark:text-[#D2A560] border border-[#8A6238]/30 dark:border-[#D2A560]/30 rounded-[2px]">
              {authors.find((a) => a.id === selectedAuthor)?.name || 'Author'}
              <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedAuthor('all')} />
            </span>
          )}

          {selectedCoverType !== 'all' && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#F6EBD3] dark:bg-[#33281A] text-[#8A6238] dark:text-[#D2A560] border border-[#8A6238]/30 dark:border-[#D2A560]/30 rounded-[2px]">
              {selectedCoverType}
              <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedCoverType('all')} />
            </span>
          )}

          {availability !== 'all' && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#F6EBD3] dark:bg-[#33281A] text-[#8A6238] dark:text-[#D2A560] border border-[#8A6238]/30 dark:border-[#D2A560]/30 rounded-[2px]">
              {t('x.31540f')}
              <X className="w-3 h-3 cursor-pointer" onClick={() => setAvailability('all')} />
            </span>
          )}

          <button
            onClick={handleResetFilters}
            className="text-[11px] text-[#7A6652] hover:text-[#3B2B1E] dark:hover:text-[#F3ECDD] underline cursor-pointer ms-2 flex items-center gap-1 btn-press"
          >
            <RotateCcw className="w-3 h-3" />
            <span>{t('x.58f5fb')}</span>
          </button>
        </div>
      )}

      {/* Main Grid & Filter Sidebar Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Desktop Filter Sidebar */}
        <aside className="hidden lg:block space-y-6 p-6 border border-[#E3D6BC] dark:border-[#4A3E2E] bg-[#FFFFFF] dark:bg-[#2A231B] rounded-[2px] shadow-2xs">
          <div className="flex items-center justify-between border-b border-[#E3D6BC] dark:border-[#4A3E2E] pb-3">
            <span className="font-editorial text-xl text-[#3B2B1E] dark:text-[#F3ECDD]">
              {t('x.84401b')}
            </span>
            <button
              onClick={handleResetFilters}
              className="text-[11px] font-mono text-[#8A6238] dark:text-[#D2A560] hover:underline"
            >
              {t('x.44c57a')}
            </button>
          </div>

          {/* Category Filter */}
          <div>
            <h4 className="text-[11px] uppercase tracking-wider font-semibold font-mono text-[#3B2B1E] dark:text-[#F3ECDD] mb-2.5">
              {t('x.3ed4ae')}
            </h4>
            <div className="space-y-1.5 text-xs text-[#7A6652] dark:text-[#A99A82]">
              <div
                onClick={() => setSelectedCategory('all')}
                className={`flex items-center justify-between py-1.5 px-2 cursor-pointer transition-colors rounded-[2px] ${
                  selectedCategory === 'all'
                    ? 'text-[#8A6238] dark:text-[#D2A560] font-semibold bg-[#F6EBD3] dark:bg-[#33281A]'
                    : 'hover:text-[#3B2B1E] dark:hover:text-[#F3ECDD] hover:bg-[#F8F5EE] dark:hover:bg-[#342B21]'
                }`}
              >
                <span>{t('x.dfee42')}</span>
                <span className="font-mono text-xs">{books.length}</span>
              </div>
              {categories.map((c) => (
                <div
                  key={c.id}
                  onClick={() => setSelectedCategory(c.id)}
                  className={`flex items-center justify-between py-1.5 px-2 cursor-pointer transition-colors rounded-[2px] ${
                    selectedCategory === c.id
                      ? 'text-[#8A6238] dark:text-[#D2A560] font-semibold bg-[#F6EBD3] dark:bg-[#33281A]'
                      : 'hover:text-[#3B2B1E] dark:hover:text-[#F3ECDD] hover:bg-[#F8F5EE] dark:hover:bg-[#342B21]'
                  }`}
                >
                  <span className="truncate">{c.name}</span>
                  <span className="font-mono text-xs">{c.bookCount}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Authors Filter */}
          <div className="pt-4 border-t border-[#E3D6BC] dark:border-[#4A3E2E]">
            <h4 className="text-[11px] uppercase tracking-wider font-semibold font-mono text-[#3B2B1E] dark:text-[#F3ECDD] mb-2.5">
              {t('x.d2a525')}
            </h4>
            <div className="space-y-1.5 text-xs text-[#7A6652] dark:text-[#A99A82] max-h-48 overflow-y-auto pe-1">
              <div
                onClick={() => setSelectedAuthor('all')}
                className={`py-1.5 px-2 cursor-pointer transition-colors rounded-[2px] ${
                  selectedAuthor === 'all'
                    ? 'text-[#8A6238] dark:text-[#D2A560] font-semibold bg-[#F6EBD3] dark:bg-[#33281A]'
                    : 'hover:text-[#3B2B1E] dark:hover:text-[#F3ECDD] hover:bg-[#F8F5EE] dark:hover:bg-[#342B21]'
                }`}
              >
                {t('x.afc79c')}
              </div>
              {authors.map((a) => (
                <div
                  key={a.id}
                  onClick={() => setSelectedAuthor(a.id)}
                  className={`py-1.5 px-2 cursor-pointer transition-colors truncate rounded-[2px] ${
                    selectedAuthor === a.id
                      ? 'text-[#8A6238] dark:text-[#D2A560] font-semibold bg-[#F6EBD3] dark:bg-[#33281A]'
                      : 'hover:text-[#3B2B1E] dark:hover:text-[#F3ECDD] hover:bg-[#F8F5EE] dark:hover:bg-[#342B21]'
                  }`}
                >
                  {a.name}
                </div>
              ))}
            </div>
          </div>

          {/* Binding Format */}
          <div className="pt-4 border-t border-[#E3D6BC] dark:border-[#4A3E2E]">
            <h4 className="text-[11px] uppercase tracking-wider font-semibold font-mono text-[#3B2B1E] dark:text-[#F3ECDD] mb-2.5">
              {t('x.601408')}
            </h4>
            <div className="space-y-1.5 text-xs text-[#7A6652] dark:text-[#A99A82]">
              {['all', 'Clothbound', 'Hardcover', 'Paperback', 'Special Edition'].map((type) => (
                <div
                  key={type}
                  onClick={() => setSelectedCoverType(type)}
                  className={`py-1.5 px-2 cursor-pointer transition-colors rounded-[2px] ${
                    selectedCoverType === type
                      ? 'text-[#8A6238] dark:text-[#D2A560] font-semibold bg-[#F6EBD3] dark:bg-[#33281A]'
                      : 'hover:text-[#3B2B1E] dark:hover:text-[#F3ECDD] hover:bg-[#F8F5EE] dark:hover:bg-[#342B21]'
                  }`}
                >
                  {type === 'all' ? 'All Bindings' : type}
                </div>
              ))}
            </div>
          </div>

          {/* Availability Filter */}
          <div className="pt-4 border-t border-[#E3D6BC] dark:border-[#4A3E2E]">
            <label className="flex items-center gap-2 text-xs text-[#3B2B1E] dark:text-[#F3ECDD] cursor-pointer">
              <input
                type="checkbox"
                checked={availability === 'in_stock'}
                onChange={(e) => setAvailability(e.target.checked ? 'in_stock' : 'all')}
                className="w-3.5 h-3.5 accent-[#8A6238] dark:accent-[#D2A560]"
              />
              <span>{t('x.31540f')}</span>
            </label>
          </div>
        </aside>

        {/* Books Grid / List Content */}
        <main className="lg:col-span-3">
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 py-12">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="animate-pulse space-y-3">
                  <div className="aspect-3/4 bg-[#E2DAC9]/50 dark:bg-[#4A3E2E]/50 rounded-[2px]" />
                  <div className="h-4 bg-[#E2DAC9]/60 dark:bg-[#4A3E2E]/60 w-3/4 rounded-xs" />
                  <div className="h-3 bg-[#E2DAC9]/40 dark:bg-[#4A3E2E]/40 w-1/2 rounded-xs" />
                </div>
              ))}
            </div>
          ) : paginatedBooks.length === 0 ? (
            <div className="border border-[#E3D6BC] dark:border-[#4A3E2E] p-12 text-center bg-[#FFFFFF] dark:bg-[#2A231B] rounded-[2px]">
              <h3 className="font-editorial text-2xl text-[#3B2B1E] dark:text-[#F3ECDD] mb-2">
                {t('x.6ad200')}
              </h3>
              <p className="text-xs text-[#7A6652] dark:text-[#A99A82] max-w-sm mx-auto mb-6 font-body-literary">
                {t('x.6c44d1')}
              </p>
              <button
                onClick={handleResetFilters}
                className="px-6 py-2.5 bg-[#3B2B1E] dark:bg-[#8A6238] text-[#FAF6EC] text-xs font-semibold tracking-wider uppercase hover:bg-[#8A6238] dark:hover:bg-[#604626] transition-colors font-mono btn-press rounded-[2px]"
              >
                {t('x.1b8543')}
              </button>
            </div>
          ) : (
            <div
              className={
                viewMode === 'grid'
                  ? 'grid grid-cols-2 sm:grid-cols-3 gap-6 sm:gap-8'
                  : 'space-y-4'
              }
            >
              {paginatedBooks.map((book) => (
                <BookCard
                  key={book.id}
                  book={book}
                  onNavigate={onNavigate}
                  onQuickView={onQuickView}
                  layout={viewMode}
                />
              ))}
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="mt-12 pt-6 border-t border-[#E3D6BC] dark:border-[#4A3E2E] flex items-center justify-between text-xs font-mono">
              <span className="text-[#7A6652] dark:text-[#A99A82]">
                Page {currentPage} of {totalPages}
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 border border-[#E3D6BC] dark:border-[#4A3E2E] disabled:opacity-40 hover:bg-[#F8F5EE] dark:hover:bg-[#342B21] text-[#3B2B1E] dark:text-[#F3ECDD] rounded-[2px] btn-press"
                >
                  {t('x.50f942')}
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-8 h-8 flex items-center justify-center border rounded-[2px] transition-colors btn-press ${
                      currentPage === page
                        ? 'border-[#3B2B1E] dark:border-[#D2A560] bg-[#3B2B1E] dark:bg-[#D2A560] text-[#FAF6EC] font-semibold'
                        : 'border-[#E3D6BC] dark:border-[#4A3E2E] text-[#3B2B1E] dark:text-[#F3ECDD] hover:bg-[#F8F5EE] dark:hover:bg-[#342B21]'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 border border-[#E3D6BC] dark:border-[#4A3E2E] disabled:opacity-40 hover:bg-[#F8F5EE] dark:hover:bg-[#342B21] text-[#3B2B1E] dark:text-[#F3ECDD] rounded-[2px] btn-press"
                >
                  {t('x.bc9819')}
                </button>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Mobile Filters Drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => setMobileFilterOpen(false)}
          />
          <div className="relative ms-auto w-full max-w-xs bg-[#FAF6EC] dark:bg-[#2A231B] h-full shadow-2xl p-6 overflow-y-auto space-y-6 animate-in slide-in-from-right duration-250">
            <div className="flex items-center justify-between border-b border-[#E3D6BC] dark:border-[#4A3E2E] pb-3">
              <span className="font-editorial text-2xl text-[#3B2B1E] dark:text-[#F3ECDD]">
                {t('x.96e578')}
              </span>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="p-1 text-[#7A6652] btn-press"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Disciplines Mobile */}
            <div>
              <h4 className="text-xs uppercase font-semibold font-mono text-[#3B2B1E] dark:text-[#F3ECDD] mb-2">
                {t('x.3ed4ae')}
              </h4>
              <div className="space-y-2 text-xs">
                <div
                  onClick={() => {
                    setSelectedCategory('all');
                    setMobileFilterOpen(false);
                  }}
                  className={`py-1 cursor-pointer ${selectedCategory === 'all' ? 'text-[#8A6238] dark:text-[#D2A560] font-bold' : ''}`}
                >
                  {t('x.dfee42')}
                </div>
                {categories.map((c) => (
                  <div
                    key={c.id}
                    onClick={() => {
                      setSelectedCategory(c.id);
                      setMobileFilterOpen(false);
                    }}
                    className={`py-1 cursor-pointer ${selectedCategory === c.id ? 'text-[#8A6238] dark:text-[#D2A560] font-bold' : ''}`}
                  >
                    {c.name}
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => {
                handleResetFilters();
                setMobileFilterOpen(false);
              }}
              className="w-full py-2.5 bg-[#3B2B1E] dark:bg-[#8A6238] text-[#FAF6EC] text-xs font-semibold uppercase tracking-wider text-center font-mono btn-press rounded-[2px]"
            >
              {t('x.b747cd')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
