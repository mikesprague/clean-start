import { library, dom } from '@fortawesome/fontawesome-svg-core';
import {
  faSun,
  faMoon,
  faCloudRain,
  faSnowflake,
  faWind,
  faSmog,
  faBolt,
  faCloud,
  faCloudSun,
  faCloudMoon,
  faCloudMeatball,
  faCloudShowersHeavy,
  faThermometerHalf,
  faHourglassHalf,
  faCode,
  faTint,
  faMapMarkerAlt,
} from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import dayjs from 'dayjs';
import dompurify from 'dompurify';
import he from 'he';
import React, { useEffect, useState } from 'react';
import relativeTime from 'dayjs/plugin/relativeTime';
import { apiUrl } from '../modules/helpers';
import './Weather.scss';

const Weather = (props) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    // stuff
    return () => {};
  }, []);

  const initIcons = () => {
    library.add(
      faSun,
      faMoon,
      faCloudRain,
      faSnowflake,
      faWind,
      faSmog,
      faBolt,
      faCloud,
      faCloudSun,
      faCloudMoon,
      faCloudMeatball,
      faCloudShowersHeavy,
      faThermometerHalf,
      faHourglassHalf,
      faCode,
      faTint,
      faMapMarkerAlt,
    );
    dom.watch();
  };
  initIcons();

  return (
    <div className="text-right weather-container">
      <span className="weather-tooltip">
        <span className="h3 icon-and-temp"><i className="fas fa-fw fa-hourglass-half weather-icon"></i> <strong className="weather-temp"> -- </strong></span>
        <br />
        <span className="h5 weather-location"> Waiting for Data </span>
        <br />
        <small className="powered-by">
          <a href="https://darksky.net/poweredby/" target="_blank" rel="noopener">
            Powered by <i className="fas fa-fw fa-tint"></i> Dark Sky
          </a>
        </small>
      </span>
    </div>
  );
};

export default Weather;
