import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Tippy from '@tippyjs/react';
import axios from 'axios';
import dayjs from 'dayjs';
import { nanoid } from 'nanoid';
import React, { useEffect, useState } from 'react';
import useLocalStorageState from 'use-local-storage-state';

import { apiUrl, isCacheExpired } from '../modules/helpers';
import { clearData } from '../modules/local-storage';
import { getOpenWeatherMapIcon } from '../modules/weather';

import './Weather.scss';

export const Weather = () => {
  const [weatherData, setWeatherData] = useLocalStorageState('weatherData', {
    defaultValue: null,
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const getWeatherData = async () => {
      setIsLoading(true);
      const weatherApiurl = `${apiUrl()}/location-and-weather`;

      const weatherApiData = await axios
        .get(weatherApiurl)
        .then((response) => response.data);

      setWeatherData({
        lastUpdated: dayjs().toString(),
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
  }, [weatherData, setWeatherData]);

  const [hourlyData, setHourlyData] = useState(null);

  useEffect(() => {
    if (weatherData) {
      const hourly = [];
      const startHour = dayjs().format('m') > 30 ? 1 : 0;
      const numHoursToShow = 4;

      weatherData.data.weather.hourly.forEach((hourData, index) => {
        // console.log(hourData);

        if (index >= startHour && index < startHour + numHoursToShow) {
          hourly.push(hourData);
        }
      });
      setHourlyData(hourly);
    }
  }, [weatherData]);

  return (
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
          {weatherData?.data ? weatherData.data.location.locationName : ''}
        </h4>
        <div className="icon-and-temp">
          <Tippy
            content={
              weatherData?.data?.weather
                ? weatherData.data.weather.current.weather[0].description
                : ''
            }
            placement="left"
          >
            <span>
              <FontAwesomeIcon
                icon={
                  weatherData?.data
                    ? getOpenWeatherMapIcon(
                        weatherData.data.weather.current.weather[0]
                      )
                    : 'hourglass-half'
                }
                fixedWidth
                className="weather-icon"
              />
              <strong className="weather-temp">
                {weatherData?.data
                  ? ` ${Math.round(
                      weatherData.data.weather.current.temp
                    )}${String.fromCharCode(176)}`
                  : ' -- '}
              </strong>
            </span>
          </Tippy>
          <div className="feels-like-temp">
            {/* Math.round(weatherData.weather.currently.temperature) !== Math.round(weatherData.weather.currently.apparentTemperature) */}
            {weatherData?.data
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
                    icon={getOpenWeatherMapIcon(hour.weather[0])}
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
  );
};

export default Weather;
