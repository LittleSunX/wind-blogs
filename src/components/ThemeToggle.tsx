import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useI18n } from '../contexts/I18nContext';
import '../styles/ThemeToggle.css';

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { t } = useI18n();
  const nextThemeLabel = theme === 'dark' ? t.theme.light : t.theme.dark;

  return (
    <button
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label={nextThemeLabel}
      title={nextThemeLabel}
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
