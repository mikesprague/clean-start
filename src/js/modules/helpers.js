import { library, dom } from '@fortawesome/fontawesome-svg-core';
import {
  faChrome,
  faDev,
  faEdge,
  faFirefoxBrowser,
  faGithub,
  faHackerNews,
  faProductHunt,
  faRedditAlien,
} from '@fortawesome/free-brands-svg-icons';
import {
  faBolt,
  faCalendar,
  faCloud,
  faCloudMeatball,
  faCloudMoon,
  faCloudRain,
  faCloudShowersHeavy,
  faCloudSun,
  faCode,
  faExternalLinkAlt,
  faHourglassHalf,
  faImage,
  faMapMarkerAlt,
  faMoon,
  faShareAlt,
  faSmog,
  faSnowflake,
  faStar,
  faSun,
  faSync,
  faSyncAlt,
  faThermometerHalf,
  faTint,
  faUser,
  faWind,
} from '@fortawesome/free-solid-svg-icons';
import { register } from 'register-service-worker';
import tippy from 'tippy.js';
import {
  resetData,
} from './data';

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
    faMoon,
    faCloudRain,
    faSnowflake,
    faWind,
    faSmog,
    faBolt,
    faCloud,
    faCloudSun,
    faCloudMoon,
    faCloudMeatball,
    faCloudShowersHeavy,
    faThermometerHalf,
    faHourglassHalf,
    faCode,
    faTint,
    faMapMarkerAlt,
    faExternalLinkAlt,
    faStar,
    faShareAlt,
    faCalendar,
    faSyncAlt,
    faSync,
    faChrome,
    faDev,
    faEdge,
    faFirefoxBrowser,
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
  const sourceCodeLinkEl = document.querySelector('.source-link');
  const sourceCodeLinkContainerEl = document.querySelector('.source-link-container');
  if (!isExtension()) {
    const appTitleEl = document.querySelector('.pwa-link-tooltip');
    const appTitleTooltip = `
      <a href="https://chrome.google.com/webstore/detail/mmnlbcjgkfloemcbbjhklbblhbcjhmol" target="_blank" rel="noopener">
        <i class='fab fa-fw fa-chrome'></i> Chrome Store
      </a>
      &nbsp;
      <a href="https://addons.mozilla.org/en-US/firefox/addon/clean-start/" target="_blank" rel="noopener">
        <i class='fab fa-fw fa-firefox-browser'></i> Firefox Add-ons
      </a>
    `;
    const pwaInstallLinks = `
      <h2 class="install-links">
        <a href="https://chrome.google.com/webstore/detail/mmnlbcjgkfloemcbbjhklbblhbcjhmol" data-tippy-content="Install via Chrome Store" target="_blank" rel="noopener"><i class='fab fa-fw fa-chrome'></i></a>
        <a href="https://addons.mozilla.org/en-US/firefox/addon/clean-start/" target="_blank" data-tippy-content="Install via Firefox Add-ons" rel="noopener"><i class='fab fa-fw fa-firefox-browser'></i></a>
        <a href="https://microsoftedge.microsoft.com/addons/detail/clean-start/aifahnhgmoaeckhcdnhdnoamjnkeppjf" target="_blank" data-tippy-content="Install via Edge Add-ons" rel="noopener"><i class='fab fa-fw fa-edge'></i></a>
      </h2>
    `;
    appTitleEl.setAttribute('data-tippy-content', appTitleTooltip);
    sourceCodeLinkContainerEl.insertAdjacentHTML('afterend', pwaInstallLinks);
  }
  const sourceCodeTooltip = `
    <a href="https://github.com/mikesprague/clean-start" target="_blank" rel="noopener">
      <i class="fas fa-fw fa-code"></i> Source code available on GitHub <i class='fab fa-fw fa-github'></i>
    </a>
  `;
  sourceCodeLinkEl.setAttribute('data-tippy-content', sourceCodeTooltip);
}
