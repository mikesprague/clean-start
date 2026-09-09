// @vitest-environment node
import { describe, it, expect } from 'vitest';
import { jsonResponse, upstreamErrorResponse } from './_lib.js';

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
