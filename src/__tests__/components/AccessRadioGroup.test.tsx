import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { AccessRadioGroup } from '../../components/ui/AccessRadioGroup';

describe('AccessRadioGroup', () => {
  it('marks selected access mode', () => {
    render(<AccessRadioGroup value="private" onChange={() => undefined} />);

    expect(screen.getByRole('radio', { name: 'Private' })).toHaveProperty('checked', true);
    expect(screen.getByRole('radio', { name: 'Public' })).not.toHaveProperty('checked', true);
  });

  it('calls onChange with public when public selected', () => {
    const onChange = vi.fn();

    render(<AccessRadioGroup value="private" onChange={onChange} />);
    fireEvent.click(screen.getByRole('radio', { name: 'Public' }));

    expect(onChange).toHaveBeenCalledWith('public');
  });
});
