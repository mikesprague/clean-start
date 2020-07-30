import React, { Fragment, useEffect }  from 'react';
import { hot } from 'react-hot-loader/root';
import BackgroundImage from './BackgroundImage';
import Clock from './Clock';
import ContentPopup from './ContentPopup';
import Quote from './Quote';
import TitleAndLinks from './TitleAndLinks';
import Weather from './Weather';
import { initIcons } from '../modules/helpers';
import './App.scss';

initIcons();

const App = (props) => {
  return (
    <Fragment>
      <div className="header">
        <div className="w-1/2">
          <TitleAndLinks />
        </div>
        <div className="w-1/2">
          <Weather />
        </div>
      </div>
      <div className="content">
        <div className="flex-auto w-full">
          <Clock />
          <Quote />
        </div>
      </div>
      <div className="footer">
        <div className="w-1/2">
          <BackgroundImage />
        </div>
        <div className="w-1/2 text-right">
          <ContentPopup type="github" />
          <ContentPopup type="dev-to" />
          <ContentPopup type="hacker-news" />
          <ContentPopup type="product-hunt" />
          <ContentPopup type="reddit" />
        </div>
      </div>
    </Fragment>
  );
};

export default hot(App);
