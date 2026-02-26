import { useMemo, useState } from 'react';

type V6State = { zt: boolean; rfc4193: boolean; '6plane': boolean };

const INITIAL_V6_STATE: V6State = { zt: false, rfc4193: false, '6plane': false };

export function NetworkConfigPanel() {
  // migrated from global const v6State
  const [v6State, setV6State] = useState<V6State>(INITIAL_V6_STATE);

  const enabledModes = useMemo(
    () => Object.entries(v6State).filter(([, value]) => value).map(([key]) => key),
    [v6State],
  );

  const toggle = (key: keyof V6State) => {
    setV6State((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <section className="panel" id="panel-network-config">
      <div className="page-hdr">
        <div>
          <div className="page-title">Configure Network</div>
          <div className="page-sub">GET/POST /controller/network/{'{nwid}'}</div>
        </div>
      </div>

      <div className="card">
        <div className="page-sub">IPv6 assignment mode (v6State)</div>
        <label>
          <input type="checkbox" checked={v6State.zt} onChange={() => toggle('zt')} /> zt
        </label>
        <label>
          <input type="checkbox" checked={v6State.rfc4193} onChange={() => toggle('rfc4193')} /> rfc4193
        </label>
        <label>
          <input type="checkbox" checked={v6State['6plane']} onChange={() => toggle('6plane')} /> 6plane
        </label>
      </div>

      <pre className="terminal">{JSON.stringify({ v6AssignMode: enabledModes }, null, 2)}</pre>
    </section>
  );
}
