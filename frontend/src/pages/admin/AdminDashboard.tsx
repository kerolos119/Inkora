import React, { useState, useEffect } from 'react';
import {
  DollarSign,
  ShoppingBag,
  Users,
  BookOpen,
  AlertTriangle,
  TrendingUp,
  ArrowUpRight,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import { api } from '../../services/api.js';
import { Order, Book, OrderStatus } from '../../types/index.js';
import { useToast } from '../../context/ToastContext.js';

interface AdminDashboardProps {
  onNavigateTab: (tab: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigateTab }) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  const fetchStats = () => {
    setLoading(true);
    api
      .getAdminDashboard()
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleUpdateStatus = async (orderId: string, status: OrderStatus) => {
    try {
      await api.updateOrderStatus(orderId, status);
      showToast(`Order status updated to ${status}`);
      fetchStats();
    } catch (err: any) {
      showToast(err.message || 'Update failed', 'error');
    }
  };

  if (loading || !data) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-[#E8E2D9] dark:bg-[#2C2825] w-64" />
        <div className="grid grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 bg-[#E8E2D9]/60 dark:bg-[#2C2825]/60" />
          ))}
        </div>
      </div>
    );
  }

  const maxRevenue = Math.max(...data.revenueTrends.map((t: any) => t.revenue));

  return (
    <div className="space-y-10">
      {/* Title */}
      <div className="border-b border-[#E3D6BC] dark:border-[#4A3E2E] pb-4 flex items-end justify-between">
        <div>
          <span className="text-xs uppercase font-mono tracking-widest text-[#8A6238] dark:text-[#D9AE6B] font-semibold">
            Store Executive Command
          </span>
          <h1 className="font-editorial text-3xl sm:text-4xl text-[#3B2B1E] dark:text-[#F3ECDD] mt-1">
            Publishing Operations & Performance
          </h1>
        </div>
        <button
          onClick={fetchStats}
          className="text-xs text-[#8A6238] dark:text-[#D9AE6B] font-semibold hover:underline font-mono btn-press"
        >
          Refresh Realtime Metrics
        </button>
      </div>

      {/* KPI Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="p-5 border border-[#E3D6BC] dark:border-[#4A3E2E] bg-[#FFFFFF] dark:bg-[#2A231B] shadow-xs">
          <span className="text-[11px] font-mono text-[#7A6652] dark:text-[#A99A82] uppercase block">
            Net Revenue
          </span>
          <div className="font-editorial text-3xl font-semibold text-[#3B2B1E] dark:text-[#F3ECDD] mt-1">
            ${data.totalRevenue.toLocaleString()}
          </div>
          <span className="text-xs text-[#2A674A] font-mono mt-2 block">
            +14.2% vs previous quarter
          </span>
        </div>

        <div className="p-5 border border-[#E3D6BC] dark:border-[#4A3E2E] bg-[#FFFFFF] dark:bg-[#2A231B] shadow-xs">
          <span className="text-[11px] font-mono text-[#7A6652] dark:text-[#A99A82] uppercase block">
            Total Orders
          </span>
          <div className="font-editorial text-3xl font-semibold text-[#3B2B1E] dark:text-[#F3ECDD] mt-1">
            {data.totalOrders}
          </div>
          <span className="text-xs text-[#7A6652] dark:text-[#A99A82] font-mono mt-2 block">
            Across 14 jurisdictions
          </span>
        </div>

        <div className="p-5 border border-[#E3D6BC] dark:border-[#4A3E2E] bg-[#FFFFFF] dark:bg-[#2A231B] shadow-xs">
          <span className="text-[11px] font-mono text-[#7A6652] dark:text-[#A99A82] uppercase block">
            Registered Patrons
          </span>
          <div className="font-editorial text-3xl font-semibold text-[#3B2B1E] dark:text-[#F3ECDD] mt-1">
            {data.totalCustomers}
          </div>
          <span className="text-xs text-[#2A674A] font-mono mt-2 block">
            Active collector community
          </span>
        </div>

        <div className="p-5 border border-[#E3D6BC] dark:border-[#4A3E2E] bg-[#FFFFFF] dark:bg-[#2A231B] shadow-xs">
          <span className="text-[11px] font-mono text-[#7A6652] dark:text-[#A99A82] uppercase block">
            Inscribed Editions
          </span>
          <div className="font-editorial text-3xl font-semibold text-[#3B2B1E] dark:text-[#F3ECDD] mt-1">
            {data.totalBooks}
          </div>
          <span className="text-xs text-[#8A6238] dark:text-[#D9AE6B] font-mono mt-2 block">
            6 Disciplines curated
          </span>
        </div>
      </div>

      {/* Low Stock Alert Banner */}
      {data.lowStockBooks.length > 0 && (
        <div className="p-5 border border-[#8E1F1F]/40 bg-[#8E1F1F]/5 text-[#3B2B1E] dark:text-[#F3ECDD] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-[#8E1F1F] shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-xs text-[#8E1F1F] dark:text-[#E25858] uppercase tracking-wider font-mono">
                Low Inventory Notice ({data.lowStockBooks.length} Editions)
              </h4>
              <p className="text-xs text-[#7A6652] dark:text-[#A99A82] mt-0.5 font-body-literary">
                {data.lowStockBooks.map((b: Book) => `${b.bookTitle} (${b.stock} left)`).join(' · ')}
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigateTab('books')}
            className="px-4 py-2 bg-[#8E1F1F] text-[#FAF6EC] text-xs font-semibold uppercase tracking-wider hover:bg-[#721818] transition-colors shrink-0 font-mono btn-press"
          >
            Review Catalog Stock
          </button>
        </div>
      )}

      {/* Revenue Trend & Order Status Distribution Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Revenue Trend Chart */}
        <div className="lg:col-span-8 p-6 border border-[#E3D6BC] dark:border-[#4A3E2E] bg-[#FFFFFF] dark:bg-[#2A231B] space-y-6 shadow-xs">
          <div className="flex items-center justify-between border-b border-[#E3D6BC] dark:border-[#4A3E2E] pb-3">
            <h3 className="font-editorial text-xl text-[#3B2B1E] dark:text-[#F3ECDD]">
              Monthly Revenue Performance
            </h3>
            <span className="text-[11px] font-mono text-[#7A6652] dark:text-[#A99A82]">
              Past 6 Months
            </span>
          </div>

          {/* Bar Chart Representation */}
          <div className="h-52 flex items-end gap-6 pt-6 px-2">
            {data.revenueTrends.map((t: any, idx: number) => {
              const heightPercent = Math.round((t.revenue / maxRevenue) * 100);
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                  <span className="text-xs font-mono text-[#7A6652] dark:text-[#A99A82]">
                    ${t.revenue}
                  </span>
                  <div
                    className="w-full bg-[#8A6238] dark:bg-[#D9AE6B] hover:bg-[#6F4D2B] dark:hover:bg-[#CBA77B] transition-all duration-300 relative group cursor-pointer shadow-2xs"
                    style={{ height: `${heightPercent}%` }}
                  >
                    <div className="absolute -top-7 start-1/2 -translate-x-1/2 bg-[#3B2B1E] text-[#FAF6EC] text-xs px-1.5 py-0.5 opacity-0 group-hover:opacity-100 transition-opacity font-mono pointer-events-none whitespace-nowrap shadow-md">
                      ${t.revenue}
                    </div>
                  </div>
                  <span className="text-xs font-medium text-[#3B2B1E] dark:text-[#F3ECDD]">
                    {t.month}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Status Distribution */}
        <div className="lg:col-span-4 p-6 border border-[#E3D6BC] dark:border-[#4A3E2E] bg-[#FFFFFF] dark:bg-[#2A231B] space-y-4 shadow-xs">
          <h3 className="font-editorial text-xl text-[#3B2B1E] dark:text-[#F3ECDD] border-b border-[#E3D6BC] dark:border-[#4A3E2E] pb-3">
            Order Status Breakdown
          </h3>
          <div className="space-y-3 text-xs">
            {Object.entries(data.statusDistribution || {}).map(([st, count]: any) => (
              <div key={st} className="flex items-center justify-between">
                <span className="font-mono uppercase text-[11px] text-[#7A6652] dark:text-[#A99A82]">
                  {st}
                </span>
                <span className="font-mono font-semibold text-[#3B2B1E] dark:text-[#F3ECDD]">
                  {count}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="p-6 border border-[#E3D6BC] dark:border-[#4A3E2E] bg-[#FFFFFF] dark:bg-[#2A231B] space-y-4 shadow-xs">
        <div className="flex items-center justify-between border-b border-[#E3D6BC] dark:border-[#4A3E2E] pb-3">
          <h3 className="font-editorial text-xl text-[#3B2B1E] dark:text-[#F3ECDD]">
            Recent Customer Orders
          </h3>
          <button
            onClick={() => onNavigateTab('orders')}
            className="text-xs font-semibold text-[#8A6238] dark:text-[#D9AE6B] hover:underline font-mono btn-press"
          >
            Manage All Orders →
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-start text-xs">
            <thead>
              <tr className="border-b border-[#E3D6BC] dark:border-[#4A3E2E] text-[#7A6652] dark:text-[#A99A82] uppercase tracking-wider font-mono text-xs">
                <th className="py-2.5">Order #</th>
                <th className="py-2.5">Patron</th>
                <th className="py-2.5">Total</th>
                <th className="py-2.5">Status</th>
                <th className="py-2.5 text-end">Quick Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E3D6BC]/60 dark:divide-[#4A3E2E]/60">
              {data.recentOrders.map((order: Order) => (
                <tr key={order.id} className="hover:bg-[#F1E9D6]/40 dark:hover:bg-[#2F261B]/40 transition-colors">
                  <td className="py-3 font-mono font-semibold text-[#3B2B1E] dark:text-[#F3ECDD]">
                    {order.orderNumber}
                  </td>
                  <td className="py-3">
                    <span className="block font-medium text-[#3B2B1E] dark:text-[#F3ECDD]">
                      {order.customerName}
                    </span>
                    <span className="text-[11px] text-[#7A6652] dark:text-[#A99A82]">{order.customerEmail}</span>
                  </td>
                  <td className="py-3 font-semibold text-[#3B2B1E] dark:text-[#F3ECDD]">
                    ${order.totalAmount.toFixed(2)}
                  </td>
                  <td className="py-3">
                    <span className="px-2 py-0.5 border border-[#E3D6BC] dark:border-[#4A3E2E] text-xs font-mono uppercase font-semibold">
                      {order.status}
                    </span>
                  </td>
                  <td className="py-3 text-end">
                    <select
                      value={order.status}
                      onChange={(e) =>
                        handleUpdateStatus(order.id, e.target.value as OrderStatus)
                      }
                      className="px-2 py-1 border border-[#E3D6BC] dark:border-[#4A3E2E] bg-[#FAF6EC] dark:bg-[#2A231B] text-[#3B2B1E] dark:text-[#F3ECDD] text-[11px] font-mono cursor-pointer"
                    >
                      <option value="CONFIRMED">CONFIRMED</option>
                      <option value="PROCESSING">PROCESSING</option>
                      <option value="SHIPPING">SHIPPING</option>
                      <option value="DELIVERED">DELIVERED</option>
                      <option value="CANCELLED">CANCELLED</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
