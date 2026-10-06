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
    name: 'Carbon Sumi',
    hex: '#0B0E14',
    darkHex: '#EDEAE1',
    note: 'Pure soot & animal glue. Impervious to sunlight and moisture since 2500 BCE.',
    density: '1.24 g/cm³',
    badge: 'Standard Edition Inscription',
  },
  {
    id: 'irongall',
    name: 'Iron Gall Indigo',
    hex: '#16284F',
    darkHex: '#5A85C4',
    note: 'Crushed oak galls with iron vitriol. Oxidizes into paper fiber with deep blue-black permanence.',
    density: '1.18 g/cm³',
    badge: 'Archival Letterpress Binding',
  },
  {
    id: 'vermilion',
    name: 'Cinnabar Seal',
    hex: '#8E1F1F',
    darkHex: '#E25858',
    note: 'Natural cinnabar mineral crushed with refined castor oil for unalterable colophon seals.',
    density: '1.35 g/cm³',
    badge: 'Colophon Seal & Registry',
  },
  {
    id: 'walnut',
    name: 'Walnut Bister',
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
        <div className="border border-[#DFD7C7] dark:border-[#242A38] bg-[#FFFFFF] dark:bg-[#131720] p-6 sm:p-12 lg:p-16 relative overflow-hidden shadow-xs">
          {/* Subtle ink watermark illustration */}
          <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 font-editorial text-[220px] font-bold text-[#E2DAC9]/25 dark:text-[#1F2533]/30 select-none pointer-events-none italic">
            Ink
          </div>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Narrative Column */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex flex-wrap items-center gap-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#EBF0F8] dark:bg-[#162236] border border-[#16284F]/30 dark:border-[#5A85C4]/30 text-[#16284F] dark:text-[#5A85C4] text-[10px] tracking-[0.25em] uppercase font-semibold font-mono">
                  <Feather className="w-3 h-3 nib-hover" />
                  <span>The Iron Gall & Carbon Ink Monograph Series</span>
                </div>
                <span className="font-quill text-lg text-[#8E1F1F] dark:text-[#E25858] -rotate-2 select-none">
                  ~ Volume XXVI in permanent press ~
                </span>
              </div>

              <h1 className="font-editorial text-4xl sm:text-6xl lg:text-7xl font-normal tracking-tight text-[#0D1017] dark:text-[#EFECE6] leading-[1.06]">
                Words inscribed in <br />
                <span className="italic font-editorial text-[#16284F] dark:text-[#5A85C4] font-medium animate-ink-draw inline-block">
                  permanent dark ink
                </span> <br />
                for eternal quietude.
              </h1>

              <p className="text-sm sm:text-base text-[#5A6273] dark:text-[#8F97A8] max-w-xl font-body-literary leading-relaxed">
                Inkora publishes and curates masterwork editions on unbleached Swedish Munken paper, Smyth-sewn clothbound spines, and archival letterpress type. Crafted for readers who honor the tactile ceremony of the written word.
              </p>

              {/* Interactive Press Inks Swatch Bar */}
              <div className="pt-2 border-t border-[#DFD7C7]/60 dark:border-[#242A38]/60">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] uppercase font-mono tracking-widest text-[#5A6273] dark:text-[#8F97A8]">
                    Select Press Ink Formulation:
                  </span>
                  <span className="font-quill text-sm text-[#16284F] dark:text-[#5A85C4]">
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
                          ? 'border-[#16284F] dark:border-[#5A85C4] bg-[#F7F4EB] dark:bg-[#1C2230] shadow-xs'
                          : 'border-[#DFD7C7] dark:border-[#242A38] bg-transparent hover:border-[#16284F]/40'
                      }`}
                    >
                      <span
                        className="w-3 h-3 rounded-full shrink-0 border border-black/20 shadow-2xs group-hover:scale-110 transition-transform"
                        style={{ backgroundColor: ink.hex }}
                      />
                      <span className="text-[11px] font-medium text-[#0D1017] dark:text-[#EFECE6]">
                        {ink.name}
                      </span>
                    </button>
                  ))}
                </div>

                <div className="mt-2.5 p-2 bg-[#F7F4EB]/70 dark:bg-[#161B26]/70 border border-[#DFD7C7]/50 dark:border-[#242A38]/50 flex items-start gap-2">
                  <div
                    className="w-2.5 h-2.5 mt-0.5 rounded-full shrink-0"
                    style={{ backgroundColor: selectedInk.hex }}
                  />
                  <p className="text-[11px] text-[#5A6273] dark:text-[#8F97A8] leading-tight font-body-literary italic">
                    {selectedInk.note}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => onNavigate('catalog')}
                  className="px-8 py-3.5 bg-[#0B0E14] dark:bg-[#16284F] hover:bg-[#16284F] dark:hover:bg-[#203666] text-[#F7F4EB] text-xs font-semibold tracking-widest uppercase transition-all flex items-center gap-2 group shadow-sm cursor-pointer border border-[#16284F]/40 btn-press"
                >
                  <span>Explore Printed Catalog</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </button>

                {leadBook && (
                  <button
                    onClick={() => onNavigate(`book:${leadBook.id}`)}
                    className="px-6 py-3.5 border border-[#0B0E14] dark:border-[#EFECE6] text-[#0D1017] dark:text-[#EFECE6] hover:bg-[#EFEAE0] dark:hover:bg-[#1C212E] text-xs font-semibold tracking-widest uppercase transition-colors cursor-pointer btn-press"
                  >
                    Inspect Lead Monograph
                  </button>
                )}
              </div>

              {/* Minimalist Footnote Specs */}
              <div className="pt-6 border-t border-[#DFD7C7] dark:border-[#242A38] grid grid-cols-3 gap-4 text-xs font-mono">
                <div>
                  <span className="block font-semibold text-[#0D1017] dark:text-[#EFECE6]">Non-Fading</span>
                  <span className="text-[11px] text-[#5A6273] dark:text-[#8F97A8]">Carbon Black Inks</span>
                </div>
                <div>
                  <span className="block font-semibold text-[#0D1017] dark:text-[#EFECE6]">Smyth-Sewn</span>
                  <span className="text-[11px] text-[#5A6273] dark:text-[#8F97A8]">Lays Completely Flat</span>
                </div>
                <div>
                  <span className="block font-semibold text-[#0D1017] dark:text-[#EFECE6]">Munken 115gsm</span>
                  <span className="text-[11px] text-[#5A6273] dark:text-[#8F97A8]">Archival Acid-Free</span>
                </div>
              </div>
            </div>

            {/* Right Editorial Showcase (Layered Composition with Bookmark & Seal) */}
            <div className="lg:col-span-5 relative">
              {leadBook && (
                <div className="relative mx-auto max-w-sm">
                  {/* Background architectural box accent with deep ink wash */}
                  <div className="absolute inset-0 translate-x-4 translate-y-4 border border-[#16284F]/40 bg-[#EFEAE0] dark:bg-[#181D26] -z-1" />

                  {/* Bookmark Ribbon Hanging Out of Spine Top */}
                  <div className="absolute -top-6 left-12 z-20 animate-bookmark-sway pointer-events-none">
                    <div className="w-4 h-10 bg-[#8E1F1F] shadow-md relative">
                      <div className="absolute bottom-0 left-0 right-0 border-x-[8px] border-x-transparent border-b-[6px] border-b-[#FFFFFF] dark:border-b-[#131720]" />
                    </div>
                  </div>

                  {/* Red Ink Seal Stamp in Top Right */}
                  <div className="absolute -top-3 -right-3 z-20 animate-seal-pulse pointer-events-none">
                    <div className="w-14 h-14 rounded-full bg-[#8E1F1F] text-[#F7F4EB] border-2 border-[#FFFFFF] dark:border-[#131720] shadow-md flex flex-col items-center justify-center p-1 font-editorial text-[8px] tracking-wider uppercase text-center leading-tight">
                      <span className="font-bold">INKORA</span>
                      <span className="text-[6px] font-mono">SEAL 2026</span>
                    </div>
                  </div>

                  <div className="book-lift relative border border-[#DFD7C7] dark:border-[#242A38] bg-[#FFFFFF] dark:bg-[#131720] p-4 shadow-xl">
                    <div className="book-cover-sheen relative aspect-3/4 overflow-hidden shadow-inner">
                      <img
                        src={leadBook.coverImage}
                        alt={leadBook.bookTitle}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-y-0 left-0 w-3 bg-gradient-to-r from-black/35 via-black/15 to-transparent pointer-events-none" />
                    </div>

                    <div className="mt-4 pt-3 border-t border-[#DFD7C7] dark:border-[#242A38] flex items-end justify-between">
                      <div>
                        <span className="text-[10px] uppercase font-mono tracking-wider text-[#16284F] dark:text-[#5A85C4] font-semibold">
                          First Press Edition
                        </span>
                        <h3 className="font-editorial text-lg text-[#0D1017] dark:text-[#EFECE6]">
                          {leadBook.bookTitle}
                        </h3>
                        <p className="text-xs text-[#5A6273] dark:text-[#8F97A8]">
                          by {leadBook.authorName}
                        </p>
                      </div>
                      <button
                        onClick={() => onQuickView(leadBook)}
                        className="text-xs font-semibold text-[#16284F] dark:text-[#5A85C4] hover:underline flex items-center gap-1 font-mono btn-press"
                      >
                        Inspect Edition →
                      </button>
                    </div>

                    {/* Handwritten Marginalia Note */}
                    <div className="mt-2 text-right">
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
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#DFD7C7] dark:border-[#242A38] pb-4 mb-8">
          <div>
            <span className="text-[10px] tracking-[0.25em] uppercase text-[#16284F] dark:text-[#5A85C4] font-semibold font-mono">
              The Ink Collection
            </span>
            <h2 className="font-editorial text-3xl sm:text-4xl text-[#0D1017] dark:text-[#EFECE6] mt-1">
              Curated Works for the Discriminating Reader
            </h2>
          </div>

          {/* Editorial Tabs */}
          <div className="flex items-center gap-6 text-xs uppercase tracking-wider font-semibold font-mono">
            <button
              onClick={() => setActiveTab('featured')}
              className={`pb-2 border-b-2 transition-colors ${
                activeTab === 'featured'
                  ? 'border-[#16284F] dark:border-[#5A85C4] text-[#16284F] dark:text-[#5A85C4]'
                  : 'border-transparent text-[#5A6273] hover:text-[#0D1017] dark:text-[#8F97A8] dark:hover:text-[#EFECE6]'
              }`}
            >
              Curator’s Choice
            </button>
            <button
              onClick={() => setActiveTab('bestsellers')}
              className={`pb-2 border-b-2 transition-colors ${
                activeTab === 'bestsellers'
                  ? 'border-[#16284F] dark:border-[#5A85C4] text-[#16284F] dark:text-[#5A85C4]'
                  : 'border-transparent text-[#5A6273] hover:text-[#0D1017] dark:text-[#8F97A8] dark:hover:text-[#EFECE6]'
              }`}
            >
              Acclaimed Bestsellers
            </button>
            <button
              onClick={() => setActiveTab('newArrivals')}
              className={`pb-2 border-b-2 transition-colors ${
                activeTab === 'newArrivals'
                  ? 'border-[#16284F] dark:border-[#5A85C4] text-[#16284F] dark:text-[#5A85C4]'
                  : 'border-transparent text-[#5A6273] hover:text-[#0D1017] dark:text-[#8F97A8] dark:hover:text-[#EFECE6]'
              }`}
            >
              New Dispatches
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
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#0D1017] dark:text-[#EFECE6] hover:text-[#16284F] dark:hover:text-[#5A85C4] border-b border-[#0D1017] dark:border-[#EFECE6] pb-1 hover:border-[#16284F] dark:hover:border-[#5A85C4] transition-colors font-mono"
          >
            <span>Browse Full Catalog of {books.length} Editions</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────
          3. Editorial Banner / The Chemistry of Dark Ink
         ───────────────────────────────────────────────────────────────── */}
      <section className="bg-[#EFEAE0] dark:bg-[#141923] py-16 border-y border-[#DFD7C7] dark:border-[#242A38]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5 space-y-4">
              <span className="text-[10px] tracking-[0.25em] uppercase text-[#16284F] dark:text-[#5A85C4] font-semibold font-mono">
                Publisher’s Reflection
              </span>
              <h2 className="font-editorial text-3xl sm:text-4xl text-[#0D1017] dark:text-[#EFECE6] leading-tight">
                The Chemistry of Dark Ink & Slow Reading
              </h2>
              <p className="text-xs sm:text-sm text-[#5A6273] dark:text-[#8F97A8] font-body-literary leading-relaxed">
                In an era of fleeting pixel flickers, deep pigment ink on cotton paper represents an indelible pledge. Carbon black does not fade under sunlight; iron gall ink binds into the very cellulose fibers of the page. It is a commitment that a sentence was worth printing permanently.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => onNavigate('editorial')}
                  className="text-xs font-semibold tracking-wider uppercase text-[#16284F] dark:text-[#5A85C4] hover:underline flex items-center gap-1.5 font-mono"
                >
                  <span>Read our journal on ink chemistry</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-6 bg-[#FFFFFF] dark:bg-[#11141C] border border-[#DFD7C7] dark:border-[#242A38] shadow-xs">
                <Quote className="w-6 h-6 text-[#16284F]/40 dark:text-[#5A85C4]/40 mb-3" />
                <p className="font-editorial text-lg italic text-[#0D1017] dark:text-[#EFECE6] leading-relaxed mb-4">
                  “Inkora’s letterpress pages carry the crisp, uncompromised blackness that made the early printing workshops of Mainz and Venice legendary.”
                </p>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#5A6273] dark:text-[#8F97A8]">
                  — Typographica & Bibliophile Gazette
                </span>
              </div>

              <div className="p-6 bg-[#FFFFFF] dark:bg-[#11141C] border border-[#DFD7C7] dark:border-[#242A38] shadow-xs">
                <Quote className="w-6 h-6 text-[#16284F]/40 dark:text-[#5A85C4]/40 mb-3" />
                <p className="font-editorial text-lg italic text-[#0D1017] dark:text-[#EFECE6] leading-relaxed mb-4">
                  “Holding an Inkora volume feels like handling an original archival folio. The typography has weight, breath, and stillness.”
                </p>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#5A6273] dark:text-[#8F97A8]">
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
        <div className="flex items-end justify-between border-b border-[#DFD7C7] dark:border-[#242A38] pb-4 mb-8">
          <div>
            <span className="text-[10px] tracking-[0.25em] uppercase text-[#16284F] dark:text-[#5A85C4] font-semibold font-mono">
              The Taxonomy
            </span>
            <h2 className="font-editorial text-3xl sm:text-4xl text-[#0D1017] dark:text-[#EFECE6] mt-1">
              Disciplines & Categories
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => onNavigate(`catalog:category:${cat.id}`)}
              className="group border border-[#DFD7C7] dark:border-[#242A38] bg-[#FFFFFF] dark:bg-[#131720] p-6 hover:border-[#16284F] dark:hover:border-[#5A85C4] cursor-pointer transition-all flex flex-col justify-between shadow-xs"
            >
              <div>
                <div className="flex items-center justify-between text-[11px] text-[#5A6273] dark:text-[#8F97A8] mb-2 font-mono">
                  <span>DISCIPLINE {cat.id.toUpperCase()}</span>
                  <span>{cat.bookCount} VOLUMES</span>
                </div>
                <h3 className="font-editorial text-2xl text-[#0D1017] dark:text-[#EFECE6] group-hover:text-[#16284F] dark:group-hover:text-[#5A85C4] transition-colors mb-2">
                  {cat.name}
                </h3>
                <p className="text-xs text-[#5A6273] dark:text-[#8F97A8] leading-relaxed">
                  {cat.description}
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-[#DFD7C7]/60 dark:border-[#242A38]/60 flex items-center justify-between text-xs font-semibold text-[#16284F] dark:text-[#5A85C4] font-mono">
                <span>Inspect Discipline</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────
          5. Authors Spotlight
         ───────────────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-b border-[#DFD7C7] dark:border-[#242A38] pb-4 mb-8">
          <span className="text-[10px] tracking-[0.25em] uppercase text-[#16284F] dark:text-[#5A85C4] font-semibold font-mono">
            In Residence
          </span>
          <h2 className="font-editorial text-3xl sm:text-4xl text-[#0D1017] dark:text-[#EFECE6] mt-1">
            Authors & Translators in Conversation
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {authors.slice(0, 3).map((author) => (
            <div
              key={author.id}
              className="border border-[#DFD7C7] dark:border-[#242A38] bg-[#FFFFFF] dark:bg-[#131720] p-6 flex flex-col justify-between shadow-xs"
            >
              <div>
                <div className="w-16 h-16 overflow-hidden mb-4 border border-[#DFD7C7] dark:border-[#242A38]">
                  <img
                    src={author.photo}
                    alt={author.name}
                    className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
                  />
                </div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#16284F] dark:text-[#5A85C4] font-semibold">
                  {author.nationality} · {author.booksCount} Works
                </span>
                <h3 className="font-editorial text-2xl text-[#0D1017] dark:text-[#EFECE6] mt-1 mb-2">
                  {author.name}
                </h3>
                <p className="text-xs text-[#5A6273] dark:text-[#8F97A8] leading-relaxed line-clamp-3 mb-4">
                  {author.bio}
                </p>
              </div>

              <div className="pt-4 border-t border-[#DFD7C7]/60 dark:border-[#242A38]/60">
                <span className="text-[10px] uppercase font-mono text-[#5A6273] dark:text-[#8F97A8] block">
                  Seminal Work:
                </span>
                <span className="font-editorial text-sm italic text-[#0D1017] dark:text-[#EFECE6]">
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
