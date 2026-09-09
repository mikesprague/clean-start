import {
  jsonResponse,
  upstreamErrorResponse,
  isHealthcheck,
  healthcheckResponse,
  respondFromCache,
  cacheResponse,
} from './_lib.js';

export const onRequestGet = async (context) => {
  const CACHE_NAME = 'github-trending-repos';
  const { request } = context;
  const { url } = request;

  if (isHealthcheck(url)) {
    return healthcheckResponse();
  }

  const cachedResponse = await respondFromCache(CACHE_NAME, request);
  if (cachedResponse) {
    return cachedResponse;
  }

  const data = await fetch(
    'https://mikesprague.github.io/api/github-trending-repos/'
  )
    .then(async (response) => response.json())
    .catch(() => null);

  if (data == null) {
    return upstreamErrorResponse();
  }

  const normalized = data.data;

  const response = jsonResponse(normalized, { maxAge: 3600 });

  cacheResponse(context, CACHE_NAME, request, response);

  return response;
};
