import { t } from '../i18n';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Book } from '../types/index.js';
import { useAuth } from './AuthContext.js';
import { useToast } from './ToastContext.js';

interface WishlistContextValue {
  wishlistIds: string[];
  toggleWishlist: (book: Book) => void;
  isWishlisted: (bookId: string) => boolean;
}

const WishlistContext = createContext<WishlistContextValue | undefined>(undefined);
const GUEST_WISHLIST_KEY = 'inkora_wishlist:guest';
const DEFAULT_GUEST_WISHLIST = ['book-1', 'book-3'];

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading: isAuthLoading } = useAuth();
  const storageKey = isAuthLoading
    ? null
    : user
      ? `inkora_wishlist:user:${encodeURIComponent(user.id)}`
      : GUEST_WISHLIST_KEY;
  const [wishlistState, setWishlistState] = useState<{ storageKey: string | null; ids: string[] }>({
    storageKey: null,
    ids: [],
  });

  useEffect(() => {
    if (!storageKey) return;

    try {
      const saved = localStorage.getItem(storageKey);
      const ids = saved ? JSON.parse(saved) : storageKey === GUEST_WISHLIST_KEY ? DEFAULT_GUEST_WISHLIST : [];
      setWishlistState({
        storageKey,
        ids: Array.isArray(ids) && ids.every((id) => typeof id === 'string') ? ids : [],
      });
    } catch {
      setWishlistState({
        storageKey,
        ids: storageKey === GUEST_WISHLIST_KEY ? DEFAULT_GUEST_WISHLIST : [],
      });
    }
  }, [storageKey]);

  const { showToast } = useToast();

  useEffect(() => {
    if (storageKey && wishlistState.storageKey === storageKey) {
      localStorage.setItem(storageKey, JSON.stringify(wishlistState.ids));
    }
  }, [storageKey, wishlistState]);

  const toggleWishlist = (book: Book) => {
    setWishlistState((previous) => {
      if (!storageKey || previous.storageKey !== storageKey) return previous;
      const prev = previous.ids;
      const exists = prev.includes(book.id);
      if (exists) {
        showToast(t('wish.removed', { title: book.bookTitle }), 'info');
        return { ...previous, ids: prev.filter((id) => id !== book.id) };
      } else {
        showToast(t('wish.saved', { title: book.bookTitle }));
        return { ...previous, ids: [...prev, book.id] };
      }
    });
  };

  const wishlistIds = wishlistState.storageKey === storageKey ? wishlistState.ids : [];
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
