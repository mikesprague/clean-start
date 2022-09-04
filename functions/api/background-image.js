const axios = require('axios').default;

module.exports = async (req, res) => {
  const {
    UNSPLASH_ACCESS_KEY,
  } = process.env;

  const unsplashCollectionsArray = [
    327760, // nature
    219941, // architecture/buildings/spaces
    894, // earth/planets
    // 1976082, // city views
    // 461370, // city/street
    784236, // city
    // 1079798, // street art
    // 4332580, // space
    535285, // starry nights/space
  ];
  const unsplashCollections = unsplashCollectionsArray.join(',');
  // gets a random imagee from a nature collection with over 1200 images in it
  const unsplashApiurl = `https://api.unsplash.com/photos/random/?collections=${unsplashCollections}&orientation=landscape&count=5&client_id=${UNSPLASH_ACCESS_KEY}`;

  const normalizeImageData = (apiData) => {
    const returnData = apiData.map((imageData) => {
      const {
        alt_description: altDescription,
        created_at: createdAt,
        description,
        links,
        location,
        urls,
        user,
      } = imageData || null;
      const {
        html: imageLink,
      } = links || null;
      const {
        title,
        name,
      } = location || null;
      const {
        regular: imageUrl,
        small: imageSmallUrl,
        thumb: imageThumbUrl,
      } = urls || null;
      const {
        name: userName,
        links: userLinks,
      } = user || null;
      const {
        html: userLink,
      } = userLinks || null;
      return {
        altDescription,
        createdAt,
        description,
        title,
        name,
        imageLink,
        imageUrl,
        imageSmallUrl,
        imageThumbUrl,
        userLink,
        userName,
      };
    });
    return returnData;
  };

  const imageData = await axios.get(unsplashApiurl)
    .then((response) => response.data).catch((error) => {
      console.error(error);
      res.status(500).json(error);
    });

  const returnData = normalizeImageData(imageData);
  res.setHeader('Cache-Control', 'max-age=900, s-maxage=900');
  res.status(200).json(returnData);
};
