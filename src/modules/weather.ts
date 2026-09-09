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
