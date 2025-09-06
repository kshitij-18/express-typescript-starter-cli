import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    coverage: {
      provider: 'istanbul',
      reporter: ['text', 'json', 'html'],
    },
  },
  server: {
    watch: {
      ignored: [
        '**/Test/**', // Ignore test-generated project directory
        '**/dist/**',
        '**/node_modules/**'
      ]
    }
  },
});