import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatApiError } from '../../api/toApiResult';
import { useApiClient } from '../../hooks/useApiClient';
import { useNetworks } from '../../hooks/useNetworks';
import { useAppStore } from '../../store/appStore';
import { EmptyState, Notice } from '../ui';

export function DashboardPanel() {
  const navigate = useNavigate();
  const { nodeId, connected, networks, setNetworks } = useAppStore();
  const [authorized, setAuthorized] = useState(0);
  const [pending, setPending] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { apiGet } = useApiClient();
  const { loadNetworksData } = useNetworks({ apiGet });

  const refreshDashboard = useCallback(async () => {
    if (!connected) return;

    setIsLoading(true);
    setError(null);

    const result = await loadNetworksData();
    setNetworks(result.data.networks);
    setAuthorized(result.data.authorizedCount);
    setPending(result.data.pendingCount);
    if (result.error) {
      setError(formatApiError(result.error, 'Failed to load dashboard data'));
    }

    setIsLoading(false);
  }, [connected, loadNetworksData, setNetworks]);

  useEffect(() => {
    void refreshDashboard();
  }, [refreshDashboard]);

  return (
    <section className="panel" id="panel-dashboard">
      <div className="page-hdr">
        <div>
          <div className="page-title">Dashboard</div>
          <div className="page-sub">ZeroTier Controller Overview</div>
        </div>
        <button
          className="btn btn-ghost btn-sm"
          onClick={() => void refreshDashboard()}
          type="button"
          disabled={isLoading}
        >
          ↻ Refresh
        </button>
      </div>
      <div className="stats-row">
        <div className="stat s-blue">
          <div className="stat-lbl">Networks</div>
          <div className="stat-val c-blue">{networks.length || '—'}</div>
        </div>
        <div className="stat s-green">
          <div className="stat-lbl">Authorized</div>
          <div className="stat-val c-green">{authorized || '—'}</div>
        </div>
        <div className="stat s-red">
          <div className="stat-lbl">Pending</div>
          <div className="stat-val c-red">{pending || '—'}</div>
        </div>
        <div className="stat s-purple">
          <div className="stat-lbl">Node ID</div>
          <div className="stat-val c-purple">{nodeId || '—'}</div>
        </div>
      </div>
      <div className="card">
        <div className="card-hdr">
          <div className="card-title">Networks</div>
          <button
            className="btn btn-ghost btn-sm"
            type="button"
            onClick={() => navigate('/networks/create')}
          >
            ⊕ New
          </button>
        </div>
        {error ? (
          <Notice kind="error">{error}</Notice>
        ) : networks.length === 0 && !isLoading ? (
          <EmptyState
            title="No networks yet"
            description="Create your first network to get started"
            icon="⬡"
          />
        ) : (
          <div>
            {networks.slice(0, 8).map((nw) => (
              <div key={nw.id} className="route-row">
                <span>{nw.id}</span>
                <span>{String(nw.name || 'unnamed')}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
