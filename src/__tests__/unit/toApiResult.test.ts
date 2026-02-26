import { describe, expect, it } from 'vitest';

import { toApiErrorResult, toApiResult } from '../../api/toApiResult';
import { ZtApiError } from '../../api/ztApi';

describe('toApiResult', () => {
  it('maps ZtApiError to ApiResult failure with status and payload', async () => {
    const error = new ZtApiError('Forbidden', 403, { error: 'forbidden', message: 'Denied' });

    const result = await toApiResult(async () => {
      throw error;
    });

    expect(result.ok).toBe(false);
    if (result.ok) {
      throw new Error('expected failed result');
    }

    expect(result.status).toBe(403);
    expect(result.message).toBe('Forbidden');
    expect(result.payload).toEqual({ error: 'forbidden', message: 'Denied' });
    expect(result.errorType).toBe('api');
  });

  it('maps native Error to network failure', () => {
    const result = toApiErrorResult(new Error('Network down'));

    expect(result.ok).toBe(false);
    if (result.ok) {
      throw new Error('expected failed result');
    }

    expect(result.status).toBe(0);
    expect(result.message).toBe('Network down');
    expect(result.errorType).toBe('network');
  });
});
