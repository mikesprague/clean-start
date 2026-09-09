import { version } from '../../package.json';
import {
  jsonResponse,
  upstreamErrorResponse,
  isHealthcheck,
  healthcheckResponse,
  respondFromCache,
  cacheResponse,
} from './_lib.js';

export const onRequestGet = async (context) => {
  const CACHE_NAME = 'reddit-posts';
  const { request } = context;
  const { url } = request;

  if (isHealthcheck(url)) {
    return healthcheckResponse();
  }

  const cachedResponse = await respondFromCache(CACHE_NAME, request);
  if (cachedResponse) {
    return cachedResponse;
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

  cacheResponse(context, CACHE_NAME, request, response);

  return response;
};
