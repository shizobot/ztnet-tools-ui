import { useCallback } from 'react';

import { ztGet, ztPost } from '../api/ztApi';
import { useAppStore } from '../store/appStore';

export interface MemberRecord {
  id: string;
  name?: string;
  ipAssignments?: string[];
  [key: string]: unknown;
}

export function useMembers() {
  const host = useAppStore((s) => s.host);
  const token = useAppStore((s) => s.token);
  const selectedNwid = useAppStore((s) => s.selectedNwid);

  const loadMembers = useCallback(async (): Promise<MemberRecord[]> => {
    const response = await ztGet<Record<string, MemberRecord>>({
      path: `/controller/network/${selectedNwid}/member`,
      config: { host, token },
    });
    return Object.values(response);
  }, [host, token, selectedNwid]);

  const loadMemberDetail = useCallback(
    async (memberId: string): Promise<MemberRecord> =>
      ztGet<MemberRecord>({
        path: `/controller/network/${selectedNwid}/member/${memberId}`,
        config: { host, token },
      }),
    [host, token, selectedNwid],
  );

  const saveMember = useCallback(
    async (memberId: string, body: MemberRecord): Promise<MemberRecord> =>
      ztPost<MemberRecord, MemberRecord>({
        path: `/controller/network/${selectedNwid}/member/${memberId}`,
        config: { host, token },
        body,
      }),
    [host, token, selectedNwid],
  );

  return { loadMembers, loadMemberDetail, saveMember };
}
