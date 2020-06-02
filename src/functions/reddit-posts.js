const axios = require('axios').default;

exports.handler = async (event, context, callback) => {
  const callbackHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  const redditPosts = await axios.get('https://www.reddit.com/r/popular.json?limit=10')
    .then(response => {
      const { children } = response.data.data;
      const returnData = children.map(child => {
        return child.data;
      });
      return returnData;
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
    body: JSON.stringify(redditPosts),
  };
};
