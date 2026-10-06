import { t } from '../i18n';
import React, { useState, useEffect } from 'react';
import {
  Package,
  Heart,
  MapPin,
  Shield,
  User as UserIcon,
  ShoppingBag,
  Clock,
  CheckCircle,
  Truck,
  XCircle,
  ChevronRight,
  Trash2,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.js';
import { useWishlist } from '../context/WishlistContext.js';
import { useCart } from '../context/CartContext.js';
import { useToast } from '../context/ToastContext.js';
import { api } from '../services/api.js';
import { Order, Book } from '../types/index.js';

interface AccountPageProps {
  initialTab?: string;
  onNavigate: (page: string) => void;
  onQuickView: (book: Book) => void;
}

export const AccountPage: React.FC<AccountPageProps> = ({
  initialTab = 'orders',
  onNavigate,
  onQuickView,
}) => {
  const { user, logout } = useAuth();
  const { wishlistIds, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState(initialTab.replace('account:', ''));
  const [orders, setOrders] = useState<Order[]>([]);
  const [wishlistBooks, setWishlistBooks] = useState<Book[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Address edit state
  const [addressState, setAddressState] = useState({
    street: user?.address || '742 Evergreen Terrace, Apt 4B',
    city: 'Portland',
    state: 'OR',
    postalCode: '97201',
    phone: user?.phoneNumber || '+1 (555) 234-5678',
  });

  useEffect(() => {
    api.getMyOrders().then(setOrders).catch(console.error);

    api.getBooks().then((all) => {
      const saved = all.filter((b) => wishlistIds.includes(b.id));
      setWishlistBooks(saved);
    });
  }, [wishlistIds]);

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    showToast(t('acct.addrOk'));
  };

  const handleCancelOrder = async (orderId: string) => {
    try {
      const res = await api.cancelOrder(orderId);
      setOrders(orders.map((o) => (o.id === orderId ? res.order : o)));
      if (selectedOrder?.id === orderId) {
        setSelectedOrder(res.order);
      }
      showToast(t('acct.cancelOk'));
    } catch (err: any) {
      showToast(t('acct.cancelFail'), 'error');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'DELIVERED':
        return 'text-[#2A674A] bg-[#2A674A]/10 border-[#2A674A]/30';
      case 'SHIPPING':
      case 'OUT_FOR_DELIVERY':
        return 'text-[#8A6238] dark:text-[#D9AE6B] bg-[#8A6238]/10 dark:bg-[#D9AE6B]/15 border-[#8A6238]/30 dark:border-[#D9AE6B]/30';
      case 'PROCESSING':
      case 'CONFIRMED':
        return 'text-[#B45309] bg-[#B45309]/10 border-[#B45309]/30';
      case 'CANCELLED':
        return 'text-[#8E1F1F] bg-[#8E1F1F]/10 border-[#8E1F1F]/30';
      default:
        return 'text-[#7A6652] dark:text-[#A99A82] bg-[#7A6652]/10 border-[#7A6652]/30';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-ink-fade">
      {/* Editorial Header */}
      <div className="border-b border-[#E3D6BC] dark:border-[#4A3E2E] pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-xs tracking-[0.25em] uppercase text-[#8A6238] dark:text-[#D9AE6B] font-semibold font-mono">
            {t('ac.title')}
          </span>
          <h1 className="font-editorial text-4xl sm:text-5xl text-[#3B2B1E] dark:text-[#F3ECDD] mt-1">
            Library of {user?.username || 'Eleanor Vance'}
          </h1>
          <p className="text-xs text-[#7A6652] dark:text-[#A99A82] mt-1 font-body-literary">
            Member registered since 2023 · {orders.length} dispatched acquisitions
          </p>
        </div>

        <button
          onClick={logout}
          className="text-xs font-semibold text-[#8E1F1F] hover:underline font-mono btn-press"
        >
          {t('ac.out')}
        </button>
      </div>

      {/* Tabs & Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Navigation Sidebar */}
        <aside className="lg:col-span-3 border border-[#E3D6BC] dark:border-[#4A3E2E] bg-[#FFFFFF] dark:bg-[#2A231B] divide-y divide-[#E3D6BC] dark:divide-[#4A3E2E] text-xs shadow-xs rounded-[2px]">
          <button
            onClick={() => setActiveTab('orders')}
            className={`w-full p-4 flex items-center justify-between transition-colors btn-press ${
              activeTab === 'orders'
                ? 'bg-[#F1E9D6]/60 dark:bg-[#2E251A] text-[#8A6238] dark:text-[#D9AE6B] font-semibold'
                : 'text-[#3B2B1E] dark:text-[#F3ECDD] hover:bg-[#F1E9D6]/30 dark:hover:bg-[#2E251A]/50'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Package className="w-4 h-4" />
              <span>{t('ac.orders')}</span>
            </div>
            <span className="font-mono text-xs">{orders.length}</span>
          </button>

          <button
            onClick={() => setActiveTab('wishlist')}
            className={`w-full p-4 flex items-center justify-between transition-colors btn-press ${
              activeTab === 'wishlist'
                ? 'bg-[#F1E9D6]/60 dark:bg-[#2E251A] text-[#8A6238] dark:text-[#D9AE6B] font-semibold'
                : 'text-[#3B2B1E] dark:text-[#F3ECDD] hover:bg-[#F1E9D6]/30 dark:hover:bg-[#2E251A]/50'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Heart className="w-4 h-4" />
              <span>{t('ac.wish')}</span>
            </div>
            <span className="font-mono text-xs">{wishlistBooks.length}</span>
          </button>

          <button
            onClick={() => setActiveTab('addresses')}
            className={`w-full p-4 flex items-center justify-between transition-colors btn-press ${
              activeTab === 'addresses'
                ? 'bg-[#F1E9D6]/60 dark:bg-[#2E251A] text-[#8A6238] dark:text-[#D9AE6B] font-semibold'
                : 'text-[#3B2B1E] dark:text-[#F3ECDD] hover:bg-[#F1E9D6]/30 dark:hover:bg-[#2E251A]/50'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <MapPin className="w-4 h-4" />
              <span>{t('co.shipTo')}</span>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`w-full p-4 flex items-center justify-between transition-colors btn-press ${
              activeTab === 'security'
                ? 'bg-[#F1E9D6]/60 dark:bg-[#2E251A] text-[#8A6238] dark:text-[#D9AE6B] font-semibold'
                : 'text-[#3B2B1E] dark:text-[#F3ECDD] hover:bg-[#F1E9D6]/30 dark:hover:bg-[#2E251A]/50'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Shield className="w-4 h-4" />
              <span>{t('ac.sec')}</span>
            </div>
          </button>
        </aside>

        {/* Content Pane */}
        <main className="lg:col-span-9 space-y-6">
          {/* TAB 1: ORDERS */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              <div className="border border-[#E3D6BC] dark:border-[#4A3E2E] bg-[#FFFFFF] dark:bg-[#2A231B] p-6 shadow-xs rounded-[2px]">
                <h3 className="font-editorial text-2xl text-[#3B2B1E] dark:text-[#F3ECDD] mb-4">
                  {t('ac.hist')}
                </h3>

                {orders.length === 0 ? (
                  <p className="text-xs text-[#7A6652] dark:text-[#A99A82]">
                    {t('ac.noOrders')}
                  </p>
                ) : (
                  <div className="divide-y divide-[#E3D6BC] dark:divide-[#4A3E2E]">
                    {orders.map((order) => (
                      <div key={order.id} className="py-5 first:pt-0 space-y-3">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                          <div>
                            <span className="font-mono font-semibold text-sm text-[#3B2B1E] dark:text-[#F3ECDD]">
                              {order.orderNumber}
                            </span>
                            <span className="text-[#7A6652] dark:text-[#A99A82] ms-2">
                              Ordered {new Date(order.createdAt).toLocaleDateString()}
                            </span>
                          </div>

                          <div className="flex items-center gap-3">
                            <span
                              className={`px-2.5 py-0.5 border text-xs font-mono tracking-wider font-semibold uppercase ${getStatusBadge(
                                order.status
                              )}`}
                            >
                              {order.status}
                            </span>
                            <span className="font-semibold text-sm text-[#3B2B1E] dark:text-[#F3ECDD] font-mono">
                              ${order.totalAmount.toFixed(2)}
                            </span>
                          </div>
                        </div>

                        {/* Order Items Thumbnails */}
                        <div className="flex flex-wrap items-center gap-3 pt-2">
                          {order.items.map((it, idx) => (
                            <div
                              key={idx}
                              className="flex items-center gap-2 p-2 border border-[#E3D6BC] dark:border-[#4A3E2E] bg-[#FAF6EC] dark:bg-[#292117] text-xs rounded-[1px]"
                            >
                              <img
                                src={it.coverImage}
                                alt={it.bookTitle}
                                className="w-8 h-11 object-cover rounded-[1px]"
                              />
                              <span className="truncate max-w-40 font-medium text-[#3B2B1E] dark:text-[#F3ECDD]">
                                {it.bookTitle}
                              </span>
                              <span className="text-xs text-[#7A6652] dark:text-[#A99A82]">×{it.quantity}</span>
                            </div>
                          ))}
                        </div>

                        {/* Order Actions */}
                        <div className="flex items-center justify-between pt-2 text-xs font-mono">
                          <span className="text-[#7A6652] dark:text-[#A99A82]">
                            Destination: {order.shippingDetails?.city}, {order.shippingDetails?.country}
                          </span>

                          <div className="flex items-center gap-2">
                            {order.status === 'PENDING' && (
                              <button
                                onClick={() => handleCancelOrder(order.id)}
                                className="text-xs text-[#8E1F1F] hover:underline btn-press"
                              >
                                {t('ac.cancel')}
                              </button>
                            )}
                            <button
                              onClick={() => setSelectedOrder(order)}
                              className="text-xs font-semibold text-[#8A6238] dark:text-[#D9AE6B] hover:underline btn-press"
                            >
                              View Dispatch Dossier →
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: WISHLIST */}
          {activeTab === 'wishlist' && (
            <div className="border border-[#E3D6BC] dark:border-[#4A3E2E] bg-[#FFFFFF] dark:bg-[#2A231B] p-6 space-y-6 shadow-xs rounded-[2px]">
              <h3 className="font-editorial text-2xl text-[#3B2B1E] dark:text-[#F3ECDD]">
                Saved Reading List ({wishlistBooks.length})
              </h3>

              {wishlistBooks.length === 0 ? (
                <p className="text-xs text-[#7A6652] dark:text-[#A99A82]">
                  {t('ac.noWish')}
                </p>
              ) : (
                <div className="divide-y divide-[#E3D6BC] dark:divide-[#4A3E2E]">
                  {wishlistBooks.map((b) => (
                    <div key={b.id} className="py-4 first:pt-0 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <img
                          src={b.coverImage}
                          alt={b.bookTitle}
                          className="w-14 h-20 object-cover border border-[#E3D6BC] dark:border-[#4A3E2E] rounded-[1px]"
                        />
                        <div>
                          <h4
                            onClick={() => onNavigate(`book:${b.id}`)}
                            className="font-editorial text-lg text-[#3B2B1E] dark:text-[#F3ECDD] hover:text-[#8A6238] dark:hover:text-[#D9AE6B] cursor-pointer"
                          >
                            {b.bookTitle}
                          </h4>
                          <p className="text-xs text-[#7A6652] dark:text-[#A99A82]">
                            by {b.authorName} · {b.coverType}
                          </p>
                          <p className="text-xs font-semibold text-[#3B2B1E] dark:text-[#F3ECDD] mt-1 font-mono">
                            ${b.price.toFixed(2)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 font-mono">
                        <button
                          onClick={() => {
                            addToCart(b);
                            toggleWishlist(b);
                          }}
                          className="px-4 py-2 bg-[#8A6238] dark:bg-[#D9AE6B] text-[#FAF6EC] text-xs font-semibold uppercase tracking-wider hover:bg-[#6F4D2B] dark:hover:bg-[#CBA77B] transition-colors btn-press shadow-2xs rounded-[1px]"
                        >
                          {t('ac.move')}
                        </button>
                        <button
                          onClick={() => toggleWishlist(b)}
                          className="p-2 text-[#7A6652] hover:text-[#8E1F1F] transition-colors btn-press"
                          title={t('ac.rm')}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: ADDRESSES */}
          {activeTab === 'addresses' && (
            <div className="border border-[#E3D6BC] dark:border-[#4A3E2E] bg-[#FFFFFF] dark:bg-[#2A231B] p-6 space-y-6 shadow-xs rounded-[2px]">
              <h3 className="font-editorial text-2xl text-[#3B2B1E] dark:text-[#F3ECDD]">
                {t('ac.addrT')}
              </h3>

              <form onSubmit={handleSaveAddress} className="space-y-4 max-w-lg text-xs font-mono">
                <div>
                  <label className="text-[11px] uppercase tracking-wider font-semibold text-[#3B2B1E] dark:text-[#F3ECDD] block mb-1">
                    {t('f.street')}
                  </label>
                  <input
                    type="text"
                    value={addressState.street}
                    onChange={(e) => setAddressState({ ...addressState, street: e.target.value })}
                    className="w-full px-3 py-2 border border-[#E3D6BC] dark:border-[#4A3E2E] bg-transparent text-[#3B2B1E] dark:text-[#F3ECDD]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] uppercase tracking-wider font-semibold text-[#3B2B1E] dark:text-[#F3ECDD] block mb-1">
                      {t('f.city')}
                    </label>
                    <input
                      type="text"
                      value={addressState.city}
                      onChange={(e) => setAddressState({ ...addressState, city: e.target.value })}
                      className="w-full px-3 py-2 border border-[#E3D6BC] dark:border-[#4A3E2E] bg-transparent text-[#3B2B1E] dark:text-[#F3ECDD]"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] uppercase tracking-wider font-semibold text-[#3B2B1E] dark:text-[#F3ECDD] block mb-1">
                      {t('f.zip')}
                    </label>
                    <input
                      type="text"
                      value={addressState.postalCode}
                      onChange={(e) => setAddressState({ ...addressState, postalCode: e.target.value })}
                      className="w-full px-3 py-2 border border-[#E3D6BC] dark:border-[#4A3E2E] bg-transparent text-[#3B2B1E] dark:text-[#F3ECDD]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] uppercase tracking-wider font-semibold text-[#3B2B1E] dark:text-[#F3ECDD] block mb-1">
                    {t('f.phone')}
                  </label>
                  <input
                    type="tel"
                    value={addressState.phone}
                    onChange={(e) => setAddressState({ ...addressState, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-[#E3D6BC] dark:border-[#4A3E2E] bg-transparent text-[#3B2B1E] dark:text-[#F3ECDD]"
                  />
                </div>

                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#8A6238] dark:bg-[#D9AE6B] text-[#FAF6EC] text-xs font-semibold uppercase tracking-wider hover:bg-[#6F4D2B] dark:hover:bg-[#CBA77B] transition-colors btn-press shadow-2xs"
                >
                  {t('ac.saveAddr')}
                </button>
              </form>
            </div>
          )}

          {/* TAB 4: SECURITY */}
          {activeTab === 'security' && (
            <div className="border border-[#E3D6BC] dark:border-[#4A3E2E] bg-[#FFFFFF] dark:bg-[#2A231B] p-6 space-y-6 shadow-xs rounded-[2px]">
              <h3 className="font-editorial text-2xl text-[#3B2B1E] dark:text-[#F3ECDD]">
                {t('ac.passT')}
              </h3>
              <p className="text-xs text-[#7A6652] dark:text-[#A99A82]">
                {t('ac.passH')}
              </p>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  showToast(t('acct.passOk'));
                }}
                className="space-y-4 max-w-sm text-xs font-mono"
              >
                <div>
                  <label className="text-[11px] uppercase tracking-wider font-semibold text-[#3B2B1E] dark:text-[#F3ECDD] block mb-1">
                    {t('f.curPass')}
                  </label>
                  <input
                    type="password"
                    defaultValue="••••••••"
                    className="w-full px-3 py-2 border border-[#E3D6BC] dark:border-[#4A3E2E] bg-transparent text-[#3B2B1E] dark:text-[#F3ECDD]"
                  />
                </div>

                <div>
                  <label className="text-[11px] uppercase tracking-wider font-semibold text-[#3B2B1E] dark:text-[#F3ECDD] block mb-1">
                    {t('f.newPass')}
                  </label>
                  <input
                    type="password"
                    placeholder={t('ph.pass')}
                    className="w-full px-3 py-2 border border-[#E3D6BC] dark:border-[#4A3E2E] bg-transparent text-[#3B2B1E] dark:text-[#F3ECDD]"
                  />
                </div>

                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#8A6238] dark:bg-[#D9AE6B] text-[#FAF6EC] text-xs font-semibold uppercase tracking-wider hover:bg-[#6F4D2B] dark:hover:bg-[#CBA77B] transition-colors btn-press shadow-2xs"
                >
                  {t('ac.savePass')}
                </button>
              </form>
            </div>
          )}
        </main>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => setSelectedOrder(null)}
          />
          <div className="relative w-full max-w-2xl bg-[#FFFFFF] dark:bg-[#2A231B] border border-[#E3D6BC] dark:border-[#4A3E2E] shadow-2xl p-6 sm:p-8 space-y-6 z-10 animate-in fade-in rounded-[2px]">
            <div className="flex items-center justify-between border-b border-[#E3D6BC] dark:border-[#4A3E2E] pb-4">
              <div>
                <span className="text-xs uppercase font-mono tracking-widest text-[#8A6238] dark:text-[#D9AE6B] font-semibold">
                  {t('ac.detail')}
                </span>
                <h3 className="font-editorial text-2xl text-[#3B2B1E] dark:text-[#F3ECDD]">
                  {selectedOrder.orderNumber}
                </h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-xs uppercase tracking-wider font-semibold text-[#7A6652] hover:text-[#3B2B1E] dark:hover:text-[#F3ECDD] font-mono btn-press"
              >
                {t('ac.close')}
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs font-mono">
              <div>
                <span className="text-[#7A6652] dark:text-[#A99A82] block">{t('ac.date')}</span>
                <span className="font-medium text-[#3B2B1E] dark:text-[#F3ECDD]">
                  {new Date(selectedOrder.createdAt).toLocaleString()}
                </span>
              </div>
              <div>
                <span className="text-[#7A6652] dark:text-[#A99A82] block">{t('f.status')}</span>
                <span
                  className={`inline-block px-2 py-0.5 border text-xs font-mono uppercase font-semibold ${getStatusBadge(
                    selectedOrder.status
                  )}`}
                >
                  {selectedOrder.status}
                </span>
              </div>
            </div>

            {/* Items */}
            <div className="border border-[#E3D6BC] dark:border-[#4A3E2E] divide-y divide-[#E3D6BC] dark:divide-[#4A3E2E]">
              {selectedOrder.items.map((it, idx) => (
                <div key={idx} className="p-3 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <img src={it.coverImage} alt={it.bookTitle} className="w-10 h-14 object-cover border border-[#E3D6BC] dark:border-[#4A3E2E] rounded-[1px]" />
                    <div>
                      <p className="font-editorial text-base text-[#3B2B1E] dark:text-[#F3ECDD]">
                        {it.bookTitle}
                      </p>
                      <p className="text-[11px] text-[#7A6652] dark:text-[#A99A82]">by {it.authorName} × {it.quantity}</p>
                    </div>
                  </div>
                  <span className="font-semibold text-[#3B2B1E] dark:text-[#F3ECDD] font-mono">
                    ${(it.price * it.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center text-sm font-semibold text-[#3B2B1E] dark:text-[#F3ECDD] font-mono">
              <span>{t('ac.paid')}</span>
              <span>${selectedOrder.totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
