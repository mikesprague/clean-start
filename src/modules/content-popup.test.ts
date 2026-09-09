import { describe, expect, it } from 'vitest';

import {
  CONTENT_TYPE_KEYS,
  CONTENT_TYPES,
  getPopupInfo,
} from './content-popup.tsx';

const SUPPORTED_TYPES = [
  'devTo',
  'github',
  'hackerNews',
  'productHunt',
  'reddit',
] as const;

const EXPECTED_INFO = {
  devTo: {
    endpoint: '/dev-to-posts',
    icon: 'dev',
    title: 'Dev.to Recent Posts',
  },
  github: {
    endpoint: '/github-trending-repos',
    icon: 'github',
    title: 'GitHub Trending Repositories',
  },
  hackerNews: {
    endpoint: '/hacker-news-posts',
    icon: 'hacker-news',
    title: 'Hacker News Top Posts',
  },
  productHunt: {
    endpoint: '/product-hunt-posts',
    icon: 'product-hunt',
    title: 'Product Hunt Top Posts',
  },
  reddit: {
    endpoint: '/reddit-posts',
    icon: 'reddit-alien',
    title: 'Reddit Popular Posts',
  },
} as const;

const EXPECTED_DATA_KEYS = {
  devTo: 'devToData',
  github: 'githubData',
  hackerNews: 'hackerNewsData',
  productHunt: 'productHuntData',
  reddit: 'redditData',
} as const;

describe('getPopupInfo', () => {
  it.each(SUPPORTED_TYPES)(
    'returns endpoint, icon and title for %s',
    (type) => {
      expect(getPopupInfo(type)).toMatchObject(EXPECTED_INFO[type]);
    }
  );
});

describe('CONTENT_TYPES config', () => {
  it('supports exactly the five content types', () => {
    expect(CONTENT_TYPE_KEYS).toEqual([
      'devTo',
      'github',
      'hackerNews',
      'productHunt',
      'reddit',
    ]);
  });

  it.each(SUPPORTED_TYPES)(
    'carries a complete entry (endpoint, icon, title, dataKey, cacheTtl) for %s',
    (type) => {
      expect(CONTENT_TYPES[type]).toMatchObject({
        endpoint: EXPECTED_INFO[type].endpoint,
        icon: EXPECTED_INFO[type].icon,
        title: EXPECTED_INFO[type].title,
        dataKey: EXPECTED_DATA_KEYS[type],
        cacheTtl: 60,
      });
    }
  );
});
