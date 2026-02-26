import { screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { renderWithAppProviders } from '../testUtils';

import { NetworksPanel } from '../../components/panels/NetworksPanel';
import { useAppStore } from '../../store/appStore';

const loadNetworksDataMock = vi.fn();
const filterNetworksMock = vi.fn((networks, _query) => networks);

vi.mock('../../hooks/useApiClient', () => ({
  useApiClient: () => ({
    apiGet: vi.fn(),
  }),
}));

vi.mock('../../hooks/useNetworks', () => ({
  useNetworks: () => ({
    loadNetworksData: loadNetworksDataMock,
    filterNetworks: filterNetworksMock,
  }),
}));

describe('NetworksPanel', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAppStore.setState((state) => ({ ...state, networks: [] }));
  });

  it('renders network rows on successful response', async () => {
    loadNetworksDataMock.mockResolvedValue({
      data: {
        networks: [{ id: '8056c2e21c000001', name: 'prod' }],
        authorizedCount: 0,
        pendingCount: 0,
      },
      error: null,
    });

    renderWithAppProviders(<NetworksPanel />);

    expect(await screen.findByText('prod')).toBeDefined();
  });

  it('renders error notice on failed response', async () => {
    loadNetworksDataMock.mockResolvedValue({
      data: { networks: [], authorizedCount: 0, pendingCount: 0 },
      error: {
        ok: false,
        status: 500,
        data: null,
        message: 'internal error',
        errorType: 'api',
      },
    });

    renderWithAppProviders(<NetworksPanel />);

    expect(await screen.findByText('status 500: internal error')).toBeDefined();
  });

  it('renders empty state on successful empty response', async () => {
    loadNetworksDataMock.mockResolvedValue({
      data: { networks: [], authorizedCount: 0, pendingCount: 0 },
      error: null,
    });

    renderWithAppProviders(<NetworksPanel />);

    await waitFor(() => {
      expect(screen.getByText('No networks found')).toBeDefined();
    });
  });
});
