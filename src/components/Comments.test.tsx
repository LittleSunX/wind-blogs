import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { I18nProvider } from '../contexts/I18nContext';
import { ThemeProvider } from '../contexts/ThemeContext';
import Comments from './Comments';

vi.mock('../config', () => ({
  appConfig: {
    siteUrl: 'https://wind-blogs.vercel.app',
    siteName: 'Wind Blogs',
    giscus: {
      repo: 'LittleSunX/wind-blogs',
      repoId: '',
      category: 'Announcements',
      categoryId: '',
    },
  },
}));

function renderComments(slug = 'test-slug') {
  return render(
    <I18nProvider>
      <ThemeProvider>
        <Comments slug={slug} />
      </ThemeProvider>
    </I18nProvider>
  );
}

describe('Comments', () => {
  it('shows a configuration placeholder when Giscus is not configured', () => {
    renderComments();

    expect(
      screen.getByRole('heading', { name: /评论|comments/i })
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        /评论功能需要配置 Giscus|Comments require Giscus configuration/i
      )
    ).toBeInTheDocument();
  });

  it('renders a link to giscus.app for setup instructions', () => {
    renderComments();

    const link = screen.getByRole('link', { name: /giscus/i });
    expect(link).toHaveAttribute('href', 'https://giscus.app/');
    expect(link).toHaveAttribute('target', '_blank');
  });
});
