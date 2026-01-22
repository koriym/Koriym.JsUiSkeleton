import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['ui/test/**/*.{test,spec}.{js,jsx}'],
  },
  resolve: {
    alias: {
      src: resolve(__dirname, 'ui/src'),
    },
  },
});
