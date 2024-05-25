import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);
dayjs.extend(timezone);

dayjs.tz.setDefault('America/New_York');

export const setData = (key, data) => {
  const dataToSet = JSON.stringify(data);

  localStorage.setItem(key, dataToSet);
};

export const getData = (key) => {
  const dataToGet = localStorage.getItem(key);

  return JSON.parse(dataToGet);
};

export const clearData = (key) => {
  localStorage.removeItem(key);
};

export const resetData = () => {
  localStorage.clear();
};

export const isCached = (key) => getData(key) !== null;

export const isCacheValid = (key, duration, durationType) => {
  const lastUpdated = getData(key);
  const nextUpdateTime = dayjs(lastUpdated)
    .tz('America/New_York')
    .add(duration, durationType);

  if (
    dayjs().tz('America/New_York').isAfter(nextUpdateTime) ||
    !lastUpdated === null
  ) {
    return false;
  }

  return true;
};
