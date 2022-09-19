/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable node/no-unpublished-import */
import { VitePWA } from 'vite-plugin-pwa';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { version } from './package.json';

export default defineConfig({
  root: 'src',
  build: {
    outDir: '../build',
    sourcemap: 'inline',
  },
  publicDir: '../public',
  base: './',
  outDir: './',
  appType: 'custom',
  plugins: [
    VitePWA({
      strategies: 'generateSW',
      injectRegister: 'auto',
      registerType: 'prompt',
      filename: 'service-worker.js',
      manifestFilename: 'cleanstart.webmanifest',
      workbox: {
        navigateFallbackDenylist: [/^\/api/, /^chrome-extension:\S+/],
        clientsClaim: true,
        skipWaiting: true,
        cleanupOutdatedCaches: true,
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
        ],
        homepage_url: 'https://cleanstart.page/',
        scope: '/',
        start_url: '/',
        display: 'standalone',
        background_color: '#121212',
        theme_color: '#121212',
      },
    }),
    react({
      // Use React plugin in all *.jsx and *.tsx files
      include: '**/*.{jsx,tsx}',
    }),
  ],
});
