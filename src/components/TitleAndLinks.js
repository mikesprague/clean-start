import { library, dom } from '@fortawesome/fontawesome-svg-core';
import {
  faChrome,
  faEdge,
  faFirefoxBrowser,
  faGithub,
} from '@fortawesome/free-brands-svg-icons';
import {
  faCode,
} from '@fortawesome/free-solid-svg-icons';
import React, { useEffect } from 'react';
import tippy from 'tippy.js';
import { initTooltips, isExtension } from '../modules/helpers';
import './TitleAndLinks.scss';

const TitleAndLinks = (props) => {
  const sourceCodeTooltip = `
    <a href="https://github.com/mikesprague/clean-start" target="_blank" rel="noopener">
      <i class="fas fa-fw fa-code"></i>
      Source code available on GitHub
      <i class="fab fa-fw fa-github"></i>
    </a>
  `;

  useEffect(() => {
    const initIcons = () => {
      library.add(
        faCode,
        faChrome,
        faEdge,
        faFirefoxBrowser,
        faGithub,
      );
      dom.watch();
    };

    initIcons();
    initTooltips();
    return () => {};
  }, []);

  const installLinks = (
    <h2 className="install-links">
      <a href="https://chrome.google.com/webstore/detail/mmnlbcjgkfloemcbbjhklbblhbcjhmol" data-tippy-content="Install via Chrome Store" target="_blank" rel="noopener"><i className='fab fa-fw fa-chrome'></i></a>
      <a href="https://addons.mozilla.org/en-US/firefox/addon/clean-start/" target="_blank" data-tippy-content="Install via Firefox Add-ons" rel="noopener"><i className='fab fa-fw fa-firefox-browser'></i></a>
      <a href="https://microsoftedge.microsoft.com/addons/detail/clean-start/aifahnhgmoaeckhcdnhdnoamjnkeppjf" target="_blank" data-tippy-content="Install via Edge Add-ons" rel="noopener"><i className='fab fa-fw fa-edge'></i></a>
    </h2>
  );

  return (
    <section>
      <h1 className="text-3xl app-name"><span className="pwa-link-tooltip">Clean Start (React/Tailwind CSS refactor)</span></h1>
      <span className="text-base source-link-container">
        <a className="source-link" href="https://github.com/mikesprague/clean-start" target="_blank" rel="noopener" data-tippy-content={sourceCodeTooltip}>Open Source New Tab Extension</a>
      </span>
      {props.isPWA ? installLinks : ''}
    </section>
  )
};

export default TitleAndLinks;
