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

export async function getProductHuntPosts (productHuntRssUrl = `${apiUrl()}/product-hunt-posts`) {
  const productHuntData = await axios.get(productHuntRssUrl)
  .then(response => {
    const parser = new DOMParser();
    const xml = parser.parseFromString(response.data, 'text/xml');
    const entries = Array.from(xml.querySelectorAll('entry'));
    const phData = entries.map(entry => {
      // id, published, updated, title, link.href, content, author>name
      const content = entry.querySelector('content').innerHTML;
      const link = entry.querySelector('link').getAttribute('href');
      const published = entry.querySelector('published').innerHTML;
      const title = entry.querySelector('title').innerHTML;
      return {
        content,
        link,
        published,
        title,
      };
    });
    return phData;
  });
  const returnData = [];
  // limit to 10 items
  for (let i = 0; i < 10; i+=1) {
    returnData.push(productHuntData[i]);
  }
  return returnData;
}

async function getAndSetProductHuntPosts () {
  const apiData = await getProductHuntPosts();
  clearData(appConfig.productHuntDataKey);
  clearData(appConfig.productHuntLastUpdatedKey);
  setData(appConfig.productHuntDataKey, apiData);
  setData(appConfig.productHuntLastUpdatedKey, dayjs());

  return apiData;
}

export async function getProductHuntPostsMarkup () {
  const cacheExists = isCached(appConfig.productHuntDataKey);
  let productHuntData = null;
  if (cacheExists) {
    const cacheValid = isCacheValid(appConfig.productHuntLastUpdatedKey, appConfig.productHuntCacheTtl, 'minute');
    if (cacheValid) {
      productHuntData = getData(appConfig.productHuntDataKey);
    } else {
      productHuntData = await getAndSetProductHuntPosts();
    }
  } else {
    productHuntData = await getAndSetProductHuntPosts();
  }

  let idx = 0;
  const postsMarkup = productHuntData.map(post => {
    const listItemMarkup = `
      <li class="list-group-item list-group-item-action ${idx % 2 === 0 ? 'odd' : ''} text-white">
        <a href="${post.link}" title="View Post: ${post.title}" target="_blank" rel="noopener">
          <strong>${post.title}</strong>
        </a>
        <br>
        <small>
          <i class="fad fa-fw fa-calendar"></i> ${post.published}
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
          <i class="fab fa-fw fa-product-hunt"></i> Product Hunt Top Posts
          &nbsp;
          <small><a href="https://producthunt.com/" title="View on Product Hunt" target="_blank" rel="noopener"><i class="fad fa-fw fa-external-link"></i> View on Product Hunt</a></small>
        </h5>
      </li>
      ${postsMarkup.join('\n')}
    </ul>
  `;
  return mainTemplate;
}

export async function initProductHuntPopup() {
  const productHuntContent = await getProductHuntPostsMarkup();
  const elForPopup = document.querySelector('.ph-popup');
  tippy(elForPopup, {
    allowHTML: true,
    interactive: true,
    maxWidth: 'none',
    trigger: 'click',
    onShow(instance) {
      instance.setContent(productHuntContent);
    },
  });
}
