export const DEFAULT_BACKEND_URL = 'http://localhost:3001';

export function resolveBackendProxyTarget(env: Record<string, string | undefined>): string {
  return env.VITE_BACKEND_URL || DEFAULT_BACKEND_URL;
}
