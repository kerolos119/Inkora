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
      <div className="border-b border-[#E3D6BC] dark:border-[#4A3E2E] pb-4">
        <span className="text-xs uppercase font-mono tracking-widest text-[#8A6238] dark:text-[#D9AE6B] font-semibold">
          Critical Oversight
        </span>
        <h1 className="font-editorial text-3xl sm:text-4xl text-[#3B2B1E] dark:text-[#F3ECDD] mt-1">
          Reader Reviews Moderation
        </h1>
      </div>

      <div className="border border-[#E3D6BC] dark:border-[#4A3E2E] bg-[#FFFFFF] dark:bg-[#2A231B] overflow-x-auto shadow-xs">
        <table className="w-full text-start text-xs">
          <thead>
            <tr className="border-b border-[#E3D6BC] dark:border-[#4A3E2E] text-[#7A6652] dark:text-[#A99A82] uppercase tracking-wider font-mono text-xs">
              <th className="p-3">Book Edition</th>
              <th className="p-3">Patron Reader</th>
              <th className="p-3">Rating</th>
              <th className="p-3">Commentary</th>
              <th className="p-3">Date</th>
              <th className="p-3">Status</th>
              <th className="p-3 text-end">Moderation</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E3D6BC]/60 dark:divide-[#4A3E2E]/60">
            {reviews.map((rev) => (
              <tr key={rev.id} className="hover:bg-[#F1E9D6]/40 dark:hover:bg-[#2F261B]/40 transition-colors">
                <td className="p-3 font-editorial text-sm font-semibold text-[#3B2B1E] dark:text-[#F3ECDD]">
                  {rev.bookTitle}
                </td>
                <td className="p-3 text-[#3B2B1E] dark:text-[#F3ECDD]">{rev.userName}</td>
                <td className="p-3">
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 ${
                          i < rev.rating
                            ? 'fill-[#C27835] text-[#C27835]'
                            : 'text-[#E3D6BC] dark:text-[#4A3E2E]'
                        }`}
                      />
                    ))}
                  </div>
                </td>
                <td className="p-3 max-w-xs text-xs text-[#7A6652] dark:text-[#A99A82] line-clamp-2 font-body-literary">
                  {rev.comment}
                </td>
                <td className="p-3 text-[11px] font-mono text-[#7A6652] dark:text-[#A99A82]">{rev.date}</td>
                <td className="p-3">
                  <span
                    className={`px-1.5 py-0.5 border text-xs font-mono uppercase font-semibold ${
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
                <td className="p-3 text-end">
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
