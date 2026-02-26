import { defineConfig, loadEnv, type UserConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolveBackendProxyTarget } from './src/config/proxy';

export function createViteConfig(mode: string): UserConfig {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react()],
    server: {
      proxy: {
        '/api': {
          target: resolveBackendProxyTarget(env),
          changeOrigin: true,
        },
      },
    },
  };
}

export default defineConfig(({ mode }) => createViteConfig(mode));
