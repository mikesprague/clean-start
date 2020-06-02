const axios = require('axios').default;

exports.handler = async (event, context, callback) => {
  const callbackHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  const normalizeQuoteData = (apiData) => {
    const returnData = apiData.map((quoteData) => {
      const {
        content,
        excerpt,
        link: quoteLink,
        title,
      } = quoteData || null;
      const {
        rendered: quoteExcerpt,
      } = excerpt;
      const {
        rendered: quoteHtml,
      } = content;
      const {
        rendered: quoteAuthor,
      } = title;

      return {
        quoteExcerpt,
        quoteHtml,
        quoteAuthor,
        quoteLink,
      };
    });
    return returnData;
  };

  const quotesData = await axios.get('https://quotesondesign.com/wp-json/wp/v2/posts/?orderby=rand')
    .then((response) => {
      // console.log(response);
      return normalizeQuoteData(response.data);
    }).catch((error) => {
      console.error(error);
      return {
        headers: callbackHeaders,
        statusCode: 500,
        body: JSON.stringify(error),
      };
    });
  return {
    headers: callbackHeaders,
    statusCode: 200,
    body: JSON.stringify(quotesData),
  };
};
