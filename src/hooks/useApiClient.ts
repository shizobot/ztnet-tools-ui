import { useCallback } from 'react';
import { toApiResult, type ApiResult } from '../api/toApiResult';
import { ztDelete, ztGet, ztPost } from '../api/ztApi';
import { useAppStore } from '../store/appStore';

export type ApiMode = 'proxy' | 'direct';

export function resolveApiClientBaseUrl(apiMode: ApiMode, host: string): string | undefined {
  if (apiMode !== 'direct') {
    return undefined;
  }

  const explicitHost = host.trim();
  return explicitHost ? explicitHost : undefined;
}

export function useApiClient() {
  const apiMode = useAppStore((state) => state.apiMode);
  const host = useAppStore((state) => state.host);
  const token = useAppStore((state) => state.token);
  const baseUrl = resolveApiClientBaseUrl(apiMode, host);

  const apiGet = useCallback(
    async <T>(path: string): Promise<ApiResult<T>> =>
      toApiResult(() => ztGet<T>({ path, config: { token, baseUrl } })),
    [baseUrl, token],
  );

  const apiPost = useCallback(
    async <TBody, TData>(path: string, body: TBody): Promise<ApiResult<TData>> =>
      toApiResult(() => ztPost<TData, TBody>({ path, body, config: { token, baseUrl } })),
    [baseUrl, token],
  );

  const apiDelete = useCallback(
    async <T>(path: string): Promise<ApiResult<T>> =>
      toApiResult(() => ztDelete<T>({ path, config: { token, baseUrl } })),
    [baseUrl, token],
  );

  return { apiGet, apiPost, apiDelete };
}
