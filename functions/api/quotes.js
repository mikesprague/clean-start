import { jsonResponse, upstreamErrorResponse } from './_lib.js';

export const onRequestGet = async (context) => {
  const CACHE_NAME = 'quotes';
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

  const normalizeQuoteData = (apiData) => {
    const returnData = apiData.map((quoteData) => {
      const quoteExcerpt = quoteData.q;
      const quoteHtml = quoteData.h;
      const quoteAuthor = quoteData.a;

      return {
        quoteExcerpt,
        quoteHtml,
        quoteAuthor,
      };
    });

    return returnData;
  };

  const data = await fetch('https://zenquotes.io/api/quotes/')
    .then(async (response) => response.json())
    .catch(() => null);

  if (data == null) {
    return upstreamErrorResponse();
  }

  const normalized = normalizeQuoteData(data);

  const response = jsonResponse(normalized, { maxAge: 3600 });

  // cache data;
  context.waitUntil(cache.put(request, response.clone()));

  return response;
};
