import React, { useState, useEffect } from 'react';
import { Navbar } from './components/layout/Navbar.js';
import { Footer } from './components/layout/Footer.js';
import { CartDrawer } from './components/layout/CartDrawer.js';
import { QuickViewModal } from './components/books/QuickViewModal.js';
import { HomePage } from './pages/HomePage.js';
import { CatalogPage } from './pages/CatalogPage.js';
import { BookDetailPage } from './pages/BookDetailPage.js';
import { CartPage } from './pages/CartPage.js';
import { CheckoutPage } from './pages/CheckoutPage.js';
import { AccountPage } from './pages/AccountPage.js';
import { EditorialPage } from './pages/EditorialPage.js';
import { AuthPage } from './pages/AuthPage.js';
import { AdminLayout } from './pages/admin/AdminLayout.js';
import { AdminDashboard } from './pages/admin/AdminDashboard.js';
import { AdminBooks } from './pages/admin/AdminBooks.js';
import { AdminOrders } from './pages/admin/AdminOrders.js';
import { AdminCustomers } from './pages/admin/AdminCustomers.js';
import { AdminCategories } from './pages/admin/AdminCategories.js';
import { AdminAuthors } from './pages/admin/AdminAuthors.js';
import { AdminReviews } from './pages/admin/AdminReviews.js';
import { Book } from './types/index.js';

export const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<string>(() => {
    const hash = window.location.hash.replace('#', '');
    return hash || 'home';
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [quickViewBook, setQuickViewBook] = useState<Book | null>(null);
  const [adminTab, setAdminTab] = useState<string>('overview');

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash) setCurrentPage(hash);
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
    window.location.hash = page;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Determine which page to render
  const renderContent = () => {
    if (currentPage.startsWith('admin')) {
      return (
        <AdminLayout
          currentTab={adminTab}
          onTabChange={setAdminTab}
          onNavigateHome={() => handleNavigate('home')}
        >
          {adminTab === 'overview' && <AdminDashboard onNavigateTab={setAdminTab} />}
          {adminTab === 'books' && <AdminBooks />}
          {adminTab === 'orders' && <AdminOrders />}
          {adminTab === 'customers' && <AdminCustomers />}
          {adminTab === 'categories' && <AdminCategories />}
          {adminTab === 'authors' && <AdminAuthors />}
          {adminTab === 'reviews' && <AdminReviews />}
        </AdminLayout>
      );
    }

    if (currentPage.startsWith('book:')) {
      const bookId = currentPage.replace('book:', '');
      return (
        <BookDetailPage
          bookId={bookId}
          onNavigate={handleNavigate}
          onQuickView={setQuickViewBook}
        />
      );
    }

    if (currentPage.startsWith('catalog:category:')) {
      const categoryId = currentPage.replace('catalog:category:', '');
      return (
        <CatalogPage
          initialCategory={categoryId}
          searchQuery={searchQuery}
          onNavigate={handleNavigate}
          onQuickView={setQuickViewBook}
        />
      );
    }

    if (currentPage.startsWith('account:')) {
      return (
        <AccountPage
          initialTab={currentPage}
          onNavigate={handleNavigate}
          onQuickView={setQuickViewBook}
        />
      );
    }

    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={handleNavigate} onQuickView={setQuickViewBook} />;
      case 'catalog':
        return (
          <CatalogPage
            searchQuery={searchQuery}
            onNavigate={handleNavigate}
            onQuickView={setQuickViewBook}
          />
        );
      case 'cart':
        return <CartPage onNavigate={handleNavigate} onQuickView={setQuickViewBook} />;
      case 'checkout':
        return <CheckoutPage onNavigate={handleNavigate} />;
      case 'account':
        return <AccountPage onNavigate={handleNavigate} onQuickView={setQuickViewBook} />;
      case 'editorial':
        return <EditorialPage onNavigate={handleNavigate} />;
      case 'auth':
        return <AuthPage onNavigate={handleNavigate} />;
      default:
        return <HomePage onNavigate={handleNavigate} onQuickView={setQuickViewBook} />;
    }
  };

  const isAdminView = currentPage.startsWith('admin');

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF6EC] dark:bg-[#120F0B] text-[#3B2B1E] dark:text-[#F3ECDD] transition-colors selection:bg-[#8A6238]/20 selection:text-[#8A6238]">
      {!isAdminView && (
        <Navbar
          currentPage={currentPage}
          onNavigate={handleNavigate}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
      )}

      <main className="flex-1">
        <div key={currentPage} className="animate-ink-fade">
          {renderContent()}
        </div>
      </main>

      {!isAdminView && <Footer onNavigate={handleNavigate} />}

      <CartDrawer onNavigate={handleNavigate} />
      <QuickViewModal
        book={quickViewBook}
        onClose={() => setQuickViewBook(null)}
        onNavigate={handleNavigate}
      />
    </div>
  );
};
