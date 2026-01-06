import { useState, useEffect } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { getPostBySlug, Post as PostType } from '../utils/posts';
import MarkdownRenderer from '../components/MarkdownRenderer';
import '../styles/Post.css';

const Post = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<PostType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPost = async () => {
      if (slug) {
        const postData = await getPostBySlug(slug);
        setPost(postData);
      }
      setLoading(false);
    };
    loadPost();
  }, [slug]);

  if (loading) {
    return <div className="post">Loading...</div>;
  }

  if (!post) {
    return <Navigate to="/" replace />;
  }

  // 获取文章首字母作为占位符
  const getFirstLetter = (title: string) => {
    return title.charAt(0).toUpperCase();
  };

  return (
    <div className="post">
      <Link to="/" className="post-back-link">
        返回首页
      </Link>

      <article className="post-article">
        {post.coverImage ? (
          <img
            src={post.coverImage}
            alt={post.title}
            className="post-cover-image"
          />
        ) : (
          <div className="post-cover-placeholder">
            {getFirstLetter(post.title)}
          </div>
        )}

        <div className="post-content-wrapper">
          <header className="post-header">
            <h1 className="post-title">{post.title}</h1>
            <div className="post-meta">
              <time dateTime={post.date} className="post-meta-item date">
                {post.date}
              </time>
              {post.author && (
                <span className="post-meta-item author">作者: {post.author}</span>
              )}
              {post.category && (
                <span className="post-category-badge">{post.category}</span>
              )}
            </div>
            {post.tags && post.tags.length > 0 && (
              <div className="post-tags">
                {post.tags.map((tag) => (
                  <span key={tag} className="post-tag-badge">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </header>

          <div className="post-content">
            <MarkdownRenderer content={post.content} />
          </div>
        </div>
      </article>
    </div>
  );
};

export default Post;
