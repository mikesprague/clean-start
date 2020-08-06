import React, { Fragment, useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Tippy from '@tippyjs/react';
import './TitleAndLinks.scss';

const TitleAndLinks = (props) => {
  const [isExtension, setIsExtension] = useState(true);

  useEffect(() => {
    setIsExtension(window.location.origin.includes('-extension://'));

    return () => {};
  }, []);

  const installLinks = (
    <h2 className="install-links">
      <Tippy content="Install via Chrome Store" placement="left">
        <a href="https://chrome.google.com/webstore/detail/mmnlbcjgkfloemcbbjhklbblhbcjhmol" target="_blank" rel="noopener">
          <FontAwesomeIcon icon={["fab", "chrome"]} fixedWidth />
        </a>
      </Tippy>
      <Tippy content="Install via Firefox Add-ons" placement="left">
        <a href="https://addons.mozilla.org/en-US/firefox/addon/clean-start/" target="_blank" rel="noopener">
          <FontAwesomeIcon icon={["fab", "firefox-browser"]} fixedWidth />
        </a>
      </Tippy>
      <Tippy content="Install via Edge Add-ons" placement="left">
        <a href="https://microsoftedge.microsoft.com/addons/detail/clean-start/aifahnhgmoaeckhcdnhdnoamjnkeppjf" target="_blank" rel="noopener">
          <FontAwesomeIcon icon={["fab", "edge"]} fixedWidth />
        </a>
      </Tippy>
    </h2>
  );

  return (
    <section>
      <h1 className="app-name"><span className="pwa-link-tooltip">Clean Start</span></h1>
      <Tippy content="Source code available on GitHub" placement="left">
        <a className="source-link" href="https://github.com/mikesprague/clean-start" target="_blank" rel="noopener">Open Source New Tab Extension</a>
      </Tippy>
      {isExtension ? '' : installLinks}
    </section>
  )
};

export default TitleAndLinks;
