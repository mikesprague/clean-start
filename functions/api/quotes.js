import {
  jsonResponse,
  upstreamErrorResponse,
  isHealthcheck,
  healthcheckResponse,
  respondFromCache,
  cacheResponse,
} from './_lib.js';

export const onRequestGet = async (context) => {
  const CACHE_NAME = 'quotes';
  const { request } = context;
  const { url } = request;

  if (isHealthcheck(url)) {
    return healthcheckResponse();
  }

  const cachedResponse = await respondFromCache(CACHE_NAME, request);
  if (cachedResponse) {
    return cachedResponse;
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

  cacheResponse(context, CACHE_NAME, request, response);

  return response;
};
