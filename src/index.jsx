import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { registerSW } from 'virtual:pwa-register';

import App from './components/App';

// import { initServiceWorker, isDev } from './modules/helpers';

import 'tippy.js/dist/tippy.css';
import './index.scss';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <StrictMode>
    <App />
  </StrictMode>,
);

registerSW({
  onNeedRefresh() {
    window.location.reload(true);
  },
  onOfflineReady() {},
  immediate: true,
});

// if (!isDev()) {
//   initServiceWorker();
// }
