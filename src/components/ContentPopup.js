import axios from 'axios';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import dompurify from 'dompurify';
import he from 'he';
import React, { Fragment, useEffect, useState } from 'react';
import { apiUrl, getContentInfo, getWeatherIcon } from '../modules/helpers';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import './ContentPopup.scss';

const ContentPopup = (props) => {
  const [data, setData] = useState(null);
  useEffect(() => {
    const getRedditPosts = async () => {
      const redditPostsApiUrl = `${apiUrl()}${getContentInfo(props.type).endpoint}`;
      const redditPostsData = await axios.get(redditPostsApiUrl)
      .then((response) => {
        // console.log(response.data);
        setData(response.data);
        // return response.data;
      });
      return redditPostsData;
    };
    getRedditPosts();

    // return () => {};
  }, []);

  const [postsMarkup, setPostsMarkup] = useState(null);
  useEffect(() => {
    const handleReddit = (rssData) => {
      let idx = 0;
      const markup = rssData.map(post => {
        const listItemMarkup = (
          <li key={post.permanlink} className={`list-group-item list-group-item-action text-white ${idx % 2 === 0 ? ' odd' : ''}`}>
            <a href={`${getContentInfo(props.type).url}${post.permalink}`} target="_blank" rel="noopener">
              <strong>{post.title}</strong>
            </a>
            <br />
            <small>
              <a href={`${getContentInfo(props.type).url}${post.subreddit}`} target="_blank" rel="noopener">/r/{post.subreddit}</a>
              &nbsp;&nbsp;
              <a href={`${getContentInfo(props.type).url}${post.author}`} target="_blank" rel="noopener">
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
    if (data) {
      switch (props.type) {
        case 'reddit':
          const markup = handleReddit(data);
          setPostsMarkup(markup);
          break;

        default:
          break;
      }
    }
    // return () => {};
  }, [data]);

  const [fullMarkup, setFullMarkup] = useState(null);
  useEffect(() => {
    // const initCap = (string) => `${string.charAt(0).toUpperCase()}${string.toLowerCase().substring(1)}`;
    const buildPopup = () => {
      return (
        <ul className="list-group posts-container">
          <li className="list-group-item list-group-item-heading" key="list-heading">
            <h5 className="text-xl font-medium">
              <FontAwesomeIcon icon={["fab", `${getContentInfo(props.type).icon}`]} fixedWidth /> {getContentInfo(props.type).title}
              &nbsp;&nbsp;
              <small className="font-thin">
                <a href={props.link} title={`View on ${getContentInfo(props.type).title}`} target="_blank" rel="noopener">
                  <FontAwesomeIcon icon="external-link-alt" fixedWidth /> View on {getContentInfo(props.type).siteName}
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
      <Tippy placement="left" content={getContentInfo(props.type).title}>
        <div className={`${props.type}-popup inline-block`}>
          <FontAwesomeIcon
            icon={["fab", `${getContentInfo(props.type).icon}`]}
            className="content-popup-icon"
            fixedWidth
          />
        </div>
      </Tippy>
    </Tippy>
  );
};

export default ContentPopup;
