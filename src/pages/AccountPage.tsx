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
    showToast('Delivery address preferences saved');
  };

  const handleCancelOrder = async (orderId: string) => {
    try {
      const res = await api.cancelOrder(orderId);
      setOrders(orders.map((o) => (o.id === orderId ? res.order : o)));
      if (selectedOrder?.id === orderId) {
        setSelectedOrder(res.order);
      }
      showToast('Order cancellation recorded');
    } catch (err: any) {
      showToast(err.message || 'Cannot cancel order', 'error');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'DELIVERED':
        return 'text-[#2A674A] bg-[#2A674A]/10 border-[#2A674A]/30';
      case 'SHIPPING':
      case 'OUT_FOR_DELIVERY':
        return 'text-[#16284F] dark:text-[#5A85C4] bg-[#16284F]/10 dark:bg-[#5A85C4]/15 border-[#16284F]/30 dark:border-[#5A85C4]/30';
      case 'PROCESSING':
      case 'CONFIRMED':
        return 'text-[#B45309] bg-[#B45309]/10 border-[#B45309]/30';
      case 'CANCELLED':
        return 'text-[#8E1F1F] bg-[#8E1F1F]/10 border-[#8E1F1F]/30';
      default:
        return 'text-[#5A6273] dark:text-[#8F97A8] bg-[#5A6273]/10 border-[#5A6273]/30';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-ink-fade">
      {/* Editorial Header */}
      <div className="border-b border-[#DFD7C7] dark:border-[#242A38] pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-[10px] tracking-[0.25em] uppercase text-[#16284F] dark:text-[#5A85C4] font-semibold font-mono">
            Patron Portfolio
          </span>
          <h1 className="font-editorial text-4xl sm:text-5xl text-[#0D1017] dark:text-[#EFECE6] mt-1">
            Library of {user?.username || 'Eleanor Vance'}
          </h1>
          <p className="text-xs text-[#5A6273] dark:text-[#8F97A8] mt-1 font-body-literary">
            Member registered since 2023 · {orders.length} dispatched acquisitions
          </p>
        </div>

        <button
          onClick={logout}
          className="text-xs font-semibold text-[#8E1F1F] hover:underline font-mono btn-press"
        >
          Sign Out of Inkora
        </button>
      </div>

      {/* Tabs & Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Navigation Sidebar */}
        <aside className="lg:col-span-3 border border-[#DFD7C7] dark:border-[#242A38] bg-[#FFFFFF] dark:bg-[#131720] divide-y divide-[#DFD7C7] dark:divide-[#242A38] text-xs shadow-xs rounded-[2px]">
          <button
            onClick={() => setActiveTab('orders')}
            className={`w-full p-4 flex items-center justify-between transition-colors btn-press ${
              activeTab === 'orders'
                ? 'bg-[#EFEAE0]/60 dark:bg-[#1B212D] text-[#16284F] dark:text-[#5A85C4] font-semibold'
                : 'text-[#0D1017] dark:text-[#EFECE6] hover:bg-[#EFEAE0]/30 dark:hover:bg-[#1B212D]/50'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Package className="w-4 h-4" />
              <span>Acquisitions & Orders</span>
            </div>
            <span className="font-mono text-[10px]">{orders.length}</span>
          </button>

          <button
            onClick={() => setActiveTab('wishlist')}
            className={`w-full p-4 flex items-center justify-between transition-colors btn-press ${
              activeTab === 'wishlist'
                ? 'bg-[#EFEAE0]/60 dark:bg-[#1B212D] text-[#16284F] dark:text-[#5A85C4] font-semibold'
                : 'text-[#0D1017] dark:text-[#EFECE6] hover:bg-[#EFEAE0]/30 dark:hover:bg-[#1B212D]/50'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Heart className="w-4 h-4" />
              <span>Saved Reading List</span>
            </div>
            <span className="font-mono text-[10px]">{wishlistBooks.length}</span>
          </button>

          <button
            onClick={() => setActiveTab('addresses')}
            className={`w-full p-4 flex items-center justify-between transition-colors btn-press ${
              activeTab === 'addresses'
                ? 'bg-[#EFEAE0]/60 dark:bg-[#1B212D] text-[#16284F] dark:text-[#5A85C4] font-semibold'
                : 'text-[#0D1017] dark:text-[#EFECE6] hover:bg-[#EFEAE0]/30 dark:hover:bg-[#1B212D]/50'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <MapPin className="w-4 h-4" />
              <span>Delivery Addresses</span>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`w-full p-4 flex items-center justify-between transition-colors btn-press ${
              activeTab === 'security'
                ? 'bg-[#EFEAE0]/60 dark:bg-[#1B212D] text-[#16284F] dark:text-[#5A85C4] font-semibold'
                : 'text-[#0D1017] dark:text-[#EFECE6] hover:bg-[#EFEAE0]/30 dark:hover:bg-[#1B212D]/50'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Shield className="w-4 h-4" />
              <span>Account & Security</span>
            </div>
          </button>
        </aside>

        {/* Content Pane */}
        <main className="lg:col-span-9 space-y-6">
          {/* TAB 1: ORDERS */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              <div className="border border-[#DFD7C7] dark:border-[#242A38] bg-[#FFFFFF] dark:bg-[#131720] p-6 shadow-xs rounded-[2px]">
                <h3 className="font-editorial text-2xl text-[#0D1017] dark:text-[#EFECE6] mb-4">
                  Order History & Carrier Tracking
                </h3>

                {orders.length === 0 ? (
                  <p className="text-xs text-[#5A6273] dark:text-[#8F97A8]">
                    No past acquisitions recorded under this patron account.
                  </p>
                ) : (
                  <div className="divide-y divide-[#DFD7C7] dark:divide-[#242A38]">
                    {orders.map((order) => (
                      <div key={order.id} className="py-5 first:pt-0 space-y-3">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                          <div>
                            <span className="font-mono font-semibold text-sm text-[#0D1017] dark:text-[#EFECE6]">
                              {order.orderNumber}
                            </span>
                            <span className="text-[#5A6273] dark:text-[#8F97A8] ml-2">
                              Ordered {new Date(order.createdAt).toLocaleDateString()}
                            </span>
                          </div>

                          <div className="flex items-center gap-3">
                            <span
                              className={`px-2.5 py-0.5 border text-[10px] font-mono tracking-wider font-semibold uppercase ${getStatusBadge(
                                order.status
                              )}`}
                            >
                              {order.status}
                            </span>
                            <span className="font-semibold text-sm text-[#0D1017] dark:text-[#EFECE6] font-mono">
                              ${order.totalAmount.toFixed(2)}
                            </span>
                          </div>
                        </div>

                        {/* Order Items Thumbnails */}
                        <div className="flex flex-wrap items-center gap-3 pt-2">
                          {order.items.map((it, idx) => (
                            <div
                              key={idx}
                              className="flex items-center gap-2 p-2 border border-[#DFD7C7] dark:border-[#242A38] bg-[#F7F4EB] dark:bg-[#181D28] text-xs rounded-[1px]"
                            >
                              <img
                                src={it.coverImage}
                                alt={it.bookTitle}
                                className="w-8 h-11 object-cover rounded-[1px]"
                              />
                              <span className="truncate max-w-40 font-medium text-[#0D1017] dark:text-[#EFECE6]">
                                {it.bookTitle}
                              </span>
                              <span className="text-[10px] text-[#5A6273] dark:text-[#8F97A8]">×{it.quantity}</span>
                            </div>
                          ))}
                        </div>

                        {/* Order Actions */}
                        <div className="flex items-center justify-between pt-2 text-xs font-mono">
                          <span className="text-[#5A6273] dark:text-[#8F97A8]">
                            Destination: {order.shippingDetails?.city}, {order.shippingDetails?.country}
                          </span>

                          <div className="flex items-center gap-2">
                            {order.status === 'PENDING' && (
                              <button
                                onClick={() => handleCancelOrder(order.id)}
                                className="text-xs text-[#8E1F1F] hover:underline btn-press"
                              >
                                Cancel Order
                              </button>
                            )}
                            <button
                              onClick={() => setSelectedOrder(order)}
                              className="text-xs font-semibold text-[#16284F] dark:text-[#5A85C4] hover:underline btn-press"
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
            <div className="border border-[#DFD7C7] dark:border-[#242A38] bg-[#FFFFFF] dark:bg-[#131720] p-6 space-y-6 shadow-xs rounded-[2px]">
              <h3 className="font-editorial text-2xl text-[#0D1017] dark:text-[#EFECE6]">
                Saved Reading List ({wishlistBooks.length})
              </h3>

              {wishlistBooks.length === 0 ? (
                <p className="text-xs text-[#5A6273] dark:text-[#8F97A8]">
                  You have no saved volumes. Browse the catalog to curate your personal library wishlist.
                </p>
              ) : (
                <div className="divide-y divide-[#DFD7C7] dark:divide-[#242A38]">
                  {wishlistBooks.map((b) => (
                    <div key={b.id} className="py-4 first:pt-0 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <img
                          src={b.coverImage}
                          alt={b.bookTitle}
                          className="w-14 h-20 object-cover border border-[#DFD7C7] dark:border-[#242A38] rounded-[1px]"
                        />
                        <div>
                          <h4
                            onClick={() => onNavigate(`book:${b.id}`)}
                            className="font-editorial text-lg text-[#0D1017] dark:text-[#EFECE6] hover:text-[#16284F] dark:hover:text-[#5A85C4] cursor-pointer"
                          >
                            {b.bookTitle}
                          </h4>
                          <p className="text-xs text-[#5A6273] dark:text-[#8F97A8]">
                            by {b.authorName} · {b.coverType}
                          </p>
                          <p className="text-xs font-semibold text-[#0D1017] dark:text-[#EFECE6] mt-1 font-mono">
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
                          className="px-4 py-2 bg-[#16284F] dark:bg-[#5A85C4] text-[#F7F4EB] text-xs font-semibold uppercase tracking-wider hover:bg-[#0E1A33] dark:hover:bg-[#729BD4] transition-colors btn-press shadow-2xs rounded-[1px]"
                        >
                          Move to Bag
                        </button>
                        <button
                          onClick={() => toggleWishlist(b)}
                          className="p-2 text-[#5A6273] hover:text-[#8E1F1F] transition-colors btn-press"
                          title="Remove from list"
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
            <div className="border border-[#DFD7C7] dark:border-[#242A38] bg-[#FFFFFF] dark:bg-[#131720] p-6 space-y-6 shadow-xs rounded-[2px]">
              <h3 className="font-editorial text-2xl text-[#0D1017] dark:text-[#EFECE6]">
                Default Shipping & Delivery Locations
              </h3>

              <form onSubmit={handleSaveAddress} className="space-y-4 max-w-lg text-xs font-mono">
                <div>
                  <label className="text-[11px] uppercase tracking-wider font-semibold text-[#0D1017] dark:text-[#EFECE6] block mb-1">
                    Street Address & Suite
                  </label>
                  <input
                    type="text"
                    value={addressState.street}
                    onChange={(e) => setAddressState({ ...addressState, street: e.target.value })}
                    className="w-full px-3 py-2 border border-[#DFD7C7] dark:border-[#242A38] bg-transparent text-[#0D1017] dark:text-[#EFECE6]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] uppercase tracking-wider font-semibold text-[#0D1017] dark:text-[#EFECE6] block mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      value={addressState.city}
                      onChange={(e) => setAddressState({ ...addressState, city: e.target.value })}
                      className="w-full px-3 py-2 border border-[#DFD7C7] dark:border-[#242A38] bg-transparent text-[#0D1017] dark:text-[#EFECE6]"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] uppercase tracking-wider font-semibold text-[#0D1017] dark:text-[#EFECE6] block mb-1">
                      Postal Code
                    </label>
                    <input
                      type="text"
                      value={addressState.postalCode}
                      onChange={(e) => setAddressState({ ...addressState, postalCode: e.target.value })}
                      className="w-full px-3 py-2 border border-[#DFD7C7] dark:border-[#242A38] bg-transparent text-[#0D1017] dark:text-[#EFECE6]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] uppercase tracking-wider font-semibold text-[#0D1017] dark:text-[#EFECE6] block mb-1">
                    Contact Phone
                  </label>
                  <input
                    type="tel"
                    value={addressState.phone}
                    onChange={(e) => setAddressState({ ...addressState, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-[#DFD7C7] dark:border-[#242A38] bg-transparent text-[#0D1017] dark:text-[#EFECE6]"
                  />
                </div>

                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#16284F] dark:bg-[#5A85C4] text-[#F7F4EB] text-xs font-semibold uppercase tracking-wider hover:bg-[#0E1A33] dark:hover:bg-[#729BD4] transition-colors btn-press shadow-2xs"
                >
                  Update Address
                </button>
              </form>
            </div>
          )}

          {/* TAB 4: SECURITY */}
          {activeTab === 'security' && (
            <div className="border border-[#DFD7C7] dark:border-[#242A38] bg-[#FFFFFF] dark:bg-[#131720] p-6 space-y-6 shadow-xs rounded-[2px]">
              <h3 className="font-editorial text-2xl text-[#0D1017] dark:text-[#EFECE6]">
                Patron Security & Access
              </h3>
              <p className="text-xs text-[#5A6273] dark:text-[#8F97A8]">
                Update your account password and authentication keys.
              </p>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  showToast('Security credentials updated');
                }}
                className="space-y-4 max-w-sm text-xs font-mono"
              >
                <div>
                  <label className="text-[11px] uppercase tracking-wider font-semibold text-[#0D1017] dark:text-[#EFECE6] block mb-1">
                    Current Password
                  </label>
                  <input
                    type="password"
                    defaultValue="••••••••"
                    className="w-full px-3 py-2 border border-[#DFD7C7] dark:border-[#242A38] bg-transparent text-[#0D1017] dark:text-[#EFECE6]"
                  />
                </div>

                <div>
                  <label className="text-[11px] uppercase tracking-wider font-semibold text-[#0D1017] dark:text-[#EFECE6] block mb-1">
                    New Master Password
                  </label>
                  <input
                    type="password"
                    placeholder="Min 8 characters"
                    className="w-full px-3 py-2 border border-[#DFD7C7] dark:border-[#242A38] bg-transparent text-[#0D1017] dark:text-[#EFECE6]"
                  />
                </div>

                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#16284F] dark:bg-[#5A85C4] text-[#F7F4EB] text-xs font-semibold uppercase tracking-wider hover:bg-[#0E1A33] dark:hover:bg-[#729BD4] transition-colors btn-press shadow-2xs"
                >
                  Update Password
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
          <div className="relative w-full max-w-2xl bg-[#FFFFFF] dark:bg-[#131720] border border-[#DFD7C7] dark:border-[#242A38] shadow-2xl p-6 sm:p-8 space-y-6 z-10 animate-in fade-in rounded-[2px]">
            <div className="flex items-center justify-between border-b border-[#DFD7C7] dark:border-[#242A38] pb-4">
              <div>
                <span className="text-[10px] uppercase font-mono tracking-widest text-[#16284F] dark:text-[#5A85C4] font-semibold">
                  Dispatch Dossier
                </span>
                <h3 className="font-editorial text-2xl text-[#0D1017] dark:text-[#EFECE6]">
                  {selectedOrder.orderNumber}
                </h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-xs uppercase tracking-wider font-semibold text-[#5A6273] hover:text-[#0D1017] dark:hover:text-[#EFECE6] font-mono btn-press"
              >
                Close
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs font-mono">
              <div>
                <span className="text-[#5A6273] dark:text-[#8F97A8] block">Order Date</span>
                <span className="font-medium text-[#0D1017] dark:text-[#EFECE6]">
                  {new Date(selectedOrder.createdAt).toLocaleString()}
                </span>
              </div>
              <div>
                <span className="text-[#5A6273] dark:text-[#8F97A8] block">Status</span>
                <span
                  className={`inline-block px-2 py-0.5 border text-[10px] font-mono uppercase font-semibold ${getStatusBadge(
                    selectedOrder.status
                  )}`}
                >
                  {selectedOrder.status}
                </span>
              </div>
            </div>

            {/* Items */}
            <div className="border border-[#DFD7C7] dark:border-[#242A38] divide-y divide-[#DFD7C7] dark:divide-[#242A38]">
              {selectedOrder.items.map((it, idx) => (
                <div key={idx} className="p-3 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <img src={it.coverImage} alt={it.bookTitle} className="w-10 h-14 object-cover border border-[#DFD7C7] dark:border-[#242A38] rounded-[1px]" />
                    <div>
                      <p className="font-editorial text-base text-[#0D1017] dark:text-[#EFECE6]">
                        {it.bookTitle}
                      </p>
                      <p className="text-[11px] text-[#5A6273] dark:text-[#8F97A8]">by {it.authorName} × {it.quantity}</p>
                    </div>
                  </div>
                  <span className="font-semibold text-[#0D1017] dark:text-[#EFECE6] font-mono">
                    ${(it.price * it.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center text-sm font-semibold text-[#0D1017] dark:text-[#EFECE6] font-mono">
              <span>Final Total Settled</span>
              <span>${selectedOrder.totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
