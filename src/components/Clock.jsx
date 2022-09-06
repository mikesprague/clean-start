import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';

import './Clock.scss';

export const Clock = () => {
  const [dateTime, setDateTime] = useState(dayjs());

  const updateDateTime = () => {
    setDateTime(dayjs());
  };

  useEffect(() => {
    const clockInterval = setInterval(updateDateTime, 1000);

    return () => clearInterval(clockInterval);
  }, []);

  const timeFormatted = () => dayjs(dateTime).format('HH:mm');

  const dateFormatted = () => dayjs(dateTime).format('dddd, MMMM D');

  const greeting = () => {
    const currentHour = dayjs(dateTime).hour();
    let timeOfDayString = 'morning';

    if (currentHour >= 12 && currentHour < 18) {
      timeOfDayString = 'afternoon';
    }

    if (currentHour >= 18 || currentHour <= 3) {
      timeOfDayString = 'evening';
    }

    const currentGreeting = `Good ${timeOfDayString}`;

    return currentGreeting;
  };

  return (
    <div className="clock-container">
      <h2 className="time-container">{timeFormatted()}</h2>
      <h3 className="date-container">{dateFormatted()}</h3>
      <h4 className="greeting-container">{greeting()}</h4>
    </div>
  );
};
