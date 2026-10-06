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
    showToast('Subscribed to the Inkora Literary Gazette');
  };

  return (
    <footer className="border-t border-[#DFD7C7] dark:border-[#242A38] bg-[#F7F4EB] dark:bg-[#0B0D12] text-[#0D1017] dark:text-[#EFECE6] pt-16 pb-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Literary Quote Header */}
        <div className="pb-12 border-b border-[#DFD7C7] dark:border-[#242A38] flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-xl">
            <span className="text-[10px] tracking-[0.25em] uppercase text-[#16284F] dark:text-[#5A85C4] font-semibold font-mono">
              The Inkora Press Manifest
            </span>
            <p className="font-editorial text-2xl sm:text-3xl italic mt-2 text-[#0D1017] dark:text-[#EFECE6] leading-snug">
              “A room without books is like a body without a soul — we bind thoughts in deep dark ink meant to outlast the season.”
            </p>
          </div>

          {/* Newsletter Box */}
          <div className="w-full md:w-80">
            <p className="text-xs font-semibold text-[#0D1017] dark:text-[#EFECE6] mb-2 uppercase tracking-wider font-mono">
              The Inkora Gazette
            </p>
            <p className="text-xs text-[#5A6273] dark:text-[#8F97A8] mb-3">
              Monthly essays on bookbinding, typography, and unheralded literature.
            </p>
            {subscribed ? (
              <div className="flex items-center gap-2 text-xs font-medium text-[#2A674A] py-2 animate-ink-fade">
                <Check className="w-4 h-4" />
                <span>You are on our subscriber register.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex border border-[#0B0E14] dark:border-[#EFECE6] shadow-xs">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="reader@domain.com"
                  required
                  className="px-3 py-2 text-xs bg-transparent text-[#0D1017] dark:text-[#EFECE6] flex-1 focus:outline-hidden"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#0B0E14] text-[#F7F4EB] dark:bg-[#EFECE6] dark:text-[#0B0E14] hover:bg-[#16284F] dark:hover:bg-[#16284F] dark:hover:text-[#F7F4EB] btn-press transition-colors"
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12 text-xs">
          <div>
            <h4 className="font-semibold uppercase tracking-widest text-[11px] mb-4 text-[#0D1017] dark:text-[#EFECE6] font-mono">
              Editions & Works
            </h4>
            <ul className="space-y-2.5 text-[#5A6273] dark:text-[#8F97A8]">
              <li>
                <button onClick={() => onNavigate('catalog')} className="hover:text-[#16284F] dark:hover:text-[#5A85C4] transition-colors ink-underline-hover">
                  All Printed Catalog
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('catalog')} className="hover:text-[#16284F] dark:hover:text-[#5A85C4] transition-colors ink-underline-hover">
                  Clothbound Classics
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('catalog')} className="hover:text-[#16284F] dark:hover:text-[#5A85C4] transition-colors ink-underline-hover">
                  Fine Typography & Monograph
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('catalog')} className="hover:text-[#16284F] dark:hover:text-[#5A85C4] transition-colors ink-underline-hover">
                  Bilingual Translations
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('catalog')} className="hover:text-[#16284F] dark:hover:text-[#5A85C4] transition-colors ink-underline-hover">
                  Archival Paperbacks
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold uppercase tracking-widest text-[11px] mb-4 text-[#0D1017] dark:text-[#EFECE6] font-mono">
              The Press & Craft
            </h4>
            <ul className="space-y-2.5 text-[#5A6273] dark:text-[#8F97A8]">
              <li>
                <button onClick={() => onNavigate('editorial')} className="hover:text-[#16284F] dark:hover:text-[#5A85C4] transition-colors ink-underline-hover">
                  Essays & Literary Journals
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('editorial')} className="hover:text-[#16284F] dark:hover:text-[#5A85C4] transition-colors ink-underline-hover">
                  Paper Specifications
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('editorial')} className="hover:text-[#16284F] dark:hover:text-[#5A85C4] transition-colors ink-underline-hover">
                  Typography Revival
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('home')} className="hover:text-[#16284F] dark:hover:text-[#5A85C4] transition-colors ink-underline-hover">
                  Author Spotlights
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold uppercase tracking-widest text-[11px] mb-4 text-[#0D1017] dark:text-[#EFECE6] font-mono">
              Reader Services
            </h4>
            <ul className="space-y-2.5 text-[#5A6273] dark:text-[#8F97A8]">
              <li>
                <button onClick={() => onNavigate('account:orders')} className="hover:text-[#16284F] dark:hover:text-[#5A85C4] transition-colors ink-underline-hover">
                  Track Delivery
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('account:wishlist')} className="hover:text-[#16284F] dark:hover:text-[#5A85C4] transition-colors ink-underline-hover">
                  Reading List
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('cart')} className="hover:text-[#16284F] dark:hover:text-[#5A85C4] transition-colors ink-underline-hover">
                  Order Review
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('account')} className="hover:text-[#16284F] dark:hover:text-[#5A85C4] transition-colors ink-underline-hover">
                  Account Preferences
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold uppercase tracking-widest text-[11px] mb-4 text-[#0D1017] dark:text-[#EFECE6] font-mono">
              Bibliographic Care
            </h4>
            <p className="text-xs text-[#5A6273] dark:text-[#8F97A8] leading-relaxed mb-3">
              All Inkora volumes are bound with acid-free adhesives, archival Smyth-sewn signatures, and unbleached Munken bookpapers.
            </p>
            <div className="flex items-center gap-2 text-[10px] uppercase font-mono tracking-wider text-[#16284F] dark:text-[#5A85C4]">
              <span>ISO 9706 Archival Certified</span>
            </div>
          </div>
        </div>

        {/* Copyright & Internationalization Bottom Line */}
        <div className="pt-8 border-t border-[#DFD7C7] dark:border-[#242A38] flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#5A6273] dark:text-[#8F97A8] gap-4">
          <div className="flex items-center gap-2">
            <span className="font-editorial font-bold text-base text-[#0D1017] dark:text-[#EFECE6]">INKORA</span>
            <span>© {new Date().getFullYear()} Inkora Bookstore & Editions. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-6">
            <span className="hover:text-[#0D1017] dark:hover:text-[#EFECE6] cursor-pointer">
              Privacy Protocol
            </span>
            <span className="hover:text-[#0D1017] dark:hover:text-[#EFECE6] cursor-pointer">
              Terms of Patronage
            </span>
            <span className="hover:text-[#0D1017] dark:hover:text-[#EFECE6] cursor-pointer">
              International Delivery
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
