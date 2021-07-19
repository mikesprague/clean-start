const axios = require('axios').default;

module.exports = async (req, res) => {
  const postsData = await axios.get('https://news.ycombinator.com/rss', {
    responseType: 'document',
  })
    .then((response) => response.data)
    .catch((error) => {
      console.error(error);
      res.status(500).json(error);
    });
  res.setHeader('Cache-Control', 'max-age=1800, s-maxage=1800');
  res.status(200).json(postsData);
};
