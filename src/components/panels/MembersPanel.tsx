import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApiClient } from '../../hooks/useApiClient';
import { useMembers } from '../../hooks/useMembers';
import { useAppStore } from '../../store/appStore';
import { NetworkPicker, useToast } from '../ui';

export function MembersPanel() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { selectedNwid, setSelectedNwid, networks } = useAppStore();
  const [members, setMembers] = useState<
    Array<{ memid: string; member: { authorized?: boolean; name?: string } }>
  >([]);

  const { apiGet, apiPost } = useApiClient();
  const { loadMembers } = useMembers({ apiGet, apiPost });

  const refresh = useCallback(async () => {
    const rows = await loadMembers(selectedNwid);
    setMembers(rows as Array<{ memid: string; member: { authorized?: boolean; name?: string } }>);
  }, [loadMembers, selectedNwid]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return (
    <section className="panel" id="panel-members">
      <div className="page-hdr">
        <div>
          <div className="page-title">Members</div>
          <div className="page-sub">{selectedNwid || 'Pick a network first'}</div>
        </div>
        <div className="page-actions">
          <NetworkPicker
            networks={networks.map((nw) => ({ id: nw.id, name: String(nw.name || '') }))}
            onPick={(id) => {
              setSelectedNwid(id);
              toast(`Selected ${id}`, 'ok');
            }}
          />
          <button className="btn btn-ghost btn-sm" type="button" onClick={() => void refresh()}>
            ↻ Refresh
          </button>
        </div>
      </div>
      <div className="card">
        {members.map((row) => (
          <button
            type="button"
            className="route-row"
            key={row.memid}
            onClick={() => navigate(`/members/${selectedNwid}/${row.memid}`)}
          >
            <span>{row.memid}</span>
            <span>{row.member.name || (row.member.authorized ? 'authorized' : 'pending')}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
