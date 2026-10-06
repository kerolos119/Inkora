import React, { useState, useEffect } from 'react';
import { Star, CheckCircle, XCircle, Trash2 } from 'lucide-react';
import { Review } from '../../types/index.js';
import { api } from '../../services/api.js';
import { useToast } from '../../context/ToastContext.js';

export const AdminReviews: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const { showToast } = useToast();

  const loadReviews = () => {
    api.getAllReviews().then(setReviews).catch(console.error);
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const handleUpdateStatus = async (id: string, status: 'APPROVED' | 'PENDING' | 'REJECTED') => {
    try {
      const updated = await api.updateReviewStatus(id, status);
      setReviews(reviews.map((r) => (r.id === id ? updated : r)));
      showToast(`Review status updated to ${status}`);
    } catch {
      showToast('Error updating status', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-[#DFD7C7] dark:border-[#242A38] pb-4">
        <span className="text-[10px] uppercase font-mono tracking-widest text-[#16284F] dark:text-[#5A85C4] font-semibold">
          Critical Oversight
        </span>
        <h1 className="font-editorial text-3xl sm:text-4xl text-[#0D1017] dark:text-[#EFECE6] mt-1">
          Reader Reviews Moderation
        </h1>
      </div>

      <div className="border border-[#DFD7C7] dark:border-[#242A38] bg-[#FFFFFF] dark:bg-[#131720] overflow-x-auto shadow-xs">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-[#DFD7C7] dark:border-[#242A38] text-[#5A6273] dark:text-[#8F97A8] uppercase tracking-wider font-mono text-[10px]">
              <th className="p-3">Book Edition</th>
              <th className="p-3">Patron Reader</th>
              <th className="p-3">Rating</th>
              <th className="p-3">Commentary</th>
              <th className="p-3">Date</th>
              <th className="p-3">Status</th>
              <th className="p-3 text-right">Moderation</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#DFD7C7]/60 dark:divide-[#242A38]/60">
            {reviews.map((rev) => (
              <tr key={rev.id} className="hover:bg-[#EFEAE0]/40 dark:hover:bg-[#1C212E]/40 transition-colors">
                <td className="p-3 font-editorial text-sm font-semibold text-[#0D1017] dark:text-[#EFECE6]">
                  {rev.bookTitle}
                </td>
                <td className="p-3 text-[#0D1017] dark:text-[#EFECE6]">{rev.userName}</td>
                <td className="p-3">
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 ${
                          i < rev.rating
                            ? 'fill-[#C27835] text-[#C27835]'
                            : 'text-[#DFD7C7] dark:text-[#242A38]'
                        }`}
                      />
                    ))}
                  </div>
                </td>
                <td className="p-3 max-w-xs text-xs text-[#5A6273] dark:text-[#8F97A8] line-clamp-2 font-body-literary">
                  {rev.comment}
                </td>
                <td className="p-3 text-[11px] font-mono text-[#5A6273] dark:text-[#8F97A8]">{rev.date}</td>
                <td className="p-3">
                  <span
                    className={`px-1.5 py-0.5 border text-[10px] font-mono uppercase font-semibold ${
                      rev.status === 'APPROVED'
                        ? 'text-[#2A674A] border-[#2A674A]/40'
                        : rev.status === 'REJECTED'
                        ? 'text-[#8E1F1F] border-[#8E1F1F]/40'
                        : 'text-[#B45309] border-[#B45309]/40'
                    }`}
                  >
                    {rev.status}
                  </span>
                </td>
                <td className="p-3 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    {rev.status !== 'APPROVED' && (
                      <button
                        onClick={() => handleUpdateStatus(rev.id, 'APPROVED')}
                        className="p-1 text-[#2A674A] hover:bg-[#2A674A]/10 transition-colors btn-press"
                        title="Approve review"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </button>
                    )}
                    {rev.status !== 'REJECTED' && (
                      <button
                        onClick={() => handleUpdateStatus(rev.id, 'REJECTED')}
                        className="p-1 text-[#8E1F1F] hover:bg-[#8E1F1F]/10 transition-colors btn-press"
                        title="Reject review"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
