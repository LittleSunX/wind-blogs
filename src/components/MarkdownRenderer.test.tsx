import * as fs from 'fs';
import * as path from 'path';
import { describe, expect, it } from 'vitest';

describe('MarkdownRenderer source', () => {
  it('uses prism-light instead of full syntax-highlighter bundle', () => {
    const source = fs.readFileSync(
      path.resolve(__dirname, './MarkdownRenderer.tsx'),
      'utf-8'
    );

    expect(source).toContain('dist/esm/prism-light');
    expect(source).not.toContain("import('react-syntax-highlighter')");
  });
});
