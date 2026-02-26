import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApiClient } from '../../hooks/useApiClient';
import { useNetworks } from '../../hooks/useNetworks';
import { useAppStore } from '../../store/appStore';

export function NetworksPanel() {
  const navigate = useNavigate();
  const { networks, setNetworks, setSelectedNwid } = useAppStore();
  const [query, setQuery] = useState('');

  const { apiGet } = useApiClient();
  const { loadNetworksData, filterNetworks } = useNetworks({ apiGet });

  const loadNetworks = useCallback(async () => {
    const data = await loadNetworksData();
    setNetworks(data.networks);
  }, [loadNetworksData, setNetworks]);

  useEffect(() => {
    void loadNetworks();
  }, [loadNetworks]);

  const filtered = useMemo(
    () => filterNetworks(networks, query),
    [filterNetworks, networks, query],
  );

  return (
    <section className="panel" id="panel-networks">
      <div className="page-hdr">
        <div>
          <div className="page-title">Networks</div>
          <div className="page-sub">GET /controller/network</div>
        </div>
        <div className="page-actions">
          <button
            className="btn btn-ghost btn-sm"
            type="button"
            onClick={() => void loadNetworks()}
          >
            ↻ Refresh
          </button>
          <button
            className="btn btn-primary btn-sm"
            type="button"
            onClick={() => navigate('/networks/create')}
          >
            ⊕ Create
          </button>
        </div>
      </div>
      <div className="search-bar">
        <input
          className="form-input"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Filter networks..."
        />
      </div>
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
            <span>{nw.id}</span>
            <span>{String(nw.name || 'unnamed')}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
