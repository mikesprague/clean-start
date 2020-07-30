import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import dompurify from 'dompurify';
import he from 'he';
import React, { Fragment, useEffect, useState } from 'react';
import { apiUrl, getWeatherIcon, initTooltips } from '../modules/helpers';
import './ContentPopup.scss';

const ContentPopup = (props) => {

  const clickHandler = (event) => {
    console.log(props.type);
  };

  const getIcon = (type) => {
    const iconMap = {
      'dev-to': 'dev',
      'github': 'github',
      'hacker-news': 'hacker-news',
      'product-hunt': 'product-hunt',
      'reddit': 'reddit-alien',
    };
    return iconMap[type];
  }

  return (
    <FontAwesomeIcon
      icon={["fab", `${getIcon(props.type)}`]}
      className="content-popup-icon"
      fixedWidth
      onClick={clickHandler}
      data-tippy-content={props.tooltip}
    />
  );
};

export default ContentPopup;
