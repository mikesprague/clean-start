import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faChrome,
  faDev,
  faEdge,
  faFirefoxBrowser,
  faGithub,
  faHackerNews,
  faProductHunt,
  faRedditAlien,
} from '@fortawesome/free-brands-svg-icons'
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
} from '@fortawesome/free-solid-svg-icons'
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

export const getWeatherIcon = (icon) => {
  const iconMap = {
    'clear-day': 'sun',
    'clear-night': 'moon',
    rain: 'cloud-rain',
    snow: 'snowflake',
    sleet: 'cloud-cloud-meatball',
    wind: 'wind',
    fog: 'smog',
    cloudy: 'cloud',
    'partly-cloudy-day': 'cloud-sun',
    'partly-cloudy-night': 'cloud-moon',
    hail: 'cloud-meatball',
    hurricane: 'wind',
    thunderstorm: 'cloud-showers-heavy',
    tornado: 'wind',
  };
  return iconMap[icon];
};

export const getContentInfo = (type) => {
  const resourceMap = {
    'dev-to': {
      'endpoint': '/dev-to-posts',
      'icon': 'dev',
      'siteName': 'Dev.to',
      'title': 'Dev.to Recent Posts',
      'url': 'https://dev.to',
    },
    'github': {
      'endpoint': '/github-trending-repos',
      'icon': 'github',
      'siteName': 'GitHub',
      'title': 'GitHub Trending Repositories',
      'url': 'https://github.com',
    },
    'hacker-news': {
      'endpoint': '/hacker-news-posts',
      'icon': 'hacker-news',
      'siteName': 'Hacker News',
      'title': 'Hacker News Top Posts',
      'url': 'https://news.ycombinator.com',
    },
    'product-hunt': {
      'endpoint': '/product-hunt-posts',
      'icon': 'product-hunt',
      'siteName': 'Product Hunt',
      'title': 'Product Hunt Top Posts',
      'url': 'https://www.producthunt.com',
    },
    'reddit': {
      'endpoint': '/reddit-posts',
      'icon': 'reddit-alien',
      'siteName': 'Reddit',
      'title': 'Reddit Popular Posts',
      'url': 'https://www.reddit.com',
    },
  };
  return resourceMap[type];
};
