export const onRequestGet = async (context) => {
  const { url } = context.request;

  const urlParams = new URL(url).searchParams;

  const healthcheck = urlParams.get('healthcheck');

  if (healthcheck) {
    return new Response(JSON.stringify('API is up and running'), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const redditPosts = await fetch(
    'https://www.reddit.com/r/popular.json?limit=10',
  )
    .then(async (response) => {
      const data = await response.json();
      const { children } = data.data;
      const returnData = children.map((child) => child.data);

      return returnData;
    })
    .catch((error) => {
      console.error(error);

      return new Response(JSON.stringify(error), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    });

  return new Response(JSON.stringify(redditPosts), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'max-age=3600, s-maxage=3600',
    },
  });
};
