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

export async function getDevToPosts (devToUrl = `${apiUrl()}/dev-to-posts`) {
  const devToData = await axios.get(devToUrl)
  .then(response => {
    const parser = new DOMParser();
    const xml = parser.parseFromString(response.data, 'text/xml');
    const items = Array.from(xml.querySelectorAll('item'));
    const dtData = items.map(item => {
      // author, title, link, pubDate, description
      const author = item.querySelector('author').innerHTML;
      const title = item.querySelector('title').innerHTML;
      const link = item.querySelector('link').innerHTML;
      const pubDate = item.querySelector('pubDate').innerHTML;
      return {
        author,
        title,
        link,
        pubDate,
      };
    });
    return dtData;
  });
  const returnData = [];
  // limit to 10 items
  for (let i = 0; i < 10; i+=1) {
    returnData.push(devToData[i]);
  }
  return returnData;
}

async function getAndSetDevToPosts () {
  const apiData = await getDevToPosts();
  clearData(appConfig.devToDataKey);
  clearData(appConfig.devToLastUpdatedKey);
  setData(appConfig.devToDataKey, apiData);
  setData(appConfig.devToLastUpdatedKey, dayjs());

  return apiData;
}

export async function getHackerNewsPostsMarkup () {
  const cacheExists = isCached(appConfig.devToDataKey);
  let hackerNewsData = null;
  if (cacheExists) {
    const cacheValid = isCacheValid(appConfig.devToLastUpdatedKey, appConfig.devToCacheTtl, 'minute');
    if (cacheValid) {
      hackerNewsData = getData(appConfig.devToDataKey);
    } else {
      hackerNewsData = await getAndSetDevToPosts();
    }
  } else {
    hackerNewsData = await getAndSetDevToPosts();
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
          <i class="fad fa-fw fa-user"></i> ${post.author}
          <br>
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
          <i class="fab fa-fw fa-dev"></i> Dev.to Recent Posts
          &nbsp;
          <small><a href="https://dev.to/" title="Visit Dev.to" target="_blank" rel="noopener"><i class="fad fa-fw fa-external-link"></i> Visit Dev.to</a></small>
        </h5>
      </li>
      ${postsMarkup.join('\n')}
    </ul>
  `;
  return mainTemplate;
}

export async function initDevToPopup() {
  const devToContent = await getHackerNewsPostsMarkup();
  const elForPopup = document.querySelector('.dt-popup');
  tippy(elForPopup, {
    allowHTML: true,
    interactive: true,
    maxWidth: 'none',
    trigger: 'click',
    onShow(instance) {
      instance.setContent(devToContent);
    },
  });
}
