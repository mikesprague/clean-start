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
import axios from 'axios';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { atom, useAtom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { nanoid } from 'nanoid';
import PropTypes from 'prop-types';
import React, { useEffect } from 'react';

import {
  getPopupInfo,
  handleDevTo,
  handleGitHub,
  handleHackerNews,
  handleProductHunt,
  handleReddit,
} from '../modules/content-popup';
import { apiUrl } from '../modules/helpers';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault('America/New_York');

const hackerNewsDataAtom = atomWithStorage('hackerNewsData', {
  lastUpdated: '',
  data: [] as unknown[],
});
const devToDataAtom = atomWithStorage('devToData', {
  lastUpdated: '',
  data: [] as unknown[],
});
const productHuntDataAtom = atomWithStorage('productHuntData', {
  lastUpdated: '',
  data: [] as unknown[],
});
const redditDataAtom = atomWithStorage('redditData', {
  lastUpdated: '',
  data: [] as unknown[],
});
const githubDataAtom = atomWithStorage('githubData', {
  lastUpdated: '',
  data: [] as unknown[],
});
const devToMarkupAtom = atom('');
const githubMarkupAtom = atom('');
const hackerNewsMarkupAtom = atom('');
const productHuntMarkupAtom = atom('');
const redditMarkupAtom = atom('');
const githubPostsMarkupAtom = atom('');
const devToPostsMarkupAtom = atom('');
const hackerNewsPostsMarkupAtom = atom('');
const productHuntPostsMarkupAtom = atom('');
const redditPostsMarkupAtom = atom('');

interface ContentPopupProps {
  contentType: string;
}

export const ContentPopup: React.FC<ContentPopupProps> = ({ contentType }) => {
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
    switch (contentType as string) {
      case 'devTo': {
        const getDevToPosts = async (devToUrl = `${apiUrl()}/dev-to-posts`) => {
          const tempData = await axios
            .get(devToUrl)
            .then((response) => response.data);
          const returnData = [];
          // limit to 10 items

          for (let i = 0; i < 10; i += 1) {
            returnData.push(tempData[i]);
          }

          setDevToData({
            lastUpdated: dayjs().tz('America/New_York').toISOString(),
            data: returnData,
          });
        };

        if (devToData?.lastUpdated) {
          const nextUpdateTime = dayjs(devToData.lastUpdated)
            .tz('America/New_York')
            .add(60, 'minute');

          if (dayjs().tz('America/New_York').isAfter(nextUpdateTime)) {
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
          const returnData = [] as unknown[];

          await axios.get(dataUrl).then((response) => {
            // limit to 10 items
            for (let i = 0; i < 10; i += 1) {
              returnData.push(response.data[i]);
            }
          });
          setGithubData({
            lastUpdated: dayjs().tz('America/New_York').toISOString(),
            data: returnData,
          });
        };

        if (githubData?.lastUpdated) {
          const nextUpdateTime = dayjs(githubData.lastUpdated)
            .tz('America/New_York')
            .add(60, 'minute');

          if (dayjs().tz('America/New_York').isAfter(nextUpdateTime)) {
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
          const tempData = await axios
            .get(hackerNewsUrl)
            .then((response) => response.data);
          const returnData = [];
          // limit to 10 items

          for (let i = 0; i < 10; i += 1) {
            returnData.push(tempData[i]);
          }

          setHackerNewsData({
            lastUpdated: dayjs().tz('America/New_York').toISOString(),
            data: returnData,
          });
        };

        if (hackerNewsData?.lastUpdated) {
          const nextUpdateTime = dayjs(hackerNewsData.lastUpdated)
            .tz('America/New_York')
            .add(60, 'minute');

          if (dayjs().tz('America/New_York').isAfter(nextUpdateTime)) {
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
          const tempData = await axios
            .get(productHuntRssUrl)
            .then((response) => response.data);
          const returnData = [];
          // limit to 10 items

          for (let i = 0; i < 10; i += 1) {
            returnData.push(tempData[i]);
          }

          setProductHuntData({
            lastUpdated: dayjs().tz('America/New_York').toISOString(),
            data: returnData,
          });
        };

        if (productHuntData?.lastUpdated) {
          const nextUpdateTime = dayjs(productHuntData.lastUpdated)
            .tz('America/New_York')
            .add(60, 'minute');

          if (dayjs().tz('America/New_York').isAfter(nextUpdateTime)) {
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
            lastUpdated: dayjs().tz('America/New_York').toISOString(),
            data: returnData,
          });
        };

        if (redditData?.lastUpdated) {
          const nextUpdateTime = dayjs(redditData.lastUpdated)
            .tz('America/New_York')
            .add(60, 'minute');

          if (dayjs().tz('America/New_York').isAfter(nextUpdateTime)) {
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
    contentType,
  ]);

  useEffect(
    () => {
      let markup: any;

      switch (contentType) {
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
      contentType,
    ]
  );

  useEffect(() => {
    const buildPopup = () => (
      <ScrollArea>
        <List listStyleType="none" m={0} p={0} mah="85vh" maw="48rem">
          <List.Item
            key={nanoid(8)}
            bg="var(--mantine-color-black)"
            c="white"
            display="flex"
            mb={0}
            p="sm"
          >
            <Text fw={500} size="1.25rem">
              <FontAwesomeIcon
                icon={
                  [
                    'fab',
                    `${getPopupInfo(contentType).icon}`,
                  ] as unknown as IconName
                }
                fixedWidth
              />{' '}
              {getPopupInfo(contentType).title}
              &nbsp;&nbsp;
              <Anchor
                c="white"
                fw={300}
                href={getPopupInfo(contentType).pageLink}
                rel="noopener noreferrer"
                size="sm"
                target="_blank"
                title={`View on ${getPopupInfo(contentType).title}`}
              >
                <FontAwesomeIcon icon="external-link-alt" fixedWidth /> View on{' '}
                {getPopupInfo(contentType).siteName}
              </Anchor>
            </Text>
          </List.Item>
          {contentType === 'devTo' && devToPostsMarkup
            ? devToPostsMarkup
            : contentType === 'github' && githubPostsMarkup
              ? githubPostsMarkup
              : contentType === 'hackerNews' && hackerNewsPostsMarkup
                ? hackerNewsPostsMarkup
                : contentType === 'productHunt' && productHuntPostsMarkup
                  ? productHuntPostsMarkup
                  : contentType === 'reddit' && redditPostsMarkup
                    ? redditPostsMarkup
                    : ''}
        </List>
      </ScrollArea>
    );

    const markup: any = buildPopup();
    // console.log(fullMarkup);
    switch (contentType) {
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
    contentType,
  ]);

  return (
    <>
      <Popover closeOnEscape closeOnClickOutside shadow="md" width="fit-content" withArrow>
        <Popover.Target>
          <Tooltip position="left" label={getPopupInfo(contentType).title}>
            <ActionIcon
              color="white"
              className={`${contentType}-popup`}
              size="xl"
              variant="transparent"
            >
              <FontAwesomeIcon
                icon={
                  [
                    'fab',
                    `${getPopupInfo(contentType).icon}`,
                  ] as unknown as IconName
                }
                className="content-popup-icon"
                fixedWidth
                fontSize="2.25rem"
              />
            </ActionIcon>
          </Tooltip>
        </Popover.Target>
        <Popover.Dropdown p="xs">
          {contentType === 'devTo'
            ? devToMarkup
            : contentType === 'github'
              ? githubMarkup
              : contentType === 'hackerNews'
                ? hackerNewsMarkup
                : contentType === 'productHunt'
                  ? productHuntMarkup
                  : contentType === 'reddit'
                    ? redditMarkup
                    : ''}
        </Popover.Dropdown>
      </Popover>
    </>
  );
};

ContentPopup.displayName = 'ContentPopup';
ContentPopup.propTypes = {
  contentType: PropTypes.string.isRequired,
};

export default ContentPopup;
