import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatApiError } from '../../api/toApiResult';
import { useApiClient } from '../../hooks/useApiClient';
import { useNetworks } from '../../hooks/useNetworks';
import { useAppStore } from '../../store/appStore';
import { EmptyState, Notice } from '../ui';

export function NetworksPanel() {
  const navigate = useNavigate();
  const { networks, setNetworks, setSelectedNwid } = useAppStore();
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { apiGet } = useApiClient();
  const { loadNetworksData, filterNetworks } = useNetworks({ apiGet });

  const loadNetworks = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    const result = await loadNetworksData();
    setNetworks(result.data.networks);
    if (result.error) {
      setError(formatApiError(result.error, 'Failed to load networks'));
    }

    setIsLoading(false);
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
            disabled={isLoading}
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
        {error ? (
          <Notice kind="error">{error}</Notice>
        ) : filtered.length === 0 && !isLoading ? (
          <EmptyState
            title={query ? 'No networks match your filter' : 'No networks found'}
            description={
              query ? 'Try changing your filter criteria' : 'Create your first ZeroTier network'
            }
            icon={query ? '⬡' : '⬢'}
          />
        ) : (
          filtered.map((nw) => (
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
          ))
        )}
      </div>
    </section>
  );
}
