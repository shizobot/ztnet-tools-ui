import { describe, expect, it } from 'vitest';

import { resolveBackendProxyTarget } from '../../config/proxy';

describe('proxy target resolution', () => {
  it('uses default backend target when env is missing', () => {
    expect(resolveBackendProxyTarget({})).toBe('http://localhost:3001');
  });

  it('uses VITE_BACKEND_URL when provided', () => {
    expect(resolveBackendProxyTarget({ VITE_BACKEND_URL: 'http://127.0.0.1:4010' })).toBe(
      'http://127.0.0.1:4010',
    );
  });

  it('falls back to default when VITE_BACKEND_URL is blank', () => {
    expect(resolveBackendProxyTarget({ VITE_BACKEND_URL: '   ' })).toBe('http://localhost:3001');
  });
});
