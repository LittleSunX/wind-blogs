import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { useI18n } from '../contexts/I18nContext';
import '../styles/NotFound.css';

const NotFound: React.FC = () => {
  const { t } = useI18n();

  return (
    <section className="not-found-page">
      <SEO
        title={`404 | ${t.notFound.title}`}
        description={t.notFound.description}
      />
      <h1 className="not-found-title">404</h1>
      <h2>{t.notFound.title}</h2>
      <p>{t.notFound.description}</p>
      <Link to="/" className="not-found-link">
        {t.notFound.backHome}
      </Link>
    </section>
  );
};

export default NotFound;
