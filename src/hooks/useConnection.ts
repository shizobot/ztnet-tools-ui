import { useCallback } from 'react';

import { ztGet, ZtApiError } from '../api/ztApi';
import { useAppStore } from '../store/appStore';

const PREFS_KEY = 'ztnet-tools-prefs';

interface ControllerStatusResponse {
  online: boolean;
}

export function useConnection() {
  const host = useAppStore((s) => s.host);
  const token = useAppStore((s) => s.token);
  const nodeId = useAppStore((s) => s.nodeId);
  const setConnectionPrefs = useAppStore((s) => s.setConnectionPrefs);
  const setConnected = useAppStore((s) => s.setConnected);

  const savePrefs = useCallback(() => {
    localStorage.setItem(PREFS_KEY, JSON.stringify({ host, token, nodeId }));
  }, [host, token, nodeId]);

  const loadPrefs = useCallback(() => {
    const raw = localStorage.getItem(PREFS_KEY);
    if (!raw) {
      return;
    }
    const parsed = JSON.parse(raw) as { host: string; token: string; nodeId: string };
    setConnectionPrefs(parsed);
  }, [setConnectionPrefs]);

  const testConnection = useCallback(async () => {
    try {
      const result = await ztGet<ControllerStatusResponse>({
        path: '/controller/status',
        config: { host, token },
      });
      setConnected(Boolean(result.online));
      return result.online;
    } catch (error) {
      if (error instanceof ZtApiError) {
        setConnected(false);
        return false;
      }
      throw error;
    }
  }, [host, token, setConnected]);

  return { savePrefs, loadPrefs, testConnection };
}
