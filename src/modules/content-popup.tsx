import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Anchor, Box, Group, List, Text } from '@mantine/core';
import { nanoid } from 'nanoid';
import type React from 'react';

export const getPopupInfo = (type) => {
  const infoMap = {
    devTo: {
      endpoint: '/dev-to-posts',
      icon: 'dev',
      siteName: 'Dev.to',
      title: 'Dev.to Recent Posts',
      url: 'https://dev.to',
      pageLink: 'https://dev.to',
    },
    github: {
      endpoint: '/github-trending-repos',
      icon: 'github',
      siteName: 'GitHub',
      title: 'GitHub Trending Repositories',
      url: 'https://github.com',
      pageLink: 'https://github.com/trending?spoken_language_code=en',
    },
    hackerNews: {
      endpoint: '/hacker-news-posts',
      icon: 'hacker-news',
      siteName: 'Hacker News',
      title: 'Hacker News Top Posts',
      url: 'https://news.ycombinator.com',
      pageLink: 'https://news.ycombinator.com',
    },
    productHunt: {
      endpoint: '/product-hunt-posts',
      icon: 'product-hunt',
      siteName: 'Product Hunt',
      title: 'Product Hunt Top Posts',
      url: 'https://www.producthunt.com',
      pageLink: 'https://www.producthunt.com',
    },
    reddit: {
      endpoint: '/reddit-posts',
      icon: 'reddit-alien',
      siteName: 'Reddit',
      title: 'Reddit Popular Posts',
      url: 'https://www.reddit.com',
      pageLink: 'https://www.reddit.com/r/popular',
    },
  };

  return infoMap[type];
};

export const handleReddit = (apiData) => {
  let idx = 0;
  const markup = apiData.map((post) => {
    const listItemMarkup = (
      <List.Item
        key={nanoid(8)}
        bg={
          idx % 2 === 0
            ? 'var(--mantine-color-dark-9)'
            : 'var(--mantine-color-black)'
        }
        c="white"
        display="flex"
        p="xs"
      >
        <Anchor
          c="white"
          href={`${getPopupInfo('reddit').url}${post.permalink}`}
          size="sm"
          target="_blank"
          rel="noopener noreferrer"
        >
          <strong>{post.title}</strong>
        </Anchor>
        <br />
        <Anchor
          c="white"
          fw={300}
          href={`${getPopupInfo('reddit').url}${post.subreddit}`}
          size="xs"
          target="_blank"
          rel="noopener noreferrer"
        >
          /r/{post.subreddit}
        </Anchor>
        &nbsp;&nbsp;
        <Anchor
          c="white"
          fw={300}
          href={`${getPopupInfo('reddit').url}${post.author}`}
          size="xs"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FontAwesomeIcon icon="user" fixedWidth /> {post.author}
        </Anchor>
      </List.Item>
    );

    idx += 1;

    return listItemMarkup;
  });

  return markup || [];
};

export const handleProductHunt = (apiData) => {
  let idx = 0;
  const markup = apiData.map((post) => {
    const listItemMarkup = (
      <List.Item
        key={nanoid(8)}
        bg={
          idx % 2 === 0
            ? 'var(--mantine-color-dark-9)'
            : 'var(--mantine-color-black)'
        }
        c="white"
        display="flex"
        p="xs"
      >
        <Anchor
          c="white"
          href={`${post.link}`}
          size="sm"
          target="_blank"
          rel="noopener noreferrer"
        >
          <strong>{post.title}</strong>
        </Anchor>
        <br />
        <Text fw={300} size="xs">
          <FontAwesomeIcon icon="calendar" fixedWidth /> {post.pubDate}
        </Text>
      </List.Item>
    );

    idx += 1;

    return listItemMarkup;
  });

  return markup || [];
};

export const handleHackerNews = (apiData) => {
  let idx = 0;
  const markup = apiData.map((post) => {
    const listItemMarkup = (
      <List.Item
        key={nanoid(8)}
        bg={
          idx % 2 === 0
            ? 'var(--mantine-color-dark-9)'
            : 'var(--mantine-color-black)'
        }
        c="white"
        display="flex"
        p="xs"
      >
        <Anchor
          c="white"
          href={`${post.link}`}
          size="sm"
          target="_blank"
          rel="noopener noreferrer"
        >
          <strong>{post.title}</strong>
        </Anchor>
        <br />
        <Text fw={300} size="xs">
          <FontAwesomeIcon icon="calendar" fixedWidth /> {post.pubDate}
        </Text>
      </List.Item>
    );

    idx += 1;

    return listItemMarkup;
  });

  return markup || [];
};

// return jsx markup
export const handleDevTo = (apiData): React.FC => {
  let idx = 0;
  const markup = apiData.map((post) => {
    const listItemMarkup = (
      <List.Item
        key={nanoid(8)}
        bg={
          idx % 2 === 0
            ? 'var(--mantine-color-dark-9)'
            : 'var(--mantine-color-black)'
        }
        c="white"
        display="flex"
        p="xs"
      >
        <Anchor
          c="white"
          href={`${post.link}`}
          size="sm"
          target="_blank"
          rel="noopener noreferrer"
        >
          <strong>{post.title}</strong>
        </Anchor>
        <br />
        <Text fw={300} size="xs">
          <FontAwesomeIcon icon="user" fixedWidth /> {post.author}
          <br />
          <FontAwesomeIcon icon="calendar" fixedWidth /> {post.pubDate}
        </Text>
      </List.Item>
    );

    idx += 1;

    return listItemMarkup;
  });

  return markup || [];
};

export const handleGitHub = (apiData) => {
  let idx = 0;
  const reposMarkup = apiData.map((repo) => {
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
        <Text key={nanoid(8)} c="white" fw={300} size="xs">
          <Box
            display="inline-block"
            h=".75rem"
            mr=".25rem"
            style={styles}
            w=".75rem"
          />
          {languageName}
        </Text>{' '}
      </>
    ) : (
      ''
    );
    const starsMarkup = stars.trim().length ? (
      <>
        <Anchor
          key={nanoid(8)}
          c="white"
          fw={300}
          href={starsLink}
          size="xs"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FontAwesomeIcon icon="star" />
          {repo.stars}
        </Anchor>{' '}
      </>
    ) : (
      ''
    );
    const forksMarkup = forks.trim().length ? (
      <Anchor key={nanoid(8)} c="white" fw={300} href={forksLink} size="xs">
        <FontAwesomeIcon icon="share-alt" rotate={270} /> {repo.forks}{''}
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
        c="white"
        display="flex"
        p="xs"
      >
        <Anchor
          c="white"
          href={link}
          size="sm"
          target="_blank"
          rel="noopener noreferrer"
        >
          {title}
        </Anchor>
        <br />
        <Text fw={300} size="sm">{description}</Text>
        <Group gap="xs" grow={false}>
          {languageMarkup}
          {starsMarkup}
          {forksMarkup}
          <Text c="white" fw={300} size="xs" ta="right">
            <FontAwesomeIcon icon="star" /> {starsToday}
          </Text>
        </Group>
      </List.Item>
    );

    idx += 1;

    return listItemMarkup;
  });

  return reposMarkup || [];
};
