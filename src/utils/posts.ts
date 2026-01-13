import matter from 'gray-matter';
import { Post, PostMetadata } from '../types';
import { Buffer } from 'buffer';
(window as any).Buffer = Buffer;

// 重新导出类型供其他模块使用
export type { Post, PostMetadata };

// 使用 Vite 的 import.meta.glob 导入所有 Markdown 文件
const postModules = import.meta.glob('../posts/*.md', { as: 'raw' });

// 缓存已加载的文章
let postsCache: PostMetadata[] | null = null;

// 获取文章首字母作为占位符
export function getFirstLetter(title: string): string {
  return title.charAt(0).toUpperCase();
}

// 计算阅读时间（分钟）
// 中文按每分钟 300 字，英文按每分钟 200 词
function calculateReadingTime(content: string): number {
  // 去除 Markdown 语法
  const plainText = content
    .replace(/```[\s\S]*?```/g, '') // 移除代码块
    .replace(/`[^`]+`/g, '') // 移除行内代码
    .replace(/#{1,6}\s/g, '') // 移除标题标记
    .replace(/[*_~]+/g, '') // 移除强调标记
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // 移除链接，保留文本
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '') // 移除图片
    .replace(/\n+/g, ' ') // 换行替换为空格
    .trim();

  // 统计中文字符
  const chineseChars = (plainText.match(/[\u4e00-\u9fff]/g) || []).length;

  // 统计英文单词（非中文字符的单词）
  const nonChineseText = plainText.replace(/[\u4e00-\u9fff]/g, ' ');
  const englishWords = nonChineseText
    .split(/\s+/)
    .filter((word) => word.length > 0).length;

  // 计算阅读时间
  const chineseTime = chineseChars / 300; // 每分钟 300 中文字
  const englishTime = englishWords / 200; // 每分钟 200 英文词

  const totalMinutes = Math.ceil(chineseTime + englishTime);
  return Math.max(1, totalMinutes); // 至少 1 分钟
}

// 解析 frontmatter 和内容
async function parsePostFile(slug: string, content: string): Promise<Post> {
  const { data, content: markdownContent } = matter(content);

  return {
    slug,
    title: data.title || 'Untitled',
    date: data.date
      ? new Date(data.date).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0],
    excerpt: data.excerpt || markdownContent.slice(0, 150) + '...',
    author: data.author,
    category: data.category,
    tags: Array.isArray(data.tags) ? data.tags : [],
    coverImage: data.coverImage,
    readingTime: calculateReadingTime(markdownContent),
    content: markdownContent,
  };
}

// 获取所有文章的元数据
export async function getAllPosts(): Promise<PostMetadata[]> {
  // 返回缓存的结果（如果存在）
  if (postsCache) {
    return postsCache;
  }

  const posts: PostMetadata[] = [];

  try {
    for (const path in postModules) {
      const slug = path.match(/\/posts\/(.+)\.md$/)?.[1];
      if (slug) {
        try {
          const content = (await postModules[path]()) as unknown as string;
          const post = await parsePostFile(slug, content);
          posts.push({
            slug: post.slug,
            title: post.title,
            date: post.date,
            excerpt: post.excerpt,
            author: post.author,
            tags: post.tags,
            category: post.category,
            coverImage: post.coverImage,
            readingTime: post.readingTime,
          });
        } catch (error) {
          console.error(`Error loading post ${slug}:`, error);
        }
      }
    }

    // 按日期降序排序
    posts.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    // 缓存结果
    postsCache = posts;

    return posts;
  } catch (error) {
    console.error('Error loading posts:', error);
    return [];
  }
}

// 根据 slug 获取单篇文章
export async function getPostBySlug(slug: string): Promise<Post | null> {
  const path = `../posts/${slug}.md`;

  if (!(path in postModules)) {
    return null;
  }

  const content = (await postModules[path]()) as unknown as string;
  return parsePostFile(slug, content);
}

// 获取所有文章分类
export async function getCategories(): Promise<string[]> {
  const posts = await getAllPosts();
  const categories = posts
    .map((post) => post.category)
    .filter((category): category is string => category !== undefined);
  return [...new Set(categories)];
}

// 获取所有标签
export async function getTags(): Promise<string[]> {
  const posts = await getAllPosts();
  const tags = posts.flatMap((post) => post.tags || []);
  return [...new Set(tags)];
}
