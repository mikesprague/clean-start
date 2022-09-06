import dayjs from 'dayjs';

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
  const nextUpdateTime = dayjs(lastUpdated).add(duration, durationType);

  if (dayjs().isAfter(nextUpdateTime) || !lastUpdated === null) {
    return false;
  }

  return true;
};
