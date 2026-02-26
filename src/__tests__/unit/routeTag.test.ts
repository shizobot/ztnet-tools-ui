import { describe, expect, it } from 'vitest';

import { routeTag } from '../../lib/routeTag';

describe('routeTag', () => {
  it.each([
    { target: '0.0.0.0/0', want: 'default' },
    { target: '::/0', want: 'default' },
    { target: '10.0.0.0/24', want: 'lan' },
    { target: '192.168.100.0/24', want: 'lan' },
    { target: '8.8.8.0/24', want: 'public' },
  ])('returns $want for $target', ({ target, want }) => {
    expect(routeTag(target)).toBe(want);
  });
});
