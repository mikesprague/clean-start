import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import dompurify from 'dompurify';
import he from 'he';
import React, { useEffect, useState } from 'react';
import { apiUrl, getWeatherIcon, initTooltips } from '../modules/helpers';
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

    return () => {};
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

    return () => {};
  }, [coordinates]);

  const [hourlyData, setHourlyData] = useState(null);
  useEffect(() => {
    if (data) {
      const hourly = [];
      data.weather.hourly.data.map((hourData, index) => {
        if (index < 5) {
          hourly.push(hourData);
        }
      });
      setHourlyData(hourly);
    }
  }, [data]);

  initTooltips();

  return (
    <div className="weather-container">
      <h4 className="weather-location">{data ? data.location.locationName : ' Waiting for Data '}</h4>
      <div className="icon-and-temp">
        <FontAwesomeIcon icon={data ? getWeatherIcon(data.weather.currently.icon) : 'hourglass-half' } fixedWidth className="weather-icon" />
        <strong className="weather-temp"> {data ? Math.round(data.weather.currently.temperature) + '' + String.fromCharCode(176) : ' -- '}</strong>
      </div>
      <div className={data ? 'weather-summary' : 'weather-summary hidden'}>
        {data ? data.weather.currently.summary : ''}
        {data && Math.round(data.weather.currently.temperature) !== Math.round(data.weather.currently.apparentTemperature) ? ' (feels ' + Math.round(data.weather.currently.apparentTemperature) + '' + String.fromCharCode(176) + ')' : ''}
      </div>
      <ul className="flex hourly-forecast">
      {data && hourlyData && hourlyData.map((hour, index) => (
        <li className="w-1/5" key={hour.time} data-tippy-content={hour ? hour.summary : ''}>
          {dayjs.unix(hour.time).format('ha')}<br />
          <FontAwesomeIcon icon={getWeatherIcon(hour.icon)} fixedWidth /><br />
          {Math.round(hour.temperature)}&deg;
        </li>
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
