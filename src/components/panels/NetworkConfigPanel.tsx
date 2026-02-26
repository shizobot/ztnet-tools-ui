import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { formatApiError } from '../../api/toApiResult';
import { useApiClient } from '../../hooks/useApiClient';
import { useArrayFieldEditor } from '../../hooks/useArrayFieldEditor';
import { useNetworkConfig } from '../../hooks/useNetworkConfig';
import { useAppStore } from '../../store/appStore';
import { useToast } from '../ui';
import {
  DnsSection,
  GeneralSection,
  PoolsSection,
  RoutesSection,
  V6AssignSection,
} from './network-config';

type V6State = { zt: boolean; rfc4193: boolean; '6plane': boolean };
const INITIAL_V6_STATE: V6State = { zt: false, rfc4193: false, '6plane': false };

export function NetworkConfigPanel() {
  const { nwid = '' } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { setNetworkConfig, setSelectedNwid } = useAppStore();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isPrivate, setIsPrivate] = useState(true);
  const [enableBroadcast, setEnableBroadcast] = useState(false);
  const [multicastLimit, setMulticastLimit] = useState(32);
  const [v4Mode, setV4Mode] = useState<'zt' | 'none'>('zt');
  const [dnsDomain, setDnsDomain] = useState('');
  const [v6State, setV6State] = useState<V6State>(INITIAL_V6_STATE);

  const { apiGet, apiPost, apiDelete } = useApiClient();
  const { loadNetworkConfig, saveNetworkConfig, deleteNetwork } = useNetworkConfig({
    apiGet,
    apiPost,
    apiDelete,
  });
  const store = useAppStore();

  const updateConfig = useCallback(
    (
      partial: Partial<{
        pools: typeof store.pools;
        routes: typeof store.routes;
        v6pools: typeof store.v6pools;
        v6routes: typeof store.v6routes;
        dnsServers: typeof store.dnsServers;
        dnsDomain: typeof store.dnsDomain;
      }>,
    ) => {
      setNetworkConfig({
        memberIps: store.memberIps,
        pools: partial.pools ?? store.pools,
        routes: partial.routes ?? store.routes,
        v6pools: partial.v6pools ?? store.v6pools,
        v6routes: partial.v6routes ?? store.v6routes,
        dnsServers: partial.dnsServers ?? store.dnsServers,
        dnsDomain: partial.dnsDomain ?? store.dnsDomain,
      });
    },
    [setNetworkConfig, store],
  );

  const updatePools = useCallback(
    (updater: (pools: typeof store.pools) => typeof store.pools) =>
      updateConfig({ pools: updater(store.pools) }),
    [store, updateConfig],
  );
  const updateRoutes = useCallback(
    (updater: (routes: typeof store.routes) => typeof store.routes) =>
      updateConfig({ routes: updater(store.routes) }),
    [store, updateConfig],
  );
  const updateDnsServers = useCallback(
    (updater: (dnsServers: typeof store.dnsServers) => typeof store.dnsServers) =>
      updateConfig({ dnsServers: updater(store.dnsServers) }),
    [store, updateConfig],
  );
  const updateV6Pools = useCallback(
    (updater: (v6pools: typeof store.v6pools) => typeof store.v6pools) =>
      updateConfig({ v6pools: updater(store.v6pools) }),
    [store, updateConfig],
  );
  const updateV6Routes = useCallback(
    (updater: (v6routes: typeof store.v6routes) => typeof store.v6routes) =>
      updateConfig({ v6routes: updater(store.v6routes) }),
    [store, updateConfig],
  );

  const poolsEditor = useArrayFieldEditor(updatePools);
  const routesEditor = useArrayFieldEditor(updateRoutes);
  const dnsEditor = useArrayFieldEditor(updateDnsServers);
  const v6PoolsEditor = useArrayFieldEditor(updateV6Pools);
  const v6RoutesEditor = useArrayFieldEditor(updateV6Routes);

  const load = useCallback(async () => {
    const cfg = await loadNetworkConfig(nwid);
    if (!cfg) return;
    setSelectedNwid(cfg.selectedNwid);
    setNetworkConfig({
      memberIps: [],
      pools: cfg.pools,
      routes: cfg.routes.map((route) => ({
        target: route.target,
        ...(route.via ? { via: route.via } : {}),
      })),
      v6pools: cfg.v6pools,
      v6routes: cfg.v6routes.map((route) => ({
        target: route.target,
        ...(route.via ? { via: route.via } : {}),
      })),
      dnsServers: cfg.dnsServers,
      dnsDomain: cfg.dnsDomain,
    });
    setName((cfg.raw.name as string) || '');
    setDescription((cfg.raw.description as string) || (cfg.raw.desc as string) || '');
    setIsPrivate(cfg.raw.private !== false);
    setEnableBroadcast(cfg.raw.enableBroadcast === true);
    setMulticastLimit(cfg.raw.multicastLimit ?? 32);
    const v4AssignMode = cfg.raw.v4AssignMode;
    const resolvedV4Mode =
      v4AssignMode === 'none' ||
      (typeof v4AssignMode === 'object' && v4AssignMode !== null && v4AssignMode.zt === false)
        ? 'none'
        : 'zt';
    setV4Mode(resolvedV4Mode);
    setDnsDomain(cfg.dnsDomain);
    setV6State({ ...INITIAL_V6_STATE, ...(cfg.raw.v6AssignMode || {}) });
  }, [loadNetworkConfig, nwid, setNetworkConfig, setSelectedNwid]);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <section className="panel" id="panel-network-config">
      <div className="page-hdr">
        <div>
          <div className="page-title">Configure Network</div>
          <div className="page-sub">{nwid}</div>
        </div>
      </div>
      <div className="card">
        <GeneralSection
          name={name}
          description={description}
          isPrivate={isPrivate}
          enableBroadcast={enableBroadcast}
          multicastLimit={multicastLimit}
          v4Mode={v4Mode}
          dnsDomain={dnsDomain}
          onNameChange={setName}
          onDescriptionChange={setDescription}
          onIsPrivateChange={setIsPrivate}
          onEnableBroadcastChange={setEnableBroadcast}
          onMulticastLimitChange={setMulticastLimit}
          onV4ModeChange={setV4Mode}
          onDnsDomainChange={(value) => {
            setDnsDomain(value);
            updateConfig({ dnsDomain: value });
          }}
        />
        <PoolsSection
          pools={store.pools}
          v6pools={store.v6pools}
          poolsEditor={poolsEditor}
          v6PoolsEditor={v6PoolsEditor}
        />
        <V6AssignSection value={v6State} onChange={setV6State} />
        <RoutesSection
          routes={store.routes}
          v6routes={store.v6routes}
          routesEditor={routesEditor}
          v6RoutesEditor={v6RoutesEditor}
        />
        <DnsSection dnsServers={store.dnsServers} dnsEditor={dnsEditor} />
        <button
          type="button"
          className="btn btn-primary"
          onClick={async () => {
            const res = await saveNetworkConfig({
              nwid,
              name,
              description,
              isPrivate,
              enableBroadcast,
              multicastLimit,
              v4Mode,
              v6AssignMode: v6State,
              pools: store.pools,
              v6pools: store.v6pools,
              routes: store.routes,
              v6routes: store.v6routes,
              dnsDomain,
              dnsServers: store.dnsServers,
            });
            toast(
              res.ok ? 'Network saved' : formatApiError(res, 'Save failed'),
              res.ok ? 'ok' : 'err',
            );
          }}
        >
          Save
        </button>
        <button
          type="button"
          className="btn btn-danger"
          onClick={async () => {
            const res = await deleteNetwork(nwid);
            if (res.ok) {
              toast('Deleted network', 'ok');
              navigate('/networks');
            } else {
              toast(formatApiError(res, 'Delete failed'), 'err');
            }
          }}
        >
          Delete
        </button>
      </div>
    </section>
  );
}
