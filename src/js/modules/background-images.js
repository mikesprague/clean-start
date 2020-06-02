import axios from 'axios';
import dayjs from 'dayjs';
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

export async function getUnsplashImagesData() {
  const bgImagesApiUrl = `${apiUrl()}/background-image/`;
  const bgImagesData =  await axios.get(bgImagesApiUrl)
  .then((response) => {
    // console.log(response.data);
    return response.data;
  });
  return bgImagesData;
}

async function getAndSetBgData () {
  const apiData = await getUnsplashImagesData();
  clearData(appConfig.bgDataKey);
  clearData(appConfig.bgLastUpdatedKey);
  setData(appConfig.bgDataKey, apiData);
  setData(appConfig.bgLastUpdatedKey, dayjs());

  return apiData;
}

export async function getUnsplashImages() {
  const cacheExists = isCached(appConfig.bgDataKey);
  let apiData = null;
  if (cacheExists) {
    const cacheValid = isCacheValid(appConfig.bgLastUpdatedKey, appConfig.bgCacheTtl, 'minute');
    if (cacheValid) {
      apiData = getData(appConfig.bgDataKey);
    } else {
      apiData = await getAndSetBgData();
    }
  } else {
    apiData = await getAndSetBgData();
  }

  return apiData;
}

export async function preloadBgImages () {
  const bgImagesData = getData(appConfig.bgDataKey);
  const bgPromises = bgImagesData.map(bgImageData => {
    const bgImage = axios.get(bgImageData.imageUrl);
    axios.get(bgImageData.imageThumbUrl);
    return bgImage;
  });
  return bgPromises;
}

export async function setImageAndMetaData () {
  const getAllBgImages = await getUnsplashImages();
  const bgNum = getData(appConfig.bgCurrentKey) || 0;
  const imageData = getAllBgImages[bgNum];
  setData(appConfig.bgCurrentKey, bgNum);
  const {
    title,
    name,
    imageLink,
    imageUrl,
    imageThumbUrl,
    userLink,
    userName,
  } = imageData || null;
  const getImageTitle = () => {
    if (title) {
      return title;
    }
    if (name) {
      return name;
    }
    return 'No description available';
  };
  document.body.style.background =
    `url('${imageUrl}') no-repeat fixed center center, url('${imageThumbUrl}') no-repeat fixed center center`;
  document.body.style.backgroundSize = 'cover, cover';
  const linkSuffix = '?utm_source=My%20Start%20Page&utm_medium=referral';
  const bgMetadataEl = document.querySelector('.bg-metadata');
  bgMetadataEl.innerHTML = `
    <a href="${imageLink}${linkSuffix}" target="_blank" rel="noopener">
      <i class="fad fa-fw fa-image"></i> ${getImageTitle()}
    </a>
    <br>
    <a href="${userLink}${linkSuffix}" target="_blank" rel="noopener">
      <i class="fad fa-fw fa-user"></i> ${userName}
    </a>
    via <a href="https://unsplash.com/${linkSuffix}" target="_blank" rel="noopener">Unsplash</a>
  `;
}

export async function rotateBgImage () {
  const currentBgNum = getData(appConfig.bgCurrentKey) || 0;
  const nextBgNum = currentBgNum + 1 >= 5 ? 0 : currentBgNum + 1;
  setData(appConfig.bgCurrentKey, nextBgNum);
  await setImageAndMetaData();
}

export function initRotateBgImage () {
  const rotateLink = document.querySelector('.rotate-bg');
  rotateLink.addEventListener('click', async (event) => {
    event.preventDefault();
    await rotateBgImage();
  });
}

export async function initBgImages() {
  await setImageAndMetaData();
  initRotateBgImage();
  preloadBgImages();
}
