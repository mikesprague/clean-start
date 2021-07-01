import dayjs from 'dayjs';
import { library } from '@fortawesome/fontawesome-svg-core';
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
  faSpinner,
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
    return 'https://cleanstart.page/api';
  }
  if (isDev()) {
    return 'http://localhost:3000';
  }
  return `https://${window.location.hostname}/api`;
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

export const initIcons = () => {
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
    faSpinner,
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
};

export const isCacheExpired = (lastUpdated, cacheDurationInMinutes) => {
  try {
    const nextUpdateTime = dayjs(lastUpdated).add(cacheDurationInMinutes, 'minute');
    if (dayjs().isAfter(nextUpdateTime)) {
      return true;
    }
  } catch (error) {
    handleError(error);
    return true;
  }
  return false;
};
