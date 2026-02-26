import { useCallback, useMemo } from 'react';

import { ztGet } from '../api/ztApi';
import { useAppStore } from '../store/appStore';
import type { ZtNetwork } from '../types/zt';

export function useNetworks() {
  const host = useAppStore((s) => s.host);
  const token = useAppStore((s) => s.token);
  const networks = useAppStore((s) => s.networks);
  const setNetworks = useAppStore((s) => s.setNetworks);

  const loadNetworksData = useCallback(async () => {
    const response = await ztGet<Record<string, ZtNetwork>>({
      path: '/controller/network',
      config: { host, token },
    });
    setNetworks(Object.values(response));
  }, [host, token, setNetworks]);

  const filterNetworks = useCallback(
    (query: string): ZtNetwork[] => {
      const needle = query.trim().toLowerCase();
      if (!needle) {
        return networks;
      }
      return networks.filter((network) => {
        const id = network.id.toLowerCase();
        const name = (network.name ?? '').toLowerCase();
        return id.includes(needle) || name.includes(needle);
      });
    },
    [networks],
  );

  const sortedNetworks = useMemo(
    () => [...networks].sort((a, b) => (a.name ?? a.id).localeCompare(b.name ?? b.id)),
    [networks],
  );

  return { networks: sortedNetworks, loadNetworksData, filterNetworks };
}
