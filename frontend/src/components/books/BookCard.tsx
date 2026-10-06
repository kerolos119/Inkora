import { t } from '../../i18n';
import React, { useState } from 'react';
import { Heart, Eye, ShoppingBag, Star, Check } from 'lucide-react';
import { Book } from '../../types/index.js';
import { useCart } from '../../context/CartContext.js';
import { useWishlist } from '../../context/WishlistContext.js';

interface BookCardProps {
  book: Book;
  onNavigate: (page: string) => void;
  onQuickView: (book: Book) => void;
  layout?: 'grid' | 'list';
}

export const BookCard: React.FC<BookCardProps> = ({
  book,
  onNavigate,
  onQuickView,
  layout = 'grid',
}) => {
  const { addToCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();

  const [isPopping, setIsPopping] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const isFavorited = isWishlisted(book.id);
  const discountedPrice = book.discount
    ? book.price * (1 - book.discount / 100)
    : book.price;

  const handleHeartClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsPopping(true);
    toggleWishlist(book);
    setTimeout(() => setIsPopping(false), 380);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(book);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1400);
  };

  if (layout === 'list') {
    return (
      <div className="book-lift group flex flex-col sm:flex-row gap-5 p-4 border border-[#E3D6BC] dark:border-[#4A3E2E] bg-[#FFFFFF] dark:bg-[#2A231B] hover:border-[#8A6238] dark:hover:border-[#D9AE6B] transition-all shadow-xs">
        {/* Cover */}
        <div
          onClick={() => onNavigate(`book:${book.id}`)}
          className="relative w-full sm:w-32 h-44 shrink-0 overflow-hidden cursor-pointer bg-[#F1E9D6] dark:bg-[#2E251A]"
        >
          <img
            src={book.coverImage}
            alt={book.bookTitle}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
          {book.discount && (
            <span className="absolute top-2 start-2 bg-[#8E1F1F] text-[#F3ECDD] text-xs font-semibold px-1.5 py-0.5 tracking-wider uppercase font-mono">
              -{book.discount}%
            </span>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-[#7A6652] dark:text-[#A99A82] mb-1 font-mono">
              <span>{book.coverType} · {book.publisher}</span>
              <div className="flex items-center gap-1 text-[#3B2B1E] dark:text-[#F3ECDD]">
                <Star className="w-3 h-3 fill-[#C27835] text-[#C27835]" />
                <span className="font-semibold text-xs">{book.rating.toFixed(1)}</span>
                <span className="text-[11px] text-[#7A6652]">({book.reviewCount})</span>
              </div>
            </div>

            <h3
              onClick={() => onNavigate(`book:${book.id}`)}
              className="font-editorial text-2xl text-[#3B2B1E] dark:text-[#F3ECDD] group-hover:text-[#8A6238] dark:group-hover:text-[#D9AE6B] transition-colors cursor-pointer"
            >
              {book.bookTitle}
            </h3>

            <p className="text-xs font-medium text-[#7A6652] dark:text-[#A99A82] mt-0.5">
              by <span className="text-[#3B2B1E] dark:text-[#F3ECDD]">{book.authorName}</span>
            </p>

            <p className="text-xs text-[#7A6652] dark:text-[#A99A82] line-clamp-2 mt-2 leading-relaxed font-body-literary">
              {book.bookDescription}
            </p>
          </div>

          <div className="flex items-center justify-between pt-4 mt-4 border-t border-[#E3D6BC] dark:border-[#4A3E2E]">
            <div className="flex items-baseline gap-2 font-mono">
              <span className="text-base font-semibold text-[#3B2B1E] dark:text-[#F3ECDD]">
                ${discountedPrice.toFixed(2)}
              </span>
              {book.discount && (
                <span className="text-xs text-[#7A6652] line-through">
                  ${book.price.toFixed(2)}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleHeartClick}
                className={`p-2 border border-[#E3D6BC] dark:border-[#4A3E2E] btn-press transition-colors ${
                  isFavorited
                    ? 'text-[#8E1F1F] border-[#8E1F1F]'
                    : 'text-[#7A6652] hover:text-[#3B2B1E] dark:hover:text-[#F3ECDD]'
                } ${isPopping ? 'animate-heart-pop' : ''}`}
                title={t('x.44a330')}
              >
                <Heart className={`w-4 h-4 ${isFavorited ? 'fill-[#8E1F1F]' : ''}`} />
              </button>
              <button
                onClick={() => onQuickView(book)}
                className="p-2 border border-[#E3D6BC] dark:border-[#4A3E2E] text-[#7A6652] hover:text-[#3B2B1E] dark:hover:text-[#F3ECDD] btn-press transition-colors"
                title={t('x.26aced')}
              >
                <Eye className="w-4 h-4" />
              </button>
              <button
                onClick={handleAddToCart}
                disabled={book.stock <= 0}
                className={`px-4 py-2 text-[#FAF6EC] text-xs font-semibold uppercase tracking-wider disabled:opacity-50 flex items-center gap-1.5 font-mono btn-press transition-all ${
                  justAdded
                    ? 'bg-[#2A674A] text-white scale-102'
                    : 'bg-[#3B2B1E] dark:bg-[#8A6238] hover:bg-[#8A6238] dark:hover:bg-[#604626]'
                }`}
              >
                {justAdded ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>{t('x.8ea75a')}</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>{book.stock > 0 ? 'Collect' : 'Out of Stock'}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Grid Layout
  return (
    <div className="book-lift group relative flex flex-col justify-between transition-all duration-300 p-2 border border-transparent hover:border-[#E3D6BC]/60 dark:hover:border-[#4A3E2E]/60 bg-transparent hover:bg-[#FFFFFF]/70 dark:hover:bg-[#2A231B]/70">
      {/* Book Cover Container with Authentic Spine Shadow */}
      <div className="book-cover-sheen relative aspect-3/4 w-full overflow-hidden bg-[#F1E9D6] dark:bg-[#2E251A] mb-3 shadow-xs rounded-[1px]">
        <img
          src={book.coverImage}
          alt={book.bookTitle}
          onClick={() => onNavigate(`book:${book.id}`)}
          className="w-full h-full object-cover cursor-pointer transition-transform duration-700 ease-out group-hover:scale-104"
          loading="lazy"
        />

        {/* Subtle Spine fold shadow */}
        <div className="absolute inset-y-0 start-0 w-3 bg-gradient-to-r from-black/35 via-black/15 to-transparent pointer-events-none" />

        {/* Badges */}
        <div className="absolute top-2.5 start-2.5 flex flex-col gap-1 items-start font-mono">
          {book.bestseller && (
            <span className="bg-[#3B2B1E] dark:bg-[#8A6238] text-[#F3ECDD] text-xs font-bold tracking-widest uppercase px-2 py-0.5 border border-white/10">
              {t('x.a4ca10')}
            </span>
          )}
          {book.discount && (
            <span className="bg-[#8E1F1F] text-[#F3ECDD] text-xs font-bold tracking-widest uppercase px-2 py-0.5 shadow-xs">
              -{book.discount}%
            </span>
          )}
          {book.stock <= 5 && book.stock > 0 && (
            <span className="bg-[#3A2920] dark:bg-[#2A231C] text-[#F3ECDD] text-xs font-bold tracking-widest uppercase px-2 py-0.5 animate-pulse">
              {book.stock} Left
            </span>
          )}
        </div>

        {/* Floating Quick Action Buttons on Hover */}
        <div className="absolute top-2.5 end-2.5 flex flex-col gap-1.5 opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-200">
          <button
            onClick={handleHeartClick}
            className={`p-2 backdrop-blur-md bg-[#FFFFFF]/95 dark:bg-[#2A231B]/95 border border-[#E3D6BC] dark:border-[#4A3E2E] btn-press transition-colors ${
              isFavorited ? 'text-[#8E1F1F]' : 'text-[#3B2B1E] dark:text-[#F3ECDD] hover:text-[#8E1F1F]'
            } ${isPopping ? 'animate-heart-pop' : ''}`}
            title={t('x.6ff331')}
          >
            <Heart className={`w-3.5 h-3.5 ${isFavorited ? 'fill-[#8E1F1F]' : ''}`} />
          </button>
          <button
            onClick={() => onQuickView(book)}
            className="p-2 backdrop-blur-md bg-[#FFFFFF]/95 dark:bg-[#2A231B]/95 border border-[#E3D6BC] dark:border-[#4A3E2E] text-[#3B2B1E] dark:text-[#F3ECDD] hover:text-[#8A6238] dark:hover:text-[#D9AE6B] btn-press transition-colors"
            title={t('x.26aced')}
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Hover Add to Bag Bar */}
        <div className="absolute inset-x-0 bottom-0 p-2.5 bg-gradient-to-t from-black/85 via-black/45 to-transparent sm:translate-y-full sm:group-hover:translate-y-0 transition-transform duration-250 flex items-center justify-center">
          <button
            onClick={handleAddToCart}
            disabled={book.stock <= 0}
            className={`w-full py-2 text-xs font-semibold uppercase tracking-wider text-center flex items-center justify-center gap-1.5 shadow-md font-mono btn-press transition-all ${
              justAdded
                ? 'bg-[#2A674A] text-white'
                : 'bg-[#FAF6EC] text-[#3B2B1E] hover:bg-[#8A6238] hover:text-[#FAF6EC]'
            }`}
          >
            {justAdded ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>{t('x.d271e6')}</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>{book.stock > 0 ? t('cart.add') : t('cart.soldOut')}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Book Metadata & Ink Typography */}
      <div className="flex flex-col flex-1 px-1">
        <div className="flex items-center justify-between text-[11px] text-[#7A6652] dark:text-[#A99A82] mb-1">
          <span className="uppercase tracking-wider font-mono text-xs">{book.coverType}</span>
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3 fill-[#C27835] text-[#C27835]" />
            <span className="font-semibold text-xs text-[#3B2B1E] dark:text-[#F3ECDD]">{book.rating.toFixed(1)}</span>
          </div>
        </div>

        <h3
          onClick={() => onNavigate(`book:${book.id}`)}
          className="font-editorial text-xl leading-snug font-medium text-[#3B2B1E] dark:text-[#F3ECDD] group-hover:text-[#8A6238] dark:group-hover:text-[#D9AE6B] transition-colors cursor-pointer line-clamp-2"
        >
          {book.bookTitle}
        </h3>

        <p className="text-xs text-[#7A6652] dark:text-[#A99A82] mt-0.5 truncate">
          {book.authorName}
        </p>

        <div className="flex items-baseline gap-2 mt-2 pt-2 border-t border-[#E3D6BC]/60 dark:border-[#4A3E2E]/60 font-mono">
          <span className="text-sm font-semibold text-[#3B2B1E] dark:text-[#F3ECDD]">
            ${discountedPrice.toFixed(2)}
          </span>
          {book.discount && (
            <span className="text-[11px] text-[#7A6652] dark:text-[#A99A82] line-through">
              ${book.price.toFixed(2)}
            </span>
          )}
          <span className="ms-auto text-xs text-[#7A6652] dark:text-[#A99A82]">
            {book.stock > 0 ? `${book.stock} in stock` : 'Awaiting press'}
          </span>
        </div>
      </div>
    </div>
  );
};
