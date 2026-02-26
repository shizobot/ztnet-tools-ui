export type ApiResult<T> = { ok: boolean; status: number; data: T | null } | null;

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

export async function loadMembers(
  nwid: string,
  deps: UseMembersDeps,
): Promise<Array<{ memid: string; member: Member }>> {
  const res = await deps.apiGet<Record<string, Member>>(`/controller/network/${nwid}/member`);
  if (!res?.ok) {
    return [];
  }

  return Object.entries(res.data ?? {}).map(([memid, member]) => ({ memid, member }));
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

const parseTags = (value: string): [number, number][] =>
  value
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((entry): [number, number] => {
      const [id, rawVal] = entry.split('=');
      return [Number.parseInt(id, 10), Number.parseInt(rawVal || '0', 10)];
    });

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
    tags: parseTags(input.tagsText),
  };

  return deps.apiPost<typeof body, Member>(
    `/controller/network/${input.nwid}/member/${input.memid}`,
    body,
  );
}

export function useMembers(deps: UseMembersDeps) {
  return {
    loadMembers: (nwid: string) => loadMembers(nwid, deps),
    loadMemberDetail: (nwid: string, memid: string) => loadMemberDetail(nwid, memid, deps),
    saveMember: (input: SaveMemberInput) => saveMember(input, deps),
  };
}
