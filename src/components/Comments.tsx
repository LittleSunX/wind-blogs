import { useEffect, useRef } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import '../styles/Comments.css';

interface CommentsProps {
    slug: string;
}

// Giscus 配置 - 请在部署前更新这些值
// 访问 https://giscus.app/ 获取您的配置
const GISCUS_CONFIG = {
    repo: 'LittleSunX/wind-blogs', // 替换为您的仓库
    repoId: '', // 替换为您的仓库 ID
    category: 'Announcements', // 替换为您的分类
    categoryId: '', // 替换为您的分类 ID
};

const Comments: React.FC<CommentsProps> = ({ slug }) => {
    const { theme } = useTheme();
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
        script.setAttribute('data-theme', theme === 'dark' ? 'dark_dimmed' : 'light');
        script.setAttribute('data-lang', 'zh-CN');
        script.setAttribute('data-loading', 'lazy');
        script.crossOrigin = 'anonymous';
        script.async = true;
        script.className = 'giscus';

        container.appendChild(script);

        return () => {
            script.remove();
        };
    }, [slug, theme]);

    // 如果配置不完整，显示配置提示
    if (!GISCUS_CONFIG.repoId || !GISCUS_CONFIG.categoryId) {
        return (
            <div className="comments-section">
                <h2 className="comments-title">💬 评论</h2>
                <div className="comments-placeholder">
                    <p>评论功能需要配置 Giscus</p>
                    <p>
                        请访问{' '}
                        <a href="https://giscus.app/" target="_blank" rel="noopener noreferrer">
                            giscus.app
                        </a>{' '}
                        获取配置信息
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="comments-section">
            <h2 className="comments-title">💬 评论</h2>
            <div ref={containerRef} className="giscus-container" />
        </div>
    );
};

export default Comments;
