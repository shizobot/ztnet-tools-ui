import { useEffect, useMemo, useState } from 'react';

type CurlVars = {
  host: string;
  token: string;
  nwid: string;
  nodeId: string;
  memId: string;
};

type CurlTabId =
  | 'curl-status'
  | 'curl-list-net'
  | 'curl-create-net'
  | 'curl-get-net'
  | 'curl-config-net'
  | 'curl-list-mem'
  | 'curl-auth-mem'
  | 'curl-del-mem';

export function CurlBuilderPanel() {
  const [activeCurlTab, setActiveCurlTab] = useState<CurlTabId>('curl-status');
  const [vars, setVars] = useState<CurlVars>({
    host: 'http://localhost:9993',
    token: 'YOUR_TOKEN',
    nwid: 'NETWORK_ID',
    nodeId: 'YOUR_NODE_ID',
    memId: 'MEMBER_ID',
  });
  const [output, setOutput] = useState('');

  function cv(k: keyof CurlVars): string {
    const m: Record<keyof CurlVars, () => string> = {
      host: () => vars.host || 'http://localhost:9993',
      token: () => vars.token || 'YOUR_TOKEN',
      nwid: () => vars.nwid || 'NETWORK_ID',
      nodeId: () => vars.nodeId || 'YOUR_NODE_ID',
      memId: () => vars.memId || 'MEMBER_ID',
    };
    return m[k] ? m[k]() : k.toUpperCase();
  }

  const curlTpls: Record<CurlTabId, () => string> = useMemo(
    () => ({
      'curl-status': () => `# ── Node status ─────────────────────────────────
$ curl "${cv('host')}/status" \\
  -H "X-ZT1-AUTH: ${cv('token')}"`,
      'curl-list-net': () => `# ── List networks ───────────────────────────────
$ curl "${cv('host')}/controller/network" \\
  -H "X-ZT1-AUTH: ${cv('token')}"`,
      'curl-create-net': () => `# ── Create network ──────────────────────────────
$ curl -X POST \\
  "${cv('host')}/controller/network/${cv('nodeId')}______" \\
  -H "X-ZT1-AUTH: ${cv('token')}" \\
  -d '{"ipAssignmentPools":[{"ipRangeStart":"192.168.192.1","ipRangeEnd":"192.168.192.254"}],"routes":[{"target":"192.168.192.0/24","via":null}],"v4AssignMode":{"zt":true},"private":true,"name":"my-network"}'`,
      'curl-get-net': () => `# ── Get network details ──────────────────────────
$ curl "${cv('host')}/controller/network/${cv('nwid')}" \\
  -H "X-ZT1-AUTH: ${cv('token')}"`,
      'curl-config-net': () => `# ── Update network configuration ─────────────────
$ curl -X POST \\
  "${cv('host')}/controller/network/${cv('nwid')}" \\
  -H "X-ZT1-AUTH: ${cv('token')}" \\
  -d '{"name":"updated-name","private":true,"multicastLimit":32}'

# ── Delete network ────────────────────────────────
$ curl -X DELETE \\
  "${cv('host')}/controller/network/${cv('nwid')}" \\
  -H "X-ZT1-AUTH: ${cv('token')}"`,
      'curl-list-mem': () => `# ── List network members ─────────────────────────
$ curl "${cv('host')}/controller/network/${cv('nwid')}/member" \\
  -H "X-ZT1-AUTH: ${cv('token')}"

# ── Get specific member ───────────────────────────
$ curl "${cv('host')}/controller/network/${cv('nwid')}/member/${cv('memId')}" \\
  -H "X-ZT1-AUTH: ${cv('token')}"`,
      'curl-auth-mem': () => `# ── Authorize a member ───────────────────────────
$ curl -X POST \\
  "${cv('host')}/controller/network/${cv('nwid')}/member/${cv('memId')}" \\
  -H "X-ZT1-AUTH: ${cv('token')}" \\
  -d '{"authorized":true}'

# ── Deauthorize a member ──────────────────────────
$ curl -X POST \\
  "${cv('host')}/controller/network/${cv('nwid')}/member/${cv('memId')}" \\
  -H "X-ZT1-AUTH: ${cv('token')}" \\
  -d '{"authorized":false}'`,
      'curl-del-mem': () => `# ⚠ Deauthorize FIRST, then delete ───────────────
$ curl -X POST \\
  "${cv('host')}/controller/network/${cv('nwid')}/member/${cv('memId')}" \\
  -H "X-ZT1-AUTH: ${cv('token')}" \\
  -d '{"authorized":false}'

$ curl -X DELETE \\
  "${cv('host')}/controller/network/${cv('nwid')}/member/${cv('memId')}" \\
  -H "X-ZT1-AUTH: ${cv('token')}"`,
    }),
    [vars.host, vars.memId, vars.nodeId, vars.nwid, vars.token],
  );

  function renderCurl() {
    const fn = curlTpls[activeCurlTab];
    if (fn) setOutput(fn());
  }

  useEffect(() => {
    renderCurl();
  }, [activeCurlTab, curlTpls]);

  return (
    <section className="panel" id="panel-terminal">
      <div className="page-hdr">
        <div>
          <div className="page-title">cURL Builder</div>
          <div className="page-sub">Generate ready-to-paste shell commands</div>
        </div>
      </div>
      <div className="card">
        <select value={activeCurlTab} onChange={(e) => setActiveCurlTab(e.target.value as CurlTabId)}>
          {Object.keys(curlTpls).map((key) => (
            <option key={key} value={key}>
              {key}
            </option>
          ))}
        </select>
      </div>
      <pre className="terminal">{output}</pre>
    </section>
  );
}
