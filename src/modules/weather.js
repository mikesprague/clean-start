export const getWeatherIcon = (icon) => {
  const iconMap = {
    '01d': 'sun', // clear day
    '01n': 'moon', // clear night
    '10d': 'cloud-sun-rain', // drizzle day
    '10n': 'cloud-moon-rain', // drizzle night
    '09d': 'cloud-rain', // rain day
    '09n': 'cloud-rain', // rain night
    '13d': 'snowflake', // snow day
    '13dn': 'snowflake', // snow night
    // 'sleet': 'cloud-cloud-meatball', // 13d
    // 'wind': 'wind',
    '50d': 'smog',
    '03d': 'cloud', // cloud day
    '03n': 'cloud', // cloud night
    '04d': 'cloud-sun', // cloudy day
    '04n': 'cloud-moon', // cloudy night
    '02d': 'cloud-sun', // partly cloudy day
    '02n': 'cloud-moon', // partly cloudy night
    // 'hail': 'cloud-meatball',
    // 'hurricane': 'wind',
    '11d': 'cloud-showers-heavy', // thunderstorms day
    '11n': 'cloud-showers-heavy', // thunderstorms night
    // 'tornado': 'wind',
  };

  return iconMap[icon];
};
