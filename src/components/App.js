import dompurify from 'dompurify';
import React, { useEffect }  from 'react';
import { hot } from 'react-hot-loader/root';
import { initIcons, initTooltips, isExtension } from '../modules/helpers';
import BackgroundImage from './BackgroundImage';
import Clock from './Clock';
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
    <div className="app-wrapper">
      <div className="flex px-3 py-2">
        <div className="w-1/2">
          <TitleAndLinks isPWA={!isExtension()} />
        </div>
        <div className="w-1/2">
          <Weather />
        </div>
      </div>
      <div className="flex min-h-full px-3">
        <div className="flex-auto w-full h-full">
          <Clock />
          <Quote />
        </div>
      </div>
      <div className="flex px-3 py-2 footer">
        <div className="flex-grow w-1/2">
          <BackgroundImage />
        </div>
        <div className="w-1/2 px-3 py-2">
          {/* <Popup type="" /> */}
        </div>
      </div>
    </div>
  );
};

export default hot(App);
