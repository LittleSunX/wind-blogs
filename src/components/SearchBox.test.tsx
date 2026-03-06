import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { I18nProvider } from '../contexts/I18nContext';
import SearchBox from './SearchBox';

function renderSearchBox(props: {
  value: string;
  onChange: (v: string) => void;
}) {
  return render(
    <I18nProvider>
      <SearchBox {...props} />
    </I18nProvider>
  );
}

describe('SearchBox', () => {
  it('renders an input with the given value', () => {
    renderSearchBox({ value: 'hello', onChange: vi.fn() });
    expect(screen.getByRole('textbox')).toHaveValue('hello');
  });

  it('calls onChange when the user types', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    renderSearchBox({ value: '', onChange });

    await user.type(screen.getByRole('textbox'), 'a');
    expect(onChange).toHaveBeenCalledWith('a');
  });

  it('shows a clear button only when there is a value', () => {
    const onChange = vi.fn();
    const { rerender } = render(
      <I18nProvider>
        <SearchBox value="" onChange={onChange} />
      </I18nProvider>
    );

    expect(screen.queryByRole('button')).not.toBeInTheDocument();

    rerender(
      <I18nProvider>
        <SearchBox value="query" onChange={onChange} />
      </I18nProvider>
    );

    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('clears the value when the clear button is clicked', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    renderSearchBox({ value: 'query', onChange });

    await user.click(screen.getByRole('button'));
    expect(onChange).toHaveBeenCalledWith('');
  });
});
