import dompurify from 'dompurify';
import React, { Fragment, useEffect }  from 'react';
import { hot } from 'react-hot-loader/root';
import { initIcons, initTooltips, isExtension } from '../modules/helpers';
import BackgroundImage from './BackgroundImage';
import Clock from './Clock';
import ContentPopup from './ContentPopup';
import Quote from './Quote';
import TitleAndLinks from './TitleAndLinks';
import Weather from './Weather';
import './App.scss';

initIcons();

const App = (props) => {
  useEffect(() => {
    initTooltips();
    return () => {};
  }, []);

  return (
    <Fragment>
      <div className="header">
        <div className="w-1/2">
          <TitleAndLinks isPWA={!isExtension()} />
        </div>
        <div className="w-1/2">
          <Weather />
        </div>
      </div>
      <div className="flex px-3">
        <div className="flex-auto w-full h-full">
          <Clock />
          <Quote />
        </div>
      </div>
      <div className="footer">
        <div className="flex-grow w-1/2">
          <BackgroundImage />
        </div>
        <div className="w-1/2 text-right">
          {/* dev-to|github|hacker-news|product-hunt|reddit */}
          <ContentPopup type="github" tooltip="GitHub Trending Repositories" />
          <ContentPopup type="dev-to" tooltip="Dev.to Recent Posts" />
          <ContentPopup type="hacker-news" tooltip="Hacker News Recent Posts" />
          <ContentPopup type="product-hunt" tooltip="Product Hunt Recent Posts" />
          <ContentPopup type="reddit" tooltip="Reddit Popular Posts" />
        </div>
      </div>
    </Fragment>
  );
};

export default hot(App);
