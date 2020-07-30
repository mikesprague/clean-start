import axios from 'axios';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import dompurify from 'dompurify';
import he from 'he';
import React, { Fragment, useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Tippy from '@tippyjs/react';
import { apiUrl } from '../modules/helpers';
import { getPopupInfo, handleDevTo, handleGitHub, handleHackerNews, handleProductHunt, handleReddit } from '../modules/content-popup';
import './ContentPopup.scss';

const ContentPopup = (props) => {
  const [data, setData] = useState(null);
  useEffect(() => {
    const getRedditPosts = async () => {
      const redditPostsApiUrl = `${apiUrl()}${getPopupInfo(props.type).endpoint}`;
      const redditPostsData = await axios.get(redditPostsApiUrl)
      .then((response) => {
        // console.log(response.data);
        setData(response.data);
      });
      return redditPostsData;
    };
    getRedditPosts();
  }, []);

  const [postsMarkup, setPostsMarkup] = useState(null);
  useEffect(() => {

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
              <FontAwesomeIcon icon={["fab", `${getPopupInfo(props.type).icon}`]} fixedWidth /> {getPopupInfo(props.type).title}
              &nbsp;&nbsp;
              <small className="font-thin">
                <a href={props.link} title={`View on ${getPopupInfo(props.type).title}`} target="_blank" rel="noopener">
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
