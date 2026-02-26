import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { NetworkConfigPanel } from '../../components/panels/NetworkConfigPanel';

describe('NetworkConfigPanel', () => {
  it('renders IPv6 mode controls', () => {
    render(<NetworkConfigPanel />);

    expect(screen.getByRole('checkbox', { name: /zt/i })).toBeDefined();
    expect(screen.getByRole('checkbox', { name: /rfc4193/i })).toBeDefined();
    expect(screen.getByRole('checkbox', { name: /6plane/i })).toBeDefined();
  });

  it('adds toggled mode to payload preview', () => {
    const { container } = render(<NetworkConfigPanel />);

    fireEvent.click(screen.getByRole('checkbox', { name: /rfc4193/i }));

    const preview = container.querySelector('pre.terminal');
    expect(preview?.textContent).toContain('rfc4193');
  });
});
