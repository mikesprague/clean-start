import React, { lazy } from 'react';

import { initIcons } from '../modules/helpers';

const BackgroundImage = lazy(() => import('./BackgroundImage'));
const Clock = lazy(() => import('./Clock'));
const ContentPopup = lazy(() => import('./ContentPopup'));
const Quote = lazy(() => import('./Quote'));
const TitleAndLinks = lazy(() => import('./TitleAndLinks'));
const Weather = lazy(() => import('./Weather'));

import './App.scss';

initIcons();

export const App = () => (
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
