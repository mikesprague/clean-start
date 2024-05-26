import type { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Tippy from '@tippyjs/react';
import axios from 'axios';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { atom, useAtom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { nanoid } from 'nanoid';
import { useEffect } from 'react';

import { apiUrl, isCacheExpired } from '../modules/helpers';
import { clearData } from '../modules/local-storage';
import { getOpenWeatherMapIcon } from '../modules/weather';

import './Weather.scss';

dayjs.extend(utc);
dayjs.extend(timezone);

dayjs.tz.setDefault('America/New_York');

interface HourlyWeatherData {
  dt: number;
  temp: number;
  feels_like: number;
  weather: {
    description: string;
  };
}

interface CurrentWeatherData {
  temp: number;
  feels_like: number;
  weather: {
    description: string;
  };
}

interface WeatherApiData {
  weather: {
    current: CurrentWeatherData;
    hourly: HourlyWeatherData[];
  };
  location: {
    locationName: string;
  };
}

interface WeatherData {
  lastUpdated: string;
  data: WeatherApiData;
}

const weatherDataAtom = atomWithStorage('weatherData', {
  lastUpdated: '',
  data: {} as WeatherApiData,
} as WeatherData);

const isLoadingAtom = atom(false);
const hourlyDataAtom = atom([] as HourlyWeatherData[]);

export const Weather = () => {
  const [weatherData, setWeatherData] = useAtom(weatherDataAtom);
  const [isLoading, setIsLoading] = useAtom(isLoadingAtom);
  const [hourlyData, setHourlyData] = useAtom(hourlyDataAtom);

  useEffect(() => {
    const getWeatherData = async () => {
      setIsLoading(true);
      const weatherApiUrl = `${apiUrl()}/location-and-weather`;

      const weatherApiData: WeatherApiData = await axios
        .get(weatherApiUrl)
        .then((response) => response.data);

      setWeatherData({
        lastUpdated: dayjs().tz('America/New_York').toISOString(),
        data: weatherApiData,
      });

      setIsLoading(false);
    };

    if (weatherData?.lastUpdated) {
      if (isCacheExpired(weatherData.lastUpdated, 10)) {
        clearData('weatherData');
        getWeatherData();
      }
    } else {
      clearData('weatherData');
      getWeatherData();
    }

    // return() => {};
  }, [setIsLoading, setWeatherData, weatherData]);

  useEffect(() => {
    if (weatherData?.data?.weather?.hourly) {
      const hourly: HourlyWeatherData[] = [];
      const startHour =
        Number(dayjs().tz('America/New_York').format('m')) > 30 ? 1 : 0;
      const numHoursToShow = 4;

      let index = 0;
      for (const hourData of weatherData.data.weather.hourly) {
        if (index >= startHour && index < startHour + numHoursToShow) {
          hourly.push(hourData);
        }
        index += 1;
      }
      setHourlyData(hourly);
    }

    // return () => {};
  }, [setHourlyData, weatherData]);

  return weatherData?.data ? (
    <div className="weather-container">
      <div className={isLoading ? 'block text-right mt-4' : 'hidden'}>
        <FontAwesomeIcon
          icon="spinner"
          size="2x"
          fixedWidth
          pulse
          className="mr-8"
        />
        <br />
        loading weather
      </div>
      <span className={isLoading ? 'invisible' : 'visible'}>
        <h4 className="weather-location">
          {weatherData?.data ? weatherData.data?.location?.locationName : ''}
        </h4>
        <div className="icon-and-temp">
          <Tippy
            content={
              weatherData?.data?.weather
                ? weatherData.data?.weather?.current?.weather[0].description
                : ''
            }
            placement="left"
          >
            <span>
              <FontAwesomeIcon
                icon={
                  weatherData?.data?.weather?.current
                    ? (getOpenWeatherMapIcon(
                        weatherData.data?.weather?.current?.weather[0]
                      ) as IconProp)
                    : ('hourglass-half' as IconProp)
                }
                fixedWidth
                className="weather-icon"
              />
              <strong className="weather-temp">
                {weatherData?.data?.weather?.current
                  ? ` ${Math.round(
                      weatherData.data?.weather?.current?.temp
                    )}${String.fromCharCode(176)}`
                  : ' -- '}
              </strong>
            </span>
          </Tippy>
          <div className="feels-like-temp">
            {/* Math.round(weatherData.weather.currently.temperature) !== Math.round(weatherData.weather.currently.apparentTemperature) */}
            {weatherData?.data?.weather?.current
              ? `Feels ${Math.round(
                  weatherData.data.weather.current.feels_like
                )}${String.fromCharCode(176)}`
              : ''}
          </div>
        </div>
        <ul className="flex hourly-forecast">
          {weatherData?.data &&
            hourlyData &&
            hourlyData.map((hour) => (
              <Tippy
                content={
                  hour
                    ? `${hour.weather[0].description} (Feels ${Math.round(
                        hour.feels_like
                      )}${String.fromCharCode(176)})`
                    : ''
                }
                placement="left"
                key={nanoid(8)}
              >
                <li key={nanoid(8)} className="w-1/4">
                  {dayjs.unix(hour.dt).format('ha')}
                  <br />
                  <FontAwesomeIcon
                    icon={getOpenWeatherMapIcon(hour.weather[0]) as IconProp}
                    fixedWidth
                  />
                  {` ${Math.round(hour.temp)}`}&deg;
                </li>
              </Tippy>
            ))}
        </ul>
        <div
          className={
            weatherData && hourlyData ? 'powered-by' : 'powered-by hidden'
          }
        >
          <a
            href="https://openweathermap.org/api/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Powered by OpenWeatherMap
          </a>
        </div>
      </span>
    </div>
  ) : null;
};

export default Weather;
