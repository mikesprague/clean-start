import React from 'react';

import { initIcons } from '../modules/helpers';

import BackgroundImage from './BackgroundImage';
import Clock from './Clock';
import ContentPopup from './ContentPopup';
import Quote from './Quote';
import TitleAndLinks from './TitleAndLinks';
import Weather from './Weather';

import './App.scss';

initIcons();

const App = () => (
  <>
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
  </>
);

export default App;
