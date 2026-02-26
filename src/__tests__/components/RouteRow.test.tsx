import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { RouteRow } from '../../components/ui/RouteRow';

describe('RouteRow', () => {
  it('emits full value on input edits', () => {
    const onChange = vi.fn();

    render(
      <RouteRow
        value={{ target: '10.0.0.0/24', via: '' }}
        onChange={onChange}
        onRemove={() => undefined}
      />,
    );

    fireEvent.change(screen.getByPlaceholderText('Target (e.g. 10.0.0.0/24)'), {
      target: { value: '10.1.0.0/24' },
    });

    expect(onChange).toHaveBeenCalledWith({ target: '10.1.0.0/24', via: '' });
  });

  it('calls onRemove when remove button is clicked', () => {
    const onRemove = vi.fn();

    render(
      <RouteRow value={{ target: '', via: '' }} onChange={() => undefined} onRemove={onRemove} />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Remove' }));

    expect(onRemove).toHaveBeenCalledTimes(1);
  });
});
