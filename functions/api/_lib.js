export const jsonResponse = (data, { status = 200, maxAge = 3600 } = {}) =>
  new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': `max-age=${maxAge}, s-maxage=${maxAge}`,
    },
  });

export const upstreamErrorResponse = () =>
  new Response(JSON.stringify({ error: 'upstream service unavailable' }), {
    status: 502,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
    },
  });
