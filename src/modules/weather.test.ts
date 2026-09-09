import { describe, expect, it } from 'vitest';

import { getOpenWeatherMapIcon } from '../modules/weather.ts';

describe('getOpenWeatherMapIcon', () => {
  it('maps a clear sky day to the sun icon', () => {
    const weather = { id: 800, description: '', icon: '01d' };

    expect(getOpenWeatherMapIcon(weather)).toBe('sun');
  });

  it('maps a clear sky night to the moon icon', () => {
    const weather = { id: 800, description: '', icon: '01n' };

    expect(getOpenWeatherMapIcon(weather)).toBe('moon');
  });

  it('maps moderate rain to the cloud-rain icon', () => {
    const weather = { id: 501, description: 'moderate rain', icon: '10d' };

    expect(getOpenWeatherMapIcon(weather)).toBe('cloud-rain');
  });

  it('maps heavy intensity rain to the cloud-showers-heavy icon', () => {
    const weather = {
      id: 502,
      description: 'heavy intensity rain',
      icon: '10d',
    };

    expect(getOpenWeatherMapIcon(weather)).toBe('cloud-showers-heavy');
  });

  it('maps scattered clouds day to the cloud-sun icon', () => {
    const weather = { id: 801, description: '', icon: '02d' };

    expect(getOpenWeatherMapIcon(weather)).toBe('cloud-sun');
  });

  it('falls through to the default icon for unknown weather ids', () => {
    const weather = { id: 999, description: '', icon: '00x' };

    expect(getOpenWeatherMapIcon(weather)).toBe('temperature-half');
  });
});
