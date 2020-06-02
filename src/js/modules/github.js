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

export async function getTrendingRepos (dataUrl = `${apiUrl()}/github-trending-repos`) {
  const returnData = [];
  const pageData = await axios.get(dataUrl)
    .then(response => {
      // limit to 10 items
      for (let i = 0; i < 10; i+=1) {
        returnData.push(response.data[i]);
      }
      return returnData;
    });
  return pageData;
}

async function getAndSetGitHubData () {
  const apiData = await getTrendingRepos();
  clearData(appConfig.gitHubDataKey);
  clearData(appConfig.gitHubLastUpdatedKey);
  setData(appConfig.gitHubDataKey, apiData);
  setData(appConfig.gitHubLastUpdatedKey, dayjs());

  return apiData;
}

export async function getGitHubReposMarkup () {
  const cacheExists = isCached(appConfig.gitHubDataKey);
  let gitHubData = null;
  if (cacheExists) {
    const cacheValid = isCacheValid(appConfig.gitHubLastUpdatedKey, appConfig.gitHubCacheTtl, 'minute');
    if (cacheValid) {
      gitHubData = getData(appConfig.gitHubDataKey);
    } else {
      gitHubData = await getAndSetGitHubData();
    }
  } else {
    gitHubData = await getAndSetGitHubData();
  }

  let idx = 0;
  const starsIcon = '<i class="fad fa-fw fa-star"></i>';
  const forksIcon = '<i class="fad fa-fw fa-share-alt fa-rotate-270"></i>';
  const reposMarkup = gitHubData.map(repo => {
    const {
      title,
      description,
      stars,
      starsLink,
      forks,
      forksLink,
      starsToday,
      languageStyle,
      languageName,
      link,
    } = repo;
    const languageMarkup = languageName ? `<span class="repo-language-color" style="${languageStyle}"></span> ${languageName} &nbsp;&nbsp;` : '';
    const starsMarkup = stars.trim().length ? `<a href="${starsLink}" target="_blank" rel="noopener">${starsIcon} ${repo.stars}</a> &nbsp;&nbsp;` : '';
    const forksMarkup = forks.trim().length ? `<a href="${forksLink}">${forksIcon} ${repo.forks}</a>` : '';
    const listItemMarkup = `
      <li class="list-group-item list-group-item-action ${idx % 2 === 0 ? 'odd' : ''} text-white">
        <a href="${link}" target="_blank" rel="noopener">
          <strong>${title}</strong>
        </a>
        <br>
        ${description}
        <div class="row">
          <div class="col text-left">
            <small>
              ${languageMarkup}
              ${starsMarkup}
              ${forksMarkup}
            </small>
          </div>
          <div class="col text-right">
            <small>
            ${starsIcon} ${starsToday}
            </small>
          </div>
      </li>
    `;
    idx += 1;
    return listItemMarkup;
  });

  const mainTemplate = `
    <ul class="list-group posts-container">
      <li class="list-group-item list-group-item-heading">
        <h5>
          <i class="fab fa-fw fa-github"></i> GitHub Trending Repositories
          &nbsp;
          <small><a href="https://www.github.com/trending" title="View on GitHub" target="_blank" rel="noopener"><i class="fad fa-fw fa-external-link"></i> View on GitHub</a></small>
        </h5>
      </li>
      ${reposMarkup.join('\n')}
    </ul>
  `;
  return mainTemplate;
}

export async function initGitHubPopup() {
  const gitHubContent = await getGitHubReposMarkup();
  const elForPopup = document.querySelector('.github-popup');
  tippy(elForPopup, {
    allowHTML: true,
    interactive: true,
    maxWidth: 'none',
    trigger: 'click',
    onShow(instance) {
      instance.setContent(gitHubContent);
    },
  });
}
