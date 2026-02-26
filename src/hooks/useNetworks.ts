export type ApiResult<T> = { ok: boolean; status: number; data: T | null } | null;

export type Network = {
  id: string;
  name?: string;
  private?: boolean;
  [key: string]: unknown;
};

export type MemberSummary = {
  authorized?: boolean;
};

export type NetworksData = {
  networks: Network[];
  authorizedCount: number;
  pendingCount: number;
};

export type UseNetworksDeps = {
  apiGet: <T>(path: string) => Promise<ApiResult<T>>;
};

export async function loadNetworksData(deps: UseNetworksDeps): Promise<NetworksData> {
  const initial: NetworksData = {
    networks: [],
    authorizedCount: 0,
    pendingCount: 0,
  };

  const res = await deps.apiGet<string[]>('/controller/network');
  if (!res?.ok) {
    return initial;
  }

  const ids = res.data ?? [];
  const networks: Network[] = [];
  for (const id of ids) {
    const detail = await deps.apiGet<Record<string, unknown>>(`/controller/network/${id}`);
    networks.push({
      id,
      name: (detail?.data?.name as string | undefined) ?? '',
      private: (detail?.data?.private as boolean | undefined) ?? true,
      ...(detail?.data ?? {}),
    });
  }

  let authorizedCount = 0;
  let pendingCount = 0;
  for (const network of networks.slice(0, 6)) {
    const membersRes = await deps.apiGet<Record<string, MemberSummary>>(
      `/controller/network/${network.id}/member`,
    );
    if (!membersRes?.ok) {
      continue;
    }

    const members = Object.values(membersRes.data ?? {});
    authorizedCount += members.filter((member) => member.authorized).length;
    pendingCount += members.filter((member) => !member.authorized).length;
  }

  return { networks, authorizedCount, pendingCount };
}

export function filterNetworks(networks: Network[], query: string): Network[] {
  const q = query.toLowerCase().trim();
  if (!q) {
    return networks;
  }

  return networks.filter(
    (network) => network.id.includes(q) || (network.name ?? '').toLowerCase().includes(q),
  );
}

export function useNetworks(deps: UseNetworksDeps) {
  return {
    loadNetworksData: () => loadNetworksData(deps),
    filterNetworks,
  };
}
