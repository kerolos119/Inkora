import React, { useState, useEffect } from 'react';
import { Heart, MessageSquare, Tag, ArrowRight, Feather, Calendar } from 'lucide-react';
import { Post } from '../types/index.js';
import { api } from '../services/api.js';
import { useToast } from '../context/ToastContext.js';

interface EditorialPageProps {
  onNavigate: (page: string) => void;
}

export const EditorialPage: React.FC<EditorialPageProps> = ({ onNavigate }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const { showToast } = useToast();

  useEffect(() => {
    api.getPosts().then(setPosts).catch(console.error);
  }, []);

  const handleLike = async (id: string) => {
    try {
      const res = await api.likePost(id);
      setPosts(
        posts.map((p) => (p.id === id ? { ...p, likesCount: res.likesCount, isLiked: true } : p))
      );
      showToast('Appreciation recorded in reader registry');
    } catch {
      // fallback
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12 animate-ink-fade">
      {/* Editorial Header */}
      <div className="border-b border-[#DFD7C7] dark:border-[#242A38] pb-6">
        <div className="flex items-center justify-between">
          <span className="text-[10px] tracking-[0.25em] uppercase text-[#16284F] dark:text-[#5A85C4] font-semibold block mb-1 font-mono">
            Essays, Monographs & Press
          </span>
          <span className="font-quill text-base text-[#8E1F1F] dark:text-[#E25858] -rotate-1 select-none">
            ~ Quarterly Literary Broadside ~
          </span>
        </div>
        <h1 className="font-editorial text-4xl sm:text-5xl text-[#0D1017] dark:text-[#EFECE6]">
          The Inkora Gazette
        </h1>
        <p className="text-xs text-[#5A6273] dark:text-[#8F97A8] mt-1 max-w-xl font-body-literary">
          Conversations on bookbinding, typography revival, historical manuscripts, and the physical art of reading.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {posts.map((post) => (
          <article
            key={post.id}
            className="book-lift border border-[#DFD7C7] dark:border-[#242A38] bg-[#FFFFFF] dark:bg-[#131720] flex flex-col justify-between shadow-xs"
          >
            <div>
              <div className="book-cover-sheen aspect-16/9 overflow-hidden bg-[#EFEAE0] dark:bg-[#1B212D]">
                <img
                  src={post.coverImage}
                  alt={post.title}
                  className="w-full h-full object-cover hover:scale-103 transition-transform duration-700"
                />
              </div>

              <div className="p-6 space-y-3">
                <div className="flex items-center justify-between text-[11px] text-[#5A6273] dark:text-[#8F97A8]">
                  <span className="font-mono text-[#16284F] dark:text-[#5A85C4] uppercase font-semibold">{post.authorRole}</span>
                  <div className="flex items-center gap-1 font-mono">
                    <Calendar className="w-3 h-3" />
                    <span>{post.publishedAt}</span>
                  </div>
                </div>

                <h2 className="font-editorial text-2xl sm:text-3xl text-[#0D1017] dark:text-[#EFECE6] leading-tight">
                  {post.title}
                </h2>

                <p className="text-xs text-[#5A6273] dark:text-[#8F97A8] leading-relaxed font-body-literary">
                  {post.content}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {post.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] uppercase font-mono px-2 py-0.5 bg-[#EFEAE0] dark:bg-[#1B212D] text-[#0D1017] dark:text-[#EFECE6] border border-[#DFD7C7]/50 dark:border-[#242A38]/50"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-6 pt-0 border-t border-[#DFD7C7]/60 dark:border-[#242A38]/60 flex items-center justify-between text-xs mt-4">
              <span className="text-[#5A6273] dark:text-[#8F97A8]">
                By <strong className="text-[#0D1017] dark:text-[#EFECE6] font-medium">{post.authorName}</strong>
              </span>

              <div className="flex items-center gap-4">
                <button
                  onClick={() => handleLike(post.id)}
                  className={`flex items-center gap-1.5 transition-colors btn-press ${
                    post.isLiked ? 'text-[#8E1F1F]' : 'text-[#5A6273] hover:text-[#8E1F1F] dark:hover:text-[#E25858]'
                  }`}
                >
                  <Heart className={`w-3.5 h-3.5 ${post.isLiked ? 'fill-[#8E1F1F]' : ''}`} />
                  <span className="font-mono text-[11px]">{post.likesCount}</span>
                </button>

                <div className="flex items-center gap-1 text-[#5A6273] dark:text-[#8F97A8]">
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span className="font-mono text-[11px]">{post.commentsCount}</span>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};
