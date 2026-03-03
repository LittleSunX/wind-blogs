import { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import ErrorBoundary from './components/ErrorBoundary';
import { useI18n } from './contexts/I18nContext';

const Home = lazy(() => import('./pages/Home'));
const Post = lazy(() => import('./pages/Post'));
const NotFound = lazy(() => import('./pages/NotFound'));

function App() {
  const { t } = useI18n();

  return (
    <ErrorBoundary>
      <Layout>
        <Suspense fallback={<div>{t.common.loading}</div>}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/post/:slug" element={<Post />} />
            <Route path="/404" element={<NotFound />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </Layout>
    </ErrorBoundary>
  );
}

export default App;
