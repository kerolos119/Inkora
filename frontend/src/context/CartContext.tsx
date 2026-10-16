import { t } from '../i18n';
import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { Cart, Book } from '../types/index.js';
import { api } from '../services/api.js';
import { useAuth } from './AuthContext.js';
import { useToast } from './ToastContext.js';

interface CartContextValue {
  cart: Cart;
  itemCount: number;
  isLoading: boolean;
  error: string | null;
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (open: boolean) => void;
  addToCart: (book: Book, quantity?: number) => Promise<void>;
  removeFromCart: (bookId: string) => Promise<void>;
  updateQuantity: (bookId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

const defaultCart: Cart = {
  items: [],
  subtotal: 0,
  discount: 0,
  shipping: 0,
  total: 0,
};

interface CartState {
  identity: string | null;
  cart: Cart;
  isLoading: boolean;
  error: string | null;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading: isAuthLoading } = useAuth();
  const identity = isAuthLoading ? null : user?.id ?? null;
  const identityRef = useRef(identity);
  identityRef.current = identity;

  const [cartState, setCartState] = useState<CartState>({
    identity: null,
    cart: defaultCart,
    isLoading: true,
    error: null,
  });
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const requestId = useRef(0);
  const { showToast } = useToast();

  const refreshCart = useCallback(async () => {
    const currentIdentity = identity;
    const currentRequest = ++requestId.current;

    if (isAuthLoading) return;
    if (!currentIdentity) {
      setCartState({ identity: null, cart: defaultCart, isLoading: false, error: null });
      return;
    }

    setCartState((previous) => ({
      identity: currentIdentity,
      cart: previous.identity === currentIdentity ? previous.cart : defaultCart,
      isLoading: true,
      error: null,
    }));

    try {
      const cart = await api.getCart();
      if (requestId.current === currentRequest && identityRef.current === currentIdentity) {
        setCartState({ identity: currentIdentity, cart, isLoading: false, error: null });
      }
    } catch {
      if (requestId.current === currentRequest && identityRef.current === currentIdentity) {
        setCartState({
          identity: currentIdentity,
          cart: defaultCart,
          isLoading: false,
          error: 'Could not load cart.',
        });
      }
    }
  }, [identity, isAuthLoading]);

  useEffect(() => {
    void refreshCart();
    return () => {
      requestId.current += 1;
    };
  }, [refreshCart]);

  const updateCartForIdentity = (currentIdentity: string | null, cart: Cart) => {
    if (identityRef.current !== currentIdentity) return;
    setCartState({
      identity: currentIdentity,
      cart,
      isLoading: false,
      error: null,
    });
  };

  const setMutationError = (currentIdentity: string | null, message: string) => {
    if (identityRef.current !== currentIdentity) return;
    setCartState((previous) => previous.identity === currentIdentity
      ? { ...previous, error: message }
      : previous);
  };

  const addToCart = async (book: Book, quantity = 1) => {
    const currentIdentity = identity;
    try {
      const updated = await api.addToCart(book.id, quantity);
      updateCartForIdentity(currentIdentity, updated);
      showToast(t('cart.added', { title: book.bookTitle }));
    } catch (err: any) {
      setMutationError(currentIdentity, err.message || 'Could not update cart.');
      showToast(err.message || 'Could not add to cart', 'error');
    }
  };

  const updateQuantity = async (bookId: string, quantity: number) => {
    const currentIdentity = identity;
    try {
      const updated = await api.addToCart(bookId, quantity);
      updateCartForIdentity(currentIdentity, updated);
    } catch (err: any) {
      setMutationError(currentIdentity, err.message || 'Could not update cart.');
      showToast(err.message || 'Could not update quantity', 'error');
    }
  };

  const removeFromCart = async (bookId: string) => {
    const currentIdentity = identity;
    try {
      const updated = await api.removeFromCart(bookId);
      updateCartForIdentity(currentIdentity, updated);
      showToast(t('cart.removed'), 'info');
    } catch (err: any) {
      setMutationError(currentIdentity, err.message || 'Could not update cart.');
      showToast(err.message || 'Could not remove item', 'error');
    }
  };

  const clearCart = async () => {
    const currentIdentity = identity;
    try {
      const updated = await api.clearCart();
      updateCartForIdentity(currentIdentity, updated);
    } catch (err: any) {
      setMutationError(currentIdentity, err.message || 'Could not update cart.');
      showToast(err.message || 'Could not clear cart', 'error');
    }
  };

  const cart = cartState.identity === identity ? cartState.cart : defaultCart;
  const isLoading = isAuthLoading || cartState.identity !== identity || cartState.isLoading;
  const error = cartState.identity === identity ? cartState.error : null;
  const itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        itemCount,
        isLoading,
        error,
        isCartDrawerOpen,
        setIsCartDrawerOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};
