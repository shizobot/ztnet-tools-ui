import { useCallback } from 'react';
import { toApiResult, type ApiResult } from '../api/toApiResult';
import { ztDelete, ztGet, ztPost } from '../api/ztApi';
import { useAppStore } from '../store/appStore';

export function useApiClient() {
  const token = useAppStore((state) => state.token);

  const apiGet = useCallback(
    async <T>(path: string): Promise<ApiResult<T>> =>
      toApiResult(() => ztGet<T>({ path, config: { token } })),
    [token],
  );

  const apiPost = useCallback(
    async <TBody, TData>(path: string, body: TBody): Promise<ApiResult<TData>> =>
      toApiResult(() => ztPost<TData, TBody>({ path, body, config: { token } })),
    [token],
  );

  const apiDelete = useCallback(
    async <T>(path: string): Promise<ApiResult<T>> =>
      toApiResult(() => ztDelete<T>({ path, config: { token } })),
    [token],
  );

  return { apiGet, apiPost, apiDelete };
}
