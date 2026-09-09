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
  const CACHE_NAME = 'hacker-news-posts';
  const { request } = context;
  const { url } = request;

  if (isHealthcheck(url)) {
    return healthcheckResponse();
  }

  const cachedResponse = await respondFromCache(CACHE_NAME, request);
  if (cachedResponse) {
    return cachedResponse;
  }

  const postsData = await fetch('https://news.ycombinator.com/rss', {
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

      $('rss')
        .find('item')
        .each((i, elem) => {
          const itemAsString = $(elem).toString();
          // console.log(itemAsString);
          const linkStart = itemAsString.indexOf('<link>') + 6;
          const linkEnd = itemAsString.indexOf('<pubdate>');
          const link = itemAsString.substring(linkStart, linkEnd).trim();
          // console.log(link);
          const title = $(elem).find('title').text().trim();
          const pubDate = dayjs(
            $(elem).find('pubDate').text().trim()
          ).toISOString();

          returnData.push({
            title,
            link,
            pubDate,
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
