import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { renderWithAppProviders } from '../testUtils';

import { NetworkConfigPanel } from '../../components/panels/NetworkConfigPanel';

describe('NetworkConfigPanel', () => {
  it('renders IPv6 mode controls', () => {
    renderWithAppProviders(<NetworkConfigPanel />);

    expect(screen.getByRole('checkbox', { name: /zt/i })).toBeDefined();
    expect(screen.getByRole('checkbox', { name: /rfc4193/i })).toBeDefined();
    expect(screen.getByRole('checkbox', { name: /6plane/i })).toBeDefined();
  });

  it('toggles rfc4193 mode checkbox state', () => {
    renderWithAppProviders(<NetworkConfigPanel />);

    const checkbox = screen.getByRole('checkbox', { name: /rfc4193/i });
    fireEvent.click(checkbox);

    expect((checkbox as HTMLInputElement).checked).toBe(true);
  });
});
