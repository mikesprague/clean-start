import React, { useEffect, useState } from 'react';
import Tippy from '@tippyjs/react';
import axios from 'axios';
import dayjs from 'dayjs';
import dompurify from 'dompurify';
import he from 'he';

import { apiUrl, stripHTML } from '../modules/helpers';
import { useLocalStorage } from '../hooks/useLocalStorage';

import './Quote.scss';

export const Quote = () => {
  const [allQuotesData, setAllQuotesData] = useLocalStorage('quoteData', null);

  useEffect(() => {
    const loadQuoteData = async () => {
      const designQuoteData = await axios
        .get(`${apiUrl()}/quotes`)
        .then((response) => response.data);

      setAllQuotesData({
        lastUpdated: dayjs().toString(),
        data: designQuoteData,
      });
    };

    if (allQuotesData && allQuotesData.lastUpdated) {
      const nextUpdateTime = dayjs(allQuotesData.lastUpdated).add(
        120,
        'minute',
      );

      if (dayjs().isAfter(nextUpdateTime)) {
        loadQuoteData();
      }
    } else {
      loadQuoteData();
    }

    return () => {};
  }, [allQuotesData, setAllQuotesData]);

  const [quoteData, setQuoteData] = useState(null);

  useEffect(() => {
    if (allQuotesData && allQuotesData.data) {
      const randomNumber = Math.floor(
        Math.random() * (allQuotesData.data.length - 1),
      );
      let quote = allQuotesData.data[randomNumber];

      quote = {
        ...quote,
        quoteAuthor: stripHTML(
          he.decode(dompurify.sanitize(quote.quoteAuthor)),
        ),
        quoteExcerpt: stripHTML(
          he.decode(dompurify.sanitize(quote.quoteExcerpt)),
        ),
      };
      setQuoteData(quote);
    }

    return () => {};
  }, [allQuotesData]);

  return (
    <div className="quote-container">
      <Tippy content="Quotes provided by ZenQuotes API" placement="bottom">
      <p className={quoteData ? 'px-4 visible' : 'px-4 invisible'}>
      <a
          href="https://zenquotes.io/"
          target="_blank"
          rel="noopener noreferrer"
        >
        {quoteData ? quoteData.quoteExcerpt : ''}
        <br />
        <em>&mdash; {quoteData ? quoteData.quoteAuthor : ''}</em>
        </a>
      </p>
      </Tippy>
    </div>
  );
};

export default Quote;
