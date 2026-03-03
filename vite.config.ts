import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      buffer: 'buffer',
    },
  },
  define: {
    global: 'globalThis',
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
          if (!id.includes('node_modules')) {
            return undefined;
          }

          if (/node_modules[\\/](react|react-dom|scheduler)[\\/]/.test(id)) {
            return 'react';
          }

          if (id.includes('react-router') || id.includes('@remix-run/router')) {
            return 'router';
          }

          if (id.includes('react-helmet-async')) {
            return 'helmet';
          }

          if (
            id.includes('react-syntax-highlighter') ||
            id.includes('refractor') ||
            id.includes('prismjs') ||
            id.includes('highlight.js') ||
            id.includes('lowlight')
          ) {
            return 'syntax';
          }

          return 'vendor';
        },
      },
    },
  },
});
