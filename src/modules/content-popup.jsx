import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { nanoid } from 'nanoid';

export const getPopupInfo = (type) => {
  const infoMap = {
    'dev-to': {
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
    'hacker-news': {
      endpoint: '/hacker-news-posts',
      icon: 'hacker-news',
      siteName: 'Hacker News',
      title: 'Hacker News Top Posts',
      url: 'https://news.ycombinator.com',
      pageLink: 'https://news.ycombinator.com',
    },
    'product-hunt': {
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
      <li
        key={nanoid(8)}
        className={`list-group-item list-group-item-action text-white ${
          idx % 2 === 0 ? ' odd' : ''
        }`}
      >
        <a
          href={`${getPopupInfo('reddit').url}${post.permalink}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <strong>{post.title}</strong>
        </a>
        <br />
        <small>
          <a
            href={`${getPopupInfo('reddit').url}${post.subreddit}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            /r/{post.subreddit}
          </a>
          &nbsp;&nbsp;
          <a
            href={`${getPopupInfo('reddit').url}${post.author}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <FontAwesomeIcon icon="user" fixedWidth /> {post.author}
          </a>
        </small>
      </li>
    );

    idx += 1;

    return listItemMarkup;
  });

  return markup;
};

export const handleProductHunt = (apiData) => {
  let idx = 0;
  const markup = apiData.map((post) => {
    const listItemMarkup = (
      <li
        key={nanoid(8)}
        className={`list-group-item list-group-item-action text-white ${
          idx % 2 === 0 ? ' odd' : ''
        }`}
      >
        <a href={`${post.link}`} target="_blank" rel="noopener noreferrer">
          <strong>{post.title}</strong>
        </a>
        <br />
        <small>
          <FontAwesomeIcon icon="calendar" fixedWidth /> {post.published}
        </small>
      </li>
    );

    idx += 1;

    return listItemMarkup;
  });

  return markup;
};

export const handleHackerNews = (apiData) => {
  let idx = 0;
  const markup = apiData.map((post) => {
    const listItemMarkup = (
      <li
        key={nanoid(8)}
        className={`list-group-item list-group-item-action text-white ${
          idx % 2 === 0 ? ' odd' : ''
        }`}
      >
        <a href={`${post.link}`} target="_blank" rel="noopener noreferrer">
          <strong>{post.title}</strong>
        </a>
        <br />
        <small>
          <FontAwesomeIcon icon="calendar" fixedWidth /> {post.pubDate}
        </small>
      </li>
    );

    idx += 1;

    return listItemMarkup;
  });

  return markup;
};

export const handleDevTo = (apiData) => {
  let idx = 0;
  const markup = apiData.map((post) => {
    const listItemMarkup = (
      <li
        key={nanoid(8)}
        className={`list-group-item list-group-item-action text-white ${
          idx % 2 === 0 ? ' odd' : ''
        }`}
      >
        <a href={`${post.link}`} target="_blank" rel="noopener noreferrer">
          <strong>{post.title}</strong>
        </a>
        <br />
        <small>
          <FontAwesomeIcon icon="user" fixedWidth /> {post.author}
          <br />
          <FontAwesomeIcon icon="calendar" fixedWidth /> {post.pubDate}
        </small>
      </li>
    );

    idx += 1;

    return listItemMarkup;
  });

  return markup;
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
      ? { backgroundColor: languageStyle.replace('background-color: ', '') }
      : '';
    // console.log(styles);
    const languageMarkup = languageName ? (
      <>
        <span className="repo-language-color" style={styles} />
        {languageName} &nbsp;&nbsp;
      </>
    ) : (
      ''
    );
    const starsMarkup = stars.trim().length ? (
      <>
        <a href={starsLink} target="_blank" rel="noopener noreferrer">
          <FontAwesomeIcon icon="star" />
          {repo.stars}
        </a>{' '}
        &nbsp;&nbsp;
      </>
    ) : (
      ''
    );
    const forksMarkup = forks.trim().length ? (
      <a href={forksLink}>
        <FontAwesomeIcon icon="share-alt" rotate={270} /> {repo.forks}
      </a>
    ) : (
      ''
    );
    const listItemMarkup = (
      <li
        key={nanoid(8)}
        className={`list-group-item list-group-item-action ${
          idx % 2 === 0 ? 'odd' : ''
        } text-white`}
      >
        <a href={link} target="_blank" rel="noopener noreferrer">
          <strong>{title}</strong>
        </a>
        <br />
        {description}
        <div className="flex">
          <div className="w-1/2 text-left">
            <small>
              {languageMarkup}
              {starsMarkup}
              {forksMarkup}
            </small>
          </div>
          <div className="w-1/2 text-right">
            <small>
              <FontAwesomeIcon icon="star" /> {starsToday}
            </small>
          </div>
        </div>
      </li>
    );

    idx += 1;

    return listItemMarkup;
  });

  return reposMarkup;
};
