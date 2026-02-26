import { screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { renderWithAppProviders } from '../testUtils';

import { DashboardPanel } from '../../components/panels/DashboardPanel';
import { useAppStore } from '../../store/appStore';

const loadNetworksDataMock = vi.fn();

vi.mock('../../hooks/useApiClient', () => ({
  useApiClient: () => ({
    apiGet: vi.fn(),
  }),
}));

vi.mock('../../hooks/useNetworks', () => ({
  useNetworks: () => ({
    loadNetworksData: loadNetworksDataMock,
  }),
}));

describe('DashboardPanel', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAppStore.setState((state) => ({
      ...state,
      connected: true,
      nodeId: 'node-1',
      networks: [],
    }));
  });

  it('renders networks on successful response', async () => {
    loadNetworksDataMock.mockResolvedValue({
      data: {
        networks: [{ id: '8056c2e21c000001', name: 'team-net' }],
        authorizedCount: 4,
        pendingCount: 1,
      },
      error: null,
    });

    renderWithAppProviders(<DashboardPanel />);

    expect(await screen.findByText('team-net')).toBeDefined();
    expect(screen.getByText('4')).toBeDefined();
    expect(screen.getAllByText('1').length).toBeGreaterThan(0);
  });

  it('renders API error message when request fails', async () => {
    loadNetworksDataMock.mockResolvedValue({
      data: { networks: [], authorizedCount: 0, pendingCount: 0 },
      error: {
        ok: false,
        status: 401,
        data: null,
        message: 'unauthorized',
        errorType: 'api',
      },
    });

    renderWithAppProviders(<DashboardPanel />);

    expect(await screen.findByText('status 401: unauthorized')).toBeDefined();
  });

  it('renders empty state for successful empty response', async () => {
    loadNetworksDataMock.mockResolvedValue({
      data: { networks: [], authorizedCount: 0, pendingCount: 0 },
      error: null,
    });

    renderWithAppProviders(<DashboardPanel />);

    await waitFor(() => {
      expect(screen.getByText('No networks yet')).toBeDefined();
    });
  });
});
