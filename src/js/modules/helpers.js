import { library, dom } from '@fortawesome/fontawesome-svg-core';
import {
  faGithub,
  faHackerNews,
  faProductHunt,
  faRedditAlien,
  faChrome,
  faDev,
} from '@fortawesome/free-brands-svg-icons';
import {
  faImage,
  faUser,
  faSun,
  faMoonStars,
  faCloudRain,
  faCloudSnow,
  faCloudSleet,
  faWind,
  faFog,
  faClouds,
  faCloudsSun,
  faCloudsMoon,
  faCloudHail,
  faThunderstorm,
  faTornado,
  faHurricane,
  faThermometerHalf,
  faHourglassHalf,
  faCode,
  faTint,
  faMapMarkerAlt,
  faExternalLink,
  faStar,
  faShareAlt,
  faCalendar,
  faSyncAlt,
} from '@fortawesome/pro-duotone-svg-icons';
import { register } from 'register-service-worker';
import tippy from 'tippy.js';
import {
  resetData,
} from './data';

export const appConfig = {
  bgCacheTtl: 60, // 1 hour
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

export function isExtension () {
  if (window.location.origin.includes('-extension://')) {
    return true;
  }
  return false;
}

export function isDev () {
  if (window.location.hostname === 'localhost') {
    return true;
  }
  return false;
}

export function apiUrl () {
  if (isExtension()) {
    return 'https://cleanst.art/.netlify/functions';
  }
  if (isDev()) {
    return 'http://localhost:9000';
  }
  return `https://${window.location.hostname}/.netlify/functions`;
}

export function initIcons() {
  library.add(
    faImage,
    faUser,
    faGithub,
    faHackerNews,
    faProductHunt,
    faRedditAlien,
    faSun,
    faMoonStars,
    faCloudRain,
    faCloudSnow,
    faCloudSleet,
    faWind,
    faFog,
    faClouds,
    faCloudsSun,
    faCloudsMoon,
    faCloudHail,
    faThunderstorm,
    faTornado,
    faHurricane,
    faThermometerHalf,
    faHourglassHalf,
    faCode,
    faTint,
    faMapMarkerAlt,
    faExternalLink,
    faStar,
    faShareAlt,
    faCalendar,
    faSyncAlt,
    faChrome,
    faDev,
  );
  dom.watch();
}

export function initTooltips() {
  tippy('[data-tippy-content]', {
    allowHTML: true,
    placement: 'left',
    interactive: true,
  });
}

export function handleError(error) {
  console.error(error);
}

export function initServiceWorker () {
  register('/service-worker.js', {
    updated(registration) {
      console.log(`Updated to the latest version.\n${registration}`);
      resetData();
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

export function initPwaLinks() {
  // if (!isExtension()) {
  //   const appTitleEl = document.querySelector('.pwa-link-tooltip');
  //   const appTitleTooltip = `
  //     <a href="https://chrome.google.com/webstore/detail/clean-start/xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" target="_blank" rel="noopener">
  //       View/Install in <i class='fab fa-fw fa-chrome'></i> Chrome Store
  //     </a>
  //   `;
  //   appTitleEl.setAttribute('data-tippy-content', appTitleTooltip);
  //   appTitleEl.innerHTML = `
  //     <a href="https://chrome.google.com/webstore/detail/clean-start/xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" target="_blank" rel="noopener">
  //       Clean Start
  //     </a>
  //   `;
  // }
  const authorNameEl = document.querySelector('.author-container');
  const authorNameTooltip = `
    <a href="https://github.com/mikesprague/clean-start" target="_blank" rel="noopener">
      <i class="fad fa-fw fa-code"></i> Source code available on GitHub <i class='fab fa-fw fa-github'></i>
    </a>
  `;
  authorNameEl.setAttribute('data-tippy-content', authorNameTooltip);
}
