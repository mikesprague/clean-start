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

export async function getDesignQuoteData() {
  const designQuoteApiUrl = `${apiUrl()}/quotes`;
  const designQuoteData = await axios.get(designQuoteApiUrl)
  .then((response) => {
    // console.log(response.data);
    return response.data;
  });
  return designQuoteData;
}

async function getAndSetQuoteData () {
  const apiData = await getDesignQuoteData();
  clearData(appConfig.quoteDataKey);
  clearData(appConfig.quoteLastUpdatedKey);
  setData(appConfig.quoteDataKey, apiData);
  setData(appConfig.quoteLastUpdatedKey, dayjs());

  return apiData;
}

export async function getDesignQuote() {
  const cacheExists = isCached(appConfig.quoteDataKey);
  let apiData = null;
  if (cacheExists) {
    const cacheValid = isCacheValid(appConfig.quoteLastUpdatedKey, appConfig.quoteCacheTtl, 'minute');
    if (cacheValid) {
      apiData = getData(appConfig.quoteDataKey);
    } else {
      apiData = await getAndSetQuoteData();
    }
  } else {
    apiData = await getAndSetQuoteData();
  }

  return apiData;
}

export async function initDesignQuote() {
  const designQuoteData = await getDesignQuote();
  const randomQuoteNumber = Math.floor(Math.random() * (designQuoteData.length - 1));
  const designQuote = designQuoteData[randomQuoteNumber];
  const designQuoteHtml = `
    <a href="${designQuote.quoteLink}" target="_blank" rel="noopener">${designQuote.quoteExcerpt}</a>
    <p class="quote-author">&mdash; ${designQuote.quoteAuthor}</p>
  `;
  const quoteElement = document.querySelector('.quote-container');
  quoteElement.innerHTML = designQuoteHtml;
}
