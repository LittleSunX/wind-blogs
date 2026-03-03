import { describe, expect, it } from 'vitest';
import { buildRobotsTxt, buildSitemapXml } from './seoAssets';

describe('seoAssets', () => {
  it('builds sitemap with home and post URLs', () => {
    const sitemap = buildSitemapXml({
      siteUrl: 'https://example.com',
      slugs: ['first-post', 'second-post'],
      lastBuildDate: '2026-03-03',
    });

    expect(sitemap).toContain('<loc>https://example.com/</loc>');
    expect(sitemap).toContain('<loc>https://example.com/post/first-post</loc>');
    expect(sitemap).toContain(
      '<loc>https://example.com/post/second-post</loc>'
    );
  });

  it('builds robots.txt with sitemap declaration', () => {
    const robots = buildRobotsTxt('https://example.com');

    expect(robots).toContain('User-agent: *');
    expect(robots).toContain('Allow: /');
    expect(robots).toContain('Sitemap: https://example.com/sitemap.xml');
  });
});
