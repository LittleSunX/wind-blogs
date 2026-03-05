import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import MarkdownRenderer from './MarkdownRenderer';

describe('MarkdownRenderer layout', () => {
  it('wraps markdown tables with a scrollable container', () => {
    render(
      <MarkdownRenderer
        content={`| Name | Score |\n| --- | --- |\n| Wind | 100 |`}
      />
    );

    const tableWrap = document.querySelector('.markdown-table-wrap');
    expect(tableWrap).toBeInTheDocument();
    expect(tableWrap?.querySelector('table')).toBeInTheDocument();
  });

  it('renders markdown images in figure with caption text', () => {
    render(
      <MarkdownRenderer
        content={`![Architecture Diagram](https://example.com/diagram.png)`}
      />
    );

    const figure = document.querySelector('.markdown-image-figure');
    expect(figure).toBeInTheDocument();
    expect(figure?.querySelector('img')).toBeInTheDocument();
    expect(figure?.querySelector('figcaption')?.textContent).toContain(
      'Architecture Diagram'
    );
  });
});
