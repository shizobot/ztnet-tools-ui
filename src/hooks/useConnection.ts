import type { ApiResult } from '../api/toApiResult';

export type ConnectionPrefs = {
  host: string;
  token: string;
  persistToken?: boolean;
};

export type ConnectionState = ConnectionPrefs & {
  nodeId: string;
  connected: boolean;
  errorMessage?: string;
};

export type StatusPayload = { address?: string };

export type UseConnectionDeps = {
  apiGet: (path: string) => Promise<ApiResult<StatusPayload>>;
  refreshDashboard: () => Promise<void> | void;
};

const HOST_KEY = 'ztnet_host';
const TOKEN_KEY = 'ztnet_token';
const TOKEN_PERSIST_KEY = 'ztnet_persist_token';

export function savePrefs(state: ConnectionPrefs): void {
  try {
    localStorage.setItem(HOST_KEY, state.host);
    const persistToken = state.persistToken ?? false;
    localStorage.setItem(TOKEN_PERSIST_KEY, persistToken ? '1' : '0');

    if (persistToken) {
      localStorage.setItem(TOKEN_KEY, state.token);
      return;
    }

    localStorage.removeItem(TOKEN_KEY);
  } catch {
    // no-op: mirror original behavior
  }
}

export function clearPrefs(): void {
  try {
    localStorage.removeItem(HOST_KEY);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(TOKEN_PERSIST_KEY);
  } catch {
    // no-op
  }
}

export function loadPrefs(): Partial<ConnectionPrefs> {
  try {
    const host = localStorage.getItem(HOST_KEY) ?? '';
    const persistToken = localStorage.getItem(TOKEN_PERSIST_KEY) === '1';
    const token = localStorage.getItem(TOKEN_KEY) ?? '';

    return {
      ...(host ? { host } : {}),
      persistToken,
      ...(persistToken && token ? { token } : {}),
    };
  } catch {
    return {};
  }
}

export function restoreConnectionStateFromPrefs(): Pick<
  ConnectionState,
  'host' | 'token' | 'connected' | 'nodeId'
> {
  const prefs = loadPrefs();
  return {
    host: prefs.host ?? '',
    token: prefs.token ?? '',
    connected: false,
    nodeId: '',
  };
}

export async function testConnection(
  input: ConnectionPrefs,
  deps: UseConnectionDeps,
): Promise<ConnectionState> {
  const nextState: ConnectionState = {
    host: input.host,
    token: input.token,
    nodeId: '',
    connected: false,
    persistToken: input.persistToken ?? false,
  };

  if (!input.token.trim()) {
    return nextState;
  }

  const res = await deps.apiGet('/status');
  if (res.ok) {
    nextState.nodeId = res.data?.address ?? '';
    nextState.connected = true;
    savePrefs(input);
    await deps.refreshDashboard();
    return nextState;
  }

  nextState.errorMessage = `status ${res.status}: ${res.message}`;
  return nextState;
}

export function useConnection(deps: UseConnectionDeps) {
  return {
    testConnection: (input: ConnectionPrefs) => testConnection(input, deps),
    savePrefs,
    loadPrefs,
    clearPrefs,
    restoreConnectionStateFromPrefs,
  };
}
