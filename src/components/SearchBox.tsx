import React from 'react';
import '../styles/SearchBox.css';

interface SearchBoxProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

const SearchBox: React.FC<SearchBoxProps> = ({
    value,
    onChange,
    placeholder = '搜索文章...'
}) => {
    return (
        <div className="search-box">
            <span className="search-icon">🔍</span>
            <input
                type="text"
                className="search-input"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
            />
            {value && (
                <button
                    className="search-clear"
                    onClick={() => onChange('')}
                    aria-label="清除搜索"
                >
                    ✕
                </button>
            )}
        </div>
    );
};

export default SearchBox;
