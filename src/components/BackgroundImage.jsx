import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Tippy from '@tippyjs/react';
import axios from 'axios';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { atom, useAtom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import React, { useEffect } from 'react';

import { apiUrl } from '../modules/helpers';

import './BackgroundImage.scss';

dayjs.extend(utc);
dayjs.extend(timezone);

dayjs.tz.setDefault('America/New_York');

const allImagesDataAtom = atomWithStorage('bgImagesData', null);
const bgImageNumAtom = atomWithStorage('bgImageNum', 0);
const bgImageAtom = atom(null);
const imageUrlAtom = atom('');
const imageThumbUrlAtom = atom('');

export const BackgroundImage = () => {
  const [allBgImagesData, setAllBgImagesData] = useAtom(allImagesDataAtom);
  const [bgImageNum, setBgImageNum] = useAtom(bgImageNumAtom);
  const [bgImage, setBgImage] = useAtom(bgImageAtom);
  const [imageUrl, setImageUrl] = useAtom(imageUrlAtom);
  const [imageThumbUrl, setImageThumbUrl] = useAtom(imageThumbUrlAtom);

  useEffect(() => {
    const loadBgImageData = async () => {
      const bgImagesData = await axios
        .get(`${apiUrl()}/background-image`)
        .then((response) => response.data);

      setAllBgImagesData({
        lastUpdated: dayjs().tz('America/New_York'),
        data: bgImagesData,
      });
    };

    if (allBgImagesData?.lastUpdated) {
      const nextUpdateTime = dayjs(allBgImagesData.lastUpdated).add(
        360,
        'minute'
      );

      if (dayjs().tz('America/New_York').isAfter(nextUpdateTime)) {
        loadBgImageData();
      }
    } else {
      loadBgImageData();
    }

    return () => {};
  }, [allBgImagesData, setAllBgImagesData]);

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
  }, [allBgImagesData, bgImageNum, setBgImage, setImageUrl, setImageThumbUrl]);

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
