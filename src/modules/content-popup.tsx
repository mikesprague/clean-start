import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Anchor, Box, Group, List, Text } from '@mantine/core';
import { nanoid } from 'nanoid';

import { appConfig } from './helpers.ts';

export const CONTENT_TYPES = {
  devTo: {
    endpoint: '/dev-to-posts',
    icon: 'dev',
    siteName: 'Dev.to',
    title: 'Dev.to Recent Posts',
    url: 'https://dev.to',
    pageLink: 'https://dev.to',
    dataKey: appConfig.devToDataKey,
    cacheTtl: appConfig.devToCacheTtl,
  },
  github: {
    endpoint: '/github-trending-repos',
    icon: 'github',
    siteName: 'GitHub',
    title: 'GitHub Trending Repositories',
    url: 'https://github.com',
    pageLink: 'https://github.com/trending?spoken_language_code=en',
    dataKey: appConfig.githubDataKey,
    cacheTtl: appConfig.githubCacheTtl,
  },
  hackerNews: {
    endpoint: '/hacker-news-posts',
    icon: 'hacker-news',
    siteName: 'Hacker News',
    title: 'Hacker News Top Posts',
    url: 'https://news.ycombinator.com',
    pageLink: 'https://news.ycombinator.com',
    dataKey: appConfig.hackerNewsDataKey,
    cacheTtl: appConfig.hackerNewsCacheTtl,
  },
  productHunt: {
    endpoint: '/product-hunt-posts',
    icon: 'product-hunt',
    siteName: 'Product Hunt',
    title: 'Product Hunt Top Posts',
    url: 'https://www.producthunt.com',
    pageLink: 'https://www.producthunt.com',
    dataKey: appConfig.productHuntDataKey,
    cacheTtl: appConfig.productHuntCacheTtl,
  },
  reddit: {
    endpoint: '/reddit-posts',
    icon: 'reddit-alien',
    siteName: 'Reddit',
    title: 'Reddit Popular Posts',
    url: 'https://www.reddit.com',
    pageLink: 'https://www.reddit.com/r/popular',
    dataKey: appConfig.redditDataKey,
    cacheTtl: appConfig.redditCacheTtl,
  },
};

export const CONTENT_TYPE_KEYS = Object.keys(CONTENT_TYPES) as Array<
  keyof typeof CONTENT_TYPES
>;

export const getPopupInfo = (type) => CONTENT_TYPES[type];

export const handleReddit = (apiData) => {
  const items = Array.isArray(apiData) ? apiData.filter(Boolean) : [];
  let idx = 0;
  const markup = items.map((post) => {
    const listItemMarkup = (
      <List.Item
        key={nanoid(8)}
        bg={
          idx % 2 === 0
            ? 'var(--mantine-color-dark-9)'
            : 'var(--mantine-color-black)'
        }
        c='white'
        display='flex'
        p='xs'
      >
        <Anchor
          c='white'
          href={`${getPopupInfo('reddit').url}${post.permalink}`}
          size='sm'
          target='_blank'
          rel='noopener noreferrer'
        >
          <strong>{post.title}</strong>
        </Anchor>
        <br />
        <Anchor
          c='white'
          fw={300}
          href={`${getPopupInfo('reddit').url}${post.subreddit}`}
          size='xs'
          target='_blank'
          rel='noopener noreferrer'
        >
          /r/{post.subreddit}
        </Anchor>
        &nbsp;&nbsp;
        <Anchor
          c='white'
          fw={300}
          href={`${getPopupInfo('reddit').url}${post.author}`}
          size='xs'
          target='_blank'
          rel='noopener noreferrer'
        >
          <FontAwesomeIcon icon='user' fixedWidth /> {post.author}
        </Anchor>
      </List.Item>
    );

    idx += 1;

    return listItemMarkup;
  });

  return markup || [];
};

const RSS_FIELDS = {
  productHunt: { titleKey: 'title', linkKey: 'link', pubDateKey: 'pubDate' },
  hackerNews: { titleKey: 'title', linkKey: 'link', pubDateKey: 'pubDate' },
  devTo: {
    titleKey: 'title',
    linkKey: 'link',
    pubDateKey: 'pubDate',
    authorKey: 'author',
  },
};

