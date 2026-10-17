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
import { useAuth } from './context/AuthContext.js';
import { AdminContent } from './pages/admin/AdminContent.js';

// Pages that need a signed-in account
const needsLogin = (page: string) =>
  page === 'checkout' || page === 'account' || page.startsWith('account:');

export const App: React.FC = () => {
  const { user, isAdmin, isLoading, logout } = useAuth();
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

  // Each account only sees its own side of the app:
  //  - admin accounts  -> the admin panel only
  //  - customer / guest -> the storefront only (admin URLs send them to sign in)
  //  - guests           -> sign in first for account and checkout pages
  const effectivePage = isLoading
    ? currentPage
    : isAdmin
      ? currentPage.startsWith('admin') ? currentPage : 'admin'
      : currentPage.startsWith('admin') || (!user && needsLogin(currentPage))
        ? 'auth'
        : currentPage;

  useEffect(() => {
    if (!isLoading && effectivePage !== currentPage) {
      setCurrentPage(effectivePage);
      window.location.hash = effectivePage;
    }
  }, [isLoading, effectivePage, currentPage]);

  // Determine which page to render
  const renderContent = () => {
    if (isLoading) return null;
    const currentPage = effectivePage;
    if (currentPage.startsWith('admin')) {
      return (
        <AdminLayout
          currentTab={adminTab}
          onTabChange={setAdminTab}
          onLogout={() => {
            logout();
            handleNavigate('auth');
          }}
        >
          {adminTab === 'overview' && <AdminDashboard onNavigateTab={setAdminTab} />}
          {adminTab === 'books' && <AdminBooks />}
          {adminTab === 'orders' && <AdminOrders />}
          {adminTab === 'customers' && <AdminCustomers />}
          {adminTab === 'categories' && <AdminCategories />}
          {adminTab === 'authors' && <AdminAuthors />}
          {adminTab === 'reviews' && <AdminReviews />}
          {adminTab === 'posts' && <AdminContent key="post" kind="post"/>}
          {adminTab === 'news' && <AdminContent key="news" kind="news"/>}
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

  const isAdminView = isAdmin && effectivePage.startsWith('admin');

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F3E8] dark:bg-[#120F0B] text-[#3B2B1E] dark:text-[#F3ECDD] transition-colors selection:bg-[#8A6238]/20 selection:text-[#8A6238]">
      {!isAdminView && (
        <Navbar
          currentPage={effectivePage}
          onNavigate={handleNavigate}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
      )}

      <main className="flex-1">
        <div key={effectivePage} className="animate-ink-fade">
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
