import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Loader2, LogIn, Send, Trash2 } from 'lucide-react';
import { t } from '../../i18n';
import { PostComment } from '../../types/index.js';
import { api } from '../../services/api.js';
import type { CommentKind } from '../../services/realapi.js';
import { useAuth } from '../../context/AuthContext.js';
import { useToast } from '../../context/ToastContext.js';
import { initialOf, timeAgo } from './timeAgo.js';

interface CommentThreadProps {
  kind: CommentKind;
  parentId: string;
  onNavigate: (page: string) => void;
  onCountChange?: (count: number) => void;
}

export const CommentThread: React.FC<CommentThreadProps> = ({ kind, parentId, onNavigate, onCountChange }) => {
  const { user, isAdmin } = useAuth();
  const { showToast } = useToast();

  const [comments, setComments] = useState<PostComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadFailed, setLoadFailed] = useState(false);
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const load = useCallback(() => {
    setLoading(true);
    setLoadFailed(false);
    api.getComments(kind, parentId)
      .then((rows) => { setComments(rows); onCountChange?.(rows.length); })
      .catch(() => setLoadFailed(true))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kind, parentId]);

  useEffect(load, [load]);

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    const content = text.trim();
    if (!content) return;
    setSending(true);
    try {
      const created = await api.addComment(kind, parentId, content);
      setComments((list) => {
        const next = [created, ...list];
        onCountChange?.(next.length);
        return next;
      });
      setText('');
      listRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      showToast(err?.message || t('cm.fail'), 'error');
    } finally {
      setSending(false);
    }
  };

  const remove = async (id: string) => {
    try {
      await api.deleteComment(kind, id);
      setRemovingId(id);
      window.setTimeout(() => {
        setComments((list) => {
          const next = list.filter((c) => c.id !== id);
          onCountChange?.(next.length);
          return next;
        });
        setRemovingId(null);
      }, 320);
      showToast(t('cm.deleted'));
    } catch (err: any) {
      showToast(err?.message || t('cm.fail'), 'error');
    }
  };

  return (
    <div className="animate-comments-open space-y-4 pt-4">
      {user ? (
        <form onSubmit={send} className="flex items-start gap-3">
          <span aria-hidden className="w-9 h-9 shrink-0 rounded-full bg-[#8A6238] text-[#FAF6EC] flex items-center justify-center font-semibold">
            {initialOf(user.username)}
          </span>
          <div className="flex-1 flex items-end gap-2 border border-[#E3D6BC] dark:border-[#4A3E2E] focus-within:border-[#B07A2E] focus-within:shadow-[0_0_0_2px_rgba(176,122,46,0.25)] transition-all rounded-[2px] bg-[#FFFDF8] dark:bg-[#231D16] px-3 py-2">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) send(e as unknown as React.FormEvent);
              }}
              rows={1}
              maxLength={5000}
              placeholder={t('cm.placeholder')}
              aria-label={t('cm.placeholder')}
              className="flex-1 resize-none bg-transparent text-[#3B2B1E] dark:text-[#F3ECDD] focus:outline-hidden max-h-40"
              style={{ fieldSizing: 'content', outline: 'none' } as React.CSSProperties}
            />
            <button
              type="submit"
              disabled={sending || !text.trim()}
              aria-label={t('cm.send')}
              className="shrink-0 p-2 text-[#8A6238] dark:text-[#D2A560] disabled:opacity-40 hover:scale-110 active:scale-90 transition-transform cursor-pointer disabled:cursor-default"
            >
              {sending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5 rtl:-scale-x-100" />}
            </button>
          </div>
        </form>
      ) : (
        <button
          onClick={() => onNavigate('auth')}
          className="w-full flex items-center justify-center gap-2 py-3 border border-dashed border-[#CDBB98] dark:border-[#4A3E2E] text-[#65513F] dark:text-[#A99A82] hover:border-[#8A6238] hover:text-[#8A6238] transition-colors cursor-pointer rounded-[2px]"
        >
          <LogIn className="w-4 h-4" /> {t('cm.loginHint')}
        </button>
      )}

      <div ref={listRef} className="space-y-3 max-h-[28rem] overflow-y-auto pe-1">
        {loading ? (
          <div className="space-y-3 animate-pulse" aria-busy="true">
            {[0, 1].map((i) => (
              <div key={i} className="flex gap-3">
                <div className="w-9 h-9 rounded-full bg-[#F1E9D6] dark:bg-[#3A3022]" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-1/4 bg-[#F1E9D6] dark:bg-[#3A3022] rounded" />
                  <div className="h-3 w-3/4 bg-[#F1E9D6] dark:bg-[#3A3022] rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : loadFailed ? (
          <div className="text-center text-[#65513F] dark:text-[#A99A82] py-3">
            {t('cm.loadFail')}{' '}
            <button onClick={load} className="underline text-[#8A6238] dark:text-[#D2A560] cursor-pointer">↻</button>
          </div>
        ) : comments.length === 0 ? (
          <p className="text-center text-[#65513F] dark:text-[#A99A82] py-4 animate-entry-in">{t('cm.empty')}</p>
        ) : (
          comments.map((c, idx) => {
            const mine = user?.id === c.userId;
            return (
              <div
                key={c.id}
                className={`flex gap-3 ${removingId === c.id ? 'animate-entry-out' : 'animate-entry-in'}`}
                style={removingId === c.id ? undefined : { animationDelay: `${Math.min(idx, 5) * 50}ms` }}
              >
                <span aria-hidden className="w-9 h-9 shrink-0 rounded-full bg-[#F1E9D6] dark:bg-[#3A3022] text-[#8A6238] dark:text-[#D2A560] flex items-center justify-center font-semibold">
                  {initialOf(c.userName)}
                </span>
                <div className="flex-1 min-w-0 bg-[#FAF6EC] dark:bg-[#231D16] rounded-[2px] px-4 py-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold text-[#3B2B1E] dark:text-[#F3ECDD] truncate">
                      {mine ? t('cm.you') : c.userName}
                    </span>
                    <span className="text-xs text-[#65513F] dark:text-[#A99A82] shrink-0">{timeAgo(c.createdAt)}</span>
                  </div>
                  <p className="text-[#3B2B1E] dark:text-[#E4D9C3] whitespace-pre-line break-words leading-relaxed">{c.content}</p>
                  {(mine || isAdmin) && (
                    <button
                      onClick={() => remove(c.id)}
                      className="mt-1 inline-flex items-center gap-1 text-xs text-[#65513F] dark:text-[#A99A82] hover:text-[#8E1F1F] dark:hover:text-[#E25858] cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> {t('cm.delete')}
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};