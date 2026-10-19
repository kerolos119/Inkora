import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { MessageSquare, Pencil, Trash2, LogIn, Loader2, ShieldAlert } from 'lucide-react';
import { t } from '../../i18n';
import { Review } from '../../types/index.js';
import { api } from '../../services/api.js';
import { useAuth } from '../../context/AuthContext.js';
import { useToast } from '../../context/ToastContext.js';
import { StarRating } from './StarRating.js';
import { initialOf, timeAgo } from './timeAgo.js';

interface ReviewSectionProps {
  bookId: string;
  onNavigate: (page: string) => void;
  onSummaryChange?: (average: number, count: number) => void;
}

const cardCls = 'border border-[#E3D6BC] dark:border-[#4A3E2E] bg-[#FFFFFF] dark:bg-[#2A231B] rounded-[2px] shadow-2xs';
const labelCls = 'text-xs uppercase tracking-wider font-semibold text-[#3B2B1E] dark:text-[#F3ECDD] block mb-1';

export const ReviewSection: React.FC<ReviewSectionProps> = ({ bookId, onNavigate, onSummaryChange }) => {
  const { user, isAdmin } = useAuth();
  const { showToast } = useToast();

  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadFailed, setLoadFailed] = useState(false);

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [editing, setEditing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    setLoadFailed(false);
    api.getBookReviews(bookId)
      .then(setReviews)
      .catch(() => setLoadFailed(true))
      .finally(() => setLoading(false));
  }, [bookId]);

  useEffect(() => {
    setEditing(false);
    setRating(0);
    setComment('');
    load();
  }, [load]);

  const mine = useMemo(() => (user ? reviews.find((r) => r.userId === user.id) : undefined), [reviews, user]);

  const summary = useMemo(() => {
    const count = reviews.length;
    const avg = count ? Math.round((reviews.reduce((n, r) => n + r.rating, 0) / count) * 10) / 10 : 0;
    const dist = [5, 4, 3, 2, 1].map((star) => reviews.filter((r) => r.rating === star).length);
    return { count, avg, dist };
  }, [reviews]);

  useEffect(() => {
    if (!loading && !loadFailed) onSummaryChange?.(summary.avg, summary.count);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [summary.avg, summary.count, loading, loadFailed]);

  const startEdit = () => {
    if (!mine) return;
    setRating(mine.rating);
    setComment(mine.comment);
    setEditing(true);
  };

  const cancelEdit = () => {
    setEditing(false);
    setRating(0);
    setComment('');
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating < 1) return showToast(t('rv.needRating'), 'error');
    if (!comment.trim()) return showToast(t('rv.needText'), 'error');
    setSubmitting(true);
    try {
      if (editing && mine) {
        const updated = await api.updateReview(mine.id, { rating, comment: comment.trim() });
        setReviews((list) => list.map((r) => (r.id === updated.id ? updated : r)));
        showToast(t('rv.updated'));
      } else {
        const created = await api.submitReview(bookId, { rating, comment: comment.trim() });
        setReviews((list) => [created, ...list]);
        showToast(t('rv.ok'));
      }
      cancelEdit();
    } catch (err: any) {
      showToast(err?.message || t('rv.fail'), 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const remove = async (id: string) => {
    if (confirmId !== id) {
      setConfirmId(id);
      window.setTimeout(() => setConfirmId((c) => (c === id ? null : c)), 3500);
      return;
    }
    setConfirmId(null);
    try {
      await api.deleteReview(id);
      setRemovingId(id);
      window.setTimeout(() => {
        setReviews((list) => list.filter((r) => r.id !== id));
        setRemovingId(null);
      }, 320);
      showToast(t('rv.deleted'));
    } catch (err: any) {
      showToast(err?.message || t('rv.fail'), 'error');
    }
  };

  const countLabel = summary.count === 1 ? t('rv.count1') : t('rv.count', { n: summary.count });
  const showForm = Boolean(user) && (!mine || editing);

  return (
    <section className="pt-10 border-t border-[#E3D6BC] dark:border-[#4A3E2E] space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <span className="text-xs tracking-[0.25em] uppercase text-[#8A6238] dark:text-[#D2A560] font-semibold">
            {t('rv.eyebrow')}
          </span>
          <h2 className="font-editorial text-3xl text-[#3B2B1E] dark:text-[#F3ECDD] mt-1">{t('rv.title')}</h2>
        </div>
        <span key={summary.count} className="text-xs text-[#65513F] dark:text-[#A99A82] animate-number-tick">
          {countLabel}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left: summary + list */}
        <div className="lg:col-span-7 space-y-5">
          {summary.count > 0 && (
            <div className={`${cardCls} p-5 flex flex-col sm:flex-row sm:items-center gap-6 animate-entry-in`}>
              <div className="text-center sm:min-w-[8rem]">
                <div key={summary.avg} className="font-editorial text-5xl text-[#3B2B1E] dark:text-[#F3ECDD] animate-number-tick">
                  {summary.avg.toFixed(1)}
                </div>
                <div className="mt-1 flex justify-center">
                  <StarRating value={Math.round(summary.avg)} size="sm" animate />
                </div>
                <div className="text-xs text-[#65513F] dark:text-[#A99A82] mt-1">{t('rv.outOf')}</div>
              </div>
              <div className="flex-1 space-y-1.5">
                {summary.dist.map((n, i) => {
                  const star = 5 - i;
                  const pct = summary.count ? (n / summary.count) * 100 : 0;
                  return (
                    <div key={star} className="flex items-center gap-2 text-xs text-[#65513F] dark:text-[#A99A82]">
                      <span className="w-4 text-center tabular-nums">{star}</span>
                      <div className="flex-1 h-2 bg-[#F1E9D6] dark:bg-[#3A3022] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#C27835] rounded-full animate-bar-grow"
                          style={{ width: `${pct}%`, animationDelay: `${i * 90}ms` }}
                        />
                      </div>
                      <span className="w-6 text-end tabular-nums">{n}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {loading ? (
            <div className="space-y-3" aria-busy="true">
              {[0, 1].map((i) => (
                <div key={i} className={`${cardCls} p-5 space-y-3 animate-pulse`}>
                  <div className="h-4 w-1/3 bg-[#F1E9D6] dark:bg-[#3A3022] rounded" />
                  <div className="h-3 w-1/4 bg-[#F1E9D6] dark:bg-[#3A3022] rounded" />
                  <div className="h-3 w-full bg-[#F1E9D6] dark:bg-[#3A3022] rounded" />
                </div>
              ))}
            </div>
          ) : loadFailed ? (
            <div className={`${cardCls} p-8 text-center space-y-3`}>
              <p className="text-[#65513F] dark:text-[#A99A82]">{t('rv.loadFail')}</p>
              <button onClick={load} className="text-[#8A6238] dark:text-[#D2A560] underline cursor-pointer">↻</button>
            </div>
          ) : reviews.length === 0 ? (
            <div className={`${cardCls} p-8 text-center animate-entry-in`}>
              <MessageSquare className="w-8 h-8 text-[#65513F]/40 mx-auto mb-2" />
              <p className="font-editorial text-xl text-[#3B2B1E] dark:text-[#F3ECDD]">{t('rv.empty')}</p>
              <p className="text-xs text-[#65513F] dark:text-[#A99A82] mt-1">{t('rv.emptyHint')}</p>
            </div>
          ) : (
            reviews.map((rev, idx) => {
              const isMine = user?.id === rev.userId;
              const canDelete = isMine || isAdmin;
              return (
                <article
                  key={rev.id}
                  className={`${cardCls} p-5 space-y-2 ${removingId === rev.id ? 'animate-entry-out' : 'animate-entry-in'} ${isMine ? 'ring-1 ring-[#C27835]/50' : ''}`}
                  style={removingId === rev.id ? undefined : { animationDelay: `${Math.min(idx, 6) * 60}ms` }}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <span aria-hidden className="w-9 h-9 shrink-0 rounded-full bg-[#F1E9D6] dark:bg-[#3A3022] text-[#8A6238] dark:text-[#D2A560] flex items-center justify-center font-semibold">
                        {initialOf(rev.userName)}
                      </span>
                      <div className="min-w-0">
                        <div className="font-semibold text-[#3B2B1E] dark:text-[#F3ECDD] truncate">
                          {rev.userName}
                          {isMine && <span className="ms-2 text-xs font-normal text-[#8A6238] dark:text-[#D2A560]">· {t('rv.mine')}</span>}
                        </div>
                        <div className="text-xs text-[#65513F] dark:text-[#A99A82]">{timeAgo(rev.date)}</div>
                      </div>
                    </div>
                    <StarRating value={rev.rating} size="sm" />
                  </div>

                  <p className="text-[#3B2B1E] dark:text-[#E4D9C3] leading-relaxed pt-1 font-body-literary whitespace-pre-line break-words">
                    {rev.comment}
                  </p>

                  {canDelete && (
                    <div className="flex items-center gap-4 pt-1 text-xs">
                      {isMine && (
                        <button onClick={startEdit} className="inline-flex items-center gap-1 text-[#65513F] dark:text-[#A99A82] hover:text-[#8A6238] cursor-pointer">
                          <Pencil className="w-3.5 h-3.5" /> {t('rv.edit')}
                        </button>
                      )}
                      <button
                        onClick={() => remove(rev.id)}
                        className={`inline-flex items-center gap-1 cursor-pointer transition-colors ${
                          confirmId === rev.id
                            ? 'text-[#8E1F1F] dark:text-[#E25858] font-semibold'
                            : 'text-[#65513F] dark:text-[#A99A82] hover:text-[#8E1F1F]'
                        }`}
                      >
                        {isMine ? <Trash2 className="w-3.5 h-3.5" /> : <ShieldAlert className="w-3.5 h-3.5" />}
                        {confirmId === rev.id ? t('rv.deleteConfirm') : isMine ? t('rv.delete') : t('rv.adminDelete')}
                      </button>
                    </div>
                  )}
                </article>
              );
            })
          )}
        </div>

        {/* Right: form / sign-in prompt */}
        <div className={`lg:col-span-5 p-6 ${cardCls} self-start`}>
          {!user ? (
            <div className="text-center space-y-3 py-4">
              <LogIn className="w-8 h-8 mx-auto text-[#8A6238] dark:text-[#D2A560]" />
              <h3 className="font-editorial text-2xl text-[#3B2B1E] dark:text-[#F3ECDD]">{t('rv.loginTitle')}</h3>
              <p className="text-xs text-[#65513F] dark:text-[#A99A82]">{t('rv.loginHint')}</p>
              <button
                onClick={() => onNavigate('auth')}
                className="px-6 py-2.5 bg-[#3B2B1E] dark:bg-[#8A6238] text-[#FAF6EC] hover:bg-[#8A6238] dark:hover:bg-[#604626] text-xs font-semibold uppercase tracking-widest transition-colors cursor-pointer btn-press rounded-[2px]"
              >
                {t('rv.signIn')}
              </button>
            </div>
          ) : mine && !editing ? (
            <div className="text-center space-y-3 py-4 animate-entry-in">
              <StarRating value={mine.rating} size="lg" animate />
              <h3 className="font-editorial text-2xl text-[#3B2B1E] dark:text-[#F3ECDD]">{t('rv.mine')}</h3>
              <button
                onClick={startEdit}
                className="inline-flex items-center gap-2 px-5 py-2 border border-[#8A6238] text-[#8A6238] dark:text-[#D2A560] hover:bg-[#8A6238] hover:text-[#FAF6EC] text-xs font-semibold uppercase tracking-widest transition-colors cursor-pointer btn-press rounded-[2px]"
              >
                <Pencil className="w-3.5 h-3.5" /> {t('rv.edit')}
              </button>
            </div>
          ) : (
            showForm && (
              <form onSubmit={submit} className="space-y-4 animate-entry-in">
                <h3 className="font-editorial text-2xl text-[#3B2B1E] dark:text-[#F3ECDD]">
                  {editing ? t('rv.edit') : t('rv.write')}
                </h3>

                <div>
                  <span className={labelCls}>{t('rv.yourRating')}</span>
                  <StarRating value={rating} onChange={setRating} size="lg" />
                </div>

                <div>
                  <label htmlFor="review-text" className={labelCls}>{t('rv.yourWords')}</label>
                  <textarea
                    id="review-text"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={5}
                    maxLength={2000}
                    placeholder={t('rv.placeholder')}
                    className="w-full px-3 py-2 border border-[#E3D6BC] dark:border-[#4A3E2E] bg-transparent text-[#3B2B1E] dark:text-[#F3ECDD] focus:outline-hidden focus:border-[#8A6238] rounded-[2px] transition-colors"
                  />
                  <div className="text-xs text-end text-[#65513F] dark:text-[#A99A82]">{comment.length}/2000</div>
                </div>

                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 bg-[#3B2B1E] dark:bg-[#8A6238] text-[#FAF6EC] hover:bg-[#8A6238] dark:hover:bg-[#604626] disabled:opacity-60 text-xs font-semibold uppercase tracking-widest transition-colors cursor-pointer btn-press rounded-[2px]"
                  >
                    {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                    {submitting ? (editing ? t('rv.saving') : t('rv.posting')) : editing ? t('rv.save') : t('rv.submit')}
                  </button>
                  {editing && (
                    <button
                      type="button"
                      onClick={cancelEdit}
                      className="px-4 py-2.5 border border-[#E3D6BC] dark:border-[#4A3E2E] text-[#65513F] dark:text-[#A99A82] text-xs font-semibold uppercase tracking-widest cursor-pointer btn-press rounded-[2px]"
                    >
                      {t('rv.cancel')}
                    </button>
                  )}
                </div>
              </form>
            )
          )}
        </div>
      </div>
    </section>
  );
};