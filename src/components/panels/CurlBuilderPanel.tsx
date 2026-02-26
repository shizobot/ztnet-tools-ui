import { useMemo, useState } from 'react';
import { curlTpls, type CurlTemplateKey } from '../../constants/curlTemplates';
import { useAppStore } from '../../store/appStore';
import { copyText } from '../../lib/clipboard';
import { useToast } from '../ui';

export function CurlBuilderPanel() {
  const { host, token, selectedNwid, nodeId } = useAppStore();
  const { toast } = useToast();
  const [activeCurlTab, setActiveCurlTab] = useState<CurlTemplateKey>('curl-status');
  const [memId, setMemId] = useState('MEMBER_ID');

  const values = useMemo(
    () => ({
      host: host || 'http://localhost:9993',
      token: token || 'YOUR_TOKEN',
      nwid: selectedNwid || 'NETWORK_ID',
      nodeId: nodeId || 'YOUR_NODE_ID',
      memId: memId || 'MEMBER_ID',
    }),
    [host, token, selectedNwid, nodeId, memId],
  );

  const output = useMemo(() => curlTpls[activeCurlTab]((k) => values[k]), [activeCurlTab, values]);

  return (
    <section className="panel" id="panel-terminal">
      <div className="page-hdr">
        <div>
          <div className="page-title">cURL Builder</div>
        </div>
      </div>
      <div className="card">
        <select
          value={activeCurlTab}
          onChange={(e) => setActiveCurlTab(e.target.value as CurlTemplateKey)}
        >
          {Object.keys(curlTpls).map((k) => (
            <option key={k} value={k}>
              {k}
            </option>
          ))}
        </select>
        <input value={memId} onChange={(e) => setMemId(e.target.value)} placeholder="member id" />
      </div>
      <div className="card">
        <button
          className="copy-btn"
          onClick={() => void copyText(output).then(() => toast('Copied', 'ok'))}
        >
          ⎘ Copy
        </button>
        <pre className="terminal">{output}</pre>
      </div>
    </section>
  );
}
