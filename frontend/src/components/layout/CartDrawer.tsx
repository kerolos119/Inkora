import { t } from '../../i18n';
import React from 'react';
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';
import { useCart } from '../../context/CartContext.js';

interface CartDrawerProps {
  onNavigate: (page: string) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ onNavigate }) => {
  const { cart, isCartDrawerOpen, setIsCartDrawerOpen, updateQuantity, removeFromCart } = useCart();

  if (!isCartDrawerOpen) return null;

  const freeShippingThreshold = 50;
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - cart.subtotal);
  const freeShippingPercent = Math.min(100, (cart.subtotal / freeShippingThreshold) * 100);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-300"
        onClick={() => setIsCartDrawerOpen(false)}
      />

      <div className="fixed inset-y-0 end-0 max-w-full flex ps-10">
        <div className="w-screen max-w-md bg-[#FAF6EC] dark:bg-[#2A231B] border-l border-[#E3D6BC] dark:border-[#4A3E2E] shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="p-6 border-b border-[#E3D6BC] dark:border-[#4A3E2E] flex items-center justify-between">
            <div>
              <h2 className="font-editorial text-3xl tracking-wide text-[#3B2B1E] dark:text-[#F3ECDD]">
                {t('x.47d20c')}
              </h2>
              <p className="text-xs text-[#7A6652] dark:text-[#A99A82] mt-0.5 font-mono">
                {cart.items.length} {cart.items.length === 1 ? 'selected volume' : 'selected volumes'}
              </p>
            </div>
            <button
              onClick={() => setIsCartDrawerOpen(false)}
              className="p-2 text-[#7A6652] hover:text-[#3B2B1E] dark:text-[#A99A82] dark:hover:text-[#F3ECDD] transition-colors btn-press"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Complimentary shipping bar */}
          <div className="px-6 py-3 bg-[#F1E9D6] dark:bg-[#2D2419] border-b border-[#E3D6BC] dark:border-[#4A3E2E]">
            <div className="flex justify-between text-xs font-semibold text-[#3B2B1E] dark:text-[#F3ECDD] mb-1.5 font-mono">
              <span>{t('x.378eb8')}</span>
              <span>
                {remainingForFreeShipping === 0
                  ? 'Complimentary'
                  : `$${remainingForFreeShipping.toFixed(2)} away`}
              </span>
            </div>
            <div className="h-1.5 w-full bg-[#E3D6BC] dark:bg-[#483A2A] overflow-hidden">
              <div
                className="h-full bg-[#8A6238] dark:bg-[#D9AE6B] transition-all duration-400 ease-out"
                style={{ width: `${freeShippingPercent}%` }}
              />
            </div>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-5 divide-y divide-[#E3D6BC]/60 dark:divide-[#4A3E2E]/60">
            {cart.items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-16 animate-ink-fade">
                <ShoppingBag className="w-10 h-10 text-[#7A6652]/40 stroke-1 mb-4" />
                <h3 className="font-editorial text-2xl text-[#3B2B1E] dark:text-[#F3ECDD] mb-1">
                  {t('cart.empty')}
                </h3>
                <p className="text-xs text-[#7A6652] dark:text-[#A99A82] max-w-xs mb-6 font-body-literary">
                  {t('cart.emptyHint')}
                </p>
                <button
                  onClick={() => {
                    setIsCartDrawerOpen(false);
                    onNavigate('catalog');
                  }}
                  className="px-6 py-2.5 bg-[#3B2B1E] dark:bg-[#8A6238] text-[#FAF6EC] text-xs font-semibold tracking-wider uppercase hover:bg-[#8A6238] dark:hover:bg-[#604626] transition-colors font-mono btn-press shadow-xs"
                >
                  {t('cart.explore')}
                </button>
              </div>
            ) : (
              cart.items.map(({ book, quantity }) => {
                const itemPrice = book.discount
                  ? book.price * (1 - book.discount / 100)
                  : book.price;

                return (
                  <div key={book.id} className="pt-5 first:pt-0 flex gap-4 animate-ink-fade">
                    <img
                      src={book.coverImage}
                      alt={book.bookTitle}
                      className="w-16 h-22 object-cover border border-[#E3D6BC] dark:border-[#4A3E2E] shadow-xs shrink-0"
                    />
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <h4
                          onClick={() => {
                            setIsCartDrawerOpen(false);
                            onNavigate(`book:${book.id}`);
                          }}
                          className="font-editorial text-xl text-[#3B2B1E] dark:text-[#F3ECDD] truncate hover:text-[#8A6238] dark:hover:text-[#D9AE6B] cursor-pointer"
                        >
                          {book.bookTitle}
                        </h4>
                        <p className="text-xs text-[#7A6652] dark:text-[#A99A82] truncate">
                          {book.authorName} · {book.coverType}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        {/* Stepper */}
                        <div className="flex items-center border border-[#E3D6BC] dark:border-[#4A3E2E] bg-[#FFFFFF] dark:bg-[#2A231B]">
                          <button
                            onClick={() => updateQuantity(book.id, quantity - 1)}
                            className="p-1 hover:bg-[#F1E9D6] dark:hover:bg-[#362C1F] text-[#7A6652] btn-press"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2 text-xs font-mono font-medium text-[#3B2B1E] dark:text-[#F3ECDD]">
                            {quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(book.id, quantity + 1)}
                            className="p-1 hover:bg-[#F1E9D6] dark:hover:bg-[#362C1F] text-[#7A6652] btn-press"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <div className="flex items-center gap-3 font-mono">
                          <span className="text-xs font-semibold text-[#3B2B1E] dark:text-[#F3ECDD]">
                            ${(itemPrice * quantity).toFixed(2)}
                          </span>
                          <button
                            onClick={() => removeFromCart(book.id)}
                            className="text-[#7A6652] hover:text-[#8E1F1F] transition-colors p-1 btn-press"
                            title={t('x.76ecba')}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer & Actions */}
          {cart.items.length > 0 && (
            <div className="p-6 border-t border-[#E3D6BC] dark:border-[#4A3E2E] bg-[#FAF6EC] dark:bg-[#2A231B] space-y-4">
              <div className="space-y-1.5 text-xs text-[#7A6652] dark:text-[#A99A82] font-mono">
                <div className="flex justify-between">
                  <span>{t('x.97f735')}</span>
                  <span className="font-semibold text-[#3B2B1E] dark:text-[#F3ECDD]">
                    ${cart.subtotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>{t('x.378eb8')}</span>
                  <span className="font-semibold text-[#3B2B1E] dark:text-[#F3ECDD]">
                    {cart.shipping === 0 ? 'Complimentary' : `$${cart.shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-semibold text-[#3B2B1E] dark:text-[#F3ECDD] pt-2 border-t border-[#E3D6BC] dark:border-[#4A3E2E]">
                  <span>{t('x.92f3f7')}</span>
                  <span>${cart.total.toFixed(2)}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5 pt-2 font-mono">
                <button
                  onClick={() => {
                    setIsCartDrawerOpen(false);
                    onNavigate('cart');
                  }}
                  className="w-full py-3 border border-[#3B2B1E] dark:border-[#F3ECDD] text-xs font-semibold tracking-wider uppercase text-[#3B2B1E] dark:text-[#F3ECDD] hover:bg-[#F1E9D6] dark:hover:bg-[#2D2419] transition-colors text-center btn-press"
                >
                  {t('x.986c24')}
                </button>
                <button
                  onClick={() => {
                    setIsCartDrawerOpen(false);
                    onNavigate('checkout');
                  }}
                  className="w-full py-3 bg-[#3B2B1E] dark:bg-[#8A6238] text-[#FAF6EC] text-xs font-semibold tracking-wider uppercase hover:bg-[#8A6238] dark:hover:bg-[#604626] transition-colors flex items-center justify-center gap-1.5 btn-press shadow-xs"
                >
                  {t('x.3ac8e9')}
                  <ArrowRight className="rtl:-scale-x-100 w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
