import { useMemo, useState } from 'react';

type Pool = { ipRangeStart: string; ipRangeEnd: string };
type Route = { target: string; via: string | null };

type NewNetworkState = {
  pools: Pool[];
  routes: Route[];
  v6: { rfc4193: boolean; '6plane': boolean; zt: boolean };
  selectedEasyRange: string | null;
};

const INITIAL_N: NewNetworkState = {
  pools: [],
  routes: [],
  v6: { rfc4193: false, '6plane': false, zt: false },
  selectedEasyRange: null,
};

export function CreateNetworkPanel() {
  // migrated from global const N
  const [n, setN] = useState<NewNetworkState>(INITIAL_N);
  const [newNetName, setNewNetName] = useState('');
  const [isPrivate, setIsPrivate] = useState(true);

  const fillDefaults = () => {
    setNewNetName('my-network');
    setIsPrivate(true);
    setN({
      pools: [{ ipRangeStart: '192.168.192.1', ipRangeEnd: '192.168.192.254' }],
      routes: [{ target: '192.168.192.0/24', via: null }],
      v6: { ...INITIAL_N.v6 },
      selectedEasyRange: null,
    });
  };

  const payloadPreview = useMemo(
    () => ({
      ipAssignmentPools: n.pools,
      routes: n.routes,
      v4AssignMode: { zt: true },
      v6AssignMode: n.v6,
      private: isPrivate,
      name: newNetName,
    }),
    [isPrivate, n.pools, n.routes, n.v6, newNetName],
  );

  return (
    <section className="panel" id="panel-create-network">
      <div className="page-hdr">
        <div>
          <div className="page-title">Create Network</div>
          <div className="page-sub">POST /controller/network/{'{nodeId}'}______</div>
        </div>
        <div className="page-actions">
          <button className="btn btn-ghost btn-sm" onClick={fillDefaults} type="button">
            ⊛ Fill Defaults
          </button>
        </div>
      </div>

      <div className="card">
        <label htmlFor="newNetName">Name</label>
        <input id="newNetName" value={newNetName} onChange={(e) => setNewNetName(e.target.value)} />
      </div>

      <pre className="terminal">{JSON.stringify(payloadPreview, null, 2)}</pre>
    </section>
  );
}
