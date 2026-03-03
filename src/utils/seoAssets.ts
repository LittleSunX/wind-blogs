function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function toUrl(base: string, pathname: string): string {
  const normalizedBase = base.replace(/\/+$/, '');
  return `${normalizedBase}${pathname}`;
}

interface BuildSitemapXmlInput {
  siteUrl: string;
  slugs: string[];
  lastBuildDate?: string;
}

export function buildSitemapXml({
  siteUrl,
  slugs,
  lastBuildDate,
}: BuildSitemapXmlInput): string {
  const dateValue = lastBuildDate ?? new Date().toISOString().slice(0, 10);
  const urls = ['/', ...slugs.map((slug) => `/post/${slug}`)];

  const entries = urls
    .map(
      (pathname) => `  <url>
    <loc>${escapeXml(toUrl(siteUrl, pathname))}</loc>
    <lastmod>${dateValue}</lastmod>
  </url>`
    )
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries}
</urlset>`;
}

export function buildRobotsTxt(siteUrl: string): string {
  const normalized = siteUrl.replace(/\/+$/, '');
  return `User-agent: *
Allow: /

Sitemap: ${normalized}/sitemap.xml
`;
}
