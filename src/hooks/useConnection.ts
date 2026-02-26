export type ConnectionPrefs = {
  host: string;
  token: string;
};

export type ConnectionState = ConnectionPrefs & {
  nodeId: string;
  connected: boolean;
};

export type ApiResult<T> = { ok: boolean; status: number; data: T | null } | null;

export type StatusPayload = { address?: string };

export type UseConnectionDeps = {
  apiGet: (path: string) => Promise<ApiResult<StatusPayload>>;
  refreshDashboard: () => Promise<void> | void;
};

const HOST_KEY = 'ztnet_host';
const TOKEN_KEY = 'ztnet_token';

export function savePrefs(state: ConnectionPrefs): void {
  try {
    localStorage.setItem(HOST_KEY, state.host);
    localStorage.setItem(TOKEN_KEY, state.token);
  } catch {
    // no-op: mirror original behavior
  }
}

export function loadPrefs(): Partial<ConnectionPrefs> {
  try {
    const host = localStorage.getItem(HOST_KEY) ?? '';
    const token = localStorage.getItem(TOKEN_KEY) ?? '';
    return {
      ...(host ? { host } : {}),
      ...(token ? { token } : {}),
    };
  } catch {
    return {};
  }
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
  };

  if (!input.token.trim()) {
    return nextState;
  }

  const res = await deps.apiGet('/status');
  if (res?.ok) {
    nextState.nodeId = res.data?.address ?? '';
    nextState.connected = true;
    savePrefs({ host: input.host, token: input.token });
    await deps.refreshDashboard();
    return nextState;
  }

  return nextState;
}

export function useConnection(deps: UseConnectionDeps) {
  return {
    testConnection: (input: ConnectionPrefs) => testConnection(input, deps),
    savePrefs,
    loadPrefs,
  };
}
