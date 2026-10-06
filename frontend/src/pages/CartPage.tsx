import { t } from '../i18n';
import React, { useState, useEffect } from 'react';
import {
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShoppingBag,
  ShieldCheck,
} from 'lucide-react';
import { useCart } from '../context/CartContext.js';
import { useToast } from '../context/ToastContext.js';
import { Book } from '../types/index.js';
import { api } from '../services/api.js';
import { BookCard } from '../components/books/BookCard.js';

interface CartPageProps {
  onNavigate: (page: string) => void;
  onQuickView: (book: Book) => void;
}

export const CartPage: React.FC<CartPageProps> = ({ onNavigate, onQuickView }) => {
  const { cart, updateQuantity, removeFromCart, clearCart } = useCart();
  const { showToast } = useToast();

  const [couponCode, setCouponCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState<number>(0);
  const [couponApplied, setCouponApplied] = useState(false);
  const [recommended, setRecommended] = useState<Book[]>([]);

  useEffect(() => {
    api.getBooks().then((books) => {
      setRecommended(books.slice(0, 3));
    });
  }, []);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponCode.trim().toUpperCase() === 'INKORA10') {
      const discount = cart.subtotal * 0.1;
      setAppliedDiscount(discount);
      setCouponApplied(true);
      showToast(t('cart.couponOk', { code: 'INKORA10' }));
    } else {
      showToast(t('cart.couponBad'), 'error');
    }
  };

  const finalShipping = cart.subtotal > 50 || cart.subtotal === 0 ? 0 : 5.00;
  const finalTotal = Math.max(0, cart.subtotal - appliedDiscount + finalShipping);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12 animate-ink-fade">
      {/* Editorial Header */}
      <div className="border-b border-[#E3D6BC] dark:border-[#4A3E2E] pb-4 flex items-end justify-between">
        <div>
          <span className="text-xs tracking-[0.25em] uppercase text-[#8A6238] dark:text-[#D2A560] font-semibold font-mono">
            {t('x.a1eb21')}
          </span>
          <h1 className="font-editorial text-4xl sm:text-5xl text-[#3B2B1E] dark:text-[#F3ECDD] mt-1">
            {t('x.4bfca0')}
          </h1>
        </div>
        {cart.items.length > 0 && (
          <button
            onClick={clearCart}
            className="text-xs text-[#7A6652] hover:text-[#8E1F1F] dark:text-[#A99A82] underline font-mono btn-press"
          >
            {t('x.3a88a6')}
          </button>
        )}
      </div>

      {cart.items.length === 0 ? (
        <div className="border border-[#E3D6BC] dark:border-[#4A3E2E] bg-[#FFFFFF] dark:bg-[#2A231B] p-16 text-center space-y-4 rounded-[2px] shadow-2xs">
          <ShoppingBag className="w-12 h-12 text-[#7A6652]/40 stroke-1 mx-auto" />
          <h2 className="font-editorial text-3xl text-[#3B2B1E] dark:text-[#F3ECDD]">
            {t('cart.empty')}
          </h2>
          <p className="text-xs text-[#7A6652] dark:text-[#A99A82] max-w-md mx-auto font-body-literary">
            {t('x.ae5ebe')}
          </p>
          <button
            onClick={() => onNavigate('catalog')}
            className="px-8 py-3 bg-[#3B2B1E] dark:bg-[#8A6238] text-[#FAF6EC] text-xs font-semibold uppercase tracking-widest hover:bg-[#8A6238] dark:hover:bg-[#604626] transition-colors cursor-pointer font-mono btn-press rounded-[2px]"
          >
            {t('x.6a6807')}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Items Table / List */}
          <div className="lg:col-span-8 space-y-4">
            <div className="border border-[#E3D6BC] dark:border-[#4A3E2E] bg-[#FFFFFF] dark:bg-[#2A231B] divide-y divide-[#E3D6BC] dark:divide-[#4A3E2E] rounded-[2px] shadow-2xs">
              {cart.items.map(({ book, quantity }) => {
                const itemPrice = book.discount
                  ? book.price * (1 - book.discount / 100)
                  : book.price;

                return (
                  <div key={book.id} className="p-6 flex flex-col sm:flex-row gap-5 items-start sm:items-center">
                    <img
                      src={book.coverImage}
                      alt={book.bookTitle}
                      className="w-20 h-28 object-cover border border-[#E3D6BC] dark:border-[#4A3E2E] shrink-0 rounded-[2px]"
                    />

                    <div className="flex-1 min-w-0">
                      <span className="text-xs font-mono uppercase text-[#8A6238] dark:text-[#D2A560] font-semibold block">
                        {book.coverType} · ISBN {book.isbn}
                      </span>
                      <h3
                        onClick={() => onNavigate(`book:${book.id}`)}
                        className="font-editorial text-2xl text-[#3B2B1E] dark:text-[#F3ECDD] hover:text-[#8A6238] dark:hover:text-[#D2A560] cursor-pointer"
                      >
                        {book.bookTitle}
                      </h3>
                      <p className="text-xs text-[#7A6652] dark:text-[#A99A82]">
                        by {book.authorName}
                      </p>
                      <p className="text-xs font-semibold text-[#3B2B1E] dark:text-[#F3ECDD] mt-2 font-mono">
                        ${itemPrice.toFixed(2)} each
                      </p>
                    </div>

                    {/* Stepper */}
                    <div className="flex items-center border border-[#3B2B1E] dark:border-[#F3ECDD] rounded-[2px] overflow-hidden">
                      <button
                        onClick={() => updateQuantity(book.id, quantity - 1)}
                        className="p-1.5 hover:bg-[#F1E9D6] dark:hover:bg-[#342B21] text-[#7A6652] btn-press"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-3 text-xs font-mono font-medium text-[#3B2B1E] dark:text-[#F3ECDD]">
                        {quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(book.id, quantity + 1)}
                        className="p-1.5 hover:bg-[#F1E9D6] dark:hover:bg-[#342B21] text-[#7A6652] btn-press"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Subtotal & Delete */}
                    <div className="text-end flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-2 font-mono">
                      <span className="text-sm font-semibold text-[#3B2B1E] dark:text-[#F3ECDD]">
                        ${(itemPrice * quantity).toFixed(2)}
                      </span>
                      <button
                        onClick={() => removeFromCart(book.id)}
                        className="text-[#7A6652] hover:text-[#8E1F1F] p-1 transition-colors btn-press"
                        title={t('x.0cde9d')}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Back link */}
            <div className="pt-2">
              <button
                onClick={() => onNavigate('catalog')}
                className="text-xs font-semibold text-[#8A6238] dark:text-[#D2A560] hover:underline uppercase tracking-wider font-mono btn-press"
              >
                ← Continue Browsing Editions
              </button>
            </div>
          </div>

          {/* Order Summary Card */}
          <div className="lg:col-span-4 border border-[#E3D6BC] dark:border-[#4A3E2E] bg-[#FFFFFF] dark:bg-[#2A231B] p-6 space-y-6 rounded-[2px] shadow-2xs">
            <h2 className="font-editorial text-2xl text-[#3B2B1E] dark:text-[#F3ECDD] border-b border-[#E3D6BC] dark:border-[#4A3E2E] pb-3">
              {t('x.84c715')}
            </h2>

            {/* Coupon Code Input */}
            <form onSubmit={handleApplyCoupon} className="space-y-2">
              <label className="text-[11px] uppercase tracking-wider font-semibold font-mono text-[#3B2B1E] dark:text-[#F3ECDD] block">
                {t('x.6f87ed')}
              </label>
              <div className="flex border border-[#E3D6BC] dark:border-[#4A3E2E] rounded-[2px] overflow-hidden">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder={t('x.eb2904')}
                  className="px-3 py-2 text-xs bg-transparent text-[#3B2B1E] dark:text-[#F3ECDD] flex-1 focus:outline-hidden font-mono"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#3B2B1E] dark:bg-[#8A6238] text-[#FAF6EC] hover:bg-[#8A6238] text-xs font-semibold uppercase tracking-wider transition-colors font-mono btn-press"
                >
                  {t('x.cfea41')}
                </button>
              </div>
              <p className="text-xs text-[#7A6652] dark:text-[#A99A82] font-mono">
                Use code <span className="text-[#8A6238] dark:text-[#D2A560] font-semibold">INKORA10</span> for 10% patron discount.
              </p>
            </form>

            {/* Price Calculations */}
            <div className="space-y-2.5 text-xs text-[#7A6652] dark:text-[#A99A82] pt-3 border-t border-[#E3D6BC] dark:border-[#4A3E2E] font-mono">
              <div className="flex justify-between">
                <span>{t('x.30d246')}</span>
                <span className="font-semibold text-[#3B2B1E] dark:text-[#F3ECDD]">
                  ${cart.subtotal.toFixed(2)}
                </span>
              </div>

              {couponApplied && (
                <div className="flex justify-between text-[#2A674A]">
                  <span>{t('x.606ff6')}</span>
                  <span>-${appliedDiscount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>{t('x.bd7cc6')}</span>
                <span className="font-semibold text-[#3B2B1E] dark:text-[#F3ECDD]">
                  {finalShipping === 0 ? 'Complimentary' : `$${finalShipping.toFixed(2)}`}
                </span>
              </div>

              <div className="flex justify-between text-base font-semibold text-[#3B2B1E] dark:text-[#F3ECDD] pt-3 border-t border-[#E3D6BC] dark:border-[#4A3E2E]">
                <span>{t('x.92f3f7')}</span>
                <span>${finalTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Checkout CTA */}
            <button
              onClick={() => onNavigate('checkout')}
              className="w-full py-3.5 bg-[#3B2B1E] dark:bg-[#8A6238] hover:bg-[#8A6238] dark:hover:bg-[#604626] text-[#FAF6EC] text-xs font-semibold tracking-widest uppercase transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs font-mono btn-press rounded-[2px]"
            >
              <span>{t('cart.checkout')}</span>
              <ArrowRight className="rtl:-scale-x-100 w-4 h-4" />
            </button>

            <div className="p-3 bg-[#F1E9D6]/50 dark:bg-[#342B21]/60 text-[11px] text-[#7A6652] dark:text-[#A99A82] space-y-1 rounded-[2px]">
              <div className="flex items-center gap-1.5 text-[#3B2B1E] dark:text-[#F3ECDD] font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-[#2A674A]" />
                <span>{t('x.d87dbd')}</span>
              </div>
              <p>{t('x.172e17')}</p>
            </div>
          </div>
        </div>
      )}

      {/* Recommended Additions */}
      {recommended.length > 0 && (
        <section className="pt-12 border-t border-[#E3D6BC] dark:border-[#4A3E2E] space-y-6">
          <h2 className="font-editorial text-3xl text-[#3B2B1E] dark:text-[#F3ECDD]">
            {t('x.f28bee')}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {recommended.map((b) => (
              <BookCard
                key={b.id}
                book={b}
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
