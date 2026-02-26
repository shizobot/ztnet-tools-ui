import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { Toggle } from '../../components/ui/Toggle';

describe('Toggle', () => {
  it('renders label/hint and calls onChange with checkbox state', () => {
    const onChange = vi.fn();

    render(
      <Toggle
        checked={false}
        onChange={onChange}
        label="Auto-assign"
        hint="Enable this mode"
        id="auto"
      />,
    );

    expect(screen.getAllByText('Auto-assign')).toHaveLength(2);
    expect(screen.getByText('Enable this mode')).toBeDefined();

    fireEvent.click(screen.getByRole('checkbox'));

    expect(onChange).toHaveBeenCalledWith(true);
  });

  it('keeps checkbox disabled when disabled prop is true', () => {
    render(<Toggle checked={true} onChange={() => undefined} disabled />);
    expect(screen.getByRole('checkbox')).toHaveProperty('disabled', true);
  });
});
