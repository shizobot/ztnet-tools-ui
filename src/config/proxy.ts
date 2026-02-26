export const DEFAULT_BACKEND_URL = 'http://localhost:3001';

export function resolveBackendProxyTarget(env: Record<string, string | undefined>): string {
  const target = env.VITE_BACKEND_URL?.trim();
  return target || DEFAULT_BACKEND_URL;
}
