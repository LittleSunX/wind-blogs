import { describe, expect, it } from 'vitest';
import { validatePostFrontmatter } from './postValidation';

describe('validatePostFrontmatter', () => {
  it('reports missing title', () => {
    const issues = validatePostFrontmatter({
      filePath: 'src/posts/example.md',
      slug: 'example',
      frontmatter: {
        date: '2025-01-01',
      },
      fileExists: () => true,
    });

    expect(issues).toContain(
      'title is required and must be a non-empty string'
    );
  });

  it('reports invalid date format', () => {
    const issues = validatePostFrontmatter({
      filePath: 'src/posts/example.md',
      slug: 'example',
      frontmatter: {
        title: 'Example',
        date: '2025/01/01',
      },
      fileExists: () => true,
    });

    expect(issues).toContain('date must be in YYYY-MM-DD format');
  });

  it('accepts date parsed as Date object by gray-matter', () => {
    const issues = validatePostFrontmatter({
      filePath: 'src/posts/example.md',
      slug: 'example',
      frontmatter: {
        title: 'Example',
        date: new Date('2025-01-01T00:00:00.000Z'),
      },
      fileExists: () => true,
    });

    expect(issues).toHaveLength(0);
  });

  it('reports missing local cover image', () => {
    const issues = validatePostFrontmatter({
      filePath: 'src/posts/example.md',
      slug: 'example',
      frontmatter: {
        title: 'Example',
        date: '2025-01-01',
        coverImage: '/images/missing.jpg',
      },
      fileExists: () => false,
    });

    expect(issues).toContain(
      'coverImage points to a missing file in public directory: /images/missing.jpg'
    );
  });

  it('accepts valid frontmatter', () => {
    const issues = validatePostFrontmatter({
      filePath: 'src/posts/example.md',
      slug: 'example',
      frontmatter: {
        title: 'Example',
        date: '2025-01-01',
        excerpt: 'A short summary',
        tags: ['React', 'TypeScript'],
      },
      fileExists: () => true,
    });

    expect(issues).toHaveLength(0);
  });
});
