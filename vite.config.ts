import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    css: true,
    exclude: ['e2e/**', 'node_modules/**', 'dist/**'],
  },
  build: {
    chunkSizeWarningLimit: 750,
    rollupOptions: {
      output: {
        manualChunks(id) {
          const normalizedId = id.replace(/\\/g, '/');

          if (!normalizedId.includes('node_modules')) {
            return undefined;
          }

          if (
            /node_modules\/(react|react-dom|scheduler)\//.test(normalizedId)
          ) {
            return 'react';
          }

          if (
            normalizedId.includes('react-router') ||
            normalizedId.includes('@remix-run/router')
          ) {
            return 'router';
          }

          if (normalizedId.includes('react-helmet-async')) {
            return 'helmet';
          }

          if (
            normalizedId.includes(
              'react-syntax-highlighter/dist/esm/prism-light'
            )
          ) {
            return 'syntax-core';
          }

          if (
            normalizedId.includes(
              'react-syntax-highlighter/dist/esm/styles/prism'
            )
          ) {
            return 'syntax-theme';
          }

          if (
            normalizedId.includes(
              'react-syntax-highlighter/dist/esm/languages/prism/'
            )
          ) {
            const match = normalizedId.match(/languages\/prism\/(\w+)/);
            return `syntax-lang-${match?.[1] ?? 'misc'}`;
          }

          if (
            normalizedId.includes('refractor') ||
            normalizedId.includes('prismjs') ||
            normalizedId.includes('highlight.js') ||
            normalizedId.includes('lowlight')
          ) {
            return 'syntax-vendor';
          }

          return 'vendor';
        },
      },
    },
  },
});
