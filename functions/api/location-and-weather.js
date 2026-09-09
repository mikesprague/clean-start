import { upstreamErrorResponse } from './_lib.js';

export const onRequestGet = async (context) => {
  const CACHE_NAME = 'location-and-weather';
  const { request } = context;
  const { cf, url } = context.request;

  const urlParams = new URL(url).searchParams;

  const healthcheck = urlParams.get('healthcheck');
  let lat = urlParams.get('lat') || cf.latitude;
  let lng = urlParams.get('lng') || cf.longitude;
  const units = urlParams.get('units') || 'imperial';

  lat = Number.parseFloat(lat).toFixed(5).toString();
  lng = Number.parseFloat(lng).toFixed(5).toString();

  const { city, country, region, regionCode } = cf;

  if (healthcheck) {
    return new Response(JSON.stringify('API is up and running'), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const cache = await caches.open(CACHE_NAME);

  const cacheLat = Number.parseFloat(lat).toFixed(2).toString();
  const cacheLng = Number.parseFloat(lng).toFixed(2).toString();
  const cacheKey = new URL(url);
  cacheKey.searchParams.set('lat', cacheLat);
  cacheKey.searchParams.set('lng', cacheLng);
  cacheKey.searchParams.set('units', units);
  const cacheKeyUrl = cacheKey.toString();

  const cachedData = await cache.match(cacheKeyUrl);

  if (cachedData) {
    console.log('🚀 using cached data!');

    const returnData = await cachedData.json();

    return new Response(JSON.stringify(returnData), cachedData);
  }

  console.log('😢 no cache, fetching new data');

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

  // cache data;
  context.waitUntil(cache.put(cacheKeyUrl, response.clone()));

  return response;
};
