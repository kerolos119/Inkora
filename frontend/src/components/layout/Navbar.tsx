import { t } from '../../i18n';
import { LanguageToggle } from '../common/LanguageToggle';
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
    <header className="sticky top-0 z-40 bg-[#FAF6EC]/95 dark:bg-[#120F0B]/95 backdrop-blur-md border-b border-[#E3D6BC] dark:border-[#4A3E2E]">
      {/* Editorial Announcement & Demo Switcher Bar */}
      <div className="bg-[#3B2B1E] text-[#F3ECDD] text-[11px] py-1.5 px-4 tracking-wider border-b border-[#33291C]">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="hidden sm:flex items-center gap-2 text-[#DFD6CA]/80">
            <span className="flex items-center gap-1.5">
              <svg className="w-3 h-3 text-[#D9AE6B] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m12 2 4 7-4 13-4-13 4-7z"/>
                <circle cx="12" cy="11" r="1.5" fill="currentColor"/>
              </svg>
              <span>{t('x.1c0149')}</span>
            </span>
            <span className="text-[#D9AE6B]">·</span>
            <span className="italic font-editorial text-xs text-[#F3ECDD]">{t('x.30c8b4')}</span>
          </div>
          <div className="flex items-center gap-3 ms-auto text-xs">
            <span className="text-[#DFD6CA]/60">{t('x.61e4c2')}</span>
            <button
              onClick={() => switchDemoRole(user?.role === 'ADMIN' ? 'USER' : 'ADMIN')}
              className="flex items-center gap-1.5 px-2.5 py-0.5 bg-[#8A6238] dark:bg-[#604626] text-[#F3ECDD] hover:bg-[#654A2A] transition-colors font-medium text-xs uppercase tracking-widest cursor-pointer border border-[#84653F]/40"
              title={t('x.ad34bc')}
            >
              {user?.role === 'ADMIN' ? (
                <>
                  <ShieldCheck className="w-3 h-3 text-[#F3ECDD]" />
                  <span>{t('x.50d16c')}</span>
                </>
              ) : (
                <>
                  <UserIcon className="w-3 h-3 text-[#F3ECDD]" />
                  <span>{t('x.5876b3')}</span>
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
              className="p-2 text-[#3B2B1E] dark:text-[#F3ECDD] hover:text-[#8A6238] dark:hover:text-[#D9AE6B] transition-colors"
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
            <div className="w-9 h-9 flex items-center justify-center bg-[#3B2B1E] dark:bg-[#8A6238] text-[#FAF6EC] shadow-xs group-hover:bg-[#8A6238] dark:group-hover:bg-[#604626] transition-all nib-hover">
              <svg className="w-5 h-5 text-[#FAF6EC]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="m12 2 4 7-4 13-4-13 4-7z"/>
                <circle cx="12" cy="11" r="1.5" fill="currentColor"/>
                <path d="M12 12.5V19"/>
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="font-editorial text-3xl font-semibold tracking-widest uppercase text-[#3B2B1E] dark:text-[#F3ECDD] group-hover:text-[#8A6238] dark:group-hover:text-[#D9AE6B] transition-colors">
                INKORA
              </span>
              <span className="text-xs uppercase tracking-[0.28em] text-[#7A6652] dark:text-[#A99A82] -mt-1 font-mono">
                {t('x.589be7')}
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-8 text-xs font-semibold tracking-widest uppercase text-[#3B2B1E] dark:text-[#F3ECDD]">
            <button
              onClick={() => onNavigate('home')}
              className={`transition-colors py-1 ${
                currentPage === 'home'
                  ? 'text-[#8A6238] dark:text-[#D9AE6B] border-b-2 border-[#8A6238] dark:border-[#D9AE6B]'
                  : 'hover:text-[#8A6238] dark:hover:text-[#D9AE6B]'
              }`}
            >
              {t('x.70f8bb')}
            </button>
            <button
              onClick={() => onNavigate('catalog')}
              className={`transition-colors py-1 ${
                currentPage === 'catalog'
                  ? 'text-[#8A6238] dark:text-[#D9AE6B] border-b-2 border-[#8A6238] dark:border-[#D9AE6B]'
                  : 'hover:text-[#8A6238] dark:hover:text-[#D9AE6B]'
              }`}
            >
              {t('x.4badcb')}
            </button>
            <button
              onClick={() => onNavigate('editorial')}
              className={`transition-colors py-1 ${
                currentPage === 'editorial'
                  ? 'text-[#8A6238] dark:text-[#D9AE6B] border-b-2 border-[#8A6238] dark:border-[#D9AE6B]'
                  : 'hover:text-[#8A6238] dark:hover:text-[#D9AE6B]'
              }`}
            >
              {t('x.dd3622')}
            </button>
            {isAdmin && (
              <button
                onClick={() => onNavigate('admin')}
                className="flex items-center gap-1.5 text-[#8A6238] dark:text-[#D9AE6B] font-semibold py-1 hover:text-[#6F4D2B] transition-colors"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{t('x.036adc')}</span>
              </button>
            )}
          </nav>

          {/* Right Action Icons: Search, Wishlist, Cart, Account, Theme */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Search Input / Trigger */}
            <div className="relative">
              {isSearchExpanded ? (
                <div className="flex items-center border border-[#8A6238] dark:border-[#D9AE6B] bg-[#FFFFFF] dark:bg-[#2A231B] px-2.5 py-1 shadow-xs">
                  <Search className="w-3.5 h-3.5 text-[#8A6238] dark:text-[#D9AE6B] me-2 shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    placeholder={t('x.4fbc7a')}
                    onChange={(e) => {
                      if (onSearchChange) onSearchChange(e.target.value);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        onNavigate('catalog');
                      }
                    }}
                    autoFocus
                    className="w-48 sm:w-64 text-xs bg-transparent text-[#3B2B1E] dark:text-[#F3ECDD] focus:outline-hidden"
                  />
                  <button
                    onClick={() => setIsSearchExpanded(false)}
                    className="p-1 text-[#7A6652] hover:text-[#3B2B1E] dark:text-[#A99A82]"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsSearchExpanded(true)}
                  className="p-2 text-[#3B2B1E] dark:text-[#F3ECDD] hover:text-[#8A6238] dark:hover:text-[#D9AE6B] transition-colors"
                  title={t('x.5c7708')}
                >
                  <Search className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Wishlist */}
            <button
              onClick={() => onNavigate('account:wishlist')}
              className="p-2 text-[#3B2B1E] dark:text-[#F3ECDD] hover:text-[#8A6238] dark:hover:text-[#D9AE6B] transition-colors relative"
              title={t('x.b7ac5c')}
            >
              <Heart className="w-4 h-4" />
              {wishlistIds.length > 0 && (
                <span className="absolute top-1 end-1 w-3.5 h-3.5 bg-[#8E1F1F] text-[#F3ECDD] text-xs font-bold flex items-center justify-center font-mono">
                  {wishlistIds.length}
                </span>
              )}
            </button>

            {/* Cart Drawer Trigger */}
            <button
              onClick={() => setIsCartDrawerOpen(true)}
              className="p-2 text-[#3B2B1E] dark:text-[#F3ECDD] hover:text-[#8A6238] dark:hover:text-[#D9AE6B] transition-colors relative flex items-center gap-1 btn-press"
              title={t('x.f1eb8f')}
            >
              <ShoppingBag className="w-4 h-4" />
              {itemCount > 0 && (
                <span
                  className={`w-4 h-4 bg-[#8A6238] dark:bg-[#A67E4C] text-[#F3ECDD] text-xs font-semibold flex items-center justify-center font-mono ${
                    cartBouncing ? 'animate-cart-bounce' : ''
                  }`}
                >
                  {itemCount}
                </span>
              )}
            </button>

            {/* Theme Toggle */}
            <LanguageToggle /><ThemeToggle />

            {/* Account Dropdown */}
            <div className="relative">
              <button
                onClick={() => setAccountMenuOpen(!accountMenuOpen)}
                className="flex items-center gap-1.5 p-1.5 text-[#3B2B1E] dark:text-[#F3ECDD] hover:text-[#8A6238] transition-colors border border-transparent hover:border-[#E3D6BC] dark:hover:border-[#4A3E2E]"
              >
                <div className="w-6 h-6 bg-[#EBE5D8] dark:bg-[#342A1D] flex items-center justify-center text-xs font-bold text-[#3B2B1E] dark:text-[#F3ECDD]">
                  {user?.username ? user.username.charAt(0).toUpperCase() : 'U'}
                </div>
                <ChevronDown className="w-3 h-3 text-[#7A6652]" />
              </button>

              {accountMenuOpen && (
                <div
                  className="absolute end-0 mt-2 w-56 bg-[#FAF6EC] dark:bg-[#2A231B] border border-[#E3D6BC] dark:border-[#4A3E2E] shadow-xl py-2 z-50 text-xs animate-in fade-in slide-in-from-top-1"
                  onClick={() => setAccountMenuOpen(false)}
                >
                  <div className="px-4 py-2 border-b border-[#E3D6BC] dark:border-[#4A3E2E]">
                    <p className="font-semibold text-[#3B2B1E] dark:text-[#F3ECDD] truncate">
                      {user?.username || 'Guest Reader'}
                    </p>
                    <p className="text-[11px] text-[#7A6652] dark:text-[#A99A82] truncate">
                      {user?.email || 'reader@inkora.com'}
                    </p>
                    <span className="inline-block mt-1 px-1.5 py-0.2 bg-[#F6EBD3] dark:bg-[#342718] text-[#8A6238] dark:text-[#D9AE6B] text-xs font-mono tracking-wider uppercase">
                      {user?.role || 'PATRON'}
                    </span>
                  </div>

                  <div className="py-1">
                    <button
                      onClick={() => onNavigate('account')}
                      className="w-full text-start px-4 py-2 hover:bg-[#F1E9D6] dark:hover:bg-[#2F261B] text-[#3B2B1E] dark:text-[#F3ECDD]"
                    >
                      {t('x.1da020')}
                    </button>
                    <button
                      onClick={() => onNavigate('account:orders')}
                      className="w-full text-start px-4 py-2 hover:bg-[#F1E9D6] dark:hover:bg-[#2F261B] text-[#3B2B1E] dark:text-[#F3ECDD]"
                    >
                      {t('x.f0e848')}
                    </button>
                    <button
                      onClick={() => onNavigate('account:wishlist')}
                      className="w-full text-start px-4 py-2 hover:bg-[#F1E9D6] dark:hover:bg-[#2F261B] text-[#3B2B1E] dark:text-[#F3ECDD]"
                    >
                      {t('x.bdd2fa')}
                    </button>

                    {isAdmin && (
                      <button
                        onClick={() => onNavigate('admin')}
                        className="w-full text-start px-4 py-2 font-medium text-[#8A6238] dark:text-[#D9AE6B] hover:bg-[#F1E9D6] dark:hover:bg-[#2F261B] flex items-center justify-between"
                      >
                        <span>{t('x.12b0d3')}</span>
                        <ShieldCheck className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <div className="border-t border-[#E3D6BC] dark:border-[#4A3E2E] pt-1">
                    <button
                      onClick={() => onNavigate('auth')}
                      className="w-full text-start px-4 py-2 hover:bg-[#F1E9D6] dark:hover:bg-[#2F261B] text-[#7A6652] dark:text-[#A99A82]"
                    >
                      {t('x.c21eea')}
                    </button>
                    <button
                      onClick={logout}
                      className="w-full text-start px-4 py-2 hover:bg-[#F1E9D6] dark:hover:bg-[#2F261B] text-[#8E1F1F] flex items-center gap-1.5"
                    >
                      <LogOut className="w-3 h-3" />
                      <span>{t('x.61fd08')}</span>
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
        <div className="lg:hidden border-t border-[#E3D6BC] dark:border-[#4A3E2E] bg-[#FAF6EC] dark:bg-[#120F0B] px-6 py-6 space-y-4">
          <div className="space-y-3 text-sm font-medium tracking-wider uppercase text-[#3B2B1E] dark:text-[#F3ECDD]">
            <button
              onClick={() => {
                onNavigate('home');
                setMobileMenuOpen(false);
              }}
              className="block w-full text-start py-1"
            >
              {t('x.70f8bb')}
            </button>
            <button
              onClick={() => {
                onNavigate('catalog');
                setMobileMenuOpen(false);
              }}
              className="block w-full text-start py-1"
            >
              {t('x.4badcb')}
            </button>
            <button
              onClick={() => {
                onNavigate('editorial');
                setMobileMenuOpen(false);
              }}
              className="block w-full text-start py-1"
            >
              {t('x.dd3622')}
            </button>
            <button
              onClick={() => {
                onNavigate('account');
                setMobileMenuOpen(false);
              }}
              className="block w-full text-start py-1"
            >
              {t('x.b51b2b')}
            </button>
            {isAdmin && (
              <button
                onClick={() => {
                  onNavigate('admin');
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-start py-1 text-[#8A6238] dark:text-[#D9AE6B] font-semibold"
              >
                {t('x.036adc')}
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
