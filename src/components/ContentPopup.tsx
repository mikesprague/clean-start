import type { IconName } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  ActionIcon,
  Anchor,
  List,
  Popover,
  ScrollArea,
  Text,
  Tooltip,
} from '@mantine/core';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { atom, useAtom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { nanoid } from 'nanoid';
import PropTypes from 'prop-types';
import type React from 'react';
import { useEffect } from 'react';

import {
  CONTENT_TYPE_KEYS,
  CONTENT_TYPES,
  getPopupInfo,
  handleGitHub,
  handleReddit,
  renderListItems,
} from '../modules/content-popup';
import { apiUrl, handleError } from '../modules/helpers';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault('America/New_York');

const dataAtoms = Object.fromEntries(
  CONTENT_TYPE_KEYS.map((type) => [
    type,
    atomWithStorage(CONTENT_TYPES[type].dataKey, {
      lastUpdated: '',
      data: [] as unknown[],
    }),
  ])
);
const postsMarkupAtoms = Object.fromEntries(
  CONTENT_TYPE_KEYS.map((type) => [type, atom('' as React.ReactNode)])
);
const markupAtoms = Object.fromEntries(
  CONTENT_TYPE_KEYS.map((type) => [type, atom('' as React.ReactNode)])
);

interface ContentPopupProps {
  contentType: string;
}

export const ContentPopup: React.FC<ContentPopupProps> = ({ contentType }) => {
  const cfg = getPopupInfo(contentType);
  const [data, setData] = useAtom(dataAtoms[contentType]);
  const [postsMarkup, setPostsMarkup] = useAtom(postsMarkupAtoms[contentType]);
  const [markup, setMarkup] = useAtom(markupAtoms[contentType]);

  useEffect(() => {
    const fetchContentData = async (dataUrl = `${apiUrl()}${cfg.endpoint}`) => {
      try {
        const response = await fetch(dataUrl);
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        const tempData = await response.json();
        const returnData = (Array.isArray(tempData) ? tempData : []).slice(
          0,
          10
        );

        setData({
          lastUpdated: dayjs().tz('America/New_York').toISOString(),
          data: returnData,
        });
      } catch (error) {
        handleError(error);
      }
    };

    if (data?.lastUpdated) {
      const nextUpdateTime = dayjs(data.lastUpdated)
        .tz('America/New_York')
        .add(cfg.cacheTtl, 'minute');

      if (dayjs().tz('America/New_York').isAfter(nextUpdateTime)) {
        fetchContentData();
      }
    } else {
      fetchContentData();
    }
  }, [contentType, cfg, data, setData]);

  useEffect(() => {
    if (!data) {
      return;
    }

    setPostsMarkup(
      contentType === 'reddit'
        ? handleReddit(data.data)
        : contentType === 'github'
          ? handleGitHub(data.data)
          : renderListItems(data.data, contentType)
    );
  }, [contentType, data, setPostsMarkup]);

  useEffect(() => {
    const buildPopup = () => (
      <ScrollArea>
        <List listStyleType='none' m={0} p={0} mah='85vh' maw='48rem'>
          <List.Item
            key={nanoid(8)}
            bg='var(--mantine-color-black)'
            c='white'
            display='flex'
            mb={0}
            p='sm'
          >
            <Text fw={500} size='1.25rem'>
              <FontAwesomeIcon
                icon={['fab', `${cfg.icon}`] as unknown as IconName}
                fixedWidth
              />{' '}
              {cfg.title}
              &nbsp;&nbsp;
              <Anchor
                c='white'
                fw={300}
                href={cfg.pageLink}
                rel='noopener noreferrer'
                size='sm'
                target='_blank'
                title={`View on ${cfg.title}`}
              >
                <FontAwesomeIcon icon='external-link-alt' fixedWidth /> View on{' '}
                {cfg.siteName}
              </Anchor>
            </Text>
          </List.Item>
          {postsMarkup}
        </List>
      </ScrollArea>
    );

    setMarkup(buildPopup());
  }, [contentType, cfg, postsMarkup, setMarkup]);

  return (
    <Popover
      closeOnEscape
      closeOnClickOutside
      shadow='md'
      width='fit-content'
      withArrow
    >
      <Popover.Target>
        <Tooltip label={cfg.title} position='left' withArrow>
          <ActionIcon
            color='white'
            className={`${contentType}-popup`}
            size='xl'
            variant='transparent'
          >
            <FontAwesomeIcon
              icon={['fab', `${cfg.icon}`] as unknown as IconName}
              className='content-popup-icon'
              fixedWidth
              fontSize='2.25rem'
            />
          </ActionIcon>
        </Tooltip>
      </Popover.Target>
      <Popover.Dropdown p='xs'>{markup}</Popover.Dropdown>
    </Popover>
  );
};

ContentPopup.displayName = 'ContentPopup';
ContentPopup.propTypes = {
  contentType: PropTypes.string.isRequired,
};

export default ContentPopup;
