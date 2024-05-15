import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Tippy from '@tippyjs/react';
import { atom, useAtom } from 'jotai';
import React, { useEffect } from 'react';

import { version } from '../../package.json';

import './TitleAndLinks.scss';

const isExtensionAtom = atom(true);

export const TitleAndLinks = () => {
  const [isExtension, setIsExtension] = useAtom(isExtensionAtom);

  useEffect(() => {
    setIsExtension(window.location.origin.includes('-extension://'));

    return () => {};
  }, [setIsExtension]);

  const installLinks = (
    <h2 className="install-links">
      <Tippy content="Install via Chrome Store" placement="left">
        <a
          href="https://chrome.google.com/webstore/detail/mmnlbcjgkfloemcbbjhklbblhbcjhmol"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FontAwesomeIcon icon={['fab', 'chrome']} fixedWidth />
        </a>
      </Tippy>
    </h2>
  );

  return (
    <section>
      <h1 className="app-name">
        <span className="pwa-link-tooltip">Clean Start</span>
        <small className="ml-2 text-xs font-extralight">v{version}</small>
      </h1>
      <Tippy content="Source code available on GitHub" placement="left">
        <a
          className="source-link"
          href="https://github.com/mikesprague/clean-start"
          target="_blank"
          rel="noopener noreferrer"
        >
          Open Source New Tab Extension
        </a>
      </Tippy>
      {isExtension ? '' : installLinks}
    </section>
  );
};

export default TitleAndLinks;
