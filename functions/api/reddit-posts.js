import { version } from '../../package.json';
import { jsonResponse, upstreamErrorResponse } from './_lib.js';

export const onRequestGet = async (context) => {
  const CACHE_NAME = 'reddit-posts';
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

  const redditPosts = await fetch('https://www.reddit.com/top/.json?count=10', {
    headers: { 'User-Agent': `Clean-Start-Extension/${version}` },
  })
    .then(async (response) => {
      const data = await response.json();
      const { children } = data.data;
      const returnData = children.map((child) => child.data);

      return Array.isArray(returnData) ? returnData : [];
    })
    .catch(() => null);

  if (redditPosts == null) {
    return upstreamErrorResponse();
  }

  const response = jsonResponse(redditPosts, { maxAge: 3600 });

  // cache data;
  context.waitUntil(cache.put(request, response.clone()));

  return response;
};
