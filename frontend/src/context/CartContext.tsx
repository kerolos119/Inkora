import { t } from '../i18n';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Cart, CartItem, Book } from '../types/index.js';
import { api } from '../services/api.js';
import { useToast } from './ToastContext.js';

interface CartContextValue {
  cart: Cart;
  itemCount: number;
  isLoading: boolean;
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

const CartContext = createContext<CartContextValue | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<Cart>(defaultCart);
  const [isLoading, setIsLoading] = useState(true);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const { showToast } = useToast();

  const refreshCart = async () => {
    try {
      const data = await api.getCart();
      setCart(data);
    } catch {
      // Keep existing local
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshCart();
  }, []);

  const addToCart = async (book: Book, quantity = 1) => {
    try {
      const updated = await api.addToCart(book.id, quantity);
      setCart(updated);
      showToast(t('cart.added', { title: book.bookTitle }));
    } catch (err: any) {
      showToast(err.message || 'Could not add to cart', 'error');
    }
  };

  const updateQuantity = async (bookId: string, quantity: number) => {
    try {
      const updated = await api.addToCart(bookId, quantity);
      setCart(updated);
    } catch (err: any) {
      showToast(err.message || 'Could not update quantity', 'error');
    }
  };

  const removeFromCart = async (bookId: string) => {
    try {
      const updated = await api.removeFromCart(bookId);
      setCart(updated);
      showToast(t('cart.removed'), 'info');
    } catch (err: any) {
      showToast(err.message || 'Could not remove item', 'error');
    }
  };

  const clearCart = async () => {
    try {
      const updated = await api.clearCart();
      setCart(updated);
    } catch (err: any) {
      showToast(err.message || 'Could not clear cart', 'error');
    }
  };

  const itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        itemCount,
        isLoading,
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
