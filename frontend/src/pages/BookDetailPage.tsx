import { t } from '../i18n';
import React, { useState, useEffect } from 'react';
import {
  Star,
  ShoppingBag,
  Heart,
  Share2,
  ArrowLeft,
  Plus,
  Minus,
  MessageSquare,
  ShieldCheck,
  Package,
  BookOpen,
} from 'lucide-react';
import { Book, Review } from '../types/index.js';
import { api } from '../services/api.js';
import { useCart } from '../context/CartContext.js';
import { useWishlist } from '../context/WishlistContext.js';
import { useToast } from '../context/ToastContext.js';
import { BookCard } from '../components/books/BookCard.js';

interface BookDetailPageProps {
  bookId: string;
  onNavigate: (page: string) => void;
  onQuickView: (book: Book) => void;
}

export const BookDetailPage: React.FC<BookDetailPageProps> = ({
  bookId,
  onNavigate,
  onQuickView,
}) => {
  const [book, setBook] = useState<Book | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [relatedBooks, setRelatedBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  // Review Form state
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewName, setReviewName] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  const { addToCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const { showToast } = useToast();

  useEffect(() => {
    setLoading(true);
    api
      .getBookById(bookId)
      .then((data) => {
        setBook(data);
        return Promise.all([
          api.getBookReviews(bookId),
          api.getBooks(),
        ]);
      })
      .then(([revs, allBooks]) => {
        setReviews(revs);
        const related = allBooks.filter((b) => b.id !== bookId).slice(0, 4);
        setRelatedBooks(related);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [bookId]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center animate-pulse">
        <div className="h-8 w-64 bg-[#E2DAC9] dark:bg-[#4A3E2E] mx-auto mb-4 rounded-xs" />
        <div className="h-4 w-40 bg-[#E2DAC9] dark:bg-[#4A3E2E] mx-auto rounded-xs" />
      </div>
    );
  }

  if (!book) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center animate-ink-fade">
        <h2 className="font-editorial text-3xl mb-4 text-[#3B2B1E] dark:text-[#F3ECDD]">
          {t('book.notFound')}
        </h2>
        <button
          onClick={() => onNavigate('catalog')}
          className="text-xs uppercase tracking-wider font-semibold text-[#8A6238] dark:text-[#D2A560] underline font-mono btn-press"
        >
          {t('cart.explore')}
        </button>
      </div>
    );
  }

  const isFavorited = isWishlisted(book.id);
  const discountedPrice = book.discount
    ? book.price * (1 - book.discount / 100)
    : book.price;

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewComment.trim()) return;
    setSubmittingReview(true);
    try {
      const created = await api.submitReview(book.id, {
        rating: reviewRating,
        comment: reviewComment,
        userName: reviewName || 'Patron Reader',
      });
      setReviews([created, ...reviews]);
      setReviewComment('');
      setReviewName('');
      showToast(t('book.reviewOk'));
    } catch (err: any) {
      showToast(err.message || 'Could not post review', 'error');
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    showToast(t('book.linkCopied'));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16 animate-ink-fade">
      {/* Back button */}
      <button
        onClick={() => onNavigate('catalog')}
        className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#7A6652] hover:text-[#3B2B1E] dark:text-[#A99A82] dark:hover:text-[#F3ECDD] transition-colors font-mono btn-press"
      >
        <ArrowLeft className="rtl:-scale-x-100 w-3.5 h-3.5" />
        <span>{t('x.d599e2')}</span>
      </button>

      {/* ─────────────────────────────────────────────────────────────────
          1. Editorial Book Presentation (Split Masterwork Composition)
         ───────────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Book Cover Column */}
        <div className="lg:col-span-5 space-y-6">
          <div className="relative max-w-md mx-auto">
            {/* Bookmark Ribbon Hanging from Top */}
            <div className="absolute -top-6 start-10 z-20 animate-bookmark-sway pointer-events-none">
              <div className="w-5 h-12 bg-[#8E1F1F] shadow-md relative">
                <div className="absolute bottom-0 start-0 end-0 border-x-[10px] border-x-transparent border-b-[8px] border-b-[#FFFFFF] dark:border-b-[#2A231B]" />
              </div>
            </div>

            <div className="book-cover-sheen book-lift relative aspect-3/4 w-full overflow-hidden bg-[#F1E9D6] dark:bg-[#2E251A] border border-[#E3D6BC] dark:border-[#4A3E2E] shadow-2xl rounded-[2px]">
              <img
                src={book.coverImage}
                alt={book.bookTitle}
                className="w-full h-full object-cover"
              />
              {/* Authentic Spine fold shadow */}
              <div className="absolute inset-y-0 start-0 w-4 bg-gradient-to-r from-black/35 via-black/15 to-transparent pointer-events-none" />

              {book.discount && (
                <span className="absolute top-4 start-4 bg-[#8E1F1F] text-[#F3ECDD] text-xs font-semibold uppercase tracking-widest px-2.5 py-1 font-mono rounded-[2px] shadow-sm">
                  -{book.discount}% Off
                </span>
              )}
            </div>

            {/* Handwritten Note underneath cover */}
            <div className="mt-2 text-center">
              <span className="font-quill text-base text-[#8E1F1F] dark:text-[#E25858]">
                {t('x.8dd953')}
              </span>
            </div>
          </div>

          {/* Quick Security & Craft Badges */}
          <div className="max-w-md mx-auto p-4 bg-[#FFFFFF] dark:bg-[#2A231B] border border-[#E3D6BC] dark:border-[#4A3E2E] grid grid-cols-3 gap-2 text-center text-xs text-[#7A6652] dark:text-[#A99A82] rounded-[2px] shadow-2xs font-mono">
            <div>
              <Package className="w-4 h-4 mx-auto mb-1 text-[#8A6238] dark:text-[#D2A560]" />
              <span className="font-semibold block text-[#3B2B1E] dark:text-[#F3ECDD]">{t('x.231dab')}</span>
              <span>{t('x.60c4de')}</span>
            </div>
            <div>
              <ShieldCheck className="w-4 h-4 mx-auto mb-1 text-[#8A6238] dark:text-[#D2A560]" />
              <span className="font-semibold block text-[#3B2B1E] dark:text-[#F3ECDD]">{t('x.7794ac')}</span>
              <span>{t('x.4281c7')}</span>
            </div>
            <div>
              <BookOpen className="w-4 h-4 mx-auto mb-1 text-[#8A6238] dark:text-[#D2A560]" />
              <span className="font-semibold block text-[#3B2B1E] dark:text-[#F3ECDD]">{t('x.77371c')}</span>
              <span>Munken 115gsm</span>
            </div>
          </div>
        </div>

        {/* Right Literary Monograph Details */}
        <div className="lg:col-span-7 space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-[#7A6652] dark:text-[#A99A82] font-mono">
              <span className="text-[11px] tracking-wider uppercase text-[#8A6238] dark:text-[#D2A560] font-semibold">
                {book.categoryNames?.join(' · ') || 'Literary Monograph'}
              </span>
              <div className="flex items-center gap-1.5">
                <Star className="w-3.5 h-3.5 fill-[#C27835] text-[#C27835]" />
                <span className="font-semibold text-xs text-[#3B2B1E] dark:text-[#F3ECDD]">
                  {book.rating.toFixed(1)}
                </span>
                <span className="text-[11px]">({book.reviewCount} patron reviews)</span>
              </div>
            </div>

            <h1 className="font-editorial text-4xl sm:text-5xl font-medium text-[#3B2B1E] dark:text-[#F3ECDD] leading-tight">
              {book.bookTitle}
            </h1>

            <p className="text-sm font-medium text-[#7A6652] dark:text-[#A99A82]">
              Authored by <span className="text-[#3B2B1E] dark:text-[#F3ECDD] underline underline-offset-4">{book.authorName}</span>
            </p>
          </div>

          {/* Pricing & Stock Status */}
          <div className="flex items-baseline gap-3 py-3 border-y border-[#E3D6BC] dark:border-[#4A3E2E] font-mono">
            <span className="text-3xl font-semibold text-[#3B2B1E] dark:text-[#F3ECDD]">
              ${discountedPrice.toFixed(2)}
            </span>
            {book.discount && (
              <span className="text-base text-[#7A6652] dark:text-[#A99A82] line-through">
                ${book.price.toFixed(2)}
              </span>
            )}
            <div className="ms-auto flex items-center gap-1.5 text-xs">
              <span className={`w-2 h-2 rounded-full ${book.stock > 0 ? 'bg-[#2A674A]' : 'bg-[#8E1F1F]'}`} />
              <span className={book.stock > 0 ? 'text-[#2A674A]' : 'text-[#8E1F1F]'}>
                {book.stock > 0 ? `In Stock (${book.stock} copies remaining)` : 'Out of Print / Reprinting'}
              </span>
            </div>
          </div>

          {/* Editorial Description */}
          <div className="prose prose-stone dark:prose-invert max-w-none text-sm text-[#3B2B1E] dark:text-[#F3ECDD] leading-relaxed font-body-literary">
            <p className="first-letter:text-5xl first-letter:font-editorial first-letter:font-bold first-letter:float-left first-letter:me-2.5 first-letter:text-[#8A6238] dark:first-letter:text-[#D2A560]">
              {book.bookDescription}
            </p>
          </div>

          {/* Physical Specifications Table */}
          <div className="border border-[#E3D6BC] dark:border-[#4A3E2E] bg-[#FFFFFF] dark:bg-[#2A231B] p-4 rounded-[2px] shadow-2xs font-mono">
            <h3 className="font-editorial text-lg font-semibold text-[#3B2B1E] dark:text-[#F3ECDD] mb-3">
              {t('x.102c3e')}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-[11px]">
              <div>
                <span className="text-[#7A6652] dark:text-[#A99A82] block">{t('x.7f0043')}</span>
                <span className="font-medium text-[#3B2B1E] dark:text-[#F3ECDD]">{book.coverType}</span>
              </div>
              <div>
                <span className="text-[#7A6652] dark:text-[#A99A82] block">{t('x.053d3b')}</span>
                <span className="font-medium text-[#3B2B1E] dark:text-[#F3ECDD]">{book.paperType}</span>
              </div>
              <div>
                <span className="text-[#7A6652] dark:text-[#A99A82] block">{t('x.9f4ca9')}</span>
                <span className="font-medium text-[#3B2B1E] dark:text-[#F3ECDD]">{book.bookSize}</span>
              </div>
              <div>
                <span className="text-[#7A6652] dark:text-[#A99A82] block">{t('x.600584')}</span>
                <span className="font-medium text-[#3B2B1E] dark:text-[#F3ECDD]">{book.numberOfPages} pp</span>
              </div>
              <div>
                <span className="text-[#7A6652] dark:text-[#A99A82] block">ISBN</span>
                <span className="font-medium text-[#3B2B1E] dark:text-[#F3ECDD]">{book.isbn}</span>
              </div>
              <div>
                <span className="text-[#7A6652] dark:text-[#A99A82] block">{t('x.89b86a')}</span>
                <span className="font-medium text-[#3B2B1E] dark:text-[#F3ECDD]">{book.language}</span>
              </div>
              <div>
                <span className="text-[#7A6652] dark:text-[#A99A82] block">{t('x.61d70d')}</span>
                <span className="font-medium text-[#3B2B1E] dark:text-[#F3ECDD]">{book.publisher}</span>
              </div>
              <div>
                <span className="text-[#7A6652] dark:text-[#A99A82] block">{t('x.483bf2')}</span>
                <span className="font-medium text-[#3B2B1E] dark:text-[#F3ECDD]">{book.publicationYear}</span>
              </div>
            </div>
          </div>

          {/* Purchase Actions */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-3">
              {/* Stepper */}
              <div className="flex items-center border border-[#3B2B1E] dark:border-[#F3ECDD] h-12 rounded-[2px] overflow-hidden">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 h-full hover:bg-[#F1E9D6] dark:hover:bg-[#342B21] text-[#7A6652] btn-press"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="px-4 text-xs font-semibold font-mono text-[#3B2B1E] dark:text-[#F3ECDD]">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(book.stock, quantity + 1))}
                  className="px-3 h-full hover:bg-[#F1E9D6] dark:hover:bg-[#342B21] text-[#7A6652] btn-press"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Add to Bag CTA */}
              <button
                onClick={() => addToCart(book, quantity)}
                disabled={book.stock <= 0}
                className="flex-1 h-12 bg-[#3B2B1E] dark:bg-[#8A6238] text-[#FAF6EC] hover:bg-[#8A6238] dark:hover:bg-[#604626] transition-colors text-xs font-semibold uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 font-mono btn-press rounded-[2px] shadow-xs"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>{book.stock > 0 ? t('cart.add') : t('cart.soldOut')}</span>
              </button>

              {/* Wishlist Button */}
              <button
                onClick={() => toggleWishlist(book)}
                className={`h-12 w-12 flex items-center justify-center border border-[#E3D6BC] dark:border-[#4A3E2E] transition-colors rounded-[2px] btn-press ${
                  isFavorited
                    ? 'text-[#8E1F1F] border-[#8E1F1F]'
                    : 'text-[#7A6652] hover:text-[#3B2B1E] dark:hover:text-[#F3ECDD]'
                }`}
                title={t('x.6ff331')}
              >
                <Heart className={`w-4 h-4 ${isFavorited ? 'fill-[#8E1F1F]' : ''}`} />
              </button>

              {/* Share */}
              <button
                onClick={handleCopyLink}
                className="h-12 w-12 flex items-center justify-center border border-[#E3D6BC] dark:border-[#4A3E2E] text-[#7A6652] hover:text-[#3B2B1E] dark:hover:text-[#F3ECDD] transition-colors rounded-[2px] btn-press"
                title={t('x.3c1362')}
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────────
          2. Patron Reviews & Submission Form
         ───────────────────────────────────────────────────────────────── */}
      <section className="pt-10 border-t border-[#E3D6BC] dark:border-[#4A3E2E] space-y-8">
        <div className="flex items-end justify-between">
          <div>
            <span className="text-xs tracking-[0.25em] uppercase text-[#8A6238] dark:text-[#D2A560] font-semibold font-mono">
              {t('x.e9d21c')}
            </span>
            <h2 className="font-editorial text-3xl text-[#3B2B1E] dark:text-[#F3ECDD] mt-1">
              {t('x.bfb970')}
            </h2>
          </div>
          <span className="text-xs font-mono text-[#7A6652] dark:text-[#A99A82]">
            {reviews.length} Verified Entries
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Reviews List */}
          <div className="lg:col-span-7 space-y-4">
            {reviews.length === 0 ? (
              <div className="p-8 border border-[#E3D6BC] dark:border-[#4A3E2E] text-center bg-[#FFFFFF] dark:bg-[#2A231B] rounded-[2px]">
                <MessageSquare className="w-8 h-8 text-[#7A6652]/40 mx-auto mb-2" />
                <p className="font-editorial text-xl text-[#3B2B1E] dark:text-[#F3ECDD]">
                  {t('x.fe01c3')}
                </p>
              </div>
            ) : (
              reviews.map((rev) => (
                <div
                  key={rev.id}
                  className="p-5 border border-[#E3D6BC] dark:border-[#4A3E2E] bg-[#FFFFFF] dark:bg-[#2A231B] space-y-2 rounded-[2px] shadow-2xs"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-[#3B2B1E] dark:text-[#F3ECDD]">
                      {rev.userName}
                    </span>
                    <span className="text-[11px] text-[#7A6652] dark:text-[#A99A82] font-mono">
                      {rev.date}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 ${
                          i < rev.rating
                            ? 'fill-[#C27835] text-[#C27835]'
                            : 'text-[#E3D6BC] dark:text-[#4A3E2E]'
                        }`}
                      />
                    ))}
                  </div>

                  <p className="text-xs text-[#7A6652] dark:text-[#A99A82] leading-relaxed pt-1 font-body-literary">
                    {rev.comment}
                  </p>
                </div>
              ))
            )}
          </div>

          {/* Submit Review Form */}
          <div className="lg:col-span-5 p-6 border border-[#E3D6BC] dark:border-[#4A3E2E] bg-[#FFFFFF] dark:bg-[#2A231B] rounded-[2px] shadow-2xs">
            <h3 className="font-editorial text-2xl text-[#3B2B1E] dark:text-[#F3ECDD] mb-2">
              {t('x.504244')}
            </h3>
            <p className="text-xs text-[#7A6652] dark:text-[#A99A82] mb-4">
              {t('x.a301f9')}
            </p>

            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <div>
                <label className="text-[11px] uppercase tracking-wider font-semibold font-mono text-[#3B2B1E] dark:text-[#F3ECDD] block mb-1">
                  {t('x.6437b7')}
                </label>
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setReviewRating(star)}
                      className="p-1 hover:scale-110 transition-transform btn-press"
                    >
                      <Star
                        className={`w-5 h-5 ${
                          star <= reviewRating
                            ? 'fill-[#C27835] text-[#C27835]'
                            : 'text-[#E3D6BC] dark:text-[#4A3E2E]'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-mono ms-2 text-[#7A6652] dark:text-[#A99A82]">
                    {reviewRating} of 5 Stars
                  </span>
                </div>
              </div>

              <div>
                <label className="text-[11px] uppercase tracking-wider font-semibold font-mono text-[#3B2B1E] dark:text-[#F3ECDD] block mb-1">
                  {t('x.6cfd44')}
                </label>
                <input
                  type="text"
                  value={reviewName}
                  onChange={(e) => setReviewName(e.target.value)}
                  placeholder={t('x.c1316a')}
                  className="w-full px-3 py-2 border border-[#E3D6BC] dark:border-[#4A3E2E] bg-transparent text-xs text-[#3B2B1E] dark:text-[#F3ECDD] focus:outline-hidden rounded-[2px]"
                />
              </div>

              <div>
                <label className="text-[11px] uppercase tracking-wider font-semibold font-mono text-[#3B2B1E] dark:text-[#F3ECDD] block mb-1">
                  {t('x.fdce7b')}
                </label>
                <textarea
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  rows={4}
                  required
                  placeholder={t('x.b1eb6c')}
                  className="w-full px-3 py-2 border border-[#E3D6BC] dark:border-[#4A3E2E] bg-transparent text-xs text-[#3B2B1E] dark:text-[#F3ECDD] focus:outline-hidden rounded-[2px]"
                />
              </div>

              <button
                type="submit"
                disabled={submittingReview}
                className="w-full py-2.5 bg-[#3B2B1E] dark:bg-[#8A6238] text-[#FAF6EC] hover:bg-[#8A6238] dark:hover:bg-[#604626] text-xs font-semibold uppercase tracking-widest transition-colors cursor-pointer font-mono btn-press rounded-[2px]"
              >
                {submittingReview ? 'Recording...' : 'Submit Review'}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────
          3. Related Editions Recommendations
         ───────────────────────────────────────────────────────────────── */}
      {relatedBooks.length > 0 && (
        <section className="pt-10 border-t border-[#E3D6BC] dark:border-[#4A3E2E] space-y-6">
          <div className="flex items-end justify-between">
            <div>
              <span className="text-xs tracking-[0.25em] uppercase text-[#8A6238] dark:text-[#D2A560] font-semibold font-mono">
                {t('x.f77f83')}
              </span>
              <h2 className="font-editorial text-3xl text-[#3B2B1E] dark:text-[#F3ECDD] mt-1">
                {t('x.409fe9')}
              </h2>
            </div>
            <button
              onClick={() => onNavigate('catalog')}
              className="text-xs uppercase font-semibold font-mono text-[#8A6238] dark:text-[#D2A560] hover:underline"
            >
              View All Editions →
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            {relatedBooks.map((relBook) => (
              <BookCard
                key={relBook.id}
                book={relBook}
                onNavigate={onNavigate}
                onQuickView={onQuickView}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
