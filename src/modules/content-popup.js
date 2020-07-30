import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export const handleReddit = (apiData) => {
  let idx = 0;
  const markup = apiData.map(post => {
    const listItemMarkup = (
      <li key={post.permanlink} className={`list-group-item list-group-item-action text-white ${idx % 2 === 0 ? ' odd' : ''}`}>
        <a href={`${getPopupInfo('reddit').url}${post.permalink}`} target="_blank" rel="noopener">
          <strong>{post.title}</strong>
        </a>
        <br />
        <small>
          <a href={`${getPopupInfo('reddit').url}${post.subreddit}`} target="_blank" rel="noopener">/r/{post.subreddit}</a>
          &nbsp;&nbsp;
          <a href={`${getPopupInfo('reddit').url}${post.author}`} target="_blank" rel="noopener">
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
  const markup = apiData.map(post => {
    const listItemMarkup = (
      <li key={post.permanlink} className={`list-group-item list-group-item-action text-white ${idx % 2 === 0 ? ' odd' : ''}`}>
        <a href={`${getPopupInfo('product-hunt').url}${post.permalink}`} target="_blank" rel="noopener">
          <strong>{post.title}</strong>
        </a>
        <br />
        <small>
          <a href={`${getPopupInfo('product-hunt').url}${post.subreddit}`} target="_blank" rel="noopener">/r/{post.subreddit}</a>
          &nbsp;&nbsp;
          <a href={`${getPopupInfo('product-hunt').url}${post.author}`} target="_blank" rel="noopener">
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

export const handleHackerNews = (apiData) => {
  let idx = 0;
  const markup = apiData.map(post => {
    const listItemMarkup = (
      <li key={post.permanlink} className={`list-group-item list-group-item-action text-white ${idx % 2 === 0 ? ' odd' : ''}`}>
        <a href={`${getPopupInfo('hacker-news').url}${post.permalink}`} target="_blank" rel="noopener">
          <strong>{post.title}</strong>
        </a>
        <br />
        <small>
          <a href={`${getPopupInfo('hacker-news').url}${post.subreddit}`} target="_blank" rel="noopener">/r/{post.subreddit}</a>
          &nbsp;&nbsp;
          <a href={`${getPopupInfo('hacker-news').url}${post.author}`} target="_blank" rel="noopener">
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

export const handleGitHub = (apiData) => {

};

export const handleDevTo = (apiData) => {

};

export const getPopupInfo = (type) => {
  const infoMap = {
    'dev-to': {
      'endpoint': '/dev-to-posts',
      'icon': 'dev',
      'siteName': 'Dev.to',
      'title': 'Dev.to Recent Posts',
      'url': 'https://dev.to',
    },
    'github': {
      'endpoint': '/github-trending-repos',
      'icon': 'github',
      'siteName': 'GitHub',
      'title': 'GitHub Trending Repositories',
      'url': 'https://github.com',
    },
    'hacker-news': {
      'endpoint': '/hacker-news-posts',
      'icon': 'hacker-news',
      'siteName': 'Hacker News',
      'title': 'Hacker News Top Posts',
      'url': 'https://news.ycombinator.com',
    },
    'product-hunt': {
      'endpoint': '/product-hunt-posts',
      'icon': 'product-hunt',
      'siteName': 'Product Hunt',
      'title': 'Product Hunt Top Posts',
      'url': 'https://www.producthunt.com',
    },
    'reddit': {
      'endpoint': '/reddit-posts',
      'icon': 'reddit-alien',
      'siteName': 'Reddit',
      'title': 'Reddit Popular Posts',
      'url': 'https://www.reddit.com',
    },
  };
  return infoMap[type];
};
