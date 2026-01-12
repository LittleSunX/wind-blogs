import * as fs from 'fs';
import * as path from 'path';

// 配置
const SITE_URL = 'https://wind-blogs.vercel.app'; // 请根据实际部署地址修改
const SITE_TITLE = 'Wind Blogs';
const SITE_DESCRIPTION = '分享编程知识、技术心得和项目经验的技术博客';

interface PostData {
    slug: string;
    title: string;
    date: string;
    excerpt: string;
    author?: string;
}

// 简单的 frontmatter 解析器
function parseFrontmatter(content: string): { data: Record<string, any>; content: string } {
    const frontmatterRegex = /^---\n([\s\S]+?)\n---\n([\s\S]*)$/;
    const match = content.match(frontmatterRegex);

    if (!match) {
        return { data: {}, content };
    }

    const frontmatterText = match[1];
    const bodyContent = match[2];

    const data: Record<string, any> = {};
    const lines = frontmatterText.split('\n');

    for (const line of lines) {
        const trimmedLine = line.trim();
        if (!trimmedLine || trimmedLine.startsWith('-')) continue;

        const colonIndex = trimmedLine.indexOf(':');
        if (colonIndex === -1) continue;

        const key = trimmedLine.slice(0, colonIndex).trim();
        let value = trimmedLine.slice(colonIndex + 1).trim();

        // 移除引号
        if ((value.startsWith('"') && value.endsWith('"')) ||
            (value.startsWith("'") && value.endsWith("'"))) {
            value = value.slice(1, -1);
        }

        data[key] = value;
    }

    return { data, content: bodyContent.trim() };
}

// 读取所有文章
function getAllPosts(): PostData[] {
    const postsDir = path.join(process.cwd(), 'src', 'posts');
    const files = fs.readdirSync(postsDir).filter(file => file.endsWith('.md'));

    const posts: PostData[] = [];

    for (const file of files) {
        const filePath = path.join(postsDir, file);
        const content = fs.readFileSync(filePath, 'utf-8');
        const { data, content: bodyContent } = parseFrontmatter(content);

        const slug = file.replace('.md', '');
        posts.push({
            slug,
            title: data.title || 'Untitled',
            date: data.date || new Date().toISOString().split('T')[0],
            excerpt: data.excerpt || bodyContent.slice(0, 150) + '...',
            author: data.author,
        });
    }

    // 按日期降序排序
    posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return posts;
}

// 转义 XML 特殊字符
function escapeXml(str: string): string {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}

// 生成 RSS XML
function generateRss(posts: PostData[]): string {
    const items = posts
        .slice(0, 20) // 只包含最新的 20 篇文章
        .map(post => {
            const postUrl = `${SITE_URL}/post/${post.slug}`;
            const pubDate = new Date(post.date).toUTCString();

            return `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${postUrl}</link>
      <guid isPermaLink="true">${postUrl}</guid>
      <description>${escapeXml(post.excerpt)}</description>
      <pubDate>${pubDate}</pubDate>
      ${post.author ? `<author>${escapeXml(post.author)}</author>` : ''}
    </item>`;
        })
        .join('');

    return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(SITE_TITLE)}</title>
    <link>${SITE_URL}</link>
    <description>${escapeXml(SITE_DESCRIPTION)}</description>
    <language>zh-CN</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml"/>
    ${items}
  </channel>
</rss>`;
}

// 主函数
function main() {
    console.log('正在生成 RSS feed...');

    const posts = getAllPosts();
    console.log(`找到 ${posts.length} 篇文章`);

    const rss = generateRss(posts);

    // 输出到 public 目录（开发时）和 dist 目录（构建后）
    const publicPath = path.join(process.cwd(), 'public', 'rss.xml');
    const distPath = path.join(process.cwd(), 'dist', 'rss.xml');

    // 确保目录存在
    fs.mkdirSync(path.dirname(publicPath), { recursive: true });
    fs.writeFileSync(publicPath, rss, 'utf-8');
    console.log(`RSS 已写入: ${publicPath}`);

    // 如果 dist 目录存在，也写入到那里
    if (fs.existsSync(path.join(process.cwd(), 'dist'))) {
        fs.writeFileSync(distPath, rss, 'utf-8');
        console.log(`RSS 已写入: ${distPath}`);
    }

    console.log('RSS 生成完成!');
}

main();
