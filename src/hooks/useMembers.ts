import { useCallback } from 'react';
import type { ApiResult } from '../api/toApiResult';

export type Member = {
  id?: string;
  name?: string;
  authorized?: boolean;
  activeBridge?: boolean;
  ipAssignments?: string[];
  capabilities?: number[];
  tags?: [number, number][];
};

export type MemberDetail = Member & {
  memberId: string;
  raw: Member;
};

export type SaveMemberInput = {
  nwid: string;
  memid: string;
  name: string;
  authorized: boolean;
  activeBridge: boolean;
  ipAssignments: string[];
  capabilitiesText: string;
  tagsText: string;
};

export type UseMembersDeps = {
  apiGet: <T>(path: string) => Promise<ApiResult<T>>;
  apiPost: <TBody, TData>(path: string, body: TBody) => Promise<ApiResult<TData>>;
};

export type LoadMembersResult = {
  rows: Array<{ memid: string; member: Member }>;
  error: ApiResult<unknown> | null;
};

export async function loadMembers(nwid: string, deps: UseMembersDeps): Promise<LoadMembersResult> {
  const res = await deps.apiGet<Record<string, Member>>(`/controller/network/${nwid}/member`);
  if (!res?.ok) {
    return { rows: [], error: res };
  }

  return {
    rows: Object.entries(res.data ?? {}).map(([memid, member]) => ({ memid, member })),
    error: null,
  };
}

export async function loadMemberDetail(
  nwid: string,
  memid: string,
  deps: UseMembersDeps,
): Promise<MemberDetail | null> {
  if (!nwid.trim() || !memid.trim()) {
    return null;
  }

  const res = await deps.apiGet<Member>(`/controller/network/${nwid}/member/${memid}`);
  if (!res?.ok || !res.data) {
    return null;
  }

  return {
    memberId: res.data.id ?? memid,
    name: res.data.name ?? '',
    authorized: !!res.data.authorized,
    activeBridge: !!res.data.activeBridge,
    ipAssignments: res.data.ipAssignments ?? [],
    capabilities: res.data.capabilities ?? [],
    tags: res.data.tags ?? [],
    raw: res.data,
  };
}

export type ParseTagsResult = {
  tags: [number, number][];
  hasInvalid: boolean;
};

export const parseTags = (value: string): ParseTagsResult => {
  const entries = value
    .trim()
    .split(/\s+/)
    .map((entry) => entry.trim())
    .filter(Boolean);

  return entries.reduce<ParseTagsResult>(
    (acc, entry) => {
      const [idText = '', rawValue = ''] = entry.split('=', 2).map((part) => part.trim());

      if (!idText || !rawValue) {
        return { ...acc, hasInvalid: true };
      }

      if (!/^-?\d+$/.test(idText) || !/^-?\d+$/.test(rawValue)) {
        return { ...acc, hasInvalid: true };
      }

      const id = Number.parseInt(idText, 10);
      const valueNum = Number.parseInt(rawValue, 10);

      return {
        tags: [...acc.tags, [id, valueNum]],
        hasInvalid: acc.hasInvalid,
      };
    },
    { tags: [], hasInvalid: false },
  );
};

const parseCapabilities = (value: string): number[] =>
  value
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map(Number)
    .filter((n) => !Number.isNaN(n));

export async function saveMember(
  input: SaveMemberInput,
  deps: UseMembersDeps,
): Promise<ApiResult<Member>> {
  const body = {
    name: input.name,
    authorized: input.authorized,
    activeBridge: input.activeBridge,
    ipAssignments: input.ipAssignments,
    capabilities: parseCapabilities(input.capabilitiesText),
    tags: parseTags(input.tagsText).tags,
  };

  return deps.apiPost<typeof body, Member>(
    `/controller/network/${input.nwid}/member/${input.memid}`,
    body,
  );
}

export function useMembers(deps: UseMembersDeps) {
  const { apiGet, apiPost } = deps;
  const runLoadMembers = useCallback(
    (nwid: string) => loadMembers(nwid, { apiGet, apiPost }),
    [apiGet, apiPost],
  );
  const runLoadMemberDetail = useCallback(
    (nwid: string, memid: string) => loadMemberDetail(nwid, memid, { apiGet, apiPost }),
    [apiGet, apiPost],
  );
  const runSaveMember = useCallback(
    (input: SaveMemberInput) => saveMember(input, { apiGet, apiPost }),
    [apiGet, apiPost],
  );

  return {
    loadMembers: runLoadMembers,
    loadMemberDetail: runLoadMemberDetail,
    saveMember: runSaveMember,
  };
}
