import dayjs from 'dayjs';

export function setData(key, data) {
  const dataToSet = JSON.stringify(data);
  localStorage.setItem(key, dataToSet);
}

export function getData(key) {
  const dataToGet = localStorage.getItem(key);
  return JSON.parse(dataToGet);
}

export function clearData(key) {
  localStorage.removeItem(key);
}

export function resetData() {
  localStorage.clear();
}

export function isCached(key) {
  return getData(key) !== null;
}

export function isCacheValid(key, duration, durationType) {
  const lastUpdated = getData(key);
  const nextUpdateTime = dayjs(lastUpdated).add(duration, durationType);
  if (dayjs().isAfter(nextUpdateTime) || !lastUpdated === null) {
    return false;
  }
  return true;
}
