import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
import tsconfigPaths from 'vite-tsconfig-paths';

import { version } from './package.json';

export default defineConfig({
  root: 'src',
  build: {
    outDir: '../build',
    sourcemap: 'inline',
    chunkSizeWarningLimit: '20000',
  },
  publicDir: '../public',
  base: '',
  outDir: './',
  appType: 'spa',
  plugins: [
    react({
      include: '**/*.{jsx,tsx}',
    }),
    tsconfigPaths(),
    VitePWA({
      strategies: 'generateSW',
      injectRegister: 'auto',
      registerType: 'prompt',
      filename: 'service-worker.js',
      manifestFilename: 'cleanstart.webmanifest',
      workbox: {
        navigateFallbackDenylist: [/^\/api/, /^chrome-extension:\/\/.*/],
        clientsClaim: true,
        skipWaiting: true,
        cleanupOutdatedCaches: true,
        maximumFileSizeToCacheInBytes: 50000000,
      },
      devOptions: {
        enabled: true,
      },
      includeAssets: [
        './images/new-tab-icon-32.png',
        './images/new-tab-icon-64.png',
        './images/new-tab-icon-128.png',
      ],
      manifest: {
        version,
        name: 'Clean Start',
        short_name: 'Clean Start',
        description: 'Open source new tab extension',
        author: 'Michael Sprague',
        icons: [
          {
            src: '/images/new-tab-icon-16.png',
            type: 'image/png',
            sizes: '16x16',
          },
          {
            src: '/images/new-tab-icon-24.png',
            type: 'image/png',
            sizes: '24x24',
          },
          {
            src: '/images/new-tab-icon-32.png',
            type: 'image/png',
            sizes: '32x32',
          },
          {
            src: '/images/new-tab-icon-48.png',
            type: 'image/png',
            sizes: '48x48',
          },
          {
            src: '/images/new-tab-icon-64.png',
            type: 'image/png',
            sizes: '64x64',
          },
          {
            src: '/images/new-tab-icon-128.png',
            type: 'image/png',
            sizes: '128x128',
          },
          {
            src: '/images/new-tab-icon-192.png',
            type: 'image/png',
            sizes: '192x192',
            purpose: 'any',
          },
          {
            src: '/images/new-tab-icon-192.png',
            type: 'image/png',
            sizes: '192x192',
            purpose: 'maskable',
          },
          {
            src: '/images/new-tab-icon-256.png',
            type: 'image/png',
            sizes: '256x256',
          },
          {
            src: '/images/new-tab-icon-512.png',
            type: 'image/png',
            sizes: '512x512',
          },
        ],
        homepage_url: 'https://cleanstart.page/',
        scope: '/',
        id: '/',
        start_url: '/',
        display: 'standalone',
        background_color: '#121212',
        theme_color: '#121212',
      },
    }),
  ],
});