export const renderListItems = (apiData, type) => {
  const fields = RSS_FIELDS[type];
  const items = Array.isArray(apiData) ? apiData.filter(Boolean) : [];
  let idx = 0;
  const markup = items.map((post) => {
    const listItemMarkup = (
      <List.Item
        key={nanoid(8)}
        bg={
          idx % 2 === 0
            ? 'var(--mantine-color-dark-9)'
            : 'var(--mantine-color-black)'
        }
        c='white'
        display='flex'
        p='xs'
      >
        <Anchor
          c='white'
          href={`${post[fields.linkKey]}`}
          size='sm'
          target='_blank'
          rel='noopener noreferrer'
        >
          <strong>{post[fields.titleKey]}</strong>
        </Anchor>
        <br />
        <Text fw={300} size='xs'>
          {fields.authorKey ? (
            <>
              <FontAwesomeIcon icon='user' fixedWidth />{' '}
              {post[fields.authorKey]}
              <br />
            </>
          ) : null}
          <FontAwesomeIcon icon='calendar' fixedWidth />{' '}
          {post[fields.pubDateKey]}
        </Text>
      </List.Item>
    );

    idx += 1;

    return listItemMarkup;
  });

  return markup || [];
};

export const handleGitHub = (apiData) => {
  const items = Array.isArray(apiData) ? apiData.filter(Boolean) : [];
  let idx = 0;
  const reposMarkup = items.map((repo) => {
    const {
      title,
      description,
      stars,
      starsLink,
      forks,
      forksLink,
      starsToday,
      languageStyle,
      languageName,
      link,
    } = repo;
    const styles = languageStyle
      ? {
          backgroundColor: languageStyle.replace('background-color: ', ''),
          borderRadius: '50%',
          verticalAlign: 'middle',
        }
      : {
          borderRadius: '50%',
          verticalAlign: 'middle',
        };
    // console.log(styles);
    const languageMarkup = languageName ? (
      <>
        <Text key={nanoid(8)} c='white' fw={300} size='xs'>
          <Box
            display='inline-block'
            h='.75rem'
            mr='.25rem'
            style={styles}
            w='.75rem'
          />
          {languageName}
        </Text>{' '}
      </>
    ) : (
      ''
    );
    const starsMarkup = (stars ?? '').trim().length ? (
      <>
        <Anchor
          key={nanoid(8)}
          c='white'
          fw={300}
          href={starsLink}
          size='xs'
          target='_blank'
          rel='noopener noreferrer'
        >
          <FontAwesomeIcon icon='star' />
          {repo.stars}
        </Anchor>{' '}
      </>
    ) : (
      ''
    );
    const forksMarkup = (forks ?? '').trim().length ? (
      <Anchor key={nanoid(8)} c='white' fw={300} href={forksLink} size='xs'>
        <FontAwesomeIcon icon='share-alt' rotate={270} /> {repo.forks}
        {''}
      </Anchor>
    ) : (
      ''
    );
    const listItemMarkup = (
      <List.Item
        key={nanoid(8)}
        bg={
          idx % 2 === 0
            ? 'var(--mantine-color-dark-9)'
            : 'var(--mantine-color-black)'
        }
        c='white'
        display='flex'
        p='xs'
      >
        <Anchor
          c='white'
          href={link}
          size='sm'
          target='_blank'
          rel='noopener noreferrer'
        >
          {title}
        </Anchor>
        <br />
        <Text fw={300} size='sm'>
          {description}
        </Text>
        <Group gap='xs' grow={false}>
          {languageMarkup}
          {starsMarkup}
          {forksMarkup}
          <Text c='white' fw={300} size='xs' ta='right'>
            <FontAwesomeIcon icon='star' /> {starsToday}
          </Text>
        </Group>
      </List.Item>
    );

    idx += 1;

    return listItemMarkup;
  });

  return reposMarkup || [];
};
