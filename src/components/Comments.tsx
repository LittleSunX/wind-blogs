import { useEffect, useRef } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useI18n } from '../contexts/I18nContext';
import { appConfig } from '../config';
import '../styles/Comments.css';

interface CommentsProps {
  slug: string;
}

// Giscus 配置由环境变量驱动，默认值见 src/config.ts
const GISCUS_CONFIG = appConfig.giscus;

const Comments: React.FC<CommentsProps> = ({ slug }) => {
  const { theme } = useTheme();
  const { t, locale } = useI18n();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 如果配置不完整，不加载 Giscus
    if (!GISCUS_CONFIG.repoId || !GISCUS_CONFIG.categoryId) {
      return;
    }

    const container = containerRef.current;
    if (!container) return;

    // 清除旧的 Giscus iframe
    const existingScript = container.querySelector('script.giscus');
    if (existingScript) {
      existingScript.remove();
    }
    const existingFrame = container.querySelector('.giscus-frame');
    if (existingFrame) {
      existingFrame.remove();
    }

    // 创建新的 Giscus 脚本
    const script = document.createElement('script');
    script.src = 'https://giscus.app/client.js';
    script.setAttribute('data-repo', GISCUS_CONFIG.repo);
    script.setAttribute('data-repo-id', GISCUS_CONFIG.repoId);
    script.setAttribute('data-category', GISCUS_CONFIG.category);
    script.setAttribute('data-category-id', GISCUS_CONFIG.categoryId);
    script.setAttribute('data-mapping', 'specific');
    script.setAttribute('data-term', slug);
    script.setAttribute('data-strict', '0');
    script.setAttribute('data-reactions-enabled', '1');
    script.setAttribute('data-emit-metadata', '0');
    script.setAttribute('data-input-position', 'top');
    script.setAttribute(
      'data-theme',
      theme === 'dark' ? 'dark_dimmed' : 'light'
    );
    script.setAttribute('data-lang', locale === 'zh' ? 'zh-CN' : 'en');
    script.setAttribute('data-loading', 'lazy');
    script.crossOrigin = 'anonymous';
    script.async = true;
    script.className = 'giscus';

    container.appendChild(script);

    return () => {
      script.remove();
    };
  }, [slug, theme, locale]);

  // 如果配置不完整，显示配置提示
  if (!GISCUS_CONFIG.repoId || !GISCUS_CONFIG.categoryId) {
    return (
      <div className="comments-section">
        <h2 className="comments-title">{t.comments.title}</h2>
        <div className="comments-placeholder">
          <p>{t.comments.configRequired}</p>
          <p>
            {t.comments.configHint}{' '}
            <a
              href="https://giscus.app/"
              target="_blank"
              rel="noopener noreferrer"
            >
              giscus.app
            </a>{' '}
            {t.comments.giscusLink}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="comments-section">
      <h2 className="comments-title">{t.comments.title}</h2>
      <div ref={containerRef} className="giscus-container" />
    </div>
  );
};

export default Comments;
