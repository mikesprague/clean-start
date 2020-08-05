import axios from 'axios';
import dompurify from 'dompurify';
import he from 'he';
import React, { useEffect, useState } from 'react';

import { apiUrl, stripHTML } from '../modules/helpers';
import './Quote.scss';

const Quote = (props) => {
  const [allQuotesData, setAllQuotesData] = useState(null);
  useEffect(() => {
    const loadQuoteData = async () => {
      const designQuoteData = await axios.get(`${apiUrl()}/quotes`)
        .then((response) => {
          // console.log(response.data);
          return response.data;
        });
      setAllQuotesData(designQuoteData);
      // return designQuoteData;
    };
    loadQuoteData();
    return () => {};
  }, []);

  const [quoteData, setQuoteData] = useState(null);
  useEffect(() => {
    if (allQuotesData) {
      const randomNumber = Math.floor(Math.random() * (allQuotesData.length - 1))
      let quote = allQuotesData[randomNumber];
      quote = {
        ...quote,
        quoteAuthor: stripHTML(he.decode(dompurify.sanitize(quote.quoteAuthor))),
        quoteExcerpt: stripHTML(he.decode(dompurify.sanitize(quote.quoteExcerpt))),
      };
      setQuoteData(quote);
    }

    return () => {};
  }, [allQuotesData]);

  return (
    <div className="quote-container">
      <a href={quoteData ? quoteData.quoteLink : ''} target="_blank" rel="noopener">
        <p className={quoteData ? 'px-4 visible' : 'px-4 invisible'}>
          {quoteData ? quoteData.quoteExcerpt : ''}
          <br />
          <em>&mdash; {quoteData ? quoteData.quoteAuthor : ''}</em>
        </p>
      </a>
    </div>
  );
};

export default Quote;
