import type { ApiErrorBody } from '../types/zt';

export class ZtApiError extends Error {
  readonly status: number;
  readonly payload?: ApiErrorBody;

  constructor(message: string, status: number, payload?: ApiErrorBody) {
    super(message);
    this.name = 'ZtApiError';
    this.status = status;
    this.payload = payload;
  }
}

export interface ZtApiConfig {
  host: string;
  token: string;
}

interface RequestOptions<TBody> {
  path: string;
  config: ZtApiConfig;
  body?: TBody;
}

async function parseErrorPayload(response: Response): Promise<ApiErrorBody | undefined> {
  try {
    const data = (await response.json()) as ApiErrorBody;
    return data;
  } catch {
    return undefined;
  }
}

async function ztRequest<TResponse, TBody = undefined>(
  method: 'GET' | 'POST' | 'DELETE',
  options: RequestOptions<TBody>,
): Promise<TResponse> {
  const { path, config, body } = options;
  const base = config.host.replace(/\/$/, '');
  const url = `${base}${path.startsWith('/') ? path : `/${path}`}`;

  const response = await fetch(url, {
    method,
    headers: {
      Authorization: `bearer ${config.token}`,
      'Content-Type': 'application/json',
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  if (!response.ok) {
    const errorPayload = await parseErrorPayload(response);
    const message = errorPayload?.message ?? errorPayload?.error ?? response.statusText;
    throw new ZtApiError(message || 'Unknown API error', response.status, errorPayload);
  }

  if (response.status === 204) {
    return undefined as TResponse;
  }

  return (await response.json()) as TResponse;
}

export function ztGet<TResponse>(options: RequestOptions<undefined>): Promise<TResponse> {
  return ztRequest<TResponse, undefined>('GET', options);
}

export function ztPost<TResponse, TBody>(options: RequestOptions<TBody>): Promise<TResponse> {
  return ztRequest<TResponse, TBody>('POST', options);
}

export function ztDelete<TResponse>(options: RequestOptions<undefined>): Promise<TResponse> {
  return ztRequest<TResponse, undefined>('DELETE', options);
}
