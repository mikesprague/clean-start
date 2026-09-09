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
  const CACHE_NAME = 'product-hunt-posts';
  const { request } = context;
  const { url } = request;

  if (isHealthcheck(url)) {
    return healthcheckResponse();
  }

  const cachedResponse = await respondFromCache(CACHE_NAME, request);
  if (cachedResponse) {
    return cachedResponse;
  }

  const postsData = await fetch(
    'https://www.producthunt.com/feed?category=undefined',
    {
      headers: {
        'User-Agent': 'Clean Start Extension',
        'Response-Type': 'application/rss+xml',
      },
    }
  )
    .then(async (response) => {
      const data = await response.text();
      // console.log(data);
      const $ = cheerio.load(data);
      const returnData = [];

      $('entry').each((i, elem) => {
        returnData.push({
          title: $(elem).find('title').contents().toString().trim(),
          link: $(elem).find('link').attr('href').toString().trim(),
          pubDate: dayjs(
            $(elem).find('published').contents().toString().trim()
          ).toISOString(),
          author: $(elem).find('author').contents().text().trim(),
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
