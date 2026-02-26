import { beforeEach, describe, expect, it } from 'vitest';

import { useAppStore } from '../../../store/appStore';

describe('appStore', () => {
  beforeEach(() => {
    useAppStore.setState({
      host: '',
      token: '',
      nodeId: '',
      connected: false,
      networks: [],
      selectedNwid: '',
      memberIps: [],
      pools: [],
      routes: [],
      v6pools: [],
      v6routes: [],
      dnsServers: [],
      dnsDomain: '',
    });
  });

  it('sets connection preferences and connected state', () => {
    const store = useAppStore.getState();

    store.setConnectionPrefs({ host: 'http://localhost:3001', token: 'abc', nodeId: 'node-1' });
    store.setConnected(true);

    const state = useAppStore.getState();
    expect(state.host).toBe('http://localhost:3001');
    expect(state.token).toBe('abc');
    expect(state.nodeId).toBe('node-1');
    expect(state.connected).toBe(true);
  });

  it('applies and resets network config fields', () => {
    const store = useAppStore.getState();

    store.setNetworkConfig({
      memberIps: ['192.168.1.10'],
      pools: [{ ipRangeStart: '192.168.1.1', ipRangeEnd: '192.168.1.254' }],
      routes: [{ target: '192.168.1.0/24', via: '192.168.1.1' }],
      v6pools: [{ ipRangeStart: 'fd00::1', ipRangeEnd: 'fd00::ffff' }],
      v6routes: [{ target: '::/0', via: 'fd00::1' }],
      dnsServers: ['1.1.1.1'],
      dnsDomain: 'example.internal',
    });

    expect(useAppStore.getState().dnsDomain).toBe('example.internal');

    store.resetNetworkConfig();

    const state = useAppStore.getState();
    expect(state.memberIps).toEqual([]);
    expect(state.pools).toEqual([]);
    expect(state.routes).toEqual([]);
    expect(state.v6pools).toEqual([]);
    expect(state.v6routes).toEqual([]);
    expect(state.dnsServers).toEqual([]);
    expect(state.dnsDomain).toBe('');
  });
});
