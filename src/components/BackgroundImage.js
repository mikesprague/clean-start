import axios from 'axios';
import { library, dom } from '@fortawesome/fontawesome-svg-core';
import {
  faImage,
  faSyncAlt,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import React, { useState, useEffect } from 'react';
import { apiUrl } from '../modules/helpers';
import './BackgroundImage.scss';

const BackgroundImage = (props) => {
  const [allBgImagesData, setAllBgImagesData] = useState(null);
  useEffect(() => {
    const loadQuoteData = async () => {
      const data = await axios.get(`${apiUrl()}/background-image`)
        .then((response) => {
          // console.log(response.data);
          return response.data;
        });
      setAllBgImagesData(data);
    };
    loadQuoteData();

    return () => {};
  }, []);

  const [bgImage, setBgImage] = useState(null);
  const [bgImageNum, setBgImageNum] = useState(0);
  useEffect(() => {
    if (allBgImagesData) {
      const currentImage = allBgImagesData[bgImageNum];
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
      };
      prepareImageMetaData();
    }
    return () => {};
  }, [allBgImagesData, bgImageNum]);

  const [imageUrl, setImageUrl] = useState('');
  useEffect(() => {
    const updateBg = () => {
      document.body.style.backgroundImage = `linear-gradient(rgba(0,0,0,.4), rgba(0,0,0,.4)), url('${imageUrl}')`;
      document.body.style.backgroundSize = 'cover';
    }
    updateBg();
    const initIcons = () => {
      library.add(
        faImage,
        faSyncAlt,
        faUser,
      );
      dom.watch();
    };
    initIcons();
  }, [imageUrl]);

  const clickHandler = (event) => {
    event.preventDefault();
    const nextBgImageNum = bgImageNum + 1 >= 5 ? 0 : bgImageNum + 1;
    setBgImageNum(nextBgImageNum);
  };

  return (
    <section>
      <a className={bgImage ? 'rotate-bg visible' : 'rotate-bg invisible'} href="#" onClick={clickHandler} data-tippy-content="Change Background Image">
        <i className="fas fa-fw fa-sync-alt fa-2x"></i>
      </a>
      <div className="bg-metadata">
        <a href={`${bgImage && bgImage.imageLink}${bgImage && bgImage.linkSuffix}`} target="_blank" rel="noopener">
          <i className="fas fa-fw fa-image"></i> {bgImage && bgImage.title}
        </a>
        <br />
        <a href={`${bgImage && bgImage.userLink}${bgImage && bgImage.linkSuffix}`} target="_blank" rel="noopener">
          <i className="fas fa-fw fa-user"></i> {bgImage && bgImage.userName}
        </a>
        {" via "}
        <a href={`https://unsplash.com/${bgImage && bgImage.linkSuffix}`} target="_blank" rel="noopener">Unsplash</a>
      </div>
    </section>
  )
};

export default BackgroundImage;
