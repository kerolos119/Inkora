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
      showToast('Patron discount INKORA10 applied: 10% off');
    } else {
      showToast('Invalid coupon code. Try INKORA10', 'error');
    }
  };

  const finalShipping = cart.subtotal > 50 || cart.subtotal === 0 ? 0 : 5.00;
  const finalTotal = Math.max(0, cart.subtotal - appliedDiscount + finalShipping);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12 animate-ink-fade">
      {/* Editorial Header */}
      <div className="border-b border-[#DFD7C7] dark:border-[#262C3A] pb-4 flex items-end justify-between">
        <div>
          <span className="text-[10px] tracking-[0.25em] uppercase text-[#16284F] dark:text-[#4A72B0] font-semibold font-mono">
            Order Preparation
          </span>
          <h1 className="font-editorial text-4xl sm:text-5xl text-[#0D1017] dark:text-[#EBE8E1] mt-1">
            Your Reading Bag
          </h1>
        </div>
        {cart.items.length > 0 && (
          <button
            onClick={clearCart}
            className="text-xs text-[#5A6273] hover:text-[#8E1F1F] dark:text-[#8E95A5] underline font-mono btn-press"
          >
            Clear All
          </button>
        )}
      </div>

      {cart.items.length === 0 ? (
        <div className="border border-[#DFD7C7] dark:border-[#262C3A] bg-[#FFFFFF] dark:bg-[#151821] p-16 text-center space-y-4 rounded-[2px] shadow-2xs">
          <ShoppingBag className="w-12 h-12 text-[#5A6273]/40 stroke-1 mx-auto" />
          <h2 className="font-editorial text-3xl text-[#0D1017] dark:text-[#EBE8E1]">
            Your reading bag is empty
          </h2>
          <p className="text-xs text-[#5A6273] dark:text-[#8E95A5] max-w-md mx-auto font-body-literary">
            You haven't selected any volumes yet. Explore our curated registry to discover new editions.
          </p>
          <button
            onClick={() => onNavigate('catalog')}
            className="px-8 py-3 bg-[#0B0E14] dark:bg-[#16284F] text-[#F7F4EB] text-xs font-semibold uppercase tracking-widest hover:bg-[#16284F] dark:hover:bg-[#203666] transition-colors cursor-pointer font-mono btn-press rounded-[2px]"
          >
            Explore Catalog
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Items Table / List */}
          <div className="lg:col-span-8 space-y-4">
            <div className="border border-[#DFD7C7] dark:border-[#262C3A] bg-[#FFFFFF] dark:bg-[#151821] divide-y divide-[#DFD7C7] dark:divide-[#262C3A] rounded-[2px] shadow-2xs">
              {cart.items.map(({ book, quantity }) => {
                const itemPrice = book.discount
                  ? book.price * (1 - book.discount / 100)
                  : book.price;

                return (
                  <div key={book.id} className="p-6 flex flex-col sm:flex-row gap-5 items-start sm:items-center">
                    <img
                      src={book.coverImage}
                      alt={book.bookTitle}
                      className="w-20 h-28 object-cover border border-[#DFD7C7] dark:border-[#262C3A] shrink-0 rounded-[2px]"
                    />

                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] font-mono uppercase text-[#16284F] dark:text-[#4A72B0] font-semibold block">
                        {book.coverType} · ISBN {book.isbn}
                      </span>
                      <h3
                        onClick={() => onNavigate(`book:${book.id}`)}
                        className="font-editorial text-2xl text-[#0D1017] dark:text-[#EBE8E1] hover:text-[#16284F] dark:hover:text-[#4A72B0] cursor-pointer"
                      >
                        {book.bookTitle}
                      </h3>
                      <p className="text-xs text-[#5A6273] dark:text-[#8E95A5]">
                        by {book.authorName}
                      </p>
                      <p className="text-xs font-semibold text-[#0D1017] dark:text-[#EBE8E1] mt-2 font-mono">
                        ${itemPrice.toFixed(2)} each
                      </p>
                    </div>

                    {/* Stepper */}
                    <div className="flex items-center border border-[#0B0E14] dark:border-[#EBE8E1] rounded-[2px] overflow-hidden">
                      <button
                        onClick={() => updateQuantity(book.id, quantity - 1)}
                        className="p-1.5 hover:bg-[#EFEAE0] dark:hover:bg-[#1C202B] text-[#5A6273] btn-press"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-3 text-xs font-mono font-medium text-[#0D1017] dark:text-[#EBE8E1]">
                        {quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(book.id, quantity + 1)}
                        className="p-1.5 hover:bg-[#EFEAE0] dark:hover:bg-[#1C202B] text-[#5A6273] btn-press"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Subtotal & Delete */}
                    <div className="text-right flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-2 font-mono">
                      <span className="text-sm font-semibold text-[#0D1017] dark:text-[#EBE8E1]">
                        ${(itemPrice * quantity).toFixed(2)}
                      </span>
                      <button
                        onClick={() => removeFromCart(book.id)}
                        className="text-[#5A6273] hover:text-[#8E1F1F] p-1 transition-colors btn-press"
                        title="Remove from bag"
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
                className="text-xs font-semibold text-[#16284F] dark:text-[#4A72B0] hover:underline uppercase tracking-wider font-mono btn-press"
              >
                ← Continue Browsing Editions
              </button>
            </div>
          </div>

          {/* Order Summary Card */}
          <div className="lg:col-span-4 border border-[#DFD7C7] dark:border-[#262C3A] bg-[#FFFFFF] dark:bg-[#151821] p-6 space-y-6 rounded-[2px] shadow-2xs">
            <h2 className="font-editorial text-2xl text-[#0D1017] dark:text-[#EBE8E1] border-b border-[#DFD7C7] dark:border-[#262C3A] pb-3">
              Summary of Order
            </h2>

            {/* Coupon Code Input */}
            <form onSubmit={handleApplyCoupon} className="space-y-2">
              <label className="text-[11px] uppercase tracking-wider font-semibold font-mono text-[#0D1017] dark:text-[#EBE8E1] block">
                Patron Promo Code
              </label>
              <div className="flex border border-[#DFD7C7] dark:border-[#262C3A] rounded-[2px] overflow-hidden">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="e.g. INKORA10"
                  className="px-3 py-2 text-xs bg-transparent text-[#0D1017] dark:text-[#EBE8E1] flex-1 focus:outline-hidden font-mono"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#0B0E14] dark:bg-[#16284F] text-[#F7F4EB] hover:bg-[#16284F] text-xs font-semibold uppercase tracking-wider transition-colors font-mono btn-press"
                >
                  Apply
                </button>
              </div>
              <p className="text-[10px] text-[#5A6273] dark:text-[#8E95A5] font-mono">
                Use code <span className="text-[#16284F] dark:text-[#4A72B0] font-semibold">INKORA10</span> for 10% patron discount.
              </p>
            </form>

            {/* Price Calculations */}
            <div className="space-y-2.5 text-xs text-[#5A6273] dark:text-[#8E95A5] pt-3 border-t border-[#DFD7C7] dark:border-[#262C3A] font-mono">
              <div className="flex justify-between">
                <span>Editions Subtotal</span>
                <span className="font-semibold text-[#0D1017] dark:text-[#EBE8E1]">
                  ${cart.subtotal.toFixed(2)}
                </span>
              </div>

              {couponApplied && (
                <div className="flex justify-between text-[#2A674A]">
                  <span>Patron Discount (10%)</span>
                  <span>-${appliedDiscount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Archival Handling & Shipping</span>
                <span className="font-semibold text-[#0D1017] dark:text-[#EBE8E1]">
                  {finalShipping === 0 ? 'Complimentary' : `$${finalShipping.toFixed(2)}`}
                </span>
              </div>

              <div className="flex justify-between text-base font-semibold text-[#0D1017] dark:text-[#EBE8E1] pt-3 border-t border-[#DFD7C7] dark:border-[#262C3A]">
                <span>Total Due</span>
                <span>${finalTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Checkout CTA */}
            <button
              onClick={() => onNavigate('checkout')}
              className="w-full py-3.5 bg-[#0B0E14] dark:bg-[#16284F] hover:bg-[#16284F] dark:hover:bg-[#203666] text-[#F7F4EB] text-xs font-semibold tracking-widest uppercase transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs font-mono btn-press rounded-[2px]"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="p-3 bg-[#EFEAE0]/50 dark:bg-[#1C202B]/60 text-[11px] text-[#5A6273] dark:text-[#8E95A5] space-y-1 rounded-[2px]">
              <div className="flex items-center gap-1.5 text-[#0D1017] dark:text-[#EBE8E1] font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-[#2A674A]" />
                <span>Inkora Archival Guarantee</span>
              </div>
              <p>All items safely wrapped in archival tissue and dispatched with carbon-neutral transit.</p>
            </div>
          </div>
        </div>
      )}

      {/* Recommended Additions */}
      {recommended.length > 0 && (
        <section className="pt-12 border-t border-[#DFD7C7] dark:border-[#262C3A] space-y-6">
          <h2 className="font-editorial text-3xl text-[#0D1017] dark:text-[#EBE8E1]">
            Recommended Additions to Your Collection
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
