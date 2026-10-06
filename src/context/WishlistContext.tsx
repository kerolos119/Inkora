import React, { createContext, useContext, useState, useEffect } from 'react';
import { Book } from '../types/index.js';
import { useToast } from './ToastContext.js';

interface WishlistContextValue {
  wishlistIds: string[];
  toggleWishlist: (book: Book) => void;
  isWishlisted: (bookId: string) => boolean;
}

const WishlistContext = createContext<WishlistContextValue | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wishlistIds, setWishlistIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('inkora_wishlist');
      return saved ? JSON.parse(saved) : ['book-1', 'book-3'];
    } catch {
      return ['book-1', 'book-3'];
    }
  });

  const { showToast } = useToast();

  useEffect(() => {
    localStorage.setItem('inkora_wishlist', JSON.stringify(wishlistIds));
  }, [wishlistIds]);

  const toggleWishlist = (book: Book) => {
    setWishlistIds((prev) => {
      const exists = prev.includes(book.id);
      if (exists) {
        showToast(`Removed "${book.bookTitle}" from saved books`, 'info');
        return prev.filter((id) => id !== book.id);
      } else {
        showToast(`Saved "${book.bookTitle}" to reading list`);
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
