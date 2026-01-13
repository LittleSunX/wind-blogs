import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import '../styles/ThemeToggle.css';

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label={theme === 'dark' ? '切换到亮色模式' : '切换到暗色模式'}
      title={theme === 'dark' ? '切换到亮色模式' : '切换到暗色模式'}
    >
      <span className={`theme-icon ${theme === 'dark' ? 'active' : ''}`}>
        🌙
      </span>
      <span className={`theme-icon ${theme === 'light' ? 'active' : ''}`}>
        ☀️
      </span>
    </button>
  );
};

export default ThemeToggle;
