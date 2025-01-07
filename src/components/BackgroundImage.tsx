import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ActionIcon, Anchor, Box, Group, Tooltip } from '@mantine/core';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { atom, useAtom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import type React from 'react';
import { useCallback, useEffect } from 'react';

import { apiUrl } from '../modules/helpers.ts';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault('America/New_York');

// type for finalImageData
interface ImageData {
  name?: string | undefined;
  title: string | undefined;
  imageLink: string | undefined;
  imageUrl: string | undefined;
  imageThumbUrl: string | undefined;
  userLink: string | undefined;
  userName: string | undefined;
  linkSuffix: string | undefined;
}

const allImagesDataAtom = atomWithStorage('bgImagesData', {
  lastUpdated: '',
  data: [] as ImageData[],
});
const bgImageNumAtom = atomWithStorage('bgImageNum', 0);
const bgImageAtom = atom({} as ImageData);
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
      const bgImagesData: ImageData[] = await fetch(`${apiUrl()}/background-image`)
        .then((response) => response.json());

      setAllBgImagesData({
        lastUpdated: dayjs().tz('America/New_York').toISOString(),
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
    if (allBgImagesData?.data?.length === 0 && bgImageNum === 0) {
      return;
    }

    const currentImage = allBgImagesData.data[bgImageNum];
    const prepareImageMetaData = () => {
      const linkSuffix =
        '?utm_source=Clean%20Start%20-%20Open%20Source%20New%20Tab%20Extension&utm_medium=referral';
      const {
        title,
        name,
        imageLink,
        imageUrl: imgUrl,
        imageThumbUrl: imgThumbUrl,
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

      const finalImageData: ImageData = {
        title: getImageTitle(),
        imageLink,
        imageUrl: imgUrl,
        imageThumbUrl: imgThumbUrl,
        userLink,
        userName,
        linkSuffix,
      };

      setBgImage(finalImageData);
      setImageUrl(imgUrl);
      setImageThumbUrl(imgThumbUrl);
    };

    prepareImageMetaData();

    // return () => {};
  }, [allBgImagesData, bgImageNum, setBgImage, setImageUrl, setImageThumbUrl]);

  useEffect(() => {
    document.body.style.background = `linear-gradient(rgba(0,0,0,.4), rgba(0,0,0,.4)), url('${imageUrl}') no-repeat fixed center center, linear-gradient(rgba(0,0,0,.4), rgba(0,0,0,.4)), url('${imageThumbUrl}') no-repeat fixed center center`;
    document.body.style.backgroundSize = 'cover, cover';
  }, [imageUrl, imageThumbUrl]);

  const clickHandler = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
      const nextBgImageNum = bgImageNum + 1 >= 5 ? 0 : bgImageNum + 1;

      setBgImageNum(nextBgImageNum);
    },
    [bgImageNum, setBgImageNum]
  );

  return (
    <>
      <Group>
        <ActionIcon
          aria-label="Change background image"
          c="white"
          hidden={!bgImage}
          onClick={clickHandler}
          variant="transparent"
        >
          <Tooltip label="Change background image" position="right" withArrow>
            <FontAwesomeIcon icon="sync-alt" size="2x" fixedWidth />
          </Tooltip>
        </ActionIcon>
        <Box lh={1.2}>
          <Tooltip
            label="View full quality image on Unsplash"
            position="right"
            withArrow
          >
            <Anchor
              c="white"
              fw={200}
              href={`${bgImage?.imageLink}${bgImage?.linkSuffix}`}
              size="sm"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FontAwesomeIcon icon="image" fixedWidth /> {bgImage?.title}
            </Anchor>
          </Tooltip>
          <br />
          <Tooltip
            label="Visit photographer's page on Unsplash"
            position="right"
            withArrow
          >
            <Anchor
              c="white"
              fw={200}
              href={`${bgImage?.userLink}${bgImage?.linkSuffix}`}
              size="sm"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FontAwesomeIcon icon="user" fixedWidth /> {bgImage?.userName}
            </Anchor>
          </Tooltip>
          {' via '}
          <Tooltip label="Visit Unsplash" position="right" withArrow>
            <Anchor
              c="white"
              fw={200}
              href={`https://unsplash.com/${bgImage?.linkSuffix}`}
              size="sm"
              target="_blank"
              rel="noopener noreferrer"
            >
              Unsplash
            </Anchor>
          </Tooltip>
        </Box>
      </Group>
    </>
  );
};

export default BackgroundImage;
