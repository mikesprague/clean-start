const axios = require('axios').default;

module.exports = async (req, res) => {
  const { lat, lng } = req.query || null;

  if (!lat) {
    res.status(400).json('Missing "lat" parameter');
    return;
  }
  if (!lng) {
    res.status(400).json('Missing "lng" parameter');
    return;
  }

  const {
    GOOGLE_MAPS_API_KEY,
    DARK_SKY_API_KEY,
    // OPEN_WEATHERMAP_API_KEI,
  } = process.env;

  const units = req.query.units || 'auto';
  const geocodeApiUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_MAPS_API_KEY}`;
  const weatherApiUrl = `https://api.darksky.net/forecast/${DARK_SKY_API_KEY}/${lat},${lng}/?units=${units}`;
  // const openWeatherMapApiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lng}&&units=${units}&appid=${OPEN_WEATHERMAP_API_KEI}`;

  const geocodePromise = await axios.get(geocodeApiUrl)
    .then((response) => {
      const fullResults = response.data.results;
      const formattedAddress = fullResults[0].formatted_address;
      let locationName = '';
      const addressTargets = ['neighborhood', 'locality', 'administrative_area_level_2', 'administrative_area_level_1'];
      addressTargets.forEach((target) => {
        if (!locationName.length) {
          fullResults.forEach((result) => {
            if (!locationName.length) {
              result.address_components.forEach((component) => {
                if (!locationName.length && component.types.indexOf(target) > -1) {
                  locationName = component.long_name;
                }
              });
            }
          });
        }
      });
      // console.log(locationName);
      const locationData = {
        location: {
          locationName,
          formattedAddress,
          fullResults,
        },
      };
      return locationData;
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json(err);
    });

  const weatherPromise = await axios.get(weatherApiUrl)
    .then((response) => {
      const weatherData = {
        weather: response.data,
      };
      return weatherData;
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json(err);
    });

  res.setHeader('Cache-Control', 'max-age=0, s-maxage=300');
  res.status(200).json({
    location: geocodePromise.location,
    weather: weatherPromise.weather,
  });
};
