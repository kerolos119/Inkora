import { t } from '../i18n';
import React, { useState, useEffect } from 'react';
import { ArrowRight, BookOpen, Feather, Quote, Check } from 'lucide-react';
import { Book, Category, Author } from '../types/index.js';
import { api } from '../services/api.js';
import { BookCard } from '../components/books/BookCard.js';

interface HomePageProps {
  onNavigate: (page: string) => void;
  onQuickView: (book: Book) => void;
}

const INK_PALETTES = [
  {
    id: 'carbon',
    name: t('x.41f367'),
    hex: '#3B2B1E',
    darkHex: '#EDEAE1',
    note: 'Pure soot & animal glue. Impervious to sunlight and moisture since 2500 BCE.',
    density: '1.24 g/cm³',
    badge: 'Standard Edition Inscription',
  },
  {
    id: 'irongall',
    name: t('x.d0a59d'),
    hex: '#8A6238',
    darkHex: '#D9AE6B',
    note: 'Crushed oak galls with iron vitriol. Oxidizes into paper fiber with deep blue-black permanence.',
    density: '1.18 g/cm³',
    badge: 'Archival Letterpress Binding',
  },
  {
    id: 'vermilion',
    name: t('x.9cf7e6'),
    hex: '#8E1F1F',
    darkHex: '#E25858',
    note: 'Natural cinnabar mineral crushed with refined castor oil for unalterable colophon seals.',
    density: '1.35 g/cm³',
    badge: 'Colophon Seal & Registry',
  },
  {
    id: 'walnut',
    name: t('x.964151'),
    hex: '#3A2920',
    darkHex: '#B89B84',
    note: 'Boiled green walnut husks creating warm, velvety sepia undertones beloved by Renaissance draughtsmen.',
    density: '1.12 g/cm³',
    badge: 'Endpaper Tone & Rubrication',
  },
];

