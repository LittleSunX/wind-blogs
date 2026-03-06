import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { I18nProvider } from '../contexts/I18nContext';
import { ThemeProvider } from '../contexts/ThemeContext';
import ThemeToggle from './ThemeToggle';

function renderThemeToggle() {
  return render(
    <I18nProvider>
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    </I18nProvider>
  );
}

describe('ThemeToggle', () => {
  it('renders a toggle button', () => {
    renderThemeToggle();
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('toggles the data-theme attribute when clicked', async () => {
    const user = userEvent.setup();
    renderThemeToggle();

    const initialTheme =
      document.documentElement.getAttribute('data-theme') ?? 'dark';
    await user.click(screen.getByRole('button'));

    const newTheme = document.documentElement.getAttribute('data-theme');
    expect(newTheme).not.toBe(initialTheme);
  });
});
