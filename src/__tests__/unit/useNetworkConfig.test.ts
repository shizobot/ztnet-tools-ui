import { describe, expect, it, vi } from 'vitest';

import type { ApiResult } from '../../api/toApiResult';
import {
  deleteNetwork,
  loadNetworkConfig,
  saveNetworkConfig,
  type NetworkConfig,
  type UseNetworkConfigDeps,
} from '../../hooks/useNetworkConfig';

type ApiGet = UseNetworkConfigDeps['apiGet'];
type ApiPost = UseNetworkConfigDeps['apiPost'];
type ApiDelete = UseNetworkConfigDeps['apiDelete'];

function okResult<T>(data: T, status = 200): ApiResult<T> {
  return { ok: true, status, data };
}

function errorResult<T>(status = 500, message = 'error'): ApiResult<T> {
  return {
    ok: false,
    status,
    data: null,
    message,
    errorType: 'api',
  };
}

describe('loadNetworkConfig', () => {
  it('splits pools/routes into v4 and v6 buckets and parses dns fields', async () => {
    const apiGet: ApiGet = vi.fn(async () =>
      okResult<NetworkConfig>({
        ipAssignmentPools: [
          { ipRangeStart: '10.1.0.1', ipRangeEnd: '10.1.0.254' },
          { ipRangeStart: 'fd00::1', ipRangeEnd: 'fd00::ff' },
        ],
        routes: [
          { target: '10.1.0.0/24', via: '10.1.0.1' },
          { target: 'fd00::/64', via: 'fd00::1' },
        ],
        dns: {
          domain: 'example.internal',
          servers: ['1.1.1.1', '2606:4700:4700::1111'],
        },
      }),
    );

    const deps: UseNetworkConfigDeps = {
      apiGet,
      apiPost: vi.fn<ApiPost>(),
      apiDelete: vi.fn<ApiDelete>(),
    };

    const result = await loadNetworkConfig('8056c2e21c000001', deps);

    expect(apiGet).toHaveBeenCalledWith('/controller/network/8056c2e21c000001');
    expect(result).toEqual({
      selectedNwid: '8056c2e21c000001',
      raw: expect.objectContaining({
        dns: {
          domain: 'example.internal',
          servers: ['1.1.1.1', '2606:4700:4700::1111'],
        },
      }),
      pools: [{ ipRangeStart: '10.1.0.1', ipRangeEnd: '10.1.0.254' }],
      v6pools: [{ ipRangeStart: 'fd00::1', ipRangeEnd: 'fd00::ff' }],
      routes: [{ target: '10.1.0.0/24', via: '10.1.0.1' }],
      v6routes: [{ target: 'fd00::/64', via: 'fd00::1' }],
      dnsServers: ['1.1.1.1', '2606:4700:4700::1111'],
      dnsDomain: 'example.internal',
    });
  });

  it('returns null for empty network id and for empty/error api responses', async () => {
    const apiGet = vi
      .fn<ApiGet>()
      .mockResolvedValueOnce(okResult<NetworkConfig | null>(null))
      .mockResolvedValueOnce(errorResult<NetworkConfig>(502, 'bad gateway'));

    const deps: UseNetworkConfigDeps = {
      apiGet,
      apiPost: vi.fn<ApiPost>(),
      apiDelete: vi.fn<ApiDelete>(),
    };

    await expect(loadNetworkConfig('   ', deps)).resolves.toBeNull();
    await expect(loadNetworkConfig('nwid-empty', deps)).resolves.toBeNull();
    await expect(loadNetworkConfig('nwid-error', deps)).resolves.toBeNull();

    expect(apiGet).toHaveBeenCalledTimes(2);
  });
});

