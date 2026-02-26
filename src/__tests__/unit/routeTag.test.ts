import { describe, expect, it } from 'vitest';

import { routeTag } from '../../lib/routeTag';

describe('routeTag', () => {
  it.each([
    { target: '0.0.0.0/0', want: 'default' },
    { target: '::/0', want: 'default' },
    { target: '10.0.0.0/24', want: 'lan' },
    { target: '192.168.100.0/24', want: 'lan' },
    { target: '8.8.8.0/24', want: 'public' },
    { target: '172.15.0.0/16', want: 'public' },
    { target: '172.16.0.0/16', want: 'lan' },
    { target: '172.31.0.0/16', want: 'lan' },
    { target: '172.32.0.0/16', want: 'public' },
    { target: '172.200.0.0/16', want: 'public' },
  ])('returns $want for $target', ({ target, want }) => {
    expect(routeTag(target)).toBe(want);
  });
});
