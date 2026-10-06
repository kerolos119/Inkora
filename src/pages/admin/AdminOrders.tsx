import React, { useState, useEffect } from 'react';
import { Search, Filter, Eye, CheckCircle, Package, Truck, XCircle } from 'lucide-react';
import { Order, OrderStatus } from '../../types/index.js';
import { api } from '../../services/api.js';
import { useToast } from '../../context/ToastContext.js';

export const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const { showToast } = useToast();

  const loadOrders = () => {
    setLoading(true);
    api
      .getAllOrders()
      .then(setOrders)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleStatusChange = async (orderId: string, status: OrderStatus) => {
    try {
      const updated = await api.updateOrderStatus(orderId, status);
      setOrders(orders.map((o) => (o.id === orderId ? updated : o)));
      if (selectedOrder?.id === orderId) {
        setSelectedOrder(updated);
      }
      showToast(`Order status updated to ${status}`);
    } catch (err: any) {
      showToast(err.message || 'Status update failed', 'error');
    }
  };

  const filteredOrders = orders.filter((o) => {
    const matchSearch =
      o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      o.customerName.toLowerCase().includes(search.toLowerCase()) ||
      o.customerEmail.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6">
      <div className="border-b border-[#DFD7C7] dark:border-[#242A38] pb-4 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase font-mono tracking-widest text-[#16284F] dark:text-[#5A85C4] font-semibold">
            Fulfillment & Carrier Operations
          </span>
          <h1 className="font-editorial text-3xl sm:text-4xl text-[#0D1017] dark:text-[#EFECE6] mt-1">
            Dispatch Management & Orders
          </h1>
        </div>
        <button
          onClick={loadOrders}
          className="text-xs text-[#16284F] dark:text-[#5A85C4] font-semibold hover:underline font-mono btn-press"
        >
          Refresh Orders List
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex border border-[#DFD7C7] dark:border-[#242A38] bg-[#FFFFFF] dark:bg-[#131720] w-full sm:w-80 shadow-xs">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by order #, patron or email..."
            className="w-full px-3 py-2 bg-transparent text-[#0D1017] dark:text-[#EFECE6] focus:outline-hidden font-mono"
          />
          <div className="px-3 py-2 text-[#5A6273] dark:text-[#8F97A8]">
            <Search className="w-3.5 h-3.5" />
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto font-mono">
          <span className="text-[#5A6273] dark:text-[#8F97A8]">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-[#DFD7C7] dark:border-[#242A38] bg-[#FFFFFF] dark:bg-[#131720] text-[#0D1017] dark:text-[#EFECE6] focus:outline-hidden cursor-pointer"
          >
            <option value="all">All Statuses ({orders.length})</option>
            <option value="CONFIRMED">CONFIRMED</option>
            <option value="PROCESSING">PROCESSING</option>
            <option value="SHIPPING">SHIPPING</option>
            <option value="OUT_FOR_DELIVERY">OUT_FOR_DELIVERY</option>
            <option value="DELIVERED">DELIVERED</option>
            <option value="CANCELLED">CANCELLED</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="border border-[#DFD7C7] dark:border-[#242A38] bg-[#FFFFFF] dark:bg-[#131720] overflow-x-auto shadow-xs">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-[#DFD7C7] dark:border-[#242A38] text-[#5A6273] dark:text-[#8F97A8] uppercase tracking-wider font-mono text-[10px]">
              <th className="p-3">Order #</th>
              <th className="p-3">Patron</th>
              <th className="p-3">Volumes</th>
              <th className="p-3">Total</th>
              <th className="p-3">Date</th>
              <th className="p-3">Status</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#DFD7C7]/60 dark:divide-[#242A38]/60">
            {filteredOrders.map((order) => (
              <tr key={order.id} className="hover:bg-[#EFEAE0]/40 dark:hover:bg-[#1C212E]/40 transition-colors">
                <td className="p-3 font-mono font-semibold text-[#0D1017] dark:text-[#EFECE6]">
                  {order.orderNumber}
                </td>
                <td className="p-3">
                  <span className="font-medium text-[#0D1017] dark:text-[#EFECE6] block">
                    {order.customerName}
                  </span>
                  <span className="text-[11px] text-[#5A6273] dark:text-[#8F97A8]">{order.customerEmail}</span>
                </td>
                <td className="p-3 font-mono text-[11px]">
                  {order.items.reduce((acc, it) => acc + it.quantity, 0)} items
                </td>
                <td className="p-3 font-semibold text-[#0D1017] dark:text-[#EFECE6] font-mono">
                  ${order.totalAmount.toFixed(2)}
                </td>
                <td className="p-3 text-[#5A6273] dark:text-[#8F97A8] font-mono text-[11px]">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
                <td className="p-3">
                  <select
                    value={order.status}
                    onChange={(e) =>
                      handleStatusChange(order.id, e.target.value as OrderStatus)
                    }
                    className="px-2 py-1 border border-[#DFD7C7] dark:border-[#242A38] bg-[#F7F4EB] dark:bg-[#131720] text-[#0D1017] dark:text-[#EFECE6] text-[11px] font-mono cursor-pointer"
                  >
                    <option value="PENDING">PENDING</option>
                    <option value="CONFIRMED">CONFIRMED</option>
                    <option value="PROCESSING">PROCESSING</option>
                    <option value="SHIPPING">SHIPPING</option>
                    <option value="OUT_FOR_DELIVERY">OUT_FOR_DELIVERY</option>
                    <option value="DELIVERED">DELIVERED</option>
                    <option value="CANCELLED">CANCELLED</option>
                  </select>
                </td>
                <td className="p-3 text-right">
                  <button
                    onClick={() => setSelectedOrder(order)}
                    className="p-1.5 text-[#5A6273] hover:text-[#16284F] dark:hover:text-[#5A85C4] transition-colors btn-press"
                    title="View dossier"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Order Dossier Inspection Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setSelectedOrder(null)} />
          <div className="relative w-full max-w-xl bg-[#FFFFFF] dark:bg-[#131720] border border-[#DFD7C7] dark:border-[#242A38] shadow-2xl p-6 sm:p-8 space-y-6 z-10 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-[#DFD7C7] dark:border-[#242A38] pb-3">
              <div>
                <span className="text-[10px] font-mono text-[#16284F] dark:text-[#5A85C4] uppercase tracking-wider font-semibold">
                  DISPATCH DOSSIER
                </span>
                <h3 className="font-editorial text-2xl text-[#0D1017] dark:text-[#EFECE6]">
                  {selectedOrder.orderNumber}
                </h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-xs font-semibold text-[#5A6273] hover:text-[#0D1017] font-mono btn-press"
              >
                Close
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-[#5A6273] dark:text-[#8F97A8] block font-mono">Customer</span>
                <span className="font-semibold text-[#0D1017] dark:text-[#EFECE6]">
                  {selectedOrder.customerName}
                </span>
                <span className="block text-[11px] text-[#5A6273] dark:text-[#8F97A8]">
                  {selectedOrder.customerEmail}
                </span>
              </div>
              <div>
                <span className="text-[#5A6273] dark:text-[#8F97A8] block font-mono">Carrier Address</span>
                <span className="text-[#0D1017] dark:text-[#EFECE6]">
                  {selectedOrder.shippingDetails.address}, {selectedOrder.shippingDetails.city}
                </span>
              </div>
            </div>

            {/* Items */}
            <div className="border border-[#DFD7C7] dark:border-[#242A38] divide-y divide-[#DFD7C7] dark:divide-[#242A38]">
              {selectedOrder.items.map((it, idx) => (
                <div key={idx} className="p-3 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-medium text-[#0D1017] dark:text-[#EFECE6]">
                      {it.bookTitle}
                    </span>
                    <span className="text-[11px] text-[#5A6273] dark:text-[#8F97A8] ml-2 font-mono">Qty: {it.quantity}</span>
                  </div>
                  <span className="font-semibold text-[#0D1017] dark:text-[#EFECE6] font-mono">
                    ${(it.price * it.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center text-sm font-semibold text-[#0D1017] dark:text-[#EFECE6] pt-2 border-t border-[#DFD7C7] dark:border-[#242A38] font-mono">
              <span>Order Total</span>
              <span>${selectedOrder.totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
