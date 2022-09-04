export const onRequestGet = async (context) => {
  const { cf, url } = context.request;

  const urlParams = new URL(url).searchParams;

  const healthcheck = urlParams.get('healthcheck');

  if (healthcheck) {
    return new Response(JSON.stringify('API is up and running'), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const normalizeQuoteData = (apiData) => {
    const returnData = apiData.map((quoteData) => {
      const { content, excerpt, link: quoteLink, title } = quoteData || null;
      const { rendered: quoteExcerpt } = excerpt;
      const { rendered: quoteHtml } = content;
      const { rendered: quoteAuthor } = title;

      return {
        quoteExcerpt,
        quoteHtml,
        quoteAuthor,
        quoteLink,
      };
    });
    return returnData;
  };

  const quotesData = await fetch('https://quotesondesign.com/wp-json/wp/v2/posts/?orderby=rand')
    .then(async (response) => normalizeQuoteData(await response.json()))
    .catch((error) => {
      console.error(error);
      return new Response(JSON.stringify(error), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    });
  return new Response(JSON.stringify(quotesData), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'max-age=1800, s-maxage=1800',
    },
  });
};
