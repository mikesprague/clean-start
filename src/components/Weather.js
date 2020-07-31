import axios from 'axios';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import dompurify from 'dompurify';
import he from 'he';
import { nanoid } from 'nanoid';
import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Tippy from '@tippyjs/react';
import { apiUrl } from '../modules/helpers';
import { getWeatherIcon } from '../modules/weather';
import './Weather.scss';

const Weather = (props) => {
  const [coordinates, setCoordinates] = useState(null);
  useEffect(() => {
    async function getPosition(position) {
      setCoordinates({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      })
    }
    async function geolocationError(error) {
      console.error(error);
    }
    async function doGeolocation() {
      const geolocationOptions = {
        enableHighAccuracy: true,
        maximumAge: 3600000 // 1 hour (number of seconds * 1000 milliseconds)
      };
      navigator.geolocation.getCurrentPosition(getPosition, geolocationError, geolocationOptions);
    }
    doGeolocation();
    // return () => {};
  }, []);

  const [data, setData] = useState(null);
  useEffect(() => {
    if (coordinates) {
      const { lat, lng } = coordinates;
      async function getWeatherData (lat, lng) {
        const weatherApiurl = `${apiUrl()}/location-and-weather/?lat=${lat}&lng=${lng}`;
        const weatherData =  await axios.get(weatherApiurl)
          .then((response) => {
            // console.log(response.data);
            return response.data;
          });
        setData(weatherData);
        // return weatherData;
      };
      getWeatherData(lat, lng);
    }
    // return () => {};
  }, [coordinates]);

  const [hourlyData, setHourlyData] = useState(null);
  useEffect(() => {
    if (data) {
      const hourly = [];
      const numHoursToShow = 4;
      data.weather.hourly.data.map((hourData, index) => {
        if (index < numHoursToShow) {
          hourly.push(hourData);
        }
      });
      setHourlyData(hourly);
    }
    // return () => {};
  }, [data]);

  return (
    <div className="weather-container">
      <h4 className="weather-location">{data ? data.location.locationName : '... Loading weather data ...'}</h4>
      <div className={data ? 'icon-and-temp' : 'icon-and-temp hidden'}>
        <Tippy content={data && data.weather ? data.weather.currently.summary : ''} placement="left">
          <span>
            <FontAwesomeIcon icon={data ? getWeatherIcon(data.weather.currently.icon) : 'hourglass-half' } fixedWidth className="weather-icon" />
            <strong className="weather-temp">{data ? Math.round(data.weather.currently.temperature) + '' + String.fromCharCode(176) : ' -- '}</strong>
          </span>
        </Tippy>
        <div className="feels-like-temp">
          {/* Math.round(data.weather.currently.temperature) !== Math.round(data.weather.currently.apparentTemperature) */}
          {data ? 'Feels ' + Math.round(data.weather.currently.apparentTemperature) + '' + String.fromCharCode(176) : ''}
        </div>
      </div>
      <ul className="flex hourly-forecast">
      {data && hourlyData && hourlyData.map((hour, index) => (
        <Tippy
          content={hour ? `${hour.summary} (Feels ${Math.round(hour.apparentTemperature)}${String.fromCharCode(176)})` : ''}
          placement="left"
        >
          <li key={nanoid(8)} className="w-1/4">
            {dayjs.unix(hour.time).format('ha')}<br />
            <FontAwesomeIcon icon={getWeatherIcon(hour.icon)} fixedWidth />
            {' ' + Math.round(hour.temperature)}&deg;
          </li>
        </Tippy>
      ))}
      </ul>
      <div className={data && hourlyData ? 'powered-by' : 'powered-by hidden'}>
        <a href="https://darksky.net/poweredby/" target="_blank" rel="noopener">
          Powered by <FontAwesomeIcon icon="tint" fixedWidth /> Dark Sky
        </a>
      </div>
    </div>

  );
};

export default Weather;
