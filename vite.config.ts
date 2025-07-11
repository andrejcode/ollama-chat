/// <reference types="vitest" />

import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import { defineConfig } from 'vite';
import electronRender from 'vite-plugin-electron-renderer';
import electron from 'vite-plugin-electron/simple';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    electron({
      main: {
        // Shortcut of `build.lib.entry`.
        entry: 'electron/main/index.ts',
        vite: {
          build: {
            rollupOptions: {
              external: ['better-sqlite3'],
              output: {
                entryFileNames: 'main.js',
              },
            },
          },
          resolve: {
            alias: {
              '@electron': path.resolve(__dirname, 'electron'),
              '@shared': path.resolve(__dirname, 'shared'),
            },
          },
        },
      },
      preload: {
        // Shortcut of `build.rollupOptions.input`.
        // Preload scripts may contain Web assets, so use the `build.rollupOptions.input` instead `build.lib.entry`.
        input: path.join(__dirname, 'electron/preload/index.ts'),
        vite: {
          build: {
            rollupOptions: {
              output: {
                entryFileNames: 'preload.mjs',
              },
            },
          },
          resolve: {
            alias: {
              '@electron': path.resolve(__dirname, 'electron'),
              '@shared': path.resolve(__dirname, 'shared'),
            },
          },
        },
      },
      // Polyfill the Electron and Node.js API for the Renderer process.
      // If you want to use Node.js in a Renderer process, the `nodeIntegration` needs to be enabled in the Main process.
      // See 👉 https://github.com/electron-vite/vite-plugin-electron-renderer
      renderer:
        process.env.NODE_ENV === 'test'
          ? // https://github.com/electron-vite/vite-plugin-electron-renderer/issues/78#issuecomment-2053600808
            undefined
          : {},
    }),
    electronRender(),
  ],
  resolve: {
    alias: {
      '@shared': path.resolve(__dirname, 'shared'),
      '@': path.resolve(__dirname, 'src'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['src/setupTests.ts'],
    coverage: {
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'dist/',
        'dist-electron/',
        'electron/',
        'shared/',
        '**/*.d.ts',
        '**/*.test.{ts,tsx}',
        '**/*.spec.{ts,tsx}',
        '**/*.config.{js,ts,cjs,mjs}',
        '**/eslintrc.*',
        '**/.eslintrc.*',
        '**/vite.config.*',
        '**/tailwind.config.*',
        '**/postcss.config.*',
        '**/jest.config.*',
        '**/vitest.config.*',
        '**/tsconfig.*',
        '**/package.json',
        '**/package-lock.json',
        '**/yarn.lock',
        '**/pnpm-lock.yaml',
      ],
    },
  },
});
