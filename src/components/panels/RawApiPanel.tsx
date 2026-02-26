import { FormEvent, useState } from 'react';
import { formatApiError, toApiResult } from '../../api/toApiResult';
import { ztDelete, ztGet, ztPost } from '../../api/ztApi';
import { useAppStore } from '../../store/appStore';
import { copyText } from '../../lib/clipboard';
import { useToast } from '../ui';

export function RawApiPanel() {
  const token = useAppStore((state) => state.token);
  const { toast } = useToast();
  const [method, setMethod] = useState<'GET' | 'POST' | 'DELETE'>('GET');
  const [path, setPath] = useState('/status');
  const [body, setBody] = useState('{\n  \n}');
  const [output, setOutput] = useState('');

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const result = await toApiResult(async () => {
      if (method === 'GET') return ztGet({ path, config: { token } });
      if (method === 'DELETE') return ztDelete({ path, config: { token } });
      return ztPost({ path, config: { token }, body: JSON.parse(body) as Record<string, unknown> });
    });

    if (result.ok) {
      setOutput(JSON.stringify(result.data, null, 2));
      return;
    }

    const message = formatApiError(result, 'Raw API request failed');
    setOutput(message);
    toast(message, 'err');
  };

  return (
    <section className="panel" id="panel-raw-api">
      <div className="page-hdr">
        <div>
          <div className="page-title">Raw API</div>
        </div>
      </div>
      <form className="card" onSubmit={submit}>
        <div className="route-row">
          <select
            value={method}
            onChange={(e) => setMethod(e.target.value as 'GET' | 'POST' | 'DELETE')}
          >
            <option>GET</option>
            <option>POST</option>
            <option>DELETE</option>
          </select>
          <input value={path} onChange={(e) => setPath(e.target.value)} />
          <button className="btn btn-primary" type="submit">
            Send
          </button>
        </div>
        {method === 'POST' && (
          <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={8} />
        )}
      </form>
      <div className="card">
        <button
          className="copy-btn"
          onClick={() => void copyText(output).then(() => toast('Copied', 'ok'))}
        >
          ⎘ Copy
        </button>
        <pre className="resp">{output}</pre>
      </div>
    </section>
  );
}
