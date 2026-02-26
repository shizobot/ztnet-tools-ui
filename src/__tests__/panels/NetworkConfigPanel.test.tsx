import { fireEvent, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { renderWithAppProviders } from '../testUtils';

import { NetworkConfigPanel } from '../../components/panels/NetworkConfigPanel';
import { useAppStore } from '../../store/appStore';

vi.mock('../../hooks/useApiClient', () => ({
  useApiClient: () => ({
    apiGet: vi.fn(),
    apiPost: vi.fn(),
    apiDelete: vi.fn(),
  }),
}));

vi.mock('../../hooks/useNetworkConfig', () => ({
  useNetworkConfig: () => ({
    loadNetworkConfig: vi.fn(async () => null),
    saveNetworkConfig: vi.fn(async () => ({ ok: true, data: null, error: null })),
    deleteNetwork: vi.fn(async () => ({ ok: true, data: null, error: null })),
  }),
}));

describe('NetworkConfigPanel', () => {
  beforeEach(() => {
    useAppStore.setState((state) => ({
      ...state,
      routes: [{ target: '10.10.0.0/24', via: '10.10.0.1' }],
      dnsServers: ['1.1.1.1'],
      dnsDomain: '',
      pools: [],
      v6pools: [],
      v6routes: [],
      memberIps: [],
    }));
  });

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

  it('adds, edits and removes route rows', () => {
    renderWithAppProviders(<NetworkConfigPanel />);

    fireEvent.click(screen.getByRole('button', { name: 'Add Route' }));
    expect(useAppStore.getState().routes).toHaveLength(2);

    const targetInputs = screen.getAllByPlaceholderText(/Target \(e\.g\. 10\.0\.0\.0\/24\)/i);
    fireEvent.change(targetInputs[1], { target: { value: '10.20.0.0/24' } });

    const viaInputs = screen.getAllByPlaceholderText(/Via \(optional\)/i);
    fireEvent.change(viaInputs[1], { target: { value: '10.20.0.1' } });

    expect(useAppStore.getState().routes[1]).toEqual({ target: '10.20.0.0/24', via: '10.20.0.1' });

    const removeButtons = screen.getAllByRole('button', { name: 'Remove' });
    fireEvent.click(removeButtons[1]);

    expect(useAppStore.getState().routes).toEqual([{ target: '10.10.0.0/24', via: '10.10.0.1' }]);
  });

  it('adds, edits and removes dns rows', () => {
    renderWithAppProviders(<NetworkConfigPanel />);

    fireEvent.click(screen.getByRole('button', { name: 'Add DNS' }));
    expect(useAppStore.getState().dnsServers).toEqual(['1.1.1.1', '']);

    const dnsInputs = screen.getAllByPlaceholderText(/DNS server \(e\.g\. 1\.1\.1\.1\)/i);
    fireEvent.change(dnsInputs[1], { target: { value: '8.8.8.8' } });
    expect(useAppStore.getState().dnsServers).toEqual(['1.1.1.1', '8.8.8.8']);

    const removeButtons = screen.getAllByRole('button', { name: 'Remove' });
    fireEvent.click(removeButtons[2]);

    expect(useAppStore.getState().dnsServers).toEqual(['1.1.1.1']);
  });
});
