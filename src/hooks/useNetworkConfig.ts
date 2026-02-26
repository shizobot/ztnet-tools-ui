export type ApiResult<T> = { ok: boolean; status: number; data: T | null } | null;

export type NetworkConfig = {
  name?: string;
  description?: string;
  desc?: string;
  private?: boolean;
  enableBroadcast?: boolean;
  multicastLimit?: number;
  v4AssignMode?: { zt?: boolean } | 'zt' | 'none';
  v6AssignMode?: { zt?: boolean; rfc4193?: boolean; '6plane'?: boolean };
  ipAssignmentPools?: Array<{ ipRangeStart: string; ipRangeEnd: string }>;
  routes?: Array<{ target: string; via?: string | null }>;
  dns?: { domain?: string; servers?: string[] };
};

export type ParsedNetworkConfig = {
  selectedNwid: string;
  raw: NetworkConfig;
  pools: Array<{ ipRangeStart: string; ipRangeEnd: string }>;
  v6pools: Array<{ ipRangeStart: string; ipRangeEnd: string }>;
  routes: Array<{ target: string; via?: string | null }>;
  v6routes: Array<{ target: string; via?: string | null }>;
  dnsServers: string[];
  dnsDomain: string;
};

export type SaveNetworkConfigInput = {
  nwid: string;
  name: string;
  description: string;
  isPrivate: boolean;
  enableBroadcast: boolean;
  multicastLimit: number;
  v4Mode: 'zt' | 'none';
  v6AssignMode: { zt: boolean; rfc4193: boolean; '6plane': boolean };
  pools: Array<{ ipRangeStart: string; ipRangeEnd: string }>;
  v6pools: Array<{ ipRangeStart: string; ipRangeEnd: string }>;
  routes: Array<{ target: string; via?: string | null }>;
  v6routes: Array<{ target: string; via?: string | null }>;
  dnsDomain: string;
  dnsServers: string[];
};

export type UseNetworkConfigDeps = {
  apiGet: <T>(path: string) => Promise<ApiResult<T>>;
  apiPost: <TBody, TData>(path: string, body: TBody) => Promise<ApiResult<TData>>;
  apiDelete: <T>(path: string) => Promise<ApiResult<T>>;
};

export async function loadNetworkConfig(
  nwid: string,
  deps: UseNetworkConfigDeps,
): Promise<ParsedNetworkConfig | null> {
  if (!nwid.trim()) {
    return null;
  }

  const res = await deps.apiGet<NetworkConfig>(`/controller/network/${nwid}`);
  if (!res?.ok || !res.data) {
    return null;
  }

  const allPools = res.data.ipAssignmentPools ?? [];
  const allRoutes = res.data.routes ?? [];

  return {
    selectedNwid: nwid,
    raw: res.data,
    pools: allPools.filter((pool) => !pool.ipRangeStart?.includes(':')),
    v6pools: allPools.filter((pool) => pool.ipRangeStart?.includes(':')),
    routes: allRoutes.filter((route) => !route.target?.includes(':')),
    v6routes: allRoutes.filter((route) => route.target?.includes(':')),
    dnsServers: res.data.dns?.servers ? [...res.data.dns.servers] : [],
    dnsDomain: res.data.dns?.domain ?? '',
  };
}

export async function saveNetworkConfig(
  input: SaveNetworkConfigInput,
  deps: UseNetworkConfigDeps,
): Promise<ApiResult<NetworkConfig>> {
  const body = {
    name: input.name,
    description: input.description,
    private: input.isPrivate,
    enableBroadcast: input.enableBroadcast,
    multicastLimit: input.multicastLimit || 32,
    v4AssignMode: input.v4Mode === 'zt' ? { zt: true } : { zt: false },
    v6AssignMode: {
      zt: input.v6AssignMode.zt,
      rfc4193: input.v6AssignMode.rfc4193,
      '6plane': input.v6AssignMode['6plane'],
    },
    ipAssignmentPools: [...input.pools, ...input.v6pools],
    routes: [...input.routes, ...input.v6routes],
    dns: input.dnsDomain
      ? { domain: input.dnsDomain, servers: input.dnsServers }
      : { domain: '', servers: [] },
  };

  return deps.apiPost<typeof body, NetworkConfig>(`/controller/network/${input.nwid}`, body);
}

export async function deleteNetwork(
  nwid: string,
  deps: UseNetworkConfigDeps,
): Promise<ApiResult<unknown>> {
  return deps.apiDelete(`/controller/network/${nwid}`);
}

export function useNetworkConfig(deps: UseNetworkConfigDeps) {
  return {
    loadNetworkConfig: (nwid: string) => loadNetworkConfig(nwid, deps),
    saveNetworkConfig: (input: SaveNetworkConfigInput) => saveNetworkConfig(input, deps),
    deleteNetwork: (nwid: string) => deleteNetwork(nwid, deps),
  };
}
