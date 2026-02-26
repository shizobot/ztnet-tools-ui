import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ztGet } from '../../api/ztApi';
import { useNetworks } from '../../hooks/useNetworks';
import { useAppStore } from '../../store/appStore';

export function NetworksPanel() {
  const navigate = useNavigate();
  const { host, token, networks, setNetworks, setSelectedNwid } = useAppStore();
  const [query, setQuery] = useState('');

  const apiGet = async <T,>(path: string) => {
    try {
      const data = await ztGet<T>({ path, config: { host, token } });
      return { ok: true, status: 200, data };
    } catch {
      return { ok: false, status: 500, data: null };
    }
  };
  const { loadNetworksData, filterNetworks } = useNetworks({ apiGet });

  const loadNetworks = async () => {
    const data = await loadNetworksData();
    setNetworks(data.networks);
  };

  useEffect(() => { void loadNetworks(); }, []);

  const filtered = useMemo(() => filterNetworks(networks, query), [filterNetworks, networks, query]);

  return (
    <section className="panel" id="panel-networks">
      <div className="page-hdr">
        <div><div className="page-title">Networks</div><div className="page-sub">GET /controller/network</div></div>
        <div className="page-actions">
          <button className="btn btn-ghost btn-sm" type="button" onClick={() => void loadNetworks()}>↻ Refresh</button>
          <button className="btn btn-primary btn-sm" type="button" onClick={() => navigate('/networks/create')}>⊕ Create</button>
        </div>
      </div>
      <div className="search-bar"><input className="form-input" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Filter networks..." /></div>
      <div className="card">
        {filtered.map((nw) => (
          <button
            type="button"
            key={nw.id}
            className="route-row"
            onClick={() => {
              setSelectedNwid(nw.id);
              navigate(`/networks/${nw.id}`);
            }}
          >
            <span>{nw.id}</span><span>{String(nw.name || 'unnamed')}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
