import { describe, expect, it } from 'vitest';

import { filterNetworks } from '../../hooks/useNetworks';

describe('filterNetworks', () => {
  const networks = [
    { id: 'AbC123', name: 'Office' },
    { id: 'def456', name: 'HoMeLab' },
  ];

  it('matches mixed-case network id queries', () => {
    expect(filterNetworks(networks, 'abc')).toEqual([{ id: 'AbC123', name: 'Office' }]);
  });

  it('matches mixed-case network name queries', () => {
    expect(filterNetworks(networks, 'home')).toEqual([{ id: 'def456', name: 'HoMeLab' }]);
  });
});
