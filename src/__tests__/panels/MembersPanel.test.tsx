import { screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { renderWithAppProviders } from '../testUtils';

import { MembersPanel } from '../../components/panels/MembersPanel';
import { useAppStore } from '../../store/appStore';

const loadMembersMock = vi.fn();

vi.mock('../../hooks/useApiClient', () => ({
  useApiClient: () => ({
    apiGet: vi.fn(),
    apiPost: vi.fn(),
  }),
}));

vi.mock('../../hooks/useMembers', () => ({
  useMembers: () => ({
    loadMembers: loadMembersMock,
  }),
}));

describe('MembersPanel', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAppStore.setState((state) => ({
      ...state,
      selectedNwid: '8056c2e21c000001',
      networks: [{ id: '8056c2e21c000001', name: 'prod' }],
    }));
  });

  it('renders member rows on successful response', async () => {
    loadMembersMock.mockResolvedValue({
      rows: [{ memid: 'abc123', member: { name: 'db-node', authorized: true } }],
      error: null,
    });

    renderWithAppProviders(<MembersPanel />);

    expect(await screen.findByText('db-node')).toBeDefined();
  });

  it('renders error notice on failed response', async () => {
    loadMembersMock.mockResolvedValue({
      rows: [],
      error: {
        ok: false,
        status: 403,
        data: null,
        message: 'forbidden',
        errorType: 'api',
      },
    });

    renderWithAppProviders(<MembersPanel />);

    expect(await screen.findByText('status 403: forbidden')).toBeDefined();
  });

  it('does not request members when network is not selected', async () => {
    useAppStore.setState((state) => ({
      ...state,
      selectedNwid: '   ',
    }));

    renderWithAppProviders(<MembersPanel />);

    await waitFor(() => {
      expect(loadMembersMock).not.toHaveBeenCalled();
    });

    expect(screen.getByText('Select a network')).toBeDefined();
    expect(screen.getByText('Choose a network in NetworkPicker to load members')).toBeDefined();
  });
  it('renders empty state on successful empty response', async () => {
    loadMembersMock.mockResolvedValue({ rows: [], error: null });

    renderWithAppProviders(<MembersPanel />);

    await waitFor(() => {
      expect(screen.getByText('No members yet')).toBeDefined();
    });
  });
});
