import { describe, expect, it, vi } from 'vitest';

import { parseTags, saveMember, type UseMembersDeps } from '../../hooks/useMembers';

describe('useMembers tag parsing', () => {
  it('parses valid numeric id=value pairs', () => {
    const parsed = parseTags('1=10 2=20');

    expect(parsed.tags).toEqual([
      [1, 10],
      [2, 20],
    ]);
    expect(parsed.hasInvalid).toBe(false);
  });

  it('supports safe empty and whitespace-only input', () => {
    expect(parseTags('')).toEqual({ tags: [], hasInvalid: false });
    expect(parseTags('   ')).toEqual({ tags: [], hasInvalid: false });
  });

  it('marks malformed entries invalid and keeps only valid numeric pairs', () => {
    const parsed = parseTags(' 3=4 5= 7=abc x=8 9=10 ');

    expect(parsed.tags).toEqual([
      [3, 4],
      [9, 10],
    ]);
    expect(parsed.hasInvalid).toBe(true);
  });

  it('saveMember sends filtered tags payload', async () => {
    const apiPost = vi.fn().mockResolvedValue({ ok: true, data: {} });
    const deps: UseMembersDeps = {
      apiGet: vi.fn(),
      apiPost,
    };

    await saveMember(
      {
        nwid: 'nwid',
        memid: 'memid',
        name: 'name',
        authorized: true,
        activeBridge: false,
        ipAssignments: ['10.0.0.2'],
        capabilitiesText: '1 2',
        tagsText: '1=2 7=abc 9=',
      },
      deps,
    );

    expect(apiPost).toHaveBeenCalledWith('/controller/network/nwid/member/memid', {
      name: 'name',
      authorized: true,
      activeBridge: false,
      ipAssignments: ['10.0.0.2'],
      capabilities: [1, 2],
      tags: [[1, 2]],
    });
  });
});
