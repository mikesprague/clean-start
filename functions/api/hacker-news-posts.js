import * as cheerio from 'cheerio';
import dayjs from 'dayjs';

export const onRequestGet = async (context) => {
  const CACHE_NAME = 'hacker-news-posts';
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
