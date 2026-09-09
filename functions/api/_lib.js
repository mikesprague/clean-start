export const jsonResponse = (data, { status = 200, maxAge = 3600 } = {}) =>
  new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': `max-age=${maxAge}, s-maxage=${maxAge}`,
    },
  });

export const upstreamErrorResponse = () =>
  new Response(JSON.stringify({ error: 'upstream service unavailable' }), {
    status: 502,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
    },
  });

export const HEALTHCHECK_BODY = 'API is up and running';

export const healthcheckResponse = () =>
  new Response(JSON.stringify(HEALTHCHECK_BODY), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });

export const isHealthcheck = (url) => {
  const urlParams = new URL(url).searchParams;
  return Boolean(urlParams.get('healthcheck'));
};

// respondFromCache(cacheName, key): returns a Response or null (no cache hit).
export const respondFromCache = async (cacheName, key) => {
  const cache = await caches.open(cacheName);
  const cachedData = await cache.match(key);
  if (cachedData) {
    console.log('🚀 using cached data!');
    const returnData = await cachedData.json();
    return new Response(JSON.stringify(returnData), cachedData);
  }
  console.log('😢 no cache, fetching new data');
  return null;
};

export const cacheResponse = (context, cacheName, key, response) =>
  context.waitUntil(
    caches.open(cacheName).then((cache) => cache.put(key, response.clone()))
  );
