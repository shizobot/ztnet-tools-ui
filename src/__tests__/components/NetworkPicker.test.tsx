import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { NetworkPicker } from '../../components/ui/NetworkPicker';

const NETWORKS = [
  { id: 'abc123', name: 'Office' },
  { id: 'def456', name: 'Home' },
];

describe('NetworkPicker', () => {
  it('does not open picker for empty network list', () => {
    render(<NetworkPicker networks={[]} onPick={() => undefined} />);

    fireEvent.click(screen.getByRole('button', { name: '≡ Pick' }));

    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('filters and picks network id', () => {
    const onPick = vi.fn();

    render(<NetworkPicker networks={NETWORKS} onPick={onPick} />);
    fireEvent.click(screen.getByRole('button', { name: '≡ Pick' }));

    fireEvent.change(screen.getByPlaceholderText('Search by id or name'), {
      target: { value: 'home' },
    });

    fireEvent.click(screen.getByRole('button', { name: /def456 Home/i }));

    expect(onPick).toHaveBeenCalledWith('def456');
    expect(screen.queryByRole('dialog')).toBeNull();
  });
});
