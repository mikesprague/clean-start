import axios from 'axios';
import dompurify from 'dompurify';
import he from 'he';
import React, { useEffect, useState } from 'react';
import { apiUrl, stripHTML } from '../modules/helpers';
import './Quote.scss';

const Quote = (props) => {
  const [quoteData, setQuoteData] = useState(null);

  useEffect(() => {
    const loadQuoteData = async () => {
      const designQuoteData = await axios.get(`${apiUrl()}/quotes`)
        .then((response) => {
          // console.log(response.data);
          return response.data;
        });
      const randomNumber = Math.floor(Math.random() * (designQuoteData.length - 1))
      let quote = designQuoteData[randomNumber];
      quote = {
        ...quote,
        quoteAuthor: he.decode(dompurify.sanitize(quote.quoteAuthor)),
        quoteExcerpt: he.decode(dompurify.sanitize(quote.quoteExcerpt)),
      };
      setQuoteData(quote);
    };
    loadQuoteData();
    return () => {};
  }, []);

  return (
    <div className="quote-container">
      <a href={quoteData && quoteData.quoteLink} target="_blank" rel="noopener">
        <p className="px-4">
          {quoteData && stripHTML(quoteData.quoteExcerpt)}
        </p>
        <p className={quoteData ? 'quote-author visible' : 'quote-author invisible'}>
          &mdash; {quoteData && quoteData.quoteAuthor}
        </p>
      </a>
    </div>
  );
};

export default Quote;
