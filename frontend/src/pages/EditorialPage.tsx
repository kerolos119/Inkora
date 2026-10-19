import { t } from '../i18n';
import React, { useState, useEffect } from 'react';
import { Heart, MessageSquare, Calendar } from 'lucide-react';
import { Post } from '../types/index.js';
import { api } from '../services/api.js';
import { useToast } from '../context/ToastContext.js';
import { useAuth } from '../context/AuthContext.js';
import { CommentThread } from '../components/community/CommentThread.js';
import type { CommentKind } from '../services/realapi.js';

interface EditorialPageProps {
  onNavigate: (page: string) => void;
}

export const EditorialPage: React.FC<EditorialPageProps> = ({ onNavigate }) => {
  const [tab, setTab] = useState<CommentKind>('post');
  const [lists, setLists] = useState<Record<CommentKind, Post[]>>({ post: [], news: [] });
  const [loaded, setLoaded] = useState<Record<CommentKind, boolean>>({ post: false, news: false });
  const [openComments, setOpenComments] = useState<string | null>(null);
  const [burstId, setBurstId] = useState<string | null>(null);
  const { showToast } = useToast();
  const { user } = useAuth();

  const posts = lists[tab];

  useEffect(() => {
    if (loaded[tab]) return;
    const load = tab === 'post' ? api.getPosts() : api.getNews();
    load
      .then((rows) => setLists((l) => ({ ...l, [tab]: rows })))
      .catch(console.error)
      .finally(() => setLoaded((l) => ({ ...l, [tab]: true })));
  }, [tab, loaded]);

  const patch = (id: string, change: Partial<Post>) =>
    setLists((l) => ({ ...l, [tab]: l[tab].map((p) => (p.id === id ? { ...p, ...change } : p)) }));

  const handleLike = async (id: string) => {
    if (!user) {
      showToast(t('cm.likeLogin'), 'info');
      onNavigate('auth');
      return;
    }
    try {
      const res = tab === 'post' ? await api.likePost(id) : await api.likeNews(id);
      patch(id, { likesCount: res.likesCount, isLiked: res.isLiked });
      if (res.isLiked) {
        setBurstId(id);
        window.setTimeout(() => setBurstId((b) => (b === id ? null : b)), 520);
      }
    } catch (err: any) {
      showToast(err?.message || t('cm.fail'), 'error');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12 animate-ink-fade">
      {/* Editorial Header */}
      <div className="border-b border-[#E3D6BC] dark:border-[#4A3E2E] pb-6">
        <div className="flex items-center justify-between">
          <span className="text-xs tracking-[0.25em] uppercase text-[#8A6238] dark:text-[#D9AE6B] font-semibold block mb-1 font-mono">
            {t('x.d8dab9')}
          </span>
          <span className="font-quill text-base text-[#8E1F1F] dark:text-[#E25858] -rotate-1 select-none">
            ~ Quarterly Literary Broadside ~
          </span>
        </div>
        <h1 className="font-editorial text-4xl sm:text-5xl text-[#3B2B1E] dark:text-[#F3ECDD]">
          {t('x.1fa94b')}
        </h1>
        <p className="text-xs text-[#65513F] dark:text-[#A99A82] mt-1 max-w-xl font-body-literary">
          {t('x.ec95a8')}
        </p>
      </div>

      <div role="tablist" className="flex gap-2 -mt-6">
        {(['post', 'news'] as CommentKind[]).map((k) => (
          <button
            key={k}
            role="tab"
            aria-selected={tab === k}
            onClick={() => { setTab(k); setOpenComments(null); }}
            className={`px-5 py-2 border transition-all duration-200 cursor-pointer btn-press rounded-[2px] ${
              tab === k
                ? 'bg-[#3B2B1E] dark:bg-[#8A6238] text-[#FAF6EC] border-transparent'
                : 'border-[#E3D6BC] dark:border-[#4A3E2E] text-[#65513F] dark:text-[#A99A82] hover:border-[#8A6238]'
            }`}
          >
            {k === 'post' ? t('cm.posts') : t('cm.news')}
          </button>
        ))}
      </div>

      {loaded[tab] && posts.length === 0 && (
        <p className="text-center py-16 text-[#65513F] dark:text-[#A99A82] animate-entry-in">
          {tab === 'post' ? t('cm.noPosts') : t('cm.noNews')}
        </p>
      )}

      <div key={tab} className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
        {posts.map((post, idx) => (
          <article
            key={post.id}
            style={{ animationDelay: `${Math.min(idx, 6) * 70}ms` }}
            className="animate-entry-in book-lift border border-[#E3D6BC] dark:border-[#4A3E2E] bg-[#FFFFFF] dark:bg-[#2A231B] flex flex-col justify-between shadow-xs"
          >
            <div>
              <div className="book-cover-sheen aspect-16/9 overflow-hidden bg-[#F1E9D6] dark:bg-[#2E251A]">
                <img
                  src={post.coverImage}
                  alt={post.title}
                  className="w-full h-full object-cover hover:scale-103 transition-transform duration-700"
                />
              </div>

              <div className="p-6 space-y-3">
                <div className="flex items-center justify-between text-xs text-[#65513F] dark:text-[#A99A82]">
                  <span className="font-mono text-[#8A6238] dark:text-[#D9AE6B] uppercase font-semibold">{post.authorRole}</span>
                  <div className="flex items-center gap-1 font-mono">
                    <Calendar className="w-3 h-3" />
                    <span>{post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : ''}</span>
                  </div>
                </div>

                <h2 className="font-editorial text-2xl sm:text-3xl text-[#3B2B1E] dark:text-[#F3ECDD] leading-tight">
                  {post.title}
                </h2>

                <p className="text-xs text-[#65513F] dark:text-[#A99A82] leading-relaxed font-body-literary">
                  {post.content}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {post.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="text-xs uppercase font-mono px-2 py-0.5 bg-[#F1E9D6] dark:bg-[#2E251A] text-[#3B2B1E] dark:text-[#F3ECDD] border border-[#E3D6BC]/50 dark:border-[#4A3E2E]/50"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-6 pt-0 border-t border-[#E3D6BC]/60 dark:border-[#4A3E2E]/60 flex items-center justify-between text-xs mt-4">
              <span className="text-[#65513F] dark:text-[#A99A82]">
                By <strong className="text-[#3B2B1E] dark:text-[#F3ECDD] font-medium">{post.authorName}</strong>
              </span>

              <div className="flex items-center gap-4">
                <button
                  onClick={() => handleLike(post.id)}
                  className={`flex items-center gap-1.5 transition-colors btn-press ${
                    post.isLiked ? 'text-[#8E1F1F]' : 'text-[#65513F] hover:text-[#8E1F1F] dark:hover:text-[#E25858]'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${post.isLiked ? 'fill-[#8E1F1F]' : ''} ${burstId === post.id ? 'animate-heart-burst' : ''}`} />
                  <span key={post.likesCount} className="font-mono text-xs animate-number-tick">{post.likesCount}</span>
                </button>

                <button
                  onClick={() => setOpenComments((c) => (c === post.id ? null : post.id))}
                  aria-expanded={openComments === post.id}
                  aria-label={openComments === post.id ? t('cm.hide') : t('cm.show')}
                  className={`flex items-center gap-1.5 transition-colors btn-press cursor-pointer ${
                    openComments === post.id ? 'text-[#8A6238] dark:text-[#D2A560]' : 'text-[#65513F] dark:text-[#A99A82] hover:text-[#8A6238]'
                  }`}
                >
                  <MessageSquare className={`w-4 h-4 ${openComments === post.id ? 'fill-[#8A6238]/20' : ''}`} />
                  <span key={post.commentsCount} className="font-mono text-xs animate-number-tick">{post.commentsCount}</span>
                </button>
              </div>
            </div>

            {openComments === post.id && (
              <div className="px-6 pb-6 border-t border-[#E3D6BC]/60 dark:border-[#4A3E2E]/60">
                <CommentThread
                  kind={tab}
                  parentId={post.id}
                  onNavigate={onNavigate}
                  onCountChange={(n) => patch(post.id, { commentsCount: n })}
                />
              </div>
            )}
          </article>
        ))}
      </div>
    </div>
  );
};