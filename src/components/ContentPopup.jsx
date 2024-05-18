import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Tippy from '@tippyjs/react';
import axios from 'axios';
import dayjs from 'dayjs';
import { atom, useAtom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { nanoid } from 'nanoid';
import PropTypes from 'prop-types';
import React, { useCallback, useEffect } from 'react';

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

const hackerNewsDataAtom = atomWithStorage('hackerNewsData', null);
const devToDataAtom = atomWithStorage('devToData', null);
const productHuntDataAtom = atomWithStorage('productHuntData', null);
const redditDataAtom = atomWithStorage('redditData', null);
const githubDataAtom = atomWithStorage('githubData', null);
const postsMarkupAtom = atom(null);
const devToMarkupAtom = atom(null);
const githubMarkupAtom = atom(null);
const hackerNewsMarkupAtom = atom(null);
const productHuntMarkupAtom = atom(null);
const redditMarkupAtom = atom(null);
const githubPostsMarkupAtom = atom(null);
const devToPostsMarkupAtom = atom(null);
const hackerNewsPostsMarkupAtom = atom(null);
const productHuntPostsMarkupAtom = atom(null);
const redditPostsMarkupAtom = atom(null);

export const ContentPopup = ({ type }) => {
  const [hackerNewsData, setHackerNewsData] = useAtom(hackerNewsDataAtom);
  const [devToData, setDevToData] = useAtom(devToDataAtom);
  const [productHuntData, setProductHuntData] = useAtom(productHuntDataAtom);
  const [redditData, setRedditData] = useAtom(redditDataAtom);
  const [githubData, setGithubData] = useAtom(githubDataAtom);

  const [githubPostsMarkup, setGithubPostsMarkup] = useAtom(
    githubPostsMarkupAtom
  );
  const [devToPostsMarkup, setDevToPostsMarkup] = useAtom(devToPostsMarkupAtom);
  const [hackerNewsPostsMarkup, setHackerNewsPostsMarkup] = useAtom(
    hackerNewsPostsMarkupAtom
  );
  const [productHuntPostsMarkup, setProductHuntPostsMarkup] = useAtom(
    productHuntPostsMarkupAtom
  );
  const [redditPostsMarkup, setRedditPostsMarkup] = useAtom(
    redditPostsMarkupAtom
  );

  const [githubMarkup, setGithubMarkup] = useAtom(githubMarkupAtom);
  const [devToMarkup, setDevToMarkup] = useAtom(devToMarkupAtom);
  const [hackerNewsMarkup, setHackerNewsMarkup] = useAtom(hackerNewsMarkupAtom);
  const [productHuntMarkup, setProductHuntMarkup] = useAtom(
    productHuntMarkupAtom
  );
  const [redditMarkup, setRedditMarkup] = useAtom(redditMarkupAtom);

  useEffect(() => {
    switch (type) {
      case 'devTo': {
        const getDevToPosts = async (devToUrl = `${apiUrl()}/dev-to-posts`) => {
          const devToData = await axios
            .get(devToUrl)
            .then((response) => response.data);
          const returnData = [];
          // limit to 10 items

          for (let i = 0; i < 10; i += 1) {
            returnData.push(devToData[i]);
          }

          setDevToData({
            lastUpdated: dayjs().toString(),
            data: returnData,
          });
        };

        if (devToData?.lastUpdated) {
          const nextUpdateTime = dayjs(devToData.lastUpdated).add(60, 'minute');

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
          setGithubData({
            lastUpdated: dayjs().toString(),
            data: returnData,
          });
        };

        if (githubData?.lastUpdated) {
          const nextUpdateTime = dayjs(githubData.lastUpdated).add(
            60,
            'minute'
          );

          if (dayjs().isAfter(nextUpdateTime)) {
            getTrendingRepos();
          }
        } else {
          getTrendingRepos();
        }

        break;
      }
      case 'hackerNews': {
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

          setHackerNewsData({
            lastUpdated: dayjs().toString(),
            data: returnData,
          });
        };

        if (hackerNewsData?.lastUpdated) {
          const nextUpdateTime = dayjs(hackerNewsData.lastUpdated).add(
            60,
            'minute'
          );

          if (dayjs().isAfter(nextUpdateTime)) {
            getHackerNewsPosts();
          }
        } else {
          getHackerNewsPosts();
        }

        break;
      }
      case 'productHunt': {
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

          setProductHuntData({
            lastUpdated: dayjs().toString(),
            data: returnData,
          });
        };

        if (productHuntData?.lastUpdated) {
          const nextUpdateTime = dayjs(productHuntData.lastUpdated).add(
            60,
            'minute'
          );

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

          setRedditData({
            lastUpdated: dayjs().toString(),
            data: returnData,
          });
        };

        if (redditData?.lastUpdated) {
          const nextUpdateTime = dayjs(redditData.lastUpdated).add(
            60,
            'minute'
          );

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
  }, [
    devToData,
    githubData,
    hackerNewsData,
    productHuntData,
    redditData,
    setDevToData,
    setGithubData,
    setHackerNewsData,
    setProductHuntData,
    setRedditData,
    type,
  ]);

  useEffect(
    () => {
      let markup = null;

      switch (type) {
        case 'devTo':
          if (!devToData) {
            return;
          }
          markup = handleDevTo(devToData.data);
          setDevToPostsMarkup(markup);
          break;
        case 'github':
          if (!githubData) {
            return;
          }
          markup = handleGitHub(githubData.data);
          setGithubPostsMarkup(markup);
          break;
        case 'hackerNews':
          if (!hackerNewsData) {
            return;
          }
          markup = handleHackerNews(hackerNewsData.data);
          setHackerNewsPostsMarkup(markup);
          break;
        case 'productHunt':
          if (!productHuntData) {
            return;
          }
          markup = handleProductHunt(productHuntData.data);
          setProductHuntPostsMarkup(markup);
          break;
        case 'reddit':
          if (!redditData) {
            return;
          }
          markup = handleReddit(redditData.data);
          setRedditPostsMarkup(markup);
          break;
        default:
          break;
      }
    },
    // return () => {};
    [
      devToData,
      githubData,
      hackerNewsData,
      productHuntData,
      redditData,
      setDevToPostsMarkup,
      setGithubPostsMarkup,
      setHackerNewsPostsMarkup,
      setProductHuntPostsMarkup,
      setRedditPostsMarkup,
      type,
    ]
  );

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
        {type === 'devTo' && devToPostsMarkup
          ? devToPostsMarkup
          : type === 'github' && githubPostsMarkup
            ? githubPostsMarkup
            : type === 'hackerNews' && hackerNewsPostsMarkup
              ? hackerNewsPostsMarkup
              : type === 'productHunt' && productHuntPostsMarkup
                ? productHuntPostsMarkup
                : type === 'reddit' && redditPostsMarkup
                  ? redditPostsMarkup
                  : ''}
      </ul>
    );

    const markup = buildPopup();
    // console.log(fullMarkup);
    switch (type) {
      case 'devTo':
        setDevToMarkup(markup);
        break;
      case 'github':
        setGithubMarkup(markup);
        break;
      case 'hackerNews':
        setHackerNewsMarkup(markup);
        break;
      case 'productHunt':
        setProductHuntMarkup(markup);
        break;
      case 'reddit':
        setRedditMarkup(markup);
        break;
      default:
        break;
    }
  }, [
    devToPostsMarkup,
    githubPostsMarkup,
    hackerNewsPostsMarkup,
    productHuntPostsMarkup,
    redditPostsMarkup,
    setDevToMarkup,
    setGithubMarkup,
    setHackerNewsMarkup,
    setProductHuntMarkup,
    setRedditMarkup,
    type,
  ]);

  return (
    <Tippy
      interactive={true}
      maxWidth="none"
      trigger="click"
      content={
        type === 'devTo'
          ? devToMarkup
          : type === 'github'
            ? githubMarkup
            : type === 'hackerNews'
              ? hackerNewsMarkup
              : type === 'productHunt'
                ? productHuntMarkup
                : type === 'reddit'
                  ? redditMarkup
                  : ''
      }
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
