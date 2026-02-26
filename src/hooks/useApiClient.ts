import { useCallback } from 'react';
import { ztDelete, ztGet, ztPost } from '../api/ztApi';
import { useAppStore } from '../store/appStore';

export type ApiResult<T> = { ok: boolean; status: number; data: T | null } | null;

export function useApiClient() {
  const token = useAppStore((state) => state.token);

  const apiGet = useCallback(async <T,>(path: string): Promise<ApiResult<T>> => {
    try {
      const data = await ztGet<T>({ path, config: { token } });
      return { ok: true, status: 200, data };
    } catch {
      return { ok: false, status: 500, data: null };
    }
  }, [token]);

  const apiPost = useCallback(async <TBody, TData>(path: string, body: TBody): Promise<ApiResult<TData>> => {
    try {
      const data = await ztPost<TData, TBody>({ path, body, config: { token } });
      return { ok: true, status: 200, data };
    } catch {
      return { ok: false, status: 500, data: null };
    }
  }, [token]);

  const apiDelete = useCallback(async <T,>(path: string): Promise<ApiResult<T>> => {
    try {
      const data = await ztDelete<T>({ path, config: { token } });
      return { ok: true, status: 200, data };
    } catch {
      return { ok: false, status: 500, data: null };
    }
  }, [token]);

  return { apiGet, apiPost, apiDelete };
}
