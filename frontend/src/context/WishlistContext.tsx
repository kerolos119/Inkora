import { t } from '../i18n';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Book } from '../types/index.js';
import { useToast } from './ToastContext.js';
import { useAuth } from './AuthContext.js';

interface WishlistContextValue {
  wishlistIds: string[];
  toggleWishlist: (book: Book) => void;
  isWishlisted: (bookId: string) => boolean;
}

const WishlistContext = createContext<WishlistContextValue | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const storageKey = `inkora_wishlist_${user?.id ?? 'guest'}`;
  const readList = (key: string): string[] => {
    try {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  };
  const [wishlistIds, setWishlistIds] = useState<string[]>(() => readList(storageKey));

  const { showToast } = useToast();

  // Each account keeps its own wishlist in this browser
  useEffect(() => {
    setWishlistIds(readList(storageKey));
  }, [storageKey]);

  useEffect(() => {
    try { localStorage.setItem(storageKey, JSON.stringify(wishlistIds)); } catch { /* storage unavailable */ }
  }, [wishlistIds]);

  const toggleWishlist = (book: Book) => {
    setWishlistIds((prev) => {
      const exists = prev.includes(book.id);
      if (exists) {
        showToast(t('wish.removed', { title: book.bookTitle }), 'info');
        return prev.filter((id) => id !== book.id);
      } else {
        showToast(t('wish.saved', { title: book.bookTitle }));
        return [...prev, book.id];
      }
    });
  };

  const isWishlisted = (bookId: string) => wishlistIds.includes(bookId);

  return (
    <WishlistContext.Provider value={{ wishlistIds, toggleWishlist, isWishlisted }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) throw new Error('useWishlist must be used within WishlistProvider');
  return context;
};
