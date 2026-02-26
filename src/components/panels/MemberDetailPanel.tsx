import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useApiClient } from '../../hooks/useApiClient';
import { useMembers } from '../../hooks/useMembers';
import { useAppStore } from '../../store/appStore';
import { useToast } from '../ui';

export function MemberDetailPanel() {
  const { nwid = '', id = '' } = useParams();
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [authorized, setAuthorized] = useState(false);
  const [activeBridge, setActiveBridge] = useState(false);
  const [ipAssignments, setIpAssignments] = useState<string[]>([]);
  const [caps, setCaps] = useState('');
  const [tags, setTags] = useState('');
  const [raw, setRaw] = useState('{}');

  const { apiGet, apiPost } = useApiClient();
  const { loadMemberDetail, saveMember } = useMembers({ apiGet, apiPost });

  const load = async () => {
    const detail = await loadMemberDetail(nwid, id);
    if (!detail) return;
    setName(detail.name ?? "");
    setAuthorized(!!detail.authorized);
    setActiveBridge(!!detail.activeBridge);
    setIpAssignments(detail.ipAssignments ?? []);
    setCaps((detail.capabilities ?? []).join(' '));
    setTags((detail.tags ?? []).map(([k, v]) => `${k}=${v}`).join(' '));
    setRaw(JSON.stringify(detail.raw, null, 2));
  };

  useEffect(() => { void load(); }, [nwid, id]);

  return (
    <section className="panel" id="panel-member-detail">
      <div className="page-hdr"><div><div className="page-title">Member Detail</div><div className="page-sub">{nwid} / {id}</div></div></div>
      <div className="card">
        <label>Name</label><input value={name} onChange={(e) => setName(e.target.value)} />
        <label><input type="checkbox" checked={authorized} onChange={(e) => setAuthorized(e.target.checked)} /> Authorized</label>
        <label><input type="checkbox" checked={activeBridge} onChange={(e) => setActiveBridge(e.target.checked)} /> Active Bridge</label>
        <label>IP Assignments</label><input value={ipAssignments.join(',')} onChange={(e) => setIpAssignments(e.target.value.split(',').map((it) => it.trim()).filter(Boolean))} />
        <label>Capabilities</label><input value={caps} onChange={(e) => setCaps(e.target.value)} />
        <label>Tags</label><input value={tags} onChange={(e) => setTags(e.target.value)} />
        <button className="btn btn-primary" type="button" onClick={async () => {
          const res = await saveMember({ nwid, memid: id, name, authorized, activeBridge, ipAssignments, capabilitiesText: caps, tagsText: tags });
          toast(res?.ok ? 'Member saved' : 'Failed to save member', res?.ok ? 'ok' : 'err');
          await load();
        }}>Save</button>
      </div>
      <pre className="terminal">{raw}</pre>
    </section>
  );
}
