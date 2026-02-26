import { create } from 'zustand';

import type { ZtIpAssignmentPool, ZtNetwork, ZtRoute } from '../types/zt';

export interface AppState {
  host: string;
  token: string;
  nodeId: string;
  connected: boolean;
  networks: ZtNetwork[];
  selectedNwid: string;
  memberIps: string[];
  pools: ZtIpAssignmentPool[];
  routes: ZtRoute[];
  v6pools: ZtIpAssignmentPool[];
  v6routes: ZtRoute[];
  dnsServers: string[];
  dnsDomain: string;
}

interface AppActions {
  setConnectionPrefs: (prefs: Pick<AppState, 'host' | 'token' | 'nodeId'>) => void;
  setConnected: (connected: boolean) => void;
  setNetworks: (networks: ZtNetwork[]) => void;
  setSelectedNwid: (selectedNwid: string) => void;
  setNetworkConfig: (
    config: Pick<
      AppState,
      'memberIps' | 'pools' | 'routes' | 'v6pools' | 'v6routes' | 'dnsServers' | 'dnsDomain'
    >,
  ) => void;
  resetNetworkConfig: () => void;
}

export type AppStore = AppState & AppActions;

const initialState: AppState = {
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
};

export const useAppStore = create<AppStore>((set) => ({
  ...initialState,
  setConnectionPrefs: (prefs) => set((state) => ({ ...state, ...prefs })),
  setConnected: (connected) => set((state) => ({ ...state, connected })),
  setNetworks: (networks) => set((state) => ({ ...state, networks })),
  setSelectedNwid: (selectedNwid) => set((state) => ({ ...state, selectedNwid })),
  setNetworkConfig: (config) => set((state) => ({ ...state, ...config })),
  resetNetworkConfig: () =>
    set((state) => ({
      ...state,
      memberIps: initialState.memberIps,
      pools: initialState.pools,
      routes: initialState.routes,
      v6pools: initialState.v6pools,
      v6routes: initialState.v6routes,
      dnsServers: initialState.dnsServers,
      dnsDomain: initialState.dnsDomain,
    })),
}));
