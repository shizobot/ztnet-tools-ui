import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatApiError, toApiResult } from '../../api/toApiResult';
import { ztPost } from '../../api/ztApi';
import { EASY_RANGES } from '../../constants/easyRanges';
import { useAppStore } from '../../store/appStore';
import { AccessRadioGroup, IpRangeGrid, Notice, RouteRow, useToast } from '../ui';

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
  const navigate = useNavigate();
  const { toast } = useToast();
  const { token, nodeId } = useAppStore();
  const [n, setN] = useState<NewNetworkState>(INITIAL_N);
  const [newNetName, setNewNetName] = useState('');
  const [access, setAccess] = useState<'private' | 'public'>('private');
  const hasNodeId = nodeId.trim().length > 0;

  const fillDefaults = () => {
    setNewNetName('my-network');
    setAccess('private');
    setN({
      pools: [{ ipRangeStart: '192.168.192.1', ipRangeEnd: '192.168.192.254' }],
      routes: [{ target: '192.168.192.0/24', via: null }],
      v6: { ...INITIAL_N.v6 },
      selectedEasyRange: null,
    });
  };

  const createNetwork = async () => {
    if (!hasNodeId) {
      toast('Connect in Settings first: Node ID is required.', 'warn');
      return;
    }

    const result = await toApiResult(() =>
      ztPost({
        path: `/controller/network/${nodeId}______`,
        config: { token },
        body: {
          ipAssignmentPools: n.pools,
          routes: n.routes,
          v4AssignMode: { zt: true },
          v6AssignMode: n.v6,
          private: access === 'private',
          name: newNetName,
        },
      }),
    );

    if (result.ok) {
      toast('Network created', 'ok');
      navigate('/networks');
      return;
    }

    toast(formatApiError(result, 'Failed to create network'), 'err');
  };

  const payloadPreview = useMemo(
    () => ({
      ipAssignmentPools: n.pools,
      routes: n.routes,
      v4AssignMode: { zt: true },
      v6AssignMode: n.v6,
      private: access === 'private',
      name: newNetName,
    }),
    [access, n, newNetName],
  );

  return (
    <section className="panel" id="panel-create-network">
      <div className="page-hdr">
        <div>
          <div className="page-title">Create Network</div>
          <div className="page-sub">
            POST /controller/network/{'{nodeId}'}______ · Connect in Settings first
          </div>
        </div>
        <button className="btn btn-ghost btn-sm" onClick={fillDefaults} type="button">
          ⊛ Fill Defaults
        </button>
      </div>
      <div className="card">
        {!hasNodeId && (
          <Notice kind="warn">Connect in Settings first to provide a valid Node ID.</Notice>
        )}
        <label htmlFor="newNetName">Name</label>
        <input id="newNetName" value={newNetName} onChange={(e) => setNewNetName(e.target.value)} />
        <AccessRadioGroup value={access} onChange={setAccess} />
        <IpRangeGrid
          items={EASY_RANGES.map((r) => ({ cidr: r.cidr, title: r.label }))}
          selected={n.selectedEasyRange ?? undefined}
          onSelect={(cidr) => {
            const range = EASY_RANGES.find((item) => item.cidr === cidr);
            if (!range) return;
            setN((prev) => ({
              ...prev,
              selectedEasyRange: cidr,
              pools: [{ ipRangeStart: range.start, ipRangeEnd: range.end }],
              routes: [{ target: range.cidr, via: null }],
            }));
          }}
        />
        {n.routes.map((route, i) => (
          <RouteRow
            key={`${route.target}-${i}`}
            value={{ target: route.target, via: route.via || '' }}
            onChange={(next) =>
              setN((prev) => ({
                ...prev,
                routes: prev.routes.map((r, idx) =>
                  idx === i ? { target: next.target, via: next.via || null } : r,
                ),
              }))
            }
            onRemove={() =>
              setN((prev) => ({ ...prev, routes: prev.routes.filter((_, idx) => idx !== i) }))
            }
          />
        ))}
        <button
          type="button"
          className="btn"
          onClick={() =>
            setN((prev) => ({ ...prev, routes: [...prev.routes, { target: '', via: null }] }))
          }
        >
          Add route
        </button>
        <button
          type="button"
          className="btn btn-primary"
          disabled={!hasNodeId}
          onClick={() => void createNetwork()}
        >
          Create Network
        </button>
      </div>
      <pre className="terminal">{JSON.stringify(payloadPreview, null, 2)}</pre>
    </section>
  );
}
