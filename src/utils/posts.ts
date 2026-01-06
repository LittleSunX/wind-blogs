import { Post, PostMetadata } from '../types';

// 使用 Vite 的 import.meta.glob 导入所有 Markdown 文件
const postModules = import.meta.glob('../posts/*.md', { as: 'raw' });

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

      if (currentKey && Array.isArray(data[currentKey])) {
        data[currentKey].push(cleanValue);
      } else if (currentKey) {
        data[currentKey] = [data[currentKey], cleanValue];
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
