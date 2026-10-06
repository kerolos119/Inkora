import { t } from '../../i18n';
import React, { useState } from 'react';
import { ArrowRight, Check } from 'lucide-react';
import { useToast } from '../../context/ToastContext.js';

interface FooterProps {
  onNavigate: (page: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const { showToast } = useToast();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    setSubscribed(true);
    showToast(t('news.ok'));
  };

  return (
    <footer className="border-t border-[#E3D6BC] dark:border-[#4A3E2E] bg-[#FAF6EC] dark:bg-[#120F0B] text-[#3B2B1E] dark:text-[#F3ECDD] pt-16 pb-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Literary Quote Header */}
        <div className="pb-12 border-b border-[#E3D6BC] dark:border-[#4A3E2E] flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-xl">
            <span className="text-xs tracking-[0.25em] uppercase text-[#8A6238] dark:text-[#D9AE6B] font-semibold font-mono">
              {t('x.daaad4')}
            </span>
            <p className="font-editorial text-2xl sm:text-3xl italic mt-2 text-[#3B2B1E] dark:text-[#F3ECDD] leading-snug">
              “A room without books is like a body without a soul — we bind thoughts in deep dark ink meant to outlast the season.”
            </p>
          </div>

          {/* Newsletter Box */}
          <div className="w-full md:w-80">
            <p className="text-xs font-semibold text-[#3B2B1E] dark:text-[#F3ECDD] mb-2 uppercase tracking-wider font-mono">
              {t('x.1fa94b')}
            </p>
            <p className="text-xs text-[#7A6652] dark:text-[#A99A82] mb-3">
              {t('x.28d467')}
            </p>
            {subscribed ? (
              <div className="flex items-center gap-2 text-xs font-medium text-[#2A674A] py-2 animate-ink-fade">
                <Check className="w-4 h-4" />
                <span>{t('x.6babe1')}</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex border border-[#3B2B1E] dark:border-[#F3ECDD] shadow-xs">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="reader@domain.com"
                  required
                  className="px-3 py-2 text-xs bg-transparent text-[#3B2B1E] dark:text-[#F3ECDD] flex-1 focus:outline-hidden"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#3B2B1E] text-[#FAF6EC] dark:bg-[#F3ECDD] dark:text-[#3B2B1E] hover:bg-[#8A6238] dark:hover:bg-[#8A6238] dark:hover:text-[#FAF6EC] btn-press transition-colors"
                >
                  <ArrowRight className="rtl:-scale-x-100 w-3.5 h-3.5" />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12 text-xs">
          <div>
            <h4 className="font-semibold uppercase tracking-widest text-[11px] mb-4 text-[#3B2B1E] dark:text-[#F3ECDD] font-mono">
              {t('x.9930f2')}
            </h4>
            <ul className="space-y-2.5 text-[#7A6652] dark:text-[#A99A82]">
              <li>
                <button onClick={() => onNavigate('catalog')} className="hover:text-[#8A6238] dark:hover:text-[#D9AE6B] transition-colors ink-underline-hover">
                  {t('x.12897e')}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('catalog')} className="hover:text-[#8A6238] dark:hover:text-[#D9AE6B] transition-colors ink-underline-hover">
                  {t('x.ead75c')}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('catalog')} className="hover:text-[#8A6238] dark:hover:text-[#D9AE6B] transition-colors ink-underline-hover">
                  {t('x.aae84e')}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('catalog')} className="hover:text-[#8A6238] dark:hover:text-[#D9AE6B] transition-colors ink-underline-hover">
                  {t('x.07acfa')}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('catalog')} className="hover:text-[#8A6238] dark:hover:text-[#D9AE6B] transition-colors ink-underline-hover">
                  {t('x.63ccca')}
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold uppercase tracking-widest text-[11px] mb-4 text-[#3B2B1E] dark:text-[#F3ECDD] font-mono">
              {t('x.0dbb6a')}
            </h4>
            <ul className="space-y-2.5 text-[#7A6652] dark:text-[#A99A82]">
              <li>
                <button onClick={() => onNavigate('editorial')} className="hover:text-[#8A6238] dark:hover:text-[#D9AE6B] transition-colors ink-underline-hover">
                  {t('x.ae00a7')}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('editorial')} className="hover:text-[#8A6238] dark:hover:text-[#D9AE6B] transition-colors ink-underline-hover">
                  {t('x.73ccff')}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('editorial')} className="hover:text-[#8A6238] dark:hover:text-[#D9AE6B] transition-colors ink-underline-hover">
                  {t('x.c1b5d7')}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('home')} className="hover:text-[#8A6238] dark:hover:text-[#D9AE6B] transition-colors ink-underline-hover">
                  {t('x.d4dd74')}
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold uppercase tracking-widest text-[11px] mb-4 text-[#3B2B1E] dark:text-[#F3ECDD] font-mono">
              {t('x.eace17')}
            </h4>
            <ul className="space-y-2.5 text-[#7A6652] dark:text-[#A99A82]">
              <li>
                <button onClick={() => onNavigate('account:orders')} className="hover:text-[#8A6238] dark:hover:text-[#D9AE6B] transition-colors ink-underline-hover">
                  {t('x.b4ae6a')}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('account:wishlist')} className="hover:text-[#8A6238] dark:hover:text-[#D9AE6B] transition-colors ink-underline-hover">
                  {t('x.36f50e')}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('cart')} className="hover:text-[#8A6238] dark:hover:text-[#D9AE6B] transition-colors ink-underline-hover">
                  {t('x.9ae61a')}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('account')} className="hover:text-[#8A6238] dark:hover:text-[#D9AE6B] transition-colors ink-underline-hover">
                  {t('x.3c858f')}
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold uppercase tracking-widest text-[11px] mb-4 text-[#3B2B1E] dark:text-[#F3ECDD] font-mono">
              {t('x.c84bc3')}
            </h4>
            <p className="text-xs text-[#7A6652] dark:text-[#A99A82] leading-relaxed mb-3">
              {t('x.fd7220')}
            </p>
            <div className="flex items-center gap-2 text-xs uppercase font-mono tracking-wider text-[#8A6238] dark:text-[#D9AE6B]">
              <span>{t('x.1743c9')}</span>
            </div>
          </div>
        </div>

        {/* Copyright & Internationalization Bottom Line */}
        <div className="pt-8 border-t border-[#E3D6BC] dark:border-[#4A3E2E] flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#7A6652] dark:text-[#A99A82] gap-4">
          <div className="flex items-center gap-2">
            <span className="font-editorial font-bold text-base text-[#3B2B1E] dark:text-[#F3ECDD]">INKORA</span>
            <span>© {new Date().getFullYear()} Inkora Bookstore & Editions. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-6">
            <span className="hover:text-[#3B2B1E] dark:hover:text-[#F3ECDD] cursor-pointer">
              {t('x.186fce')}
            </span>
            <span className="hover:text-[#3B2B1E] dark:hover:text-[#F3ECDD] cursor-pointer">
              {t('x.c86288')}
            </span>
            <span className="hover:text-[#3B2B1E] dark:hover:text-[#F3ECDD] cursor-pointer">
              {t('x.6c425b')}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
