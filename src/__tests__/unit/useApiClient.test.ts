import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useApiClient } from '../../hooks/useApiClient';
import { useAppStore } from '../../store/appStore';
import { ztDelete, ztGet, ztPost } from '../../api/ztApi';

vi.mock('../../api/ztApi', () => ({
  ztGet: vi.fn(),
  ztPost: vi.fn(),
  ztDelete: vi.fn(),
}));

describe('useApiClient', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAppStore.setState((state) => ({
      ...state,
      host: '',
      token: 'store-token',
    }));
    vi.mocked(ztGet).mockResolvedValue({} as never);
    vi.mocked(ztPost).mockResolvedValue({} as never);
    vi.mocked(ztDelete).mockResolvedValue({} as never);
  });

  it('passes host from store as baseUrl when present', async () => {
    useAppStore.setState((state) => ({ ...state, host: 'http://controller.local:9993' }));
    const { result } = renderHook(() => useApiClient());

    await act(async () => {
      await result.current.apiGet('/status');
      await result.current.apiPost('/controller/network', { name: 'new-network' });
      await result.current.apiDelete('/controller/network/abc');
    });

    expect(ztGet).toHaveBeenCalledWith({
      path: '/status',
      config: { token: 'store-token', baseUrl: 'http://controller.local:9993' },
    });
    expect(ztPost).toHaveBeenCalledWith({
      path: '/controller/network',
      body: { name: 'new-network' },
      config: { token: 'store-token', baseUrl: 'http://controller.local:9993' },
    });
    expect(ztDelete).toHaveBeenCalledWith({
      path: '/controller/network/abc',
      config: { token: 'store-token', baseUrl: 'http://controller.local:9993' },
    });
  });

  it('passes empty host through so ztApi fallback resolution can apply', async () => {
    const { result } = renderHook(() => useApiClient());

    await act(async () => {
      await result.current.apiGet('/status');
    });

    expect(ztGet).toHaveBeenCalledWith({
      path: '/status',
      config: { token: 'store-token', baseUrl: '' },
    });
  });
});
