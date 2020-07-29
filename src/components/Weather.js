import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import dayjs from 'dayjs';
import dompurify from 'dompurify';
import he from 'he';
import React, { useEffect, useState } from 'react';
import relativeTime from 'dayjs/plugin/relativeTime';
import { apiUrl, getWeatherIcon } from '../modules/helpers';
import './Weather.scss';

const Weather = (props) => {
  const [coordinates, setCoordinates] = useState(null);
  useEffect(() => {
    async function getPosition(position) {
      console.log('position: ', position);
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
        console.log(weatherData);
        setData(weatherData);
        return weatherData;
      };
      getWeatherData(lat, lng);
  }

    return () => {};
  }, [coordinates]);

  useEffect(() => {
    if (data) {
      // const weatherIcon = document.querySelector('.weather-icon');
      // const newIconClass = getWeatherIcon(data.weather.currently.icon);
      // console.log(weatherIcon, newIconClass);
      // weatherIcon.classList.remove('fa-hourglass-half').add(`newIconClass`);
    }
  }, [data]);

  return (
    <div className="text-right weather-container">
      <span className="weather-tooltip">
        <span className="icon-and-temp">
          <FontAwesomeIcon icon={data ? getWeatherIcon(data.weather.currently.icon) : 'hourglass-half' } fixedWidth className="weather-icon" />
          <strong className="weather-temp"> {data ? Math.round(data.weather.currently.temperature) + '' + String.fromCharCode(176) : ' -- '}</strong>
        </span>
        <br />
        <span className="h5 weather-location">{data ? data.location.locationName : ' Waiting for Data '}</span>
        <br />
        <small className="powered-by">
          <a href="https://darksky.net/poweredby/" target="_blank" rel="noopener">
            Powered by <FontAwesomeIcon icon="tint" fixedWidth /> Dark Sky
          </a>
        </small>
      </span>
    </div>
  );
};

export default Weather;
