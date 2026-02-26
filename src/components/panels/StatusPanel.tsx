import { useState } from 'react';
import { formatApiError } from '../../api/toApiResult';
import { useApiClient } from '../../hooks/useApiClient';
import { copyEl } from '../../lib/clipboard';
import { useToast } from '../ui';

export function StatusPanel() {
  const { apiGet } = useApiClient();
  const { toast } = useToast();
  const [output, setOutput] = useState('Connect and click Refresh to load status.');

  const loadStatus = async () => {
    const result = await apiGet<Record<string, unknown>>('/status');
    if (result.ok) {
      setOutput(JSON.stringify(result.data, null, 2));
      return;
    }

    const message = formatApiError(result, 'Failed to load status');
    setOutput(message);
    toast(message, 'err');
  };

  return (
    <section className="panel" id="panel-status">
      <div className="page-hdr">
        <div>
          <div className="page-title">Node Status</div>
          <div className="page-sub">GET /status</div>
        </div>
        <div className="page-actions">
          <button className="btn btn-ghost btn-sm" type="button" onClick={() => void loadStatus()}>
            ↻ Refresh
          </button>
          <button
            className="copy-btn"
            type="button"
            onClick={() => void copyEl('statusOutput').then(() => toast('Copied', 'ok'))}
          >
            ⎘ Copy
          </button>
        </div>
      </div>
      <div className="card mb-0">
        <pre className="resp" id="statusOutput">
          {output}
        </pre>
      </div>
    </section>
  );
}
