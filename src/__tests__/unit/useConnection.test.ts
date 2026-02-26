import { describe, expect, it, vi, beforeEach } from 'vitest';

import {
  clearPrefs,
  loadPrefs,
  restoreConnectionStateFromPrefs,
  savePrefs,
  testConnection,
} from '../../hooks/useConnection';

describe('useConnection prefs persistence', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('restores host without token by default (ephemeral token mode)', () => {
    savePrefs({ apiMode: 'direct', host: 'http://localhost:9993', token: 'secret' });

    expect(loadPrefs()).toEqual({
      apiMode: 'direct',
      host: 'http://localhost:9993',
      persistToken: false,
    });
    expect(localStorage.getItem('ztnet_token')).toBeNull();
  });

  it('restores host and token when persistToken is enabled', () => {
    savePrefs({
      apiMode: 'direct',
      host: 'http://localhost:9993',
      token: 'secret',
      persistToken: true,
    });

    expect(loadPrefs()).toEqual({
      apiMode: 'direct',
      host: 'http://localhost:9993',
      token: 'secret',
      persistToken: true,
    });
  });

  it('maps loaded prefs to store-ready connection state', () => {
    savePrefs({
      apiMode: 'direct',
      host: 'http://localhost:9993',
      token: 'secret',
      persistToken: true,
    });

    expect(restoreConnectionStateFromPrefs()).toEqual({
      apiMode: 'direct',
      host: 'http://localhost:9993',
      token: 'secret',
      connected: false,
      nodeId: '',
    });
  });

  it('clears all persisted keys', () => {
    savePrefs({
      apiMode: 'direct',
      host: 'http://localhost:9993',
      token: 'secret',
      persistToken: true,
    });
    clearPrefs();

    expect(loadPrefs()).toEqual({ apiMode: 'proxy', persistToken: false });
  });
});

describe('testConnection', () => {
  it('saves prefs and refreshes dashboard on successful status check', async () => {
    localStorage.clear();
    const refreshDashboard = vi.fn();
    const apiGet = vi
      .fn()
      .mockResolvedValue({ ok: true, status: 200, data: { address: 'abc123' } });

    const result = await testConnection(
      { apiMode: 'direct', host: 'http://localhost:9993', token: 'secret', persistToken: true },
      { apiGet, refreshDashboard },
    );

    expect(result.connected).toBe(true);
    expect(result.nodeId).toBe('abc123');
    expect(refreshDashboard).toHaveBeenCalledTimes(1);
    expect(loadPrefs()).toEqual({
      apiMode: 'direct',
      host: 'http://localhost:9993',
      token: 'secret',
      persistToken: true,
    });
  });
});
