import { Container, Text } from '@mantine/core';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { atom, useAtom } from 'jotai';
import React, { useCallback, useEffect, useMemo } from 'react';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault('America/New_York');

const dateTimeAtom = atom(dayjs().tz('America/New_York'));
const dateTimeFormatAtom = atom('24');

export const Clock = () => {
  const [dateTime, setDateTime] = useAtom(dateTimeAtom);
  const [dateTimeFormat, setDateTimeFormat] = useAtom(dateTimeFormatAtom);

  const updateDateTime = useCallback(() => {
    setDateTime(dayjs().tz('America/New_York'));
  }, [setDateTime]);

  const clickHandler = useCallback(() => {
    if (dateTimeFormat === '12') {
      setDateTimeFormat('24');
    } else {
      setDateTimeFormat('12');
    }
  }, [dateTimeFormat, setDateTimeFormat]);

  useEffect(() => {
    const clockInterval = setInterval(updateDateTime, 1000);

    return () => clearInterval(clockInterval);
  }, [updateDateTime]);

  const timeFormatted = useMemo(
    () => dayjs(dateTime).format(dateTimeFormat === '12' ? 'h:mma' : 'HH:mm'),
    [dateTime, dateTimeFormat]
  );

  const dateFormatted = useMemo(
    () => dayjs(dateTime).format('dddd, MMMM D YYYY'),
    [dateTime]
  );

  const greeting = useMemo(() => {
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
  }, [dateTime]);

  return (
    <Container fluid style={{ cursor: 'default' }} ta="center">
      <Text fw={800} onClick={clickHandler} size="9rem" ta="center">
        {timeFormatted}
      </Text>
      <Text
        fw="bold"
        lts="0.025em"
        mt="sm"
        size="1.875rem"
        ta="center"
        tt="uppercase"
      >
        {dateFormatted}
      </Text>
      <Text fw={600} mt="xl" size="5rem" ta="center">{greeting}</Text>
    </Container>
  );
};

export default Clock;
