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
      <div className="border-b border-[#DFD7C7] dark:border-[#262C3A] pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-[10px] tracking-[0.25em] uppercase text-[#16284F] dark:text-[#4A72B0] font-semibold font-mono">
            The Complete Registry
          </span>
          <h1 className="font-editorial text-4xl sm:text-5xl text-[#0D1017] dark:text-[#EBE8E1] mt-1">
            Inkora Printed Editions
          </h1>
          <p className="text-xs text-[#5A6273] dark:text-[#8E95A5] mt-1 max-w-xl font-body-literary">
            Hardcover, clothbound, and archival paperback works curated by editorial rigor and material permanence.
          </p>
        </div>

        {/* View Toggle & Results Count */}
        <div className="flex items-center gap-4 text-xs font-mono">
          <span className="text-[#5A6273] dark:text-[#8E95A5]">
            {books.length} {books.length === 1 ? 'Volume' : 'Volumes'} Found
          </span>

          <div className="flex items-center border border-[#DFD7C7] dark:border-[#262C3A] rounded-[2px] overflow-hidden">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 transition-colors btn-press ${
                viewMode === 'grid'
                  ? 'bg-[#0B0E14] text-[#F7F4EB] dark:bg-[#4A72B0] dark:text-[#FFFFFF]'
                  : 'text-[#5A6273] hover:text-[#0D1017] dark:text-[#8E95A5]'
              }`}
              title="Grid View"
            >
              <Grid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 transition-colors btn-press ${
                viewMode === 'list'
                  ? 'bg-[#0B0E14] text-[#F7F4EB] dark:bg-[#4A72B0] dark:text-[#FFFFFF]'
                  : 'text-[#5A6273] hover:text-[#0D1017] dark:text-[#8E95A5]'
              }`}
              title="List View"
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Search, Sort & Mobile Filter Toggle */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="flex-1 max-w-md flex border border-[#DFD7C7] dark:border-[#262C3A] bg-[#FFFFFF] dark:bg-[#151821] rounded-[2px] shadow-2xs">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by title, author, description, or ISBN..."
            className="w-full px-3 py-2 text-xs bg-transparent text-[#0D1017] dark:text-[#EBE8E1] focus:outline-hidden"
          />
          <button
            type="submit"
            className="px-3.5 py-2 bg-[#0B0E14] dark:bg-[#16284F] text-[#F7F4EB] hover:bg-[#16284F] dark:hover:bg-[#203666] transition-colors btn-press"
          >
            <Search className="w-3.5 h-3.5" />
          </button>
        </form>

        <div className="flex items-center gap-3 font-mono">
          {/* Mobile Filter Button */}
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="lg:hidden flex items-center gap-2 px-3 py-2 border border-[#DFD7C7] dark:border-[#262C3A] text-xs font-semibold text-[#0D1017] dark:text-[#EBE8E1] rounded-[2px] btn-press"
          >
            <Filter className="w-3.5 h-3.5 text-[#16284F] dark:text-[#4A72B0]" />
            <span>Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}</span>
          </button>

          {/* Sort Selector */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-[#5A6273] dark:text-[#8E95A5] hidden sm:inline">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-[#DFD7C7] dark:border-[#262C3A] bg-[#FFFFFF] dark:bg-[#151821] text-xs text-[#0D1017] dark:text-[#EBE8E1] focus:outline-hidden rounded-[2px]"
            >
              <option value="featured">Curator’s Selection</option>
              <option value="newest">Publication Date (Newest)</option>
              <option value="rating">Highest Reader Rating</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="title">Alphabetical (Title A–Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Active Filter Chips */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs font-mono">
          <span className="text-[#5A6273] dark:text-[#8E95A5] text-[11px] uppercase tracking-wider">
            Active Filters:
          </span>

          {selectedCategory !== 'all' && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#EBF0F8] dark:bg-[#1A2333] text-[#16284F] dark:text-[#4A72B0] border border-[#16284F]/30 dark:border-[#4A72B0]/30 rounded-[2px]">
              {categories.find((c) => c.id === selectedCategory)?.name || 'Category'}
              <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedCategory('all')} />
            </span>
          )}

          {selectedAuthor !== 'all' && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#EBF0F8] dark:bg-[#1A2333] text-[#16284F] dark:text-[#4A72B0] border border-[#16284F]/30 dark:border-[#4A72B0]/30 rounded-[2px]">
              {authors.find((a) => a.id === selectedAuthor)?.name || 'Author'}
              <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedAuthor('all')} />
            </span>
          )}

          {selectedCoverType !== 'all' && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#EBF0F8] dark:bg-[#1A2333] text-[#16284F] dark:text-[#4A72B0] border border-[#16284F]/30 dark:border-[#4A72B0]/30 rounded-[2px]">
              {selectedCoverType}
              <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedCoverType('all')} />
            </span>
          )}

          {availability !== 'all' && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#EBF0F8] dark:bg-[#1A2333] text-[#16284F] dark:text-[#4A72B0] border border-[#16284F]/30 dark:border-[#4A72B0]/30 rounded-[2px]">
              In Stock Only
              <X className="w-3 h-3 cursor-pointer" onClick={() => setAvailability('all')} />
            </span>
          )}

          <button
            onClick={handleResetFilters}
            className="text-[11px] text-[#5A6273] hover:text-[#0D1017] dark:hover:text-[#EBE8E1] underline cursor-pointer ml-2 flex items-center gap-1 btn-press"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset All</span>
          </button>
        </div>
      )}

      {/* Main Grid & Filter Sidebar Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Desktop Filter Sidebar */}
        <aside className="hidden lg:block space-y-6 p-6 border border-[#DFD7C7] dark:border-[#262C3A] bg-[#FFFFFF] dark:bg-[#151821] rounded-[2px] shadow-2xs">
          <div className="flex items-center justify-between border-b border-[#DFD7C7] dark:border-[#262C3A] pb-3">
            <span className="font-editorial text-xl text-[#0D1017] dark:text-[#EBE8E1]">
              Bibliographic Filters
            </span>
            <button
              onClick={handleResetFilters}
              className="text-[11px] font-mono text-[#16284F] dark:text-[#4A72B0] hover:underline"
            >
              Reset
            </button>
          </div>

          {/* Category Filter */}
          <div>
            <h4 className="text-[11px] uppercase tracking-wider font-semibold font-mono text-[#0D1017] dark:text-[#EBE8E1] mb-2.5">
              Disciplines
            </h4>
            <div className="space-y-1.5 text-xs text-[#5A6273] dark:text-[#8E95A5]">
              <div
                onClick={() => setSelectedCategory('all')}
                className={`flex items-center justify-between py-1.5 px-2 cursor-pointer transition-colors rounded-[2px] ${
                  selectedCategory === 'all'
                    ? 'text-[#16284F] dark:text-[#4A72B0] font-semibold bg-[#EBF0F8] dark:bg-[#1A2333]'
                    : 'hover:text-[#0D1017] dark:hover:text-[#EBE8E1] hover:bg-[#F8F5EE] dark:hover:bg-[#1C202B]'
                }`}
              >
                <span>All Disciplines</span>
                <span className="font-mono text-[10px]">{books.length}</span>
              </div>
              {categories.map((c) => (
                <div
                  key={c.id}
                  onClick={() => setSelectedCategory(c.id)}
                  className={`flex items-center justify-between py-1.5 px-2 cursor-pointer transition-colors rounded-[2px] ${
                    selectedCategory === c.id
                      ? 'text-[#16284F] dark:text-[#4A72B0] font-semibold bg-[#EBF0F8] dark:bg-[#1A2333]'
                      : 'hover:text-[#0D1017] dark:hover:text-[#EBE8E1] hover:bg-[#F8F5EE] dark:hover:bg-[#1C202B]'
                  }`}
                >
                  <span className="truncate">{c.name}</span>
                  <span className="font-mono text-[10px]">{c.bookCount}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Authors Filter */}
          <div className="pt-4 border-t border-[#DFD7C7] dark:border-[#262C3A]">
            <h4 className="text-[11px] uppercase tracking-wider font-semibold font-mono text-[#0D1017] dark:text-[#EBE8E1] mb-2.5">
              Authors
            </h4>
            <div className="space-y-1.5 text-xs text-[#5A6273] dark:text-[#8E95A5] max-h-48 overflow-y-auto pr-1">
              <div
                onClick={() => setSelectedAuthor('all')}
                className={`py-1.5 px-2 cursor-pointer transition-colors rounded-[2px] ${
                  selectedAuthor === 'all'
                    ? 'text-[#16284F] dark:text-[#4A72B0] font-semibold bg-[#EBF0F8] dark:bg-[#1A2333]'
                    : 'hover:text-[#0D1017] dark:hover:text-[#EBE8E1] hover:bg-[#F8F5EE] dark:hover:bg-[#1C202B]'
                }`}
              >
                All Authors
              </div>
              {authors.map((a) => (
                <div
                  key={a.id}
                  onClick={() => setSelectedAuthor(a.id)}
                  className={`py-1.5 px-2 cursor-pointer transition-colors truncate rounded-[2px] ${
                    selectedAuthor === a.id
                      ? 'text-[#16284F] dark:text-[#4A72B0] font-semibold bg-[#EBF0F8] dark:bg-[#1A2333]'
                      : 'hover:text-[#0D1017] dark:hover:text-[#EBE8E1] hover:bg-[#F8F5EE] dark:hover:bg-[#1C202B]'
                  }`}
                >
                  {a.name}
                </div>
              ))}
            </div>
          </div>

          {/* Binding Format */}
          <div className="pt-4 border-t border-[#DFD7C7] dark:border-[#262C3A]">
            <h4 className="text-[11px] uppercase tracking-wider font-semibold font-mono text-[#0D1017] dark:text-[#EBE8E1] mb-2.5">
              Binding Style
            </h4>
            <div className="space-y-1.5 text-xs text-[#5A6273] dark:text-[#8E95A5]">
              {['all', 'Clothbound', 'Hardcover', 'Paperback', 'Special Edition'].map((type) => (
                <div
                  key={type}
                  onClick={() => setSelectedCoverType(type)}
                  className={`py-1.5 px-2 cursor-pointer transition-colors rounded-[2px] ${
                    selectedCoverType === type
                      ? 'text-[#16284F] dark:text-[#4A72B0] font-semibold bg-[#EBF0F8] dark:bg-[#1A2333]'
                      : 'hover:text-[#0D1017] dark:hover:text-[#EBE8E1] hover:bg-[#F8F5EE] dark:hover:bg-[#1C202B]'
                  }`}
                >
                  {type === 'all' ? 'All Bindings' : type}
                </div>
              ))}
            </div>
          </div>

          {/* Availability Filter */}
          <div className="pt-4 border-t border-[#DFD7C7] dark:border-[#262C3A]">
            <label className="flex items-center gap-2 text-xs text-[#0D1017] dark:text-[#EBE8E1] cursor-pointer">
              <input
                type="checkbox"
                checked={availability === 'in_stock'}
                onChange={(e) => setAvailability(e.target.checked ? 'in_stock' : 'all')}
                className="w-3.5 h-3.5 accent-[#16284F] dark:accent-[#4A72B0]"
              />
              <span>In Stock Only</span>
            </label>
          </div>
        </aside>

        {/* Books Grid / List Content */}
        <main className="lg:col-span-3">
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 py-12">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="animate-pulse space-y-3">
                  <div className="aspect-3/4 bg-[#E2DAC9]/50 dark:bg-[#262C3A]/50 rounded-[2px]" />
                  <div className="h-4 bg-[#E2DAC9]/60 dark:bg-[#262C3A]/60 w-3/4 rounded-xs" />
                  <div className="h-3 bg-[#E2DAC9]/40 dark:bg-[#262C3A]/40 w-1/2 rounded-xs" />
                </div>
              ))}
            </div>
          ) : paginatedBooks.length === 0 ? (
            <div className="border border-[#DFD7C7] dark:border-[#262C3A] p-12 text-center bg-[#FFFFFF] dark:bg-[#151821] rounded-[2px]">
              <h3 className="font-editorial text-2xl text-[#0D1017] dark:text-[#EBE8E1] mb-2">
                No editions match your criteria
              </h3>
              <p className="text-xs text-[#5A6273] dark:text-[#8E95A5] max-w-sm mx-auto mb-6 font-body-literary">
                Try loosening your filters or resetting search keywords to view the broader catalog.
              </p>
              <button
                onClick={handleResetFilters}
                className="px-6 py-2.5 bg-[#0B0E14] dark:bg-[#16284F] text-[#F7F4EB] text-xs font-semibold tracking-wider uppercase hover:bg-[#16284F] dark:hover:bg-[#203666] transition-colors font-mono btn-press rounded-[2px]"
              >
                Reset All Filters
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
            <div className="mt-12 pt-6 border-t border-[#DFD7C7] dark:border-[#262C3A] flex items-center justify-between text-xs font-mono">
              <span className="text-[#5A6273] dark:text-[#8E95A5]">
                Page {currentPage} of {totalPages}
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 border border-[#DFD7C7] dark:border-[#262C3A] disabled:opacity-40 hover:bg-[#F8F5EE] dark:hover:bg-[#1C202B] text-[#0D1017] dark:text-[#EBE8E1] rounded-[2px] btn-press"
                >
                  Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-8 h-8 flex items-center justify-center border rounded-[2px] transition-colors btn-press ${
                      currentPage === page
                        ? 'border-[#0B0E14] dark:border-[#4A72B0] bg-[#0B0E14] dark:bg-[#4A72B0] text-[#F7F4EB] font-semibold'
                        : 'border-[#DFD7C7] dark:border-[#262C3A] text-[#0D1017] dark:text-[#EBE8E1] hover:bg-[#F8F5EE] dark:hover:bg-[#1C202B]'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 border border-[#DFD7C7] dark:border-[#262C3A] disabled:opacity-40 hover:bg-[#F8F5EE] dark:hover:bg-[#1C202B] text-[#0D1017] dark:text-[#EBE8E1] rounded-[2px] btn-press"
                >
                  Next
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
          <div className="relative ml-auto w-full max-w-xs bg-[#F7F4EB] dark:bg-[#151821] h-full shadow-2xl p-6 overflow-y-auto space-y-6 animate-in slide-in-from-right duration-250">
            <div className="flex items-center justify-between border-b border-[#DFD7C7] dark:border-[#262C3A] pb-3">
              <span className="font-editorial text-2xl text-[#0D1017] dark:text-[#EBE8E1]">
                Filters
              </span>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="p-1 text-[#5A6273] btn-press"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Disciplines Mobile */}
            <div>
              <h4 className="text-xs uppercase font-semibold font-mono text-[#0D1017] dark:text-[#EBE8E1] mb-2">
                Disciplines
              </h4>
              <div className="space-y-2 text-xs">
                <div
                  onClick={() => {
                    setSelectedCategory('all');
                    setMobileFilterOpen(false);
                  }}
                  className={`py-1 cursor-pointer ${selectedCategory === 'all' ? 'text-[#16284F] dark:text-[#4A72B0] font-bold' : ''}`}
                >
                  All Disciplines
                </div>
                {categories.map((c) => (
                  <div
                    key={c.id}
                    onClick={() => {
                      setSelectedCategory(c.id);
                      setMobileFilterOpen(false);
                    }}
                    className={`py-1 cursor-pointer ${selectedCategory === c.id ? 'text-[#16284F] dark:text-[#4A72B0] font-bold' : ''}`}
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
              className="w-full py-2.5 bg-[#0B0E14] dark:bg-[#16284F] text-[#F7F4EB] text-xs font-semibold uppercase tracking-wider text-center font-mono btn-press rounded-[2px]"
            >
              Apply & Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
