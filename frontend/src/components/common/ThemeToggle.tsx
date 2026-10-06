import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext.js';

export const ThemeToggle: React.FC = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      type="button"
      title={isDark ? 'Switch to Vellum Light Mode' : 'Switch to Obsidian Dark Mode'}
      className="group relative flex items-center gap-1.5 px-2.5 py-1.5 border border-[#E3D6BC] dark:border-[#4A3E2E] bg-[#FFFFFF] dark:bg-[#2A231B] text-[#3B2B1E] dark:text-[#F3ECDD] hover:border-[#8A6238] dark:hover:border-[#D2A560] transition-all btn-press shadow-2xs cursor-pointer rounded-[2px]"
      aria-label="Toggle theme mode"
    >
      <div className="relative w-4 h-4 flex items-center justify-center">
        {isDark ? (
          <Moon className="w-3.5 h-3.5 text-[#D2A560] transition-transform duration-300 group-hover:-rotate-12" />
        ) : (
          <Sun className="w-3.5 h-3.5 text-[#8E1F1F] transition-transform duration-300 group-hover:rotate-45" />
        )}
      </div>

      <span className="hidden sm:inline font-mono text-xs tracking-wider uppercase font-semibold text-[#7A6652] dark:text-[#A99A82]">
        {isDark ? 'Obsidian' : 'Vellum'}
      </span>
    </button>
  );
};
