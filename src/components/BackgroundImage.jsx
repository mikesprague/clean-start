import axios from 'axios';
import dayjs from 'dayjs';
import React, { Fragment, useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Tippy from '@tippyjs/react';
import { apiUrl } from '../modules/helpers';
import { useLocalStorage } from '../hooks/useLocalStorage';
import './BackgroundImage.scss';

const BackgroundImage = (props) => {
  const [allBgImagesData, setAllBgImagesData] = useLocalStorage('bgImagesData', null);
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
    if (allBgImagesData && allBgImagesData.lastUpdated) {
      const nextUpdateTime = dayjs(allBgImagesData.lastUpdated).add(360, 'minute');
      if (dayjs().isAfter(nextUpdateTime)) {
        loadBgImageData();
      }
    } else {
      loadBgImageData();
    }

    return () => {};
  }, []);

  const [bgImage, setBgImage] = useState(null);
  const [bgImageNum, setBgImageNum] = useLocalStorage('bgImageNum', 0);
  useEffect(() => {
    if (allBgImagesData && allBgImagesData.data) {
      const currentImage = allBgImagesData.data[bgImageNum];
      const prepareImageMetaData = () => {
        const linkSuffix = '?utm_source=Clean%20Start%20-%20Open%20Source%20New%20Tab%20Extension&utm_medium=referral';
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
    return () => {};
  }, [allBgImagesData, bgImageNum]);

  const [imageUrl, setImageUrl] = useState('');
  const [imageThumbUrl, setImageThumbUrl] = useState('');
  useEffect(() => {
    const updateBg = () => {
      document.body.style.background = `linear-gradient(rgba(0,0,0,.4), rgba(0,0,0,.4)), url('${imageUrl}') no-repeat fixed center center, linear-gradient(rgba(0,0,0,.4), rgba(0,0,0,.4)), url('${imageThumbUrl}') no-repeat fixed center center`;
      document.body.style.backgroundSize = 'cover, cover';
    }
    updateBg();
  }, [imageUrl]);

  const clickHandler = (event) => {
    event.preventDefault();
    const nextBgImageNum = bgImageNum + 1 >= 5 ? 0 : bgImageNum + 1;
    setBgImageNum(nextBgImageNum);
  };

  return (
    <Fragment>
      <Tippy content="Change background image" placement="right">
        <a className={bgImage ? 'rotate-bg visible' : 'rotate-bg invisible'} href="#" onClick={clickHandler}>
          <FontAwesomeIcon icon="sync-alt" size="2x" fixedWidth />
        </a>
      </Tippy>
      <div className="bg-metadata">
        <Tippy content="View full quality image on Unsplash" placement="right">
          <a href={`${bgImage && bgImage.imageLink}${bgImage && bgImage.linkSuffix}`} target="_blank" rel="noopener">
            <FontAwesomeIcon icon="image" fixedWidth /> {bgImage && bgImage.title}
          </a>
        </Tippy>
        <br />
        <Tippy content="Visit photographer's page on Unsplash" placement="right">
          <a href={`${bgImage && bgImage.userLink}${bgImage && bgImage.linkSuffix}`} target="_blank" rel="noopener">
            <FontAwesomeIcon icon="user" fixedWidth /> {bgImage && bgImage.userName}
          </a>
        </Tippy>
        {" via "}
        <Tippy content="Visit Unsplash" placement="right">
          <a href={`https://unsplash.com/${bgImage && bgImage.linkSuffix}`} target="_blank" rel="noopener">Unsplash</a>
        </Tippy>
      </div>
    </Fragment>
  )
};

export default BackgroundImage;
