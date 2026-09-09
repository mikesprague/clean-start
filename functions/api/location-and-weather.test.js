// @vitest-environment node
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { onRequestGet } from './location-and-weather.js';

const makeContext = (latitude, longitude) => ({
  request: {
    cf: {
      latitude,
      longitude,
      city: 'X',
      country: 'US',
      region: 'Y',
      regionCode: 'NY',
    },
    url: 'https://cleanstart.page/api/location-and-weather',
  },
  waitUntil: () => {},
  env: {},
});

describe('location-and-weather cache key', () => {
  let cacheStore;
  let matchKeys;
  let putKeys;

  beforeEach(() => {
    cacheStore = new Map();
    matchKeys = [];
    putKeys = [];

    const fakeCache = {
      match: vi.fn(async (key) => {
        matchKeys.push(String(key));
        return cacheStore.get(String(key));
      }),
      put: vi.fn(async (key, value) => {
        putKeys.push(String(key));
        cacheStore.set(String(key), value);
      }),
    };

    vi.stubGlobal('caches', { open: vi.fn(async () => fakeCache) });
    vi.stubGlobal(
      'fetch',
      vi.fn(() => Promise.resolve(new Response(JSON.stringify({ weather: {} }))))
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('uses different cache keys for different locations', async () => {
    await onRequestGet(makeContext('40.7128', '-74.0060'));
    await onRequestGet(makeContext('51.5074', '-0.1278'));

    expect(matchKeys[0]).not.toEqual(matchKeys[1]);
  });

  it('scopes the cache key to the rounded location and units', async () => {
    await onRequestGet(makeContext('40.7128', '-74.0060'));

    const expectedKey =
      'https://cleanstart.page/api/location-and-weather?lat=40.71&lng=-74.01&units=imperial';
    expect(matchKeys[0]).toEqual(expectedKey);
    expect(putKeys[0]).toEqual(expectedKey);
  });
});
