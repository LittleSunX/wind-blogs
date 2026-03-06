import { Helmet } from 'react-helmet-async';
import { appConfig } from '../config';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  author?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  publishedTime?: string;
}

function resolveImageUrl(image: string): string {
  if (/^https?:\/\//i.test(image)) {
    return image;
  }
  if (image.startsWith('/')) {
    return `${appConfig.siteUrl}${image}`;
  }
  return `${appConfig.siteUrl}/${image}`;
}

const SEO: React.FC<SEOProps> = ({
  title = appConfig.siteName,
  description,
  keywords = [],
  author = 'Wind',
  image,
  url,
  type = 'website',
  publishedTime,
}) => {
  const siteName = appConfig.siteName;
  const fullTitle = title === siteName ? title : `${title} | ${siteName}`;
  const canonicalUrl =
    url ??
    (typeof window !== 'undefined'
      ? `${appConfig.siteUrl}${window.location.pathname}`
      : undefined);
  const jsonLd =
    type === 'article'
      ? {
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: title,
          description,
          ...(canonicalUrl
            ? { url: canonicalUrl, mainEntityOfPage: canonicalUrl }
            : {}),
          ...(publishedTime ? { datePublished: publishedTime } : {}),
          ...(image ? { image: [resolveImageUrl(image)] } : {}),
          author: {
            '@type': 'Person',
            name: author,
          },
        }
      : {
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: siteName,
          url: appConfig.siteUrl,
          description,
        };

  return (
    <Helmet>
      {/* 基础 Meta 标签 */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords.join(', ')} />
      <meta name="author" content={author} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:site_name" content={siteName} />
      {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}
      {image && <meta property="og:image" content={image} />}
      {publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}

      {/* Twitter Card */}
      <meta
        name="twitter:card"
        content={image ? 'summary_large_image' : 'summary'}
      />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      {image && <meta name="twitter:image" content={image} />}

      {/* 其他 SEO 相关 */}
      <meta name="robots" content="index, follow" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
      <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
    </Helmet>
  );
};

export default SEO;
