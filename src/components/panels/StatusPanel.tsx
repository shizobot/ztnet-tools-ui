import { useState } from 'react';
import { ztGet } from '../../api/ztApi';
import { copyEl } from '../../lib/clipboard';
import { useAppStore } from '../../store/appStore';
import { useToast } from '../ui';

export function StatusPanel() {
  const token = useAppStore((state) => state.token);
  const { toast } = useToast();
  const [output, setOutput] = useState('Connect and click Refresh to load status.');

  const loadStatus = async () => {
    try {
      const data = await ztGet<Record<string, unknown>>({ path: '/status', config: { token } });
      setOutput(JSON.stringify(data, null, 2));
    } catch (error) {
      setOutput(String(error));
    }
  };

  return (
    <section className="panel" id="panel-status">
      <div className="page-hdr">
        <div><div className="page-title">Node Status</div><div className="page-sub">GET /status</div></div>
        <div className="page-actions">
          <button className="btn btn-ghost btn-sm" type="button" onClick={() => void loadStatus()}>↻ Refresh</button>
          <button className="copy-btn" type="button" onClick={() => void copyEl('statusOutput').then(() => toast('Copied', 'ok'))}>⎘ Copy</button>
        </div>
      </div>
      <div className="card mb-0"><pre className="resp" id="statusOutput">{output}</pre></div>
    </section>
  );
}
