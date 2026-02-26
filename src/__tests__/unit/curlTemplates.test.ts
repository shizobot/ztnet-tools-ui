import { describe, expect, it } from 'vitest';

import { curlTpls } from '../../constants/curlTemplates';

describe('curlTpls', () => {
  it('contains all 8 template keys', () => {
    expect(Object.keys(curlTpls).sort()).toEqual([
      'curl-auth-mem',
      'curl-config-net',
      'curl-create-net',
      'curl-del-mem',
      'curl-get-net',
      'curl-list-mem',
      'curl-list-nets',
      'curl-status',
    ]);
  });

  it('renders template with resolver values', () => {
    const resolve = (key: 'host' | 'token' | 'nwid' | 'nodeId' | 'memId') =>
      ({
        host: 'http://localhost:9993',
        token: 'TOKEN',
        nwid: 'NETWORK',
        nodeId: 'NODE',
        memId: 'MEMBER',
      })[key];

    const output = curlTpls['curl-get-net'](resolve);
    expect(output).toContain('http://localhost:9993/controller/network/NETWORK');
    expect(output).toContain('X-ZT1-AUTH: TOKEN');
  });
});
