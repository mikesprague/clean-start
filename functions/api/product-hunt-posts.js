import * as cheerio from 'cheerio';
import dayjs from 'dayjs';

export const onRequestGet = async (context) => {
  const CACHE_NAME = 'product-hunt-posts';
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
    .catch((error) => {
      console.error(error);

      return new Response(
        JSON.stringify({
          message: error.message,
          stack: error.stack,
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    });

  // console.log(postsData);
  const response = new Response(JSON.stringify(postsData), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'max-age=3600, s-maxage=3600',
    },
  });

  // cache data;
  context.waitUntil(cache.put(request, response.clone()));

  return response;
};
