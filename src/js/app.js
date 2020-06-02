import '../scss/styles.scss';
import {
  initBgImages,
} from './modules/background-images';
import {
  initClock,
} from './modules/clock';
import {
  initDevToPopup,
} from './modules/dev-to';
import {
  initGitHubPopup,
} from './modules/github';
import {
  initHackerNewsPopup,
} from './modules/hacker-news';
import {
  appConfig,
  initIcons,
  initPwaLinks,
  initServiceWorker,
  initTooltips,
} from './modules/helpers';
import {
  initProductHuntPopup,
} from './modules/product-hunt';
import {
  initDesignQuote,
} from './modules/quotes';
import {
  initRedditPopup,
} from './modules/reddit';
import {
  initWeather,
} from './modules/weather';


const initApp = async () => {
  initServiceWorker();
  initWeather();
  await initBgImages();
  initClock(appConfig.clockUpdateInterval);
  initDesignQuote();
  initRedditPopup();
  initHackerNewsPopup();
  initProductHuntPopup();
  initGitHubPopup();
  initDevToPopup();
  initIcons();
  initPwaLinks();
  initTooltips();
};

document.onreadystatechange = () => {
  if (document.readyState === 'interactive') {
    initApp();
  }
};
