import { describe, expect, it } from 'vitest';
import { createAppConfig } from './config';

describe('createAppConfig', () => {
  it('uses defaults when environment variables are missing', () => {
    const config = createAppConfig({});

    expect(config.siteName).toBe('Wind Blogs');
    expect(config.siteUrl).toBe('https://wind-blogs.vercel.app');
    expect(config.giscus.repo).toBe('LittleSunX/wind-blogs');
    expect(config.giscus.category).toBe('Announcements');
  });

  it('trims trailing slash from site URL', () => {
    const config = createAppConfig({
      VITE_SITE_URL: 'https://example.com/',
    });

    expect(config.siteUrl).toBe('https://example.com');
  });

  it('throws when site URL is invalid', () => {
    expect(() =>
      createAppConfig({
        VITE_SITE_URL: 'not-a-valid-url',
      })
    ).toThrowError(/Invalid application configuration/);
  });
});
