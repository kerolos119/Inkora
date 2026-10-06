import React, { useState, useEffect } from 'react';
import { Search, UserCheck, Shield } from 'lucide-react';
import { api } from '../../services/api.js';

export const AdminCustomers: React.FC = () => {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    api
      .getAdminCustomers()
      .then(setCustomers)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = customers.filter(
    (c) =>
      c.username.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="border-b border-[#DFD7C7] dark:border-[#242A38] pb-4">
        <span className="text-[10px] uppercase font-mono tracking-widest text-[#16284F] dark:text-[#5A85C4] font-semibold">
          Patron Directory
        </span>
        <h1 className="font-editorial text-3xl sm:text-4xl text-[#0D1017] dark:text-[#EFECE6] mt-1">
          Registered Readers & Collectors
        </h1>
      </div>

      <div className="flex border border-[#DFD7C7] dark:border-[#242A38] bg-[#FFFFFF] dark:bg-[#131720] max-w-md text-xs shadow-xs">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search patrons by handle or email..."
          className="w-full px-3 py-2 bg-transparent text-[#0D1017] dark:text-[#EFECE6] focus:outline-hidden font-mono"
        />
        <div className="px-3 py-2 text-[#5A6273] dark:text-[#8F97A8]">
          <Search className="w-3.5 h-3.5" />
        </div>
      </div>

      <div className="border border-[#DFD7C7] dark:border-[#242A38] bg-[#FFFFFF] dark:bg-[#131720] overflow-x-auto shadow-xs">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-[#DFD7C7] dark:border-[#242A38] text-[#5A6273] dark:text-[#8F97A8] uppercase tracking-wider font-mono text-[10px]">
              <th className="p-3">Patron Handle</th>
              <th className="p-3">Email Address</th>
              <th className="p-3">Role</th>
              <th className="p-3">Acquisitions</th>
              <th className="p-3">Lifetime Value</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#DFD7C7]/60 dark:divide-[#242A38]/60">
            {filtered.map((c) => (
              <tr key={c.id} className="hover:bg-[#EFEAE0]/40 dark:hover:bg-[#1C212E]/40 transition-colors">
                <td className="p-3 font-semibold text-[#0D1017] dark:text-[#EFECE6]">
                  {c.username}
                </td>
                <td className="p-3 font-mono text-[11px] text-[#5A6273] dark:text-[#8F97A8]">
                  {c.email}
                </td>
                <td className="p-3 font-mono text-[10px]">
                  <span className="px-2 py-0.5 border border-[#16284F]/40 dark:border-[#5A85C4]/40 text-[#16284F] dark:text-[#5A85C4] font-semibold">
                    {c.role}
                  </span>
                </td>
                <td className="p-3 font-mono">{c.ordersCount} orders</td>
                <td className="p-3 font-semibold text-[#0D1017] dark:text-[#EFECE6] font-mono">
                  ${c.totalSpent.toFixed(2)}
                </td>
                <td className="p-3 text-[10px] font-mono text-[#2A674A]">
                  ACTIVE
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
