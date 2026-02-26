import type { ApiErrorBody } from '../types/zt';

export const ZT_AUTH_HEADER = 'X-ZT1-AUTH' as const;
export const LEGACY_AUTH_HEADER = 'Authorization' as const;
export const DEFAULT_API_BASE_URL = '/api' as const;

export type ZtAuthHeaders = {
  [ZT_AUTH_HEADER]: string;
  [LEGACY_AUTH_HEADER]: string;
};

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
  token: string;
  baseUrl?: string;
}

export function buildZtAuthHeaders(token: string): ZtAuthHeaders {
  return {
    [ZT_AUTH_HEADER]: token,
    [LEGACY_AUTH_HEADER]: `bearer ${token}`,
  };
}

export function resolveApiBaseUrl(baseUrl?: string): string {
  const explicit = baseUrl?.trim();
  if (explicit) {
    return explicit.replace(/\/$/, '');
  }

  const envBase = import.meta.env.VITE_API_BASE_URL?.trim();
  if (envBase) {
    return envBase.replace(/\/$/, '');
  }

  return DEFAULT_API_BASE_URL;
}

export function resolveApiUrl(path: string, baseUrl?: string): string {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${resolveApiBaseUrl(baseUrl)}${normalizedPath}`;
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
  const url = resolveApiUrl(path, config.baseUrl);

  const response = await fetch(url, {
    method,
    headers: {
      ...buildZtAuthHeaders(config.token),
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
