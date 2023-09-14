import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Tippy from '@tippyjs/react';
import axios from 'axios';
import dayjs from 'dayjs';
import React, { Fragment, useEffect, useState } from 'react';
import useLocalStorageState from 'use-local-storage-state';

import { apiUrl } from '../modules/helpers';

import './BackgroundImage.scss';

export const BackgroundImage = () => {
  const [allBgImagesData, setAllBgImagesData] = useLocalStorageState(
    'bgImagesData',
    {
      defaultValue: null,
    }
  );

  useEffect(() => {
    const loadBgImageData = async () => {
      const bgImagesData = await axios
        .get(`${apiUrl()}/background-image`)
        .then((response) => response.data);

      setAllBgImagesData({
        lastUpdated: dayjs().toString(),
        data: bgImagesData,
      });
    };

    if (allBgImagesData?.lastUpdated) {
      const nextUpdateTime = dayjs(allBgImagesData.lastUpdated).add(
        360,
        'minute'
      );

      if (dayjs().isAfter(nextUpdateTime)) {
        loadBgImageData();
      }
    } else {
      loadBgImageData();
    }

    return () => {};
  }, [allBgImagesData, setAllBgImagesData]);

  const [bgImage, setBgImage] = useState(null);
  const [bgImageNum, setBgImageNum] = useLocalStorageState('bgImageNum', {
    defaultValue: 0,
  });

  useEffect(() => {
    if (allBgImagesData?.data) {
      const currentImage = allBgImagesData.data[bgImageNum];
      const prepareImageMetaData = () => {
        const linkSuffix =
          '?utm_source=Clean%20Start%20-%20Open%20Source%20New%20Tab%20Extension&utm_medium=referral';
        const {
          title,
          name,
          imageLink,
          imageUrl,
          imageThumbUrl,
          userLink,
          userName,
        } = currentImage || null;
        const getImageTitle = () => {
          if (title) {
            return title;
          }

          if (name) {
            return name;
          }

          return 'No description available';
        };
        const finalImageData = {
          title: getImageTitle(),
          imageLink,
          imageUrl,
          imageThumbUrl,
          userLink,
          userName,
          linkSuffix,
        };

        setBgImage(finalImageData);
        setImageUrl(imageUrl);
        setImageThumbUrl(imageThumbUrl);
      };

      prepareImageMetaData();
    }

    // return () => {};
  }, [allBgImagesData, bgImageNum]);

  const [imageUrl, setImageUrl] = useState('');
  const [imageThumbUrl, setImageThumbUrl] = useState('');

  useEffect(() => {
    const updateBg = () => {
      document.body.style.background = `linear-gradient(rgba(0,0,0,.4), rgba(0,0,0,.4)), url('${imageUrl}') no-repeat fixed center center, linear-gradient(rgba(0,0,0,.4), rgba(0,0,0,.4)), url('${imageThumbUrl}') no-repeat fixed center center`;
      document.body.style.backgroundSize = 'cover, cover';
    };

    updateBg();
  }, [imageUrl, imageThumbUrl]);

  const clickHandler = (event) => {
    event.preventDefault();
    const nextBgImageNum = bgImageNum + 1 >= 5 ? 0 : bgImageNum + 1;

    setBgImageNum(nextBgImageNum);
  };

  return (
    <>
      <Tippy content="Change background image" placement="right">
        <button
          type="button"
          className={bgImage ? 'rotate-bg visible' : 'rotate-bg invisible'}
          onClick={clickHandler}
        >
          <FontAwesomeIcon icon="sync-alt" size="2x" fixedWidth />
        </button>
      </Tippy>
      <div className="bg-metadata">
        <Tippy content="View full quality image on Unsplash" placement="right">
          <a
            href={`${bgImage?.imageLink}${bgImage?.linkSuffix}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <FontAwesomeIcon icon="image" fixedWidth /> {bgImage?.title}
          </a>
        </Tippy>
        <br />
        <Tippy
          content="Visit photographer's page on Unsplash"
          placement="right"
        >
          <a
            href={`${bgImage?.userLink}${bgImage?.linkSuffix}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <FontAwesomeIcon icon="user" fixedWidth /> {bgImage?.userName}
          </a>
        </Tippy>
        {' via '}
        <Tippy content="Visit Unsplash" placement="right">
          <a
            href={`https://unsplash.com/${bgImage?.linkSuffix}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Unsplash
          </a>
        </Tippy>
      </div>
    </>
  );
};

export default BackgroundImage;
