import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useApiClient, resolveApiClientBaseUrl } from '../../hooks/useApiClient';
import { useAppStore } from '../../store/appStore';
import { ztDelete, ztGet, ztPost } from '../../api/ztApi';

vi.mock('../../api/ztApi', () => ({
  ztGet: vi.fn(),
  ztPost: vi.fn(),
  ztDelete: vi.fn(),
}));

describe('resolveApiClientBaseUrl', () => {
  it('uses relative /api flow in proxy mode even when host is populated', () => {
    expect(resolveApiClientBaseUrl('proxy', 'http://controller.local:9993')).toBeUndefined();
  });

  it('uses explicit host only in direct mode', () => {
    expect(resolveApiClientBaseUrl('direct', 'http://controller.local:9993')).toBe(
      'http://controller.local:9993',
    );
  });

  it('falls back to default /api resolution when direct mode host is blank', () => {
    expect(resolveApiClientBaseUrl('direct', '   ')).toBeUndefined();
  });
});

describe('useApiClient', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAppStore.setState((state) => ({
      ...state,
      apiMode: 'proxy',
      host: '',
      token: 'store-token',
    }));
    vi.mocked(ztGet).mockResolvedValue({} as never);
    vi.mocked(ztPost).mockResolvedValue({} as never);
    vi.mocked(ztDelete).mockResolvedValue({} as never);
  });

  it('uses direct host as baseUrl only when api mode is direct', async () => {
    useAppStore.setState((state) => ({
      ...state,
      apiMode: 'direct',
      host: 'http://controller.local:9993',
    }));
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

  it('keeps baseUrl undefined in proxy mode so /api is used', async () => {
    useAppStore.setState((state) => ({
      ...state,
      apiMode: 'proxy',
      host: 'http://controller.local:9993',
    }));
    const { result } = renderHook(() => useApiClient());

    await act(async () => {
      await result.current.apiGet('/status');
    });

    expect(ztGet).toHaveBeenCalledWith({
      path: '/status',
      config: { token: 'store-token', baseUrl: undefined },
    });
  });
});
