import { FormEvent, useState } from 'react';
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
    try {
      let data: unknown;
      if (method === 'GET') data = await ztGet({ path, config: { token } });
      else if (method === 'DELETE') data = await ztDelete({ path, config: { token } });
      else data = await ztPost({ path, config: { token }, body: JSON.parse(body) as Record<string, unknown> });
      setOutput(JSON.stringify(data, null, 2));
    } catch (error) {
      setOutput(String(error));
    }
  };

  return (
    <section className="panel" id="panel-raw-api">
      <div className="page-hdr"><div><div className="page-title">Raw API</div></div></div>
      <form className="card" onSubmit={submit}>
        <div className="route-row">
          <select value={method} onChange={(e) => setMethod(e.target.value as 'GET' | 'POST' | 'DELETE')}><option>GET</option><option>POST</option><option>DELETE</option></select>
          <input value={path} onChange={(e) => setPath(e.target.value)} />
          <button className="btn btn-primary" type="submit">Send</button>
        </div>
        {method === 'POST' && <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={8} />}
      </form>
      <div className="card"><button className="copy-btn" onClick={() => void copyText(output).then(() => toast('Copied', 'ok'))}>⎘ Copy</button><pre className="resp">{output}</pre></div>
    </section>
  );
}