describe('saveNetworkConfig', () => {
  it('builds payload in zt/v6 enabled mode and merges v4+v6 pools/routes', async () => {
    const apiPost = vi
      .fn<ApiPost>()
      .mockResolvedValue(okResult<NetworkConfig>({ name: 'Office' }, 200));

    const deps: UseNetworkConfigDeps = {
      apiGet: vi.fn<ApiGet>(),
      apiPost,
      apiDelete: vi.fn<ApiDelete>(),
    };

    await saveNetworkConfig(
      {
        nwid: 'abcd1234',
        name: 'Office',
        description: 'Main network',
        isPrivate: true,
        enableBroadcast: true,
        multicastLimit: 64,
        v4Mode: 'zt',
        v6AssignMode: { zt: true, rfc4193: false, '6plane': true },
        pools: [{ ipRangeStart: '10.10.0.1', ipRangeEnd: '10.10.0.10' }],
        v6pools: [{ ipRangeStart: 'fd10::1', ipRangeEnd: 'fd10::a' }],
        routes: [{ target: '10.10.0.0/24', via: '10.10.0.1' }],
        v6routes: [{ target: 'fd10::/64', via: 'fd10::1' }],
        dnsDomain: 'office.internal',
        dnsServers: ['9.9.9.9'],
      },
      deps,
    );

    expect(apiPost).toHaveBeenCalledWith('/controller/network/abcd1234', {
      name: 'Office',
      description: 'Main network',
      private: true,
      enableBroadcast: true,
      multicastLimit: 64,
      v4AssignMode: { zt: true },
      v6AssignMode: { zt: true, rfc4193: false, '6plane': true },
      ipAssignmentPools: [
        { ipRangeStart: '10.10.0.1', ipRangeEnd: '10.10.0.10' },
        { ipRangeStart: 'fd10::1', ipRangeEnd: 'fd10::a' },
      ],
      routes: [
        { target: '10.10.0.0/24', via: '10.10.0.1' },
        { target: 'fd10::/64', via: 'fd10::1' },
      ],
      dns: { domain: 'office.internal', servers: ['9.9.9.9'] },
    });
  });

  it('builds payload in v4 none mode and clears dns when domain is empty', async () => {
    const apiPost = vi
      .fn<ApiPost>()
      .mockResolvedValue(okResult<NetworkConfig>({ name: 'Guest' }, 200));

    const deps: UseNetworkConfigDeps = {
      apiGet: vi.fn<ApiGet>(),
      apiPost,
      apiDelete: vi.fn<ApiDelete>(),
    };

    await saveNetworkConfig(
      {
        nwid: 'efgh5678',
        name: 'Guest',
        description: '',
        isPrivate: false,
        enableBroadcast: false,
        multicastLimit: 0,
        v4Mode: 'none',
        v6AssignMode: { zt: false, rfc4193: false, '6plane': false },
        pools: [],
        v6pools: [],
        routes: [],
        v6routes: [],
        dnsDomain: '',
        dnsServers: ['8.8.8.8'],
      },
      deps,
    );

    expect(apiPost).toHaveBeenCalledWith('/controller/network/efgh5678', {
      name: 'Guest',
      description: '',
      private: false,
      enableBroadcast: false,
      multicastLimit: 32,
      v4AssignMode: { zt: false },
      v6AssignMode: { zt: false, rfc4193: false, '6plane': false },
      ipAssignmentPools: [],
      routes: [],
      dns: { domain: '', servers: [] },
    });
  });
});

describe('deleteNetwork', () => {
  it('calls delete endpoint and returns api result as-is', async () => {
    const response: ApiResult<{ deleted: true }> = okResult({ deleted: true }, 200);
    const apiDelete = vi.fn<ApiDelete>().mockResolvedValue(response);

    const deps: UseNetworkConfigDeps = {
      apiGet: vi.fn<ApiGet>(),
      apiPost: vi.fn<ApiPost>(),
      apiDelete,
    };

    const result = await deleteNetwork('deadbeef', deps);

    expect(apiDelete).toHaveBeenCalledWith('/controller/network/deadbeef');
    expect(result).toBe(response);
  });
});
