import { ZtApiError } from './ztApi';

export type ApiResult<T> =
  | { ok: true; status: number; data: T }
  | {
      ok: false;
      status: number;
      data: null;
      message: string;
      payload?: unknown;
      errorType: 'api' | 'network' | 'unknown';
    };

export function toApiErrorResult<T>(error: unknown): ApiResult<T> {
  if (error instanceof ZtApiError) {
    return {
      ok: false,
      status: error.status,
      data: null,
      message: error.message,
      payload: error.payload,
      errorType: 'api',
    };
  }

  if (error instanceof Error) {
    return {
      ok: false,
      status: 0,
      data: null,
      message: error.message || 'Network error',
      errorType: 'network',
    };
  }

  return {
    ok: false,
    status: 0,
    data: null,
    message: 'Unknown error',
    payload: error,
    errorType: 'unknown',
  };
}

export async function toApiResult<T>(
  request: () => Promise<T>,
  successStatus = 200,
): Promise<ApiResult<T>> {
  try {
    const data = await request();
    return { ok: true, status: successStatus, data };
  } catch (error) {
    return toApiErrorResult<T>(error);
  }
}

export function formatApiError(
  result: ApiResult<unknown> | null | undefined,
  fallback = 'Request failed',
): string {
  if (!result || result.ok) {
    return fallback;
  }

  const payloadPart = result.payload ? ` | payload: ${JSON.stringify(result.payload)}` : '';

  return `status ${result.status}: ${result.message}${payloadPart}`;
}
