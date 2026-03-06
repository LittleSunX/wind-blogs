import * as fs from 'fs';
import * as path from 'path';
import matter from 'gray-matter';
import { buildRobotsTxt, buildSitemapXml } from '../src/utils/seoAssets';

const SITE_URL = (
  process.env.VITE_SITE_URL || 'https://wind-blogs.vercel.app'
).replace(/\/+$/, '');

function getPublishedTimestamp(filePath: string): number {
  const raw = fs.readFileSync(filePath, 'utf-8');
  const { data } = matter(raw);
  const dateValue = data.date;

  if (
    dateValue instanceof Date ||
    typeof dateValue === 'string' ||
    typeof dateValue === 'number'
  ) {
    const parsed = new Date(dateValue);
    if (!Number.isNaN(parsed.getTime())) {
      return parsed.getTime();
    }
  }

  return 0;
}

function getPostAssetData(): { slugs: string[]; lastBuildDate: string } {
  const postsDir = path.join(process.cwd(), 'src', 'posts');
  const files = fs
    .readdirSync(postsDir)
    .filter((file) => file.endsWith('.md'))
    .sort((a, b) => a.localeCompare(b));

  let latestPublishedTime = 0;

  const slugs = files.map((file) => {
    const filePath = path.join(postsDir, file);
    latestPublishedTime = Math.max(
      latestPublishedTime,
      getPublishedTimestamp(filePath)
    );

    return file.replace(/\.md$/, '');
  });

  const lastBuildDate =
    latestPublishedTime > 0
      ? new Date(latestPublishedTime).toISOString().slice(0, 10)
      : '1970-01-01';

  return { slugs, lastBuildDate };
}

function writeAsset(filename: string, content: string) {
  const publicPath = path.join(process.cwd(), 'public', filename);
  fs.mkdirSync(path.dirname(publicPath), { recursive: true });
  fs.writeFileSync(publicPath, content, 'utf-8');
  console.log(`SEO asset written: ${publicPath}`);

  const distDir = path.join(process.cwd(), 'dist');
  if (fs.existsSync(distDir)) {
    const distPath = path.join(distDir, filename);
    fs.writeFileSync(distPath, content, 'utf-8');
    console.log(`SEO asset written: ${distPath}`);
  }
}

function main() {
  const { slugs, lastBuildDate } = getPostAssetData();

  const sitemap = buildSitemapXml({
    siteUrl: SITE_URL,
    slugs,
    lastBuildDate,
  });

  const robots = buildRobotsTxt(SITE_URL);

  writeAsset('sitemap.xml', sitemap);
  writeAsset('robots.txt', robots);
}

main();
