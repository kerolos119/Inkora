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

      <div className="relative w-full max-w-3xl bg-[#F7F4EB] dark:bg-[#131720] border border-[#DFD7C7] dark:border-[#242A38] shadow-2xl p-6 sm:p-8 z-10 animate-in fade-in zoom-in-95">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-[#5A6273] hover:text-[#0D1017] dark:text-[#8F97A8] dark:hover:text-[#EFECE6] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 items-start">
          {/* Cover */}
          <div className="relative aspect-3/4 overflow-hidden bg-[#EFEAE0] dark:bg-[#1B212D] border border-[#DFD7C7] dark:border-[#242A38] shadow-lg">
            <img
              src={book.coverImage}
              alt={book.bookTitle}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-y-0 left-0 w-3 bg-gradient-to-r from-black/35 via-black/15 to-transparent pointer-events-none" />
          </div>

          {/* Details */}
          <div className="flex flex-col">
            <div className="flex items-center justify-between text-xs text-[#5A6273] dark:text-[#8F97A8] mb-1 font-mono">
              <span className="uppercase text-[10px] tracking-wider text-[#16284F] dark:text-[#5A85C4] font-semibold">{book.coverType}</span>
              <div className="flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-[#C27835] text-[#C27835]" />
                <span className="font-semibold text-xs text-[#0D1017] dark:text-[#EFECE6]">{book.rating.toFixed(1)}</span>
                <span className="text-[11px]">({book.reviewCount} reviews)</span>
              </div>
            </div>

            <h2 className="font-editorial text-3xl font-medium text-[#0D1017] dark:text-[#EFECE6] leading-tight">
              {book.bookTitle}
            </h2>

            <p className="text-xs font-medium text-[#5A6273] dark:text-[#8F97A8] mt-1">
              by <span className="text-[#0D1017] dark:text-[#EFECE6]">{book.authorName}</span>
            </p>

            <div className="flex items-baseline gap-2.5 my-3 pb-3 border-b border-[#DFD7C7] dark:border-[#242A38] font-mono">
              <span className="text-2xl font-semibold text-[#0D1017] dark:text-[#EFECE6]">
                ${discountedPrice.toFixed(2)}
              </span>
              {book.discount && (
                <span className="text-sm text-[#5A6273] line-through">
                  ${book.price.toFixed(2)}
                </span>
              )}
              <span className="ml-auto text-xs text-[#2A674A]">
                {book.stock > 0 ? `In Stock (${book.stock} copies)` : 'Out of stock'}
              </span>
            </div>

            <p className="text-xs text-[#5A6273] dark:text-[#8F97A8] leading-relaxed line-clamp-4 mb-4 font-body-literary">
              {book.bookDescription}
            </p>

            {/* Quick Specs */}
            <div className="grid grid-cols-2 gap-2 text-[11px] text-[#5A6273] dark:text-[#8F97A8] mb-6 p-3 bg-[#EFEAE0]/60 dark:bg-[#1B212D]/60 border border-[#DFD7C7]/60 dark:border-[#242A38]/60 font-mono">
              <div>
                <span className="text-[#0D1017] dark:text-[#EFECE6] font-medium">Pages:</span> {book.numberOfPages}
              </div>
              <div>
                <span className="text-[#0D1017] dark:text-[#EFECE6] font-medium">Paper:</span> {book.paperType}
              </div>
              <div>
                <span className="text-[#0D1017] dark:text-[#EFECE6] font-medium">ISBN:</span> {book.isbn}
              </div>
              <div>
                <span className="text-[#0D1017] dark:text-[#EFECE6] font-medium">Press Year:</span> {book.publicationYear}
              </div>
            </div>

            {/* Action Row */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                {/* Stepper */}
                <div className="flex items-center border border-[#0B0E14] dark:border-[#EFECE6]">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 hover:bg-[#EFEAE0] dark:hover:bg-[#1F2636] text-[#5A6273]"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="px-3 text-xs font-semibold text-[#0D1017] dark:text-[#EFECE6] font-mono">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(book.stock, quantity + 1))}
                    className="p-2 hover:bg-[#EFEAE0] dark:hover:bg-[#1F2636] text-[#5A6273]"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>

                {/* Add to bag button */}
                <button
                  onClick={handleAdd}
                  disabled={book.stock <= 0}
                  className="flex-1 py-2.5 bg-[#0B0E14] dark:bg-[#16284F] text-[#F7F4EB] text-xs font-semibold tracking-wider uppercase hover:bg-[#16284F] dark:hover:bg-[#203666] transition-colors flex items-center justify-center gap-2 font-mono"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Reading Bag</span>
                </button>

                {/* Wishlist toggle */}
                <button
                  onClick={() => toggleWishlist(book)}
                  className={`p-2.5 border border-[#DFD7C7] dark:border-[#242A38] transition-colors ${
                    isFavorited
                      ? 'text-[#8E1F1F] border-[#8E1F1F]'
                      : 'text-[#5A6273] hover:text-[#0D1017] dark:hover:text-[#EFECE6]'
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
                className="w-full text-center text-xs text-[#16284F] dark:text-[#5A85C4] hover:underline flex items-center justify-center gap-1 font-semibold pt-1 font-mono"
              >
                <span>View Full Literary Monograph & Reader Reviews</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
