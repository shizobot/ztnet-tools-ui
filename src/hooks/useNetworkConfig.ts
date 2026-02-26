import { useCallback } from 'react';

import { ztDelete, ztGet, ztPost } from '../api/ztApi';
import { useAppStore } from '../store/appStore';
import type { ZtIpAssignmentPool, ZtRoute } from '../types/zt';

interface NetworkConfigResponse {
  ipAssignmentPools?: ZtIpAssignmentPool[];
  routes?: ZtRoute[];
  v6AssignMode?: {
    rfc4193?: {
      from?: string;
      to?: string;
    };
  };
  dns?: {
    servers?: string[];
    domain?: string;
  };
}

interface SaveNetworkConfigRequest {
  config: NetworkConfigResponse;
}

export function useNetworkConfig() {
  const host = useAppStore((s) => s.host);
  const token = useAppStore((s) => s.token);
  const selectedNwid = useAppStore((s) => s.selectedNwid);
  const setNetworkConfig = useAppStore((s) => s.setNetworkConfig);
  const resetNetworkConfig = useAppStore((s) => s.resetNetworkConfig);

  const loadNetworkConfig = useCallback(async () => {
    const response = await ztGet<NetworkConfigResponse>({
      path: `/controller/network/${selectedNwid}`,
      config: { host, token },
    });

    setNetworkConfig({
      memberIps: [],
      pools: response.ipAssignmentPools ?? [],
      routes: response.routes ?? [],
      v6pools:
        response.v6AssignMode?.rfc4193?.from && response.v6AssignMode.rfc4193.to
          ? [
              {
                ipRangeStart: response.v6AssignMode.rfc4193.from,
                ipRangeEnd: response.v6AssignMode.rfc4193.to,
              },
            ]
          : [],
      v6routes: [],
      dnsServers: response.dns?.servers ?? [],
      dnsDomain: response.dns?.domain ?? '',
    });
  }, [host, token, selectedNwid, setNetworkConfig]);

  const saveNetworkConfig = useCallback(
    async (payload: SaveNetworkConfigRequest) => {
      await ztPost<NetworkConfigResponse, SaveNetworkConfigRequest>({
        path: `/controller/network/${selectedNwid}`,
        config: { host, token },
        body: payload,
      });
    },
    [host, token, selectedNwid],
  );

  const deleteNetwork = useCallback(async () => {
    await ztDelete<void>({
      path: `/controller/network/${selectedNwid}`,
      config: { host, token },
    });
    resetNetworkConfig();
  }, [host, token, selectedNwid, resetNetworkConfig]);

  return { loadNetworkConfig, saveNetworkConfig, deleteNetwork };
}
