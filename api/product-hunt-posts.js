const axios = require('axios').default;

module.exports = async (req, res) => {
  const postsData = await axios.get('https://www.producthunt.com/feed?category=undefined', {
    responseType: 'document',
  })
    .then((response) => response.data)
    .catch((error) => {
      console.error(error);
      res.status(500).json(error);
    });
  res.setHeader('Cache-Control', 'max-age=3600, s-maxage=3600');
  res.status(200).json(postsData);
};
