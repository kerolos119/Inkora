import { t } from '../../i18n';
import React, { useState } from 'react';
import { X, Star, ShoppingBag, Heart, ArrowUpRight, Plus, Minus } from 'lucide-react';
import { Book } from '../../types/index.js';
import { useCart } from '../../context/CartContext.js';
import { useWishlist } from '../../context/WishlistContext.js';

interface QuickViewModalProps {
  book: Book | null;
  onClose: () => void;
  onNavigate: (page: string) => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({
  book,
  onClose,
  onNavigate,
}) => {
  const { addToCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const [quantity, setQuantity] = useState(1);

  if (!book) return null;

  const isFavorited = isWishlisted(book.id);
  const discountedPrice = book.discount
    ? book.price * (1 - book.discount / 100)
    : book.price;

  const handleAdd = () => {
    addToCart(book, quantity);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="relative w-full max-w-3xl bg-[#FAF6EC] dark:bg-[#2A231B] border border-[#E3D6BC] dark:border-[#4A3E2E] shadow-2xl p-6 sm:p-8 z-10 animate-in fade-in zoom-in-95">
        <button
          onClick={onClose}
          className="absolute top-4 end-4 p-2 text-[#7A6652] hover:text-[#3B2B1E] dark:text-[#A99A82] dark:hover:text-[#F3ECDD] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 items-start">
          {/* Cover */}
          <div className="relative aspect-3/4 overflow-hidden bg-[#F1E9D6] dark:bg-[#2E251A] border border-[#E3D6BC] dark:border-[#4A3E2E] shadow-lg">
            <img
              src={book.coverImage}
              alt={book.bookTitle}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-y-0 start-0 w-3 bg-gradient-to-r from-black/35 via-black/15 to-transparent pointer-events-none" />
          </div>

          {/* Details */}
          <div className="flex flex-col">
            <div className="flex items-center justify-between text-xs text-[#7A6652] dark:text-[#A99A82] mb-1 font-mono">
              <span className="uppercase text-xs tracking-wider text-[#8A6238] dark:text-[#D9AE6B] font-semibold">{book.coverType}</span>
              <div className="flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-[#C27835] text-[#C27835]" />
                <span className="font-semibold text-xs text-[#3B2B1E] dark:text-[#F3ECDD]">{book.rating.toFixed(1)}</span>
                <span className="text-[11px]">({book.reviewCount} reviews)</span>
              </div>
            </div>

            <h2 className="font-editorial text-3xl font-medium text-[#3B2B1E] dark:text-[#F3ECDD] leading-tight">
              {book.bookTitle}
            </h2>

            <p className="text-xs font-medium text-[#7A6652] dark:text-[#A99A82] mt-1">
              by <span className="text-[#3B2B1E] dark:text-[#F3ECDD]">{book.authorName}</span>
            </p>

            <div className="flex items-baseline gap-2.5 my-3 pb-3 border-b border-[#E3D6BC] dark:border-[#4A3E2E] font-mono">
              <span className="text-2xl font-semibold text-[#3B2B1E] dark:text-[#F3ECDD]">
                ${discountedPrice.toFixed(2)}
              </span>
              {book.discount && (
                <span className="text-sm text-[#7A6652] line-through">
                  ${book.price.toFixed(2)}
                </span>
              )}
              <span className="ms-auto text-xs text-[#2A674A]">
                {book.stock > 0 ? `In Stock (${book.stock} copies)` : 'Out of stock'}
              </span>
            </div>

            <p className="text-xs text-[#7A6652] dark:text-[#A99A82] leading-relaxed line-clamp-4 mb-4 font-body-literary">
              {book.bookDescription}
            </p>

            {/* Quick Specs */}
            <div className="grid grid-cols-2 gap-2 text-[11px] text-[#7A6652] dark:text-[#A99A82] mb-6 p-3 bg-[#F1E9D6]/60 dark:bg-[#2E251A]/60 border border-[#E3D6BC]/60 dark:border-[#4A3E2E]/60 font-mono">
              <div>
                <span className="text-[#3B2B1E] dark:text-[#F3ECDD] font-medium">{t('x.912765')}</span> {book.numberOfPages}
              </div>
              <div>
                <span className="text-[#3B2B1E] dark:text-[#F3ECDD] font-medium">{t('x.79bb6b')}</span> {book.paperType}
              </div>
              <div>
                <span className="text-[#3B2B1E] dark:text-[#F3ECDD] font-medium">ISBN:</span> {book.isbn}
              </div>
              <div>
                <span className="text-[#3B2B1E] dark:text-[#F3ECDD] font-medium">{t('x.8c8a51')}</span> {book.publicationYear}
              </div>
            </div>

            {/* Action Row */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                {/* Stepper */}
                <div className="flex items-center border border-[#3B2B1E] dark:border-[#F3ECDD]">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 hover:bg-[#F1E9D6] dark:hover:bg-[#362C1F] text-[#7A6652]"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="px-3 text-xs font-semibold text-[#3B2B1E] dark:text-[#F3ECDD] font-mono">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(book.stock, quantity + 1))}
                    className="p-2 hover:bg-[#F1E9D6] dark:hover:bg-[#362C1F] text-[#7A6652]"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>

                {/* Add to bag button */}
                <button
                  onClick={handleAdd}
                  disabled={book.stock <= 0}
                  className="flex-1 py-2.5 bg-[#3B2B1E] dark:bg-[#8A6238] text-[#FAF6EC] text-xs font-semibold tracking-wider uppercase hover:bg-[#8A6238] dark:hover:bg-[#604626] transition-colors flex items-center justify-center gap-2 font-mono"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>{t('cart.add')}</span>
                </button>

                {/* Wishlist toggle */}
                <button
                  onClick={() => toggleWishlist(book)}
                  className={`p-2.5 border border-[#E3D6BC] dark:border-[#4A3E2E] transition-colors ${
                    isFavorited
                      ? 'text-[#8E1F1F] border-[#8E1F1F]'
                      : 'text-[#7A6652] hover:text-[#3B2B1E] dark:hover:text-[#F3ECDD]'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isFavorited ? 'fill-[#8E1F1F]' : ''}`} />
                </button>
              </div>

              <button
                onClick={() => {
                  onClose();
                  onNavigate(`book:${book.id}`);
                }}
                className="w-full text-center text-xs text-[#8A6238] dark:text-[#D9AE6B] hover:underline flex items-center justify-center gap-1 font-semibold pt-1 font-mono"
              >
                <span>{t('x.a3160c')}</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
