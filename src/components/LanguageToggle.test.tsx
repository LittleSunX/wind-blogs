import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { I18nProvider } from '../contexts/I18nContext';
import LanguageToggle from './LanguageToggle';

function renderLanguageToggle() {
  return render(
    <I18nProvider>
      <LanguageToggle />
    </I18nProvider>
  );
}

describe('LanguageToggle', () => {
  it('renders a toggle button with a language label', () => {
    renderLanguageToggle();
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button.textContent).toMatch(/EN|中/);
  });

  it('switches the label text when clicked', async () => {
    const user = userEvent.setup();
    renderLanguageToggle();

    const button = screen.getByRole('button');
    const labelBefore = button.textContent;

    await user.click(button);

    expect(button.textContent).not.toBe(labelBefore);
  });
});
