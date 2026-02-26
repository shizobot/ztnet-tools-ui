import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApiClient } from '../../hooks/useApiClient';
import { useNetworks } from '../../hooks/useNetworks';
import { useAppStore } from '../../store/appStore';

export function DashboardPanel() {
  const navigate = useNavigate();
  const { nodeId, connected, networks, setNetworks } = useAppStore();
  const [authorized, setAuthorized] = useState(0);
  const [pending, setPending] = useState(0);

  const { apiGet } = useApiClient();
  const { loadNetworksData } = useNetworks({ apiGet });

  const refreshDashboard = useCallback(async () => {
    if (!connected) return;
    const data = await loadNetworksData();
    setNetworks(data.networks);
    setAuthorized(data.authorizedCount);
    setPending(data.pendingCount);
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
        <div>
          {networks.slice(0, 8).map((nw) => (
            <div key={nw.id} className="route-row">
              <span>{nw.id}</span>
              <span>{String(nw.name || 'unnamed')}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
