import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getAllPosts, PostMetadata, getFirstLetter } from '../utils/posts';
import SearchBox from '../components/SearchBox';
import SEO from '../components/SEO';
import { useI18n } from '../contexts/I18nContext';
import '../styles/Home.css';

const POSTS_PER_PAGE = 6;

const Home = () => {
  const { t, locale } = useI18n();
  const [posts, setPosts] = useState<PostMetadata[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const loadPosts = async () => {
      const postsData = await getAllPosts();
      setPosts(postsData);
      setLoading(false);
    };
    loadPosts();
  }, []);

  const fixedFeaturedPost = posts[0] ?? null;

  const filteredPosts = useMemo(() => {
    if (!searchQuery.trim()) {
      return posts;
    }
    const query = searchQuery.toLowerCase();
    return posts.filter(
      (post) =>
        post.title.toLowerCase().includes(query) ||
        post.excerpt.toLowerCase().includes(query) ||
        post.category?.toLowerCase().includes(query) ||
        post.tags?.some((tag) => tag.toLowerCase().includes(query))
    );
  }, [posts, searchQuery]);

  const regularSourcePosts = useMemo(() => {
    if (!fixedFeaturedPost) {
      return filteredPosts;
    }

    return filteredPosts.filter((post) => post.slug !== fixedFeaturedPost.slug);
  }, [filteredPosts, fixedFeaturedPost]);

  const totalPages = Math.ceil(regularSourcePosts.length / POSTS_PER_PAGE);
  const paginatedRegularPosts = useMemo(() => {
    const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
    return regularSourcePosts.slice(startIndex, startIndex + POSTS_PER_PAGE);
  }, [regularSourcePosts, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  if (loading) {
    return <div className="home">{t.common.loading}</div>;
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const featuredLabel = locale === 'zh' ? '精选' : 'Featured';

  const renderPostCard = (post: PostMetadata, isFeatured = false) => {
    const cardClasses = `post-card${isFeatured ? ' is-featured' : ''}`;
    const linkClasses = `post-card-link${isFeatured ? ' is-featured' : ''}`;

    return (
      <Link key={post.slug} to={`/post/${post.slug}`} className={linkClasses}>
        <article className={cardClasses}>
          {post.coverImage ? (
            <img
              src={post.coverImage}
              alt={post.title}
              className="post-card-cover"
            />
          ) : (
            <div className="post-card-placeholder">
              {getFirstLetter(post.title)}
            </div>
          )}
          <div className="post-card-content">
            {isFeatured && (
              <span className="post-featured-badge">{featuredLabel}</span>
            )}
            <div className="post-card-header">
              <h3 className="post-card-title">{post.title}</h3>
            </div>
            <div className="post-card-info">
              <time className="post-card-date">{post.date}</time>
              <span className="post-card-reading-time">
                ⏱️ {post.readingTime} {t.common.minuteRead}
              </span>
            </div>
            <p className="post-card-excerpt">{post.excerpt}</p>
            <div className="post-card-meta">
              {post.category && (
                <span className="post-category">{post.category}</span>
              )}
              {post.tags && (
                <div className="post-tags">
                  {post.tags.slice(0, isFeatured ? 4 : 3).map((tag) => (
                    <span key={tag} className="post-tag">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </article>
      </Link>
    );
  };

  return (
    <div className="home">
      <SEO
        title="Wind Blogs"
        description="分享编程知识、技术心得和项目经验的技术博客"
        keywords={[
          '技术博客',
          '前端开发',
          'React',
          'TypeScript',
          'JavaScript',
          '编程教程',
        ]}
      />

      <header className="home-header">
        <div className="home-header-content">
          <h1>{t.home.title}</h1>
          <p className="home-subtitle">{t.home.subtitle}</p>
        </div>
        <SearchBox
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder={t.home.searchPlaceholder}
        />
      </header>

      <section className="posts-section">
        {filteredPosts.length === 0 ? (
          <div className="no-results">
            <p>{t.common.noResults}</p>
            <button className="clear-search" onClick={() => setSearchQuery('')}>
              {t.common.clearSearch}
            </button>
          </div>
        ) : (
          <>
            <div className="posts-list posts-list--editorial">
              {fixedFeaturedPost && (
                <div className="featured-slot">
                  {renderPostCard(fixedFeaturedPost, true)}
                </div>
              )}
              {paginatedRegularPosts.length > 0 && (
                <div className="regular-grid">
                  {paginatedRegularPosts.map((post) => renderPostCard(post))}
                </div>
              )}
            </div>

            {totalPages > 1 && (
              <div className="pagination">
                <button
                  className="pagination-btn"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  {t.pagination.prev}
                </button>

                <div className="pagination-pages">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        key={page}
                        className={`pagination-page ${currentPage === page ? 'active' : ''}`}
                        onClick={() => handlePageChange(page)}
                      >
                        {page}
                      </button>
                    )
                  )}
                </div>

                <button
                  className="pagination-btn"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  {t.pagination.next}
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
};

export default Home;
