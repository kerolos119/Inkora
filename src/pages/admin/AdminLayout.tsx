import React, { useState } from 'react';
import {
  LayoutDashboard,
  BookOpen,
  ShoppingBag,
  Users,
  Layers,
  Feather,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  ExternalLink,
} from 'lucide-react';
import { ThemeToggle } from '../../components/common/ThemeToggle.js';

interface AdminLayoutProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  onNavigateHome: () => void;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  currentTab,
  onTabChange,
  onNavigateHome,
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
  ];

  return (
    <div className="min-h-screen bg-[#F7F4EB] dark:bg-[#0B0D12] text-[#0D1017] dark:text-[#EFECE6] flex flex-col">
      {/* Top Admin Bar */}
      <header className="h-16 border-b border-[#DFD7C7] dark:border-[#242A38] bg-[#F7F4EB] dark:bg-[#131720] px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-1.5 lg:hidden text-[#5A6273] hover:text-[#0D1017] btn-press"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div
            onClick={onNavigateHome}
            className="flex items-center gap-2.5 cursor-pointer select-none group"
          >
            <div className="w-7 h-7 bg-[#0B0E14] dark:bg-[#16284F] text-[#F7F4EB] flex items-center justify-center shadow-xs">
              <svg className="w-4 h-4 text-[#F7F4EB]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m12 2 4 7-4 13-4-13 4-7z"/>
                <circle cx="12" cy="11" r="1.5" fill="currentColor"/>
              </svg>
            </div>
            <span className="font-editorial text-2xl font-semibold tracking-wider text-[#0D1017] dark:text-[#EFECE6]">
              INKORA
            </span>
            <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 bg-[#16284F] text-[#EFECE6] tracking-widest ml-1">
              ADMIN
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={onNavigateHome}
            className="flex items-center gap-1.5 text-xs text-[#5A6273] hover:text-[#16284F] dark:hover:text-[#5A85C4] transition-colors font-mono font-medium border border-[#DFD7C7] dark:border-[#242A38] px-3 py-1.5 btn-press"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Storefront</span>
          </button>
          <ThemeToggle />
        </div>
      </header>

      <div className="flex-1 flex">
        {/* Desktop Collapsible Sidebar */}
        <aside
          className={`hidden lg:flex flex-col border-r border-[#DFD7C7] dark:border-[#242A38] bg-[#F7F4EB] dark:bg-[#131720] transition-all duration-300 ${
            collapsed ? 'w-18' : 'w-64'
          }`}
        >
          <div className="p-3 border-b border-[#DFD7C7] dark:border-[#242A38] flex justify-end">
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="p-1.5 text-[#5A6273] hover:text-[#0D1017] dark:hover:text-[#EFECE6] transition-colors btn-press"
              title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
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
                      ? 'bg-[#EFEAE0] dark:bg-[#1C212E] text-[#16284F] dark:text-[#5A85C4] border-l-2 border-[#16284F] dark:border-[#5A85C4]'
                      : 'text-[#5A6273] dark:text-[#8F97A8] hover:text-[#0D1017] dark:hover:text-[#EFECE6] hover:bg-[#EFEAE0]/50'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#16284F] dark:text-[#5A85C4]' : ''}`} />
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
            <div className="relative w-64 bg-[#F7F4EB] dark:bg-[#131720] h-full p-4 space-y-4 shadow-xl animate-in slide-in-from-left duration-250">
              <div className="flex items-center justify-between border-b border-[#DFD7C7] dark:border-[#242A38] pb-3">
                <span className="font-editorial text-xl">Admin Navigation</span>
                <button onClick={() => setMobileOpen(false)} className="p-1 text-[#5A6273]">
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
                          ? 'bg-[#EFEAE0] dark:bg-[#1C212E] text-[#16284F] font-semibold'
                          : 'text-[#5A6273]'
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
