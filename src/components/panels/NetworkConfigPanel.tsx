import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
  const [v6State, setV6State] = useState<V6State>(INITIAL_V6_STATE);

  const { apiGet, apiPost, apiDelete } = useApiClient();
  const { loadNetworkConfig, saveNetworkConfig, deleteNetwork } = useNetworkConfig({ apiGet, apiPost, apiDelete });
  const store = useAppStore();

  const load = async () => {
    const cfg = await loadNetworkConfig(nwid);
    if (!cfg) return;
    setSelectedNwid(cfg.selectedNwid);
    setNetworkConfig({ memberIps: [], pools: cfg.pools, routes: cfg.routes.map((r) => ({ target: r.target, ...(r.via ? { via: r.via } : {}) })), v6pools: cfg.v6pools, v6routes: cfg.v6routes.map((r) => ({ target: r.target, ...(r.via ? { via: r.via } : {}) })), dnsServers: cfg.dnsServers, dnsDomain: cfg.dnsDomain });
    setName((cfg.raw.name as string) || '');
    setDescription((cfg.raw.description as string) || (cfg.raw.desc as string) || '');
    setIsPrivate(cfg.raw.private !== false);
    setV6State({ ...INITIAL_V6_STATE, ...(cfg.raw.v6AssignMode || {}) });
  };

  useEffect(() => { void load(); }, [nwid]);

  return (
    <section className="panel" id="panel-network-config">
      <div className="page-hdr"><div><div className="page-title">Configure Network</div><div className="page-sub">{nwid}</div></div></div>
      <div className="card">
        <label>Name</label><input value={name} onChange={(e) => setName(e.target.value)} />
        <label>Description</label><input value={description} onChange={(e) => setDescription(e.target.value)} />
        <Toggle checked={isPrivate} onChange={setIsPrivate} label="Private" />
        <Toggle checked={v6State.zt} onChange={(v) => setV6State((p) => ({ ...p, zt: v }))} label="IPv6 zt" />
        <Toggle checked={v6State.rfc4193} onChange={(v) => setV6State((p) => ({ ...p, rfc4193: v }))} label="IPv6 rfc4193" />
        <Toggle checked={v6State['6plane']} onChange={(v) => setV6State((p) => ({ ...p, '6plane': v }))} label="IPv6 6plane" />

        {store.routes.map((route, i) => (
          <RouteRow key={`${route.target}-${i}`} value={{ target: route.target, via: route.via || '' }} onChange={(next) => setNetworkConfig({ routes: store.routes.map((r, idx) => idx === i ? { target: next.target, via: next.via || undefined } : r), pools: store.pools, v6pools: store.v6pools, v6routes: store.v6routes, dnsServers: store.dnsServers, dnsDomain: store.dnsDomain, memberIps: store.memberIps })} onRemove={() => setNetworkConfig({ routes: store.routes.filter((_, idx) => idx !== i), pools: store.pools, v6pools: store.v6pools, v6routes: store.v6routes, dnsServers: store.dnsServers, dnsDomain: store.dnsDomain, memberIps: store.memberIps })} />
        ))}
        <button type="button" className="btn" onClick={() => setNetworkConfig({ routes: [...store.routes, { target: '', via: '' }], pools: store.pools, v6pools: store.v6pools, v6routes: store.v6routes, dnsServers: store.dnsServers, dnsDomain: store.dnsDomain, memberIps: store.memberIps })}>Add Route</button>
        {store.dnsServers.map((dns, i) => <DnsServerRow key={`${dns}-${i}`} value={dns} onChange={(value) => setNetworkConfig({ dnsServers: store.dnsServers.map((item, idx) => idx === i ? value : item), dnsDomain: store.dnsDomain, pools: store.pools, routes: store.routes, v6pools: store.v6pools, v6routes: store.v6routes, memberIps: store.memberIps })} onRemove={() => setNetworkConfig({ dnsServers: store.dnsServers.filter((_, idx) => idx !== i), dnsDomain: store.dnsDomain, pools: store.pools, routes: store.routes, v6pools: store.v6pools, v6routes: store.v6routes, memberIps: store.memberIps })} />)}
        <button type="button" className="btn" onClick={() => setNetworkConfig({ dnsServers: [...store.dnsServers, ''], dnsDomain: store.dnsDomain, pools: store.pools, routes: store.routes, v6pools: store.v6pools, v6routes: store.v6routes, memberIps: store.memberIps })}>Add DNS</button>
        <button type="button" className="btn btn-primary" onClick={async () => {
          const res = await saveNetworkConfig({ nwid, name, description, isPrivate, enableBroadcast: false, multicastLimit: 32, v4Mode: 'zt', v6AssignMode: v6State, pools: store.pools, v6pools: store.v6pools, routes: store.routes, v6routes: store.v6routes, dnsDomain: store.dnsDomain, dnsServers: store.dnsServers });
          toast(res?.ok ? 'Network saved' : 'Save failed', res?.ok ? 'ok' : 'err');
        }}>Save</button>
        <button type="button" className="btn btn-danger" onClick={async () => {
          const res = await deleteNetwork(nwid);
          if (res?.ok) { toast('Deleted network', 'ok'); navigate('/networks'); } else { toast('Delete failed', 'err'); }
        }}>Delete</button>
      </div>
    </section>
  );
}
