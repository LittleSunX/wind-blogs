import { render, screen } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import App from './App';
import { I18nProvider } from './contexts/I18nContext';
import { ThemeProvider } from './contexts/ThemeContext';

describe('App routing', () => {
  it('shows not found page for unknown route', async () => {
    render(
      <HelmetProvider>
        <I18nProvider>
          <ThemeProvider>
            <MemoryRouter initialEntries={['/missing-route']}>
              <App />
            </MemoryRouter>
          </ThemeProvider>
        </I18nProvider>
      </HelmetProvider>
    );

    expect(
      await screen.findByText(/Page Not Found|页面不存在|页面未找到/i)
    ).toBeInTheDocument();
  });
});
