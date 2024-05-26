import type { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Anchor, Box, Group, Text, Title, Tooltip } from '@mantine/core';
import axios from 'axios';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { atom, useAtom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { nanoid } from 'nanoid';
import { useEffect } from 'react';

import { apiUrl, isCacheExpired } from '../modules/helpers';
import { clearData } from '../modules/local-storage';
import { getOpenWeatherMapIcon } from '../modules/weather';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault('America/New_York');

interface HourlyWeatherData {
  dt: number;
  temp: number;
  feels_like: number;
  weather: {
    description: string;
  };
}

interface CurrentWeatherData {
  temp: number;
  feels_like: number;
  weather: {
    description: string;
  };
}

interface WeatherApiData {
  weather: {
    current: CurrentWeatherData;
    hourly: HourlyWeatherData[];
  };
  location: {
    locationName: string;
  };
}

interface WeatherData {
  lastUpdated: string;
  data: WeatherApiData;
}

const weatherDataAtom = atomWithStorage('weatherData', {
  lastUpdated: '',
  data: {} as WeatherApiData,
} as WeatherData);

const isLoadingAtom = atom(false);
const hourlyDataAtom = atom([] as HourlyWeatherData[]);

export const Weather = () => {
  const [weatherData, setWeatherData] = useAtom(weatherDataAtom);
  const [isLoading, setIsLoading] = useAtom(isLoadingAtom);
  const [hourlyData, setHourlyData] = useAtom(hourlyDataAtom);

  useEffect(() => {
    const getWeatherData = async () => {
      setIsLoading(true);
      const weatherApiUrl = `${apiUrl()}/location-and-weather`;

      const weatherApiData: WeatherApiData = await axios
        .get(weatherApiUrl)
        .then((response) => response.data);

      setWeatherData({
        lastUpdated: dayjs().tz('America/New_York').toISOString(),
        data: weatherApiData,
      });

      setIsLoading(false);
    };

    if (weatherData?.lastUpdated) {
      if (isCacheExpired(weatherData.lastUpdated, 10)) {
        clearData('weatherData');
        getWeatherData();
      }
    } else {
      clearData('weatherData');
      getWeatherData();
    }

    // return() => {};
  }, [setIsLoading, setWeatherData, weatherData]);

  useEffect(() => {
    if (weatherData?.data?.weather?.hourly) {
      const hourly: HourlyWeatherData[] = [];
      const startHour =
        Number(dayjs().tz('America/New_York').format('m')) > 30 ? 1 : 0;
      const numHoursToShow = 4;

      let index = 0;
      for (const hourData of weatherData.data.weather.hourly) {
        if (index >= startHour && index < startHour + numHoursToShow) {
          hourly.push(hourData);
        }
        index += 1;
      }
      setHourlyData(hourly);
    }

    // return () => {};
  }, [setHourlyData, weatherData]);

  return weatherData?.data ? (
    <Box style={{ cursor: 'default' }} ta="right">
      <Box hidden={!isLoading}>
        <FontAwesomeIcon
          icon="spinner"
          size="2x"
          fixedWidth
          pulse
          style={{ marginRight: '0.5rem' }}
        />
        <br />
        loading weather
      </Box>
      <Box hidden={isLoading}>
        <Title order={3} size="h3">
          {weatherData?.data ? weatherData.data?.location?.locationName : ''}
        </Title>
        <Box>
          <Tooltip
            label={
              weatherData?.data?.weather
                ? weatherData.data?.weather?.current?.weather[0].description
                : ''
            }
            position="left"
          >
            <Text component="span" fw="bolder" size="2.25rem">
              <FontAwesomeIcon
                icon={
                  weatherData?.data?.weather?.current
                    ? (getOpenWeatherMapIcon(
                        weatherData.data?.weather?.current?.weather[0]
                      ) as IconProp)
                    : ('hourglass-half' as IconProp)
                }
                fixedWidth
                style={{ fontWeight: 'bolder' }}
              />
              {weatherData?.data?.weather?.current
                ? ` ${Math.round(
                    weatherData.data?.weather?.current?.temp
                  )}${String.fromCharCode(176)}`
                : ' -- '}
            </Text>
          </Tooltip>
          <Text fw="normal" mt="-.25rem" size="md">
            {/* Math.round(weatherData.weather.currently.temperature) !== Math.round(weatherData.weather.currently.apparentTemperature) */}
            {weatherData?.data?.weather?.current
              ? `Feels ${Math.round(
                  weatherData.data.weather.current.feels_like
                )}${String.fromCharCode(176)}`
              : ''}
          </Text>
        </Box>
        <Group ta="right" justify="end" gap="xs">
          {weatherData?.data &&
            hourlyData &&
            hourlyData.map((hour) => (
              <Box key={nanoid(8)}>
                <Tooltip
                  label={
                    hour
                      ? `${hour.weather[0].description} (Feels ${Math.round(
                          hour.feels_like
                        )}${String.fromCharCode(176)})`
                      : ''
                  }
                  position="left"
                >
                  <Text size="sm">
                    {dayjs.unix(hour.dt).format('ha')}
                    <br />
                    <FontAwesomeIcon
                      icon={getOpenWeatherMapIcon(hour.weather[0]) as IconProp}
                      fixedWidth
                    />
                    {` ${Math.round(hour.temp)}`}&deg;
                  </Text>
                </Tooltip>
              </Box>
            ))}
        </Group>
        <Box hidden={!(weatherData && hourlyData)}>
          <Anchor
            c="white"
            fw="lighter"
            href="https://openweathermap.org/api/"
            target="_blank"
            rel="noopener noreferrer"
            size="xs"
          >
            Powered by OpenWeatherMap
          </Anchor>
        </Box>
      </Box>
    </Box>
  ) : null;
};

export default Weather;
