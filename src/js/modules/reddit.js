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

export async function getRedditPosts() {
  const redditPostsApiUrl = `${apiUrl()}/reddit-posts`;
  const redditPostsData = await axios.get(redditPostsApiUrl)
  .then((response) => {
    // console.log(response.data);
    return response.data;
  });
  return redditPostsData;
}

async function getAndSetRedditPostsData () {
  const apiData = await getRedditPosts();
  clearData(appConfig.redditDataKey);
  clearData(appConfig.redditLastUpdatedKey);
  setData(appConfig.redditDataKey, apiData);
  setData(appConfig.redditLastUpdatedKey, dayjs());

  return apiData;
}

export async function getRedditPostsMarkup () {
  const cacheExists = isCached(appConfig.redditDataKey);
  let redditData = null;
  if (cacheExists) {
    const cacheValid = isCacheValid(appConfig.redditLastUpdatedKey, appConfig.redditCacheTtl, 'minute');
    if (cacheValid) {
      redditData = getData(appConfig.redditDataKey);
    } else {
      redditData = await getAndSetRedditPostsData();
    }
  } else {
    redditData = await getAndSetRedditPostsData();
  }

  let idx = 0;
  const postsMarkup = redditData.map(post => {
    const listItemMarkup = `
      <li class="list-group-item list-group-item-action ${idx % 2 === 0 ? 'odd' : ''} text-white">
        <a href="https://www.reddit.com${post.permalink}" title="View Post: ${post.title}" target="_blank" rel="noopener"><strong>${post.title}</strong></a>
        <br>
        <small>
          <a href="https://www.reddit.com/r/${post.subreddit}" title="View Subreddit: /r/${post.subreddit}" target="_blank" rel="noopener">/r/${post.subreddit}</a>
          &nbsp;&nbsp;
          <a href="https://www.reddit.com/user/${post.author}/" title="View Author Page: ${post.author}" target="_blank" rel="noopener"><i class="fad fa-fw fa-user"></i> ${post.author}</a>
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
          <i class="fab fa-fw fa-reddit-alien"></i> Reddit Popular Posts
          &nbsp;
          <small><a href="https://www.reddit.com/r/popular" title="View on Reddit" target="_blank" rel="noopener"><i class="fad fa-fw fa-external-link"></i> View on Reddit</a></small>
        </h5>
      </li>
      ${postsMarkup.join('\n')}
    </ul>
  `;

  return mainTemplate;
}

export async function initRedditPopup() {
  const redditContent = await getRedditPostsMarkup();
  const elForPopup = document.querySelector('.reddit-popup');
  tippy(elForPopup, {
    allowHTML: true,
    interactive: true,
    maxWidth: 'none',
    trigger: 'click',
    onShow(instance) {
      instance.setContent(redditContent);
    },
  });
}
