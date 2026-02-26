import { useMemo, useState } from 'react';
import type { FormEvent } from 'react';

import { formatApiError, toApiResult } from '../../api/toApiResult';
import { ztGet } from '../../api/ztApi';
import { useConnection } from '../../hooks/useConnection';
import { useAppStore } from '../../store/appStore';
import { useToast } from '../ui';

export function SettingsPanel() {
  const { host, token, setConnectionPrefs, setConnected, nodeId: currentNodeId } = useAppStore();
  const [formHost, setFormHost] = useState(host || 'http://localhost:9993');
  const [formToken, setFormToken] = useState(token);
  const [status, setStatus] = useState('');
  const [persistToken, setPersistToken] = useState(false);
  const { toast } = useToast();

  const apiGet = async <T,>(path: string) =>
    toApiResult(() => ztGet<T>({ path, config: { baseUrl: formHost, token: formToken } }));

  const { testConnection, clearPrefs } = useConnection({
    apiGet,
    refreshDashboard: () => undefined,
  });

  const applySettings = async (event: FormEvent) => {
    event.preventDefault();
    const next = await testConnection({ host: formHost, token: formToken, persistToken });
    setConnectionPrefs({ host: next.host, token: next.token, nodeId: next.nodeId });
    setConnected(next.connected);

    if (next.connected) {
      const message = `Connected. Node ID: ${next.nodeId}`;
      setStatus(message);
      toast('Connected to controller', 'ok');
      return;
    }

    const failedResult = await apiGet('/status');
    const message = formatApiError(failedResult, next.errorMessage ?? 'Connection failed');
    setStatus(message);
    toast(message, 'err');
  };

  const clearSettings = () => {
    setFormHost('http://localhost:9993');
    setFormToken('');
    clearPrefs();
    setConnectionPrefs({ host: '', token: '', nodeId: '' });
    setConnected(false);
    setStatus('Cleared');
  };

  const effectiveNode = useMemo(() => currentNodeId || '—', [currentNodeId]);

  return (
    <section className="panel" id="panel-settings">
      <div className="page-hdr">
        <div>
          <div className="page-title">Connection Settings</div>
        </div>
      </div>
      <form className="card" onSubmit={applySettings}>
        <label className="lbl" htmlFor="settingsHost">
          API Host URL
        </label>
        <input
          id="settingsHost"
          className="form-input"
          value={formHost}
          onChange={(e) => setFormHost(e.target.value)}
        />
        <label className="lbl" htmlFor="settingsToken">
          Auth Token
        </label>
        <input
          id="settingsToken"
          type="password"
          className="form-input"
          value={formToken}
          onChange={(e) => setFormToken(e.target.value)}
        />
        <label className="lbl" htmlFor="settingsPersistToken">
          <input
            id="settingsPersistToken"
            type="checkbox"
            checked={persistToken}
            onChange={(e) => setPersistToken(e.target.checked)}
          />
          Remember token on this device
        </label>
        <div className="flex gap-8">
          <button type="submit" className="btn btn-primary">
            ✓ Apply & Connect
          </button>
          <button type="button" className="btn btn-ghost" onClick={clearSettings}>
            ✕ Clear
          </button>
        </div>
        <div id="settingsStatus">{status || `Current Node ID: ${effectiveNode}`}</div>
      </form>
    </section>
  );
}
