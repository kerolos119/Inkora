import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { t } from '../../i18n';

interface StarRatingProps {
  value: number;
  onChange?: (value: number) => void;
  size?: 'sm' | 'md' | 'lg';
  animate?: boolean;
}

const SIZE = { sm: 'w-4 h-4', md: 'w-5 h-5', lg: 'w-8 h-8' } as const;

export const StarRating: React.FC<StarRatingProps> = ({ value, onChange, size = 'md', animate = false }) => {
  const [hover, setHover] = useState(0);
  const shown = hover || value;
  const interactive = Boolean(onChange);

  return (
    <div
      className="inline-flex items-center gap-0.5"
      role={interactive ? 'radiogroup' : 'img'}
      aria-label={t('rv.star', { n: value })}
      onMouseLeave={() => setHover(0)}
    >
      {[1, 2, 3, 4, 5].map((n) => {
        const filled = n <= shown;
        const star = (
          <Star
            className={`${SIZE[size]} transition-colors duration-150 ${
              filled ? 'fill-[#C27835] text-[#C27835]' : 'text-[#CDBB98] dark:text-[#6B5B45]'
            } ${animate && filled && !interactive ? 'animate-star-fill' : ''}`}
            style={animate && !interactive ? { animationDelay: `${n * 70}ms` } : undefined}
          />
        );
        if (!interactive) return <span key={n}>{star}</span>;
        return (
          <button
            type="button"
            key={n}
            role="radio"
            aria-checked={value === n}
            aria-label={t('rv.star', { n })}
            onMouseEnter={() => setHover(n)}
            onFocus={() => setHover(n)}
            onBlur={() => setHover(0)}
            onClick={() => onChange!(n)}
            className="p-1 rounded-sm cursor-pointer transition-transform hover:scale-125 active:scale-95 focus-visible:outline-2 focus-visible:outline-[#8A6238]"
          >
            <span key={`${n}-${value}`} className={`block ${value === n ? 'animate-star-pop' : ''}`}>{star}</span>
          </button>
        );
      })}
    </div>
  );
};