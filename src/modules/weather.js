export const getWeatherIcon = (icon) => {
  const iconMap = {
    'clear-day': 'sun',
    'clear-night': 'moon',
    rain: 'cloud-rain',
    snow: 'snowflake',
    sleet: 'cloud-cloud-meatball',
    wind: 'wind',
    fog: 'smog',
    cloudy: 'cloud',
    'partly-cloudy-day': 'cloud-sun',
    'partly-cloudy-night': 'cloud-moon',
    hail: 'cloud-meatball',
    hurricane: 'wind',
    thunderstorm: 'cloud-showers-heavy',
    tornado: 'wind',
  };

  return iconMap[icon];
};
