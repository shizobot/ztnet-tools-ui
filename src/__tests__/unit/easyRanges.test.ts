import { describe, expect, it } from 'vitest';

import { EASY_RANGES } from '../../constants/easyRanges';

describe('EASY_RANGES', () => {
  it('contains 20 predefined IPv4 ranges', () => {
    expect(EASY_RANGES).toHaveLength(20);
  });

  it('uses expected structure for every entry', () => {
    for (const range of EASY_RANGES) {
      expect(range).toMatchObject({
        label: expect.any(String),
        start: expect.any(String),
        end: expect.any(String),
        cidr: expect.any(String),
      });
    }
  });
});
