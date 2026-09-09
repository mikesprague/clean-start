import * as cheerio from 'cheerio';
import dayjs from 'dayjs';
import { jsonResponse, upstreamErrorResponse } from './_lib.js';

export const onRequestGet = async (context) => {
  const CACHE_NAME = 'dev-to-posts';
  const { request } = context;

  const cache = await caches.open(CACHE_NAME);

  const cachedData = await cache.match(request);

  if (cachedData) {
    console.log('🚀 using cached data!');

    const returnData = await cachedData.json();

    return new Response(JSON.stringify(returnData), cachedData);
  }

  console.log('😢 no cache, fetching new data');

  const { url } = context.request;

  const urlParams = new URL(url).searchParams;

  const healthcheck = urlParams.get('healthcheck');

  if (healthcheck) {
    return new Response(JSON.stringify('API is up and running'), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
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

  // cache data;
  context.waitUntil(cache.put(request, response.clone()));

  return response;
};
