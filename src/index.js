import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import App from './components/App';
import {
  initServiceWorker,
  isDev
} from './modules/helpers';

const rootElement = document.getElementById('root');

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  rootElement,
);

if (!isDev()) {
  initServiceWorker();
}
