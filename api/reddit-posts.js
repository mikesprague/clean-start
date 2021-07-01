const axios = require('axios').default;

module.exports = async (req, res) => {
  const redditPosts = await axios
    .get('https://www.reddit.com/r/popular.json?limit=10')
    .then(response => {
      const { children } = response.data.data;
      const returnData = children.map(child => child.data);
      return returnData;
    }).catch((error) => {
      console.error(error);
      res.status(500).json(error);
    });
  res.status(200).json(redditPosts);
};
