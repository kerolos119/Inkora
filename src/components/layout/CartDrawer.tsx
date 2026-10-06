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

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#F7F4EB] dark:bg-[#131720] border-l border-[#DFD7C7] dark:border-[#242A38] shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="p-6 border-b border-[#DFD7C7] dark:border-[#242A38] flex items-center justify-between">
            <div>
              <h2 className="font-editorial text-3xl tracking-wide text-[#0D1017] dark:text-[#EFECE6]">
                Reading Bag
              </h2>
              <p className="text-xs text-[#5A6273] dark:text-[#8F97A8] mt-0.5 font-mono">
                {cart.items.length} {cart.items.length === 1 ? 'selected volume' : 'selected volumes'}
              </p>
            </div>
            <button
              onClick={() => setIsCartDrawerOpen(false)}
              className="p-2 text-[#5A6273] hover:text-[#0D1017] dark:text-[#8F97A8] dark:hover:text-[#EFECE6] transition-colors btn-press"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Complimentary shipping bar */}
          <div className="px-6 py-3 bg-[#EFEAE0] dark:bg-[#1A202C] border-b border-[#DFD7C7] dark:border-[#242A38]">
            <div className="flex justify-between text-xs font-semibold text-[#0D1017] dark:text-[#EFECE6] mb-1.5 font-mono">
              <span>Archival Delivery</span>
              <span>
                {remainingForFreeShipping === 0
                  ? 'Complimentary'
                  : `$${remainingForFreeShipping.toFixed(2)} away`}
              </span>
            </div>
            <div className="h-1.5 w-full bg-[#DFD7C7] dark:bg-[#2C3446] overflow-hidden">
              <div
                className="h-full bg-[#16284F] dark:bg-[#5A85C4] transition-all duration-400 ease-out"
                style={{ width: `${freeShippingPercent}%` }}
              />
            </div>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-5 divide-y divide-[#DFD7C7]/60 dark:divide-[#242A38]/60">
            {cart.items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-16 animate-ink-fade">
                <ShoppingBag className="w-10 h-10 text-[#5A6273]/40 stroke-1 mb-4" />
                <h3 className="font-editorial text-2xl text-[#0D1017] dark:text-[#EFECE6] mb-1">
                  Your reading bag is empty
                </h3>
                <p className="text-xs text-[#5A6273] dark:text-[#8F97A8] max-w-xs mb-6 font-body-literary">
                  Explore our carefully bound editions and letterpress monographs.
                </p>
                <button
                  onClick={() => {
                    setIsCartDrawerOpen(false);
                    onNavigate('catalog');
                  }}
                  className="px-6 py-2.5 bg-[#0B0E14] dark:bg-[#16284F] text-[#F7F4EB] text-xs font-semibold tracking-wider uppercase hover:bg-[#16284F] dark:hover:bg-[#203666] transition-colors font-mono btn-press shadow-xs"
                >
                  Explore Catalog
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
                      className="w-16 h-22 object-cover border border-[#DFD7C7] dark:border-[#242A38] shadow-xs shrink-0"
                    />
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <h4
                          onClick={() => {
                            setIsCartDrawerOpen(false);
                            onNavigate(`book:${book.id}`);
                          }}
                          className="font-editorial text-xl text-[#0D1017] dark:text-[#EFECE6] truncate hover:text-[#16284F] dark:hover:text-[#5A85C4] cursor-pointer"
                        >
                          {book.bookTitle}
                        </h4>
                        <p className="text-xs text-[#5A6273] dark:text-[#8F97A8] truncate">
                          {book.authorName} · {book.coverType}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        {/* Stepper */}
                        <div className="flex items-center border border-[#DFD7C7] dark:border-[#242A38] bg-[#FFFFFF] dark:bg-[#131720]">
                          <button
                            onClick={() => updateQuantity(book.id, quantity - 1)}
                            className="p-1 hover:bg-[#EFEAE0] dark:hover:bg-[#1F2636] text-[#5A6273] btn-press"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2 text-xs font-mono font-medium text-[#0D1017] dark:text-[#EFECE6]">
                            {quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(book.id, quantity + 1)}
                            className="p-1 hover:bg-[#EFEAE0] dark:hover:bg-[#1F2636] text-[#5A6273] btn-press"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <div className="flex items-center gap-3 font-mono">
                          <span className="text-xs font-semibold text-[#0D1017] dark:text-[#EFECE6]">
                            ${(itemPrice * quantity).toFixed(2)}
                          </span>
                          <button
                            onClick={() => removeFromCart(book.id)}
                            className="text-[#5A6273] hover:text-[#8E1F1F] transition-colors p-1 btn-press"
                            title="Remove item"
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
            <div className="p-6 border-t border-[#DFD7C7] dark:border-[#242A38] bg-[#F7F4EB] dark:bg-[#131720] space-y-4">
              <div className="space-y-1.5 text-xs text-[#5A6273] dark:text-[#8F97A8] font-mono">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-[#0D1017] dark:text-[#EFECE6]">
                    ${cart.subtotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Archival Delivery</span>
                  <span className="font-semibold text-[#0D1017] dark:text-[#EFECE6]">
                    {cart.shipping === 0 ? 'Complimentary' : `$${cart.shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-semibold text-[#0D1017] dark:text-[#EFECE6] pt-2 border-t border-[#DFD7C7] dark:border-[#242A38]">
                  <span>Total Due</span>
                  <span>${cart.total.toFixed(2)}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5 pt-2 font-mono">
                <button
                  onClick={() => {
                    setIsCartDrawerOpen(false);
                    onNavigate('cart');
                  }}
                  className="w-full py-3 border border-[#0B0E14] dark:border-[#EFECE6] text-xs font-semibold tracking-wider uppercase text-[#0D1017] dark:text-[#EFECE6] hover:bg-[#EFEAE0] dark:hover:bg-[#1A202C] transition-colors text-center btn-press"
                >
                  View Bag
                </button>
                <button
                  onClick={() => {
                    setIsCartDrawerOpen(false);
                    onNavigate('checkout');
                  }}
                  className="w-full py-3 bg-[#0B0E14] dark:bg-[#16284F] text-[#F7F4EB] text-xs font-semibold tracking-wider uppercase hover:bg-[#16284F] dark:hover:bg-[#203666] transition-colors flex items-center justify-center gap-1.5 btn-press shadow-xs"
                >
                  Checkout
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
