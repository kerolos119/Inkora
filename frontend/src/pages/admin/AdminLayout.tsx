import React, { useState } from 'react';
import {
  LayoutDashboard,
  BookOpen,
  ShoppingBag,
  Users,
  Layers,
  Feather,
  MessageSquare,
  FileText,
  Newspaper,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  LogOut,
} from 'lucide-react';
import { ThemeToggle } from '../../components/common/ThemeToggle.js';
import { LanguageToggle } from '../../components/common/LanguageToggle';
import { t } from '../../i18n';
import { Truck } from 'lucide-react';

interface AdminLayoutProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  onLogout: () => void;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  currentTab,
  onTabChange,
  onLogout,
  children,
}) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const menuItems = [
    { id: 'overview', label: 'Executive Overview', icon: LayoutDashboard },
    { id: 'books', label: 'Books & Editions', icon: BookOpen },
    { id: 'orders', label: 'Orders & Dispatch', icon: ShoppingBag },
    { id: 'customers', label: 'Patrons & Customers', icon: Users },
    { id: 'categories', label: 'Categories & Taxonomy', icon: Layers },
    { id: 'authors', label: 'Authors in Residence', icon: Feather },
    { id: 'reviews', label: 'Reviews Moderation', icon: MessageSquare },
    { id: 'posts', label: 'Journal Posts', icon: FileText },
    { id: 'news', label: 'News & Announcements', icon: Newspaper },
    { id: 'shipping', label: 'Shipping Fee', icon: Truck}
  ];

  return (
    <div className="admin-shell min-h-screen bg-[#FAF6EC] dark:bg-[#120F0B] text-[#3B2B1E] dark:text-[#F3ECDD] flex flex-col">
      {/* Top Admin Bar */}
      <header className="h-20 border-b border-[#E3D6BC] dark:border-[#4A3E2E] bg-[#FAF6EC] dark:bg-[#2A231B] px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-1.5 lg:hidden text-[#65513F] hover:text-[#3B2B1E] btn-press"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2.5 select-none group">
            <div className="w-7 h-7 bg-[#3B2B1E] dark:bg-[#8A6238] text-[#FAF6EC] flex items-center justify-center shadow-xs">
              <svg className="w-4 h-4 text-[#FAF6EC]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m12 2 4 7-4 13-4-13 4-7z"/>
                <circle cx="12" cy="11" r="1.5" fill="currentColor"/>
              </svg>
            </div>
            <span className="font-editorial text-2xl font-semibold tracking-wider text-[#3B2B1E] dark:text-[#F3ECDD]">
              INKORA
            </span>
            <span className="text-xs uppercase font-mono px-1.5 py-0.5 bg-[#8A6238] text-[#F3ECDD] tracking-widest ms-1">
              {t('admin.title')}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <LanguageToggle />
          <ThemeToggle />
          <button
            onClick={onLogout}
            className="flex items-center gap-2 text-sm text-[#8E1F1F] hover:bg-[#8E1F1F]/10 transition-colors font-semibold border border-[#8E1F1F]/40 px-3 py-1.5 btn-press"
          >
            <LogOut className="w-4 h-4 rtl:-scale-x-100" />
            <span>{t('admin.signOut')}</span>
          </button>
        </div>
      </header>

      <div className="flex-1 flex">
        {/* Desktop Collapsible Sidebar */}
        <aside
          className={`hidden lg:flex flex-col border-r border-[#E3D6BC] dark:border-[#4A3E2E] bg-[#FAF6EC] dark:bg-[#2A231B] transition-all duration-300 ${
            collapsed ? 'w-18' : 'w-64'
          }`}
        >
          <div className="p-3 border-b border-[#E3D6BC] dark:border-[#4A3E2E] flex justify-end">
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="p-1.5 text-[#65513F] hover:text-[#3B2B1E] dark:hover:text-[#F3ECDD] transition-colors btn-press"
              title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {collapsed ? <ChevronRight className="rtl:-scale-x-100 w-4 h-4" /> : <ChevronLeft className="rtl:-scale-x-100 w-4 h-4" />}
            </button>
          </div>

          <nav className="flex-1 p-3 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  title={collapsed ? item.label : undefined}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 text-xs font-mono font-semibold transition-all cursor-pointer btn-press ${
                    isActive
                      ? 'bg-[#F1E9D6] dark:bg-[#2F261B] text-[#8A6238] dark:text-[#D9AE6B] border-l-2 border-[#8A6238] dark:border-[#D9AE6B]'
                      : 'text-[#65513F] dark:text-[#A99A82] hover:text-[#3B2B1E] dark:hover:text-[#F3ECDD] hover:bg-[#F1E9D6]/50'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#8A6238] dark:text-[#D9AE6B]' : ''}`} />
                  {!collapsed && <span className="truncate">{item.label}</span>}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Mobile Sidebar Drawer */}
        {mobileOpen && (
          <div className="fixed inset-0 z-50 flex lg:hidden">
            <div className="fixed inset-0 bg-black/60" onClick={() => setMobileOpen(false)} />
            <div className="relative w-64 bg-[#FAF6EC] dark:bg-[#2A231B] h-full p-4 space-y-4 shadow-xl animate-in slide-in-from-left duration-250">
              <div className="flex items-center justify-between border-b border-[#E3D6BC] dark:border-[#4A3E2E] pb-3">
                <span className="font-editorial text-xl">Admin Navigation</span>
                <button onClick={() => setMobileOpen(false)} className="p-1 text-[#65513F]">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-1 text-xs font-mono">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        onTabChange(item.id);
                        setMobileOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 ${
                        currentTab === item.id
                          ? 'bg-[#F1E9D6] dark:bg-[#2F261B] text-[#8A6238] font-semibold'
                          : 'text-[#65513F]'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Main Workspace Area with Ink Fade Animation */}
        <main className="flex-1 p-6 sm:p-10 max-w-7xl mx-auto w-full overflow-x-hidden">
          <div key={currentTab} className="animate-ink-fade">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
