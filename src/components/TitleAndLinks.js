import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { Fragment } from 'react';
import tippy from 'tippy.js';
import { isExtension } from '../modules/helpers';
import './TitleAndLinks.scss';

const TitleAndLinks = (props) => {
  const installLinks = (
    <h2 className="install-links">
      <a href="https://chrome.google.com/webstore/detail/mmnlbcjgkfloemcbbjhklbblhbcjhmol" data-tippy-content="Install via Chrome Store" target="_blank" rel="noopener">
        <FontAwesomeIcon icon={["fab", "chrome"]} fixedWidth />
      </a>
      <a href="https://addons.mozilla.org/en-US/firefox/addon/clean-start/" target="_blank" data-tippy-content="Install via Firefox Add-ons" rel="noopener">
        <FontAwesomeIcon icon={["fab", "firefox-browser"]} fixedWidth />
      </a>
      <a href="https://microsoftedge.microsoft.com/addons/detail/clean-start/aifahnhgmoaeckhcdnhdnoamjnkeppjf" target="_blank" data-tippy-content="Install via Edge Add-ons" rel="noopener">
        <FontAwesomeIcon icon={["fab", "edge"]} fixedWidth />
      </a>
    </h2>
  );

  return (
    <Fragment>
      <h1 className="app-name"><span className="pwa-link-tooltip">Clean Start (React/Tailwind CSS refactor)</span></h1>
      <span className="source-link-container">
        <a className="source-link" href="https://github.com/mikesprague/clean-start" target="_blank" rel="noopener" data-tippy-content="Source code available on GitHub">Open Source New Tab Extension</a>
      </span>
      {props.isExtension ? '' : installLinks}
    </Fragment>
  )
};

export default TitleAndLinks;
