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
      <div className="border-b border-[#E3D6BC] dark:border-[#4A3E2E] pb-4">
        <span className="text-xs uppercase font-mono tracking-widest text-[#8A6238] dark:text-[#D9AE6B] font-semibold">
          Patron Directory
        </span>
        <h1 className="font-editorial text-3xl sm:text-4xl text-[#3B2B1E] dark:text-[#F3ECDD] mt-1">
          Registered Readers & Collectors
        </h1>
      </div>

      <div className="flex border border-[#E3D6BC] dark:border-[#4A3E2E] bg-[#FFFFFF] dark:bg-[#2A231B] max-w-md text-xs shadow-xs">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search patrons by handle or email..."
          className="w-full px-3 py-2 bg-transparent text-[#3B2B1E] dark:text-[#F3ECDD] focus:outline-hidden font-mono"
        />
        <div className="px-3 py-2 text-[#7A6652] dark:text-[#A99A82]">
          <Search className="w-3.5 h-3.5" />
        </div>
      </div>

      <div className="border border-[#E3D6BC] dark:border-[#4A3E2E] bg-[#FFFFFF] dark:bg-[#2A231B] overflow-x-auto shadow-xs">
        <table className="w-full text-start text-xs">
          <thead>
            <tr className="border-b border-[#E3D6BC] dark:border-[#4A3E2E] text-[#7A6652] dark:text-[#A99A82] uppercase tracking-wider font-mono text-xs">
              <th className="p-3">Patron Handle</th>
              <th className="p-3">Email Address</th>
              <th className="p-3">Role</th>
              <th className="p-3">Acquisitions</th>
              <th className="p-3">Lifetime Value</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E3D6BC]/60 dark:divide-[#4A3E2E]/60">
            {filtered.map((c) => (
              <tr key={c.id} className="hover:bg-[#F1E9D6]/40 dark:hover:bg-[#2F261B]/40 transition-colors">
                <td className="p-3 font-semibold text-[#3B2B1E] dark:text-[#F3ECDD]">
                  {c.username}
                </td>
                <td className="p-3 font-mono text-[11px] text-[#7A6652] dark:text-[#A99A82]">
                  {c.email}
                </td>
                <td className="p-3 font-mono text-xs">
                  <span className="px-2 py-0.5 border border-[#8A6238]/40 dark:border-[#D9AE6B]/40 text-[#8A6238] dark:text-[#D9AE6B] font-semibold">
                    {c.role}
                  </span>
                </td>
                <td className="p-3 font-mono">{c.ordersCount} orders</td>
                <td className="p-3 font-semibold text-[#3B2B1E] dark:text-[#F3ECDD] font-mono">
                  ${c.totalSpent.toFixed(2)}
                </td>
                <td className="p-3 text-xs font-mono text-[#2A674A]">
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
