// @vitest-environment node
import { describe, it, expect, vi, afterEach } from 'vitest';
import {
  jsonResponse,
  upstreamErrorResponse,
  healthcheckResponse,
  isHealthcheck,
  respondFromCache,
  cacheResponse,
} from './_lib.js';

describe('jsonResponse', () => {
  it('returns 200 with JSON body and default cache headers', async () => {
    const response = jsonResponse({ a: 1 });

    expect(response.status).toBe(200);
    expect(await response.text()).toBe('{"a":1}');
    expect(response.headers.get('Content-Type')).toBe('application/json');
    expect(response.headers.get('Cache-Control')).toBe(
      'max-age=3600, s-maxage=3600'
    );
  });

  it('honors status and maxAge options', async () => {
    const response = jsonResponse({ a: 1 }, { status: 201, maxAge: 60 });

    expect(response.status).toBe(201);
    expect(response.headers.get('Cache-Control')).toBe(
      'max-age=60, s-maxage=60'
    );
  });
});

describe('upstreamErrorResponse', () => {
  it('returns a sanitized 502 without stack or message', async () => {
    const response = upstreamErrorResponse();
    const body = await response.json();

    expect(response.status).toBe(502);
    expect(typeof body.error).toBe('string');
    expect(body).not.toHaveProperty('stack');
    expect(body).not.toHaveProperty('message');
  });
});

describe('healthcheckResponse', () => {
  it('returns 200 with the healthcheck body', async () => {
    const response = healthcheckResponse();

    expect(response.status).toBe(200);
    expect(await response.text()).toBe(
      JSON.stringify('API is up and running')
    );
    expect(response.headers.get('Content-Type')).toBe('application/json');
  });
});

describe('isHealthcheck', () => {
  it('returns true when the healthcheck param is present', () => {
    expect(isHealthcheck('https://x/api/quotes?healthcheck=1')).toBe(true);
  });

  it('returns false when the healthcheck param is absent', () => {
    expect(isHealthcheck('https://x/api/quotes')).toBe(false);
  });

  it('returns false for an empty healthcheck param', () => {
    expect(isHealthcheck('https://x/api/quotes?healthcheck=')).toBe(false);
  });
});

describe('respondFromCache', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('returns null on a cache miss', async () => {
    const fakeCache = { match: vi.fn(async () => null) };
    vi.stubGlobal('caches', { open: vi.fn(async () => fakeCache) });

    const result = await respondFromCache('quotes', 'key');

    expect(result).toBeNull();
    expect(fakeCache.match).toHaveBeenCalledWith('key');
  });

  it('returns a Response with the cached body on a hit', async () => {
    const fakeCache = { match: vi.fn(async () => new Response('{"a":1}')) };
    vi.stubGlobal('caches', { open: vi.fn(async () => fakeCache) });

    const result = await respondFromCache('quotes', 'key');

    expect(result).toBeInstanceOf(Response);
    expect(await result.json()).toEqual({ a: 1 });
  });
});

describe('cacheResponse', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('puts a clone of the response once via context.waitUntil', async () => {
    const put = vi.fn(async () => {});
    const fakeCache = { put };
    vi.stubGlobal('caches', { open: vi.fn(async () => fakeCache) });

    const waitUntil = vi.fn();
    const response = jsonResponse({ a: 1 });

    cacheResponse({ waitUntil }, 'quotes', 'key', response);

    expect(waitUntil).toHaveBeenCalledTimes(1);

    await waitUntil.mock.calls[0][0];

    expect(put).toHaveBeenCalledTimes(1);
    expect(put.mock.calls[0][0]).toBe('key');
    const stored = put.mock.calls[0][1];
    expect(stored).toBeInstanceOf(Response);
    expect(stored).not.toBe(response);
    expect(await stored.text()).toBe('{"a":1}');
  });
});
