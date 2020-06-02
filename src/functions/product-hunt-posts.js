const axios = require('axios').default;

exports.handler = async (event, context, callback) => {
  const callbackHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  const postsData = await axios.get('https://www.producthunt.com/feed?category=undefined', {
    responseType: 'document',
  })
    .then((response) => {
      // console.log(response);
      return response.data;
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
    body: JSON.stringify(postsData),
  };
};
