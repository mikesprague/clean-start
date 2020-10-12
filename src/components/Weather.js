import axios from 'axios';
import dayjs from 'dayjs';
import { nanoid } from 'nanoid';
import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Tippy from '@tippyjs/react';
import { apiUrl } from '../modules/helpers';
import { clearData } from '../modules/local-storage';
import { getWeatherIcon } from '../modules/weather';
import { useLocalStorage } from '../hooks/useLocalStorage';
import './Weather.scss';

const Weather = () => {
  const [coordinates, setCoordinates] = useLocalStorage('coordinates', null);
  useEffect(() => {
    async function getPosition(position) {
      setCoordinates({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });
    }
    async function geolocationError(error) {
      console.error(error);
    }
    async function doGeolocation() {
      const geolocationOptions = {
        enableHighAccuracy: true,
        maximumAge: 3600000 // 1 hour (number of seconds * 1000 milliseconds)
      };
      await navigator.geolocation.getCurrentPosition(getPosition, geolocationError, geolocationOptions);
    }
    if (coordinates && weatherData && weatherData.lastUpdated) {
      const nextUpdateTime = dayjs(weatherData.lastUpdated).add(20, 'minute');
      if (dayjs().isAfter(nextUpdateTime)) {
        clearData('coordinates');
        doGeolocation();
      }
    } else {
      doGeolocation();
    }

    // return () => {};
  }, []);

  const [weatherData, setWeatherData] = useLocalStorage('weatherData', null);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    setIsLoading(true);
    if (coordinates) {
      const { lat, lng } = coordinates;
      const getWeatherData = async (latitude, longitude) => {
        const weatherApiurl = `${apiUrl()}/location-and-weather/?lat=${latitude}&lng=${longitude}`;
        const weatherApiData =  await axios
          .get(weatherApiurl)
          .then(response => response.data);
        setWeatherData({
          lastUpdated: dayjs().toString(),
          data: weatherApiData,
        });
        setIsLoading(false);
      };
      if (weatherData && weatherData.lastUpdated) {
        const nextUpdateTime = dayjs(weatherData.lastUpdated).add(20, 'minute');
        if (dayjs().isAfter(nextUpdateTime)) {
          getWeatherData(lat, lng);
        } else {
          setIsLoading(false);
        }
      } else {
        getWeatherData(lat, lng);
      }
    }

    return () => {};
  }, []);

  const [hourlyData, setHourlyData] = useState(null);
  useEffect(() => {
    if (weatherData) {
      const hourly = [];
      const startHour = dayjs().format('m') > 30 ? 1 : 0;
      const numHoursToShow = 4;
      weatherData.data.weather.hourly.data.forEach((hourData, index) => {
        if (index >= startHour && index < (startHour + numHoursToShow)) {
          hourly.push(hourData);
        }
      });
      setHourlyData(hourly);
    }
  }, [weatherData]);

  return (
    <div className="weather-container">
      <div className={isLoading ? 'block text-right mt-4' : 'hidden'}>
        <FontAwesomeIcon icon="spinner" size="2x" fixedWidth pulse className="mr-8" />
        <br />
        loading weather
      </div>
      <span className={isLoading ? 'invisible' : 'visible'}>
        <h4 className="weather-location">{weatherData && weatherData.data ? weatherData.data.location.locationName : ''}</h4>
        <div className="icon-and-temp">
          <Tippy content={weatherData && weatherData.data && weatherData.data.weather ? weatherData.data.weather.currently.summary : ''} placement="left">
            <span>
              <FontAwesomeIcon icon={weatherData && weatherData.data ? getWeatherIcon(weatherData.data.weather.currently.icon) : 'hourglass-half' } fixedWidth className="weather-icon" />
              <strong className="weather-temp">{weatherData && weatherData.data ? ` ${Math.round(weatherData.data.weather.currently.temperature)}${String.fromCharCode(176)}` : ' -- '}</strong>
            </span>
          </Tippy>
          <div className="feels-like-temp">
            {/* Math.round(weatherData.weather.currently.temperature) !== Math.round(weatherData.weather.currently.apparentTemperature) */}
            {weatherData && weatherData.data ? `Feels ${Math.round(weatherData.data.weather.currently.apparentTemperature)}${String.fromCharCode(176)}` : ''}
          </div>
        </div>
        <ul className="flex hourly-forecast">
        {weatherData && weatherData.data && hourlyData && hourlyData.map((hour) => (
          <Tippy
            content={hour ? `${hour.summary} (Feels ${Math.round(hour.apparentTemperature)}${String.fromCharCode(176)})` : ''}
            placement="left"
            key={nanoid(8)}
          >
            <li key={nanoid(8)} className="w-1/4">
              {dayjs.unix(hour.time).format('ha')}<br />
              <FontAwesomeIcon icon={getWeatherIcon(hour.icon)} fixedWidth />
              {` ${Math.round(hour.temperature)}`}&deg;
            </li>
          </Tippy>
        ))}
        </ul>
        <div className={weatherData && hourlyData ? 'powered-by' : 'powered-by hidden'}>
          <a href="https://darksky.net/poweredby/" target="_blank" rel="noopener noreferrer">
            Powered by Dark Sky
          </a>
        </div>
      </span>
    </div>
  );
};

export default Weather;
