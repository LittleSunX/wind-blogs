import * as fs from 'fs';
import * as path from 'path';
import matter from 'gray-matter';
import { Post, PostMetadata } from '../src/types';

function calculateReadingTime(content: string): number {
  const plainText = content
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`[^`]+`/g, '')
    .replace(/#{1,6}\s/g, '')
    .replace(/[*_~]+/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '')
    .replace(/\n+/g, ' ')
    .trim();

  const chineseChars = (plainText.match(/[\u4e00-\u9fff]/g) || []).length;
  const nonChineseText = plainText.replace(/[\u4e00-\u9fff]/g, ' ');
  const englishWords = nonChineseText
    .split(/\s+/)
    .filter((word) => word.length > 0).length;

  const chineseTime = chineseChars / 300;
  const englishTime = englishWords / 200;
  const totalMinutes = Math.ceil(chineseTime + englishTime);
  return Math.max(1, totalMinutes);
}

function normalizeDate(dateValue: unknown): string {
  if (
    dateValue instanceof Date ||
    typeof dateValue === 'string' ||
    typeof dateValue === 'number'
  ) {
    const parsedDate = new Date(dateValue);
    if (!Number.isNaN(parsedDate.getTime())) {
      return parsedDate.toISOString().split('T')[0];
    }
  }

  return new Date().toISOString().split('T')[0];
}

function parsePost(slug: string, rawContent: string): Post {
  const { data, content } = matter(rawContent);

  return {
    slug,
    title: (data.title as string) || 'Untitled',
    date: normalizeDate(data.date),
    excerpt:
      (data.excerpt as string) ||
      `${content.slice(0, 150).trimEnd()}${content.length > 150 ? '...' : ''}`,
    author: data.author as string | undefined,
    category: data.category as string | undefined,
    tags: Array.isArray(data.tags) ? (data.tags as string[]) : [],
    coverImage: data.coverImage as string | undefined,
    readingTime: calculateReadingTime(content),
    content,
  };
}

function writeJson(filePath: string, data: unknown) {
  fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`, 'utf-8');
}

function main() {
  const rootDir = process.cwd();
  const postsDir = path.join(rootDir, 'src', 'posts');
  const generatedRoot = path.join(rootDir, 'src', 'generated');
  const generatedPostsDir = path.join(generatedRoot, 'posts');
  const generatedMetadataPath = path.join(
    generatedRoot,
    'posts-metadata.generated.json'
  );

  fs.mkdirSync(generatedPostsDir, { recursive: true });

  for (const filename of fs.readdirSync(generatedPostsDir)) {
    if (filename.endsWith('.generated.json')) {
      fs.unlinkSync(path.join(generatedPostsDir, filename));
    }
  }

  const posts: Post[] = fs
    .readdirSync(postsDir)
    .filter((file) => file.endsWith('.md'))
    .map((file) => {
      const slug = file.replace(/\.md$/, '');
      const filePath = path.join(postsDir, file);
      const rawContent = fs.readFileSync(filePath, 'utf-8');
      return parsePost(slug, rawContent);
    });

  posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const metadata: PostMetadata[] = posts.map((post) => ({
    slug: post.slug,
    title: post.title,
    date: post.date,
    excerpt: post.excerpt,
    author: post.author,
    tags: post.tags,
    category: post.category,
    coverImage: post.coverImage,
    readingTime: post.readingTime,
  }));

  writeJson(generatedMetadataPath, metadata);

  for (const post of posts) {
    const generatedPostPath = path.join(
      generatedPostsDir,
      `${post.slug}.generated.json`
    );
    writeJson(generatedPostPath, post);
  }

  console.log(
    `Generated post index: ${metadata.length} metadata item(s), ${posts.length} post payload(s).`
  );
}

main();
