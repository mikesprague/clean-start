import { registerSW } from 'virtual:pwa-register';
import * as React from 'react';
import { createRoot } from 'react-dom/client';

import { App } from './components/App';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

registerSW({
  onNeedRefresh() {
    window.location.reload();
  },
  onOfflineReady() {},
  immediate: true,
});
