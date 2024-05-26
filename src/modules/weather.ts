// export const getWeatherIcon = (icon, id = null, description = null) => {
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
    '50n': 'smog',
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

// expects object from weather array as shown: https://openweathermap.org/current#current_JSON
// using weather/icons codes from: https://openweathermap.org/weather-conditions
// export const getOpenWeatherMapIcon = ({ id, main, description, icon }) => {
export const getOpenWeatherMapIcon = ({ id, description, icon }) => {
  // console.log(id, main, description, icon);
  let returnIcon: string;

  switch (Number(String(id).charAt(0))) {
    case 2: {
      // thunderstorm
      returnIcon = 'cloud-bolt';
      break;
    }
    case 3: {
      // drizzle
      returnIcon = icon.endsWith('d') ? 'cloud-sun-rain' : 'cloud-moon-rain';
      break;
    }
    case 5: {
      // rain
      // if (description.includes('light')) {
      //   returnIcon = icon.endsWith('d') ? 'cloud-sun-rain' : 'cloud-moon-rain';
      //   break;
      // }

      if (description.includes('heavy')) {
        returnIcon = 'cloud-showers-heavy';
        break;
      }

      returnIcon = 'cloud-rain';
      break;
    }
    case 6: {
      // snow
      returnIcon = 'snowflake';
      break;
    }
    case 7: {
      // atmosphere
      if (id === 762) {
        returnIcon = 'volcano';
        break;
      }

      if (id === 771) {
        returnIcon = 'wind';
        break;
      }

      if (id === 781) {
        returnIcon = 'tornado';
        break;
      }

      returnIcon = 'smog';
      break;
    }
    case 8: {
      // clouds
      if (id === 800) {
        returnIcon = icon.endsWith('d') ? 'sun' : 'moon';
        break;
      }

      if (id === 801 || id === 802) {
        returnIcon = icon.endsWith('d') ? 'cloud-sun' : 'cloud-moon';
        break;
      }

      returnIcon = 'cloud';
      break;
    }

    default: {
      console.log(`no icon matched for weather id: ${id}`);
      returnIcon = 'temperature-half';
    }
  }

  return returnIcon;
};
