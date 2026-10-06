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
      className="group relative flex items-center gap-1.5 px-2.5 py-1.5 border border-[#DFD7C7] dark:border-[#262C3A] bg-[#FFFFFF] dark:bg-[#151821] text-[#0D1017] dark:text-[#EBE8E1] hover:border-[#16284F] dark:hover:border-[#4A72B0] transition-all btn-press shadow-2xs cursor-pointer rounded-[2px]"
      aria-label="Toggle theme mode"
    >
      <div className="relative w-4 h-4 flex items-center justify-center">
        {isDark ? (
          <Moon className="w-3.5 h-3.5 text-[#4A72B0] transition-transform duration-300 group-hover:-rotate-12" />
        ) : (
          <Sun className="w-3.5 h-3.5 text-[#8E1F1F] transition-transform duration-300 group-hover:rotate-45" />
        )}
      </div>

      <span className="hidden sm:inline font-mono text-[10px] tracking-wider uppercase font-semibold text-[#5A6273] dark:text-[#8E95A5]">
        {isDark ? 'Obsidian' : 'Vellum'}
      </span>
    </button>
  );
};
