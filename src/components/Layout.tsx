import { Link } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import LanguageToggle from './LanguageToggle';
import { useI18n } from '../contexts/I18nContext';
import '../styles/Layout.css';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { t } = useI18n();

  return (
    <div className="layout">
      <a href="#main-content" className="skip-to-content">
        {t.nav.skipToContent}
      </a>
      <header className="header">
        <div className="container">
          <Link to="/" className="logo">
            Wind Blogs
          </Link>
          <nav className="nav">
            <Link to="/">{t.nav.home}</Link>
            <a
              href="/rss.xml"
              target="_blank"
              rel="noopener noreferrer"
              title={t.nav.rss}
            >
              📡 RSS
            </a>
            <a
              href="https://github.com/LittleSunX/wind-blogs"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
            <LanguageToggle />
            <ThemeToggle />
          </nav>
        </div>
      </header>

      <main id="main-content" className="main">
        <div className="container">{children}</div>
      </main>

      <footer className="footer">
        <div className="container">
          <p>{t.footer.copyright}</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
