import React from 'react';
import { useI18n } from '../contexts/I18nContext';
import '../styles/SearchBox.css';

interface SearchBoxProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const SearchBox: React.FC<SearchBoxProps> = ({
  value,
  onChange,
  placeholder,
}) => {
  const { t } = useI18n();
  const inputPlaceholder = placeholder ?? t.home.searchPlaceholder;

  return (
    <div className="search-box">
      <span className="search-icon">🔍</span>
      <input
        type="text"
        className="search-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={inputPlaceholder}
        aria-label={inputPlaceholder}
      />
      {value && (
        <button
          className="search-clear"
          onClick={() => onChange('')}
          aria-label={t.common.clearSearch}
        >
          ✕
        </button>
      )}
    </div>
  );
};

export default SearchBox;
