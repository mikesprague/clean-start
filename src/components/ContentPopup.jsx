import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Tippy from '@tippyjs/react';
import axios from 'axios';
import dayjs from 'dayjs';
import { nanoid } from 'nanoid';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import useLocalStorageState from 'use-local-storage-state';

import {
  getPopupInfo,
  handleDevTo,
  handleGitHub,
  handleHackerNews,
  handleProductHunt,
  handleReddit,
} from '../modules/content-popup';
import { apiUrl } from '../modules/helpers';

import './ContentPopup.scss';

export const ContentPopup = ({ type }) => {
  const [data, setData] = useLocalStorageState(`${type}Data`, {
    defaultValue: null,
  });

  useEffect(() => {
    switch (type) {
      case 'dev-to': {
        const getDevToPosts = async (devToUrl = `${apiUrl()}/dev-to-posts`) => {
          const devToData = await axios
            .get(devToUrl)
            .then((response) => response.data);
          const returnData = [];
          // limit to 10 items

          for (let i = 0; i < 10; i += 1) {
            returnData.push(devToData[i]);
          }

          setData({
            lastUpdated: dayjs().toString(),
            data: returnData,
          });
        };

        if (data?.lastUpdated) {
          const nextUpdateTime = dayjs(data.lastUpdated).add(60, 'minute');

          if (dayjs().isAfter(nextUpdateTime)) {
            getDevToPosts();
          }
        } else {
          getDevToPosts();
        }

        break;
      }
      case 'github': {
        const getTrendingRepos = async (
          dataUrl = `${apiUrl()}/github-trending-repos`
        ) => {
          const returnData = [];

          await axios.get(dataUrl).then((response) => {
            // limit to 10 items
            for (let i = 0; i < 10; i += 1) {
              returnData.push(response.data[i]);
            }
          });
          setData({
            lastUpdated: dayjs().toString(),
            data: returnData,
          });
        };

        if (data?.lastUpdated) {
          const nextUpdateTime = dayjs(data.lastUpdated).add(60, 'minute');

          if (dayjs().isAfter(nextUpdateTime)) {
            getTrendingRepos();
          }
        } else {
          getTrendingRepos();
        }

        break;
      }
      case 'hacker-news': {
        const getHackerNewsPosts = async (
          hackerNewsUrl = `${apiUrl()}/hacker-news-posts`
        ) => {
          const hackerNewsData = await axios
            .get(hackerNewsUrl)
            .then((response) => response.data);
          const returnData = [];
          // limit to 10 items

          for (let i = 0; i < 10; i += 1) {
            returnData.push(hackerNewsData[i]);
          }

          setData({
            lastUpdated: dayjs().toString(),
            data: returnData,
          });
        };

        if (data?.lastUpdated) {
          const nextUpdateTime = dayjs(data.lastUpdated).add(60, 'minute');

          if (dayjs().isAfter(nextUpdateTime)) {
            getHackerNewsPosts();
          }
        } else {
          getHackerNewsPosts();
        }

        break;
      }
      case 'product-hunt': {
        const getProductHuntPosts = async (
          productHuntRssUrl = `${apiUrl()}/product-hunt-posts`
        ) => {
          const productHuntData = await axios
            .get(productHuntRssUrl)
            .then((response) => response.data);
          const returnData = [];
          // limit to 10 items

          for (let i = 0; i < 10; i += 1) {
            returnData.push(productHuntData[i]);
          }

          setData({
            lastUpdated: dayjs().toString(),
            data: returnData,
          });
        };

        if (data?.lastUpdated) {
          const nextUpdateTime = dayjs(data.lastUpdated).add(60, 'minute');

          if (dayjs().isAfter(nextUpdateTime)) {
            getProductHuntPosts();
          }
        } else {
          getProductHuntPosts();
        }

        break;
      }
      case 'reddit': {
        const getRedditPosts = async (
          redditPostsApiUrl = `${apiUrl()}/reddit-posts`
        ) => {
          const returnData = await axios
            .get(redditPostsApiUrl)
            .then((response) => response.data);

          setData({
            lastUpdated: dayjs().toString(),
            data: returnData,
          });
        };

        if (data?.lastUpdated) {
          const nextUpdateTime = dayjs(data.lastUpdated).add(60, 'minute');

          if (dayjs().isAfter(nextUpdateTime)) {
            getRedditPosts();
          }
        } else {
          getRedditPosts();
        }

        break;
      }
      default: {
        break;
      }
    }
  }, [data, setData, type]);

  const [postsMarkup, setPostsMarkup] = useState(null);

  useEffect(() => {
    let markup = null;

    if (data?.data?.length && data?.data[0] !== null) {
      switch (type) {
        case 'dev-to':
          markup = handleDevTo(data.data);
          setPostsMarkup(markup);
          break;
        case 'github':
          markup = handleGitHub(data.data);
          setPostsMarkup(markup);
          break;
        case 'hacker-news':
          markup = handleHackerNews(data.data);
          setPostsMarkup(markup);
          break;
        case 'product-hunt':
          markup = handleProductHunt(data.data);
          setPostsMarkup(markup);
          break;
        case 'reddit':
          markup = handleReddit(data.data);
          setPostsMarkup(markup);
          break;
        default:
          break;
      }
    }
    // return () => {};
  }, [type, data]);

  const [fullMarkup, setFullMarkup] = useState(null);

  useEffect(() => {
    const buildPopup = () => (
      <ul className="list-group posts-container">
        <li key={nanoid(8)} className="list-group-item list-group-item-heading">
          <h5 className="text-xl font-medium">
            <FontAwesomeIcon
              icon={['fab', `${getPopupInfo(type).icon}`]}
              fixedWidth
            />{' '}
            {getPopupInfo(type).title}
            &nbsp;&nbsp;
            <small className="font-thin">
              <a
                href={getPopupInfo(type).pageLink}
                title={`View on ${getPopupInfo(type).title}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <FontAwesomeIcon icon="external-link-alt" fixedWidth /> View on{' '}
                {getPopupInfo(type).siteName}
              </a>
            </small>
          </h5>
        </li>
        {postsMarkup ?? ''}
      </ul>
    );
    const markup = buildPopup();

    setFullMarkup(markup);

    // return () => {};
  }, [postsMarkup, type]);

  return (
    <Tippy
      interactive={true}
      maxWidth="none"
      trigger="click"
      content={fullMarkup}
    >
      <Tippy placement="left" content={getPopupInfo(type).title}>
        <div className={`${type}-popup inline-block`}>
          <FontAwesomeIcon
            icon={['fab', `${getPopupInfo(type).icon}`]}
            className="content-popup-icon"
            fixedWidth
          />
        </div>
      </Tippy>
    </Tippy>
  );
};

ContentPopup.displayName = 'ContentPopup';
ContentPopup.propTypes = {
  type: PropTypes.string.isRequired,
};

export default ContentPopup;
