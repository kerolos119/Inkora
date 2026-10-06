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
        <div className="h-8 w-64 bg-[#E2DAC9] dark:bg-[#262C3A] mx-auto mb-4 rounded-xs" />
        <div className="h-4 w-40 bg-[#E2DAC9] dark:bg-[#262C3A] mx-auto rounded-xs" />
      </div>
    );
  }

  if (!book) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center animate-ink-fade">
        <h2 className="font-editorial text-3xl mb-4 text-[#0D1017] dark:text-[#EBE8E1]">
          Edition Not Found
        </h2>
        <button
          onClick={() => onNavigate('catalog')}
          className="text-xs uppercase tracking-wider font-semibold text-[#16284F] dark:text-[#4A72B0] underline font-mono btn-press"
        >
          Return to Registry
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
      showToast('Review submitted and recorded in the library annals');
    } catch (err: any) {
      showToast(err.message || 'Could not post review', 'error');
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    showToast('Edition reference link copied');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16 animate-ink-fade">
      {/* Back button */}
      <button
        onClick={() => onNavigate('catalog')}
        className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#5A6273] hover:text-[#0D1017] dark:text-[#8E95A5] dark:hover:text-[#EBE8E1] transition-colors font-mono btn-press"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Registry</span>
      </button>

      {/* ─────────────────────────────────────────────────────────────────
          1. Editorial Book Presentation (Split Masterwork Composition)
         ───────────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Book Cover Column */}
        <div className="lg:col-span-5 space-y-6">
          <div className="relative max-w-md mx-auto">
            {/* Bookmark Ribbon Hanging from Top */}
            <div className="absolute -top-6 left-10 z-20 animate-bookmark-sway pointer-events-none">
              <div className="w-5 h-12 bg-[#8E1F1F] shadow-md relative">
                <div className="absolute bottom-0 left-0 right-0 border-x-[10px] border-x-transparent border-b-[8px] border-b-[#FFFFFF] dark:border-b-[#151821]" />
              </div>
            </div>

            <div className="book-cover-sheen book-lift relative aspect-3/4 w-full overflow-hidden bg-[#EFEAE0] dark:bg-[#1B212D] border border-[#DFD7C7] dark:border-[#262C3A] shadow-2xl rounded-[2px]">
              <img
                src={book.coverImage}
                alt={book.bookTitle}
                className="w-full h-full object-cover"
              />
              {/* Authentic Spine fold shadow */}
              <div className="absolute inset-y-0 left-0 w-4 bg-gradient-to-r from-black/35 via-black/15 to-transparent pointer-events-none" />

              {book.discount && (
                <span className="absolute top-4 left-4 bg-[#8E1F1F] text-[#EFECE6] text-xs font-semibold uppercase tracking-widest px-2.5 py-1 font-mono rounded-[2px] shadow-sm">
                  -{book.discount}% Off
                </span>
              )}
            </div>

            {/* Handwritten Note underneath cover */}
            <div className="mt-2 text-center">
              <span className="font-quill text-base text-[#8E1F1F] dark:text-[#E25858]">
                Hand-inspected letterpress imprint · Munken Pure paper
              </span>
            </div>
          </div>

          {/* Quick Security & Craft Badges */}
          <div className="max-w-md mx-auto p-4 bg-[#FFFFFF] dark:bg-[#151821] border border-[#DFD7C7] dark:border-[#262C3A] grid grid-cols-3 gap-2 text-center text-[10px] text-[#5A6273] dark:text-[#8E95A5] rounded-[2px] shadow-2xs font-mono">
            <div>
              <Package className="w-4 h-4 mx-auto mb-1 text-[#16284F] dark:text-[#4A72B0]" />
              <span className="font-semibold block text-[#0D1017] dark:text-[#EBE8E1]">Archival Wrap</span>
              <span>Protective box</span>
            </div>
            <div>
              <ShieldCheck className="w-4 h-4 mx-auto mb-1 text-[#16284F] dark:text-[#4A72B0]" />
              <span className="font-semibold block text-[#0D1017] dark:text-[#EBE8E1]">Guaranteed Bind</span>
              <span>Smyth-sewn</span>
            </div>
            <div>
              <BookOpen className="w-4 h-4 mx-auto mb-1 text-[#16284F] dark:text-[#4A72B0]" />
              <span className="font-semibold block text-[#0D1017] dark:text-[#EBE8E1]">Acid Free</span>
              <span>Munken 115gsm</span>
            </div>
          </div>
        </div>

        {/* Right Literary Monograph Details */}
        <div className="lg:col-span-7 space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-[#5A6273] dark:text-[#8E95A5] font-mono">
              <span className="text-[11px] tracking-wider uppercase text-[#16284F] dark:text-[#4A72B0] font-semibold">
                {book.categoryNames?.join(' · ') || 'Literary Monograph'}
              </span>
              <div className="flex items-center gap-1.5">
                <Star className="w-3.5 h-3.5 fill-[#C27835] text-[#C27835]" />
                <span className="font-semibold text-xs text-[#0D1017] dark:text-[#EBE8E1]">
                  {book.rating.toFixed(1)}
                </span>
                <span className="text-[11px]">({book.reviewCount} patron reviews)</span>
              </div>
            </div>

            <h1 className="font-editorial text-4xl sm:text-5xl font-medium text-[#0D1017] dark:text-[#EBE8E1] leading-tight">
              {book.bookTitle}
            </h1>

            <p className="text-sm font-medium text-[#5A6273] dark:text-[#8E95A5]">
              Authored by <span className="text-[#0D1017] dark:text-[#EBE8E1] underline underline-offset-4">{book.authorName}</span>
            </p>
          </div>

          {/* Pricing & Stock Status */}
          <div className="flex items-baseline gap-3 py-3 border-y border-[#DFD7C7] dark:border-[#262C3A] font-mono">
            <span className="text-3xl font-semibold text-[#0D1017] dark:text-[#EBE8E1]">
              ${discountedPrice.toFixed(2)}
            </span>
            {book.discount && (
              <span className="text-base text-[#5A6273] dark:text-[#8E95A5] line-through">
                ${book.price.toFixed(2)}
              </span>
            )}
            <div className="ml-auto flex items-center gap-1.5 text-xs">
              <span className={`w-2 h-2 rounded-full ${book.stock > 0 ? 'bg-[#2A674A]' : 'bg-[#8E1F1F]'}`} />
              <span className={book.stock > 0 ? 'text-[#2A674A]' : 'text-[#8E1F1F]'}>
                {book.stock > 0 ? `In Stock (${book.stock} copies remaining)` : 'Out of Print / Reprinting'}
              </span>
            </div>
          </div>

          {/* Editorial Description */}
          <div className="prose prose-stone dark:prose-invert max-w-none text-sm text-[#0D1017] dark:text-[#EBE8E1] leading-relaxed font-body-literary">
            <p className="first-letter:text-5xl first-letter:font-editorial first-letter:font-bold first-letter:float-left first-letter:mr-2.5 first-letter:text-[#16284F] dark:first-letter:text-[#4A72B0]">
              {book.bookDescription}
            </p>
          </div>

          {/* Physical Specifications Table */}
          <div className="border border-[#DFD7C7] dark:border-[#262C3A] bg-[#FFFFFF] dark:bg-[#151821] p-4 rounded-[2px] shadow-2xs font-mono">
            <h3 className="font-editorial text-lg font-semibold text-[#0D1017] dark:text-[#EBE8E1] mb-3">
              Colophon & Material Specifications
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-[11px]">
              <div>
                <span className="text-[#5A6273] dark:text-[#8E95A5] block">Binding</span>
                <span className="font-medium text-[#0D1017] dark:text-[#EBE8E1]">{book.coverType}</span>
              </div>
              <div>
                <span className="text-[#5A6273] dark:text-[#8E95A5] block">Paper Stock</span>
                <span className="font-medium text-[#0D1017] dark:text-[#EBE8E1]">{book.paperType}</span>
              </div>
              <div>
                <span className="text-[#5A6273] dark:text-[#8E95A5] block">Dimensions</span>
                <span className="font-medium text-[#0D1017] dark:text-[#EBE8E1]">{book.bookSize}</span>
              </div>
              <div>
                <span className="text-[#5A6273] dark:text-[#8E95A5] block">Pages</span>
                <span className="font-medium text-[#0D1017] dark:text-[#EBE8E1]">{book.numberOfPages} pp</span>
              </div>
              <div>
                <span className="text-[#5A6273] dark:text-[#8E95A5] block">ISBN</span>
                <span className="font-medium text-[#0D1017] dark:text-[#EBE8E1]">{book.isbn}</span>
              </div>
              <div>
                <span className="text-[#5A6273] dark:text-[#8E95A5] block">Language</span>
                <span className="font-medium text-[#0D1017] dark:text-[#EBE8E1]">{book.language}</span>
              </div>
              <div>
                <span className="text-[#5A6273] dark:text-[#8E95A5] block">Publisher</span>
                <span className="font-medium text-[#0D1017] dark:text-[#EBE8E1]">{book.publisher}</span>
              </div>
              <div>
                <span className="text-[#5A6273] dark:text-[#8E95A5] block">Published</span>
                <span className="font-medium text-[#0D1017] dark:text-[#EBE8E1]">{book.publicationYear}</span>
              </div>
            </div>
          </div>

          {/* Purchase Actions */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-3">
              {/* Stepper */}
              <div className="flex items-center border border-[#0B0E14] dark:border-[#EBE8E1] h-12 rounded-[2px] overflow-hidden">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 h-full hover:bg-[#EFEAE0] dark:hover:bg-[#1C202B] text-[#5A6273] btn-press"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="px-4 text-xs font-semibold font-mono text-[#0D1017] dark:text-[#EBE8E1]">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(book.stock, quantity + 1))}
                  className="px-3 h-full hover:bg-[#EFEAE0] dark:hover:bg-[#1C202B] text-[#5A6273] btn-press"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Add to Bag CTA */}
              <button
                onClick={() => addToCart(book, quantity)}
                disabled={book.stock <= 0}
                className="flex-1 h-12 bg-[#0B0E14] dark:bg-[#16284F] text-[#F7F4EB] hover:bg-[#16284F] dark:hover:bg-[#203666] transition-colors text-xs font-semibold uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 font-mono btn-press rounded-[2px] shadow-xs"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>{book.stock > 0 ? 'Add to Reading Bag' : 'Out of Stock'}</span>
              </button>

              {/* Wishlist Button */}
              <button
                onClick={() => toggleWishlist(book)}
                className={`h-12 w-12 flex items-center justify-center border border-[#DFD7C7] dark:border-[#262C3A] transition-colors rounded-[2px] btn-press ${
                  isFavorited
                    ? 'text-[#8E1F1F] border-[#8E1F1F]'
                    : 'text-[#5A6273] hover:text-[#0D1017] dark:hover:text-[#EBE8E1]'
                }`}
                title="Wishlist"
              >
                <Heart className={`w-4 h-4 ${isFavorited ? 'fill-[#8E1F1F]' : ''}`} />
              </button>

              {/* Share */}
              <button
                onClick={handleCopyLink}
                className="h-12 w-12 flex items-center justify-center border border-[#DFD7C7] dark:border-[#262C3A] text-[#5A6273] hover:text-[#0D1017] dark:hover:text-[#EBE8E1] transition-colors rounded-[2px] btn-press"
                title="Share link"
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
      <section className="pt-10 border-t border-[#DFD7C7] dark:border-[#262C3A] space-y-8">
        <div className="flex items-end justify-between">
          <div>
            <span className="text-[10px] tracking-[0.25em] uppercase text-[#16284F] dark:text-[#4A72B0] font-semibold font-mono">
              Critical Reception
            </span>
            <h2 className="font-editorial text-3xl text-[#0D1017] dark:text-[#EBE8E1] mt-1">
              Patron Reviews & Marginalia
            </h2>
          </div>
          <span className="text-xs font-mono text-[#5A6273] dark:text-[#8E95A5]">
            {reviews.length} Verified Entries
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Reviews List */}
          <div className="lg:col-span-7 space-y-4">
            {reviews.length === 0 ? (
              <div className="p-8 border border-[#DFD7C7] dark:border-[#262C3A] text-center bg-[#FFFFFF] dark:bg-[#151821] rounded-[2px]">
                <MessageSquare className="w-8 h-8 text-[#5A6273]/40 mx-auto mb-2" />
                <p className="font-editorial text-xl text-[#0D1017] dark:text-[#EBE8E1]">
                  Be the first reader to record your impressions.
                </p>
              </div>
            ) : (
              reviews.map((rev) => (
                <div
                  key={rev.id}
                  className="p-5 border border-[#DFD7C7] dark:border-[#262C3A] bg-[#FFFFFF] dark:bg-[#151821] space-y-2 rounded-[2px] shadow-2xs"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-[#0D1017] dark:text-[#EBE8E1]">
                      {rev.userName}
                    </span>
                    <span className="text-[11px] text-[#5A6273] dark:text-[#8E95A5] font-mono">
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
                            : 'text-[#DFD7C7] dark:text-[#262C3A]'
                        }`}
                      />
                    ))}
                  </div>

                  <p className="text-xs text-[#5A6273] dark:text-[#8E95A5] leading-relaxed pt-1 font-body-literary">
                    {rev.comment}
                  </p>
                </div>
              ))
            )}
          </div>

          {/* Submit Review Form */}
          <div className="lg:col-span-5 p-6 border border-[#DFD7C7] dark:border-[#262C3A] bg-[#FFFFFF] dark:bg-[#151821] rounded-[2px] shadow-2xs">
            <h3 className="font-editorial text-2xl text-[#0D1017] dark:text-[#EBE8E1] mb-2">
              Write a Bibliographic Review
            </h3>
            <p className="text-xs text-[#5A6273] dark:text-[#8E95A5] mb-4">
              Share your thoughts on the prose, typography, or binding quality.
            </p>

            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <div>
                <label className="text-[11px] uppercase tracking-wider font-semibold font-mono text-[#0D1017] dark:text-[#EBE8E1] block mb-1">
                  Rating
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
                            : 'text-[#DFD7C7] dark:text-[#262C3A]'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-mono ml-2 text-[#5A6273] dark:text-[#8E95A5]">
                    {reviewRating} of 5 Stars
                  </span>
                </div>
              </div>

              <div>
                <label className="text-[11px] uppercase tracking-wider font-semibold font-mono text-[#0D1017] dark:text-[#EBE8E1] block mb-1">
                  Your Name / Signature
                </label>
                <input
                  type="text"
                  value={reviewName}
                  onChange={(e) => setReviewName(e.target.value)}
                  placeholder="e.g. Margaret Hawthorne"
                  className="w-full px-3 py-2 border border-[#DFD7C7] dark:border-[#262C3A] bg-transparent text-xs text-[#0D1017] dark:text-[#EBE8E1] focus:outline-hidden rounded-[2px]"
                />
              </div>

              <div>
                <label className="text-[11px] uppercase tracking-wider font-semibold font-mono text-[#0D1017] dark:text-[#EBE8E1] block mb-1">
                  Your Critical Impressions
                </label>
                <textarea
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  rows={4}
                  required
                  placeholder="Comment on literary quality, binding, or reading experience..."
                  className="w-full px-3 py-2 border border-[#DFD7C7] dark:border-[#262C3A] bg-transparent text-xs text-[#0D1017] dark:text-[#EBE8E1] focus:outline-hidden rounded-[2px]"
                />
              </div>

              <button
                type="submit"
                disabled={submittingReview}
                className="w-full py-2.5 bg-[#0B0E14] dark:bg-[#16284F] text-[#F7F4EB] hover:bg-[#16284F] dark:hover:bg-[#203666] text-xs font-semibold uppercase tracking-widest transition-colors cursor-pointer font-mono btn-press rounded-[2px]"
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
        <section className="pt-10 border-t border-[#DFD7C7] dark:border-[#262C3A] space-y-6">
          <div className="flex items-end justify-between">
            <div>
              <span className="text-[10px] tracking-[0.25em] uppercase text-[#16284F] dark:text-[#4A72B0] font-semibold font-mono">
                Companion Reading
              </span>
              <h2 className="font-editorial text-3xl text-[#0D1017] dark:text-[#EBE8E1] mt-1">
                Other Works From the Registry
              </h2>
            </div>
            <button
              onClick={() => onNavigate('catalog')}
              className="text-xs uppercase font-semibold font-mono text-[#16284F] dark:text-[#4A72B0] hover:underline"
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
