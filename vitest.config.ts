import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    include: ['**/*.test.ts', '**/*.test.tsx'],
    setupFiles: ['src/__tests__/setupTests.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'src/**/*.test.{ts,tsx}',
        'src/**/__tests__/**',
        'src/main.tsx',
        'src/App.tsx',
        'src/router.tsx',
        'src/types/**',
      ],
      thresholds: {
        global: {
          statements: 65,
          branches: 75,
          functions: 50,
          lines: 65,
        },
      },
    },
  },
});
