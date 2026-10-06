import React, { useState } from 'react';
import {
  Search,
  ShoppingBag,
  Heart,
  User as UserIcon,
  Menu,
  X,
  ShieldCheck,
  LogOut,
  ChevronDown,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.js';
import { useCart } from '../../context/CartContext.js';
import { useWishlist } from '../../context/WishlistContext.js';
import { ThemeToggle } from '../common/ThemeToggle.js';

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  searchQuery?: string;
  onSearchChange?: (q: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  onNavigate,
  searchQuery = '',
  onSearchChange,
}) => {
  const { user, logout, switchDemoRole, isAdmin } = useAuth();
  const { itemCount, setIsCartDrawerOpen } = useCart();
  const { wishlistIds } = useWishlist();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [cartBouncing, setCartBouncing] = useState(false);

  React.useEffect(() => {
    if (itemCount > 0) {
      setCartBouncing(true);
      const timer = setTimeout(() => setCartBouncing(false), 450);
      return () => clearTimeout(timer);
    }
  }, [itemCount]);

  return (
    <header className="sticky top-0 z-40 bg-[#F7F4EB]/95 dark:bg-[#0B0D12]/95 backdrop-blur-md border-b border-[#DFD7C7] dark:border-[#242A38]">
      {/* Editorial Announcement & Demo Switcher Bar */}
      <div className="bg-[#0B0E14] text-[#EFECE6] text-[11px] py-1.5 px-4 tracking-wider border-b border-[#1C2333]">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="hidden sm:flex items-center gap-2 text-[#CBD2DE]/80">
            <span className="flex items-center gap-1.5">
              <svg className="w-3 h-3 text-[#5A85C4] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m12 2 4 7-4 13-4-13 4-7z"/>
                <circle cx="12" cy="11" r="1.5" fill="currentColor"/>
              </svg>
              <span>The Ink Registry: Letterpress editions in permanent iron gall & carbon ink</span>
            </span>
            <span className="text-[#5A85C4]">·</span>
            <span className="italic font-editorial text-xs text-[#EFECE6]">Complimentary delivery over $50</span>
          </div>
          <div className="flex items-center gap-3 ml-auto text-xs">
            <span className="text-[#CBD2DE]/60">Role:</span>
            <button
              onClick={() => switchDemoRole(user?.role === 'ADMIN' ? 'USER' : 'ADMIN')}
              className="flex items-center gap-1.5 px-2.5 py-0.5 bg-[#16284F] dark:bg-[#203666] text-[#EFECE6] hover:bg-[#243B6B] transition-colors font-medium text-[10px] uppercase tracking-widest cursor-pointer border border-[#3B5488]/40"
              title="Click to toggle between customer and admin dashboard mode"
            >
              {user?.role === 'ADMIN' ? (
                <>
                  <ShieldCheck className="w-3 h-3 text-[#EFECE6]" />
                  <span>Admin Mode (Switch to Patron)</span>
                </>
              ) : (
                <>
                  <UserIcon className="w-3 h-3 text-[#EFECE6]" />
                  <span>Patron (Switch to Admin)</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Mobile menu button */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#0D1017] dark:text-[#EFECE6] hover:text-[#16284F] dark:hover:text-[#5A85C4] transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Logo & Brand Identity (Ink Fountain Pen Nib Emblem) */}
          <div
            onClick={() => onNavigate('home')}
            className="flex items-center gap-3.5 cursor-pointer group select-none"
          >
            {/* Fountain Pen Nib Emblem */}
            <div className="w-9 h-9 flex items-center justify-center bg-[#0B0E14] dark:bg-[#16284F] text-[#F7F4EB] shadow-xs group-hover:bg-[#16284F] dark:group-hover:bg-[#203666] transition-all nib-hover">
              <svg className="w-5 h-5 text-[#F7F4EB]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="m12 2 4 7-4 13-4-13 4-7z"/>
                <circle cx="12" cy="11" r="1.5" fill="currentColor"/>
                <path d="M12 12.5V19"/>
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="font-editorial text-3xl font-semibold tracking-widest uppercase text-[#0D1017] dark:text-[#EFECE6] group-hover:text-[#16284F] dark:group-hover:text-[#5A85C4] transition-colors">
                INKORA
              </span>
              <span className="text-[9px] uppercase tracking-[0.28em] text-[#5A6273] dark:text-[#8F97A8] -mt-1 font-mono">
                Press & Bookstore
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-8 text-xs font-semibold tracking-widest uppercase text-[#0D1017] dark:text-[#EFECE6]">
            <button
              onClick={() => onNavigate('home')}
              className={`transition-colors py-1 ${
                currentPage === 'home'
                  ? 'text-[#16284F] dark:text-[#5A85C4] border-b-2 border-[#16284F] dark:border-[#5A85C4]'
                  : 'hover:text-[#16284F] dark:hover:text-[#5A85C4]'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => onNavigate('catalog')}
              className={`transition-colors py-1 ${
                currentPage === 'catalog'
                  ? 'text-[#16284F] dark:text-[#5A85C4] border-b-2 border-[#16284F] dark:border-[#5A85C4]'
                  : 'hover:text-[#16284F] dark:hover:text-[#5A85C4]'
              }`}
            >
              Printed Catalog
            </button>
            <button
              onClick={() => onNavigate('editorial')}
              className={`transition-colors py-1 ${
                currentPage === 'editorial'
                  ? 'text-[#16284F] dark:text-[#5A85C4] border-b-2 border-[#16284F] dark:border-[#5A85C4]'
                  : 'hover:text-[#16284F] dark:hover:text-[#5A85C4]'
              }`}
            >
              The Ink Gazette
            </button>
            {isAdmin && (
              <button
                onClick={() => onNavigate('admin')}
                className="flex items-center gap-1.5 text-[#16284F] dark:text-[#5A85C4] font-semibold py-1 hover:text-[#0E1A33] transition-colors"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Admin Suite</span>
              </button>
            )}
          </nav>

          {/* Right Action Icons: Search, Wishlist, Cart, Account, Theme */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Search Input / Trigger */}
            <div className="relative">
              {isSearchExpanded ? (
                <div className="flex items-center border border-[#16284F] dark:border-[#5A85C4] bg-[#FFFFFF] dark:bg-[#131720] px-2.5 py-1 shadow-xs">
                  <Search className="w-3.5 h-3.5 text-[#16284F] dark:text-[#5A85C4] mr-2 shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    placeholder="Search by title, author, ISBN..."
                    onChange={(e) => {
                      if (onSearchChange) onSearchChange(e.target.value);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        onNavigate('catalog');
                      }
                    }}
                    autoFocus
                    className="w-48 sm:w-64 text-xs bg-transparent text-[#0D1017] dark:text-[#EFECE6] focus:outline-hidden"
                  />
                  <button
                    onClick={() => setIsSearchExpanded(false)}
                    className="p-1 text-[#5A6273] hover:text-[#0D1017] dark:text-[#8F97A8]"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsSearchExpanded(true)}
                  className="p-2 text-[#0D1017] dark:text-[#EFECE6] hover:text-[#16284F] dark:hover:text-[#5A85C4] transition-colors"
                  title="Search Books"
                >
                  <Search className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Wishlist */}
            <button
              onClick={() => onNavigate('account:wishlist')}
              className="p-2 text-[#0D1017] dark:text-[#EFECE6] hover:text-[#16284F] dark:hover:text-[#5A85C4] transition-colors relative"
              title="Reading Wishlist"
            >
              <Heart className="w-4 h-4" />
              {wishlistIds.length > 0 && (
                <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-[#8E1F1F] text-[#EFECE6] text-[9px] font-bold flex items-center justify-center font-mono">
                  {wishlistIds.length}
                </span>
              )}
            </button>

            {/* Cart Drawer Trigger */}
            <button
              onClick={() => setIsCartDrawerOpen(true)}
              className="p-2 text-[#0D1017] dark:text-[#EFECE6] hover:text-[#16284F] dark:hover:text-[#5A85C4] transition-colors relative flex items-center gap-1 btn-press"
              title="Open Reading Bag"
            >
              <ShoppingBag className="w-4 h-4" />
              {itemCount > 0 && (
                <span
                  className={`w-4 h-4 bg-[#16284F] dark:bg-[#4670AC] text-[#EFECE6] text-[10px] font-semibold flex items-center justify-center font-mono ${
                    cartBouncing ? 'animate-cart-bounce' : ''
                  }`}
                >
                  {itemCount}
                </span>
              )}
            </button>

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Account Dropdown */}
            <div className="relative">
              <button
                onClick={() => setAccountMenuOpen(!accountMenuOpen)}
                className="flex items-center gap-1.5 p-1.5 text-[#0D1017] dark:text-[#EFECE6] hover:text-[#16284F] transition-colors border border-transparent hover:border-[#DFD7C7] dark:hover:border-[#242A38]"
              >
                <div className="w-6 h-6 bg-[#EBE5D8] dark:bg-[#1E2433] flex items-center justify-center text-[10px] font-bold text-[#0D1017] dark:text-[#EFECE6]">
                  {user?.username ? user.username.charAt(0).toUpperCase() : 'U'}
                </div>
                <ChevronDown className="w-3 h-3 text-[#5A6273]" />
              </button>

              {accountMenuOpen && (
                <div
                  className="absolute right-0 mt-2 w-56 bg-[#F7F4EB] dark:bg-[#131720] border border-[#DFD7C7] dark:border-[#242A38] shadow-xl py-2 z-50 text-xs animate-in fade-in slide-in-from-top-1"
                  onClick={() => setAccountMenuOpen(false)}
                >
                  <div className="px-4 py-2 border-b border-[#DFD7C7] dark:border-[#242A38]">
                    <p className="font-semibold text-[#0D1017] dark:text-[#EFECE6] truncate">
                      {user?.username || 'Guest Reader'}
                    </p>
                    <p className="text-[11px] text-[#5A6273] dark:text-[#8F97A8] truncate">
                      {user?.email || 'reader@inkora.com'}
                    </p>
                    <span className="inline-block mt-1 px-1.5 py-0.2 bg-[#EBF0F8] dark:bg-[#162236] text-[#16284F] dark:text-[#5A85C4] text-[9px] font-mono tracking-wider uppercase">
                      {user?.role || 'PATRON'}
                    </span>
                  </div>

                  <div className="py-1">
                    <button
                      onClick={() => onNavigate('account')}
                      className="w-full text-left px-4 py-2 hover:bg-[#EFEAE0] dark:hover:bg-[#1C212E] text-[#0D1017] dark:text-[#EFECE6]"
                    >
                      My Library & Profile
                    </button>
                    <button
                      onClick={() => onNavigate('account:orders')}
                      className="w-full text-left px-4 py-2 hover:bg-[#EFEAE0] dark:hover:bg-[#1C212E] text-[#0D1017] dark:text-[#EFECE6]"
                    >
                      Orders & Tracking
                    </button>
                    <button
                      onClick={() => onNavigate('account:wishlist')}
                      className="w-full text-left px-4 py-2 hover:bg-[#EFEAE0] dark:hover:bg-[#1C212E] text-[#0D1017] dark:text-[#EFECE6]"
                    >
                      Saved Editions
                    </button>

                    {isAdmin && (
                      <button
                        onClick={() => onNavigate('admin')}
                        className="w-full text-left px-4 py-2 font-medium text-[#16284F] dark:text-[#5A85C4] hover:bg-[#EFEAE0] dark:hover:bg-[#1C212E] flex items-center justify-between"
                      >
                        <span>Store Administration</span>
                        <ShieldCheck className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <div className="border-t border-[#DFD7C7] dark:border-[#242A38] pt-1">
                    <button
                      onClick={() => onNavigate('auth')}
                      className="w-full text-left px-4 py-2 hover:bg-[#EFEAE0] dark:hover:bg-[#1C212E] text-[#5A6273] dark:text-[#8F97A8]"
                    >
                      Switch Account / Sign In
                    </button>
                    <button
                      onClick={logout}
                      className="w-full text-left px-4 py-2 hover:bg-[#EFEAE0] dark:hover:bg-[#1C212E] text-[#8E1F1F] flex items-center gap-1.5"
                    >
                      <LogOut className="w-3 h-3" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#DFD7C7] dark:border-[#242A38] bg-[#F7F4EB] dark:bg-[#0B0D12] px-6 py-6 space-y-4">
          <div className="space-y-3 text-sm font-medium tracking-wider uppercase text-[#0D1017] dark:text-[#EFECE6]">
            <button
              onClick={() => {
                onNavigate('home');
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left py-1"
            >
              Home
            </button>
            <button
              onClick={() => {
                onNavigate('catalog');
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left py-1"
            >
              Printed Catalog
            </button>
            <button
              onClick={() => {
                onNavigate('editorial');
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left py-1"
            >
              The Ink Gazette
            </button>
            <button
              onClick={() => {
                onNavigate('account');
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left py-1"
            >
              My Account
            </button>
            {isAdmin && (
              <button
                onClick={() => {
                  onNavigate('admin');
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-left py-1 text-[#16284F] dark:text-[#5A85C4] font-semibold"
              >
                Admin Suite
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
