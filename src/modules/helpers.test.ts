import { afterEach, describe, expect, it, vi } from 'vitest';

import { apiUrl, isCacheExpired, stripHTML } from '../modules/helpers.ts';

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
