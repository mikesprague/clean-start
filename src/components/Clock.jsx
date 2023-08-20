import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';

import './Clock.scss';

export const Clock = () => {
  const [dateTime, setDateTime] = useState(dayjs());
  const [dateTimeFormat, setDateTimeFormat] = useState('24');

  const updateDateTime = () => {
    setDateTime(dayjs());
  };

  const clickHandler = () => {
    if (dateTimeFormat === '12') {
      setDateTimeFormat('24');
    } else {
      setDateTimeFormat('12');
    }
  };

  useEffect(() => {
    const clockInterval = setInterval(updateDateTime, 1000);

    return () => clearInterval(clockInterval);
  }, []);

  const timeFormatted = () =>
    dayjs(dateTime).format(dateTimeFormat === '12' ? 'h:mma' : 'HH:mm');

  const dateFormatted = () => dayjs(dateTime).format('dddd, MMMM D YYYY');

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
      <h2 className="time-container" onClick={clickHandler}>
        {timeFormatted()}
      </h2>
      <h3 className="date-container">{dateFormatted()}</h3>
      <h4 className="greeting-container">{greeting()}</h4>
    </div>
  );
};

export default Clock;
