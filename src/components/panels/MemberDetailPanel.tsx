import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { formatApiError } from '../../api/toApiResult';
import { useApiClient } from '../../hooks/useApiClient';
import { parseTags, useMembers } from '../../hooks/useMembers';
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
  const [tagsValidation, setTagsValidation] = useState('');

  const { apiGet, apiPost } = useApiClient();
  const { loadMemberDetail, saveMember } = useMembers({ apiGet, apiPost });

  const load = useCallback(async () => {
    const detail = await loadMemberDetail(nwid, id);
    if (!detail) return;
    setName(detail.name ?? '');
    setAuthorized(!!detail.authorized);
    setActiveBridge(!!detail.activeBridge);
    setIpAssignments(detail.ipAssignments ?? []);
    setCaps((detail.capabilities ?? []).join(' '));
    setTags((detail.tags ?? []).map(([k, v]) => `${k}=${v}`).join(' '));
    setRaw(JSON.stringify(detail.raw, null, 2));
  }, [id, loadMemberDetail, nwid]);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <section className="panel" id="panel-member-detail">
      <div className="page-hdr">
        <div>
          <div className="page-title">Member Detail</div>
          <div className="page-sub">
            {nwid} / {id}
          </div>
        </div>
      </div>
      <div className="card">
        <label htmlFor="memberName">Name</label>
        <input id="memberName" value={name} onChange={(e) => setName(e.target.value)} />
        <label>
          <input
            type="checkbox"
            checked={authorized}
            onChange={(e) => setAuthorized(e.target.checked)}
          />{' '}
          Authorized
        </label>
        <label>
          <input
            type="checkbox"
            checked={activeBridge}
            onChange={(e) => setActiveBridge(e.target.checked)}
          />{' '}
          Active Bridge
        </label>
        <label htmlFor="memberIpAssignments">IP Assignments</label>
        <input
          id="memberIpAssignments"
          value={ipAssignments.join(',')}
          onChange={(e) =>
            setIpAssignments(
              e.target.value
                .split(',')
                .map((it) => it.trim())
                .filter(Boolean),
            )
          }
        />
        <label htmlFor="memberCapabilities">Capabilities</label>
        <input id="memberCapabilities" value={caps} onChange={(e) => setCaps(e.target.value)} />
        <label htmlFor="memberTags">Tags</label>
        <input
          id="memberTags"
          value={tags}
          onChange={(e) => {
            setTags(e.target.value);
            if (tagsValidation) {
              setTagsValidation('');
            }
          }}
        />
        {tagsValidation ? <div className="notice notice-warn">{tagsValidation}</div> : null}
        <button
          className="btn btn-primary"
          type="button"
          onClick={async () => {
            const parsedTags = parseTags(tags);
            if (parsedTags.hasInvalid) {
              const msg = 'Invalid tags format. Use numeric id=value pairs separated by spaces.';
              setTagsValidation(msg);
              toast(msg, 'err');
              return;
            }

            setTagsValidation('');
            const res = await saveMember({
              nwid,
              memid: id,
              name,
              authorized,
              activeBridge,
              ipAssignments,
              capabilitiesText: caps,
              tagsText: tags,
            });
            toast(
              res.ok ? 'Member saved' : formatApiError(res, 'Failed to save member'),
              res.ok ? 'ok' : 'err',
            );
            await load();
          }}
        >
          Save
        </button>
      </div>
      <pre className="terminal">{raw}</pre>
    </section>
  );
}
