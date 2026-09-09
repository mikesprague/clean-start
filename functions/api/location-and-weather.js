import {
  upstreamErrorResponse,
  isHealthcheck,
  healthcheckResponse,
  respondFromCache,
  cacheResponse,
} from './_lib.js';

export const onRequestGet = async (context) => {
  const CACHE_NAME = 'location-and-weather';
  const { request } = context;
  const { cf, url } = context.request;

  const urlParams = new URL(url).searchParams;

  let lat = urlParams.get('lat') || cf.latitude;
  let lng = urlParams.get('lng') || cf.longitude;
  const units = urlParams.get('units') || 'imperial';

  lat = Number.parseFloat(lat).toFixed(5).toString();
  lng = Number.parseFloat(lng).toFixed(5).toString();

  const { city, country, region, regionCode } = cf;

  if (isHealthcheck(url)) {
    return healthcheckResponse();
  }

  const cacheLat = Number.parseFloat(lat).toFixed(2).toString();
  const cacheLng = Number.parseFloat(lng).toFixed(2).toString();
  const cacheKey = new URL(url);
  cacheKey.searchParams.set('lat', cacheLat);
  cacheKey.searchParams.set('lng', cacheLng);
  cacheKey.searchParams.set('units', units);
  const cacheKeyUrl = cacheKey.toString();

  const cachedResponse = await respondFromCache(CACHE_NAME, cacheKeyUrl);
  if (cachedResponse) {
    return cachedResponse;
  }

  const { OPEN_WEATHERMAP_API_KEY } = context.env;

  const weatherApiUrl = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lng}&units=${units}&appid=${OPEN_WEATHERMAP_API_KEY}`;

  const locationData = {
    location: {
      locationName: `${city}, ${country === 'US' ? regionCode : country}`,
      city,
      country,
      region,
      regionCode,
      coordinates: {
        lat,
        lng,
      },
    },
  };

  const weatherData = await fetch(weatherApiUrl)
    .then(async (response) => {
      const weather = await response.json();

      return { weather };
    })
    .catch(() => null);

  if (!weatherData) {
    return upstreamErrorResponse();
  }

  const returnData = JSON.stringify({
    location: locationData.location,
    weather: weatherData.weather,
  });

  const response = new Response(returnData, {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'private, max-age=600',
    },
  });

  cacheResponse(context, CACHE_NAME, cacheKeyUrl, response);

  return response;
};
