import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  appConfig,
  apiUrl,
  isCacheExpired,
  stripHTML,
} from '../modules/helpers.ts';

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('stripHTML', () => {
  it('removes html tags from a string', () => {
    expect(stripHTML('<b>hi</b>')).toBe('hi');
  });

  it('returns the input unchanged when there is no markup', () => {
    expect(stripHTML('no markup here')).toBe('no markup here');
  });
});

describe('isCacheExpired', () => {
  it('returns true when the cache duration has elapsed', () => {
    const lastUpdated = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString();

    expect(isCacheExpired(lastUpdated, 60)).toBe(true);
  });

  it('returns false when the cache is still fresh', () => {
    const lastUpdated = new Date(Date.now() - 10 * 60 * 1000).toISOString();

    expect(isCacheExpired(lastUpdated, 60)).toBe(false);
  });
});

describe('apiUrl', () => {
  it('returns a localhost url with port in development', () => {
    vi.stubGlobal('location', {
      hostname: 'localhost',
      port: '3000',
      protocol: 'http:',
      origin: 'http://localhost:3000',
    });

    expect(apiUrl()).toBe('http://localhost:3000/api');
  });

  it('returns the production api url in the extension build', () => {
    vi.stubGlobal('location', {
      hostname: 'abc123',
      port: '',
      protocol: 'https:',
      origin: 'chrome-extension://abc123',
    });

    expect(apiUrl()).toBe('https://cleanstart.page/api');
  });
});

describe('appConfig consistency', () => {
  it('uses the exact localStorage keys the components persist under', () => {
    expect(appConfig.bgDataKey).toBe('bgImagesData');
    expect(appConfig.bgImageNumKey).toBe('bgImageNum');
    expect(appConfig.devToDataKey).toBe('devToData');
    expect(appConfig.githubDataKey).toBe('githubData');
    expect(appConfig.hackerNewsDataKey).toBe('hackerNewsData');
    expect(appConfig.productHuntDataKey).toBe('productHuntData');
    expect(appConfig.quoteDataKey).toBe('quoteData');
    expect(appConfig.redditDataKey).toBe('redditData');
    expect(appConfig.weatherDataKey).toBe('weatherData');
  });

  it('uses the exact ttl values the components previously hardcoded', () => {
    expect(appConfig.bgCacheTtl).toBe(360);
    expect(appConfig.devToCacheTtl).toBe(60);
    expect(appConfig.githubCacheTtl).toBe(60);
    expect(appConfig.hackerNewsCacheTtl).toBe(60);
    expect(appConfig.productHuntCacheTtl).toBe(60);
    expect(appConfig.quoteCacheTtl).toBe(120);
    expect(appConfig.redditCacheTtl).toBe(60);
    expect(appConfig.weatherCacheTtl).toBe(10);
  });
});
