import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { HelmetProvider } from 'react-helmet-async';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import { I18nProvider } from '../contexts/I18nContext';
import Home from './Home';

const routerFuture = {
  v7_startTransition: true,
  v7_relativeSplatPath: true,
} as const;

vi.mock('../utils/posts', () => ({
  getAllPosts: async () =>
    Array.from({ length: 8 }, (_, index) => ({
      slug: `p${index + 1}`,
      title: `Post ${index + 1}`,
      date: `2026-01-${String(index + 1).padStart(2, '0')}`,
      excerpt: `Excerpt ${index + 1}`,
      readingTime: 1,
      tags: ['a', 'b'],
      category: 'Cat',
    })),
  getFirstLetter: (title: string) => title.charAt(0).toUpperCase(),
}));

describe('Home editorial layout', () => {
  it('marks first card as featured for editorial grid', async () => {
    const { container } = render(
      <HelmetProvider>
        <I18nProvider>
          <MemoryRouter future={routerFuture}>
            <Home />
          </MemoryRouter>
        </I18nProvider>
      </HelmetProvider>
    );

    await waitFor(() => {
      expect(container.querySelectorAll('.post-card').length).toBeGreaterThan(
        1
      );
    });

    const cards = Array.from(container.querySelectorAll('.post-card'));
    expect(cards[0]).toHaveClass('is-featured');
    expect(cards[1]).not.toHaveClass('is-featured');
  });

  it('keeps featured card fixed when switching pages', async () => {
    const user = userEvent.setup();

    render(
      <HelmetProvider>
        <I18nProvider>
          <MemoryRouter future={routerFuture}>
            <Home />
          </MemoryRouter>
        </I18nProvider>
      </HelmetProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Post 1')).toBeInTheDocument();
    });

    const nextPageButton = await screen.findByRole('button', { name: /next/i });
    await user.click(nextPageButton);

    await waitFor(() => {
      const featuredTitle = document.querySelector(
        '.post-card.is-featured .post-card-title'
      );
      expect(featuredTitle?.textContent).toContain('Post 1');
    });
  });
});
