import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig(({ mode }) => {
  const isSSR = mode === 'ssr';

  return {
    plugins: [react()],
    root: 'ui',
    publicDir: false,
    build: {
      outDir: '../public/build',
      emptyOutDir: !isSSR,
      lib: isSSR
        ? {
            entry: resolve(__dirname, 'ui/src/page/index/server/index.js'),
            name: 'ssr',
            fileName: () => 'index_ssr.bundle.js',
            formats: ['iife'],
          }
        : undefined,
      rollupOptions: isSSR
        ? {
            external: [],
            output: {
              inlineDynamicImports: true,
            },
          }
        : {
            input: {
              index: resolve(__dirname, 'ui/src/page/index/client/index.jsx'),
            },
            output: {
              entryFileNames: '[name].bundle.js',
              chunkFileNames: '[name]-[hash].js',
              assetFileNames: '[name]-[hash][extname]',
            },
          },
    },
    resolve: {
      alias: {
        src: resolve(__dirname, 'ui/src'),
      },
    },
    server: {
      proxy: {
        '/api': 'http://localhost:8080',
      },
    },
  };
});