export const HomePage: React.FC<HomePageProps> = ({ onNavigate, onQuickView }) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [activeTab, setActiveTab] = useState<'featured' | 'bestsellers' | 'newArrivals'>('featured');
  const [selectedInk, setSelectedInk] = useState(INK_PALETTES[1]); // default Iron Gall

  useEffect(() => {
    Promise.all([api.getBooks(), api.getCategories(), api.getAuthors()])
      .then(([b, c, a]) => {
        setBooks(b);
        setCategories(c);
        setAuthors(a);
      })
      .catch(console.error);
  }, []);

  const featuredBooks = books.filter((b) => b.featured);
  const bestsellers = books.filter((b) => b.bestseller);
  const newArrivals = books.filter((b) => b.newArrival);

  const displayedBooks =
    activeTab === 'featured'
      ? featuredBooks
      : activeTab === 'bestsellers'
      ? bestsellers
      : newArrivals;

  const leadBook = books[0] || null;

  return (
    <div className="space-y-20 pb-20">
      {/* ─────────────────────────────────────────────────────────────────
          1. Editorial Hero Composition (Authentic Ink & Hot-Pressed Paper)
         ───────────────────────────────────────────────────────────────── */}
      <section className="relative pt-6 sm:pt-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="border border-[#E3D6BC] dark:border-[#4A3E2E] bg-[#FFFFFF] dark:bg-[#2A231B] p-6 sm:p-12 lg:p-16 relative overflow-hidden shadow-xs">
          {/* Subtle ink watermark illustration */}
          <div className="absolute end-0 top-0 translate-x-10 -translate-y-10 font-editorial text-[220px] font-bold text-[#E2DAC9]/25 dark:text-[#342A1E]/30 select-none pointer-events-none italic">
            {t('x.048069')}
          </div>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Narrative Column */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex flex-wrap items-center gap-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#F6EBD3] dark:bg-[#342718] border border-[#8A6238]/30 dark:border-[#D9AE6B]/30 text-[#8A6238] dark:text-[#D9AE6B] text-xs tracking-[0.25em] uppercase font-semibold font-mono">
                  <Feather className="w-3 h-3 nib-hover" />
                  <span>{t('x.926822')}</span>
                </div>
                <span className="font-quill text-lg text-[#8E1F1F] dark:text-[#E25858] -rotate-2 select-none">
                  ~ Volume XXVI in permanent press ~
                </span>
              </div>

              <h1 className="font-editorial text-4xl sm:text-6xl lg:text-7xl font-normal tracking-tight text-[#3B2B1E] dark:text-[#F3ECDD] leading-[1.06]">
                Words inscribed in <br />
                <span className="italic font-editorial text-[#8A6238] dark:text-[#D9AE6B] font-medium animate-ink-draw inline-block">
                  {t('x.55ac12')}
                </span> <br />
                {t('x.737986')}
              </h1>

              <p className="text-sm sm:text-base text-[#7A6652] dark:text-[#A99A82] max-w-xl font-body-literary leading-relaxed">
                {t('x.ecd929')}
              </p>

              {/* Interactive Press Inks Swatch Bar */}
              <div className="pt-2 border-t border-[#E3D6BC]/60 dark:border-[#4A3E2E]/60">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs uppercase font-mono tracking-widest text-[#7A6652] dark:text-[#A99A82]">
                    {t('x.2ac973')}
                  </span>
                  <span className="font-quill text-sm text-[#8A6238] dark:text-[#D9AE6B]">
                    {selectedInk.name} ({selectedInk.density})
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {INK_PALETTES.map((ink) => (
                    <button
                      key={ink.id}
                      onClick={() => setSelectedInk(ink)}
                      className={`group relative flex items-center gap-2 px-2.5 py-1.5 border text-xs font-mono transition-all btn-press ${
                        selectedInk.id === ink.id
                          ? 'border-[#8A6238] dark:border-[#D9AE6B] bg-[#FAF6EC] dark:bg-[#31271B] shadow-xs'
                          : 'border-[#E3D6BC] dark:border-[#4A3E2E] bg-transparent hover:border-[#8A6238]/40'
                      }`}
                    >
                      <span
                        className="w-3 h-3 rounded-full shrink-0 border border-black/20 shadow-2xs group-hover:scale-110 transition-transform"
                        style={{ backgroundColor: ink.hex }}
                      />
                      <span className="text-[11px] font-medium text-[#3B2B1E] dark:text-[#F3ECDD]">
                        {ink.name}
                      </span>
                    </button>
                  ))}
                </div>

                <div className="mt-2.5 p-2 bg-[#FAF6EC]/70 dark:bg-[#261F16]/70 border border-[#E3D6BC]/50 dark:border-[#4A3E2E]/50 flex items-start gap-2">
                  <div
                    className="w-2.5 h-2.5 mt-0.5 rounded-full shrink-0"
                    style={{ backgroundColor: selectedInk.hex }}
                  />
                  <p className="text-[11px] text-[#7A6652] dark:text-[#A99A82] leading-tight font-body-literary italic">
                    {selectedInk.note}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => onNavigate('catalog')}
                  className="px-8 py-3.5 bg-[#3B2B1E] dark:bg-[#8A6238] hover:bg-[#8A6238] dark:hover:bg-[#604626] text-[#FAF6EC] text-xs font-semibold tracking-widest uppercase transition-all flex items-center gap-2 group shadow-sm cursor-pointer border border-[#8A6238]/40 btn-press"
                >
                  <span>{t('x.00892f')}</span>
                  <ArrowRight className="rtl:-scale-x-100 w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </button>

                {leadBook && (
                  <button
                    onClick={() => onNavigate(`book:${leadBook.id}`)}
                    className="px-6 py-3.5 border border-[#3B2B1E] dark:border-[#F3ECDD] text-[#3B2B1E] dark:text-[#F3ECDD] hover:bg-[#F1E9D6] dark:hover:bg-[#2F261B] text-xs font-semibold tracking-widest uppercase transition-colors cursor-pointer btn-press"
                  >
                    {t('x.07f4c3')}
                  </button>
                )}
              </div>

              {/* Minimalist Footnote Specs */}
              <div className="pt-6 border-t border-[#E3D6BC] dark:border-[#4A3E2E] grid grid-cols-3 gap-4 text-xs font-mono">
                <div>
                  <span className="block font-semibold text-[#3B2B1E] dark:text-[#F3ECDD]">{t('x.501289')}</span>
                  <span className="text-[11px] text-[#7A6652] dark:text-[#A99A82]">{t('x.58771a')}</span>
                </div>
                <div>
                  <span className="block font-semibold text-[#3B2B1E] dark:text-[#F3ECDD]">{t('x.707e90')}</span>
                  <span className="text-[11px] text-[#7A6652] dark:text-[#A99A82]">{t('x.38eedd')}</span>
                </div>
                <div>
                  <span className="block font-semibold text-[#3B2B1E] dark:text-[#F3ECDD]">Munken 115gsm</span>
                  <span className="text-[11px] text-[#7A6652] dark:text-[#A99A82]">{t('x.599505')}</span>
                </div>
              </div>
            </div>

            {/* Right Editorial Showcase (Layered Composition with Bookmark & Seal) */}
            <div className="lg:col-span-5 relative">
              {leadBook && (
                <div className="relative mx-auto max-w-sm">
                  {/* Background architectural box accent with deep ink wash */}
                  <div className="absolute inset-0 translate-x-4 translate-y-4 border border-[#8A6238]/40 bg-[#F1E9D6] dark:bg-[#272017] -z-1" />

                  {/* Bookmark Ribbon Hanging Out of Spine Top */}
                  <div className="absolute -top-6 start-12 z-20 animate-bookmark-sway pointer-events-none">
                    <div className="w-4 h-10 bg-[#8E1F1F] shadow-md relative">
                      <div className="absolute bottom-0 start-0 end-0 border-x-[8px] border-x-transparent border-b-[6px] border-b-[#FFFFFF] dark:border-b-[#2A231B]" />
                    </div>
                  </div>

                  {/* Red Ink Seal Stamp in Top Right */}
                  <div className="absolute -top-3 -end-3 z-20 animate-seal-pulse pointer-events-none">
                    <div className="w-14 h-14 rounded-full bg-[#8E1F1F] text-[#FAF6EC] border-2 border-[#FFFFFF] dark:border-[#2A231B] shadow-md flex flex-col items-center justify-center p-1 font-editorial text-xs tracking-wider uppercase text-center leading-tight">
                      <span className="font-bold">INKORA</span>
                      <span className="text-[6px] font-mono">SEAL 2026</span>
                    </div>
                  </div>

                  <div className="book-lift relative border border-[#E3D6BC] dark:border-[#4A3E2E] bg-[#FFFFFF] dark:bg-[#2A231B] p-4 shadow-xl">
                    <div className="book-cover-sheen relative aspect-3/4 overflow-hidden shadow-inner">
                      <img
                        src={leadBook.coverImage}
                        alt={leadBook.bookTitle}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-y-0 start-0 w-3 bg-gradient-to-r from-black/35 via-black/15 to-transparent pointer-events-none" />
                    </div>

                    <div className="mt-4 pt-3 border-t border-[#E3D6BC] dark:border-[#4A3E2E] flex items-end justify-between">
                      <div>
                        <span className="text-xs uppercase font-mono tracking-wider text-[#8A6238] dark:text-[#D9AE6B] font-semibold">
                          {t('x.4aef86')}
                        </span>
                        <h3 className="font-editorial text-lg text-[#3B2B1E] dark:text-[#F3ECDD]">
                          {leadBook.bookTitle}
                        </h3>
                        <p className="text-xs text-[#7A6652] dark:text-[#A99A82]">
                          by {leadBook.authorName}
                        </p>
                      </div>
                      <button
                        onClick={() => onQuickView(leadBook)}
                        className="text-xs font-semibold text-[#8A6238] dark:text-[#D9AE6B] hover:underline flex items-center gap-1 font-mono btn-press"
                      >
                        Inspect Edition →
                      </button>
                    </div>

                    {/* Handwritten Marginalia Note */}
                    <div className="mt-2 text-end">
                      <span className="font-quill text-base text-[#8E1F1F] dark:text-[#E25858]">
                        "Bound in Swedish Book-Cloth"
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────
          2. Curated Collections & Tabbed Books Section
         ───────────────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#E3D6BC] dark:border-[#4A3E2E] pb-4 mb-8">
          <div>
            <span className="text-xs tracking-[0.25em] uppercase text-[#8A6238] dark:text-[#D9AE6B] font-semibold font-mono">
              {t('x.88b6f6')}
            </span>
            <h2 className="font-editorial text-3xl sm:text-4xl text-[#3B2B1E] dark:text-[#F3ECDD] mt-1">
              {t('x.7e663b')}
            </h2>
          </div>

          {/* Editorial Tabs */}
          <div className="flex items-center gap-6 text-xs uppercase tracking-wider font-semibold font-mono">
            <button
              onClick={() => setActiveTab('featured')}
              className={`pb-2 border-b-2 transition-colors ${
                activeTab === 'featured'
                  ? 'border-[#8A6238] dark:border-[#D9AE6B] text-[#8A6238] dark:text-[#D9AE6B]'
                  : 'border-transparent text-[#7A6652] hover:text-[#3B2B1E] dark:text-[#A99A82] dark:hover:text-[#F3ECDD]'
              }`}
            >
              {t('x.776e19')}
            </button>
            <button
              onClick={() => setActiveTab('bestsellers')}
              className={`pb-2 border-b-2 transition-colors ${
                activeTab === 'bestsellers'
                  ? 'border-[#8A6238] dark:border-[#D9AE6B] text-[#8A6238] dark:text-[#D9AE6B]'
                  : 'border-transparent text-[#7A6652] hover:text-[#3B2B1E] dark:text-[#A99A82] dark:hover:text-[#F3ECDD]'
              }`}
            >
              {t('x.978d45')}
            </button>
            <button
              onClick={() => setActiveTab('newArrivals')}
              className={`pb-2 border-b-2 transition-colors ${
                activeTab === 'newArrivals'
                  ? 'border-[#8A6238] dark:border-[#D9AE6B] text-[#8A6238] dark:text-[#D9AE6B]'
                  : 'border-transparent text-[#7A6652] hover:text-[#3B2B1E] dark:text-[#A99A82] dark:hover:text-[#F3ECDD]'
              }`}
            >
              {t('x.dc3ec0')}
            </button>
          </div>
        </div>

        {/* Books Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          {displayedBooks.slice(0, 4).map((book) => (
            <BookCard
              key={book.id}
              book={book}
              onNavigate={onNavigate}
              onQuickView={onQuickView}
            />
          ))}
        </div>

        <div className="mt-10 text-center">
          <button
            onClick={() => onNavigate('catalog')}
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#3B2B1E] dark:text-[#F3ECDD] hover:text-[#8A6238] dark:hover:text-[#D9AE6B] border-b border-[#3B2B1E] dark:border-[#F3ECDD] pb-1 hover:border-[#8A6238] dark:hover:border-[#D9AE6B] transition-colors font-mono"
          >
            <span>Browse Full Catalog of {books.length} Editions</span>
            <ArrowRight className="rtl:-scale-x-100 w-3.5 h-3.5" />
          </button>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────
          3. Editorial Banner / The Chemistry of Dark Ink
         ───────────────────────────────────────────────────────────────── */}
      <section className="bg-[#F1E9D6] dark:bg-[#231C14] py-16 border-y border-[#E3D6BC] dark:border-[#4A3E2E]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5 space-y-4">
              <span className="text-xs tracking-[0.25em] uppercase text-[#8A6238] dark:text-[#D9AE6B] font-semibold font-mono">
                {t('x.d6f0c9')}
              </span>
              <h2 className="font-editorial text-3xl sm:text-4xl text-[#3B2B1E] dark:text-[#F3ECDD] leading-tight">
                {t('x.7d599d')}
              </h2>
              <p className="text-xs sm:text-sm text-[#7A6652] dark:text-[#A99A82] font-body-literary leading-relaxed">
                In an era of fleeting pixel flickers, deep pigment ink on cotton paper represents an indelible pledge. Carbon black does not fade under sunlight; iron gall ink binds into the very cellulose fibers of the page. It is a commitment that a sentence was worth printing permanently.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => onNavigate('editorial')}
                  className="text-xs font-semibold tracking-wider uppercase text-[#8A6238] dark:text-[#D9AE6B] hover:underline flex items-center gap-1.5 font-mono"
                >
                  <span>{t('x.7c2169')}</span>
                  <ArrowRight className="rtl:-scale-x-100 w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-6 bg-[#FFFFFF] dark:bg-[#1C1710] border border-[#E3D6BC] dark:border-[#4A3E2E] shadow-xs">
                <Quote className="w-6 h-6 text-[#8A6238]/40 dark:text-[#D9AE6B]/40 mb-3" />
                <p className="font-editorial text-lg italic text-[#3B2B1E] dark:text-[#F3ECDD] leading-relaxed mb-4">
                  “Inkora’s letterpress pages carry the crisp, uncompromised blackness that made the early printing workshops of Mainz and Venice legendary.”
                </p>
                <span className="text-xs font-mono uppercase tracking-wider text-[#7A6652] dark:text-[#A99A82]">
                  — Typographica & Bibliophile Gazette
                </span>
              </div>

              <div className="p-6 bg-[#FFFFFF] dark:bg-[#1C1710] border border-[#E3D6BC] dark:border-[#4A3E2E] shadow-xs">
                <Quote className="w-6 h-6 text-[#8A6238]/40 dark:text-[#D9AE6B]/40 mb-3" />
                <p className="font-editorial text-lg italic text-[#3B2B1E] dark:text-[#F3ECDD] leading-relaxed mb-4">
                  “Holding an Inkora volume feels like handling an original archival folio. The typography has weight, breath, and stillness.”
                </p>
                <span className="text-xs font-mono uppercase tracking-wider text-[#7A6652] dark:text-[#A99A82]">
                  — European Literary Review
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────
          4. Categories & Literary Disciplines
         ───────────────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between border-b border-[#E3D6BC] dark:border-[#4A3E2E] pb-4 mb-8">
          <div>
            <span className="text-xs tracking-[0.25em] uppercase text-[#8A6238] dark:text-[#D9AE6B] font-semibold font-mono">
              {t('x.c6f855')}
            </span>
            <h2 className="font-editorial text-3xl sm:text-4xl text-[#3B2B1E] dark:text-[#F3ECDD] mt-1">
              {t('x.4b8f32')}
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => onNavigate(`catalog:category:${cat.id}`)}
              className="group border border-[#E3D6BC] dark:border-[#4A3E2E] bg-[#FFFFFF] dark:bg-[#2A231B] p-6 hover:border-[#8A6238] dark:hover:border-[#D9AE6B] cursor-pointer transition-all flex flex-col justify-between shadow-xs"
            >
              <div>
                <div className="flex items-center justify-between text-[11px] text-[#7A6652] dark:text-[#A99A82] mb-2 font-mono">
                  <span>DISCIPLINE {cat.id.toUpperCase()}</span>
                  <span>{cat.bookCount} VOLUMES</span>
                </div>
                <h3 className="font-editorial text-2xl text-[#3B2B1E] dark:text-[#F3ECDD] group-hover:text-[#8A6238] dark:group-hover:text-[#D9AE6B] transition-colors mb-2">
                  {cat.name}
                </h3>
                <p className="text-xs text-[#7A6652] dark:text-[#A99A82] leading-relaxed">
                  {cat.description}
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-[#E3D6BC]/60 dark:border-[#4A3E2E]/60 flex items-center justify-between text-xs font-semibold text-[#8A6238] dark:text-[#D9AE6B] font-mono">
                <span>{t('x.0c8985')}</span>
                <ArrowRight className="rtl:-scale-x-100 w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────
          5. Authors Spotlight
         ───────────────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-b border-[#E3D6BC] dark:border-[#4A3E2E] pb-4 mb-8">
          <span className="text-xs tracking-[0.25em] uppercase text-[#8A6238] dark:text-[#D9AE6B] font-semibold font-mono">
            {t('x.b17792')}
          </span>
          <h2 className="font-editorial text-3xl sm:text-4xl text-[#3B2B1E] dark:text-[#F3ECDD] mt-1">
            {t('x.1d9934')}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {authors.slice(0, 3).map((author) => (
            <div
              key={author.id}
              className="border border-[#E3D6BC] dark:border-[#4A3E2E] bg-[#FFFFFF] dark:bg-[#2A231B] p-6 flex flex-col justify-between shadow-xs"
            >
              <div>
                <div className="w-16 h-16 overflow-hidden mb-4 border border-[#E3D6BC] dark:border-[#4A3E2E]">
                  <img
                    src={author.photo}
                    alt={author.name}
                    className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
                  />
                </div>
                <span className="text-xs font-mono uppercase tracking-wider text-[#8A6238] dark:text-[#D9AE6B] font-semibold">
                  {author.nationality} · {author.booksCount} Works
                </span>
                <h3 className="font-editorial text-2xl text-[#3B2B1E] dark:text-[#F3ECDD] mt-1 mb-2">
                  {author.name}
                </h3>
                <p className="text-xs text-[#7A6652] dark:text-[#A99A82] leading-relaxed line-clamp-3 mb-4">
                  {author.bio}
                </p>
              </div>

              <div className="pt-4 border-t border-[#E3D6BC]/60 dark:border-[#4A3E2E]/60">
                <span className="text-xs uppercase font-mono text-[#7A6652] dark:text-[#A99A82] block">
                  {t('x.a73914')}
                </span>
                <span className="font-editorial text-sm italic text-[#3B2B1E] dark:text-[#F3ECDD]">
                  {author.notableWork}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
