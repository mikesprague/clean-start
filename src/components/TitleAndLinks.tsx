import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Anchor, Text, Title, Tooltip } from '@mantine/core';
import { atom, useAtom } from 'jotai';
import React, { useEffect } from 'react';

import { version } from '../../package.json';

const isExtensionAtom = atom(true);

export const TitleAndLinks = () => {
  const [isExtension, setIsExtension] = useAtom(isExtensionAtom);

  useEffect(() => {
    setIsExtension(window.location.origin.includes('-extension://'));

    return () => {};
  }, [setIsExtension]);

  const installLinks = (
    <Title mt="xs" order={2}>
      <Tooltip label="Install via Chrome Store" position="right" withArrow>
        <Anchor
          c="white"
          href="https://chrome.google.com/webstore/detail/mmnlbcjgkfloemcbbjhklbblhbcjhmol"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FontAwesomeIcon icon={['fab', 'chrome']} fixedWidth size="2x" />
        </Anchor>
      </Tooltip>
    </Title>
  );

  return (
    <>
      <Title order={1} fw={600} m={0} size="h2">
        Clean Start
        <Text component="span" fw={200} ml="xs" size="xs">
          v{version}
        </Text>
      </Title>
      <Tooltip label="Source code available on GitHub" position="right" withArrow>
        <Anchor
          c="white"
          href="https://github.com/mikesprague/clean-start"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Text component="span" fw={300} mb="xs" size="md">
          Open Source New Tab Extension
          </Text>
        </Anchor>
      </Tooltip>
      {isExtension ? '' : installLinks}
    </>
  );
};

export default TitleAndLinks;
