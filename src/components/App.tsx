import React, { lazy } from 'react';

import { initIcons } from '../modules/helpers';

import './App.scss';

const BackgroundImage = lazy(() => import('./BackgroundImage'));
const Clock = lazy(() => import('./Clock'));
const ContentPopup = lazy(() => import('./ContentPopup'));
const Quote = lazy(() => import('./Quote'));
const TitleAndLinks = lazy(() => import('./TitleAndLinks'));
const Weather = lazy(() => import('./Weather'));

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
        <ContentPopup contentType="github" />
        <ContentPopup contentType="devTo" />
        <ContentPopup contentType="hackerNews" />
        <ContentPopup contentType="productHunt" />
        <ContentPopup contentType="reddit" />
      </div>
    </div>
  </>
);

export default App;
