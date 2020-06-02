import axios from 'axios';
import dayjs from 'dayjs';
import tippy from 'tippy.js';
import {
  clearData,
  getData,
  isCached,
  isCacheValid,
  setData,
} from './data';
import {
  apiUrl,
  appConfig,
} from './helpers';

export async function getHackerNewsPosts (hackerNewsUrl = `${apiUrl()}/hacker-news-posts`) {
  const hackerNewsData = await axios.get(hackerNewsUrl)
  .then(response => {
    const parser = new DOMParser();
    const xml = parser.parseFromString(response.data, 'text/xml');
    const items = Array.from(xml.querySelectorAll('item'));
    const hnData = items.map(item => {
      // title, link, pubDate, comments, description
      const title = item.querySelector('title').innerHTML;
      const link = item.querySelector('link').innerHTML;
      const pubDate = item.querySelector('pubDate').innerHTML;
      return {
        title,
        link,
        pubDate,
      };
    });
    return hnData;
  });
  const returnData = [];
  // limit to 10 items
  for (let i = 0; i < 10; i+=1) {
    returnData.push(hackerNewsData[i]);
  }
  return returnData;
}

async function getAndSetHackerNewsPosts () {
  const apiData = await getHackerNewsPosts();
  clearData(appConfig.hackerNewsDataKey);
  clearData(appConfig.hackerNewsLastUpdatedKey);
  setData(appConfig.hackerNewsDataKey, apiData);
  setData(appConfig.hackerNewsLastUpdatedKey, dayjs());

  return apiData;
}

export async function getHackerNewsPostsMarkup () {
  const cacheExists = isCached(appConfig.hackerNewsDataKey);
  let hackerNewsData = null;
  if (cacheExists) {
    const cacheValid = isCacheValid(appConfig.hackerNewsLastUpdatedKey, appConfig.hackerNewsCacheTtl, 'minute');
    if (cacheValid) {
      hackerNewsData = getData(appConfig.hackerNewsDataKey);
    } else {
      hackerNewsData = await getAndSetHackerNewsPosts();
    }
  } else {
    hackerNewsData = await getAndSetHackerNewsPosts();
  }

  let idx = 0;
  const postsMarkup = hackerNewsData.map(post => {
    const listItemMarkup = `
      <li class="list-group-item list-group-item-action ${idx % 2 === 0 ? 'odd' : ''} text-white">
        <a href="${post.link}" title="View Post: ${post.title}" target="_blank" rel="noopener">
          <strong>${post.title}</strong>
        </a>
        <br>
        <small>
          <i class="fad fa-fw fa-calendar"></i> ${post.pubDate}
        </small>
      </li>
    `;
    idx += 1;
    return listItemMarkup;
  });

  const mainTemplate = `
    <ul class="list-group posts-container">
      <li class="list-group-item list-group-item-heading">
        <h5>
          <i class="fab fa-fw fa-hacker-news"></i> Hacker News Top Posts
          &nbsp;
          <small><a href="https://news.ycombinator.com/" title="View on Hacker News" target="_blank" rel="noopener"><i class="fad fa-fw fa-external-link"></i> View on Hacker News</a></small>
        </h5>
      </li>
      ${postsMarkup.join('\n')}
    </ul>
  `;
  return mainTemplate;
}

export async function initHackerNewsPopup() {
  const hackerNewsContent = await getHackerNewsPostsMarkup();
  const elForPopup = document.querySelector('.hn-popup');
  tippy(elForPopup, {
    allowHTML: true,
    interactive: true,
    maxWidth: 'none',
    trigger: 'click',
    onShow(instance) {
      instance.setContent(hackerNewsContent);
    },
  });
}
