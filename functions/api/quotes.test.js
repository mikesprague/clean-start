// @vitest-environment node
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { onRequestGet } from './quotes.js';

const makeContext = () => ({
  request: { url: 'https://cleanstart.page/api/quotes' },
  waitUntil: () => {},
  env: {},
});

describe('quotes upstream failure', () => {
  beforeEach(() => {
    const fakeCache = {
      match: vi.fn(async () => undefined),
      put: vi.fn(async () => {}),
    };

    vi.stubGlobal('caches', { open: vi.fn(async () => fakeCache) });
    vi.stubGlobal(
      'fetch',
      vi.fn(() => Promise.reject(new Error('boom')))
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('returns a sanitized 502 instead of 200 with an empty body', async () => {
    const response = await onRequestGet(makeContext());
    const body = await response.json();

    expect(response.status).toBe(502);
    expect(typeof body.error).toBe('string');
    expect(body).not.toHaveProperty('stack');
  });
});
