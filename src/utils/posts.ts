import { Post, PostMetadata } from '../types';

// 重新导出类型供其他模块使用
export type { Post, PostMetadata };

// 使用 Vite 的 import.meta.glob 导入所有 Markdown 文件
const postModules = import.meta.glob('../posts/*.md', { as: 'raw' });

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
  const englishWords = nonChineseText.split(/\s+/).filter(word => word.length > 0).length;

  // 计算阅读时间
  const chineseTime = chineseChars / 300; // 每分钟 300 中文字
  const englishTime = englishWords / 200; // 每分钟 200 英文词

  const totalMinutes = Math.ceil(chineseTime + englishTime);
  return Math.max(1, totalMinutes); // 至少 1 分钟
}

// 简单的 frontmatter 解析器
function parseFrontmatter(content: string) {
  const frontmatterRegex = /^---\n([\s\S]+?)\n---\n([\s\S]*)$/;
  const match = content.match(frontmatterRegex);

  if (!match) {
    return {
      data: {},
      content: content,
    };
  }

  const frontmatterText = match[1];
  const bodyContent = match[2];

  // 解析 YAML 格式的 frontmatter
  const data: Record<string, any> = {};
  const lines = frontmatterText.split('\n');
  let currentKey = '';

  for (const line of lines) {
    const trimmedLine = line.trim();

    // 跳过空行
    if (!trimmedLine) continue;

    // 检查是否是数组项
    if (trimmedLine.startsWith('- ')) {
      const value = trimmedLine.slice(2).trim();
      // 移除引号
      const cleanValue = ((value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'")))
        ? value.slice(1, -1)
        : value;

      // 跳过空值
      if (!cleanValue) continue;

      if (currentKey && Array.isArray(data[currentKey])) {
        data[currentKey].push(cleanValue);
      } else if (currentKey) {
        // 如果当前值是空字符串，直接开始新数组
        if (data[currentKey] === '') {
          data[currentKey] = [cleanValue];
        } else {
          data[currentKey] = [data[currentKey], cleanValue];
        }
      }
      continue;
    }

    const colonIndex = trimmedLine.indexOf(':');
    if (colonIndex === -1) continue;

    const key = trimmedLine.slice(0, colonIndex).trim();
    const value = trimmedLine.slice(colonIndex + 1).trim();

    currentKey = key;

    // 移除引号
    const cleanValue = ((value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'")))
      ? value.slice(1, -1)
      : value;

    data[key] = cleanValue;
  }

  return {
    data,
    content: bodyContent.trim(),
  };
}

// 解析 frontmatter 和内容
async function parsePostFile(slug: string, content: string): Promise<Post> {
  const { data, content: markdownContent } = parseFrontmatter(content);

  return {
    slug,
    title: data.title || 'Untitled',
    date: data.date || new Date().toISOString().split('T')[0],
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
  const posts: PostMetadata[] = [];

  for (const path in postModules) {
    const slug = path.match(/\/posts\/(.+)\.md$/)?.[1];
    if (slug) {
      const content = await postModules[path]() as unknown as string;
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
    }
  }

  // 按日期降序排序
  posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return posts;
}

// 根据 slug 获取单篇文章
export async function getPostBySlug(slug: string): Promise<Post | null> {
  const path = `../posts/${slug}.md`;

  if (!(path in postModules)) {
    return null;
  }

  const content = await postModules[path]() as unknown as string;
  return parsePostFile(slug, content);
}

// 获取所有文章分类
export async function getCategories(): Promise<string[]> {
  const posts = await getAllPosts();
  const categories = posts
    .map(post => post.category)
    .filter((category): category is string => category !== undefined);
  return [...new Set(categories)];
}

// 获取所有标签
export async function getTags(): Promise<string[]> {
  const posts = await getAllPosts();
  const tags = posts.flatMap(post => post.tags || []);
  return [...new Set(tags)];
}
