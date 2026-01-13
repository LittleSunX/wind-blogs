import { useState, useEffect } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import {
  getPostBySlug,
  Post as PostType,
  getFirstLetter,
} from '../utils/posts';
import MarkdownRenderer from '../components/MarkdownRenderer';
import SEO from '../components/SEO';
import Comments from '../components/Comments';
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

  return (
    <div className="post">
      <SEO
        title={post.title}
        description={post.excerpt}
        keywords={post.tags || []}
        author={post.author}
        image={post.coverImage}
        type="article"
        publishedTime={post.date}
      />
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
              <span className="post-meta-item reading-time">
                ⏱️ {post.readingTime} 分钟阅读
              </span>
              {post.author && (
                <span className="post-meta-item author">
                  作者: {post.author}
                </span>
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

          <Comments slug={post.slug} />
        </div>
      </article>
    </div>
  );
};

export default Post;
