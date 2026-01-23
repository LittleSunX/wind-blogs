import { useI18n } from '../contexts/I18nContext';
import '../styles/LanguageToggle.css';

const LanguageToggle: React.FC = () => {
  const { locale, toggleLocale, t } = useI18n();

  return (
    <button
      className="language-toggle"
      onClick={toggleLocale}
      title={t.language.switch}
      aria-label={t.language.switch}
    >
      <span className="language-icon">🌐</span>
      <span className="language-label">{locale === 'zh' ? 'EN' : '中'}</span>
    </button>
  );
};

export default LanguageToggle;
