import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllPosts, PostMetadata } from '../utils/posts';
import '../styles/Home.css';

const Home = () => {
  const [posts, setPosts] = useState<PostMetadata[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPosts = async () => {
      const postsData = await getAllPosts();
      setPosts(postsData);
      setLoading(false);
    };
    loadPosts();
  }, []);

  if (loading) {
    return <div className="home">Loading...</div>;
  }

  // 获取文章首字母作为占位符
  const getFirstLetter = (title: string) => {
    return title.charAt(0).toUpperCase();
  };

  return (
    <div className="home">
      <section className="hero">
        <div className="hero-content">
          <h1>欢迎来到 Wind Blogs</h1>
          <p>分享编程知识、技术心得和项目经验</p>
        </div>
      </section>

      <section className="posts-section">
        <h2>最新文章</h2>
        <div className="posts-list">
          {posts.map((post) => (
            <Link key={post.slug} to={`/post/${post.slug}`} className="post-card-link">
              <article className="post-card">
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
                  <div className="post-card-header">
                    <h3 className="post-card-title">{post.title}</h3>
                  </div>
                  <time className="post-card-date">{post.date}</time>
                  <p className="post-card-excerpt">{post.excerpt}</p>
                  <div className="post-card-meta">
                    {post.category && (
                      <span className="post-category">{post.category}</span>
                    )}
                    {post.tags && (
                      <div className="post-tags">
                        {post.tags.slice(0, 3).map((tag) => (
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
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
