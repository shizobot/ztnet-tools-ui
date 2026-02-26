import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { formatApiError } from '../../api/toApiResult';
import { useApiClient } from '../../hooks/useApiClient';
import { useNetworkConfig } from '../../hooks/useNetworkConfig';
import { useAppStore } from '../../store/appStore';
import { DnsServerRow, RouteRow, Toggle, useToast } from '../ui';

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
    (updater: (pools: typeof store.pools) => typeof store.pools) => {
      updateConfig({ pools: updater(store.pools) });
    },
    [store.pools, updateConfig],
  );

  const updateRoutes = useCallback(
    (updater: (routes: typeof store.routes) => typeof store.routes) => {
      updateConfig({ routes: updater(store.routes) });
    },
    [store.routes, updateConfig],
  );

  const updateDnsServers = useCallback(
    (updater: (dnsServers: typeof store.dnsServers) => typeof store.dnsServers) => {
      updateConfig({ dnsServers: updater(store.dnsServers) });
    },
    [store.dnsServers, updateConfig],
  );

  const updateV6Pools = useCallback(
    (updater: (v6pools: typeof store.v6pools) => typeof store.v6pools) => {
      updateConfig({ v6pools: updater(store.v6pools) });
    },
    [store.v6pools, updateConfig],
  );

  const updateV6Routes = useCallback(
    (updater: (v6routes: typeof store.v6routes) => typeof store.v6routes) => {
      updateConfig({ v6routes: updater(store.v6routes) });
    },
    [store.v6routes, updateConfig],
  );

  const load = useCallback(async () => {
    const cfg = await loadNetworkConfig(nwid);
    if (!cfg) return;
    setSelectedNwid(cfg.selectedNwid);
    setNetworkConfig({
      memberIps: [],
      pools: cfg.pools,
      routes: cfg.routes.map((r) => ({ target: r.target, ...(r.via ? { via: r.via } : {}) })),
      v6pools: cfg.v6pools,
      v6routes: cfg.v6routes.map((r) => ({ target: r.target, ...(r.via ? { via: r.via } : {}) })),
      dnsServers: cfg.dnsServers,
      dnsDomain: cfg.dnsDomain,
    });
    setName((cfg.raw.name as string) || '');
    setDescription((cfg.raw.description as string) || (cfg.raw.desc as string) || '');
    setIsPrivate(cfg.raw.private !== false);
    setEnableBroadcast(cfg.raw.enableBroadcast === true);
    setMulticastLimit(cfg.raw.multicastLimit ?? 32);
    setV4Mode(cfg.raw.v4AssignMode === 'none' ? 'none' : cfg.raw.v4AssignMode?.zt === false ? 'none' : 'zt');
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
        <label htmlFor="networkName">Name</label>
        <input id="networkName" value={name} onChange={(e) => setName(e.target.value)} />
        <label htmlFor="networkDescription">Description</label>
        <input
          id="networkDescription"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <Toggle checked={isPrivate} onChange={setIsPrivate} label="Private" />
        <Toggle checked={enableBroadcast} onChange={setEnableBroadcast} label="Enable broadcast" />
        <label htmlFor="multicastLimit">Multicast recipient limit</label>
        <input
          id="multicastLimit"
          type="number"
          min={0}
          value={multicastLimit}
          onChange={(e) => setMulticastLimit(Number(e.target.value) || 0)}
        />
        <label htmlFor="v4Mode">IPv4 assignment mode</label>
        <select id="v4Mode" value={v4Mode} onChange={(e) => setV4Mode(e.target.value as 'zt' | 'none')}>
          <option value="zt">ZeroTier managed</option>
          <option value="none">None</option>
        </select>
        <label htmlFor="dnsDomain">DNS domain</label>
        <input
          id="dnsDomain"
          value={dnsDomain}
          onChange={(e) => {
            const value = e.target.value;
            setDnsDomain(value);
            updateConfig({ dnsDomain: value });
          }}
        />

        {store.pools.map((pool, i) => (
          <div className="route-row" key={`${pool.ipRangeStart}-${pool.ipRangeEnd}-${i}`}>
            <input
              placeholder="Pool start"
              value={pool.ipRangeStart}
              onChange={(e) =>
                updatePools((pools) =>
                  pools.map((item, idx) =>
                    idx === i ? { ...item, ipRangeStart: e.target.value } : item,
                  ),
                )
              }
            />
            <input
              placeholder="Pool end"
              value={pool.ipRangeEnd}
              onChange={(e) =>
                updatePools((pools) =>
                  pools.map((item, idx) =>
                    idx === i ? { ...item, ipRangeEnd: e.target.value } : item,
                  ),
                )
              }
            />
            <button type="button" className="btn btn-danger btn-sm" onClick={() => updatePools((pools) => pools.filter((_, idx) => idx !== i))}>
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          className="btn"
          onClick={() => updatePools((pools) => [...pools, { ipRangeStart: '', ipRangeEnd: '' }])}
        >
          Add IPv4 Pool
        </button>
        <Toggle
          checked={v6State.zt}
          onChange={(v) => setV6State((p) => ({ ...p, zt: v }))}
          label="IPv6 zt"
        />
        <Toggle
          checked={v6State.rfc4193}
          onChange={(v) => setV6State((p) => ({ ...p, rfc4193: v }))}
          label="IPv6 rfc4193"
        />
        <Toggle
          checked={v6State['6plane']}
          onChange={(v) => setV6State((p) => ({ ...p, '6plane': v }))}
          label="IPv6 6plane"
        />

        {store.routes.map((route, i) => (
          <RouteRow
            key={`${route.target}-${i}`}
            value={{ target: route.target, via: route.via || '' }}
            onChange={(next) =>
              updateRoutes((routes) =>
                routes.map((r, idx) =>
                  idx === i ? { target: next.target, via: next.via || undefined } : r,
                ),
              )
            }
            onRemove={() => updateRoutes((routes) => routes.filter((_, idx) => idx !== i))}
          />
        ))}
        <button
          type="button"
          className="btn"
          onClick={() => updateRoutes((routes) => [...routes, { target: '', via: '' }])}
        >
          Add Route
        </button>
        {store.v6pools.map((pool, i) => (
          <div className="route-row" key={`${pool.ipRangeStart}-${pool.ipRangeEnd}-${i}`}>
            <input
              placeholder="IPv6 pool start"
              value={pool.ipRangeStart}
              onChange={(e) =>
                updateV6Pools((v6pools) =>
                  v6pools.map((item, idx) =>
                    idx === i ? { ...item, ipRangeStart: e.target.value } : item,
                  ),
                )
              }
            />
            <input
              placeholder="IPv6 pool end"
              value={pool.ipRangeEnd}
              onChange={(e) =>
                updateV6Pools((v6pools) =>
                  v6pools.map((item, idx) =>
                    idx === i ? { ...item, ipRangeEnd: e.target.value } : item,
                  ),
                )
              }
            />
            <button type="button" className="btn btn-danger btn-sm" onClick={() => updateV6Pools((v6pools) => v6pools.filter((_, idx) => idx !== i))}>
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          className="btn"
          onClick={() =>
            updateV6Pools((v6pools) => [...v6pools, { ipRangeStart: '', ipRangeEnd: '' }])
          }
        >
          Add IPv6 Pool
        </button>
        {store.v6routes.map((route, i) => (
          <RouteRow
            key={`${route.target}-${i}`}
            value={{ target: route.target, via: route.via || '' }}
            onChange={(next) =>
              updateV6Routes((v6routes) =>
                v6routes.map((r, idx) =>
                  idx === i ? { target: next.target, via: next.via || undefined } : r,
                ),
              )
            }
            onRemove={() => updateV6Routes((v6routes) => v6routes.filter((_, idx) => idx !== i))}
          />
        ))}
        <button
          type="button"
          className="btn"
          onClick={() => updateV6Routes((v6routes) => [...v6routes, { target: '', via: '' }])}
        >
          Add IPv6 Route
        </button>
        {store.dnsServers.map((dns, i) => (
          <DnsServerRow
            key={`${dns}-${i}`}
            value={dns}
            onChange={(value) =>
              updateDnsServers((dnsServers) =>
                dnsServers.map((item, idx) => (idx === i ? value : item)),
              )
            }
            onRemove={() => updateDnsServers((dnsServers) => dnsServers.filter((_, idx) => idx !== i))}
          />
        ))}
        <button
          type="button"
          className="btn"
          onClick={() => updateDnsServers((dnsServers) => [...dnsServers, ''])}
        >
          Add DNS
        </button>
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
