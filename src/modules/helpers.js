import { register } from 'register-service-worker';
import tippy from 'tippy.js';
// import { resetData } from './local-storage';

export const appConfig = {
  bgCacheTtl: 360, // 6 hours
  bgCurrentKey: 'bgCurrent',
  bgDataKey: 'bgData',
  bgLastUpdatedKey: 'bgLastUpdated',

  clockUpdateInterval: 5, // 5 seconds

  gitHubCacheTtl: 60, // 1 hour
  gitHubDataKey: 'gitHubData',
  gitHubLastUpdatedKey: 'githubLastUpdated',

  devToCacheTtl: 60, // 1 hour
  devToDataKey: 'devToData',
  devToLastUpdatedKey: 'devToLastUpdated',

  hackerNewsCacheTtl: 60, // 1 hour
  hackerNewsDataKey: 'hackerNewsData',
  hackerNewsLastUpdatedKey: 'hackerNewsLastUpdated',

  productHuntCacheTtl: 60, // 1 hour
  productHuntDataKey: 'productHuntData',
  productHuntLastUpdatedKey: 'productHuntLastUpdated',

  quoteCacheTtl: 360, // 6 hours
  quoteDataKey: 'quoteData',
  quoteLastUpdatedKey: 'quoteLastUpdated',

  redditCacheTtl: 60, // 1 hour
  redditDataKey: 'redditPostsData',
  redditLastUpdatedKey: 'redditPostsLastUpdated',

  weatherCacheTtl: 20, // 20 minutes
  weatherDataKey: 'weatherData',
  weatherLastUpdatedKey: 'weatherLastUpdated',
};

export function initTooltips() {
  tippy('[data-tippy-content]', {
    allowHTML: true,
    placement: 'left',
    interactive: true,
  });
}

export function stripHTML(originalString) {
  return originalString.replace(/(<([^>]+)>)/gi, '');
}

export function isExtension () {
  if (window.location.origin.includes('-extension://')) {
    return true;
  }
  return false;
}

export function isDev () {
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return true;
  }
  return false;
}

export function apiUrl () {
  if (isExtension()) {
    return 'https://cleanst.art/.netlify/functions';
  }
  // if (isDev()) {
  //   return 'http://localhost:9000';
  // }
  return `https://cleanst.art/.netlify/functions`;
  // return `https://${window.location.hostname}/.netlify/functions`;
}

export function handleError(error) {
  console.error(error);
}

export function initServiceWorker () {
  register('/service-worker.js', {
    updated(registration) {
      console.log(`Updated to the latest version.\n${registration}`);
      // resetData();
      window.location.reload(true);
    },
    offline() {
      console.info('No internet connection found. App is currently offline.');
    },
    error(error) {
      console.error('Error during service worker registration:', error);
    },
  });
};
