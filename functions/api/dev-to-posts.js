import * as cheerio from 'cheerio';
import dayjs from 'dayjs';
import {
  jsonResponse,
  upstreamErrorResponse,
  isHealthcheck,
  healthcheckResponse,
  respondFromCache,
  cacheResponse,
} from './_lib.js';

export const onRequestGet = async (context) => {
  const CACHE_NAME = 'dev-to-posts';
  const { request } = context;
  const { url } = request;

  if (isHealthcheck(url)) {
    return healthcheckResponse();
  }

  const cachedResponse = await respondFromCache(CACHE_NAME, request);
  if (cachedResponse) {
    return cachedResponse;
  }

  const postsData = await fetch('https://dev.to/feed', {
    headers: {
      'User-Agent': 'Clean Start Extension',
      'Response-Type': 'application/rss+xml',
    },
  })
    .then(async (response) => {
      const data = await response.text();
      // console.log(data);
      const $ = cheerio.load(data);
      const returnData = [];

      $('item').each((i, elem) => {
        returnData.push({
          title: $(elem).find('title').contents().toString(),
          link: $(elem).find('guid').contents().toString(),
          pubDate: dayjs(
            $(elem).find('pubDate').contents().toString()
          ).toISOString(),
          author: $(elem).find('dc\\:creator').contents().toString(),
        });
      });
      // console.log(returnData);

      return returnData;
    })
    .catch(() => null);

  if (postsData == null) {
    return upstreamErrorResponse();
  }

  // console.log(postsData);
  const response = jsonResponse(postsData, { maxAge: 3600 });

  cacheResponse(context, CACHE_NAME, request, response);

  return response;
};
