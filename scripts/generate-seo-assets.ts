import * as fs from 'fs';
import * as path from 'path';
import { buildRobotsTxt, buildSitemapXml } from '../src/utils/seoAssets';

const SITE_URL = (
  process.env.VITE_SITE_URL || 'https://wind-blogs.vercel.app'
).replace(/\/+$/, '');

function getPostSlugs(): string[] {
  const postsDir = path.join(process.cwd(), 'src', 'posts');
  return fs
    .readdirSync(postsDir)
    .filter((file) => file.endsWith('.md'))
    .map((file) => file.replace(/\.md$/, ''));
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
  const slugs = getPostSlugs();
  const lastBuildDate = new Date().toISOString().slice(0, 10);
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
