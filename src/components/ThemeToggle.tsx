import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export const ThemeToggle: React.FC = () => {
  const { isDark, toggleTheme } = useTheme();
  
  return (
    <button 
      onClick={toggleTheme}
      className="p-1.5 rounded-full bg-viridian/10 dark:bg-transparent text-viridian dark:text-viridian hover:bg-viridian/20 dark:hover:bg-viridian/20 transition-colors dark:border dark:border-viridian/70"
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDark ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  );
};