const axios = require('axios').default;

exports.handler = async (event, context, callback) => {
  const { lat, lng } = event.queryStringParameters;
  const callbackHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  if (!lat) {
    return {
      headers: callbackHeaders,
      statusCode: 400,
      body: 'Missing "lat" parameter',
    };
  }
  if (!lng) {
    return {
      headers: callbackHeaders,
      statusCode: 400,
      body: 'Missing "lng" parameter',
    };
  }

  const {
    GOOGLE_MAPS_API_KEY,
    DARK_SKY_API_KEY,
    // OPEN_WEATHERMAP_API_KEI,
  } = process.env;

  const units = event.queryStringParameters.units || 'auto';
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
      console.log(err);
      return {
        headers: callbackHeaders,
        statusCode: 500,
        body: JSON.stringify(err),
      };
    });

  const weatherPromise = await axios.get(weatherApiUrl)
    .then((response) => {
      const weatherData = {
        weather: response.data,
      };
      return weatherData;
    })
    .catch((err) => {
      return {
        headers: callbackHeaders,
        statusCode: 500,
        body: JSON.stringify(err),
      };
    });

  return {
    headers: callbackHeaders,
    statusCode: 200,
    body: JSON.stringify({
      location: geocodePromise.location,
      weather: weatherPromise.weather,
    }),
  };
};
