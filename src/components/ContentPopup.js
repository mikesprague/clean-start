import axios from 'axios';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import dompurify from 'dompurify';
import he from 'he';
import { nanoid } from 'nanoid';
import React, { Fragment, useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Tippy from '@tippyjs/react';
import { apiUrl } from '../modules/helpers';
import { getPopupInfo, handleDevTo, handleGitHub, handleHackerNews, handleProductHunt, handleReddit } from '../modules/content-popup';
import './ContentPopup.scss';

const ContentPopup = (props) => {
  const [data, setData] = useState(null);
  useEffect(() => {
    let apiData = null;
    switch (props.type) {
      case 'dev-to':
        const getDevToPosts = async (devToUrl = `${apiUrl()}/dev-to-posts`) => {
          const devToData = await axios.get(devToUrl)
            .then(response => {
              const parser = new DOMParser();
              const xml = parser.parseFromString(response.data, 'text/xml');
              const items = Array.from(xml.querySelectorAll('item'));
              const dtData = items.map(item => {
                // author, title, link, pubDate, description
                const author = item.querySelector('author').innerHTML;
                const title = item.querySelector('title').innerHTML;
                const link = item.querySelector('link').innerHTML;
                const pubDate = item.querySelector('pubDate').innerHTML;
                return {
                  author,
                  title,
                  link,
                  pubDate,
                };
              });
              return dtData;
            });
          const returnData = [];
          // limit to 10 items
          for (let i = 0; i < 10; i+=1) {
            returnData.push(devToData[i]);
          }
          setData(returnData);
          return returnData;
        };
        getDevToPosts();
        break;
      case 'github':
        const getTrendingRepos = async (dataUrl = `${apiUrl()}/github-trending-repos`) => {
          const returnData = [];
          const pageData = await axios.get(dataUrl)
            .then(response => {
              // limit to 10 items
              for (let i = 0; i < 10; i+=1) {
                returnData.push(response.data[i]);
              }
              setData(returnData);
              return returnData;
            });
          return pageData;
        };
        getTrendingRepos();
        break;
      case 'hacker-news':
        const getHackerNewsPosts = async (hackerNewsUrl = `${apiUrl()}/hacker-news-posts`) => {
          const hackerNewsData = await axios.get(hackerNewsUrl)
          .then(response => {
            const parser = new DOMParser();
            const xml = parser.parseFromString(response.data, 'text/xml');
            const items = Array.from(xml.querySelectorAll('item'));
            const hnData = items.map(item => {
              // title, link, pubDate, comments, description
              const title = item.querySelector('title').innerHTML;
              const link = item.querySelector('link').innerHTML;
              const pubDate = item.querySelector('pubDate').innerHTML;
              return {
                title,
                link,
                pubDate,
              };
            });
            return hnData;
          });
          const returnData = [];
          // limit to 10 items
          for (let i = 0; i < 10; i+=1) {
            returnData.push(hackerNewsData[i]);
          }
          setData(returnData);
          return returnData;
        };
        getHackerNewsPosts();
        break;
      case 'product-hunt':
        const getProductHuntPosts = async (productHuntRssUrl = `${apiUrl()}/product-hunt-posts`) => {
          const productHuntData = await axios.get(productHuntRssUrl)
          .then(response => {
            const parser = new DOMParser();
            const xml = parser.parseFromString(response.data, 'text/xml');
            const entries = Array.from(xml.querySelectorAll('entry'));
            const phData = entries.map(entry => {
              // id, published, updated, title, link.href, content, author>name
              const content = entry.querySelector('content').innerHTML;
              const link = entry.querySelector('link').getAttribute('href');
              const published = entry.querySelector('published').innerHTML;
              const title = entry.querySelector('title').innerHTML;
              return {
                content,
                link,
                published,
                title,
              };
            });
            return phData;
          });
          const returnData = [];
          // limit to 10 items
          for (let i = 0; i < 10; i+=1) {
            returnData.push(productHuntData[i]);
          }
          setData(returnData);
          return returnData;
        };
        getProductHuntPosts();
        break;
      case 'reddit':
        const getRedditPosts = async (redditPostsApiUrl = `${apiUrl()}/reddit-posts`) => {
          const redditPostsData = await axios.get(redditPostsApiUrl)
            .then((response) => {
              // console.log(response.data);
              setData(response.data);
              return response.data;
            });
          return redditPostsData;
        };
        getRedditPosts();
        break;
      default:
        break;
    };
  }, []);

  const [postsMarkup, setPostsMarkup] = useState(null);
  useEffect(() => {
    let markup = null;
    if (data) {
      switch (props.type) {
        case 'dev-to':
          markup = handleDevTo(data);
          setPostsMarkup(markup);
          break;
        case 'github':
          markup = handleGitHub(data);
          setPostsMarkup(markup);
          break;
        case 'hacker-news':
          markup = handleHackerNews(data);
          setPostsMarkup(markup);
          break;
        case 'product-hunt':
          markup = handleProductHunt(data);
          setPostsMarkup(markup);
          break;
        case 'reddit':
          markup = handleReddit(data);
          setPostsMarkup(markup);
          break;
        default:
          break;
      };
    }
    // return () => {};
  }, [data]);

  const [fullMarkup, setFullMarkup] = useState(null);
  useEffect(() => {
    const buildPopup = () => {
      return (
        <ul className="list-group posts-container">
          <li key={nanoid(8)} className="list-group-item list-group-item-heading">
            <h5 className="text-xl font-medium">
              <FontAwesomeIcon icon={["fab", `${getPopupInfo(props.type).icon}`]} fixedWidth /> {getPopupInfo(props.type).title}
              &nbsp;&nbsp;
              <small className="font-thin">
                <a href={getPopupInfo(props.type).pageLink} title={`View on ${getPopupInfo(props.type).title}`} target="_blank" rel="noopener">
                  <FontAwesomeIcon icon="external-link-alt" fixedWidth /> View on {getPopupInfo(props.type).siteName}
                </a>
              </small>
            </h5>
          </li>
          {postsMarkup}
        </ul>
      );
    };
    const markup = buildPopup();
    setFullMarkup(markup);

    // return () => {};
  }, [postsMarkup]);

  return (
    <Tippy interactive={true} maxWidth="none" trigger="click" content={fullMarkup}>
      <Tippy placement="left" content={getPopupInfo(props.type).title}>
        <div className={`${props.type}-popup inline-block`}>
          <FontAwesomeIcon
            icon={["fab", `${getPopupInfo(props.type).icon}`]}
            className="content-popup-icon"
            fixedWidth
          />
        </div>
      </Tippy>
    </Tippy>
  );
};

export default ContentPopup;
