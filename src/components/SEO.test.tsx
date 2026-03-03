import { render, waitFor } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';
import { beforeEach, describe, expect, it } from 'vitest';
import SEO from './SEO';

describe('SEO', () => {
  beforeEach(() => {
    document.head.innerHTML = '';
  });

  it('uses configured site URL to build canonical URL when url prop is not provided', async () => {
    window.history.pushState({}, '', '/post/sample-slug');

    render(
      <HelmetProvider>
        <SEO title="Sample Post" description="sample" />
      </HelmetProvider>
    );

    await waitFor(() => {
      const canonical = document.head.querySelector('link[rel="canonical"]');
      expect(canonical).not.toBeNull();
      expect(canonical?.getAttribute('href')).toBe(
        'https://wind-blogs.vercel.app/post/sample-slug'
      );
    });
  });

  it('emits WebSite JSON-LD for default website pages', async () => {
    render(
      <HelmetProvider>
        <SEO title="Wind Blogs" description="site description" />
      </HelmetProvider>
    );

    await waitFor(() => {
      const jsonLdScript = document.head.querySelector(
        'script[type="application/ld+json"]'
      );
      expect(jsonLdScript).not.toBeNull();
      expect(jsonLdScript?.textContent).toContain('"@type":"WebSite"');
    });
  });
});
