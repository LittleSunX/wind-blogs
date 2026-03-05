import * as fs from 'fs';
import * as path from 'path';
import { describe, expect, it } from 'vitest';
import { getAllPosts, getFirstLetter, getPostBySlug } from './posts';

describe('posts utils', () => {
  it('does not inject Buffer polyfill into window', () => {
    const source = fs.readFileSync(
      path.resolve(__dirname, './posts.ts'),
      'utf-8'
    );
    expect(source).not.toMatch(/Buffer\s*=\s*Buffer/);
    expect(source).not.toMatch(/\(window\s+as\s+any\)/);
  });

  it('returns sorted post metadata', async () => {
    const posts = await getAllPosts();

    expect(posts.length).toBeGreaterThan(0);
    for (let index = 1; index < posts.length; index += 1) {
      expect(posts[index - 1].date >= posts[index].date).toBe(true);
    }
  });

  it('returns null for missing slug', async () => {
    const post = await getPostBySlug('not-found-slug');
    expect(post).toBeNull();
  });

  it('returns uppercase first letter', () => {
    expect(getFirstLetter('wind')).toBe('W');
  });
});
