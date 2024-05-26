import { registerSW } from 'virtual:pwa-register';
import * as React from 'react';
import { createRoot } from 'react-dom/client';

import { App } from './components/App';

import 'tippy.js/dist/tippy.css';
import './index.scss';

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
